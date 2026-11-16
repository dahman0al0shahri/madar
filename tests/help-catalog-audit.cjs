const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('modules/network-diagnosis-preview/free-workspace.html','utf8');
function exported(code){const ctx={module:{exports:{}},console,structuredClone};vm.createContext(ctx);vm.runInContext(code,ctx);return ctx.module.exports;}
const marker='const api={NetworkModel,IOSCli,ipNumber,maskBits,hostAddress,sameNet,vlanList,full,compress};';
const modelCode=html.slice(html.indexOf('/* Standalone teaching model:'),html.indexOf('})(typeof window!',html.indexOf('/* Standalone teaching model:'))+"})(typeof window!=='undefined'?window:globalThis);".length).replace(marker,fs.readFileSync('modules/network-tabs-preview/cli-state.js','utf8')+'\n'+marker);
const {NetworkModel,IOSCli}=exported(modelCode);
// Accept source line endings without extracting stale generated fixtures.
const normalized=html.replace(/\r\n/g,'\n'),start=normalized.indexOf("(function(root){'use strict';\nconst VERSION=1");
const {Assistance,validate}=exported(normalized.slice(start,normalized.indexOf("})(typeof window!=='undefined'?window:globalThis);",start)+"})(typeof window!=='undefined'?window:globalThis);".length));
const L=exported(fs.readFileSync('modules/network-tabs-preview/learning-catalog.js','utf8'));
let paths=0,commands=0;
for(let seed=0;seed<=96;seed++){
 const e=L.configure(seed),types={S1:'S',S2:'S',R1:'R'},devices=Object.fromEntries(Object.entries(types).map(([id,type])=>[id,{type}]));
 const ports=Object.keys(types).flatMap(id=>id==='R1'?['R1:G0/0','R1:G0/1']:Array.from({length:24},(_,i)=>id+':F0/'+(i+1)).concat([id+':G0/1',id+':G0/2']));
 const admin={},cables=[{a:'R1:'+e.routerPort,b:'S1:'+e.routerSwitch},{a:'S1:'+e.uplink,b:'S2:'+e.uplink}],env={types:()=>types,ports:()=>ports,admin:k=>admin[k]!==false,setAdmin:(k,v)=>admin[k]=v,power:()=>true,up:()=>true,peer:k=>{const c=cables.find(c=>c.a===k||c.b===k);return c?(c.a===k?c.b:c.a):null;},cable:k=>cables.find(c=>c.a===k||c.b===k)};
 const network=new NetworkModel(env),ios=new IOSCli(network),assistance=new Assistance();
 for(const step of L.order){
  const modes=Object.fromEntries(Object.keys(types).map(id=>[id,ios.session(id).mode]));
  const help=L.step(e,step,modes);validate(help);assert.equal(help.goal,L.titles[step]);assert.ok(!help.hints.at(-1).body.includes("ما تفعله في المساعد"));
  assert.equal(assistance.latest(help,'original'),null);assistance.reveal(help,'solution',{context:'helper'});assistance.reveal(help,'solution',{context:'helper'});
  assert.equal(assistance.summary(help,'helper').count,1);assert.equal(assistance.summary(help,'original').count,0);
  let device=null;
  for(const line of help.hints.at(-1).body.split('\n')){
   if(/^(S1|S2|R1):$/.test(line)){device=line.slice(0,-1);continue;}
   if(!device||!line||/\p{Script=Arabic}/u.test(line))continue;
   const result=ios.run(device,line);assert.equal(result.ok,true,`${seed}/${step}/${device}: ${line}: ${result.out}`);commands++;
   if(ios.session(device).pending==='copy'){assert.equal(ios.run(device,'').ok,true);commands++;}
  }
  const result=L.check({devices,network:network.config,admin,power:{S1:true,S2:true,R1:true},cables},e,step);
  assert.equal(result.ok,true,`${seed}/${step}: ${JSON.stringify(result.issues)}`);
  const restored=new Assistance(JSON.parse(JSON.stringify(assistance.export())));assert.equal(restored.summary(help,'helper').count,1);assert.equal(restored.summary(help,'original').count,0);paths++;
 }
}
console.log(JSON.stringify({passed:true,variants:97,paths,commands,checks:'All authored steps validate, reveal once per lab/step, survive serialization, and their full commands execute against the current simulator and pass its checker.'}));
