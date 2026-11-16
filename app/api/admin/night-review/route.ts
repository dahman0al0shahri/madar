import {denied} from '../../../../lib/private-review-access.mjs';
import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../../chatgpt-auth';
import {nightAdmin} from '../../../../lib/night-review.mjs';
import {monitoredSave} from '../../../../lib/service-alerts.mjs';
export const dynamic='force-dynamic';
async function handle(req:Request){return monitoredSave(req,env.DB,'nightcontent',async()=>nightAdmin(req,env.DB,await getChatGPTUser()));}
export const GET=handle;export const POST=handle;
export const OPTIONS=denied;export const PUT=denied;export const PATCH=denied;export const DELETE=denied;
