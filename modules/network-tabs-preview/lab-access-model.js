// Shared by old and new workspaces: local IOS teaching sessions, never remote authentication.
const accessRun=PC.run,accessSpecs=PC.specs,accessPrompt=PC.prompt,accessImport=PC.import,accessKeys=PM.keys;
const accessRunning=PM.running;
PM.running=function(id,override=null,savedAdmin=null){const c=override||this.ensure(id),out=accessRunning.call(this,id,override,savedAdmin);if(c.enablePassword)out.push('enable password '+(c.passwordEncryption?'[protected in MADAR]':c.enablePassword));return out;};
const accessShow=PM.show;
PM.show=function(id,what,arg){
 if(what!=='switchport'||this.type(id)!=='S')return accessShow.call(this,id,what,arg);
 const c=this.ensure(id),out=[];
 for(const n of arg?[arg]:this.keys(id)){
  const x=this.iface(id,n);if(!x||!['physical','channel'].includes(x.kind))return ['% Interface is not a switchport'];
  const up=this.status(id,n)[1]==='up',bundle=x.channel&&this.channelUp(id,n)?' (member of bundle Po'+x.channel+')':'';
  out.push('Name: '+full(n),'Switchport: Enabled','Administrative Mode: '+x.mode,'Operational Mode: '+(up?(this.operationalTrunk(id,n)?'trunk':'static access')+bundle:'down'),'Access Mode VLAN: '+x.access+' ('+(c.vlans[x.access]||'inactive')+')','Trunking Native Mode VLAN: '+x.native,'Trunking VLANs Enabled: '+compress(x.allowed),'Negotiation of Trunking: '+(x.negotiate?'On':'Off'),'');
 }return out;
};
PM.keys=function(id){return accessKeys.call(this,id).filter(n=>!['Console','RS232'].includes(n));};
PM.serialRole=function(id,n){return this.env.serialRole?.(id+':'+n)||null;};
PC.prompt=function(id){return this.session(id).auth?'Password:':accessPrompt.call(this,id);};
PC.openConsole=function(id,pc=null){
 const s=this.session(id),c=this.model.ensure(id);s.mode='user';s.pending=null;s.port=null;s.range=[];s.consolePC=pc;s.auth=c.lines?.console?.login?'console':null;s.authFailures=0;
 const out=[...(c.banner?[c.banner]:[]),...(s.auth?['User Access Verification','Password:']:['Press RETURN to get started.'])];s.lines.push(...out);return {ok:true,out};
};
PC.import=function(data){accessImport.call(this,data);for(const[id,s]of Object.entries(this.sessions)){const old=data?.[id];if(!old)continue;s.auth=['console','enable'].includes(old.auth)?old.auth:null;s.consolePC=typeof old.consolePC==='string'?old.consolePC:null;s.authFailures=0;const pending=['erase','delete-vlan-name','delete-vlan-confirm','reload-save','reload'];if(pending.includes(old.pending))s.pending=old.pending;}};
PC.specs=function(id){
 const specs=accessSpecs.call(this,id),s=this.session(id),c=this.model.ensure(id),add=(pattern,desc,run)=>specs.push({pattern,tokens:pattern.split(' '),desc,run});
 const enable=specs.find(x=>x.pattern==='enable');if(enable)enable.run=()=>{if(c.enableSecret||c.enablePassword){s.auth='enable';s.authFailures=0;return ['Password:'];}s.mode='priv';return [];};
 const exit=specs.find(x=>x.pattern==='exit');if(exit&&s.mode==='user')exit.run=()=>this.openConsole(id,s.consolePC).out;
 if(s.mode==='config'){
  add('enable password <text...>','كلمة مرور Privileged EXEC؛ secret له أولوية',([v])=>{c.enablePassword=v;});
  add('no enable secret','إزالة secret المختبري',()=>{delete c.enableSecret;});
  add('no enable password','إزالة كلمة مرور enable',()=>{delete c.enablePassword;});
 }
 if(s.mode==='line')add('no login','إلغاء طلب كلمة مرور هذا الخط',()=>{c.lines[s.line].login=false;});
 if(s.mode==='priv'){
  for(const command of ['erase startup-config','write erase'])add(command,'مسح الإعداد المحفوظ فقط؛ الجاري يبقى حتى reload',()=>{s.pending='erase';return ['Erasing the nvram filesystem will remove all configuration files! Continue? [confirm]'];});
  if(this.model.type(id)==='S')for(const command of ['delete vlan.dat','delete flash:vlan.dat'])add(command,'حذف قاعدة VLAN المحفوظة؛ يتطلب reload لتطبيق التهيئة',()=>{s.pending='delete-vlan-name';return ['Delete filename [vlan.dat]?'];});
  const reload=specs.find(x=>x.pattern==='reload');reload.run=()=>{const plain=x=>JSON.stringify({...x,startup:null,vlanFileDeleted:undefined}),dirty=!c.startup||plain(c)!==plain(c.startup.config)||this.model.keys(id).some(n=>this.model.admin(id,n)!==c.startup.admin[n]);s.pending=dirty?'reload-save':'reload';return [dirty?'System configuration has been modified. Save? [yes/no]:':'Proceed with reload? [confirm]'];};
 }
 if(this.model.type(id)==='R'&&s.mode!=='user')add((s.mode==='priv'?'':'do ')+'show controllers <existing-if>','اعرف طرف DCE أو DTE من الكابل',([n])=>{if(!n?.startsWith('S0/'))throw Error('Invalid Serial interface');return ['Interface '+n,this.model.serialRole(id,n)||'No serial cable attached',...(this.model.iface(id,n).clockRate?['Clock rate '+this.model.iface(id,n).clockRate]:[])];});
 return specs;
};
PC.run=function(id,raw){
 const s=this.session(id),m=this.model,c=m.ensure(id),emit=(out,ok=true,extra={})=>{s.lines.push(...out);s.lines=s.lines.slice(-110);return {ok,out,...extra};};
 if(!m.env.power(id))return emit(['Device is powered off.'],false);
 if(s.consolePC&&m.env.consoleConnected&&!m.env.consoleConnected(s.consolePC,id))return emit(['Console disconnected — أعد توصيل كابل Console وافتح Terminal.'],false);
 if(s.auth){const kind=s.auth,correct=kind==='enable'?(c.enableSecret||c.enablePassword):c.lines?.console?.password;
  if(correct&&raw===correct){s.auth=null;s.authFailures=0;if(kind==='enable')s.mode='priv';return emit([],true,{authentication:kind,sensitive:true});}
  s.authFailures=(s.authFailures||0)+1;if(kind==='enable'&&s.authFailures>=3)s.auth=null;
  return emit(['% Bad passwords',...(s.auth?['Password:']:[])],false,{authentication:kind,sensitive:true});
 }
 if(['erase','delete-vlan-name','delete-vlan-confirm','reload-save'].includes(s.pending)){
  const p=s.pending;s.pending=null;
  if(p==='reload-save'){if(/^y(es)?$/i.test(raw.trim())){accessRun.call(this,id,'write');s.pending='reload';return emit(['Proceed with reload? [confirm]']);}if(/^n(o)?$/i.test(raw.trim())){s.pending='reload';return emit(['Proceed with reload? [confirm]']);}s.pending=p;return emit(['Please answer yes or no.'],false);}
  if(p==='delete-vlan-name'&&(!raw.trim()||raw.trim()==='vlan.dat')){s.pending='delete-vlan-confirm';return emit(['Delete flash:vlan.dat? [confirm]']);}
  if(raw.trim())return emit(['% Operation cancelled.']);
  if(p==='erase'){c.startup=null;return emit(['[OK]'],true,{command:'erase startup-config'});}
  if(p==='delete-vlan-confirm'){c.vlanFileDeleted=true;return emit(['File deleted.'],true,{command:'delete vlan.dat'});}
 }
 const reload=s.pending==='reload'&&!raw.trim(),vlans=clone(c.vlans),deleted=c.vlanFileDeleted;
 const result=accessRun.call(this,id,raw);
 if(reload&&result.out?.includes('Device restarted.')){
  const now=m.ensure(id);if(m.type(id)==='S'){now.vlans=deleted?{1:'default',1002:'fddi-default',1003:'token-ring-default',1004:'fddinet-default',1005:'trnet-default'}:vlans;delete now.vlanFileDeleted;}
  if(!now.startup)now.hostname=m.type(id)==='R'?'Router':'Switch';
  result.command='reload';result.initialized=!now.startup&&Object.keys(now.vlans).every(v=>['1','1002','1003','1004','1005'].includes(v));this.openConsole(id,s.consolePC);result.out.push(...(s.auth?['User Access Verification','Password:']:[]));
 }
 return result;
};

