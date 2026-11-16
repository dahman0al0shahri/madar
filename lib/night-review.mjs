import BASE from './night-review-content.json' with {type:'json'};
import {isActivityAdmin} from './activity.mjs';
import {questionFingerprint} from './quality.mjs';
import {NIGHT_PRODUCT,HEADERS,nightAccess} from './private-review-access.mjs';
export {NIGHT_PRODUCT,HEADERS,nightAccess};
export const NIGHT_LESSON='night-review';
const json=(v,status=200)=>Response.json(v,{status,headers:HEADERS});
const uuid=v=>typeof v==='string'&&/^[0-9a-f-]{36}$/i.test(v);

export async function nightContent(db){
 const row=await db.prepare('SELECT draft,revision,published_id FROM content_workspace WHERE id=4').first();
 return {data:row?JSON.parse(row.draft):structuredClone(BASE),revision:row?.revision||0};
}
export async function nightState(db,user){
 const row=await db.prepare('SELECT snapshot,revision,request_id,updated_at FROM worksheet_saves WHERE user_id=? AND lesson=?').bind(user.userId,NIGHT_LESSON).first();
 return {state:row?JSON.parse(row.snapshot):{session:null,history:[],bookmarks:[],notes:{},lastAnswers:{}},revision:row?.revision||0,requestId:row?.request_id,updatedAt:row?.updated_at||null};
}
async function body(req){
 if(req.headers.get('origin')!==new URL(req.url).origin||req.headers.get('sec-fetch-site')==='cross-site')throw 403;
 if(!req.headers.get('content-type')?.startsWith('application/json'))throw 415;
 const reader=req.body?.getReader();if(!reader)throw 400;let n=0,raw='',dec=new TextDecoder();
 while(true){const {done,value}=await reader.read();if(done)break;n+=value.length;if(n>40000){await reader.cancel();throw 413;}raw+=dec.decode(value,{stream:true});}try{return JSON.parse(raw+dec.decode());}catch{throw 400;}
}
export function interleave(questions,random=Math.random){
 const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
 const a=shuffle(questions.filter(q=>q.origin==='source')),b=shuffle(questions.filter(q=>q.origin==='extension'));
 if(!b.length)return a.map(q=>q.id);
 const total=a.length+b.length,phase=random(),slots=new Set(b.map((_,i)=>Math.floor((i+phase)*total/b.length)));
 return Array.from({length:total},(_,i)=>(slots.has(i)?b.shift():a.shift()).id);
}
export function optionOrders(questions,random=Math.random){
 return Object.fromEntries(questions.map(q=>{const order=q.options.map((_,i)=>i);for(let i=order.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}return [q.id,order];}));
}
export const publicQuestion=({origin,sourceNumber,sourceNote,...q})=>({...q,scene:origin==='source'?'crimson':'ember'});
const activeQuestions=d=>d.questions.filter(q=>!q.paused);
export async function nightReview(req,db,user){
 if(!await nightAccess(db,user))return json({error:'not_found'},404);if(!db)return json({error:'unavailable'},503);
 const c=await nightContent(db),saved=await nightState(db,user),d=c.data,qs=activeQuestions(d),map=new Map(qs.map(q=>[q.id,q]));
 const response=()=>json({owner:user.userId,content:{...d,questions:d.questions.map(publicQuestion)},contentRevision:c.revision,...saved});
 if(req.method==='GET')return response();if(req.method!=='POST')return json({error:'method'},405);
 let b;try{b=await body(req);}catch(e){return json({error:'request'},Number(e)||400);}
 if(!b||b.owner!==user.userId||!uuid(b.requestId)||!Number.isInteger(b.revision))return json({error:'identity_or_request'},400);
 if(saved.requestId===b.requestId)return response();
 if(saved.revision!==b.revision)return json({error:'conflict'},409);
 if(b.bankVersion!==d.bankVersion)return json({error:'content_changed'},409);
 const s=structuredClone(saved.state),now=new Date().toISOString();let metrics=null;
 if(b.action==='start'){
  if(!['exam','review','mistakes','saved'].includes(b.mode))return json({error:'mode'},400);
  let pool=qs;if(b.mode==='mistakes')pool=qs.filter(q=>s.lastAnswers[q.id]?.correct===false);if(b.mode==='saved')pool=qs.filter(q=>s.bookmarks.includes(q.id));
  if(!pool.length)return json({error:'empty'},400);
  if(s.session&&!s.session.finished&&b.replace!==true)return json({error:'session_exists'},409);
  s.session={id:crypto.randomUUID(),bankVersion:d.bankVersion,mode:b.mode,ids:interleave(pool),optionOrders:optionOrders(pool),answers:{},index:0,finished:false,startedAt:now};
 }else if(b.action==='bookmark'){
  if(!map.has(b.question)||typeof b.value!=='boolean')return json({error:'question'},400);
  s.bookmarks=s.bookmarks.filter(id=>id!==b.question);if(b.value)s.bookmarks.push(b.question);
 }else if(b.action==='note'){
  if(!map.has(b.question)||typeof b.note!=='string'||b.note.length>3000)return json({error:'note'},400);s.notes[b.question]=b.note;
 }else if(b.action==='report'){
  const q=map.get(b.question);if(!q||typeof b.message!=='string'||b.message.trim().length<5||b.message.length>2000)return json({error:'report'},400);
  const rate=await db.prepare('INSERT INTO feedback_limits(key,count,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count').bind('night-report:'+user.userId+':'+Math.floor(Date.now()/3600000),Date.now()+7200000).first();if(rate.count>15)return json({error:'rate_limit'},429);
  await db.prepare("INSERT OR IGNORE INTO feedback_entries(id,request_id,payload_hash,actor_kind,actor_id,actor_name,kind,category,target_type,target_id,target_title,snapshot,bank_version,message,rating,status,owner_note,revision,created_at,updated_at) VALUES(?,?,?,'account',?,?,'report','question','question',?,?,?,?,?,NULL,'new','',1,?,?)").bind(crypto.randomUUID(),b.requestId,b.requestId,user.userId,user.displayName||'حساب',q.id,'المراجعة الخاصة · '+q.title,JSON.stringify(publicQuestion(q)),d.bankVersion,b.message.trim(),Date.now(),Date.now()).run();
  return json({reported:true});
 }else{
  const run=s.session;if(!run||run.bankVersion!==d.bankVersion||run.ids.some(id=>!map.has(id)))return json({error:'session_changed'},409);
  if(b.action==='navigate'){if(!Number.isInteger(b.index)||b.index<0||b.index>=run.ids.length)return json({error:'index'},400);run.index=b.index;}
  else if(b.action==='answer'){
   const q=map.get(run.ids[run.index]);if(run.finished||b.question!==q.id||!Number.isInteger(b.answer)||b.answer<0||b.answer>=q.options.length)return json({error:'answer'},400);
   if(run.answers[q.id]!==undefined)return json({error:'already_answered'},409);
   run.answers[q.id]=b.answer;if(run.mode!=='exam')s.lastAnswers[q.id]={answer:b.answer,correct:b.answer===q.answer,bankVersion:d.bankVersion,at:now};metrics={q,answer:b.answer,run};
  }else if(b.action==='finish'){
   if(run.finished)return response();if(run.ids.some(id=>run.answers[id]===undefined))return json({error:'unanswered'},400);
   for(const id of run.ids)s.lastAnswers[id]={answer:run.answers[id],correct:run.answers[id]===map.get(id).answer,bankVersion:d.bankVersion,at:now};run.finished=true;run.finishedAt=now;run.score=run.ids.filter(id=>run.answers[id]===map.get(id).answer).length;
   s.history.unshift({...run,items:run.ids.map(id=>({...publicQuestion(map.get(id)),chosen:run.answers[id]}))});s.history=s.history.slice(0,20);
  }else return json({error:'action'},400);
 }
 const statement=saved.revision===0?db.prepare('INSERT INTO worksheet_saves(user_id,lesson,snapshot,revision,request_id,updated_at) VALUES(?,?,?,1,?,?) ON CONFLICT(user_id,lesson) DO NOTHING').bind(user.userId,NIGHT_LESSON,JSON.stringify(s),b.requestId,now):db.prepare('UPDATE worksheet_saves SET snapshot=?,revision=revision+1,request_id=?,updated_at=? WHERE user_id=? AND lesson=? AND revision=?').bind(JSON.stringify(s),b.requestId,now,user.userId,NIGHT_LESSON,saved.revision);
 const result=await statement.run();if(result.meta.changes!==1)return json({error:'conflict'},409);
 // The canonical session is saved first. Analytics cannot invalidate a saved answer.
 try{
  if(metrics&&!isActivityAdmin(user)){const {q,answer,run}=metrics;await db.prepare('INSERT OR IGNORE INTO question_responses(actor_kind,actor_id,session_id,question,fingerprint,bank_version,mode,answer,correct,received_at) VALUES(?,?,?,?,?,?,?,?,?,?)').bind('account',user.userId,run.id,q.id,await questionFingerprint(q),d.bankVersion,run.mode==='exam'?'exam':'practice',answer,answer===q.answer?1:0,Date.now()).run();}
  const type={start:'quiz_start',answer:'quiz_answer',finish:'quiz_finish',bookmark:b.value?'bookmark_add':'bookmark_remove',note:'note_save',navigate:'quiz_next'}[b.action];
  await db.prepare('INSERT OR IGNORE INTO activity_events(event_id,actor_kind,actor_id,actor_name,event_type,page,lesson,question,value,client_at,received_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)').bind('night:'+b.requestId,'account',user.userId,user.displayName||'حساب',type,'night',NIGHT_LESSON,b.question||null,null,now,Date.now()).run();
 }catch{console.error('night_review_analytics_unavailable');}
 return json({owner:user.userId,state:s,revision:saved.revision+1,updatedAt:now});
}
export async function nightAdmin(req,db,user){
 if(!isActivityAdmin(user))return json({error:'not_found'},404);if(!db)return json({error:'unavailable'},503);
 const c=await nightContent(db);
 if(req.method==='GET'){
  const stats=(await db.prepare("SELECT question,COUNT(DISTINCT actor_id) learners,COUNT(*) attempts,SUM(1-correct) wrong FROM question_responses WHERE bank_version=? AND received_at>=? GROUP BY question").bind(c.data.bankVersion,Date.now()-90*86400000).all()).results;
  const versions=(await db.prepare("SELECT id,label,created_at FROM content_versions WHERE id LIKE 'night-version-%' ORDER BY created_at DESC LIMIT 20").all()).results;
  return json({owner:user.userId,...c,data:{...c.data,questions:c.data.questions.map(publicQuestion)},stats,versions});
 }
 let b;try{b=await body(req);}catch(e){return json({error:'request'},Number(e)||400);}
 if(b?.owner!==user.userId||b.revision!==c.revision)return json({error:'conflict'},409);
 let data=structuredClone(c.data);
 if(b.action==='restore'){
  if(!/^night-version-[0-9a-f-]{36}$/.test(b.id||''))return json({error:'version'},400);
  const r=await db.prepare('SELECT payload FROM content_versions WHERE id=?').bind(b.id).first();if(!r)return json({error:'version'},404);data=JSON.parse(r.payload);
 }else if(b.action==='update'){
  const q=data.questions.find(q=>q.id===b.question),x=b.item;if(!q||!x||typeof x.prompt!=='string'||x.prompt.length<8||x.prompt.length>2000||!Array.isArray(x.options)||x.options.length!==q.options.length||x.options.some(t=>typeof t!=='string'||!t.trim()||t.length>1000)||!Number.isInteger(x.answer)||x.answer<0||x.answer>=x.options.length||typeof x.explanation!=='string'||x.explanation.length<10||x.explanation.length>4000||typeof x.paused!=='boolean')return json({error:'question'},400);
  Object.assign(q,{prompt:x.prompt.trim(),options:x.options.map(t=>t.trim()),answer:x.answer,explanation:x.explanation.trim(),paused:x.paused});
 }else return json({error:'action'},400);
 data.bankVersion='night-review-'+crypto.randomUUID();const id='night-version-'+crypto.randomUUID(),now=new Date().toISOString();
 await db.prepare('INSERT OR IGNORE INTO content_workspace(id,draft,revision,published_id,updated_at) VALUES(4,?,0,NULL,?)').bind(JSON.stringify(BASE),now).run();
 const before='night-version-'+crypto.randomUUID();
 const result=await db.batch([
  db.prepare('INSERT INTO content_versions(id,payload,label,created_at,actor) SELECT ?,?,?,?,? WHERE EXISTS(SELECT 1 FROM content_workspace WHERE id=4 AND revision=?)').bind(before,JSON.stringify(c.data),'قبل التعديل',now,user.userId,b.revision),
  db.prepare('INSERT INTO content_versions(id,payload,label,created_at,actor) SELECT ?,?,?,?,? WHERE EXISTS(SELECT 1 FROM content_workspace WHERE id=4 AND revision=?)').bind(id,JSON.stringify(data),b.action==='restore'?'استرجاع':'تعديل مراجعة ما قبل الاختبار',now,user.userId,b.revision),
  db.prepare('UPDATE content_workspace SET draft=?,revision=revision+1,published_id=?,updated_at=? WHERE id=4 AND revision=?').bind(JSON.stringify(data),id,now,b.revision)
 ]);
 return result[2].meta.changes===1?json({saved:true,revision:b.revision+1}):json({error:'conflict'},409);
}
