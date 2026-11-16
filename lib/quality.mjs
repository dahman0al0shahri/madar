import {courseFrom,courseOf,COURSES} from './course-base.mjs';
import {bankFor} from './course-catalog.mjs';
import {isActivityAdmin,actorFor,RETENTION_DAYS} from './activity.mjs';
import {BASE,readContent,contentRequest,questionId} from './content-store.mjs';
const json=(v,status=200)=>Response.json(v,{status,headers:{'Cache-Control':'private, no-store','Vary':'Cookie','X-Content-Type-Options':'nosniff'}});
const uuid=v=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
const int=(v,min,max)=>Number.isInteger(v)&&v>=min&&v<=max;
const keys=(v,allowed)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).every(k=>allowed.includes(k));
const hash=async v=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(v))),b=>b.toString(16).padStart(2,'0')).join('');
export const questionFingerprint=q=>hash(JSON.stringify([q.id,q.lesson,q.unit,q.prompt,q.options,q.answer,q.explanation,q.rationales,q.source]));
async function bodyJSON(req){
 if(req.headers.get('origin')!==new URL(req.url).origin||req.headers.get('sec-fetch-site')==='cross-site')return {error:json({error:'origin'},403)};
 if(!req.headers.get('content-type')?.startsWith('application/json'))return {error:json({error:'content_type'},415)};
 const reader=req.body?.getReader();if(!reader)return {error:json({error:'body'},400)};let n=0,raw='';const dec=new TextDecoder();while(true){const {value,done}=await reader.read();if(done)break;n+=value.length;if(n>16000){await reader.cancel();return {error:json({error:'too_large'},413)}}raw+=dec.decode(value,{stream:true});}raw+=dec.decode();try{return {body:JSON.parse(raw)}}catch{return {error:json({error:'body'},400)}}
}
async function prune(db){await db.prepare('DELETE FROM question_responses WHERE received_at < ?').bind(Date.now()-RETENTION_DAYS*86400000).run();}
export async function recordResponses(req,db,user){
 if(!db)return json({error:'unavailable'},503);if(!COURSES.includes(courseFrom(req)))return json({error:'subject'},400);const parsed=await bodyJSON(req);if(parsed.error)return parsed.error;const b=parsed.body,actor=actorFor(req,user);
 if(!actor.id||b?.actor!==`${actor.kind}:${actor.id}`)return json({error:'identity_changed'},409);
 if(!keys(b,['actor','sessionId','bankVersion','mode','responses'])||!uuid(b.sessionId)||typeof b.bankVersion!=='string'||b.bankVersion.length>80||!['exam','practice'].includes(b.mode)||!Array.isArray(b.responses)||b.responses.length<1||b.responses.length>20||new Set(b.responses.map(x=>x?.question)).size!==b.responses.length||b.responses.some(x=>!keys(x,['question','answer'])||!questionId(x.question)||!int(x.answer,0,3)))return json({error:'invalid'},400);
 if(isActivityAdmin(user))return json({accepted:0,excluded:'owner'});
 const bank=await bankFor(db,b.bankVersion);if(!bank)return json({error:'unknown_bank'},409);
 const qs=b.responses.map(x=>bank.questions.find(q=>q.id===x.question));if(qs.some(q=>!q||q.paused))return json({error:'question'},400);
 const now=Date.now(),hour=Math.floor(now/3600000),network=req.headers.get('cf-connecting-ip')||'unknown';
 for(const key of ['quality-actor:'+await hash(b.actor)+':'+hour,'quality-network:'+await hash(hour+':'+network)]){const r=await db.prepare('INSERT INTO activity_limits(key,count,expires_at) VALUES(?,?,?) ON CONFLICT(key) DO UPDATE SET count=count+excluded.count RETURNING count').bind(key,b.responses.length,now+7200000).first();if(r.count>3000)return json({error:'rate_limit'},429);}
 await prune(db);await db.prepare('DELETE FROM activity_limits WHERE expires_at < ?').bind(now).run();
 const statements=[];for(let i=0;i<b.responses.length;i++){const x=b.responses[i],q=qs[i];statements.push(db.prepare('INSERT OR IGNORE INTO question_responses(actor_kind,actor_id,session_id,question,fingerprint,bank_version,mode,answer,correct,received_at) VALUES(?,?,?,?,?,?,?,?,?,?)').bind(actor.kind,actor.id,b.sessionId,q.id,await questionFingerprint(q),b.bankVersion,b.mode,x.answer,x.answer===q.answer?1:0,now));}
 const result=await db.batch(statements);return json({accepted:result.reduce((s,r)=>s+r.meta.changes,0)});
}
export async function readQuality(req,db,user){
 if(!isActivityAdmin(user))return json({error:'forbidden'},user?403:401);if(!db)return json({error:'unavailable'},503);
 const u=new URL(req.url),days=Number(u.searchParams.get('days')||30),mode=u.searchParams.get('mode')||'exam',kind=u.searchParams.get('kind')||'all';
 if(![7,30,90].includes(days)||!['exam','practice'].includes(mode)||!['all','account','guest'].includes(kind))return json({error:'filter'},400);
 await prune(db);const published=await readContent(db,false,courseFrom(req)),draft=await readContent(db,true,courseFrom(req));const clauses=['received_at>=?','mode=?'],args=[Date.now()-days*86400000,mode];if(kind!=='all'){clauses.push('actor_kind=?');args.push(kind);}
 const stats=(await db.prepare(`WITH ranked AS (SELECT *,ROW_NUMBER() OVER(PARTITION BY actor_kind,actor_id,question,fingerprint ORDER BY id) rn FROM question_responses WHERE ${clauses.join(' AND ')}) SELECT question,fingerprint,COUNT(*) attempts,SUM(rn=1) n,SUM(CASE WHEN rn=1 THEN 1-correct ELSE 0 END) wrong,SUM(rn=1 AND actor_kind='account') accounts,SUM(rn=1 AND actor_kind='guest') guests,SUM(rn=1 AND answer=0) a0,SUM(rn=1 AND answer=1) a1,SUM(rn=1 AND answer=2) a2,SUM(rn=1 AND answer=3) a3 FROM ranked GROUP BY question,fingerprint`).bind(...args).all()).results;
 const reviews=(await db.prepare('SELECT question,fingerprint,status,note,checklist,revision,updated_at FROM question_reviews').all()).results;
 const items=[];for(const q of published.data.questions){const fp=await questionFingerprint(q),s=stats.find(s=>s.question===q.id&&s.fingerprint===fp),r=reviews.find(r=>r.question===q.id&&r.fingerprint===fp),d=draft.data.questions.find(x=>x.id===q.id);items.push({question:q,fingerprint:fp,metrics:s?{attempts:s.attempts,n:s.n,wrong:s.wrong,accounts:s.accounts,guests:s.guests,choices:[s.a0,s.a1,s.a2,s.a3]}:{attempts:0,n:0,wrong:0,accounts:0,guests:0,choices:[0,0,0,0]},review:r?{...r,checklist:JSON.parse(r.checklist)}:{status:'unreviewed',note:'',checklist:[false,false,false,false],revision:0},draftPaused:!!d?.paused,pausePending:!!d?.paused!==!!q.paused});}
 return json({items,unitNames:published.data.unitNames,lessons:published.data.lessons.map(l=>({id:l.id,title:l.title})),days,mode,kind,draftRevision:draft.revision,owner:user.userId,retentionDays:RETENTION_DAYS,measuredSince:(await db.prepare('SELECT MIN(received_at) at FROM question_responses').first())?.at||null});
}
export async function manageQuality(req,db,user){
 if(!isActivityAdmin(user))return json({error:'forbidden'},user?403:401);if(!db)return json({error:'unavailable'},503);
 const parsed=await bodyJSON(req);if(parsed.error)return parsed.error;const b=parsed.body;
 if(!keys(b,['action','question','fingerprint','owner','revision','note','checklist','status','paused'])||b.owner!==user.userId||!questionId(b.question)||!int(b.revision,0,2147483646))return json({error:'invalid'},400);
 const live=await readContent(db,false,courseFrom(req)),q=live.data.questions.find(x=>x.id===b.question);if(!q||await questionFingerprint(q)!==b.fingerprint)return json({error:'content_changed'},409);
 if(b.action==='pause'){
  if(typeof b.paused!=='boolean')return json({error:'invalid'},400);const draft=await readContent(db,true,courseFrom(req));if(draft.revision!==b.revision)return json({error:'conflict'},409);const target=draft.data.questions.find(x=>x.id===b.question);if(!target)return json({error:'content_changed'},409);target.paused=b.paused;
  return contentRequest(new Request(req.url,{method:'POST',headers:req.headers,body:JSON.stringify({action:'save',data:draft.data,revision:b.revision,owner:b.owner})}),db,user);
 }
 if(b.action!=='review'||!['needs_review','reviewed'].includes(b.status)||typeof b.note!=='string'||b.note.length>2000||!Array.isArray(b.checklist)||b.checklist.length!==4||b.checklist.some(x=>typeof x!=='boolean')||(b.status==='reviewed'&&!b.checklist.every(Boolean)))return json({error:'checklist'},400);
 const now=new Date().toISOString(),checklist=JSON.stringify(b.checklist),result=b.revision===0?await db.prepare('INSERT INTO question_reviews(question,fingerprint,status,note,checklist,revision,updated_at,actor) VALUES(?,?,?,?,?,1,?,?) ON CONFLICT(question,fingerprint) DO NOTHING').bind(q.id,b.fingerprint,b.status,b.note,checklist,now,user.userId).run():await db.prepare('UPDATE question_reviews SET status=?,note=?,checklist=?,revision=revision+1,updated_at=?,actor=? WHERE question=? AND fingerprint=? AND revision=?').bind(b.status,b.note,checklist,now,user.userId,q.id,b.fingerprint,b.revision).run();
 if(result.meta.changes!==1)return json({error:'conflict'},409);return json({revision:b.revision+1});
}
