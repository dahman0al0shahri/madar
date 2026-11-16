import {readContent} from './content-store.mjs';
import {toOffice} from './course-base.mjs';
import {ensureAccountCode,normalizeAccountCode} from './account-codes.mjs';
import {isActivityAdmin} from './activity.mjs';
import activities from './excel-activities.mjs';
import accessTasks from '../public/access-lab-tasks.mjs';
import {lessonGuides} from './excel-guides.mjs';
export const PRODUCT='office-exam-20261012';
export const privateHeaders={'Cache-Control':'private, no-store','Vary':'Cookie','X-Content-Type-Options':'nosniff'};
const json=(v,status=200)=>Response.json(v,{status,headers:privateHeaders});
export async function registerAccount(db,user){
 if(!db||!user)return;
 const now=Date.now();
 await db.prepare('INSERT INTO member_accounts(user_id,email,name,created_at,last_seen) VALUES(?,?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET email=excluded.email,name=excluded.name,last_seen=excluded.last_seen').bind(user.userId,user.email,String(user.displayName||user.email).slice(0,160),now,now).run();
 return ensureAccountCode(db,user.userId);
}
// Owner decision 2026-10-10: course access is free, including guests.
// This is content access only; account records and administration remain private.
export async function accessFor(db,user){return {allowed:true,reason:'free_for_everyone'};}
export async function officeContent(req,db,user,content){
 const permission=await accessFor(db,user);
 if(!permission.allowed)return json({error:permission.reason},user?403:401);
 const subject=new URL(req.url).searchParams.get('subject')||'Excel';
 if(!['Word','Excel','Access'].includes(subject))return json({error:'subject_unavailable'},400);
 if(subject==='Excel'||subject==='Access'){const preview=new URL(req.url).searchParams.get('preview')==='1';if(preview&&!isActivityAdmin(user))return json({error:'forbidden'},user?403:401);content=toOffice((await readContent(db,preview,subject)).data,subject);}
 // Public educational content only. Do not expose private source paths or account data.
 const lessons=content.lessons.filter(x=>x.subject===subject).map(({id,subject,unit,sourceNumber,title,video,summary,sections,references,review_status,locator,source_limit})=>({id,subject,unit,sourceNumber,title,video,summary,sections,references,review_status,locator,source_limit}));
 const questions=content.questions.filter(x=>x.subject===subject).map(({id,subject,unit,lesson,prompt,options,answer,explanation})=>({id,subject,unit,lesson,prompt,options,answer,explanation}));
 return json({bankVersion:content.bankVersion,unitNames:content.unitNames,lessons,questions,subject,activities:subject==='Excel'?activities:subject==='Access'?Object.fromEntries(lessons.filter(l=>accessTasks[l.id]).map(l=>[l.id,{id:accessTasks[l.id].id,type:'access-lab',mission:accessTasks[l.id].mission}])):{},guides:subject==='Excel'?lessonGuides(lessons,activities):{}});
}
export async function readMembers(req,db,user){
 if(!isActivityAdmin(user))return json({error:user?'forbidden':'sign_in_required'},user?403:401);
 if(!db)return json({error:'unavailable'},503);
 const p=new URL(req.url).searchParams,term=(p.get('q')||'').trim();
 const offset=Number(p.get('offset')||0);if(term.length>160||!Number.isSafeInteger(offset)||offset<0)return json({error:'invalid'},400);
 const product=p.get('product')==='night-review-20261012'?'night-review-20261012':PRODUCT;
 const lookupCode=normalizeAccountCode(term);
 const pattern='%'+term.replace(/[\\%_]/g,c=>'\\'+c)+'%';
 // Existing signed-in actors are discoverable even before their next login; guests never qualify.
 const result=await db.prepare(`WITH accounts AS (
 SELECT user_id,email,name,last_seen FROM member_accounts
 UNION ALL SELECT actor_id,NULL,MAX(actor_name),MAX(received_at) FROM activity_events WHERE actor_kind='account' AND actor_id NOT IN (SELECT user_id FROM member_accounts) GROUP BY actor_id
 ) SELECT a.*,c.code,COALESCE(e.id,0) revision,COALESCE(e.action,'none') action,e.created_at changed_at
 FROM accounts a LEFT JOIN account_codes c ON c.user_id=a.user_id LEFT JOIN membership_events e ON e.id=(SELECT MAX(id) FROM membership_events WHERE user_id=a.user_id AND product=?)
 WHERE (? IS NOT NULL AND c.code=?) OR (? IS NULL AND (a.user_id LIKE ? ESCAPE '\\' OR a.email LIKE ? ESCAPE '\\' OR a.name LIKE ? ESCAPE '\\'
 ))
 ORDER BY a.last_seen DESC,a.user_id LIMIT 51 OFFSET ?`).bind(product,lookupCode,lookupCode,lookupCode,pattern,pattern,pattern,offset).all();
 for(const a of result.results.slice(0,50))if(!a.code)a.code=await ensureAccountCode(db,a.user_id);
 const history=p.get('user');let events=[];
 if(history&&history.length<=160)events=(await db.prepare('SELECT id,action,actor_id,created_at FROM membership_events WHERE user_id=? AND product=? ORDER BY id DESC LIMIT 30').bind(history,product).all()).results;
 return json({owner:user.userId,product,items:result.results.slice(0,50),hasMore:result.results.length>50,offset,events});
}

export async function changeMembership(req,db,user){
 if(!isActivityAdmin(user))return json({error:'forbidden'},user?403:401);
 if(!db)return json({error:'unavailable'},503);
 if(req.headers.get('origin')!==new URL(req.url).origin||req.headers.get('sec-fetch-site')==='cross-site')return json({error:'origin'},403);
 if(!req.headers.get('content-type')?.startsWith('application/json'))return json({error:'type'},415);
 const raw=await req.text();if(raw.length>4000)return json({error:'size'},413);let b;try{b=JSON.parse(raw);}catch{return json({error:'body'},400);}
 if(b.product!=='night-review-20261012')return json({error:'course_is_free'},409);
 if(b.owner!==user.userId||typeof b.userId!=='string'||b.userId.length>160||!['grant','revoke'].includes(b.action)||!Number.isSafeInteger(b.revision)||b.revision<0||!/^[0-9a-f-]{36}$/i.test(b.requestId||''))return json({error:'request'},400);
 if(b.userId===user.userId)return json({error:'owner_access'},409);
 if(!await db.prepare('SELECT user_id FROM member_accounts WHERE user_id=?').bind(b.userId).first())return json({error:'unknown_account'},404);
 const prior=await db.prepare('SELECT user_id,product,action FROM membership_events WHERE request_id=?').bind(b.requestId).first();
 if(prior)return prior.user_id===b.userId&&prior.product===b.product&&prior.action===b.action?json({saved:true}):json({error:'request_conflict'},409);
 const r=await db.prepare('INSERT INTO membership_events(request_id,user_id,product,action,actor_id,created_at) SELECT ?,?,?,?,?,? WHERE COALESCE((SELECT MAX(id) FROM membership_events WHERE user_id=? AND product=?),0)=?').bind(b.requestId,b.userId,b.product,b.action,user.userId,Date.now(),b.userId,b.product,b.revision).run();
 return r.meta.changes===1?json({saved:true}):json({error:'conflict'},409);
}
