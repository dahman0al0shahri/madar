import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../../chatgpt-auth';
import {isActivityAdmin} from '../../../../lib/activity.mjs';
import {mediaTransfer} from '../../../../lib/media-transfer.mjs';
export const dynamic='force-dynamic';
async function handle(req:Request){try{return await mediaTransfer(req,env.BUCKET,isActivityAdmin(await getChatGPTUser()));}catch{return Response.json({error:'storage_error'},{status:503});}}
export const GET=handle;export const POST=handle;
