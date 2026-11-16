import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../public/network-page.js',import.meta.url),'utf8');
function environment({fail=false,embedded=false}={}){
 const nodes=new Map(),listeners={},writes=[];let tick,noteLesson,redirect=null;
 const element=()=>({hidden:false,textContent:'',innerHTML:'',addEventListener(type,fn){listeners[type]=fn;},after(){}});
 for(const id of ['network-page-title','network-page-save','network-content'])nodes.set(id,element());
 const prior={version:1,latest:'office',visits:{office:{lesson:'word-1',step:2}},notes:{keep:'unchanged'},theoryPositions:{chapter1:3}};
 const store={value:structuredClone(prior),conflict:false,save:async next=>{if(fail)throw Error('offline');writes.push(structuredClone(next));store.value=structuredClone(next);}};
 const ctx={document:{hidden:false,body:{classList:{add(){}},prepend(){}},createElement:element,getElementById:id=>nodes.get(id)},location:{assign:x=>redirect=x},setInterval:fn=>(tick=fn,1),clearInterval(){},addEventListener(){},MadarStore:{open:async()=>store,hasPending:()=>false},console};
 ctx.window=ctx;ctx.parent=embedded?{}:ctx;ctx.MADAR_NOTES={mount:async id=>noteLesson=id,retry:async()=>{},hasPending:()=>false};ctx.MADAR_ACTIVITY={emit(){}};
 vm.runInNewContext(source,ctx);
 return {ctx,store,prior,writes,nodes,listeners,tick:()=>tick?.(),get note(){return noteLesson;},get redirect(){return redirect;}};
}
const lab={dataset:{},lessonProgress:()=>({lesson:'network-vlan',step:2,stepTotal:5,labStep:'parking',completed:false}),flushSave:async()=>{}};
const e=environment();await e.ctx.MadarNetworkPage.ready(lab,{id:'network-vlan',title:'VLAN'});
assert.equal(e.note,'network-vlan');assert.equal(e.writes.length,1);
assert.deepEqual(e.store.value.visits.office,e.prior.visits.office);assert.deepEqual(e.store.value.notes,e.prior.notes);assert.deepEqual(e.store.value.theoryPositions,e.prior.theoryPositions);
assert.equal(e.store.value.visits.network.step,2);assert.equal(e.store.value.latest,'network');
e.tick();await new Promise(r=>setImmediate(r));assert.equal(e.writes.length,1,'unchanged resume metadata is not saved repeatedly');
let prevented=false;await e.listeners.click({button:0,target:{closest:()=>({href:'/#course:network:lessons'})},preventDefault(){prevented=true;}});
assert.equal(prevented,true);assert.equal(e.redirect,'/#course:network:lessons');
const f=environment({fail:true});await f.ctx.MadarNetworkPage.ready(lab,{id:'network-vlan',title:'VLAN'});
await f.listeners.click({button:0,target:{closest:()=>({href:'/leave'})},preventDefault(){}});
assert.equal(f.redirect,null,'a failed save must not navigate');assert.match(f.nodes.get('network-page-save').textContent,/offline/);
const b=environment({embedded:true});await b.ctx.MadarNetworkPage.ready(lab,{id:'network-vlan',title:'VLAN'});assert.equal(b.writes.length,0,'embedded host leaves profile ownership with its parent');assert.equal(b.note,undefined);
const noProgress=environment();await noProgress.ctx.MadarNetworkPage.ready({...lab,lessonProgress:()=>null},{id:'network-vlan',title:'VLAN'});assert.equal(noProgress.writes.length,0,'pending simulator save does not manufacture progress');
console.log('PASS: standalone resume, notes, unchanged metadata, save-before-navigation, failure guard, embedded ownership, pending-lab guard');
