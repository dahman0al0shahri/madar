import {env} from 'cloudflare:workers';
import {registerAccount,accessFor} from '../../../lib/office-access.mjs';
import { getChatGPTUser, chatGPTSignInPath, chatGPTSignOutPath } from '../../chatgpt-auth';
import { isActivityAdmin } from '../../../lib/activity.mjs';
import {extraNavigation} from '../../../lib/private-review-access.mjs';
export const dynamic='force-dynamic';
export async function GET(){
 const user=await getChatGPTUser();
 let accountDirectoryAvailable=true;let accountCode=null;try{accountCode=await registerAccount(env.DB,user);}catch{accountDirectoryAvailable=false;}
 let canAccessExcel=false;try{canAccessExcel=(await accessFor(env.DB,user)).allowed;}catch{}
 return Response.json({...await extraNavigation(env.DB,user),canAccessExcel,accountDirectoryAvailable,user:user?{id:user.userId,name:user.displayName,code:accountCode||null}:null,isAdmin:isActivityAdmin(user),signIn:chatGPTSignInPath('/account'),signOut:chatGPTSignOutPath('/')},{headers:{'Cache-Control':'private, no-store','Vary':'Cookie'}});
}
