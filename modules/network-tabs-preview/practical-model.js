// Extend the existing teaching model; all traffic still depends on live configuration.
const PM=NetworkModel.prototype, PC=IOSCli.prototype;
PM.traceroute=function(id,target){const result=this.ping(id,target);if(!result.ok)return {...result,hops:[]};const all=this.endpoints(),dest=all.find(e=>e.ip===target),hops=[];let next=all.find(e=>e.id===id);for(let ttl=0;next&&ttl<24;ttl++){if(next.id===dest.id){if(hops.at(-1)!==target)hops.push(target);break;}if(next.type!=='router'&&sameNet(next.ip,target,next.mask)){hops.push(target);break;}const hop=next.type==='router'?this.resolveRoute(next.id,target,all)?.hop:next.gateway;if(!hop)break;hops.push(hop);next=all.find(e=>e.ip===hop&&(e.type==='router'||e.ip===target));}return {...result,hops};};
const pIface=PC.ifaceArg,pNormalize=PC.normalize,pSpecs=PC.specs,pPrompt=PC.prompt,pImport=PC.import,pStatus=PM.status,pRunning=PM.running,pShow=PM.show,pLayer=PM.layer2;
PC.normalize=function(raw){return pNormalize.call(this,raw).replace(/\b(serial|se|s|loopback|lo|port-channel|po)\s+(\d+(?:\/\d+)*)/ig,'$1$2');};
PC.ifaceArg=function(id,v,physicalOnly=false,create=false){
 let n=v.replace(/^gigabitethernet/i,'G').replace(/^gi/i,'G');if(/^G0\/0\/[01](?:\.|$)/i.test(n))n=n.replace(/^G0\/0\//i,'G0/');
 const hit=n.match(/^(serial|se|s|loopback|lo|port-channel|po)(\d+(?:\/\d+)*)$/i);
 if(hit){const kind=/^(s|se|serial)$/i.test(hit[1])?'S':/^(lo|loopback)$/i.test(hit[1])?'Lo':'Po';n=kind+hit[2];const c=this.model.ensure(id);if(c.interfaces[n]&&(!physicalOnly||c.interfaces[n].kind==='physical'))return n;if(create&&!physicalOnly&&((kind==='Lo'&&this.model.type(id)==='R')||(kind==='Po'&&this.model.type(id)==='S'))&&/^\d+$/.test(hit[2])&&+hit[2]<4095)return n;return null;}
 return pIface.call(this,id,n,physicalOnly,create);
};
PC.prompt=function(id){return this.session(id).mode==='line'?this.model.ensure(id).hostname+'(config-line)#':pPrompt.call(this,id);};
PC.import=function(data){pImport.call(this,data);for(const[id,s]of Object.entries(this.sessions))if(data?.[id]?.mode==='line'&&this.model.ensure(id).lines?.[data[id].line])Object.assign(s,{mode:'line',line:data[id].line});};
PC.specs=function(id){
 const specs=pSpecs.call(this,id),s=this.session(id),m=this.model,c=m.ensure(id),type=m.type(id),config=!['user','priv'].includes(s.mode),add=(pattern,desc,run)=>specs.push({pattern,tokens:pattern.split(' '),desc,run}),fail=t=>{throw Error(t);};
 const entry=specs.find(x=>x.pattern==='interface <interface>');if(entry){const old=entry.run;entry.run=([n])=>{if(n.startsWith('Lo')||n.startsWith('Po')){c.interfaces[n]??={kind:n.startsWith('Lo')?'loopback':'channel',mode:'dynamic auto',access:1,native:1,allowed:'all',negotiate:true,shutdown:false,ip:null,mask:null,description:''};s.port=n;s.range=[];s.mode='interface';return [];}return old([n]);};}
 if(s.mode==='line')specs.find(x=>x.pattern==='exit').run=()=>{s.mode='config';return [];};
 const targets=()=>s.mode==='range'?s.range:[s.port];
 if(config){
  add('no ip domain-lookup','إيقاف بحث أسماء المضيفين',()=>{c.domainLookup=false;});add('ip domain-lookup','تفعيل بحث أسماء المضيفين',()=>{c.domainLookup=true;});
  add('enable secret <text...>','كلمة مرور مختبرية للوضع ذي الامتيازات',([v])=>{c.enableSecret=v;});
  add('service password-encryption','إخفاء كلمات مرور المختبر في العرض',()=>{c.passwordEncryption=true;});add('no service password-encryption','إلغاء إخفاء كلمات مرور المختبر',()=>{c.passwordEncryption=false;});
  add('banner motd <text...>','رسالة دخول محاطة بعلامة فصل',([v])=>{if(v.length<2||v[0]!==v.at(-1))fail('Use the same delimiter at both ends.');c.banner=v.slice(1,-1);});
  add('line console 0','Line Configuration للاتصال المحلي',()=>{c.lines??={};c.lines.console??={};s.line='console';s.mode='line';});
  add('line vty <text...>','Line Configuration للخطوط الافتراضية',([v])=>{if(!/^0 (4|15)$/.test(v))fail('Supported range: 0 4 or 0 15');c.lines??={};c.lines.vty??={};c.lines.vty.range=v;s.line='vty';s.mode='line';});
  if(s.mode==='line'){for(const[k,field]of [['password','password']])add(k+' <text...>','كلمة مرور هذا الخط في المختبر',([v])=>{c.lines[s.line][field]=v;});for(const[k,field]of [['login','login'],['logging synchronous','synchronous']])add(k,'إعداد الخط الحالي',()=>{c.lines[s.line][field]=true;});}
  if(['interface','range'].includes(s.mode)){
   add('clock rate <text...>','ساعة الوصلة Serial على طرف DCE',([v])=>{if(!/^\d+$/.test(v)||+v<1200||+v>4000000)fail('Invalid clock rate');for(const n of targets()){if(m.serialRole(id,n)!=='DCE')fail('Clock rate requires a connected DCE cable endpoint. Use show controllers serial.');c.interfaces[n].clockRate=+v;}});
   for(const field of ['speed','duplex'])add(field+' <text...>','توافق خصائص الوصلة',([v])=>{if(!(field==='speed'?['auto','10','100','1000']:['auto','full','half']).includes(v))fail('Invalid '+field);for(const n of targets())c.interfaces[n][field]=v;});
   if(type==='S'){
    add('channel-group <text...>','تجميع منافذ EtherChannel',([v])=>{const a=v.match(/^(\d+) mode (active|passive|desirable|auto|on)$/i);if(!a||+a[1]<1||+a[1]>64)fail('Use channel-group 1..64 mode active|passive|desirable|auto|on');for(const n of targets()){const x=c.interfaces[n];if(x.kind!=='physical')fail('Select physical interfaces.');if(x.channel&&x.channel!==+a[1])fail('Remove the previous channel-group first.');}const po='Po'+a[1];c.interfaces[po]??={...clone(c.interfaces[targets()[0]]),kind:'channel',shutdown:false};delete c.interfaces[po].channel;delete c.interfaces[po].channelMode;for(const n of targets()){c.interfaces[n].channel=+a[1];c.interfaces[n].channelMode=a[2].toLowerCase();}});
    add('no channel-group <text...>','إزالة عضوية التجميع',([v])=>{if(!/^\d+$/.test(v))fail('Invalid group');for(const n of targets())if(c.interfaces[n].channel===+v){delete c.interfaces[n].channel;delete c.interfaces[n].channelMode;}});
   }
  }
  if(type==='R')for(const no of [false,true])add((no?'no ':'')+'ip route <text...>','مسار IPv4 ثابت أو افتراضي',([v])=>{
   const a=v.split(/\s+/),[net,mask]=a,bits=maskBits(mask);if(a.length<(no?2:3)||a.length>4||bits===null||ipNumber(net)===null||((ipNumber(net)&ipNumber(mask))>>>0)!==ipNumber(net))fail('Inconsistent address and mask.');
   if(no&&a.length===2){c.routes=(c.routes||[]).filter(x=>x.net!==net||x.mask!==mask);return;}
   const port=this.ifaceArg(id,a[2]),hop=ipNumber(a[2])!==null?a[2]:a[3]||null;if(!port&&!hop||hop&&ipNumber(hop)===null||a.length===4&&!port)fail('Invalid next hop or exit interface.');
   const r={net,mask,port:port||null,hop};c.routes??=[];const key=x=>JSON.stringify(x);if(no)c.routes=c.routes.filter(x=>key(x)!==key(r));else if(!c.routes.some(x=>key(x)===key(r)))c.routes.push(r);
  });
 }
 const pre=config?'do ':'';
 if(s.mode==='priv')add('clock set <text...>','ضبط ساعة المختبر',([v])=>{const a=v.match(/^(\d\d?):(\d\d):(\d\d) (\d{1,2}) ([a-z]{3,9}) (\d{4})$/i),months=['january','february','march','april','may','june','july','august','september','october','november','december'];if(!a)fail('hh:mm:ss day month year');const month=months.findIndex(x=>x.startsWith(a[5].toLowerCase())),year=+a[6],day=+a[4];if(+a[1]>23||+a[2]>59||+a[3]>59||month<0||year<1993||year>2035||day<1||day>new Date(Date.UTC(year,month+1,0)).getUTCDate())fail('Invalid time or date (year 1993..2035).');c.clock=v;});
 add(pre+'show clock','ساعة المختبر',()=>[c.clock||'Clock not set in this simulation']);
 add(pre+'show version','هوية نموذج المختبر',()=>['MADAR teaching model — not Cisco IOS','Router/Switch configuration training; no real network traffic.']);
 if(type==='S'){
  for(const spec of specs)if(spec.pattern.endsWith('show interfaces <physical-if> switchport')){spec.pattern=spec.pattern.replace('<physical-if>','<existing-if>');spec.tokens=spec.pattern.split(' ');}
  add(pre+'show etherchannel summary','حالة مجموعات EtherChannel والأعضاء',()=>m.channelSummary(id));
  add(pre+'show etherchannel port-channel','تفاصيل التجميع',()=>m.channelSummary(id));
  add(pre+'show spanning-tree','شجرة مستقرة لكل VLAN، دون محاكاة زمن التقارب',()=>Object.keys(c.vlans).map(Number).filter(v=>v<1002||v>1005).sort((a,b)=>a-b).flatMap(v=>m.spanning(id,v)));
  add(pre+'show spanning-tree vlan <vlan>','شجرة VLAN محددة',([v])=>m.spanning(id,v));
 }
 if(s.mode!=='user')add(pre+'show running-config interface <existing-if>','إعداد واجهة بعينها',([n])=>{const lines=m.running(id);let at=lines.indexOf('interface '+full(n));return at<0?[]:lines.slice(at,lines.indexOf('!',at)+1);});
 // Port-channel configuration is reflected on its member ports, as in the lab.
 for(const spec of specs){const run=spec.run;spec.run=(args)=>{const out=run(args);if(s.port?.startsWith('Po')&&/^(switchport |no switchport|shutdown|no shutdown)/.test(spec.pattern)){const po=c.interfaces[s.port];for(const[n,x]of Object.entries(c.interfaces))if(x.channel===+s.port.slice(2)){for(const k of ['mode','native','allowed','access','negotiate'])x[k]=clone(po[k]);if(spec.pattern.includes('shutdown'))m.env.setAdmin(id+':'+n,spec.pattern.startsWith('no'));}}return out;};}
 return specs;
};
PM.status=function(id,n){const x=this.iface(id,n);if(x?.kind==='loopback')return this.env.power(id)&&!x.shutdown?['up','up']:['administratively down','down'];if(x?.kind==='channel')return this.channelMembers(id,+n.slice(2)).some(p=>this.channelUp(id,p))&&!x.shutdown?['up','up']:['down','down'];if(n.startsWith('S0/')){const basic=pStatus.call(this,id,n);if(basic[0]!=='up')return basic;const p=this.env.peer(id+':'+n),[pid,pn]=(p||':').split(':'),dce=this.serialRole(id,n)==='DCE'?x:this.serialRole(pid,pn)==='DCE'?this.iface(pid,pn):null;if(!dce?.clockRate)return ['up','down'];}return pStatus.call(this,id,n);};
PM.channelMembers=function(id,g){return this.keys(id).filter(n=>this.iface(id,n)?.channel===g);};
PM.channelUp=function(id,n){
 const x=this.iface(id,n),peer=this.env.peer(id+':'+n);if(!x?.channel||!peer||!this.env.up(id+':'+n))return false;const[d,p]=peer.split(':'),y=this.iface(d,p);if(!y?.channel)return false;
 const a=x.channelMode,b=y.channelMode,compatible=a==='on'&&b==='on'||['active','passive'].includes(a)&&['active','passive'].includes(b)&&(a==='active'||b==='active')||['auto','desirable'].includes(a)&&['auto','desirable'].includes(b)&&(a==='desirable'||b==='desirable');
 const same=(u,v)=>['mode','native','access','speed','duplex'].every(k=>(u[k]??'auto')===(v[k]??'auto'))&&JSON.stringify(u.allowed)===JSON.stringify(v.allowed);
 return !!compatible&&same(x,y)&&this.channelMembers(id,x.channel).every(k=>same(x,this.iface(id,k)))&&this.channelMembers(d,y.channel).every(k=>same(y,this.iface(d,k)));
};
PM.channelSummary=function(id){const c=this.ensure(id),groups=[...new Set(this.keys(id).map(n=>c.interfaces[n].channel).filter(Boolean))];return ['Flags: D - down  S - Layer2  U - in use  P - bundled  I - individual','Group  Port-channel  Protocol  Ports',...groups.map(g=>{const a=this.channelMembers(id,g),up=a.some(n=>this.channelUp(id,n)),mode=c.interfaces[a[0]].channelMode,protocol=['active','passive'].includes(mode)?'LACP':['auto','desirable'].includes(mode)?'PAgP':'-';return `${g}      Po${g}(S${up?'U':'D'})       ${protocol}      ${a.map(n=>n+'('+ (this.channelUp(id,n)?'P':'I')+')').join(' ')}`;})];};
PM.tree=function(v=1){
 const edges=new Map();for(const k of this.env.ports()){const[id,n]=k.split(':'),peer=this.env.peer(k);if(this.type(id)!=='S'||!peer||!this.env.up(k))continue;const[d,p]=peer.split(':');if(this.type(d)!=='S'||!this.carries(id,n,v)||!this.carries(d,p,v))continue;
  const x=this.iface(id,n),y=this.iface(d,p),paired=this.channelUp(id,n);const token=paired?[id+':Po'+x.channel,d+':Po'+y.channel].sort().join('|'):[k,peer].sort().join('|');if(!edges.has(token))edges.set(token,{id,d,ports:[],token});edges.get(token).ports.push(k,peer);
 }const parent={},find=x=>parent[x]===undefined?(parent[x]=x):parent[x]===x?x:(parent[x]=find(parent[x]));const allowed=new Set();for(const e of [...edges.values()].sort((a,b)=>a.token.localeCompare(b.token,undefined,{numeric:true}))){const a=find(e.id),b=find(e.d);if(a!==b){parent[a]=b;e.ports.forEach(p=>allowed.add(p));}}return allowed;
};
PM.spanning=function(id,v=1){const tree=this.tree(v);return [`VLAN${String(v).padStart(4,'0')} — stable teaching topology; no convergence timer`,`Interface        Role / State`,...this.keys(id).filter(n=>this.env.peer(id+':'+n)&&this.carries(id,n,v)).map(n=>n.padEnd(17)+(tree.has(id+':'+n)||this.type((this.env.peer(id+':'+n)||'').split(':')[0])!=='S'?'Forwarding':'Alternate / Blocking'))];};
PM.hasSwitchCycle=function(){return false;};
PM.layer2=function(source,dest){
 const peer=source.physical&&this.env.peer(source.id+':'+source.physical),[p,n]=(peer||':').split(':'),v=source.vlan||source.tag||(this.type(p)==='S'?this.iface(p,n)?.access:1)||1,tree=this.tree(v),old=this.env.up;
 this.env.up=k=>{const other=this.env.peer(k);if(this.type(k.split(':')[0])==='S'&&other&&this.type(other.split(':')[0])==='S')return old(k)&&tree.has(k);return old(k);};try{return pLayer.call(this,source,dest);}finally{this.env.up=old;}
};
PM.resolveRoute=function(id,dest,all,seen=new Set()){
 if(seen.has(dest)||seen.size>16)return null;seen.add(dest);
 const connected=all.filter(e=>e.id===id&&e.type==='router'&&sameNet(e.ip,dest,e.mask)).map(e=>({bits:maskBits(e.mask),e,connected:true}));
 const statics=(this.ensure(id).routes||[]).filter(r=>sameNet(r.net,dest,r.mask)).map(r=>({bits:maskBits(r.mask),r}));
 for(const row of [...connected,...statics].sort((a,b)=>b.bits-a.bits||Number(!!b.connected)-Number(!!a.connected))){if(row.e)return {out:row.e,hop:dest};const r=row.r;let out=r.port?all.find(e=>e.id===id&&e.name===r.port):null;if(r.port&&!out)continue;if(r.hop){const resolved=out?{out,hop:r.hop}:this.resolveRoute(id,r.hop,all,new Set(seen));if(resolved)return {...resolved,hop:resolved.hop===r.hop?r.hop:resolved.hop};}else if(out?.name.startsWith('S')){const peer=this.env.peer(id+':'+out.name),[d,n]=(peer||':').split(':'),remote=all.find(e=>e.id===d&&e.name===n);if(remote)return {out,hop:remote.ip};}}
 return null;
};
PM.route=function(source,dest,all){let next=source,path=[],trace=[],seen=new Set();for(let ttl=0;ttl<24;ttl++){
 if(next.id===dest.id)return {ok:true,path,trace};const key=next.id+'|'+next.ip;if(seen.has(key))return {ok:false,path,trace,reason:'حلقة في التوجيه'};seen.add(key);
 if(next.type!=='router'&&sameNet(next.ip,dest.ip,next.mask)){const leg=this.layer2(next,dest);return {...leg,path:[...path,...leg.path],trace:[...trace,...leg.trace]};}
 let out=next,hop;if(next.type==='router'){const r=this.resolveRoute(next.id,dest.ip,all);if(!r)return {ok:false,path,trace,reason:next.id+': لا مسار عامل إلى الوجهة'};out=r.out;hop=r.hop;trace.push('Routing '+next.id+' via '+out.name+' → '+hop);}else{hop=next.gateway;if(!hop||!sameNet(next.ip,hop,next.mask))return {ok:false,path,trace,reason:'البوابة مفقودة أو خارج الشبكة'};}
 const candidates=all.filter(e=>e.ip===hop&&(e.type==='router'||e.ip===dest.ip));let found;for(const e of candidates){const leg=this.layer2(out,e);if(leg.ok){found={e,leg};break;}}if(!found)return {ok:false,path,trace,reason:'تعذر الوصول إلى Next Hop '+hop};path.push(...found.leg.path);trace.push(...found.leg.trace);next=found.e;
 }return {ok:false,path,trace,reason:'تجاوز عدد القفزات'};};
PM.running=function(id,override=null,savedAdmin=null){const c=override||this.ensure(id),out=pRunning.call(this,id,override,savedAdmin);if(c.domainLookup===false)out.push('no ip domain-lookup');if(c.enableSecret)out.push('enable secret '+(c.passwordEncryption?'[protected in MADAR]':c.enableSecret));if(c.passwordEncryption)out.push('service password-encryption');if(c.banner)out.push('banner motd $'+c.banner+'$');for(const [name,x]of Object.entries(c.lines||{})){out.push('line '+(name==='console'?'console 0':'vty '+x.range));if(x.password)out.push(' password '+(c.passwordEncryption?'[protected in MADAR]':x.password));if(x.login)out.push(' login');if(x.synchronous)out.push(' logging synchronous');out.push('!');}for(const[n,x]of Object.entries(c.interfaces)){const at=out.indexOf('interface '+full(n));const extra=[];if(x.kind==='channel')extra.push(' switchport mode '+x.mode,' switchport trunk native vlan '+x.native,' switchport trunk allowed vlan '+(x.allowed==='all'?'all':compress(x.allowed)));if(x.channel)extra.push(' channel-group '+x.channel+' mode '+x.channelMode);if(x.clockRate)extra.push(' clock rate '+x.clockRate);if(x.speed)extra.push(' speed '+x.speed);if(x.duplex)extra.push(' duplex '+x.duplex);if(at>=0)out.splice(at+1,0,...extra);}for(const r of c.routes||[])out.push('ip route '+[r.net,r.mask,r.port,r.hop].filter(Boolean).join(' '));return out;};
PM.show=function(id,what,arg){if(what==='trunk'&&this.type(id)==='S'){const c=this.ensure(id),names=Object.keys(c.interfaces).filter(n=>{const x=c.interfaces[n];return (x.kind==='channel'||x.kind==='physical'&&!this.channelUp(id,n))&&this.status(id,n)[1]==='up'&&this.operationalTrunk(id,n)&&(!arg||arg===n);}),rows=['Port     Mode       Encapsulation Status    Native vlan'];for(const n of names)rows.push(n.padEnd(9)+c.interfaces[n].mode.padEnd(11)+'802.1q        trunking  '+c.interfaces[n].native);rows.push('','Port     Vlans allowed on trunk');for(const n of names)rows.push(n.padEnd(9)+compress(c.interfaces[n].allowed));rows.push('','Port     Vlans in spanning tree forwarding state');for(const n of names){const x=c.interfaces[n],vs=Object.keys(c.vlans).map(Number).filter(v=>v<1002||v>1005).filter(v=>this.allowed(x,v)).filter(v=>{const tr=this.tree(v);return x.kind==='channel'?this.channelMembers(id,+n.slice(2)).some(p=>tr.has(id+':'+p)):tr.has(id+':'+n)||this.type((this.env.peer(id+':'+n)||'').split(':')[0])!=='S';});rows.push(n.padEnd(9)+compress(vs));}return rows;}if(what!=='route')return pShow.call(this,id,what,arg);const all=this.endpoints(),rows=pShow.call(this,id,what,arg),routes=this.ensure(id).routes||[];rows[0]='Codes: C - connected, L - local, S - static, * - candidate default';for(const r of routes){const resolved=this.resolveRoute(id,r.hop||r.net,all);if(r.port&&this.status(id,r.port)[1]!=='up'||!r.port&&!resolved)continue;rows.push('S'+(r.net==='0.0.0.0'?'*':' ')+'   '+r.net+'/'+maskBits(r.mask)+(r.hop?' [1/0] via '+r.hop:' is directly connected, '+r.port));if(r.net==='0.0.0.0')rows[1]='Gateway of last resort is '+(r.hop||'0.0.0.0')+' to network 0.0.0.0';}return rows;};
