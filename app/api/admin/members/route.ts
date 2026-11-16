import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../../chatgpt-auth';
import {readMembers,changeMembership,privateHeaders} from '../../../../lib/office-access.mjs';
export const dynamic='force-dynamic';
export async function GET(req:Request){try{return await readMembers(req,env.DB,await getChatGPTUser());}catch{return Response.json({error:'unavailable'},{status:503,headers:privateHeaders});}}
export async function POST(req:Request){try{return await changeMembership(req,env.DB,await getChatGPTUser());}catch{return Response.json({error:'unavailable'},{status:503,headers:privateHeaders});}}
