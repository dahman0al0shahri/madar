(function(global){
'use strict';
const clone=x=>JSON.parse(JSON.stringify(x)),same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),cache=new Map();
function ports(type){return type==='R'?['G0/0','G0/1','S0/0/0','S0/0/1']:type==='PC'?['F0']:[...Array.from({length:24},(_,i)=>'F0/'+(i+1)),'G0/1','G0/2'];}
function fixture(lab,N=global.MadarNetwork){
 const admin={},power=Object.fromEntries(Object.keys(lab.devices).map(d=>[d,true])),links=lab.links.map((p,i)=>({a:p[0],b:p[1],id:'link-'+i,type:p[0].includes(':S0/')?'serial':undefined,dce:p.find(k=>k.endsWith(':S0/0/0'))}));
 const keys=Object.entries(lab.devices).flatMap(([id,t])=>ports(t).map(p=>id+':'+p));keys.forEach(k=>admin[k]=lab.devices[k.split(':')[0]]!=='R');
 const env={types:()=>lab.devices,ports:()=>keys,admin:k=>admin[k],setAdmin:(k,on)=>admin[k]=on,power:d=>power[d],peer:k=>{const c=links.find(x=>x.a===k||x.b===k);return c?(c.a===k?c.b:c.a):null;},cable:k=>links.find(x=>x.a===k||x.b===k)?.id};
 env.serialRole=k=>{const c=links.find(c=>c.a===k||c.b===k);return c?.type==='serial'?(c.dce===k?'DCE':'DTE'):null;};env.up=k=>{const p=env.peer(k);return !!p&&admin[k]!==false&&admin[p]!==false&&power[k.split(':')[0]]&&power[p.split(':')[0]];};
 const model=new N.NetworkModel(env),ios=new N.IOSCli(model);for(const[d,t]of Object.entries(lab.devices)){model.ensure(d).hostname=t==='R'?'Router':t==='S'?'Switch':d;}
 return {model,ios,admin,power,links,env,snapshot:()=>({network:clone(model.config),admin:clone(admin),power:clone(power),cables:clone(links)})};
}
function ready(f,d){const s=f.ios.session(d);if(s.pending)f.ios.run(d,'');if(s.auth)f.ios.run(d,s.auth==='enable'?(f.model.ensure(d).enableSecret||f.model.ensure(d).enablePassword):f.model.ensure(d).lines?.console?.password);if(s.mode==='user'){f.ios.run(d,'enable');if(s.auth)f.ios.run(d,f.model.ensure(d).enableSecret||f.model.ensure(d).enablePassword);}if(s.mode!=='priv')f.ios.run(d,'end');}
function execute(f,stage){
 const d=stage.device;
 if(stage.kind==='console'){f.ios.openConsole(d);return;}
 if(stage.kind==='initialize'){ready(f,d);for(const c of ['erase startup-config','',...(f.model.type(d)==='S'?['delete vlan.dat','','']:[]),'reload','no','']){const r=f.ios.run(d,c);if(!r.ok)throw Error(stage.id+': '+r.out.join(' '));}return;}
 if(stage.kind==='pc')f.model.ensure(d).pc=clone(stage.pc);
 if(stage.kind!=='cli')return;
 ready(f,d);let commands=stage.commands.filter(c=>c!=='enable');if(!commands[0].startsWith('show ')&&!commands[0].startsWith('copy ')&&commands[0]!=='configure terminal')commands=['configure terminal',...commands];
 for(const c of commands){const r=f.ios.run(d,c);if(!r.ok)throw Error(stage.id+' '+d+' '+c+': '+r.out.join(' '));if(f.ios.session(d).pending==='copy')f.ios.run(d,'');}
}
function flatten(v,path=[],out={}){if(v===undefined)return out;if(v===null||typeof v!=='object'||Array.isArray(v)){out[JSON.stringify(path)]=Array.isArray(v)&&path.at(-1)==='routes'?clone(v).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b))):clone(v);return out;}for(const[k,x]of Object.entries(v)){if(['startup','clock'].includes(k))continue;flatten(x,[...path,k],out);}return out;}
function expected(lab,N){if(cache.has(lab.id))return cache.get(lab.id);const f=fixture(lab,N),initial=flatten({network:f.model.config,admin:f.admin}),out=[],goals=new Set();for(const s of lab.stages){execute(f,s);const now=flatten({network:f.model.config,admin:f.admin});for(const k of Object.keys(now))if(!same(now[k],initial[k]))goals.add(k);out.push({goals:Object.fromEntries([...goals].map(k=>[k,now[k]])),state:f.snapshot()});}cache.set(lab.id,out);return out;}
function observedCommand(command){return command.trim().toLowerCase().replace(/^do /,'').replace(/\s+/g,' ').replace(/^sh(?:o)? /,'show ').replace(/\bint(?:erface)?\b/g,'interfaces').replace(/\bbr(?:ie)?\b/g,'brief').replace(/\brun(?:ning)?\b/g,'running-config').replace(/\bstart(?:up)?\b/g,'startup-config').replace(/\beth(?:erchannel)?\b/g,'etherchannel').replace(/\bsum(?:mary)?\b/g,'summary').replace(/\bspan(?:ning)?\b/g,'spanning-tree').replace(/\bclo(?:ck)?\b/g,'clock').replace(/port-channel\s+(\d+)/g,'po$1');}
function fieldLabel(p){const labels={ip:'عنوان IPv4',mask:'قناع الشبكة',gateway:'البوابة',hostname:'اسم الجهاز',domainLookup:'بحث DNS',enableSecret:'كلمة مرور Privileged EXEC',passwordEncryption:'إخفاء كلمات المرور',banner:'رسالة الدخول',password:'كلمة مرور الخط',login:'طلب كلمة المرور',synchronous:'مزامنة الرسائل',range:'مجموعة الخطوط',name:'اسم VLAN',mode:'وضع الواجهة',access:'Access VLAN',native:'Native VLAN',allowed:'VLAN المسموح بها',tag:'وسم 802.1Q',description:'وصف الواجهة',shutdown:'حالة الواجهة',clockRate:'ساعة DCE',channel:'مجموعة EtherChannel',channelMode:'وضع تفاوض EtherChannel',routes:'المسارات الثابتة'};if(p[0]==='admin')return p[1]+' · حالة المنفذ الإدارية';return p.slice(1).filter(x=>!['interfaces','pc','lines','vlans'].includes(x)).map((x,i,a)=>i===a.length-1?(labels[x]||x):x).join(' · ');}
function check(lab,index,model,snapshot,observations=[],N){
 const stage=lab.stages[index],issues=[],want=expected(lab,N)[index],actual=flatten({network:model.config,admin:Object.fromEntries(Object.entries(lab.devices).flatMap(([id,t])=>ports(t).map(n=>[id+':'+n,model.admin(id,n)])))});
 // Source 8 explicitly permits swapping next-hop / exit-interface forms between the two Loopback routes.
 if(lab.id==='network-guide-08'){
  const k=JSON.stringify(['network','R1','routes']),routes=actual[k],wanted=want.goals[k],nets=['198.133.219.0','209.165.200.224'];
  if(Array.isArray(routes)&&Array.isArray(wanted)){
   const pair=routes.filter(r=>nets.includes(r.net)),w= wanted.filter(r=>nets.includes(r.net));
   if(pair.length===2&&w.length===2&&pair.every(r=>w.some(x=>x.net===r.net&&x.mask===r.mask))&&pair.filter(r=>r.hop==='10.1.1.2'&&!r.port).length===1&&pair.filter(r=>r.port==='S0/0/1'&&!r.hop).length===1)actual[k]=routes.filter(r=>!nets.includes(r.net)).concat(w).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
  }
 }
 if(!['console','initialize'].includes(stage.kind))for(const[a,b]of lab.links){const cable=snapshot.cables.find(c=>c.a===a&&c.b===b||c.b===a&&c.a===b);if(!cable)issues.push('وصلة غير مطابقة: '+a+' ↔ '+b);else if(a.includes(':S0/')){const dce=[a,b].find(k=>k.endsWith(':S0/0/0'));if(cable.type!=='serial'||cable.dce!==dce)issues.push('وصلة Serial: اجعل '+dce+' طرف DCE وفق هذا الدرس.');}}
 for(const[k,v]of Object.entries(want.goals)){const p=JSON.parse(k);if(!same(actual[k],v))issues.push(fieldLabel(p)+' — لم يطابق المتطلب بعد');}
 if(stage.kind==='wire')for(const d of Object.keys(lab.devices))if(!model.env.power(d))issues.push('شغّل الجهاز '+(lab.aliases[d]||d)+' قبل فحص التوصيل.');
 if(stage.kind==='clock'&&!model.ensure(stage.device).clock)issues.push('اضبط الساعة أولًا.');
 const observed=c=>observations.some(o=>o.device===stage.device&&observedCommand(o.command)===observedCommand(c)&&o.ok!==false);
 if(stage.kind==='console'&&!observed('open console'))issues.push('وصّل Console وافتح Terminal إلى '+stage.device);if(stage.kind==='initialize'&&!observed('initialize device'))issues.push('أكمل التهيئة وإعادة التشغيل دون حفظ الإعداد السابق.');const shows=(stage.commands||[]).filter(c=>c.startsWith('show '));if(stage.kind==='clock')shows.push('show clock');if(stage.kind==='channel')shows.push('show etherchannel summary','show spanning-tree');if(stage.kind==='save')shows.push('show startup-config');
 for(const c of shows)if(!observed(c))issues.push('نفّذ للفحص: '+c+' على '+stage.device);
 if(stage.kind==='ping'){if(!observed(stage.command))issues.push('نفّذ '+stage.command+' من '+stage.device);const r=model.ping(stage.device,stage.target);if(r.ok!==stage.expected)issues.push('نتيجة الاتصال لا تطابق الحالة المطلوبة: '+r.reason);}
 if(stage.kind==='channel'){const members=model.keys(stage.device).filter(p=>model.iface(stage.device,p)?.channel);if(!members.length||members.some(p=>!model.channelUp(stage.device,p)))issues.push('راجع توافق التجميع وحالة الأعضاء.');}
 if(stage.kind==='save'||stage.commands?.some(c=>c.startsWith('copy '))){const c=model.ensure(stage.device),saved=c.startup;if(!saved)issues.push('startup-config غير محفوظ.');else if(!same(flatten(c),flatten(saved.config))||model.keys(stage.device).some(n=>model.admin(stage.device,n)!==saved.admin[n]))issues.push('startup-config لا يطابق الإعداد الجاري. أعد الحفظ.');}
 return {ok:!issues.length,issues:[...new Set(issues)],expectedPing:stage.kind==='ping'?stage.expected:null};
}
function reviewsReady(lab,p,stage=null){return (stage?[stage]:lab.stages).every(s=>(s.questions||[]).every(q=>p.responses?.[q.id]?.reviewed===true&&!!p.responses[q.id].text?.trim()&&p.responses[q.id].draft===p.responses[q.id].text));}
function recordReview(p,id,text,reviewed,at){p.responses??={};const old=p.responses[id]||{},history=old.history||[];if(old.at)history.push({text:old.text,reviewed:old.reviewed,at:old.at});p.responses[id]={text:text.trim(),draft:text.trim(),reviewed:!!reviewed&&!!text.trim(),at,history};return p.responses[id];}
global.MadarPractical={ports,fixture,expected,execute,check,observedCommand,reviewsReady,recordReview};
})(typeof window!=='undefined'?window:globalThis);
