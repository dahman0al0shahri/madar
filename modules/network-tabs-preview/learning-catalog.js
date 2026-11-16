(function(root){
'use strict';
const clone=x=>JSON.parse(JSON.stringify(x));
const order=['create','management','parking','access','vlan-check','trunk','save','parent','subinterfaces','router-check'];
const titles={create:'إنشاء VLAN وتسميتها',management:'إعداد إدارة Switch',parking:'عزل المنافذ غير المستخدمة',access:'تعيين منافذ الحواسيب','vlan-check':'قراءة دليل VLAN',trunk:'إعداد وصلات trunk',save:'حفظ إعداد Switch',parent:'تفعيل منفذ Router',subinterfaces:'إعداد Inter-VLAN','router-check':'قراءة دليل الواجهات الفرعية'};
function make(seed=0){
 const k=Math.abs(Number(seed)||0)%97,random=k!==0,base=random?40+k*3:10;
 const v=random?[base,base+1,base+2,900+k,1100+k]:[10,20,30,999,1000];
 return {version:1,seed:k,vlans:v,names:random?['Admin_'+k,'Team_'+k,'Lab_'+k,'Unused_'+k,'Native_'+k]:['Management','Sales','Operations','Parking_Lot','Native'],nets:random?[80+k,81+k,82+k]:[10,20,30],pcPorts:random?['F0/'+(6+k%8),'F0/'+(17+k%7)]:['F0/6','F0/18'],uplink:'F0/1',routerPort:random&&k%2?'G0/0':'G0/1',routerSwitch:'F0/5'};
}
function configure(seed,variables=['vlans','names','nets','ports']){const e=make(0),r=make(seed);for(const key of variables){if(['vlans','names','nets'].includes(key))e[key]=clone(r[key]);if(key==='ports'){e.pcPorts=clone(r.pcPorts);e.routerPort=r.routerPort;}}e.seed=r.seed;e.variables=[...variables];return e;}
function requirements(e){return `VLAN: ${e.vlans.map((v,i)=>v+' = '+e.names[i]).join('، ')}. إدارة S1: 192.168.${e.nets[0]}.11/24، S2: .12؛ البوابة 192.168.${e.nets[0]}.1. PC1 على S1 / ${e.pcPorts[0]} في VLAN ${e.vlans[1]}، وPC2 على S2 / ${e.pcPorts[1]} في VLAN ${e.vlans[2]}. وصلة Switches: ${e.uplink}، ووصلة R1 / ${e.routerPort} إلى S1 / ${e.routerSwitch}. البوابات 192.168.${e.nets.join('.1، 192.168.')}.1 والقناع 255.255.255.0. native = ${e.vlans[4]} بلا IP، والمنافذ غير المستخدمة في ${e.vlans[3]} ومغلقة. الواجهات الفرعية لها وصف غير فارغ. اسم المنفذ في Router هنا حسب طراز المعاينة؛ ملف المختبر يستخدم G0/0/1.`;}
const ports=id=>Array.from({length:24},(_,i)=>'F0/'+(i+1)).concat(['G0/1','G0/2']);
const used=(e,id)=>id==='S1'?[e.uplink,e.routerSwitch,e.pcPorts[0]]:[e.uplink,e.pcPorts[1]];
const unused=(e,id)=>ports(id).filter(n=>!used(e,id).includes(n));
const ip=(e,i,last=1)=>`192.168.${e.nets[i]}.${last}`;
function nextSeed(excluded=[],random=0){const options=Array.from({length:96},(_,i)=>i+1).filter(n=>!excluded.includes(n));if(!options.length)throw Error('No unused variant available');return options[Math.abs(random)%options.length];}
function commands(e,key,id){
 if(key==='create')return e.vlans.flatMap((v,i)=>['vlan '+v,'name '+e.names[i]]);
 if(key==='management')return ['interface vlan '+e.vlans[0],'ip address '+ip(e,0,id==='S1'?11:12)+' 255.255.255.0','no shutdown','exit','ip default-gateway '+ip(e,0)];
 if(key==='parking')return ['interface range '+unused(e,id).join(', '),'switchport mode access','switchport access vlan '+e.vlans[3],'shutdown'];
 if(key==='access'){const i=id==='S1'?0:1;return ['interface '+e.pcPorts[i],'switchport mode access','switchport access vlan '+e.vlans[i+1],'no shutdown'];}
 if(key==='trunk')return (id==='S1'?[e.uplink,e.routerSwitch]:[e.uplink]).flatMap(n=>['interface '+n,'switchport mode trunk','switchport trunk native vlan '+e.vlans[4],'switchport trunk allowed vlan '+[...e.vlans.slice(0,3),e.vlans[4]].join(','),'no shutdown']);
 if(key==='save')return ['copy running-config startup-config',''];
 if(key==='parent')return ['interface '+e.routerPort,'no shutdown'];
 if(key==='subinterfaces')return [...e.vlans.slice(0,3),e.vlans[4]].flatMap((v,i)=>['interface '+e.routerPort+'.'+v,'description '+e.names[i===3?4:i]+' Network','encapsulation dot1q '+v+(i===3?' native':''),i===3?'no ip address':'ip address '+ip(e,i)+' 255.255.255.0','no shutdown']);
 return [key==='vlan-check'?'show vlan brief':'show ip interface brief'];
}
const targets=key=>['parent','subinterfaces','router-check'].includes(key)?['R1']:['S1','S2'];
const locator={create:'Part 2 / 1a',management:'Part 2 / 1b',parking:'Part 2 / 1c',access:'Part 2 / 2a','vlan-check':'Part 2 / 2b',trunk:'Part 3 / 1–2a',save:'Part 3 / 2b',parent:'Part 4 / 1a',subinterfaces:'Part 4 / 1b','router-check':'Part 4 / 1c'};
function highlight(lines,issue,comparison=[]){
 const full=issue.port?.replace(/^G/,'GigabitEthernet').replace(/^F/,'FastEthernet'),selected=[];let inPort=false;
 const fieldMap={'switchport mode':'Administrative Mode:','switchport access vlan':'Access Mode VLAN:','switchport trunk native vlan':'Trunking Native Mode VLAN:','switchport trunk allowed vlan':'Trunking VLANs Enabled:'};
 lines.forEach((line,i)=>{const t=line.trim();let hit=false;
  if(issue.show==='show running-config'){
   if(t.startsWith('interface '))inPort=t.slice(10).toLowerCase()===full?.toLowerCase();
   if(issue.port)hit=inPort&&(issue.field==='interface'?t.startsWith('interface '):issue.field==='shutdown'?/^(no )?shutdown$/.test(t):t.toLowerCase().startsWith(issue.field.toLowerCase()+' '));
   else hit=t.startsWith(issue.field+' ');
  }else if(issue.show==='show startup-config')hit=!comparison.includes(line);
  else if(issue.show.includes('switchport'))hit=t.startsWith(fieldMap[issue.field]||'Name:');
  else if(issue.show==='show vlan brief')hit=issue.field.startsWith('VLAN ')?new RegExp('^'+issue.field.slice(5)+'\\s').test(line):!!issue.port&&line.split(/[\s,]+/).includes(issue.port);
  else if(issue.show==='show ip interface brief')hit=!!full&&line.split(/\s+/)[0]===full;
  if(hit)selected.push(i);
 });return selected;
}
function step(e,key,modes={}){
 const g=titles[key], h=(id,degree,benefit,body,remaining)=>({id,degree,benefit,body,remaining,adds:[id],authorReview:'lab452-pages89-93-20261015'}), hints=[];
 const patterns={create:'vlan <رقم>\nname <اسم>',management:'interface vlan <رقم الإدارة>\nip address <عنوان Switch> <القناع>\nno shutdown\nexit\nip default-gateway <عنوان البوابة>',parking:'interface range <المنافذ غير المستخدمة>\nswitchport mode access\nswitchport access vlan <رقم العزل>\nshutdown',access:'interface <منفذ الحاسب>\nswitchport mode access\nswitchport access vlan <رقم الشبكة>\nno shutdown',trunk:'interface <منفذ الوصلة>\nswitchport mode trunk\nswitchport trunk native vlan <رقم>\nswitchport trunk allowed vlan <قائمة>\nno shutdown',subinterfaces:'interface <المنفذ الفعلي>.<رقم فرعي>\ndescription <وصف>\nencapsulation dot1q <وسم VLAN>\nip address <البوابة> <القناع>\nno shutdown'};
 if(key==='parking')hints.push(h('exclude',2,'يساعدك على استبعاد المنافذ المستخدمة قبل تكوين المجموعة.','تتبّع وصلات الأجهزة في المتطلبات. استبعد منافذ الوصلات والحواسيب أولًا؛ إغلاق أحدها يقطع الاتصال.','استخراج قائمة المنافذ غير المستخدمة ثم صياغة الأوامر.'));
 if(key==='subinterfaces')hints.push(h('mapping',2,'يميّز رقم الواجهة الفرعية عن وسم VLAN.','Subinterface واجهة فرعية داخل منفذ Router. رقمها جزء من اسمها؛ الوسم بعد dot1q هو ما يربطها بشبكة VLAN. جهّز مطابقة الوسم والبوابة وnative قبل كتابة الأوامر.','اختيار القيم وصياغة إعداد كل واجهة.'));
 if(patterns[key])hints.push(h('pattern',3,'يعطيك صيغة الأوامر؛ تبقى القيم والمطابقة والتنفيذ عليك.','من Global Configuration (config)#، وضع إعداد الجهاز:\n'+patterns[key]+(key==='subinterfaces'?'\nللشبكة native أضف native إلى التغليف واترك الواجهة بلا IP.':''),'اختيار القيم من المتطلبات وتطبيقها على الأجهزة الصحيحة.'));
 if(key.endsWith('check'))hints.push(h('read',3,'يعطيك أمر العرض ويترك تفسير الناتج لك.',(key==='vlan-check'?'show vlan brief\nقارن رقمي الشبكتين ومنافذهما بالمتطلبات.':'show ip interface brief\nاقرأ IP-Address وStatus وProtocol؛ up تعني أن الحالة عاملة. افحص علاقة الواجهات الفرعية بالمنفذ الفعلي.'),'تشغيل الأمر وتفسير الناتج واكتشاف عدم المطابقة.'));
 const blocks=targets(key).map(id=>{
  const mode=modes[id]||'user', enter=mode==='user'?['enable']:['priv'].includes(mode)?[]:['end'];
  if(!['save','vlan-check','router-check'].includes(key))enter.push('configure terminal');
  return id+':\n'+enter.concat(commands(e,key,id)).join('\n')+(key==='save'?'\nاضغط Enter لقبول startup-config.':'');
 }).join('\n\n');
 hints.push({...h('solution',4,'يكشف أوامر الخطوة كاملة مع تفسيرها؛ لا ينفذها بدلًا عنك.',blocks+'\n'+(key==='vlan-check'?'ابحث عن VLAN '+e.vlans[1]+' مع '+e.pcPorts[0]+' في S1، وVLAN '+e.vlans[2]+' مع '+e.pcPorts[1]+' في S2.':key==='router-check'?'تحتاج الواجهات الفرعية المطلوبة up/up مع عناوينها الصحيحة؛ native بلا عنوان.':key==='save'?'الحفظ هنا داخل الجهاز الافتراضي؛ حفظ المختبر في مدار إجراء مستقل.':'نفّذ في الجهاز المحدد، ثم استخدم التحقق لمقارنة الإعداد بالمطلوب. التنفيذ يغيّر المختبر المفتوح فقط؛ ما ينتقل لأي تبويب آخر تلقائيًا.'),''),full:true,adds:['solution']});
 return {id:'lab452-'+key,revision:1,goal:g,givenFacts:['requirements'],answerFacts:['solution'],hints};
}
// Pure verification reads serialized state. It never edits or repairs the learner's network.
function check(s,e,key){
 const issues=[],add=(device,port,field,actual,expected,show='show running-config')=>issues.push({device,port,field,actual:actual??'غير موجود',expected,show});
 for(const id of targets(key)){
  if(!s.devices[id]){add(id,null,'الجهاز',null,'موجود');continue;}
  if(s.power[id]===false){add(id,null,'الطاقة','متوقفة','مشغلة');continue;}
  const c=s.network[id]||{},f=c.interfaces||{},admin=n=>s.admin[id+':'+n]!==false;
  if(key==='create')e.vlans.forEach((v,i)=>{if(c.vlans?.[v]!==e.names[i])add(id,null,'VLAN '+v,c.vlans?.[v],e.names[i],'show vlan brief');});
  if(key==='management'){const n='Vlan'+e.vlans[0],x=f[n]||{};if(!f[n])add(id,n,'interface',null,n);else if(x.ip!==ip(e,0,id==='S1'?11:12)||x.mask!=='255.255.255.0')add(id,n,'ip address',(x.ip||'unassigned')+' '+(x.mask||''),ip(e,0,id==='S1'?11:12)+' 255.255.255.0');else if(x.shutdown!==false)add(id,n,'shutdown','shutdown','no shutdown');if(c.gateway!==ip(e,0))add(id,null,'ip default-gateway',c.gateway,ip(e,0));}
  if(key==='parking')for(const n of unused(e,id)){const x=f[n]||{};if(x.mode!=='access')add(id,n,'switchport mode',x.mode||'dynamic auto','access');else if(x.access!==e.vlans[3])add(id,n,'switchport access vlan',x.access||1,e.vlans[3]);else if(admin(n))add(id,n,'shutdown','no shutdown','shutdown');}
  if(key==='access'||key==='vlan-check'){const i=id==='S1'?0:1,n=e.pcPorts[i],x=f[n]||{};if(x.mode!=='access')add(id,n,'switchport mode',x.mode||'dynamic auto','access','show interfaces '+n.toLowerCase()+' switchport');else if(x.access!==e.vlans[i+1]||!c.vlans?.[e.vlans[i+1]])add(id,n,'switchport access vlan',x.access||1,e.vlans[i+1],'show vlan brief');else if(!admin(n))add(id,n,'shutdown','shutdown','no shutdown','show ip interface brief');}
  if(key==='trunk')for(const n of id==='S1'?[e.uplink,e.routerSwitch]:[e.uplink]){const x=f[n]||{},wanted=[...e.vlans.slice(0,3),e.vlans[4]].sort((a,b)=>a-b),allowed=Array.isArray(x.allowed)?[...x.allowed].sort((a,b)=>a-b):x.allowed,show='show interfaces '+n.toLowerCase()+' switchport';if(x.mode!=='trunk')add(id,n,'switchport mode',x.mode||'dynamic auto','trunk',show);else if(x.native!==e.vlans[4])add(id,n,'switchport trunk native vlan',x.native||1,e.vlans[4],show);else if(JSON.stringify(allowed)!==JSON.stringify(wanted))add(id,n,'switchport trunk allowed vlan',allowed||'all',wanted.join(','),show);else if(!admin(n))add(id,n,'shutdown','shutdown','no shutdown','show ip interface brief');}
  if(key==='save'){const saved=c.startup,normal=x=>{
   const out=clone({...x,startup:null});for(const [n,f]of Object.entries(out.interfaces||{})){if(/^[FG]\d+\/\d+$/.test(n))out.interfaces[n]={kind:'physical',mode:'dynamic auto',access:1,native:1,allowed:'all',negotiate:true,ip:null,mask:null,description:'',shutdown:false,...f};const p=out.interfaces[n];if(Array.isArray(p.allowed))p.allowed=p.allowed.join(',');else if(p.allowed&&p.allowed!=='all'&&p.allowed!=='none')p.allowed=p.allowed.split(',').flatMap(s=>{const [a,b=a]=s.split('-').map(Number);return Array.from({length:b-a+1},(_,i)=>a+i);}).join(',');}
   const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;return JSON.stringify(stable(out));};
   if(!saved||normal(c)!==normal(saved.config)||ports(id).some(n=>(saved.admin?.[n]!==false)!==admin(n)))add(id,null,'startup-config',saved?'نسخة قديمة':'غير محفوظ','نسخة مطابقة','show startup-config');}
  if(key==='parent'&&!admin(e.routerPort))add(id,e.routerPort,'الإغلاق الإداري','administratively down','enabled','show ip interface brief');
  if(key==='subinterfaces'||key==='router-check')for(const [i,v]of [...e.vlans.slice(0,3),e.vlans[4]].entries()){
   const entries=Object.entries(f).filter(([n,x])=>x.kind==='sub'&&x.parent===e.routerPort&&x.tag===v),found=entries.find(([n,x])=>!x.shutdown&&(i===3?x.nativeTag&&!x.ip:!x.nativeTag&&x.ip===ip(e,i)&&x.mask==='255.255.255.0')&&!!x.description?.trim());
   if(!found){const n=entries[0]?.[0]||e.routerPort+'.'+v,x=f[n];if(!x)add(id,n,'interface',null,n);else if(x.tag!==v||!!x.nativeTag!==(i===3))add(id,n,'encapsulation dot1Q',x.tag,v);else if(x.shutdown)add(id,n,'shutdown','shutdown','no shutdown');else if(i===3?!!x.ip:x.ip!==ip(e,i)||x.mask!=='255.255.255.0')add(id,n,'ip address',(x.ip||'unassigned')+' '+(x.mask||''),i===3?'بدون IP':ip(e,i)+' 255.255.255.0');else add(id,n,'description',x.description||'غير موجود','وصف الواجهة');}
   if(key==='router-check'&&(!admin(e.routerPort)||!s.cables.some(c=>c.a==='R1:'+e.routerPort||c.b==='R1:'+e.routerPort)))add(id,e.routerPort,'المنفذ الفعلي','غير جاهز','وصلة مفعلة','show ip interface brief');
  }
 }
 return {ok:issues.length===0,issues};
}
const api={make,configure,order,titles,requirements,commands,step,check,targets,locator,unused,ip,nextSeed,highlight,clone};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MadarLearning=api;
})(typeof window!=='undefined'?window:globalThis);
