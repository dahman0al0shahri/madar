import fs from 'node:fs';import path from 'node:path';
import manifest from '../lib/os-media-manifest.json' with {type:'json'};
// Originals stay in public/ and Git. Only the deployment copy omits R2-backed bytes.
export function mediaPublicDir(){
 const root=process.cwd(),source=path.join(root,'public'),runtime=path.join(root,'.sites-runtime');fs.mkdirSync(runtime,{recursive:true});
 const target=fs.mkdtempSync(path.join(runtime,'media-static-'));
 fs.cpSync(source,target,{recursive:true,filter:file=>!Object.hasOwn(manifest.files,path.relative(source,file).split(path.sep).join('/'))});return target;
}
