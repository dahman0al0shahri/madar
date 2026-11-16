import {getChatGPTUser,chatGPTSignInPath} from '../../chatgpt-auth';
import {isActivityAdmin} from '../../../lib/activity.mjs';
import html from '../../../lib/alerts-admin.html?raw';
export const dynamic='force-dynamic';
export async function GET(req:Request){const user=await getChatGPTUser();if(!user)return Response.redirect(new URL(chatGPTSignInPath('/admin/alerts'),req.url),302);if(!isActivityAdmin(user))return new Response('هذه الصفحة مخصصة لمالك مَدار.',{status:403,headers:{'Cache-Control':'no-store'}});return new Response(html,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});}
