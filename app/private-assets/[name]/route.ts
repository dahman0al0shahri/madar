import {denied} from '../../../lib/private-review-access.mjs';
import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../chatgpt-auth';
import {privateAsset} from '../../../lib/private-review-access.mjs';
import review from '../../../lib/private-assets/night-review.js?raw';
import css from '../../../lib/private-assets/night-review-style.txt?raw';
import space from '../../../lib/private-assets/night-space.js?raw';
import admin from '../../../lib/private-assets/night-admin.js?raw';
import members from '../../../lib/private-assets/members-admin.js?raw';
export const dynamic='force-dynamic';
export async function GET(req:Request){return privateAsset(env.DB,await getChatGPTUser(),new URL(req.url).pathname.split('/').pop(),{'night-review.js':review,'night-review.css':css,'night-space.js':space,'night-admin.js':admin,'members-admin.js':members});}

export const OPTIONS=denied;export const PUT=denied;export const PATCH=denied;export const DELETE=denied;
export const POST=denied;
