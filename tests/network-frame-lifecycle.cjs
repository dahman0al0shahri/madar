const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('modules/madar-hub/network-frame.js','utf8');
function setup(fetcher){
 let now=0,id=0,disposedUrls=[],createdUrls=[],listeners={};const timers=new Map();
 function element(){return {attrs:{},dataset:{},children:[],hidden:false,isConnected:true,setAttribute(k,v){this.attrs[k]=v},getAttribute(k){return this.attrs[k]??null},removeAttribute(k){delete this.attrs[k]},append(...x){this.children.push(...x)},remove(){this.removed=true},addEventListener(){},removeEventListener(){}};}
 const frame=element();frame.attrs['data-network-src']='/network-lab?lesson=network-vlan';frame.contentDocument={URL:'about:blank',documentElement:{dataset:{}},getElementById:()=>null};frame.contentWindow={};let panel;frame.before=x=>panel=x;
 class URLTest extends URL{static createObjectURL(blob){createdUrls.push(blob);return 'blob:http://localhost/test'}static revokeObjectURL(url){disposedUrls.push(url)}}
 const context={URL:URLTest,Blob,AbortController,Date:{now:()=>now},document:{createElement:element},location:{origin:'http://localhost'},$:()=>frame,fetch:fetcher,setTimeout:(fn,ms)=>{timers.set(++id,{fn,at:now+ms});return id},clearTimeout:id=>timers.delete(id),addEventListener:(n,fn)=>listeners[n]=fn,removeEventListener:n=>delete listeners[n]};
 vm.createContext(context);vm.runInContext(source,context);context.mountNetworkFrame();
 return {frame,get panel(){return panel},context,createdUrls,disposedUrls,timers,message(data={},origin='http://localhost',source=frame.contentWindow){listeners.message?.({origin,source,data:{type:'madar-network-boot',...data}})},advance(ms){now+=ms;for(const [k,t]of [...timers])if(t.at<=now){timers.delete(k);t.fn()}},dispose(){vm.runInContext('disposeNetworkFrame()',context)}};
}
const flush=()=>new Promise(resolve=>setImmediate(resolve));
const response=()=>({ok:true,headers:{get:()=> 'text/html; charset=utf-8'},text:async()=>'<html><head></head><body><template id="network-template"></template></body></html>'});
(async()=>{
 let calls=0;const a=setup(async()=>{calls++;return response()});await flush();
 assert.equal(a.frame.src,'http://localhost/network-lab?lesson=network-vlan');assert.equal(a.frame.dataset.networkUrl,'http://localhost/network-lab?lesson=network-vlan');assert.equal(a.createdUrls.length,0,'ordinary URL keeps the frame origin');
 a.advance(21000);assert.equal(a.frame.dataset.loadState,'delayed');assert.equal(calls,1,'a slow lab must not be reloaded automatically');
 a.frame.contentDocument={URL:a.frame.src,documentElement:{dataset:{networkBoot:'ready'}},getElementById:()=>({})};
 a.message({},'https://other.test');assert.equal(a.frame.dataset.loadState,'delayed');
 a.message();assert.equal(a.frame.dataset.loadState,'ready');assert.equal(a.panel.removed,true);assert.equal(a.timers.size,0);
 const navigations=[];a.context.lessonBy=id=>({id,course:id==='office'?'office':'network'});a.context.canLesson=l=>l.id!=='hidden';a.context.go=route=>navigations.push(route);
 for(const lesson of ['hidden','office'])a.message({type:'madar-network-navigate',lesson});
 a.message({type:'madar-network-navigate',lesson:'network-guide-03'},'https://other.test');a.message({type:'madar-network-navigate',lesson:'network-guide-03'},'http://localhost',{});assert.equal(navigations.length,0);
 a.message({type:'madar-network-navigate',lesson:'network-guide-03'});assert.deepEqual(navigations,['lesson:network-guide-03'],'navigation uses guarded parent save path');
 await a.panel.children[1].onclick();assert.equal(calls,1,'never reload a running lab');a.dispose();assert.equal(a.disposedUrls.length,0);
 const b=setup(async()=>({ok:false,status:403}));await flush();assert.equal(b.frame.dataset.loadState,'error');assert.match(b.panel.children[0].textContent,/غير متاح/);assert.equal(b.createdUrls.length,0);b.dispose();
 let complete,signal;const c=setup((url,opts)=>{signal=opts.signal;return new Promise(r=>complete=r)});c.dispose();assert.equal(signal.aborted,true);complete(response());await flush();assert.equal(c.createdUrls.length,0,'late response must not resurrect a closed lesson');
 let retryCalls=0;const d=setup(async()=>{if(++retryCalls===1)throw Error('offline');return response()});await flush();assert.equal(d.frame.dataset.loadState,'error');d.panel.children[1].onclick();await flush();assert.equal(d.frame.src,'http://localhost/network-lab?lesson=network-vlan');d.dispose();
 const e=setup(async()=>response());await flush();e.frame.contentDocument.documentElement.dataset.networkBoot='conflict';e.message();assert.equal(e.frame.dataset.loadState,'conflict');assert.equal(e.panel.removed,true);e.dispose();
 console.log('PASS: explicit authenticated load; delayed state; ready handshake; origin/source guard; no reload of running lab; 403; disposal; retry; conflict.');
})().catch(e=>{console.error(e);process.exitCode=1});
