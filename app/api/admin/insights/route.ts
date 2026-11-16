import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../../chatgpt-auth';
import {readInsights} from '../../../../lib/insights.mjs';
export const dynamic='force-dynamic';
export async function GET(req:Request){try{return await readInsights(req,env.DB,await getChatGPTUser());}catch{return Response.json({error:'unavailable'},{status:503,headers:{'Cache-Control':'no-store'}});}}
