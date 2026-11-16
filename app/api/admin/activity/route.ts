import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../../../chatgpt-auth';
import { readActivity } from '../../../../lib/activity.mjs';
export const dynamic='force-dynamic';
export async function GET(request:Request){try{return await readActivity(request,env.DB,await getChatGPTUser());}catch{return Response.json({error:'unavailable'},{status:503,headers:{'Cache-Control':'no-store'}});}}
