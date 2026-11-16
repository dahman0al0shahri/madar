import {monitoredSave} from '../../../lib/service-alerts.mjs';
import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../../chatgpt-auth';
import { activitySession, recordActivity } from '../../../lib/activity.mjs';
export const dynamic='force-dynamic';
export async function GET(request:Request){return activitySession(request,await getChatGPTUser());}
export async function POST(request:Request){try{return await monitoredSave(request,env.DB,'activity',async()=>recordActivity(request,env.DB,await getChatGPTUser()));}catch{return Response.json({error:'unavailable'},{status:503,headers:{'Cache-Control':'no-store'}});}}
