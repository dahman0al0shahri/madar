import {denied} from '../../../lib/private-review-access.mjs';
import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../chatgpt-auth';
import {nightReview} from '../../../lib/night-review.mjs';
import {registerAccount} from '../../../lib/office-access.mjs';
import {monitoredSave} from '../../../lib/service-alerts.mjs';
export const dynamic='force-dynamic';
async function handle(req:Request){return monitoredSave(req,env.DB,'night',async()=>{const u=await getChatGPTUser();await registerAccount(env.DB,u);return nightReview(req,env.DB,u);});}
export const GET=handle;export const POST=handle;
export const OPTIONS=denied;export const PUT=denied;export const PATCH=denied;export const DELETE=denied;
