import {denied} from '../../lib/private-review-access.mjs';
import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../chatgpt-auth';
import {privateResponse} from '../../lib/private-review-access.mjs';
import html from '../../lib/night-review.html?raw';
export const dynamic='force-dynamic';
export async function GET(){return privateResponse(env.DB,await getChatGPTUser(),html);}

export const OPTIONS=denied;export const PUT=denied;export const PATCH=denied;export const DELETE=denied;
export const POST=denied;
