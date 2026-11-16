import manifest from './os-media-manifest.json' with {type:'json'};
export function fileRange(value,size){
 if(!value)return {offset:0,length:size,partial:false};
 const m=/^bytes=(\d*)-(\d*)$/.exec(value);if(!m||(!m[1]&&!m[2]))return null;
 let start,end;
 if(!m[1]){const suffix=Number(m[2]);if(!Number.isSafeInteger(suffix)||suffix<=0)return null;start=Math.max(0,size-suffix);end=size-1;}
 else{start=Number(m[1]);end=m[2]?Number(m[2]):size-1;if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>=size||end<start)return null;end=Math.min(end,size-1);}
 return {offset:start,length:end-start+1,partial:true};
}
export async function mediaResponse(req,bucket){
 let key;try{key=decodeURIComponent(new URL(req.url).pathname.slice(1));}catch{return new Response(null,{status:404});}
 const file=manifest.files[key];if(!file)return new Response(null,{status:404});
 if(!bucket)return new Response('Media storage unavailable',{status:503});
 const etag='"'+file.sha256+'"',headers=new Headers({'Content-Type':'video/mp4','Accept-Ranges':'bytes','ETag':etag,'Cache-Control':'public, max-age=86400','X-Content-SHA256':file.sha256,'X-Content-Type-Options':'nosniff'});
 const head=await bucket.head(manifest.key);if(!head||head.size!==manifest.size)return new Response('Media not ready',{status:503,headers:{'Cache-Control':'no-store'}});
 if(req.headers.get('if-none-match')===etag)return new Response(null,{status:304,headers});
 const range=fileRange(req.method==='HEAD'||(req.headers.has('if-range')&&req.headers.get('if-range')!==etag)?null:req.headers.get('range'),file.size);
 if(!range){headers.set('Content-Range','bytes */'+file.size);return new Response(null,{status:416,headers});}
 headers.set('Content-Length',String(range.length));if(range.partial)headers.set('Content-Range',`bytes ${range.offset}-${range.offset+range.length-1}/${file.size}`);
 if(req.method==='HEAD')return new Response(null,{headers});
 const object=await bucket.get(manifest.key,{range:{offset:file.offset+range.offset,length:range.length}});
 if(!object?.body)return new Response('Media unavailable',{status:503,headers:{'Cache-Control':'no-store'}});
 return new Response(object.body,{status:range.partial?206:200,headers});
}
