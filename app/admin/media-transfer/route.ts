import {getChatGPTUser,chatGPTSignInPath} from '../../chatgpt-auth';
import {isActivityAdmin} from '../../../lib/activity.mjs';
import html from '../../../lib/media-transfer.html?raw';
export const dynamic='force-dynamic';
export async function GET(req:Request){const user=await getChatGPTUser();if(!user)return Response.redirect(new URL(chatGPTSignInPath('/admin/media-transfer'),req.url),302);if(!isActivityAdmin(user))return new Response('Forbidden',{status:403});return new Response(html,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'private, no-store'}});}
