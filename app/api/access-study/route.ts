import {monitoredSave} from '../../../lib/service-alerts.mjs';
import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../chatgpt-auth';
import {excelStudy} from '../../../lib/excel-study.mjs';
export const dynamic='force-dynamic';
async function handle(req:Request){try{return await monitoredSave(req,env.DB,'access',async()=>excelStudy(req,env.DB,await getChatGPTUser(),'Access'));}catch{return Response.json({error:'unavailable'},{status:503,headers:{'Cache-Control':'private, no-store','Vary':'Cookie'}});}}
export const GET=handle;export const POST=handle;
