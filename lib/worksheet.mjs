import {validLabState,LAB_VERSION} from '../public/access-lab-engine.mjs';
import tasks from '../public/access-lab-tasks.mjs';
import {readContent} from './content-store.mjs';
const json=(v,status=200)=>Response.json(v,{status,headers:{'Cache-Control':'private, no-store','Vary':'Cookie'}});
export function validSnapshot(x){
 if(!x||x.schema!==1||typeof x.activity!=='string'||x.activity.length>160||!Array.isArray(x.history)||!Array.isArray(x.future)||x.history.length>40||x.future.length>40||x.history.length+x.future.length>40)return false;
 const clean=(v,depth=0)=>{if(depth>12)return false;if(v===null||typeof v==='boolean')return true;if(typeof v==='number')return Number.isFinite(v);if(typeof v==='string')return v.length<=12000;if(Array.isArray(v))return v.length<=1000&&v.every(a=>clean(a,depth+1));return v&&typeof v==='object'&&Object.keys(v).length<=1000&&Object.entries(v).every(([k,a])=>!['__proto__','constructor','prototype'].includes(k)&&k.length<150&&clean(a,depth+1));};
 if(!clean(x.guide||{}))return false;
 return [x.current,...x.history,...x.future].every(raw=>{try{if(typeof raw!=='string'||raw.length>60000)return false;const s=JSON.parse(raw);if(x.activity.startsWith(LAB_VERSION+':'))return clean(s)&&validLabState(s);return clean(s)&&s.cells&&!Array.isArray(s.cells)&&Object.values(s.cells).every(v=>typeof v==='string'||typeof v==='number')&&['formats','spills','validation','locked','extra'].every(k=>s[k]&&typeof s[k]==='object'&&!Array.isArray(s[k]))&&Array.isArray(s.rules)&&Array.isArray(s.trace)&&Array.isArray(s.events)&&typeof s.protect==='boolean'&&typeof s.sheetName==='string'&&s.sheetName.length<=100&&Number.isFinite(s.clockSource); }catch{return false;}});
}
export async function worksheetRequest(req,db,user){
 if(!user)return json({error:'sign_in_required'},401);if(!db)return json({error:'unavailable'},503);
 const url=new URL(req.url),lesson=url.searchParams.get('lesson');if(url.searchParams.get('owner')!==user.userId)return json({error:'identity_changed'},409);
 const subject=lesson?.startsWith('access-')?'Access':'Excel';
 if(!(await readContent(db,false,subject)).data.lessons.some(l=>l.id===lesson)||(subject==='Access'&&!tasks[lesson]))return json({error:'lesson'},400);
 const read=()=>db.prepare('SELECT snapshot,revision,request_id,updated_at FROM worksheet_saves WHERE user_id=? AND lesson=?').bind(user.userId,lesson).first();
 if(req.method==='GET'){const row=await read();return json({owner:user.userId,snapshot:row?JSON.parse(row.snapshot):null,revision:row?.revision||0,updatedAt:row?.updated_at||null});}
 if(req.method!=='PUT')return json({error:'method'},405);
 if(req.headers.get('origin')!==url.origin||req.headers.get('sec-fetch-site')==='cross-site')return json({error:'origin'},403);
 if(!req.headers.get('content-type')?.startsWith('application/json'))return json({error:'json_required'},415);
 let bytes=0,raw='';const reader=req.body?.getReader(),decoder=new TextDecoder();if(!reader)return json({error:'body'},400);while(true){const {done,value}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>524288){await reader.cancel();return json({error:'too_large'},413);}raw+=decoder.decode(value,{stream:true});}raw+=decoder.decode();let b;try{b=JSON.parse(raw);}catch{return json({error:'body'},400);}
 if(!b||!Number.isInteger(b.revision)||b.revision<0||b.revision>2147483646||!/^[-0-9a-f]{36}$/.test(b.requestId||'')||!validSnapshot(b.snapshot))return json({error:'snapshot'},400);
 if(subject==='Access'&&b.snapshot.activity!==LAB_VERSION+':'+lesson)return json({error:'activity'},400);if(subject==='Excel'&&b.snapshot.activity.startsWith(LAB_VERSION+':'))return json({error:'activity'},400);
 const snapshot=JSON.stringify(b.snapshot),old=await read();if(!old&&b.revision!==0)return json({error:"conflict"},409);if(old?.request_id===b.requestId)return old.snapshot===snapshot?json({owner:user.userId,revision:old.revision,updatedAt:old.updated_at}):json({error:'request_reused'},409);
 const now=new Date().toISOString();const r=await db.prepare('INSERT INTO worksheet_saves(user_id,lesson,snapshot,revision,request_id,updated_at) VALUES(?,?,?,1,?,?) ON CONFLICT(user_id,lesson) DO UPDATE SET snapshot=excluded.snapshot,revision=worksheet_saves.revision+1,request_id=excluded.request_id,updated_at=excluded.updated_at WHERE worksheet_saves.revision=?').bind(user.userId,lesson,snapshot,b.requestId,now,b.revision).run();
 // A nonzero expected revision must refer to an existing save.
 if(r.meta.changes!==1)return json({error:'conflict'},409);
 return json({owner:user.userId,revision:b.revision+1,updatedAt:now});
}
