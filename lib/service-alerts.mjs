import {OS1_COURSE} from './os1-course.mjs';
const OS1_MEDIA_PATHS=new Set(OS1_COURSE.lessons.flatMap(l=>l.scenes.map(s=>s.video.split('?')[0])));
import {isActivityAdmin} from './activity.mjs';
import {readCatalog as readContent} from './course-catalog.mjs';
export const SERVICES={network:'حفظ محاكي الشبكات',madar:'حفظ المقررات والمستجدات',night:'حفظ مراجعة ما قبل الاختبار',nightcontent:'إدارة مراجعة ما قبل الاختبار',access:'حفظ تقدم الأكسس',excel:'حفظ تقدم الإكسل',progress:'حفظ تقدم الوورد',notes:'حفظ ملاحظتي',feedback:'إرسال الملاحظات والبلاغات',content:'إدارة المحتوى',quality:'حفظ إجابات الأسئلة',review:'مراجعة جودة الأسئلة',inbox:'إدارة بلاغات الطلاب',campaigns:'روابط الترويج',activity:'حفظ سجل الاستخدام'};
const json=(v,status=200)=>Response.json(v,{status,headers:{'Cache-Control':'private, no-store','Vary':'Cookie','X-Content-Type-Options':'nosniff'}});
// Only fixed service names and response status are recorded. Never log request bodies or identities.
export async function recordService(db,service,failed,now=Date.now()){
 if(!Object.hasOwn(SERVICES,service))return;
 try{
  if(failed)await db.prepare(`INSERT INTO service_alerts(id,status,occurrences,first_at,last_at,last_success,ack_at) VALUES (?,'open',1,?,?,NULL,NULL) ON CONFLICT(id) DO UPDATE SET status='open',occurrences=occurrences+1,last_at=MAX(service_alerts.last_at+1,excluded.last_at),ack_at=NULL`).bind(service,now,now).run();
  else await db.prepare(`UPDATE service_alerts SET status='recovered',last_success=? WHERE id=? AND last_at<=?`).bind(now,service,now).run();
 }catch{console.error('madar_service_monitor_unavailable',service,failed?'failure':'success');}
}
export async function monitoredSave(req,db,service,run){
 let result;try{result=await run();}catch{result=json({error:'unavailable'},503);}
 if(['POST','PUT','PATCH','DELETE'].includes(req.method)){
  if(result.status>=500)await recordService(db,service,true);
  else if(result.ok)await recordService(db,service,false);
 }
 return result;
}
export function videoId(url){try{const u=new URL(url);return u.protocol==='https:'&&!u.username&&!u.password&&['youtube.com','www.youtube.com'].includes(u.hostname)&&u.pathname==='/watch'&&/^[\w-]{11}$/.test(u.searchParams.get('v')||'')?u.searchParams.get('v'):null;}catch{return null;}}
export const videoEntries=lessons=>lessons.flatMap(l=>l.scenes?.length?l.scenes.map(x=>({id:x.id,title:l.title+' — '+x.title,video:x.video})):l.video?[l]:[]);
export async function inspectVideo(url,fetcher=fetch,origin=null){
 if(OS1_MEDIA_PATHS.has(url.split('?')[0])&&/^\/assets\/os1\/os1-lesson-\d+\/\d{2}\.mp4(?:\?v=[a-z0-9-]{1,32})?$/.test(url)){if(!origin)return {status:'unknown',code:null};try{const r=await fetcher(new URL(url,origin).href,{method:'HEAD',signal:AbortSignal.timeout(5000),redirect:'error'});return {status:r.ok&&r.headers.get('content-type')?.startsWith('video/')?'available':r.status===404?'review':'unknown',code:r.status};}catch{return {status:'unknown',code:null};}}
 const id=videoId(url);if(!id)return {status:'invalid',code:null};
 try{const r=await fetcher('https://www.youtube.com/oembed?format=json&url='+encodeURIComponent('https://www.youtube.com/watch?v='+id),{signal:AbortSignal.timeout(5000),redirect:'error'});
  const code=r.status;await r.body?.cancel();
  return {status:r.ok?'available':[401,403,404].includes(code)?'review':'unknown',code};
 }catch{return {status:'unknown',code:null};}
}
export async function readAlerts(req,db,user){
 if(!isActivityAdmin(user))return json({error:user?'forbidden':'sign_in_required'},user?403:401);
 if(!db)return json({error:'monitor_unavailable'},503);
 const alerts=(await db.prepare('SELECT * FROM service_alerts ORDER BY last_at DESC').all()).results;
 const checks=(await db.prepare('SELECT * FROM video_checks ORDER BY lesson').all()).results;
 const c=await readContent(db);const byId=new Map(checks.map(x=>[x.lesson,x]));
 const videos=videoEntries(c.data.lessons).map(l=>{const old=byId.get(l.id),check=old?.video===l.video?old:null;return {lesson:l.id,title:l.title,video:l.video,status:check?.status||'unchecked',checkedAt:check?.checked_at||null,code:check?.code??null};});
 return json({owner:user.userId,now:Date.now(),alerts:alerts.map(a=>({...a,title:SERVICES[a.id]||a.id})),videos,scan:await db.prepare("SELECT * FROM service_scan WHERE id=1").first()});
}
async function body(req){let n=0,s='',d=new TextDecoder();const r=req.body?.getReader();if(!r)throw Error();while(true){const {done,value}=await r.read();if(done)break;n+=value.length;if(n>2048){await r.cancel();throw Error();}s+=d.decode(value,{stream:true});}return JSON.parse(s+d.decode());}
export async function manageAlerts(req,db,user,fetcher=fetch){
 if(!isActivityAdmin(user))return json({error:user?'forbidden':'sign_in_required'},user?403:401);
 if(!db)return json({error:'monitor_unavailable'},503);
 if(req.headers.get('origin')!==new URL(req.url).origin||req.headers.get('sec-fetch-site')==='cross-site')return json({error:'origin'},403);
 if(!req.headers.get('content-type')?.startsWith('application/json'))return json({error:'json_required'},415);
 let b;try{b=await body(req);}catch{return json({error:'invalid'},400);}
 if(!b||b.owner!==user.userId)return json({error:'identity_changed'},409);
 if(b.action==='ack'){
  if(!Object.hasOwn(SERVICES,b.id)||!Number.isSafeInteger(b.lastAt)||Object.keys(b).some(k=>!['owner','action','id','lastAt'].includes(k)))return json({error:'invalid'},400);
  const r=await db.prepare("UPDATE service_alerts SET status='acknowledged',ack_at=? WHERE id=? AND last_at=? AND status='open'").bind(Date.now(),b.id,b.lastAt).run();
  return r.meta.changes===1?json({saved:true}):json({error:'changed'},409);
 }
 if(b.action!=='scan'||Object.keys(b).some(k=>!['owner','action'].includes(k)))return json({error:'invalid'},400);
 const now=Date.now(),token=crypto.randomUUID();
 const lock=await db.prepare(`INSERT INTO service_scan(id,token,started_at,finished_at) VALUES (1,?,?,NULL) ON CONFLICT(id) DO UPDATE SET token=excluded.token,started_at=excluded.started_at,finished_at=NULL WHERE (service_scan.finished_at IS NOT NULL AND service_scan.started_at<?) OR service_scan.started_at<?`).bind(token,now,now-60000,now-600000).run();
 if(lock.meta.changes!==1)return json({error:'scan_busy'},429);
 try{
  const c=await readContent(db);c.data.lessons=videoEntries(c.data.lessons);let cursor=0;
  async function worker(){while(cursor<c.data.lessons.length){const l=c.data.lessons[cursor++],r=await inspectVideo(l.video,fetcher,new URL(req.url).origin);await db.prepare(`INSERT INTO video_checks(lesson,video,status,code,checked_at) VALUES (?,?,?,?,?) ON CONFLICT(lesson) DO UPDATE SET video=excluded.video,status=excluded.status,code=excluded.code,checked_at=excluded.checked_at`).bind(l.id,l.video,r.status,r.code,Date.now()).run();}}
  await Promise.all(Array.from({length:4},worker));
  return json({checked:c.data.lessons.length});
 }finally{await db.prepare('UPDATE service_scan SET finished_at=? WHERE id=1 AND token=?').bind(Date.now(),token).run();}
}
