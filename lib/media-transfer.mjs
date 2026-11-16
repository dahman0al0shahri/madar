import {createHash} from 'node:crypto';
import manifest from './os-media-manifest.json' with {type:'json'};
const control='madar100/control/'+manifest.sha256;
const json=(value,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'private, no-store'}});
async function read(bucket,key){const o=await bucket.get(key);return o?o.json():null;}
export async function mediaTransfer(req,bucket,admin){
 if(!admin)return json({error:'forbidden'},403);
 if(!bucket)return json({error:'storage_unavailable'},503);
 const url=new URL(req.url);
 if(req.method!=='GET'&&(req.headers.get('origin')!==url.origin||req.headers.get('sec-fetch-site')==='cross-site'))return json({error:'origin'},403);
 const ready=await bucket.head(manifest.key);
 if(ready&&ready.size===manifest.size&&ready.customMetadata?.sha256===manifest.sha256)return json({ready:true,files:Object.keys(manifest.files).length,size:ready.size});
 let state=await read(bucket,control+'/upload');
 if(req.method==='GET')return json({ready:false,parts:manifest.parts,completed:state?await Promise.all(manifest.parts.map(p=>read(bucket,control+'/part-'+p.number))):[]});
 const action=url.searchParams.get('action');
 if(action==='start'){
  if(!state){const upload=await bucket.createMultipartUpload(manifest.key,{httpMetadata:{contentType:'application/octet-stream'},customMetadata:{sha256:manifest.sha256}});state={uploadId:upload.uploadId};await bucket.put(control+'/upload',JSON.stringify(state));}
  return json({started:true});
 }
 if(!state)return json({error:'start_required'},409);
 const upload=bucket.resumeMultipartUpload(manifest.key,state.uploadId);
 if(action==='part'){
  const part=manifest.parts.find(p=>p.number===Number(url.searchParams.get('part')));
  if(!part||!req.body||Number(req.headers.get('content-length'))!==part.size)return json({error:'part_size'},400);
  const fixed=new FixedLengthStream(part.size),reader=req.body.getReader(),writer=fixed.writable.getWriter(),digest=createHash('sha256');let received=0;
  const pump=(async()=>{try{while(true){const r=await reader.read();if(r.done)break;received+=r.value.byteLength;if(received>part.size)throw Error('size');digest.update(r.value);await writer.write(r.value);}if(received!==part.size||digest.digest('hex')!==part.sha256)throw Error('checksum');await writer.close();}catch(e){await writer.abort(e);throw e;}})();
  try{const [result]=await Promise.all([upload.uploadPart(part.number,fixed.readable),pump]);const record={...result,uploadId:state.uploadId,sha256:part.sha256,size:part.size};await bucket.put(control+'/part-'+part.number,JSON.stringify(record));return json({uploaded:part.number,verified:true});}catch{return json({error:'upload_or_checksum_failed'},400);}
 }
 if(action==='complete'){
  const parts=await Promise.all(manifest.parts.map(p=>read(bucket,control+'/part-'+p.number)));
  if(parts.some((p,i)=>!p||p.uploadId!==state.uploadId||p.sha256!==manifest.parts[i].sha256))return json({error:'incomplete'},409);
  await upload.complete(parts.map(({partNumber,etag})=>({partNumber,etag})));
  const head=await bucket.head(manifest.key);return json({ready:head?.size===manifest.size,files:Object.keys(manifest.files).length,size:head?.size});
 }
 return json({error:'action'},400);
}
