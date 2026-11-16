import {validReview,validReviewHistory} from '../public/mistake-review-state.mjs';
// Identity is supplied only by the dispatch-authenticated server route.
const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'private, no-store','Vary':'Cookie','X-Content-Type-Options':'nosniff'}});
const lesson=x=>typeof x==='string'&&/^v\d{2,3}$/.test(x);
const question=x=>typeof x==='string'&&/^mcq26-\d{3}$/.test(x);
const text=(x,n)=>typeof x==='string'&&x.length<=n;
const integer=(x,min,max)=>Number.isInteger(x)&&x>=min&&x<=max;
function session(x){return x===null||(x&&['practice','exam'].includes(x.mode)&&(x.sessionId===undefined||(typeof x.sessionId==='string'&&/^[0-9a-f-]{36}$/.test(x.sessionId)))&&(x.bankVersion===undefined||text(x.bankVersion,80))&&text(x.title,300)&&Array.isArray(x.items)&&x.items.length>0&&x.items.length<=1000&&integer(x.index,0,x.items.length-1)&&new Set(x.items.map(i=>i.id)).size===x.items.length&&x.items.every(i=>question(i.id)&&Array.isArray(i.order)&&i.order.length===4&&new Set(i.order).size===4&&i.order.every(n=>integer(n,0,3))&&(i.answer===null||integer(i.answer,0,3))&&typeof i.checked==='boolean'));}
export function validState(s){return s&&s.version===2&&Object.keys(s).every(k=>['version','bookmarks','mistakes','history','active','lastResult','lastLesson','theme','mistakeReview','mistakeHistory'].includes(k))&&Array.isArray(s.bookmarks)&&s.bookmarks.length<=200&&s.bookmarks.every(lesson)&&Array.isArray(s.mistakes)&&s.mistakes.length<=1000&&s.mistakes.every(question)&&Array.isArray(s.history)&&s.history.length<=30&&s.history.every(h=>text(h.title,300)&&['practice','exam'].includes(h.mode)&&integer(h.total,1,1000)&&integer(h.score,0,h.total)&&text(h.date,40)&&Number.isFinite(Date.parse(h.date)))&&validReview(s.mistakeReview)&&validReviewHistory(s.mistakeHistory)&&session(s.active)&&(s.lastResult===undefined||session(s.lastResult))&&(s.lastLesson===undefined||lesson(s.lastLesson))&&(s.theme===undefined||['launch','calm'].includes(s.theme));}
export async function progressRequest(req,db,user){
 if(!user)return json({error:'sign_in_required'},401);
 if(!db)return json({error:'storage_unavailable'},503);
 const owner=user.userId;
 if(req.headers.get('X-Madar-Owner')&&req.headers.get('X-Madar-Owner')!==owner)return json({error:'identity_changed'},409);
 if(req.method==='GET'){
  const row=await db.prepare('SELECT payload, revision FROM learner_progress WHERE user_id = ?').bind(owner).first();
  return json({revision:row?.revision||0,state:row?JSON.parse(row.payload):null});
 }
 if(req.method!=='PUT')return json({error:'method_not_allowed'},405);
 if(req.headers.get('origin')!==new URL(req.url).origin||req.headers.get('sec-fetch-site')==='cross-site')return json({error:'origin_rejected'},403);
 if(!req.headers.get('content-type')?.startsWith('application/json'))return json({error:'json_required'},415);
 // Bounded stream: do not trust a client-supplied Content-Length.
 let raw='';const reader=req.body?.getReader();if(!reader)return json({error:'invalid_body'},400);
 const decoder=new TextDecoder();let size=0;
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>262144){await reader.cancel();return json({error:'too_large'},413);}raw+=decoder.decode(value,{stream:true});}raw+=decoder.decode();
 let body;try{body=JSON.parse(raw)}catch{return json({error:'invalid_json'},400)}
 if(!body||Object.keys(body).some(k=>!['state','revision'].includes(k))||!integer(body.revision,0,2147483646)||!validState(body.state))return json({error:'invalid_state'},400);
 const payload=JSON.stringify(body.state),date=new Date().toISOString();let changed;
 if(body.revision===0)changed=await db.prepare('INSERT INTO learner_progress (user_id, payload, revision, updated_at) VALUES (?, ?, 1, ?) ON CONFLICT(user_id) DO NOTHING').bind(owner,payload,date).run();
 else changed=await db.prepare('UPDATE learner_progress SET payload = ?, revision = revision + 1, updated_at = ? WHERE user_id = ? AND revision = ?').bind(payload,date,owner,body.revision).run();
 if(changed.meta.changes!==1)return json({error:'revision_conflict'},409);
 return json({revision:body.revision+1});
}
