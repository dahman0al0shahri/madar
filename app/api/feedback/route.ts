import { env } from 'cloudflare:workers';
import { feedbackRequest } from '../../../lib/feedback.mjs';
export const dynamic='force-dynamic';
export async function POST(request:Request){
 try{return await feedbackRequest(request,env.DB);}
 catch{return Response.json({error:'unavailable'},{status:503,headers:{'Cache-Control':'no-store'}});}
}
