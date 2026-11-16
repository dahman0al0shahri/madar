import {configFor,lessonPermitted,permitted} from './madar-state.mjs';
import {nightAccess} from './private-review-access.mjs';
import {bankFor} from './course-catalog.mjs';
import {actorFor,isActivityAdmin} from './activity.mjs';
import {BASE,readContent} from './content-store.mjs';
const json=(v,status=200)=>Response.json(v,{status,headers:{'Cache-Control':'private, no-store','Vary':'Cookie','X-Content-Type-Options':'nosniff'}});
const uuid=v=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
const keys=(v,ks)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).every(k=>ks.includes(k));
const hash=async v=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(v))),b=>b.toString(16).padStart(2,'0')).join('');
export const STATUSES={experience:['new','read','considered'],report:['new','in_progress','resolved']};
async function parse(req){
 if(req.headers.get('origin')!==new URL(req.url).origin||req.headers.get('sec-fetch-site')==='cross-site')return {error:json({error:'origin'},403)};
 if(!req.headers.get('content-type')?.startsWith('application/json'))return {error:json({error:'content_type'},415)};
 const r=req.body?.getReader();if(!r)return {error:json({error:'invalid'},400)};let n=0,s='',d=new TextDecoder();while(true){const {value,done}=await r.read();if(done)break;n+=value.length;if(n>16000){await r.cancel();return {error:json({error:'too_large'},413)}}s+=d.decode(value,{stream:true});}try{return {body:JSON.parse(s+d.decode())}}catch{return {error:json({error:'invalid'},400)}}
}
async function prune(db){await db.prepare('DELETE FROM feedback_entries WHERE created_at < ?').bind(Date.now()-90*86400000).run();}
export async function submitFeedback(req,db,user){
 if(!db)return json({error:'unavailable'},503);const p=await parse(req);if(p.error)return p.error;const b=p.body,a=actorFor(req,user);
 if(!a.id||b?.actor!==`${a.kind}:${a.id}`)return json({error:'identity_changed'},409);
 if(!keys(b,['actor','requestId','kind','category','targetType','targetId','bankVersion','message','rating','website'])||!uuid(b.requestId)||!Object.hasOwn(STATUSES,b.kind)||typeof b.message!=='string'||b.message.trim().length<3||b.message.length>3000||typeof b.bankVersion!=='string'||b.bankVersion.length>80||b.website!==''||!(b.rating===null||Number.isInteger(b.rating)&&b.rating>=1&&b.rating<=5))return json({error:'invalid'},400);
 if(b.kind==='experience'&&(b.category!=='experience'||b.targetType!=='general'||b.targetId!==null)||b.kind==='report'&&(b.rating!==null||!['question','content','video','technical'].includes(b.category)||!['general','lesson','question'].includes(b.targetType)||b.category==='question'&&b.targetType!=='question'||['content','video'].includes(b.category)&&b.targetType!=='lesson'||b.category==='technical'&&b.targetType!=='general'))return json({error:'invalid_target'},400);
 if(b.targetType==='general'?b.targetId!==null:typeof b.targetId!=='string'||b.targetId.length>50)return json({error:'invalid_target'},400);
 const payloadHash=await hash(JSON.stringify([b.kind,b.category,b.targetType,b.targetId,b.bankVersion,b.message.trim(),b.rating]));
 await prune(db);const old=await db.prepare('SELECT id,payload_hash FROM feedback_entries WHERE actor_kind=? AND actor_id=? AND request_id=?').bind(a.kind,a.id,b.requestId).first();
 if(old)return old.payload_hash===payloadHash?json({saved:true,id:old.id,duplicate:true}):json({error:'request_changed'},409);
 if(['network-lab452-v1','srwe-456-84-v1'].includes(b.bankVersion)&&!(b.targetType==='lesson'?lessonPermitted((await configFor(db)).config,b.targetId,user):permitted((await configFor(db)).config,'network',user)))return json({error:'forbidden'},403);const bank=await bankFor(db,b.bankVersion);if(!bank)return json({error:'content_changed'},409);
 let targetTitle='التجربة عمومًا',snapshot={};
 if(b.targetType==='lesson'){const l=bank.lessons.find(x=>x.id===b.targetId);if(!l)return json({error:'invalid_target'},400);targetTitle=l.title;snapshot={id:l.id,title:l.title,video:l.video};}
 if(b.targetType==='question'){const q=bank.questions.find(x=>x.id===b.targetId);if(!q)return json({error:'invalid_target'},400);targetTitle=q.prompt;snapshot=q;}
 const now=Date.now(),hour=Math.floor(now/3600000),minute=Math.floor(now/60000),net=await hash(hour+':'+(req.headers.get('cf-connecting-ip')||'unknown')),who=await hash(a.kind+':'+a.id);
 await db.prepare('DELETE FROM feedback_limits WHERE expires_at < ?').bind(now).run();
 for(const [key,limit] of [[`f:m:${who}:${minute}`,3],[`f:h:${who}:${hour}`,15],[`f:net:${net}`,100],[`f:global:${hour}`,1000]]){const r=await db.prepare('INSERT INTO feedback_limits(key,count,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count').bind(key,now+7200000).first();if(r.count>limit)return json({error:'rate_limited'},429);}
 const id=crypto.randomUUID();const result=await db.prepare('INSERT OR IGNORE INTO feedback_entries(id,request_id,payload_hash,actor_kind,actor_id,actor_name,kind,category,target_type,target_id,target_title,snapshot,bank_version,message,rating,status,owner_note,revision,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1,?,?)').bind(id,b.requestId,payloadHash,a.kind,a.id,a.name,b.kind,b.category,b.targetType,b.targetId,targetTitle,JSON.stringify(snapshot),b.bankVersion,b.message.trim(),b.rating,'new','',now,now).run();
 if(result.meta.changes===1)return json({saved:true,id,duplicate:false},201);
 const raced=await db.prepare('SELECT id,payload_hash FROM feedback_entries WHERE actor_kind=? AND actor_id=? AND request_id=?').bind(a.kind,a.id,b.requestId).first();return raced?.payload_hash===payloadHash?json({saved:true,id:raced.id,duplicate:true}):json({error:'request_changed'},409);
}
export async function myFeedback(req,db,user){
 if(!db)return json({error:'unavailable'},503);const a=actorFor(req,user);if(!a.id)return json({items:[]});await prune(db);
 const allowed=await nightAccess(db,user);
 const items=(await db.prepare("SELECT id,kind,category,target_title,message,rating,status,created_at,updated_at FROM feedback_entries WHERE actor_kind=? AND actor_id=? AND (?=1 OR COALESCE(bank_version,'') NOT LIKE 'night-review-%') ORDER BY created_at DESC,id DESC LIMIT 30").bind(a.kind,a.id,allowed?1:0).all()).results;
 return json({items,retentionDays:90});
}
export async function readFeedback(req,db,user){
 if(!isActivityAdmin(user))return json({error:'forbidden'},user?403:401);if(!db)return json({error:'unavailable'},503);await prune(db);
 const u=new URL(req.url),kind=u.searchParams.get('kind')||'report',status=u.searchParams.get('status')||'all',q=u.searchParams.get('q')||'',target=u.searchParams.get('target')||'',page=Number(u.searchParams.get('page')||1);
 if(!Object.hasOwn(STATUSES,kind)||status!=='all'&&!STATUSES[kind].includes(status)||q.length>100||target.length>50||!Number.isInteger(page)||page<1||page>10000)return json({error:'filter'},400);
 const clauses=['kind=?'],args=[kind];if(status!=='all'){clauses.push('status=?');args.push(status);}if(target){clauses.push('target_id=?');args.push(target);}if(q){clauses.push('(instr(message,?)>0 OR instr(target_title,?)>0 OR instr(id,?)>0)');args.push(q,q,q);}const where=clauses.join(' AND ');
 const items=(await db.prepare(`SELECT * FROM feedback_entries WHERE ${where} ORDER BY created_at DESC,id DESC LIMIT 30 OFFSET ?`).bind(...args,(page-1)*30).all()).results.map(({request_id,payload_hash,...r})=>({...r,snapshot:JSON.parse(r.snapshot)}));
 const total=(await db.prepare(`SELECT COUNT(*) n FROM feedback_entries WHERE ${where}`).bind(...args).first()).n;
 const counts=(await db.prepare('SELECT kind,status,COUNT(*) n FROM feedback_entries GROUP BY kind,status').all()).results;
 return json({owner:user.userId,items,total,page,counts,retentionDays:90});
}
export async function manageFeedback(req,db,user){
 if(!isActivityAdmin(user))return json({error:'forbidden'},user?403:401);if(!db)return json({error:'unavailable'},503);const p=await parse(req);if(p.error)return p.error;const b=p.body;
 if(!keys(b,['owner','id','revision','status','note'])||b.owner!==user.userId||!uuid(b.id)||!Number.isInteger(b.revision)||b.revision<1||typeof b.note!=='string'||b.note.length>2000)return json({error:'invalid'},400);
 const row=await db.prepare('SELECT kind FROM feedback_entries WHERE id=? AND created_at>=?').bind(b.id,Date.now()-90*86400000).first();if(!row)return json({error:'not_found'},404);if(!STATUSES[row.kind].includes(b.status))return json({error:'status'},400);
 const r=await db.prepare('UPDATE feedback_entries SET status=?,owner_note=?,revision=revision+1,updated_at=? WHERE id=? AND revision=?').bind(b.status,b.note,Date.now(),b.id,b.revision).run();return r.meta.changes===1?json({saved:true,revision:b.revision+1}):json({error:'conflict'},409);
}
