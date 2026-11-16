import lessons from './feedback-lessons.json' with { type: 'json' };
const reply=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const digest=async value=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))).map(v=>v.toString(16).padStart(2,'0')).join('');
export async function feedbackRequest(req,db){
 if(req.method!=='POST')return reply({error:'method_not_allowed'},405);
 if(req.headers.get('origin')!==new URL(req.url).origin||req.headers.get('sec-fetch-site')==='cross-site')return reply({error:'origin_rejected'},403);
 if(!req.headers.get('content-type')?.startsWith('application/json'))return reply({error:'json_required'},415);
 if(!db)return reply({error:'unavailable'},503);
 const reader=req.body?.getReader();if(!reader)return reply({error:'invalid'},400);
 let raw='',size=0;const decoder=new TextDecoder();
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>16000){await reader.cancel();return reply({error:'too_large'},413)}raw+=decoder.decode(value,{stream:true})}raw+=decoder.decode();
 let body;try{body=JSON.parse(raw)}catch{return reply({error:'invalid'},400)}
 if(!body||typeof body!=='object'||Object.keys(body).some(k=>!['lesson','message','website'].includes(k))||typeof body.message!=='string'||body.message.trim().length<3||body.message.length>3000||!Object.hasOwn(lessons,body.lesson)||body.website)return reply({error:'invalid'},400);
 const now=Date.now(),hour=Math.floor(now/3600000),minute=Math.floor(now/60000);
 // Only bounded, expiring abuse counters are retained; no feedback text or raw IP.
 const visitor=await digest(`${hour}:${req.headers.get('cf-connecting-ip')||'unknown'}`);
 await db.prepare('DELETE FROM feedback_limits WHERE expires_at < ?').bind(now).run();
 for(const [key,limit,ttl] of [[`m:${minute}:${visitor}`,2,120000],[`h:${hour}:${visitor}`,10,7200000],[`g:${hour}`,100,7200000]]){
  const row=await db.prepare('INSERT INTO feedback_limits (key, count, expires_at) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count = count + 1 RETURNING count').bind(key,now+ttl).first();
  if(row.count>limit)return reply({error:'rate_limited'},429);
 }
 return reply({ready:true});
}
