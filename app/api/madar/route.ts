import {env} from 'cloudflare:workers';
import {getChatGPTUser,chatGPTSignInPath,chatGPTSignOutPath} from '../../chatgpt-auth';
import {isActivityAdmin} from '../../../lib/activity.mjs';
import {configFor,permitted,lessonPermitted,networkAllowed,reply} from '../../../lib/madar-state.mjs';
import {COURSE_REGISTRY} from '../../../lib/course-base.mjs';
import {readCatalog} from '../../../lib/course-catalog.mjs';
export const dynamic='force-dynamic';
export async function GET(){try{
 const user=await getChatGPTUser(),admin=isActivityAdmin(user),{config}=await configFor(env.DB),catalog=await readCatalog(env.DB);
 const day=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Riyadh',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const allowed=COURSE_REGISTRY.map(c=>c.id).filter(id=>permitted(config,id,user));
 const lessons=catalog.data.lessons.filter(l=>lessonPermitted(config,l.id,user)).map(l=>({id:l.id,course:l.subject==='OS1'?'os1':l.subject==='Network'?'network':'office',section:['Network','OS1'].includes(l.subject)?l.section:l.subject.toLowerCase(),title:l.title,practice:!!l.practice,kind:l.section==='practice-guide'?'مختبر عملي':l.section==='theory'?'درس نظري':l.subject==='Network'?'مختبر':'درس',intro:l.summary||'',steps:l.steps||['الشرح والتطبيق والمراجعة'],source:l.source||null,theory:l.theory||null,scenes:l.scenes||null,seconds:l.seconds||null}));
 const updates=config.updates.filter(u=>u.status==='published'&&(!u.course||allowed.includes(u.course))&&(!u.target.startsWith('course:')||allowed.includes(u.target.split(':')[1]))&&(!u.target.startsWith('lesson:')||lessons.some(l=>'lesson:'+l.id===u.target))&&(!u.start||u.start<=day)&&(!u.end||u.end>=day));
 const notes=user?(await env.DB.prepare('SELECT lesson,note FROM lesson_notes WHERE user_id=?').bind(user.userId).all()).results.filter((n:any)=>lessons.some(l=>l.id===n.lesson)):[];
 const srwe=user&&allowed.includes('network')?await env.DB.prepare("SELECT snapshot FROM madar_states WHERE owner=? AND kind='srwe'").bind(user.userId).first():null;const rs=srwe?JSON.parse((srwe as any).snapshot):null;const review=rs?{wrong:Object.values(rs.meta||{}).filter((m:any)=>m.mistakes>0).length,marked:Object.values(rs.meta||{}).filter((m:any)=>m.marked).length,answered:Object.values(rs.study||{}).filter((r:any)=>r.graded).length}:null;
 return reply({review,account:{user:user?{id:user.userId,name:user.displayName}:null,isAdmin:admin,signIn:chatGPTSignInPath('/'),signOut:chatGPTSignOutPath('/')},courses:COURSE_REGISTRY.filter(c=>allowed.includes(c.id)).map(({id,name})=>({id,name})),allowed,canPractice:await networkAllowed(env.DB,user),lessons,notes,config:{version:1,access:Object.fromEntries(['office','network','os1'].map(id=>[id,allowed.includes(id)?'public':'draft'])),contentAccess:{},updates}});
 }catch{return reply({error:'unavailable'},503);}}
