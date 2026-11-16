import {monitoredSave} from '../../../../lib/service-alerts.mjs';
import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../../chatgpt-auth';
import {readFeedback,manageFeedback} from '../../../../lib/feedback-center.mjs';
export const dynamic='force-dynamic';
export async function GET(req:Request){try{return await readFeedback(req,env.DB,await getChatGPTUser());}catch{return Response.json({error:'unavailable'},{status:503,headers:{'Cache-Control':'no-store'}});}}
export async function POST(req:Request){try{return await monitoredSave(req,env.DB,'inbox',async()=>manageFeedback(req,env.DB,await getChatGPTUser()));}catch{return Response.json({error:'unavailable'},{status:503,headers:{'Cache-Control':'no-store'}});}}
