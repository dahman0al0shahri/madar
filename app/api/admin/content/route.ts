import {monitoredSave} from '../../../../lib/service-alerts.mjs';
import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../../chatgpt-auth';
import {contentRequest} from '../../../../lib/content-store.mjs';
export const dynamic='force-dynamic';
async function handle(req:Request){try{return await monitoredSave(req,env.DB,'content',async()=>contentRequest(req,env.DB,await getChatGPTUser()));}catch{return Response.json({error:'unavailable'},{status:503,headers:{'Cache-Control':'no-store'}});}}
export const GET=handle;
export const POST=handle;
