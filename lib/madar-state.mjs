import {validSrweState} from './srwe-state.mjs';
import {isActivityAdmin} from './activity.mjs';
import {NETWORK_COURSE} from './network-course.mjs';
export const DEFAULT_CONFIG={version:1,access:{office:'public',network:'public',os1:'public'},contentAccess:{},grants:{},updates:[
 {id:'hub',title:'مدار يجمع رحلتك',body:'مقرراتك في مكان واحد. ادخل إلى مساحة كل مقرر، وارجع إلى تعلّمك من المكان اللي وقفت عنده.',course:'',target:'courses',places:['global'],status:'published',pin:true,date:'2026-10-15',start:'',end:'',duration:12,scene:'hub'},
 {id:'network',title:'مساحة للشبكات. وفهم أقرب للتطبيق.',body:'تدريب عملي في VLAN وTrunk وInter-VLAN، مع إرشاد يساعدك عند الحاجة ومختبرات مستقلة للتجربة.',course:'network',target:'course:network:lessons',places:['global','course'],status:'published',pin:false,date:'2026-10-15',start:'',end:'',duration:14,scene:'network'},
 {id:'office',title:'مذاكرتك صارت مترابطة',body:'الشرح والتطبيق والمراجعة في Word وExcel وAccess داخل مقرر تطبيقات الحاسب المتقدمة.',course:'office',target:'course:office:home',places:['global'],status:'published',pin:false,date:'2026-10-15',start:'',end:'',duration:12,scene:'office'}]};
export const reply=(x,status=200)=>Response.json(x,{status,headers:{'Cache-Control':'private, no-store','Vary':'Cookie','X-Content-Type-Options':'nosniff'}});
export async function configFor(db) {
  const row = await db.prepare("SELECT snapshot,revision FROM madar_states WHERE owner='@system' AND kind='config'").first();
  if (!row) return { config: structuredClone(DEFAULT_CONFIG), revision: 0 };
  const snapshot = JSON.parse(row.snapshot);
  return { config: { ...snapshot, access: { os1: 'public', ...snapshot.access } }, revision: row.revision || 0 };
}
export function permitted(config,course,user){return isActivityAdmin(user)||config.access[course]==='public'||config.access[course]==='restricted'&&!!user&&config.grants?.[course]?.includes(user.userId);}
export function lessonPermitted(config,id,user){const c=id.startsWith('os1-')?'os1':id.startsWith('network-')?'network':'office';return permitted(config,c,user)&&(isActivityAdmin(user)||config.contentAccess[id]!=='draft'&&(config.contentAccess[id]!=='restricted'||config.grants?.[id]?.includes(user?.userId)));}
// The integrated lab contains all three parts. Never serve hidden lesson content through it.
export async function networkAllowed(db,user){const {config}=await configFor(db);return NETWORK_COURSE.lessons.filter(l=>['network-vlan','network-trunk','network-inter'].includes(l.id)).every(l=>lessonPermitted(config,l.id,user));}
const safe=(x,d=0)=>d<30&&(x===null||typeof x==='boolean'||typeof x==='number'&&Number.isFinite(x)||typeof x==='string'&&x.length<=700000||Array.isArray(x)&&x.length<=5000&&x.every(v=>safe(v,d+1))||!!x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length<=5000&&Object.entries(x).every(([k,v])=>!['__proto__','constructor','prototype'].includes(k)&&k.length<=200&&safe(v,d+1)));
export async function validState(kind,x){
 if(!safe(x))return false;
 if(kind==='srwe')return validSrweState(x);
 if(kind==='profile')return x?.version===1&&x.visits&&typeof x.visits==='object'&&!Array.isArray(x.visits)&&x.notes&&Object.values(x.notes).every(t=>typeof t==='string'&&t.length<=6000);
 if(kind==='network'){
  if(x?.privateContent?.format!=='madar-tabs-gzip-1'||typeof x.privateContent.data!=='string'||x.privateContent.data.length>700000)return false;
  try{const bytes=Uint8Array.from(atob(x.privateContent.data),c=>c.charCodeAt(0));const reader=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip')).getReader();let raw='',size=0,decoder=new TextDecoder();while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>4194304){await reader.cancel();return false;}raw+=decoder.decode(value,{stream:true});}const s=JSON.parse(raw+decoder.decode());return safe(s)&&s.schema===1&&Array.isArray(s.labs)&&s.labs.length>0&&s.labs.length<=100&&new Set(s.labs.map(l=>l.id)).size===s.labs.length&&s.labs.some(l=>l.id===s.active)&&['original-vlan','original-ports'].every(id=>s.labs.some(l=>l.id===id))&&s.labs.every(l=>typeof l.id==='string'&&typeof l.name==='string'&&l.data?.devices&&l.data?.network&&Array.isArray(l.data?.cables));}catch{return false;}
 }
 return false;
}
const validDay=s=>/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s;
export function validConfig(c){return safe(c)&&c?.version===1&&c.access?.office==='public'&&(!('os1' in c.access)||c.access.os1==='public')&&['public','restricted','draft'].includes(c.access?.network)&&c.contentAccess&&Object.entries(c.contentAccess).every(([id,v])=>NETWORK_COURSE.lessons.some(l=>l.id===id)&&['public','restricted','draft'].includes(v))&&c.grants&&Object.entries(c.grants).every(([k,v])=>(k==='network'||NETWORK_COURSE.lessons.some(l=>l.id===k))&&Array.isArray(v)&&v.length<=200&&v.every(id=>typeof id==='string'&&id.length>0&&id.length<=150))&&Array.isArray(c.updates)&&c.updates.length<=100&&new Set(c.updates.map(u=>u.id)).size===c.updates.length&&c.updates.every(u=>typeof u.id==='string'&&u.id.length<=100&&typeof u.title==='string'&&u.title.length>0&&u.title.length<=100&&typeof u.body==='string'&&u.body.length<=500&&['','office','network'].includes(u.course)&&['draft','published'].includes(u.status)&&['hub','office','network'].includes(u.scene)&&Array.isArray(u.places)&&u.places.length>0&&u.places.every(p=>['global','course'].includes(p))&&Number.isInteger(u.duration)&&u.duration>=8&&u.duration<=60&&validDay(u.date)&&['start','end'].every(k=>u[k]===''||validDay(u[k]))&&(!u.start||!u.end||u.start<=u.end)&&/^(courses|home|course:(office|network):(home|word|excel|access|practical|lessons|theory|quiz|reference)|lesson:[A-Za-z0-9_-]+)$/.test(u.target));}
export async function boundedBody(req){if(req.headers.get('origin')!==new URL(req.url).origin||req.headers.get('sec-fetch-site')==='cross-site')return {error:reply({error:'origin'},403)};if(!req.headers.get('content-type')?.startsWith('application/json'))return {error:reply({error:'json_required'},415)};const reader=req.body?.getReader();if(!reader)return {error:reply({error:'body'},400)};let size=0,raw='',d=new TextDecoder();while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>900000){await reader.cancel();return {error:reply({error:'too_large'},413)};}raw+=d.decode(value,{stream:true});}try{return {body:JSON.parse(raw+d.decode())}}catch{return {error:reply({error:'body'},400)}}}
export async function stateRequest(req,db,user,admin=false){
 if(!user)return reply({error:'sign_in_required'},401);if(!db)return reply({error:'unavailable'},503);if(admin&&!isActivityAdmin(user))return reply({error:'forbidden'},403);
 const url=new URL(req.url),kind=admin?'config':url.searchParams.get('kind'),owner=admin?'@system':user.userId;
 if(!admin&&url.searchParams.get('owner')!==owner)return reply({error:'identity_changed'},409);
 if(!['profile','network','srwe','config'].includes(kind)||!admin&&kind==='config')return reply({error:'kind'},400);
 if(kind==='srwe'){const {config}=await configFor(db);if(![4,5,6].every(c=>lessonPermitted(config,'network-srwe-'+c,user)))return reply({error:'forbidden'},403);}
 if(kind==='network'&&!await networkAllowed(db,user))return reply({error:'forbidden'},403);
 const read=()=>db.prepare('SELECT snapshot,revision,request_id,updated_at FROM madar_states WHERE owner=? AND kind=?').bind(owner,kind).first();
 if(req.method==='GET'){const r=await read();return reply({owner:user.userId,snapshot:r?JSON.parse(r.snapshot):admin?structuredClone(DEFAULT_CONFIG):null,revision:r?.revision||0,updatedAt:r?.updated_at||null});}
 if(req.method!=='PUT')return reply({error:'method'},405);const p=await boundedBody(req);if(p.error)return p.error;const b=p.body;
 if(!Number.isInteger(b?.revision)||b.revision<0||b.revision>2147483646||!/^[-a-f0-9]{36}$/.test(b.requestId||'')||!(admin?validConfig(b.snapshot):await validState(kind,b.snapshot)))return reply({error:'snapshot'},400);
 if(admin){const {readCatalog}=await import('./course-catalog.mjs');const catalog=await readCatalog(db);for(const u of b.snapshot.updates){if(u.target.startsWith('lesson:')&&!catalog.data.lessons.some(l=>l.id===u.target.slice(7)))return reply({error:'target'},400);}}
 const old=await read(),raw=JSON.stringify(b.snapshot),now=new Date().toISOString();
 if(old?.request_id===b.requestId)return old.snapshot===raw?reply({owner:user.userId,revision:old.revision,updatedAt:old.updated_at}):reply({error:'request_reused'},409);
 if(!old&&b.revision!==0)return reply({error:'conflict'},409);
 const r=b.revision===0?await db.prepare('INSERT INTO madar_states(owner,kind,snapshot,revision,request_id,updated_at) VALUES(?,?,?,1,?,?) ON CONFLICT(owner,kind) DO NOTHING').bind(owner,kind,raw,b.requestId,now).run():await db.prepare('UPDATE madar_states SET snapshot=?,revision=revision+1,request_id=?,updated_at=? WHERE owner=? AND kind=? AND revision=?').bind(raw,b.requestId,now,owner,kind,b.revision).run();
 if(r.meta.changes!==1)return reply({error:'conflict'},409);return reply({owner:user.userId,revision:b.revision+1,updatedAt:now});
}

