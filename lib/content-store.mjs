import {correctUnitNames} from './course-unit-names.mjs';
import {EXCEL_BASE,ACCESS_BASE,courseFrom,COURSES} from './course-base.mjs';
import base from './content-base.json' with {type:'json'};
import {isActivityAdmin} from './activity.mjs';
export const BASE=base;
const json=(v,status=200)=>Response.json(v,{status,headers:{'Cache-Control':'no-store','Vary':'Cookie','X-Content-Type-Options':'nosniff'}});
const text=(v,n,min=0)=>typeof v==='string'&&v.length>=min&&v.length<=n;
const keys=(v,allowed)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).every(k=>allowed.includes(k));
const int=(v,a,b)=>Number.isInteger(v)&&v>=a&&v<=b;
export const lessonId=v=>typeof v==='string'&&/^(?:v\d{2,3}|access-(?:u\d{2}-\d{2}|custom-\d{3})|excel-(?:[A-Za-z0-9_-]{11}|workbook-\d{2}|custom-\d{3}))$/.test(v);
export const questionId=v=>typeof v==='string'&&/^(?:mcq26-\d{3}|access-mcq-\d{3}|excel-mcq-\d{3})$/.test(v);
function url(v,video=false){try{const u=new URL(v);return u.protocol==='https:'&&!u.username&&!u.password&&(video?['www.youtube.com','youtube.com'].includes(u.hostname)&&u.pathname==='/watch'&&/^[\w-]{11}$/.test(u.searchParams.get('v')||''):true);}catch{return false;}}
function safeHTML(s){return text(s,30000)&&s.replace(/<\/?(?:p|ol|ul|li|strong|em|b|br|code|span|h[1-6])\s*\/?>|<p class="table-row">/g,'').indexOf('<')===-1;}
export function validateContent(d,previous=base,subject='Word'){
 const excel=subject==='Excel',access=subject==='Access',units=access?(d.unitNames?.length===10?10:18):excel?(d.unitNames?.length===6?6:13):10;
 const errors=[];const bad=m=>{if(errors.length<25)errors.push(m);};
 if(!keys(d,['lessons','questions','unitNames','version','fullBankCount','bankVersion'])||!Array.isArray(d.lessons)||!Array.isArray(d.questions)||!Array.isArray(d.unitNames))return ['بنية المحتوى غير صالحة.'];
 if(d.unitNames.length!==units||d.unitNames.some(x=>!text(x,150,1)))bad('تحقق من أسماء وحدات المقرر.');
 if(!text(d.version,80,1)||!/^[\w.-]+$/.test(d.version)||!text(d.bankVersion,80,1)||!/^[\w.-]+$/.test(d.bankVersion)||!int(d.fullBankCount,1,1000))bad('بيانات إصدار المحتوى غير صالحة.');
 if(d.lessons.length<24||d.lessons.length>200||d.questions.length<50||d.questions.length>1000)bad('عدد الدروس أو الأسئلة خارج النطاق.');
 const ids=new Set(),qids=new Set();
 for(const [i,l]of d.lessons.entries()){
  const tag='الدرس '+(i+1)+': ';
  if(!keys(l,['id','number','sourceNumber','unit','title','sections','example','difference','steps','video','references','provenance','locator','source_limit'])){bad(tag+'حقول غير معروفة.');continue;}
  if(!lessonId(l.id)||ids.has(l.id))bad(tag+'معرّف مكرر أو غير صالح.');ids.add(l.id);
  if(l.number!==i+1||!int(l.sourceNumber,0,999)||!int(l.unit,1,units)||!text(l.title,200,1)||!text(l.example,5000)||!['secondary','general','manual'].includes(l.provenance))bad(tag+'العنوان أو الترتيب أو الوحدة غير صالح.');
  if(!((excel||access)&&l.video==='')&&!url(l.video,true))bad(tag+'أدخل رابط مشاهدة YouTube صحيحًا.');
  if(!Array.isArray(l.references)||l.references.length>20||l.references.some(v=>!text(v,2000)||!url(v)))bad(tag+'رابط المرجع يجب أن يبدأ بـ https.');
  for(const name of ['difference','steps'])if(!Array.isArray(l[name])||l[name].length>40||l[name].some(v=>!text(v,3000)))bad(tag+'قائمة النصوص غير صالحة.');
  if(!Array.isArray(l.sections)||l.sections.length<1||l.sections.length>30){bad(tag+'أضف قسمًا واحدًا على الأقل.');continue;}
  if(!l.sections.some(s=>s?.kind==='summary'))bad(tag+'أضف قسم ملخص للحفظ.');
  for(const s of l.sections)if(!keys(s,['title','html','kind','text','table'])||!text(s.title,200,1)||!['concept','steps','example','summary'].includes(s.kind)||!safeHTML(s.html)||!s.html.replace(/<[^>]*>/g,'').trim())bad(tag+'نص قسم أو تنسيقه غير صالح.');
 }
 for(const [i,q]of d.questions.entries()){
  const tag='السؤال '+(i+1)+': ';
  if(!keys(q,['id','lesson','unit','type','prompt','options','answer','explanation','rationales','trial','source','paused'])){bad(tag+'حقول غير معروفة.');continue;}
  if(q.paused!==undefined&&typeof q.paused!=='boolean')bad(tag+'حالة الإيقاف غير صالحة.');
  if(!questionId(q.id)||qids.has(q.id))bad(tag+'معرّف مكرر أو غير صالح.');qids.add(q.id);
  if(!ids.has(q.lesson)||q.unit!==d.lessons.find(l=>l?.id===q.lesson)?.unit||q.type!=='mcq'||q.trial!==true||!text(q.prompt,4000,1))bad(tag+'تحقق من النص والدرس والوحدة.');
  if(!Array.isArray(q.options)||q.options.length!==4||q.options.some(x=>!text(x,2000,1))||new Set(q.options.map(x=>typeof x==='string'?x.trim():x)).size!==4||!int(q.answer,0,3))bad(tag+'يلزم أربعة بدائل مختلفة وإجابة صحيحة واحدة.');
  if(!text(q.explanation,5000,1)||!Array.isArray(q.rationales)||q.rationales.length!==4||q.rationales.some(x=>!text(x,3000,1)))bad(tag+'أكمل تفسير الإجابة والبدائل.');
  const s=q.source;if(!keys(s,['lesson','section','excerpt','video','basis','verification'])||s.lesson!==q.lesson||!text(s.section,300,1)||!text(s.excerpt,5000,1)||!url(s.video,subject==='Word')||!text(s.basis,120,1)||!text(s.verification,150,1))bad(tag+'أكمل موضع السؤال ومقتطفه ورابطه في المصدر.');
 }
 if(excel||access){for(const l of d.lessons){if(!l.id.startsWith(subject.toLowerCase()+'-')||l.sections.some(s=>!text(s.text,15000)||s.table&&(!Array.isArray(s.table.headers)||!Array.isArray(s.table.rows)||JSON.stringify(s.table).length>30000)))bad('نص أو جدول المقرر غير صالح.');}if(d.questions.some(q=>!q.id.startsWith(subject.toLowerCase()+'-mcq-')))bad('معرف سؤال لا يخص المقرر.');}else if(d.lessons.some(l=>!/^v\d+$/.test(l.id))||d.questions.some(q=>!q.id.startsWith('mcq26-')))bad('المحتوى لا يخص الوورد.');
 if(previous.lessons.some(l=>!ids.has(l.id))||previous.questions.some(q=>!qids.has(q.id)))bad('لا يمكن حذف معرّفات محفوظة؛ عدّل محتواها للحفاظ على روابط الطلاب.');
 return errors;
}
const getRow=(db,subject='Word')=>db.prepare('SELECT * FROM content_workspace WHERE id=?').bind(subject==='Access'?3:subject==='Excel'?2:1).first();
export async function readContent(db,preview=false,subject='Word'){
 const base=subject==='Access'?ACCESS_BASE:subject==='Excel'?EXCEL_BASE:BASE;if(!db)return {data:structuredClone(base),revision:0,publishedId:'base'};
 const row=await getRow(db,subject);if(preview)return {data:row?correctUnitNames(JSON.parse(row.draft),subject):structuredClone(base),revision:row?.revision||0,publishedId:row?.published_id||'base'};
 if(!row?.published_id)return {data:structuredClone(base),publishedId:'base'};
 const v=await db.prepare('SELECT payload,id FROM content_versions WHERE id=?').bind(row.published_id).first();if(!v)throw Error('Missing published version');return {data:correctUnitNames(JSON.parse(v.payload),subject),publishedId:v.id};
}
export async function publicContent(req,db,user){
 const subject=courseFrom(req);if(!COURSES.includes(subject))return json({error:'subject'},400);const preview=new URL(req.url).searchParams.get('preview')==='1';if(preview&&!isActivityAdmin(user))return json({error:'forbidden'},user?403:401);
 if(!db)return json({error:'unavailable'},503);const result=await readContent(db,preview,subject);return json({...result,data:{...result.data,questions:result.data.questions.filter(q=>!q.paused)}});
}
export async function contentRequest(req,db,user){
 if(!user)return json({error:'sign_in_required'},401);if(!isActivityAdmin(user))return json({error:'forbidden'},403);if(!db)return json({error:'unavailable'},503);
 const subject=courseFrom(req);if(!COURSES.includes(subject))return json({error:'subject'},400);const base=subject==='Access'?ACCESS_BASE:subject==='Excel'?EXCEL_BASE:BASE,wid=subject==='Access'?3:subject==='Excel'?2:1;
 if(req.method==='GET'){
  const result=await readContent(db,true,subject),history=await db.prepare("SELECT id,created_at,label FROM content_versions WHERE json_extract(payload,'$.lessons[0].id') LIKE ? ORDER BY created_at DESC LIMIT 50").bind(subject==='Word'?'v%':subject.toLowerCase()+'-%').all();return json({...result,subject,owner:user.userId,history:[...history.results,{id:'base',created_at:null,label:'نسخة البداية الأصلية'}]});
 }
 if(req.method!=='POST')return json({error:'method'},405);
 if(req.headers.get('origin')!==new URL(req.url).origin||req.headers.get('sec-fetch-site')==='cross-site')return json({error:'origin'},403);
 if(!req.headers.get('content-type')?.startsWith('application/json'))return json({error:'content_type'},415);
 const reader=req.body?.getReader();if(!reader)return json({error:'body'},400);let bytes=0,raw='';const decoder=new TextDecoder();while(true){const {value,done}=await reader.read();if(done)break;bytes+=value.length;if(bytes>1500000){await reader.cancel();return json({error:'too_large'},413);}raw+=decoder.decode(value,{stream:true});}raw+=decoder.decode();
 let body;try{body=JSON.parse(raw);}catch{return json({error:'body'},400);}
 if(!keys(body,['action','revision','data','versionId','label','owner'])||!int(body.revision,0,2147483646)||body.owner!==user.userId||!['save','publish','restore'].includes(body.action))return json({error:'request'},400);
 const row=await getRow(db,subject);if((row?.revision||0)!==body.revision)return json({error:'conflict'},409);
 const previous=row?JSON.parse(row.draft):base,now=new Date().toISOString();
 if(body.action==='save'||body.action==='restore'){
  let data=body.data;
  if(body.action==='restore'){if(body.versionId==='base')data=base;else{if(!text(body.versionId,80,1))return json({error:'version'},400);const v=await db.prepare('SELECT payload FROM content_versions WHERE id=?').bind(body.versionId).first();if(!v)return json({error:'not_found'},404);data=JSON.parse(v.payload);}}
  const errors=validateContent(data,body.action==='restore'?base:previous,subject);if(errors.length)return json({error:'validation',errors},400);
  const payload=JSON.stringify(data);const changed=body.revision===0?await db.prepare('INSERT INTO content_workspace(id,draft,revision,published_id,updated_at) VALUES(?, ?,1,NULL,?) ON CONFLICT(id) DO NOTHING').bind(wid,payload,now).run():await db.prepare('UPDATE content_workspace SET draft=?,revision=revision+1,updated_at=? WHERE id=? AND revision=?').bind(payload,now,wid,body.revision).run();
  if(changed.meta.changes!==1)return json({error:'conflict'},409);return json({revision:body.revision+1,...(body.action==='restore'?{data}:{})});
 }
 if(!row)return json({error:'save_first'},400);const errors=validateContent(previous,base,subject);if(errors.length)return json({error:'validation',errors},400);
 if(!text(body.label,200,1))return json({error:'label'},400);
 const id=crypto.randomUUID(),current=await readContent(db,false,subject);previous.fullBankCount=previous.questions.length;previous.bankVersion=JSON.stringify(previous.questions)===JSON.stringify(current.data.questions)?current.data.bankVersion:'cms-'+id;previous.version='cms-'+id;
 const result=await db.batch([
  db.prepare('INSERT INTO content_versions(id,payload,label,created_at,actor) SELECT ?,?,?,?,? FROM content_workspace WHERE id=? AND revision=?').bind(id,JSON.stringify(previous),body.label,now,user.userId,wid,body.revision),
  db.prepare('UPDATE content_workspace SET published_id=?,revision=revision+1,updated_at=? WHERE id=? AND revision=? AND EXISTS(SELECT 1 FROM content_versions WHERE id=?)').bind(id,now,wid,body.revision,id)
 ]);
 if(result[0].meta.changes!==1||result[1].meta.changes!==1)return json({error:'conflict'},409);
 return json({revision:body.revision+1,publishedId:id});
}
