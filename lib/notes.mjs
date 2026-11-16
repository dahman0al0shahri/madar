import {configFor,lessonPermitted} from './madar-state.mjs';
import {readCatalog} from './course-catalog.mjs';
const json=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'private, no-store','Vary':'Cookie','X-Content-Type-Options':'nosniff'}});
import {accessFor} from './office-access.mjs';
import office from './office-content.json' with {type:'json'};
const excelLessons=new Set(office.lessons.filter(l=>l.subject==='Excel').map(l=>l.id));
const validLesson=id=>/^v\d{2,3}$/.test(id||'')||excelLessons.has(id);
export async function notesRequest(req,db,user){
 if(!user)return json({error:'sign_in_required'},401);
 if(!db)return json({error:'unavailable'},503);
 if(new URL(req.url).searchParams.get('owner')!==user.userId)return json({error:'identity_changed'},409);
 const lesson=new URL(req.url).searchParams.get('lesson');if((lesson?.startsWith('network-')||lesson?.startsWith('os1-'))&&!lessonPermitted((await configFor(db)).config,lesson,user))return json({error:'forbidden'},403);if(!(await readCatalog(db)).data.lessons.some(l=>l.id===lesson))return json({error:'invalid_lesson'},400);
 if(excelLessons.has(lesson)&&!(await accessFor(db,user)).allowed)return json({error:'activation_required'},403);
 if(req.method==='GET'){const row=await db.prepare('SELECT note,revision,updated_at FROM lesson_notes WHERE user_id=? AND lesson=?').bind(user.userId,lesson).first();return json({text:row?.note||'',revision:row?.revision||0,updatedAt:row?.updated_at||null});}
 if(req.method!=='PUT')return json({error:'method'},405);
 if(req.headers.get('origin')!==new URL(req.url).origin||req.headers.get('sec-fetch-site')==='cross-site')return json({error:'origin'},403);
 if(!req.headers.get('content-type')?.startsWith('application/json'))return json({error:'json_required'},415);
 const reader=req.body?.getReader();if(!reader)return json({error:'body'},400);let raw='',bytes=0;const decoder=new TextDecoder();
 while(true){const {value,done}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>40000){await reader.cancel();return json({error:'too_large'},413);}raw+=decoder.decode(value,{stream:true});}raw+=decoder.decode();
 let body;try{body=JSON.parse(raw);}catch{return json({error:'body'},400);}
 if(!body||Object.keys(body).some(k=>!['text','revision'].includes(k))||typeof body.text!=='string'||body.text.length>6000||!Number.isInteger(body.revision)||body.revision<0||body.revision>2147483646)return json({error:'invalid_note'},400);
 const now=new Date().toISOString();
 const result=body.revision===0?await db.prepare('INSERT INTO lesson_notes (user_id,lesson,note,revision,updated_at) VALUES (?,?,?,1,?) ON CONFLICT(user_id,lesson) DO NOTHING').bind(user.userId,lesson,body.text,now).run():await db.prepare('UPDATE lesson_notes SET note=?,revision=revision+1,updated_at=? WHERE user_id=? AND lesson=? AND revision=?').bind(body.text,now,user.userId,lesson,body.revision).run();
 if(result.meta.changes!==1)return json({error:'conflict'},409);
 return json({revision:body.revision+1,updatedAt:now});
}
