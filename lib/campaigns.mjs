import {isActivityAdmin} from './activity.mjs';
import {readCatalog as readContent} from './course-catalog.mjs';
import {windowFor} from './insights.mjs';
const json=(v,status=200)=>Response.json(v,{status,headers:{'Cache-Control':'private, no-store','Vary':'Cookie','X-Content-Type-Options':'nosniff'}});
export const campaignId=v=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(v);
const keys=(v,ks)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).every(k=>ks.includes(k));
async function body(req){const r=req.body?.getReader();if(!r)throw Error();let n=0,s='',d=new TextDecoder();while(true){const {done,value}=await r.read();if(done)break;n+=value.length;if(n>4096){await r.cancel();throw Error()}s+=d.decode(value,{stream:true});}return JSON.parse(s+d.decode());}
export async function manageCampaign(req,db,user){
 if(!isActivityAdmin(user))return json({error:user?'forbidden':'sign_in_required'},user?403:401);
 if(!db)return json({error:'unavailable'},503);
 if(req.headers.get('origin')!==new URL(req.url).origin||req.headers.get('sec-fetch-site')==='cross-site')return json({error:'origin'},403);
 if(!req.headers.get('content-type')?.startsWith('application/json'))return json({error:'content_type'},415);
 let b;try{b=await body(req)}catch{return json({error:'invalid'},400)}
 if(!b||b.owner!==user.userId)return json({error:'identity_changed'},409);
 if(!campaignId(b.id))return json({error:'invalid'},400);
 const now=Date.now();
 if(b.action==='create'){
  if(!keys(b,['owner','action','id','label','channel','target'])||typeof b.label!=='string'||b.label.trim().length<2||b.label.length>80||!['whatsapp','youtube','telegram','other'].includes(b.channel)||typeof b.target!=='string')return json({error:'invalid'},400);
  const content=await readContent(db);if(!['#madar','#courses','#course:network:home','#course:network:practical','#course:network:lessons','#home','#quiz','#excel','#excel/questions','#quiz/excel','#access','#quiz/access',...content.data.lessons.map(x=>(x.subject==='Network'?'#lesson:':x.subject==='Word'?'#learn/':'#'+x.subject.toLowerCase()+'/')+x.id)].includes(b.target))return json({error:'target'},400);
  const existing=await db.prepare('SELECT * FROM campaign_links WHERE id=?').bind(b.id).first();
  if(existing)return existing.label===b.label.trim()&&existing.channel===b.channel&&existing.target===b.target?json({saved:true,id:existing.id,duplicate:true}):json({error:'request_changed'},409);
  const r=await db.prepare('INSERT OR IGNORE INTO campaign_links(id,label,channel,target,active,revision,created_at,updated_at) SELECT ?,?,?,?,1,1,?,? WHERE (SELECT COUNT(*) FROM campaign_links)<100').bind(b.id,b.label.trim(),b.channel,b.target,now,now).run();
  if(r.meta.changes===1)return json({saved:true,id:b.id},201);
  const raced=await db.prepare('SELECT * FROM campaign_links WHERE id=?').bind(b.id).first();if(raced)return raced.label===b.label.trim()&&raced.channel===b.channel&&raced.target===b.target?json({saved:true,id:b.id,duplicate:true}):json({error:'request_changed'},409);
  return json({error:'limit'},409);
 }
 if(b.action==='status'){
  if(!keys(b,['owner','action','id','revision','active'])||typeof b.active!=='boolean'||!Number.isInteger(b.revision)||b.revision<1)return json({error:'invalid'},400);
  const r=await db.prepare('UPDATE campaign_links SET active=?,revision=revision+1,updated_at=? WHERE id=? AND revision=?').bind(Number(b.active),now,b.id,b.revision).run();return r.meta.changes?json({saved:true}):json({error:'conflict'},409);
 }
 return json({error:'invalid'},400);
}
export async function readCampaigns(req,db,user,now=Date.now()){
 if(!isActivityAdmin(user))return json({error:user?'forbidden':'sign_in_required'},user?403:401);if(!db)return json({error:'unavailable'},503);
 const q=new URL(req.url).searchParams,days=q.get('days')||'7',kind=q.get('kind')||'all';if(!['7','30','90'].includes(days)||!['all','account','guest'].includes(kind))return json({error:'filter'},400);
 const {from}=windowFor(Number(days),now),args=[from,now,user.userId];let where="received_at>=? AND received_at<=? AND NOT (actor_kind='account' AND actor_id=?)";if(kind!=='all'){where+=' AND actor_kind=?';args.push(kind)}
 const actor="actor_kind || ':' || actor_id";
 const stats=await db.prepare(`SELECT campaign_id,COUNT(DISTINCT ${actor}) actors,COUNT(CASE WHEN event_type='campaign_arrival' THEN 1 END) arrivals,COUNT(DISTINCT CASE WHEN event_type='campaign_arrival' THEN ${actor} END) entrants,COUNT(DISTINCT CASE WHEN event_type='page_open' AND page IN ('learn','excel','access','network') THEN ${actor} END) openers,COUNT(DISTINCT CASE WHEN event_type='video_play' THEN ${actor} END) players,COUNT(DISTINCT CASE WHEN event_type='quiz_start' THEN ${actor} END) starters,COUNT(DISTINCT CASE WHEN event_type='quiz_finish' THEN ${actor} END) finishers FROM activity_events WHERE ${where} GROUP BY campaign_id`).bind(...args).all();
 const byId=new Map(stats.results.map(x=>[x.campaign_id,x])),links=(await db.prepare('SELECT * FROM campaign_links ORDER BY created_at DESC,id').all()).results;
 const content=await readContent(db),targets=[{value:'#madar',label:'رئيسية مدار'},{value:'#courses',label:'المقررات'},{value:'#course:network:home',label:'التوجيه والتحويل ١'},{value:'#home',label:'تطبيقات الحاسب المتقدمة'},{value:'#quiz',label:'اختبر نفسك في Word'},{value:'#excel',label:'مكتبة Excel'},{value:'#excel/questions',label:'اختبر نفسك في Excel'},{value:'#access',label:'مكتبة Access'},{value:'#quiz/access',label:'اختبر نفسك في Access'},...content.data.lessons.map(l=>({value:(l.subject==='Network'?'#lesson:':l.subject==='Word'?'#learn/':'#'+l.subject.toLowerCase()+'/')+l.id,label:l.subject+' · الوحدة '+l.unit+' · '+l.title}))];
 const items=links.map(l=>({...l,actors:0,arrivals:0,entrants:0,openers:0,players:0,starters:0,finishers:0,...byId.get(l.id)}));
 return json({owner:user.userId,items,targets,days:Number(days),kind,from,to:now,unattributedActors:byId.get(null)?.actors||0});
}
