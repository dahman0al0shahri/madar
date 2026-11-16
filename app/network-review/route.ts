import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../chatgpt-auth';
import {configFor,lessonPermitted} from '../../lib/madar-state.mjs';
import html from '../../lib/srwe-review.html?raw';
export const dynamic='force-dynamic';
export async function GET(){try{const user=await getChatGPTUser(),{config}=await configFor(env.DB);if(![4,5,6].every(c=>lessonPermitted(config,'network-srwe-'+c,user)))return new Response('مرجع المراجعة غير متاح لهذا الحساب.',{status:403,headers:{'Cache-Control':'private, no-store'}});return new Response(html,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'private, no-store','Vary':'Cookie','X-Content-Type-Options':'nosniff'}});}catch{return new Response('تعذر تحميل المرجع. أعد المحاولة.',{status:503});}}
