import {isActivityAdmin} from './activity.mjs';
export const NIGHT_PRODUCT='night-review-20261012';
export const HEADERS={'Cache-Control':'private, no-store','Vary':'Cookie','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex, nofollow, noarchive','Referrer-Policy':'no-referrer','X-Frame-Options':'DENY'};
export const denied=()=>new Response('Not found',{status:404,headers:{...HEADERS,'Content-Type':'text/plain; charset=utf-8'}});
export async function nightAccess(db,user){
 if(!user)return false;if(isActivityAdmin(user))return true;if(!db)return false;
 try{return (await db.prepare('SELECT action FROM membership_events WHERE user_id=? AND product=? ORDER BY id DESC LIMIT 1').bind(user.userId,NIGHT_PRODUCT).first())?.action==='grant';}catch{return false;}
}
export async function extraNavigation(db,user){return await nightAccess(db,user)?{extraNavigation:[{label:'مراجعة الاختبار',title:'مراجعه قبل يوم الاختبار (مهم)!',href:'/exam-review',after:'home'}]}:{};}
export async function privateResponse(db,user,content,type='text/html; charset=utf-8',admin=false){
 if(admin?!isActivityAdmin(user):!await nightAccess(db,user))return denied();
 return new Response(content,{headers:{...HEADERS,'Content-Type':type}});
}
export const ASSET_POLICY={'night-review.js':false,'night-review.css':false,'night-space.js':false,'night-admin.js':true,'members-admin.js':true};
export async function privateAsset(db,user,name,assets){
 if(!Object.hasOwn(ASSET_POLICY,name)||!Object.hasOwn(assets,name))return denied();
 return privateResponse(db,user,assets[name],name.endsWith('.css')?'text/css; charset=utf-8':'application/javascript; charset=utf-8',ASSET_POLICY[name]);
}
