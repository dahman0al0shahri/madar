// In the 3D engine closure: reuse the same network and IOS instances.
modeInfo.line=['Line Configuration','إعداد كلمات المرور وسلوك خط Console أو VTY؛ exit يرجع إلى Global Configuration.'];
const practicalCableCompatible=cableCompatible;
cableCompatible=function(c){if(c.a?.includes(':S0/')||c.b?.includes(':S0/'))return !!(c.a?.includes(':S0/')&&c.b?.includes(':S0/')&&c.a.endsWith('0/0')!==c.b.endsWith('0/0'));return practicalCableCompatible(c);};
const practicalIosRun=ios.run.bind(ios);
ios.run=function(id,command){const r=practicalIosRun(id,command);if(!tabsChanging)root.dispatchEvent(new CustomEvent('labs:practical-command',{detail:{device:id,command:r.sensitive?'authenticate '+r.authentication:command,ok:r.ok,at:new Date().toISOString()}}));if(r.initialized)root.dispatchEvent(new CustomEvent('labs:practical-command',{detail:{device:id,command:'initialize device',ok:true,at:new Date().toISOString()}}));return r;};
const practicalPC=pcCommand;
pcCommand=function(){const command=q('#nf-pc-command').value.trim(),device=pcSelected,m=command.match(/^tracert\s+(\S+)$/i);let ok=true;if(m){q('#nf-pc-command').value='';const r=network.traceroute(device,m[1]);displayPing(r);q('#nf-pc-log').textContent+='C:\\> '+command+'\n'+(r.ok?'Trace complete — مسار النموذج، دون قياس زمن حقيقي\n'+r.hops.map((ip,i)=>(i+1)+'  '+ip).join('\n'):'Destination unreachable: '+r.reason)+'\n';save();}else practicalPC();if(command)root.dispatchEvent(new CustomEvent('labs:practical-command',{detail:{device,command,ok,at:new Date().toISOString()}}));};
q('#nf-pc-send').onclick=()=>pcCommand();
root.labsBridge.practical={
 fresh(lab){
  const ids=Object.keys(lab.devices),positions={R1:[-5,0,-5],R3:[5,0,-5],S1:[-6,0,0],S2:[6,0,0],S3:[0,0,-5],PC1:[-6,0,6],PC2:[6,0,6],PC3:[0,0,7]};
  if(lab.id.endsWith('08')){positions.S3=[6,0,0];positions.PC3=[6,0,6];}
  const s={version:'physical-2',devices:Object.fromEntries(ids.map(id=>[id,{type:lab.devices[id],position:positions[id],rotation:lab.devices[id]==='R'?Math.PI:0,instanceId:crypto.randomUUID()}])),cables:[],power:Object.fromEntries(ids.map(id=>[id,true])),admin:Object.fromEntries(ids.filter(id=>lab.devices[id]==='R').flatMap(id=>window.MadarPractical.ports('R').map(p=>[id+':'+p,false]))),network:{},cli:{},selected:ids[0]+':'+window.MadarPractical.ports(lab.devices[ids[0]])[0],pan:[0,0,0],view:0,vlanExercise:false,lesson:null,ui:{cliOpen:true},assistance:new window.MadarAssistance.Assistance().export()};
  root.labsBridge.restore(s);for(const id of ids)network.ensure(id).hostname=lab.devices[id]==='R'?'Router':lab.devices[id]==='S'?'Switch':id;
  q('#nf-all').click();refreshCli();return root.labsBridge.capture();
 },
 connect(a,b){if(!ports[a]||!ports[b])return {ok:false,message:'أحد المنفذين غير موجود.'};if(a===b||a.split(':')[0]===b.split(':')[0])return {ok:false,message:'اختر منفذين في جهازين مختلفين.'};if(cableFor(a)||cableFor(b))return {ok:false,message:'أحد المنفذين مشغول. افصل وصلته أولًا.'};if(a.includes(':S0/')!==b.includes(':S0/'))return {ok:false,message:'Serial يتصل بطرف Serial آخر في هذا المختبر.'};rememberEdit();makeCable('manual-'+crypto.randomUUID(),a,b,a.includes(':S0/')?0xc296da:0x67aeaa);afterEdit();save();return {ok:true};},
 disconnect(key){const c=cableFor(key);if(!c)return false;rememberEdit();removeCable(c);afterEdit();save();return true;},
 check(lab,index,observations){return window.MadarPractical.check(lab,index,network,root.labsBridge.capture(),observations);},
 final(lab){return window.MadarPractical.check(lab,lab.stages.length-1,network,root.labsBridge.capture(),[]);},
 snapshot(){return {network:tabsClone(network.config),admin:tabsClone(admin),cables:root.labsBridge.capture().cables};},
 limits(lab){return lab.limits;}
};
