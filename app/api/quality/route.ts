import {monitoredSave} from '../../../lib/service-alerts.mjs';
import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../chatgpt-auth';
import {recordResponses} from '../../../lib/quality.mjs';
export const dynamic='force-dynamic';
export async function POST(req:Request){try{return await monitoredSave(req,env.DB,'quality',async()=>recordResponses(req,env.DB,await getChatGPTUser()));}catch{return Response.json({error:'unavailable'},{status:503,headers:{'Cache-Control':'no-store'}});}}
