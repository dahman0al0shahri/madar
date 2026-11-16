import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../chatgpt-auth';
import {networkAllowed,configFor,lessonPermitted} from '../../lib/madar-state.mjs';
import html from '../../lib/network-simulator.html?raw';
export const dynamic='force-dynamic';
export async function GET(request:Request){try{const user=await getChatGPTUser(),{config}=await configFor(env.DB),id=new URL(request.url).searchParams.get('lesson');if(!await networkAllowed(env.DB,user)||(id&&!lessonPermitted(config,id,user)))return new Response('المحتوى غير متاح',{status:403,headers:{'Cache-Control':'private, no-store'}});const filtered=html.replace(/window\.MadarPracticalCatalog=(\[[^\n]*\]);/,(_match,json)=>'window.MadarPracticalCatalog='+JSON.stringify(JSON.parse(json).filter((l:{id:string})=>lessonPermitted(config,l.id,user)))+';');return new Response(filtered,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'private, no-store','Vary':'Cookie','X-Content-Type-Options':'nosniff'}});}catch{return new Response('تعذر فتح المختبر؛ أعد المحاولة',{status:503});}}
