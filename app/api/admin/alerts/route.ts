import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../../chatgpt-auth';
import {readAlerts,manageAlerts} from '../../../../lib/service-alerts.mjs';
export const dynamic='force-dynamic';
export async function GET(req:Request){try{return await readAlerts(req,env.DB,await getChatGPTUser());}catch{return Response.json({error:'monitor_unavailable'},{status:503,headers:{'Cache-Control':'no-store'}});}}
export async function POST(req:Request){try{return await manageAlerts(req,env.DB,await getChatGPTUser());}catch{return Response.json({error:'monitor_unavailable'},{status:503,headers:{'Cache-Control':'no-store'}});}}
