import {monitoredSave} from '../../../lib/service-alerts.mjs';
import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../../chatgpt-auth';
import { progressRequest } from '../../../lib/progress.mjs';
export const dynamic='force-dynamic';
async function handle(request:Request){
 try{return await monitoredSave(request,env.DB,'progress',async()=>progressRequest(request,env.DB,await getChatGPTUser()));}
 catch{return Response.json({error:'storage_unavailable'},{status:503,headers:{'Cache-Control':'private, no-store'}});}
}
export const GET=handle;
export const PUT=handle;
