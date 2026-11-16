// Access to the model stays in the copied engine. No production state is touched.
const LC=window.MadarLearning;
let learningExecuting=false;
const learningRun=runCli,learningShow=network.show.bind(network);
runCli=function(){learningExecuting=true;try{return learningRun();}finally{learningExecuting=false;}};
q('#nf-command-send').onclick=()=>runCli();
network.show=function(id,what,arg){const result=learningShow(id,what,arg);if(learningExecuting)root.dispatchEvent(new CustomEvent('labs:show-observed',{detail:{device:id,what,at:new Date().toISOString()}}));return result;};
const learningReveal=assist.reveal.bind(assist);
assist.reveal=function(step,id,options={}){let displayed;const render=options.render||(()=>{});const result=learningReveal(step,id,{...options,render:h=>{render(h);displayed=tabsClone(h);}});if(result.recorded)root.dispatchEvent(new CustomEvent('labs:help-exposure',{detail:{attempt:assist.attempt,key:assist.key(step,options.context),hint:id,level:result.level,at:assist.events.at(-1)[4],goal:step.goal,body:displayed.body,remaining:displayed.remaining||'',label:displayed.label}}));return result;};
root.labsBridge.learning={
 modes(){return Object.fromEntries(Object.keys(devices).filter(id=>devices[id].type!=='PC').map(id=>[id,ios.session(id).mode]));},
 prerequisites(e,target){tabsChanging=true;try{for(const key of LC.order.slice(0,LC.order.indexOf(target))){if(key.endsWith('check'))continue;for(const id of LC.targets(key)){ios.run(id,'enable');ios.run(id,'end');if(key!=='save')ios.run(id,'configure terminal');for(const command of LC.commands(e,key,id)){const r=ios.run(id,command);if(!r.ok)throw Error('Prerequisite failed: '+command+' '+r.out.join(' '));}ios.run(id,'end');}}for(const id of ['S1','S2','R1']){const s=ios.session(id);s.lines=[];s.history=[];s.mode='user';}refreshCli();}finally{tabsChanging=false;}},
 fresh(e){
  tabsChanging=true;try{setupVlan(false);for(const c of [...cables])removeCable(c);makeCable('course-router','R1:'+e.routerPort,'S1:'+e.routerSwitch,0xe3bd7e);makeCable('course-trunk','S1:'+e.uplink,'S2:'+e.uplink,0xe3bd7e);makeCable('course-pc1','PC1:F0','S1:'+e.pcPorts[0],0x68bca5);makeCable('course-pc2','PC2:F0','S2:'+e.pcPorts[1],0x68bca5);['PC1','PC2'].forEach((id,i)=>network.ensure(id).pc={ip:LC.ip(e,i+1,3),mask:'255.255.255.0',gateway:LC.ip(e,i+1)});vlanExercise=false;lesson=null;assist.import(new window.MadarAssistance.Assistance().export());undoSnapshot=null;afterEdit();}finally{tabsChanging=false;}return root.labsBridge.capture();
 },
 snapshot(){const s=root.labsBridge.capture();s.network=tabsClone(network.config);return s;},
 check(e,key,cumulative=true){
  const s=this.snapshot(),links=[['R1:'+e.routerPort,'S1:'+e.routerSwitch],['S1:'+e.uplink,'S2:'+e.uplink],['PC1:F0','S1:'+e.pcPorts[0]],['PC2:F0','S2:'+e.pcPorts[1]]];
  for(const [a,b]of links)if(!s.cables.some(c=>c.a===a&&c.b===b||c.b===a&&c.a===b))return {ok:false,key,issues:[{device:a.split(':')[0],port:a.split(':')[1],field:'توصيل الكابل',actual:'وصلة ناقصة أو مختلفة عن المتطلبات',show:'فحص بصري للكابل',physical:true}]};
  for(const k of cumulative?LC.order.slice(0,LC.order.indexOf(key)+1):[key]){const r=LC.check(s,e,k);if(!r.ok)return {...r,key:k};}
  if(key==='router-check'){for(const [n,x]of Object.entries(network.ensure('R1').interfaces))if(x.kind==='sub'&&x.parent===e.routerPort&&network.status('R1',n).some(v=>v!=='up'))return {ok:false,key,issues:[{device:'R1',port:n,field:'Status / Protocol',actual:network.status('R1',n).join(' / '),show:'show ip interface brief'}]};}
  return {ok:true,key,issues:[]};
 },
 focus(issue){
  root.querySelectorAll('.ml-error-location').forEach(x=>x.classList.remove('ml-error-location'));
  if(!devices[issue.device]){q('#nf-device').classList.add('ml-error-location');return;}
  selectDevice(issue.device);labels[issue.device]?.classList.add('ml-error-location');
  const k=issue.device+':'+issue.port;if(ports[k]){selectPort(k,false);focusPorts(k);zoomButtons.get(k)?.classList.add('ml-error-location');}
 },
 output(issue){
  if(!devices[issue.device]||!power[issue.device])return ['الجهاز غير موجود أو مطفأ؛ راجع الطاقة والمكان أولًا.'];
  const n=issue.port;return issue.physical?['تتبّع الكابل في المساحة؛ الطرفان المطلوبان مذكوران في المتطلبات.']:issue.show==='show vlan brief'?network.show(issue.device,'vlan'):issue.show==='show ip interface brief'?network.show(issue.device,'brief'):issue.show==='show startup-config'?network.show(issue.device,'start'):issue.show.includes('switchport')?network.show(issue.device,'switchport',n):network.show(issue.device,'run');
 },
 newAttempt(id){assist.newAttempt(id);},
 reviews(){return assist.reviews();},
 clearFocus(){root.querySelectorAll('.ml-error-location').forEach(x=>x.classList.remove('ml-error-location'));},
 recordDiagnostic(issue,render){
  const solution=tabsHelpContext.exercise?LC.step(tabsHelpContext.exercise,tabsHelpContext.step,this.modes()).hints.at(-1).body:'راجع أمر no shutdown في Interface Configuration (config-if)# للمنفذ المطلوب.';
  const step={id:'diagnose-'+(tabsHelpContext.step||tabsHelpContext.course)+'-'+issue.device+'-'+(issue.port||issue.field),revision:1,goal:'تشخيص '+issue.field+' في '+issue.device,givenFacts:['task'],answerFacts:['fix'],hints:[{id:'location',degree:3,benefit:'يحدد موضع الخلل في الناتج؛ يبقى تصحيحه عليك.',body:issue.show+'\n'+issue.device+' / '+(issue.port||issue.field)+'\n'+issue.actual,remaining:'تفسير الفرق وتحديد أوامر التصحيح وتنفيذها.',adds:['location'],authorReview:'diagnostic-review-20261015'},{id:'fix',degree:4,full:true,benefit:'يكشف حل المهمة كاملة.',body:solution,adds:['fix'],authorReview:'diagnostic-review-20261015'}]};
  return assist.reveal(step,'location',{context:tabsHelpContext.id,render});
 }
};
