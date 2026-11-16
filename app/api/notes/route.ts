import {monitoredSave} from '../../../lib/service-alerts.mjs';
import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../chatgpt-auth';
import {notesRequest} from '../../../lib/notes.mjs';
export const dynamic='force-dynamic';
async function handle(request:Request){try{return await monitoredSave(request,env.DB,'notes',async()=>notesRequest(request,env.DB,await getChatGPTUser()));}catch{return Response.json({error:'unavailable'},{status:503,headers:{'Cache-Control':'no-store'}});}}
export const GET=handle;export const PUT=handle;
