import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../chatgpt-auth';
import {configFor,lessonPermitted,reply} from '../../../lib/madar-state.mjs';
import BANK from '../../../lib/srwe-bank.json';
export const dynamic='force-dynamic';
export async function GET(){try{const user=await getChatGPTUser(),{config}=await configFor(env.DB);if(![4,5,6].every(c=>lessonPermitted(config,'network-srwe-'+c,user)))return reply({error:'forbidden'},403);return reply(BANK);}catch{return reply({error:'unavailable'},503);}}
