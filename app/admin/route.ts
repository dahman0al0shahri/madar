import { getChatGPTUser,chatGPTSignInPath } from '../chatgpt-auth';
import { isActivityAdmin } from '../../lib/activity.mjs';
import html from '../../lib/activity-admin.html?raw';
export const dynamic='force-dynamic';
export async function GET(request:Request){
 const user=await getChatGPTUser();
 if(!user)return Response.redirect(new URL(chatGPTSignInPath('/admin'),request.url),302);
 if(!isActivityAdmin(user))return new Response('هذه الصفحة مخصصة لإدارة مَدار.',{status:403,headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'}});
 return new Response(html,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
}
