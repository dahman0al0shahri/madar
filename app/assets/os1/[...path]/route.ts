import {env} from 'cloudflare:workers';
import {mediaResponse} from '../../../../lib/media-response.mjs';
export const dynamic='force-dynamic';
async function handle(req:Request){try{return await mediaResponse(req,env.BUCKET);}catch{return new Response('Media temporarily unavailable',{status:503,headers:{'Cache-Control':'no-store'}});}}
export const GET=handle;export const HEAD=handle;
