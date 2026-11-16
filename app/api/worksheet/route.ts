import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../chatgpt-auth';
import {worksheetRequest} from '../../../lib/worksheet.mjs';
import {monitoredSave} from '../../../lib/service-alerts.mjs';
export const dynamic='force-dynamic';
async function handle(req:Request){try{return await monitoredSave(req,env.DB,new URL(req.url).searchParams.get('lesson')?.startsWith('access-')?'access':'excel',async()=>worksheetRequest(req,env.DB,await getChatGPTUser()));}catch{return Response.json({error:'unavailable'},{status:503,headers:{'Cache-Control':'no-store'}});}}
export const GET=handle;export const PUT=handle;
