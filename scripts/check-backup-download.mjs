import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source=readFileSync(new URL('../public/madar-persistence.js',import.meta.url),'utf8');
for(const mode of ['top','same-origin','cross-origin']){
 const events=[];
 const host=label=>({location:{origin:'https://madar.test'},URL:{createObjectURL(blob){events.push({label,blob});return 'blob:test';},revokeObjectURL(){}},setTimeout(){},document:{body:{appendChild(a){a.connected=true;}},createElement(){return {click(){assert.equal(this.connected,true);events.push({label,name:this.download});},remove(){this.connected=false;}}}}});
 const child=host('child'),parent=host('parent');child.parent=child;parent.parent=parent;
 if(mode==='same-origin')child.parent=parent;
 if(mode==='cross-origin')child.parent={get location(){throw new Error('SecurityError');}};
 const storage={getItem(){return null;},setItem(){}};
 const context={window:child,location:child.location,localStorage:storage,sessionStorage:storage,structuredClone,Blob,AbortSignal,crypto:globalThis.crypto,addEventListener(){},fetch:async()=>({ok:true,json:async()=>({user:null})})};
 runInNewContext(source,context);
 const store=await child.MadarStore.open('network');
 await store.save({labs:[{name:'synthetic QA',devices:['S1']}]});store.download();
 assert.equal(events[0].label,mode==='same-origin'?'parent':'child');
 assert.equal(events[1].name,'madar-network-backup.json');
 assert.deepEqual(JSON.parse(await events[0].blob.text()),{kind:'network',owner:'guest',snapshot:{labs:[{name:'synthetic QA',devices:['S1']}]}});
 console.log('PASS backup '+mode);
}
