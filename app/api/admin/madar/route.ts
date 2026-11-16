import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../../chatgpt-auth';
import {stateRequest,reply} from '../../../../lib/madar-state.mjs';
import {monitoredSave} from '../../../../lib/service-alerts.mjs';
export const dynamic='force-dynamic';
async function handle(req:Request){try{return await monitoredSave(req,env.DB,'madar',async()=>stateRequest(req,env.DB,await getChatGPTUser(),true));}catch{return reply({error:'unavailable'},503);}}
export const GET=handle;export const PUT=handle;
