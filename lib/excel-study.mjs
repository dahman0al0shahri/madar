import {excelBankCompatible} from '../public/excel-bank-compat.mjs';
import {accessBankCompatible} from '../public/access-bank-compat.mjs';
import {readContent} from './content-store.mjs';
import {accessFor,privateHeaders} from './office-access.mjs';
import content from './office-content.json' with {type:'json'};

const json=(v,status=200)=>Response.json(v,{status,headers:privateHeaders});
export async function excelStudy(req,db,user,subject="Excel"){
 if(!['Excel','Access'].includes(subject))return json({error:'subject'},400);
 if(!user)return json({error:'sign_in_required'},401);
 if(!db)return json({error:'unavailable'},503);
 if(!(await accessFor(db,user)).allowed)return json({error:'activation_required'},403);
 if(req.method==='GET'){
  const result=await db.prepare("SELECT event_id,kind,lesson,payload,created_at FROM excel_study_events WHERE rowid IN (SELECT MAX(rowid) FROM excel_study_events WHERE user_id=? AND lesson LIKE ? GROUP BY kind,CASE WHEN kind='attempt' THEN json_extract(payload,'$.question') ELSE lesson END) ORDER BY rowid DESC").bind(user.userId,subject.toLowerCase()+'-%').all();
  return json({owner:user.userId,events:result.results.map(r=>({...r,payload:JSON.parse(r.payload)}))});
 }
 const current=(await readContent(db,false,subject)).data,lessons=new Set(current.lessons.map(l=>l.id)),questions=new Map(current.questions.filter(q=>!q.paused).map(q=>[q.id,q]));
 if(req.method!=='POST')return json({error:'method'},405);
 if(req.headers.get('origin')!==new URL(req.url).origin||req.headers.get('sec-fetch-site')==='cross-site')return json({error:'origin'},403);
 if(!req.headers.get('content-type')?.startsWith('application/json'))return json({error:'json_required'},415);
 const reader=req.body?.getReader();if(!reader)return json({error:'body'},400);let raw='',size=0;const dec=new TextDecoder();
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>20000){await reader.cancel();return json({error:'too_large'},413);}raw+=dec.decode(value,{stream:true});}raw+=dec.decode();
 let b;try{b=JSON.parse(raw);}catch{return json({error:'body'},400);}
 if(!b||b.owner!==user.userId||typeof b.eventId!=='string'||!/^[0-9a-f-]{36}$/.test(b.eventId)||!lessons.has(b.lesson)||!['bookmark','attempt','review','training','session'].includes(b.kind))return json({error:'invalid'},400);
 let payload;
 if(b.kind==='training'){if(typeof b.result!=='boolean')return json({error:'result'},400);payload={result:b.result,source:'client_reported_simulation',mastery:false};if(subject==='Access'&&['guided','independent'].includes(b.mode)){payload.mode=b.mode;payload.hints=Math.min(999,Math.max(0,Number.isInteger(b.hints)?b.hints:0));}}
 if(b.kind==='session'){const x=b.session;if(!x||typeof x.sessionId!=='string'||!/^[0-9a-f-]{36}$/.test(x.sessionId)||!(x.bankVersion===current.bankVersion||subject==='Excel'&&excelBankCompatible(x.bankVersion,current.bankVersion,x.ids,[...questions.values()])||subject==='Access'&&accessBankCompatible(x.bankVersion,current.bankVersion,x.ids,[...questions.values()]))||!['practice','exam'].includes(x.mode)||!Array.isArray(x.ids)||x.ids.length<1||x.ids.length>1000||new Set(x.ids).size!==x.ids.length||x.ids.some(id=>!questions.has(id))||!Array.isArray(x.answers)||x.answers.length>x.ids.length||x.answers.some(a=>!Number.isInteger(a)||a<0||a>3)||typeof x.finished!=='boolean'||x.finished&&x.answers.length!==x.ids.length)return json({error:'session'},400);payload={sessionId:x.sessionId,bankVersion:current.bankVersion,mode:x.mode,ids:x.ids,answers:x.answers,finished:x.finished};}

 if(b.kind==='bookmark'){if(typeof b.value!=='boolean')return json({error:'value'},400);payload={value:b.value};}
 if(b.kind==='review'){if(!['tomorrow','three_days','clear'].includes(b.value))return json({error:'value'},400);payload={due:b.value==='clear'?null:new Date(Date.now()+(b.value==='tomorrow'?1:3)*86400000).toISOString()};}
 if(b.kind==='attempt'){
  const q=questions.get(b.question);if(!q||q.lesson!==b.lesson||!Number.isInteger(b.answer)||b.answer<0||b.answer>=q.options.length)return json({error:'answer'},400);
  if(b.mode!==undefined&&!['practice','exam'].includes(b.mode))return json({error:'mode'},400);
  payload={question:q.id,answer:b.answer,correct:b.answer===q.answer,mode:b.mode||'practice'};
 }
 const now=new Date().toISOString();
 await db.prepare('INSERT INTO excel_study_events(user_id,event_id,kind,lesson,payload,created_at) VALUES(?,?,?,?,?,?) ON CONFLICT(user_id,event_id) DO NOTHING').bind(user.userId,b.eventId,b.kind,b.lesson,JSON.stringify(payload),now).run();
 // Return the persisted event on an idempotent retry, never a new interpretation.
 const event=await db.prepare('SELECT event_id,kind,lesson,payload,created_at FROM excel_study_events WHERE user_id=? AND event_id=?').bind(user.userId,b.eventId).first();
 if(event.lesson!==b.lesson||event.kind!==b.kind)return json({error:'event_conflict'},409);
 return json({owner:user.userId,event:{...event,payload:JSON.parse(event.payload)}});
}
