import {OS1_COURSE} from './os1-course.mjs';
import {NETWORK_COURSE} from './network-course.mjs';
const OS1_LESSON_IDS=new Set(OS1_COURSE.lessons.map(l=>l.id));
const NETWORK_LESSON_IDS=new Set(NETWORK_COURSE.lessons.map(l=>l.id));
// Identity comes exclusively from the hosting gateway, never event data.
export const ADMIN_EMAIL = 'd7d7y7@gmail.com';
export const isActivityAdmin = user => !!user && user.email?.toLowerCase() === ADMIN_EMAIL;
export const RETENTION_DAYS = 90;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const EVENT_TYPES = ['training_check','training_recall','campaign_arrival','note_save','note_timestamp','note_seek','page_open','review_mode','bookmark_add','bookmark_remove','quiz_start','quiz_answer','quiz_check','quiz_finish','quiz_resume','quiz_discard','quiz_next','quiz_previous','quiz_retry','scope_change','feedback_attempt','feedback_success','feedback_failure','login_click','logout_click','video_play','video_pause','video_end','motion_change','detail_open','detail_close','source_open','progress_export','progress_refresh'];
const headers = {'Cache-Control':'private, no-store','Vary':'Cookie','X-Content-Type-Options':'nosniff'};
const json = (data,status=200,extra={}) => Response.json(data,{status,headers:{...headers,...extra}});
const ownKeys=(obj,allowed)=>obj&&typeof obj==='object'&&!Array.isArray(obj)&&Object.keys(obj).every(k=>allowed.includes(k));
function guestFrom(req){const raw=req.headers.get('cookie')?.match(/(?:^|;\s*)madar_guest=([^;]+)/)?.[1];return UUID.test(raw||'')?raw:null;}
export function actorFor(req,user){return user?{kind:'account',id:user.userId,name:String(user.displayName||'حساب').slice(0,120)}:{kind:'guest',id:guestFrom(req),name:null};}
export function activitySession(req,user){
 const actor=actorFor(req,user),extra={};
 if(!actor.id){actor.id=crypto.randomUUID();extra['Set-Cookie']=`madar_guest=${actor.id}; Path=/; Max-Age=7776000; HttpOnly; Secure; SameSite=Lax`;}
 return json({actor:`${actor.kind}:${actor.id}`,retentionDays:RETENTION_DAYS},200,extra);
}
export function validEvent(e){
 if(!ownKeys(e,['id','type','page','lesson','question','value','at','campaign'])||!UUID.test(e.id||'')||!EVENT_TYPES.includes(e.type))return false;
 if(e.campaign!==undefined&&(typeof e.campaign!=='string'||!UUID.test(e.campaign)||e.campaign!==e.campaign.toLowerCase()))return false;
 if(e.type==='campaign_arrival'&&!e.campaign)return false;
 if(!/^(home|courses|network|os1|learn|quiz|saved|mistakes|about|session|results|account|excel|access)$/.test(e.page||''))return false;
 if(e.lesson!==undefined&&!OS1_LESSON_IDS.has(e.lesson)&&!NETWORK_LESSON_IDS.has(e.lesson)&&!/^(?:v\d{2,3}|access-(?:u\d{2}-\d{2}|custom-\d{3})|excel-(?:[A-Za-z0-9_-]{11}|workbook-\d{2}|custom-\d{3}))$/.test(e.lesson))return false;
 if(e.question!==undefined&&!/^(?:mcq26-\d{3}|access-mcq-\d{3}|excel-mcq-\d{3}|network-srwe-[456]-\d{2})$/.test(e.question))return false;
 if(typeof e.at!=='string'||!Number.isFinite(Date.parse(e.at))||e.at.length>30)return false;
 // Only enumerated metadata: never arbitrary page text, feedback, names or URLs.
 if(e.value!==undefined&&!(Number.isInteger(e.value)&&e.value>=0&&e.value<=1000)&&!['summary','all','practice','exam','on','off','correct','incorrect'].includes(e.value))return false;
 return true;
}
async function boundedJSON(req){
 const reader=req.body?.getReader();if(!reader)throw Error();let length=0,parts=[];
 while(true){const {value,done}=await reader.read();if(done)break;length+=value.byteLength;if(length>16384){await reader.cancel();throw Error();}parts.push(value);}
 const bytes=new Uint8Array(length);let p=0;for(const part of parts){bytes.set(part,p);p+=part.length;}return JSON.parse(new TextDecoder().decode(bytes));
}
export async function recordActivity(req,db,user){
 const origin=new URL(req.url).origin;
 if(req.headers.get('origin')!==origin||req.headers.get('sec-fetch-site')==='cross-site')return json({error:'origin'},403);
 if(!req.headers.get('content-type')?.startsWith('application/json'))return json({error:'content_type'},415);
 if(!db)return json({error:'unavailable'},503);
 let body;try{body=await boundedJSON(req);}catch{return json({error:'invalid_body'},400);}
 const actor=actorFor(req,user);
 if(!actor.id||body?.actor!==`${actor.kind}:${actor.id}`)return json({error:'identity_changed'},409);
 if(!ownKeys(body,['actor','events'])||!Array.isArray(body.events)||body.events.length<1||body.events.length>20||!body.events.every(validEvent))return json({error:'invalid_events'},400);
 const now=Date.now(),cutoff=now-RETENTION_DAYS*86400000;
 const hash=async s=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))).map(x=>x.toString(16).padStart(2,'0')).join('');
 // Hour-scoped, hashed network bucket prevents guest-cookie resets bypassing limits.
 const hour=Math.floor(now/3600000),network=req.headers.get('cf-connecting-ip')||'unknown';
 const keys=[`actor:${await hash(body.actor)}:${hour}`,`network:${await hash(`${hour}:${network}`)}`];
 for(const key of keys){const limit=await db.prepare('INSERT INTO activity_limits (key,count,expires_at) VALUES (?,?,?) ON CONFLICT(key) DO UPDATE SET count=count+excluded.count RETURNING count').bind(key,body.events.length,now+7200000).first();if(limit.count>3000)return json({error:'rate_limit'},429,{'Retry-After':'60'});}
 const statements=[db.prepare('DELETE FROM activity_events WHERE received_at < ?').bind(cutoff),db.prepare('DELETE FROM activity_limits WHERE expires_at < ?').bind(now)];
 for(const e of body.events)statements.push(db.prepare("INSERT OR IGNORE INTO activity_events (event_id,actor_kind,actor_id,actor_name,event_type,page,lesson,question,value,client_at,received_at,campaign_id) SELECT ?,?,?,?,?,?,?,?,?,?,?,(SELECT id FROM campaign_links WHERE id=? AND active=1) WHERE ?<>'campaign_arrival' OR EXISTS(SELECT 1 FROM campaign_links WHERE id=? AND active=1)").bind(`${actor.kind}:${actor.id}:${e.id}`,actor.kind,actor.id,actor.name,e.type,e.page,e.lesson||null,e.question||null,e.value===undefined?null:String(e.value),e.at,now,e.campaign||null,e.type,e.campaign||null));
 await db.batch(statements);return json({accepted:body.events.length});
}
export async function readActivity(req,db,user){
 if(!isActivityAdmin(user))return json({error:user?'forbidden':'sign_in_required'},user?403:401);
 if(!db)return json({error:'unavailable'},503);
 const now=Date.now(),cutoff=now-RETENTION_DAYS*86400000;
 await db.batch([db.prepare('DELETE FROM activity_events WHERE received_at < ?').bind(cutoff),db.prepare('DELETE FROM activity_limits WHERE expires_at < ?').bind(now)]);
 const u=new URL(req.url),clauses=['received_at >= ?'],args=[cutoff];
 for(const [key,col]of [['actor','actor_id'],['kind','actor_kind'],['type','event_type']]){const v=u.searchParams.get(key);if(v){if(v.length>160)return json({error:'filter'},400);clauses.push(`${col} = ?`);args.push(v);}}
 for(const [key,op]of [['from','>='],['to','<=']]){const v=u.searchParams.get(key);if(v){const n=Date.parse(v);if(!Number.isFinite(n))return json({error:'date'},400);clauses.push(`received_at ${op} ?`);args.push(n);}}
 const base=clauses.join(' AND '),cursor=u.searchParams.get('before');
 const count=await db.prepare(`SELECT COUNT(*) AS total, COUNT(DISTINCT actor_kind || ':' || actor_id) AS actors FROM activity_events WHERE ${base}`).bind(...args).first();
 if(cursor){if(!/^\d{1,16}$/.test(cursor))return json({error:'cursor'},400);clauses.push('id < ?');args.push(Number(cursor));}
 const rows=(await db.prepare(`SELECT * FROM activity_events WHERE ${clauses.join(' AND ')} ORDER BY id DESC LIMIT 101`).bind(...args).all()).results;
 const {readCatalog}=await import('./course-catalog.mjs');const catalog=await readCatalog(db);return json({lessonNames:{...Object.fromEntries(catalog.data.lessons.map(l=>[l.id,l.subject+' · '+l.title])),'night-review':'مراجعة ما قبل الاختبار'},rows:rows.slice(0,100).map(r=>({...r,lessonTitle:r.lesson==='night-review'?'مراجعة ما قبل الاختبار':catalog.data.lessons.find(l=>l.id===r.lesson)?.title||null})), next:rows.length>100?rows[99].id:null,total:count.total,actors:count.actors,retentionDays:RETENTION_DAYS});
}
