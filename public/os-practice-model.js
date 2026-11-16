(function(root){'use strict';
 const VERSION='os-practice-20261027-v1', clone=x=>JSON.parse(JSON.stringify(x));
 const tasks=[
  {id:'install',lesson:1,scene:4,title:'اختر التثبيت المناسب',subtitle:'النسخة والجهاز والقرص',kind:'install',why:'تتأكد أن Windows يُثبّت على الجهاز المطلوب وبواجهة تناسب المهمة.',question:'لماذا لا يكفي اختيار ملف ISO؟',options:['لأنه يجهّز وسيط الإقلاع؛ التثبيت يحتاج بدء المعالج واختيار النسخة والقرص.','لأنه يضم الجهاز إلى المجال فقط.','لأنه يغيّر اسم السيرفر فقط.'],answer:0,explain:'ISO وسيط التثبيت. اختيار الملف لا ينفذ التثبيت ولا يضبط الشبكة.',hint:'اقرأ اسم الجهاز أولًا، ثم ميّز Server with a GUI عن Server Core. هذه مهمة تثبيت جديد.',reveal:'اختر SVR3، ثم Windows2012R2RTM.iso وشغّل الجهاز. اختر Datacenter Evaluation (Server with a GUI)، وCustom، وDrive 0 Unallocated Space، ووافق على شروط المختبر ثم ثبّت.'},
  {id:'ipv4',lesson:1,scene:8,title:'اضبط الشبكة وافحصها',subtitle:'عنوان ثابت وDNS',kind:'network',why:'تميّز بين عنوان جهازك والبوابة وخادم DNS، ثم تفحص القيم التي حُفظت.',question:'ما الذي تثبته إعادة فتح إعدادات IPv4 بعد الحفظ؟',options:['أن الجهاز أصبح DC.','إعدادات الشبكة المحفوظة؛ لا يثبت وحده الانضمام إلى المجال.','أن كلمة مرور المجال صحيحة.'],answer:1,explain:'قراءة إعدادات الشبكة خطوة تحقق محددة. عضوية المجال تحتاج تحققًا مستقلًا.',hint:'DNS يجيب عن الأسماء، والبوابة طريق الشبكات الأخرى. احفظ القيم ثم اقرأ إعدادات الجهاز.',reveal:'من Server Manager افتح Local Server ثم Ethernet. اضغط باليمين على Ethernet ثم Properties، وحدد Internet Protocol Version 4 ثم Properties. اختر الإدخال اليدوي للعنوان وDNS، وأدخل قيم المهمة ثم OK. أغلق الخصائص وأعد فتح IPv4 للتحقق من القيم.'},
  {id:'join',lesson:1,scene:9,title:'جهّز هوية السيرفر وانضم للمجال',subtitle:'اسم، إعادة تشغيل، وحساب مجال',kind:'join',why:'ترى الفرق بين اسم لم يُطبّق بعد، وعضوية مجال اكتملت، ودخول بحساب محلي.',question:'أي دليل أقوى على الدخول بحساب المجال؟',options:['ظهور سطح المكتب فقط.','نجاح ping فقط.','ظهور ADATUM في هوية المستخدم مع تحقق عضوية الجهاز بالمجال.'],answer:2,explain:'سطح المكتب وping لا يحددان هوية الحساب. نفحص المستخدم وعضوية الجهاز كلًا على حدة.',hint:'تغيير الاسم والانضمام قد ينتظران إعادة التشغيل. دخول Administrator المحلي ليس دخول حساب المجال.',reveal:'اضبط الاسم والمنطقة الزمنية حسب المهمة ثم أعد التشغيل. انضم إلى adatum.com بحساب المجال التجريبي، ثم أعد التشغيل وسجّل بحساب ADATUM. افتح Local Server وتحقق من اسم الجهاز وDomain بعد الدخول بحساب ADATUM.'},
  {id:'core-network',lesson:2,scene:5,title:'جهّز Server Core بنفسك',subtitle:'قائمة SConfig وإعداد الشبكة',kind:'core',why:'تستخدم القائمة النصية وتقرأ رقم كرت الشبكة بدل حفظ رقم ظهر في الفيديو.',question:'لماذا نكتب قناع الشبكة المطلوب صراحة؟',options:['لأن القيمة الافتراضية قد تختلف عن متطلبات المهمة.','لأن DNS يحدد القناع تلقائيًا دائمًا.','لأن بداية عنوان IP تكفي لتحديد القناع.'],answer:0,explain:'المطلوب هو مرجع القناع. لا نعتمد افتراضًا مبنيًا على بداية العنوان أو قيمة جاهزة.',hint:'اكتب sconfig.cmd. اقرأ خيارات القائمة ورقم Index الظاهر. تغيير الاسم يحتاج إعادة تشغيل.',reveal:'SConfig: الخيار 2 للاسم ثم Y لإعادة التشغيل. الخيار 9 للمنطقة الزمنية. الخيار 8 ثم Index الظاهر، وبعده 1 ثم S للعنوان والقناع والبوابة، و2 لـDNS. راجع القيم في قائمة كرت الشبكة، ثم ارجع بـ4 واخرج بـ15 وافحص hostname.'},
  {id:'core-domain',lesson:2,scene:7,title:'تحقّق من الاسم ثم انضم',subtitle:'DNS وعضوية المجال في Core',kind:'core',why:'تفرّق بين حل الاسم، والوصول، والانضمام، وهوية الحساب المستخدم.',question:'نجح ping lon-dc1.adatum.com. هل اكتمل الانضمام؟',options:['نعم؛ نجاح ping ينفذ الانضمام.','لا؛ هو دليل وصول وحل اسم في هذه الحالة، والعضوية إجراء آخر.','نعم؛ كل جهاز له DNS يصبح عضوًا.'],answer:1,explain:'نجاح ping بالاسم لا يغيّر عضوية الجهاز؛ نتحقق منها ومن حساب الدخول بعد الانضمام.',hint:'جرّب الفحص بالاسم. عند تعطل حل الاسم راجع DNS، ثم استخدم Domain/Workgroup في SConfig.',reveal:'صحح Preferred DNS من الخيار8 ثم Index ثم2. ارجع واخرج بـ15، وافحص ping lon-dc1.adatum.com. افتح SConfig واختر1 ثمD، وأدخل adatum.com ثم ADATUM\\Administrator ثم Pa$$w0rd (رمز المحاكاة)، ثم N للاسم وY لإعادة التشغيل. اختر حساب المجال وافحص hostname بعد الدخول. فحص ping يسبق الانضمام في الدرس ويمكن إعادته.'},
  {id:'promote',lesson:3,scene:6,title:'حوّل السيرفر إلى DC إضافي',subtitle:'الدور أولًا ثم Promote',kind:'promote',why:'تفرّق بين تثبيت AD DS وتهيئة Domain Controller، وتتعامل مع نتيجة الفحص قبل التنفيذ.',question:'ظهرت Installation succeeded بعد تثبيت AD DS. ماذا يعني ذلك؟',options:['اكتملت كل تهيئة DC.','تأكد نجاح النسخ المتماثل بين كل السيرفرات.','تثبّت الدور؛ ما زالت تهيئة Promote والتحقق مطلوبة.'],answer:2,explain:'تثبيت الدور وتهيئة DC مرحلتان مختلفتان. إعادة التشغيل وحدها لا تثبت نجاح التهيئة.',hint:'المطلوب DC إضافي في مجال موجود. افحص المتطلبات بعد ضبط الخيارات، ثم نفّذ Promote.',reveal:'اختر LON-SVR1، ودور Active Directory Domain Services مع المكونات التابعة ثم ثبّت الدور. اختر Existing domain وadatum.com وحساب المجال، واترك DNS وGC مفعّلين وRODC مغلقًا. أدخل كلمة مرور الدرس Pa$$w0rd في حقلي DSRM، ثم افحص المتطلبات ونفّذ التهيئة وأعد التشغيل وافحص النتيجة.'},
  {id:'gc',lesson:3,scene:7,title:'صحّح Global Catalog',subtitle:'السيرفر الصحيح قبل التغيير',kind:'gc',why:'تصل إلى خصائص NTDS Settings للسيرفر المقصود وتفحص حالة الفهرس العام.',question:'المطلوب تفعيل GC على LON-SVR1. هل تكفي رؤية GC مفعّلًا على DC1؟',options:['لا؛ يجب التحقق من إعداد السيرفر المطلوب نفسه.','نعم؛ علامة أحد السيرفرات تنطبق على الجميع.','نعم؛ اسم الموقع يغني عن اسم السيرفر.'],answer:0,explain:'Global Catalog خاصية لكل DC. اختيار السيرفر جزء من صحة المهمة.',hint:'اتبع شجرة Sites ثم Servers. راجع اسم السيرفر أعلى الخصائص قبل Apply.',reveal:'افتح Default-First-Site-Name ثم Servers ثم LON-SVR1 ثم NTDS Settings. فعّل Global Catalog واحفظ، ثم افتح الخصائص مرة ثانية للتحقق.'}
 ];
 function definition(id){return tasks.find(t=>t.id===id&&t.enabled!==false);}
 function target(id,variant=0){const v=Math.abs(Number(variant)||0)%3,base=v===0?'172.16.0':v===1?'172.20.0':'172.24.0';return {v,ip:base+(id.startsWith('core')?'.111':'.101'),mask:'255.255.0.0',gateway:base+'.1',dns:base+'.10',name:id.startsWith('core')?(v?`BR${v}-CORE`:'LON-CORE'):id==='join'?(v?`BR${v}-SVR3`:'LON-SVR3'):id==='promote'||id==='gc'?'LON-SVR1':'LON-SVR3',domain:'adatum.com',zone:'UTC+03:00',index:10+v*4};}
 function create(id,variant=0){if(!definition(id))throw Error('Unknown activity');const g=target(id,variant);return {version:VERSION,id,variant:g.v,revision:0,host:'',iso:'',boot:false,edition:'',mode:'',disk:'',license:false,installed:id!=='install',name:id==='core-network'?'WIN-CORE':id==='core-domain'?g.name:id==='join'?'WIN-LAB':g.name,pendingName:'',zone:id==='join'||id==='core-network'?'UTC+00:00':g.zone,ip:id==='ipv4'||id==='core-network'?'':g.ip,mask:id==='ipv4'||id==='core-network'?'':g.mask,gateway:id==='ipv4'||id==='core-network'?'':g.gateway,dns:id==='ipv4'||id==='core-network'?'':id==='core-domain'?g.gateway:g.dns,dcOn:true,domain:id==='promote'||id==='gc'?g.domain:'WORKGROUP',pendingDomain:'',session:'local',role:'',features:false,roleInstalled:id==='gc',deployment:'',promoteDomain:'adatum.com',auth:'local',dnsRole:true,gc:true,rodc:false,dsrm:false,dc:id==='gc',pendingDC:false,precheck:-1,selectedDC:'LON-DC1',gcSVR1:false,gcDC1:true,ntdsOpen:false,evidence:{},shell:'prompt',draft:{},output:['مختبر تعليمي مبسّط — لا يتصل بجهازك أو بشبكة حقيقية.'],message:'',lastCheck:null};}
 const same=(a,b)=>String(a).trim().toLowerCase()===String(b).trim().toLowerCase();
 const ipv4=x=>/^(\d{1,3}\.){3}\d{1,3}$/.test(x)&&x.split('.').every(n=>Number(n)<=255);
 function canResolve(s){const g=target(s.id,s.variant);return s.dcOn&&s.mask===g.mask&&ipv4(s.ip)&&s.ip.startsWith(g.ip.slice(0,g.ip.lastIndexOf('.'))+'.')&&s.ip!==g.dns&&s.dns===g.dns;}
 function touch(s){s.revision++;s.lastCheck=null;}
 function out(s,text){s.output=[...s.output.slice(-49),text];s.message=text;}
 function reboot(s){if(s.pendingName){s.name=s.pendingName;s.pendingName='';}if(s.pendingDomain){s.domain=s.pendingDomain;s.pendingDomain='';}if(s.pendingDC){s.dc=true;s.pendingDC=false;}s.session='local';s.shell='prompt';touch(s);out(s,'اكتملت إعادة التشغيل داخل المحاكاة. الحساب الحالي محلي؛ اختر حساب المجال إذا طلبته المهمة.');}
 function join(s,domain,auth){if(!canResolve(s))return out(s,'تعذر العثور على DC في المحاكاة. راجع إعداد الشبكة وDNS وتشغيل DC1.');if(!same(domain,'adatum.com'))return out(s,'هذا المجال غير موجود في بيئة التدريب.');if(auth!=='domain')return out(s,'استخدم حساب المجال التجريبي المخوّل، لا الحساب المحلي.');s.pendingDomain='adatum.com';touch(s);out(s,'Welcome to adatum.com. العضوية تنتظر إعادة التشغيل.');}
 function command(s,raw){const g=target(s.id,s.variant),v=s.shell==='password'?String(raw):String(raw).trim(),low=v.toLowerCase(),step=s.shell;out(s,'> '+(step==='password'?'[رمز تجريبي مخفي]':v));
  if(low==='cancel'){s.shell='prompt';s.draft={};return out(s,'أُلغي الإدخال الحالي. الإعدادات المطبقة باقية.');}
  if(step==='prompt'){
   if(['sconfig','sconfig.cmd'].includes(low)){s.shell='menu';return out(s,menu(s));}
   if(low==='hostname'){s.evidence.hostname=s.revision;return out(s,s.name);}
   if(low==='ipconfig /all'){s.evidence.ip=s.revision;return out(s,`Host Name: ${s.name}\nDHCP Enabled: ${s.ip?'No':'Yes'}\nIPv4 Address: ${s.ip||'غير مهيأ'}\nSubnet Mask: ${s.mask||'غير مهيأ'}\nDefault Gateway: ${s.gateway||'غير مهيأ'}\nDNS Servers: ${s.dns||'غير مهيأ'}`);}
   if(low==='ping lon-dc1.adatum.com'||low===`ping ${g.dns}`){const named=low.includes('adatum');const ok=named?canResolve(s):s.dcOn&&s.mask===g.mask&&s.ip.startsWith(g.ip.slice(0,g.ip.lastIndexOf('.'))+'.');if(ok&&named)s.evidence.ping=s.revision;return out(s,ok?`Reply from ${g.dns}: bytes=32\nSent=4, Received=4, Lost=0\nدليل وصول محاكى؛ لا يثبت الانضمام للمجال.`:named?'Ping request could not find host أو تعذر الوصول في الحالة الحالية.':'Request timed out.');}
   if(low==='whoami'){s.evidence.user=s.revision;return out(s,s.session==='domain'?'adatum\\administrator':s.name.toLowerCase()+'\\administrator');}
   if(low==='systeminfo'){s.evidence.domain=s.revision;return out(s,`Host Name: ${s.name}\nDomain: ${s.domain}\nSystem role: ${s.dc?'Domain Controller':'Member / Standalone Server'}`);}
   return out(s,'هذا الأمر غير ممثل هنا. المتاح: sconfig.cmd، hostname، ipconfig /all، ping lon-dc1.adatum.com، whoami، systeminfo.');
  }
  if(step==='menu'){
   const routes={'1':'join-kind','2':'name','8':'adapter','9':'zone','12':'restart','15':'prompt'};if(!routes[v])return out(s,'اختر رقمًا ظاهرًا من قائمة التدريب.');s.shell=routes[v];return out(s,{'1':'D = Domain (المجال). اكتب D.','2':'New computer name:','8':`Index ${g.index} — Ethernet\nاكتب Index لكرت الشبكة.`, '9':'أدخل المنطقة الزمنية بصيغة UTC+03:00.', '12':'Restart? Y / N','15':'Command Prompt جاهز.'}[v]);
  }
  if(step==='name'){if(!/^[a-zA-Z][a-zA-Z0-9-]{0,14}$/.test(v))return out(s,'اسم من 1–15 حرفًا يبدأ بحرف؛ حروف وأرقام وشرطة.');s.pendingName=v.toUpperCase();touch(s);s.shell='restart';return out(s,'Restart to apply name? Y / N');}
  if(step==='restart'){if(!/^[yn]$/i.test(v))return out(s,'اكتب Y أو N.');if(low==='y')return reboot(s);s.shell='menu';return out(s,menu(s));}
  if(step==='zone'){if(!/^UTC[+-]\d{2}:\d{2}$/.test(v))return out(s,'استخدم الصيغة UTC+03:00.');s.zone=v;touch(s);s.shell='menu';return out(s,menu(s));}
  if(step==='adapter'){if(v!==String(g.index))return out(s,'لا يوجد كرت بهذا Index. اقرأ الرقم المعروض.');s.shell='adapter-menu';return out(s,adapterMenu(s));}
  if(step==='adapter-menu'){s.evidence.networkView=s.revision;s.shell=v==='1'?'static':v==='2'?'dns':v==='4'?'menu':step;return out(s,s.shell==='static'?'S = Static':s.shell==='dns'?'Preferred DNS Server:':s.shell==='menu'?menu(s):'اختر 1 أو2 أو4.');}
  if(step==='static'){if(low!=='s')return out(s,'يمثل هذا التدريب الإعداد الثابت: اكتب S.');s.shell='ip';return out(s,'IP Address:');}
  if(['ip','mask','gateway','dns'].includes(step)){
   const val=v||(step==='mask'?'255.255.255.0':'');if(!ipv4(val))return out(s,'عنوان IPv4 غير صالح. أعد إدخال أربعة أرقام مفصولة بنقاط.');
   if(step==='dns'){s.dns=val;touch(s);s.shell='dns-alt';return out(s,'Alternate DNS Server (اتركه فارغًا إن لم يُطلب):');}
   s.draft[step]=val;if(step==='gateway'){Object.assign(s,s.draft);s.draft={};touch(s);s.shell='adapter-menu';return out(s,adapterMenu(s));}
   s.shell=step==='ip'?'mask':'gateway';return out(s,step==='ip'?'Subnet Mask [255.255.255.0]:':'Default Gateway:');
  }
  if(step==='dns-alt'){if(v)return out(s,'هذا المختبر لا يتضمن DNS بديلًا. اترك الحقل فارغًا واضغط Enter.');s.shell='adapter-menu';return out(s,adapterMenu(s));}
  if(step==='join-kind'){if(low!=='d')return out(s,'اختر D للانضمام إلى Domain.');s.shell='join-domain';return out(s,'Name of domain to join:');}
  if(step==='join-domain'){s.draft.domain=v;s.shell='join-user';return out(s,'Authorized domain user:');}
  if(step==='join-user'){s.draft.auth=same(v,'ADATUM\\Administrator')||same(v,'administrator@adatum.com')?'domain':'local';s.shell='password';return out(s,'كلمة مرور الدرس: Pa$$w0rd. لا تستخدم كلمة مرور شخصية.');}
  if(step==='password'){if(v!=='Pa$$w0rd')return out(s,'اكتب كلمة مرور الدرس Pa$$w0rd كما هي.');join(s,s.draft.domain,s.draft.auth);s.draft={};s.shell=s.pendingDomain?'rename-after-join':'menu';return out(s,s.pendingDomain?'Change computer name? N (الاسم مجهز).':menu(s));}
  if(step==='rename-after-join'){if(low!=='n')return out(s,'الاسم مجهز في هذه المهمة؛ اختر N.');s.shell='restart';return out(s,'Restart? Y / N');}
 }
 function adapterMenu(s){s.evidence.networkView=s.revision;return `Network Adapter Settings
Index: ${target(s.id,s.variant).index}
DHCP Enabled: ${s.ip?'False':'True'}
IP Address: ${s.ip||'Not configured'}
Subnet Mask: ${s.mask||'Not configured'}
Default Gateway: ${s.gateway||'Not configured'}
Preferred DNS Server: ${s.dns||'Not configured'}

1) Set Network Adapter Address
2) Set DNS Servers
4) Return to Main Menu`;}
 function menu(s){return `SConfig · ${s.name} · ${s.domain}\n1) Domain / Workgroup\n2) Computer Name\n8) Network Settings\n9) Date and Time\n12) Restart Server\n15) Exit to Command Line\nقائمة مختصرة للمهارات الممثلة؛ cancel يلغي الإدخال الحالي.`;}
 function act(input,action,data={}){const s=clone(input);if(!definition(s.id))throw Error('Unknown activity');const g=target(s.id,s.variant);s.message='';
  if(action==='command'){command(s,data.value);return s;}
  if(action==='install'){Object.assign(s,{host:String(data.host),iso:String(data.iso),edition:String(data.edition),mode:String(data.mode),disk:String(data.disk),license:!!data.license,boot:!!data.boot});touch(s);if(s.host!=='LON-SVR3')out(s,'الجهاز المحدد ليس جهاز التثبيت المطلوب. لم نغيّر جهازًا آخر.');else if(s.iso!=='Windows2012R2RTM.iso'||!s.boot)out(s,'جهّز وسيط ISO وشغّل الجهاز من وسيط التثبيت.');else if(!s.edition||!s.mode||!s.disk||!s.license)out(s,'أكمل اختيارات التثبيت والموافقة التجريبية.');else if(s.mode!=='Custom')out(s,'الجهاز فارغ؛ لا يوجد Windows سابق لترقيته. اختر التثبيت الجديد.');else if(s.disk!=='Drive 0 Unallocated Space')out(s,'القرص المحدد غير موجود في جهاز المختبر الفارغ.');else {s.installed=true;out(s,`اكتمل التثبيت المحاكى: ${s.edition}. افحص إن كانت النتيجة توافق المهمة.`);} }
  if(action==='network'){if(!['ip','mask','gateway','dns'].every(k=>ipv4(String(data[k]||''))))out(s,'لم تُطبق القيم؛ أحد عناوين IPv4 غير صالح.');else{for(const k of ['ip','mask','gateway','dns'])s[k]=data[k];touch(s);out(s,'حُفظت الإعدادات. افحص الحالة الفعلية بأمر ipconfig /all.');}}
  if(action==='identity'){if(!/^[a-zA-Z][a-zA-Z0-9-]{0,14}$/.test(data.name||''))out(s,'اسم الجهاز غير صالح.');else{s.pendingName=data.name.toUpperCase();s.zone=String(data.zone);touch(s);out(s,'الاسم ينتظر إعادة التشغيل. المنطقة الزمنية طُبقت داخل المختبر فقط.');}}
  if(action==='join')join(s,data.domain,data.auth);
  if(action==='reboot')reboot(s);
  if(action==='login'){if(data.account==='domain'&&s.domain==='WORKGROUP')out(s,'هذا الجهاز لم يكمل الانضمام بعد.');else{s.session=data.account==='domain'?'domain':'local';touch(s);out(s,'جلسة المحاكاة الحالية: '+(s.session==='domain'?'ADATUM\\Administrator':s.name+'\\Administrator'));}}
  if(action==='role'){s.host=String(data.host);s.role=String(data.role);s.features=!!data.features;touch(s);if(s.host!=='LON-SVR1')out(s,'الهدف المطلوب LON-SVR1؛ لم يُثبّت الدور على جهاز آخر.');else if(s.role!=='AD DS')out(s,'الخدمة المختارة ليست AD DS المطلوبة.');else if(!s.features)out(s,'أضف المكونات التابعة المطلوبة للدور.');else{s.roleInstalled=true;out(s,'Installation succeeded — تثبّت AD DS. الجهاز لم يصبح DC بعد.');}}
  if(action==='options'){s.deployment=String(data.deployment);s.promoteDomain=String(data.domain);s.auth=String(data.auth);s.dnsRole=!!data.dnsRole;s.gc=!!data.gc;s.rodc=!!data.rodc;s.dsrm=data.secret==='Pa$$w0rd'&&data.confirm==='Pa$$w0rd';touch(s);out(s,'حُفظت الخيارات دون حفظ رمز DSRM. افحص المتطلبات قبل التهيئة.');}
  if(action==='precheck'){const blockers=[];if(!s.roleInstalled)blockers.push('ثبّت AD DS أولًا');if(!canResolve(s))blockers.push('راجع اتصال DC1 وDNS');if(s.deployment!=='existing')blockers.push('المطلوب DC إضافي في مجال موجود');if(!same(s.promoteDomain,g.domain))blockers.push('راجع اسم المجال');if(s.auth!=='domain')blockers.push('استخدم حساب المجال المخوّل');if(!s.dsrm)blockers.push('أدخل كلمة مرور الدرس Pa$$w0rd في حقلي DSRM');s.precheck=blockers.length?-1:s.revision;out(s,blockers.length?'لم يجتز الفحص: '+blockers.join('؛ '):'All prerequisite checks passed successfully — الفحص نجح؛ التهيئة لم تبدأ بعد.');}
  if(action==='promote'){if(s.precheck!==s.revision)out(s,'افحص المتطلبات بعد آخر تعديل قبل تنفيذ التهيئة.');else{s.pendingDC=true;touch(s);out(s,'نجحت مرحلة التهيئة في المحاكاة. أعد التشغيل ثم افحص حالة السيرفر.');}}
  if(action==='dc-check'){s.evidence.dc=s.revision;out(s,`Server: ${s.name}\nAD DS installed: ${s.roleInstalled}\nDomain Controller: ${s.dc}\nDNS Server: ${s.dc&&s.dnsRole}\nGlobal Catalog: ${s.dc&&(s.id==='gc'?s.gcSVR1:s.gc)}\nRead-only DC: ${s.dc&&s.rodc}\nهذه حالة نموذج التدريب، وليست تحققًا من سيرفر فعلي.`);}
  if(action==='open-ntds'){s.selectedDC=data.server==='LON-SVR1'?'LON-SVR1':'LON-DC1';s.ntdsOpen=true;s.evidence.gcView=s.revision;s.evidence.gcServer=s.selectedDC;out(s,`NTDS Settings · ${s.selectedDC}\nGlobal Catalog: ${s.selectedDC==='LON-SVR1'?s.gcSVR1:s.gcDC1}`);}
  if(action==='gc-apply'){if(!s.ntdsOpen)out(s,'افتح NTDS Settings أولًا.');else{if(s.selectedDC==='LON-SVR1')s.gcSVR1=!!data.enabled;else s.gcDC1=!!data.enabled;touch(s);s.ntdsOpen=false;out(s,'حُفظت الخاصية على '+s.selectedDC+'. أعد فتحها للتحقق.');}}
  return s;
 }
 function inspect(s){const g=target(s.id,s.variant),checks=[];const add=(label,ok)=>checks.push({label,ok:!!ok});const net=()=>{add('عنوان الجهاز يطابق المهمة',s.ip===g.ip);add('قناع الشبكة يطابق المهمة',s.mask===g.mask);add('البوابة في خانتها الصحيحة',s.gateway===g.gateway);add('DNS هو خادم الأسماء المطلوب',s.dns===g.dns);};
  if(s.id==='install'){add('التثبيت على LON-SVR3',s.host==='LON-SVR3');add('وسيط التثبيت والتشغيل والموافقة مكتملة',s.iso==='Windows2012R2RTM.iso'&&s.boot&&s.license);add('التثبيت اكتمل بالواجهة GUI',s.installed&&s.edition==='GUI');add('تثبيت جديد على المساحة غير المخصصة',s.mode==='Custom'&&s.disk==='Drive 0 Unallocated Space');}
  if(s.id==='ipv4'||s.id==='core-network'){net();add(s.id==='ipv4'?'أعدت فتح إعدادات IPv4 بعد الحفظ':'راجعت إعداد الشبكة بعد التغيير',s.evidence.ip===s.revision||s.evidence.networkView===s.revision);}
  if(s.id==='core-network'){add('الاسم المطلوب طُبق بعد إعادة التشغيل',same(s.name,g.name)&&!s.pendingName);add('المنطقة الزمنية حسب المهمة',s.zone===g.zone);add('قرأت hostname بعد آخر تغيير',s.evidence.hostname===s.revision);}
  if(s.id==='join'||s.id==='core-domain'){add('الجهاز يحمل الاسم المطلوب',same(s.name,g.name)&&!s.pendingName);add('عضوية المجال اكتملت بعد إعادة التشغيل',same(s.domain,g.domain)&&!s.pendingDomain);add('جلسة الدخول بحساب المجال',s.session==='domain');add('راجعت العضوية أو اسم الجهاز بعد الدخول',s.id==='join'?(s.evidence.localView===s.revision||s.evidence.domain===s.revision):(s.evidence.hostname===s.revision||s.evidence.domain===s.revision));if(s.id==='join')add('المنطقة الزمنية المطلوبة',s.zone===g.zone);if(s.id==='core-domain')add('فحصت الاتصال بالاسم داخل المحاولة',Number.isInteger(s.evidence.ping)&&canResolve(s));}
  if(s.id==='promote'){add('AD DS مثبت على LON-SVR1',s.host==='LON-SVR1'&&s.role==='AD DS'&&s.roleInstalled);add('اكتملت تهيئة DC الإضافي وإعادة تشغيله',s.dc&&!s.pendingDC&&s.deployment==='existing'&&same(s.promoteDomain,g.domain)&&s.auth==='domain'&&s.dsrm);add('خيارات DNS وGC مفعلة وRODC مغلق',s.dnsRole&&s.gc&&!s.rodc);add('فُحصت نتيجة التهيئة الحالية',s.evidence.dc===s.revision);}
  if(s.id==='gc'){add('GC مفعل على LON-SVR1',s.gcSVR1);add('بقي GC على DC1 دون إلغاء',s.gcDC1);add('أعدت فتح خصائص السيرفر المطلوب بعد الحفظ',s.evidence.gcView===s.revision&&s.evidence.gcServer==='LON-SVR1');}
  return {passed:checks.every(x=>x.ok),checks};
 }
 root.MadarOSPractice={VERSION,tasks,definition,target,create,act,inspect,menu,canResolve};
})(typeof window==='undefined'?globalThis:window);

(function(root){'use strict';
const api=root.MadarOSPractice, base={...api}, catalog=[
  {
    "id": "course-4",
    "lesson": 4,
    "scene": 1,
    "title": "إنشاء المجالات والغابات",
    "subtitle": "AD DS Configuration Wizard",
    "kind": "curriculum",
    "console": "AD DS Configuration Wizard",
    "host": "LON-SVR1",
    "why": "Module 2 — Exercise 1 — Part 2: تعرّف Tree Domain وChild Domain، وإنشاء Forest جديدة، واختيار المسار حسب المطلوب.",
    "question": "تحتاج مجالًا باسم مختلف داخل الغابة الحالية. أي مسار يناسب ذلك؟",
    "options": [
      "Child Domain تحت اسم المجال الحالي.",
      "إنشاء Forest مستقلة.",
      "Tree Domain داخل الغابة الحالية."
    ],
    "answer": 2,
    "explain": "Tree Domain داخل الغابة الحالية. نتيجة المحاكاة تخص هذه المحاولة، ولا تثبت تنفيذًا على Windows فعلي.",
    "hint": "راجع الجهاز والحساب والنتيجة الفعلية في لوحة الحالة. تعديل الإعداد يختلف عن فحص أثره.",
    "reveal": "افتح العملية من الأداة، ثم راجع خطوات المصدر والقيم المطلوبة. أدخلها بنفسك، طبّق الإعداد ثم افتح عملية التحقق المرتبطة.",
    "actions": [
      {
        "id": "tree",
        "scene": 2,
        "title": "Deployment Configuration",
        "op": "put",
        "values": {
          "mode": "Tree Domain",
          "parent": "mylab.local",
          "domain": "msftwebcast.local",
          "account": "Administrator",
          "password": "Pa$$w0rd"
        },
        "device": "LON-SVR1",
        "console": "AD DS Configuration Wizard",
        "entity": "domains",
        "key": "tree",
        "choices": {
          "mode": [
            "Additional DC",
            "Tree Domain",
            "Child Domain",
            "New forest"
          ]
        },
        "scenes": [
          1,
          2
        ],
        "sourceScene": "os1-lesson-4-scene-02",
        "menu": "Deployment Configuration"
      },
      {
        "id": "tree-options",
        "scene": 3,
        "title": "Domain Controller Options",
        "op": "put",
        "values": {
          "forestLevel": "Windows Server 2012 R2",
          "domainLevel": "Windows Server 2012 R2",
          "dns": true,
          "gc": true,
          "dsrm": "Pa$$w0rd",
          "confirm": "Pa$$w0rd"
        },
        "device": "LON-SVR1",
        "console": "AD DS Configuration Wizard",
        "entity": "domainOptions",
        "key": "tree",
        "requires": [
          "tree"
        ],
        "sourceScene": "os1-lesson-4-scene-03",
        "menu": "Domain Controller Options"
      },
      {
        "id": "tree-review",
        "scene": 4,
        "title": "Review Options / Domains and Trusts",
        "op": "view",
        "values": {},
        "device": "LON-SVR1",
        "console": "AD DS Configuration Wizard",
        "entity": "domains",
        "key": "tree",
        "expected": {
          "mode": "Tree Domain",
          "parent": "mylab.local",
          "domain": "msftwebcast.local"
        },
        "requires": [
          "tree-options"
        ],
        "sourceScene": "os1-lesson-4-scene-04",
        "menu": "Review Options / Domains and Trusts"
      },
      {
        "id": "child",
        "scene": 5,
        "title": "Deployment Configuration",
        "op": "put",
        "values": {
          "mode": "Child Domain",
          "parent": "mylab.local",
          "domain": "delhi",
          "account": "Administrator",
          "password": "Pa$$w0rd"
        },
        "device": "LON-SVR1",
        "console": "AD DS Configuration Wizard",
        "entity": "domains",
        "key": "child",
        "choices": {
          "mode": [
            "Additional DC",
            "Tree Domain",
            "Child Domain",
            "New forest"
          ]
        },
        "sourceScene": "os1-lesson-4-scene-05",
        "menu": "Deployment Configuration"
      },
      {
        "id": "child-options",
        "scene": 6,
        "title": "Domain Controller Options",
        "op": "put",
        "values": {
          "forestLevel": "Windows Server 2012 R2",
          "domainLevel": "Windows Server 2012 R2",
          "dns": true,
          "gc": true,
          "dsrm": "Pa$$w0rd",
          "confirm": "Pa$$w0rd"
        },
        "device": "LON-SVR1",
        "console": "AD DS Configuration Wizard",
        "entity": "domainOptions",
        "key": "child",
        "requires": [
          "child"
        ],
        "sourceScene": "os1-lesson-4-scene-06",
        "menu": "Domain Controller Options"
      },
      {
        "id": "forest",
        "scene": 7,
        "title": "Deployment Configuration",
        "op": "put",
        "values": {
          "mode": "New forest",
          "parent": "",
          "domain": "training.local",
          "account": "Administrator",
          "password": "Pa$$w0rd"
        },
        "device": "LON-SVR1",
        "console": "AD DS Configuration Wizard",
        "entity": "domains",
        "key": "forest",
        "choices": {
          "mode": [
            "Additional DC",
            "Tree Domain",
            "Child Domain",
            "New forest"
          ]
        },
        "sourceScene": "os1-lesson-4-scene-07",
        "menu": "Deployment Configuration"
      },
      {
        "id": "forest-options",
        "scene": 8,
        "title": "Domain Controller Options",
        "op": "put",
        "values": {
          "forestLevel": "Windows Server 2012 R2",
          "domainLevel": "Windows Server 2012 R2",
          "dns": true,
          "gc": true,
          "dsrm": "Pa$$w0rd",
          "confirm": "Pa$$w0rd"
        },
        "device": "LON-SVR1",
        "console": "AD DS Configuration Wizard",
        "entity": "domainOptions",
        "key": "forest",
        "requires": [
          "forest"
        ],
        "sourceScene": "os1-lesson-4-scene-08",
        "menu": "Domain Controller Options"
      },
      {
        "id": "child-review",
        "scene": 9,
        "title": "Review Options / Domains and Trusts",
        "op": "view",
        "values": {},
        "device": "LON-SVR1",
        "console": "AD DS Configuration Wizard",
        "entity": "domains",
        "key": "child",
        "expected": {
          "mode": "Child Domain",
          "parent": "mylab.local",
          "domain": "delhi"
        },
        "requires": [
          "child-options"
        ],
        "sourceScene": "os1-lesson-4-scene-09",
        "menu": "Review Options / Domains and Trusts"
      },
      {
        "id": "forest-review",
        "scene": 9,
        "title": "Review Options / Domains and Trusts",
        "op": "view",
        "values": {},
        "device": "LON-SVR1",
        "console": "AD DS Configuration Wizard",
        "entity": "domains",
        "key": "forest",
        "expected": {
          "mode": "New forest",
          "parent": "",
          "domain": "training.local"
        },
        "requires": [
          "forest-options"
        ],
        "sourceScene": "os1-lesson-4-scene-09",
        "menu": "Review Options / Domains and Trusts"
      }
    ],
    "sources": [
      {
        "title": "اختيار نوع الإضافة",
        "steps": [
          "بعد تثبيت Active Directory Domain Services (AD DS)، خدمة حسابات وأجهزة المجال، افتح Promote this server to a domain controller لبدء التهيئة.",
          "Add a domain controller to an existing domain: إضافة DC، خادم إدارة المجال، إلى مجال موجود؛ هذا خيار الجزء الأول.",
          "Add a new domain to an existing forest: إنشاء Domain (مجال) جديد داخل Forest (غابة) موجودة؛ الغابة تجمع مجالًا أو أكثر في بنية مشتركة.",
          "في هذا الجزء نتعرف إلى نوعي المجال الجديد: Tree Domain وChild Domain، ثم خيار الغابة الجديدة."
        ],
        "warnings": [
          "اختر حسب المطلوب؛ إضافة DC لا تعني إنشاء مجال جديد."
        ],
        "notes": [
          "رسم المحاضر يعرض adatum.com وTrt.com داخل غابة واحدة. الأسماء أمثلة للشرح."
        ],
        "id": "os1-lesson-4-scene-01",
        "video": "/assets/os1/os1-lesson-4/01.mp4?v=part2-v1",
        "poster": "/assets/os1/os1-lesson-4/01.jpg",
        "seconds": 55.44
      },
      {
        "title": "Tree Domain: تحديد النوع وحساب الإدارة",
        "steps": [
          "في Deployment Configuration، صفحة تحديد نوع التهيئة، اختر Add a new domain to an existing forest.",
          "من Select domain type اختر Tree Domain؛ مجال جديد باسم كامل مختلف عن أسماء المجالات الحالية، لكنه داخل الغابة نفسها.",
          "لاحظ تغيّر الخانات إلى Forest name وNew domain name.",
          "من Change حدد حساب الإدارة المخوّل بالإنشاء وكلمة مروره؛ أسماء حسابات العرض ليست مطلوبة لكل مختبر."
        ],
        "warnings": [
          "Tree Domain لا ينشئ Forest جديدة؛ اختيار الغابة الجديدة له خيار مستقل."
        ],
        "notes": [
          "Child Domain يأخذ اسم المجال الأب ضمن اسمه؛ مثل ab.adatum.com. أما Tree Domain فقد يكون مثل Trt.com داخل الغابة نفسها."
        ],
        "id": "os1-lesson-4-scene-02",
        "video": "/assets/os1/os1-lesson-4/02.mp4?v=part2-v1",
        "poster": "/assets/os1/os1-lesson-4/02.jpg",
        "seconds": 56.52
      },
      {
        "title": "Tree Domain: الأسماء وحساب الإدارة",
        "steps": [
          "في Forest name اكتب اسم المجال الجذري للغابة الحالية؛ في المثال mylab.local.",
          "في New domain name اكتب الاسم الكامل للمجال الجديد؛ في المثال msftwebcast.local.",
          "استخدم Change لتحديد حساب مخوّل بإنشاء مجال داخل الغابة، ثم أدخل كلمة مروره؛ لا تنسخ بيانات حساب المثال.",
          "راجع اسم الغابة واسم المجال الجديد قبل Next؛ باقي خيارات DC تأتي بعد تحديد هذه البيانات."
        ],
        "warnings": [
          "لا تضف .mylab.local تلقائيًا إلى اسم Tree Domain؛ المثال ينشئ msftwebcast.local."
        ],
        "notes": [
          "الحساب يحتاج صلاحيات إنشاء مجال في الغابة، مثل عضوية Enterprise Admins. العرض يختصر بعض مراحل التهيئة؛ ظهور الصفحة التالية وحده لا يثبت اكتمالها."
        ],
        "id": "os1-lesson-4-scene-03",
        "video": "/assets/os1/os1-lesson-4/03.mp4?v=part2-v1",
        "poster": "/assets/os1/os1-lesson-4/03.jpg",
        "seconds": 43.92
      },
      {
        "title": "عرض المجال الجديد بعد التهيئة",
        "steps": [
          "بعد نجاح التهيئة، يمكن فتح Active Directory Users and Computers، أداة إدارة مستخدمي وأجهزة المجال، لمراجعة اسم المجال ووجود DC ضمنه.",
          "افتح Active Directory Domains and Trusts، أداة عرض المجالات وعلاقات الثقة، لمراجعة ظهور المجال الجديد مع المجال القائم."
        ],
        "warnings": [
          "التسجيل يقفز بين مراحل الإعداد والنتيجة؛ لا تعتبر الأجزاء المحذوفة خطوات نُفذت أمامك."
        ],
        "notes": [
          "هذا مشهد عرض للنتيجة في مثال المحاضر، وليس اختبارًا شاملًا لعمل خدمات الدليل أو جهازك."
        ],
        "id": "os1-lesson-4-scene-04",
        "video": "/assets/os1/os1-lesson-4/04.mp4?v=part2-v1",
        "poster": "/assets/os1/os1-lesson-4/04.jpg",
        "seconds": 21.52
      },
      {
        "title": "Child Domain: النوع وحساب الإدارة",
        "steps": [
          "اختر Add a new domain to an existing forest، ثم Child Domain من Select domain type.",
          "Child Domain هو مجال فرعي تحت مجال أب؛ مثل delhi.mylab.local تحت mylab.local.",
          "من Change أدخل حسابًا مخوّلًا بالإنشاء في الغابة وكلمة مروره، ثم OK."
        ],
        "warnings": [
          "الحساب المحلي على الجهاز وحده لا يكفي بالضرورة لإنشاء مجال داخل الغابة."
        ],
        "notes": [
          "الفيديو يستخدم مثال Windows Server 2019 للتوضيح؛ استخدم أسماء الأجهزة والحسابات المطلوبة في مختبرك."
        ],
        "id": "os1-lesson-4-scene-05",
        "video": "/assets/os1/os1-lesson-4/05.mp4?v=part2-v1",
        "poster": "/assets/os1/os1-lesson-4/05.jpg",
        "seconds": 47.0
      },
      {
        "title": "Child Domain: المجال الأب والاسم الجديد",
        "steps": [
          "في Parent domain name حدد المجال الأب؛ يمكنك استخدام Select لعرض المجالات المتاحة.",
          "في New domain name اكتب الجزء الجديد فقط؛ مثل delhi عندما يكون الأب mylab.local.",
          "الاسم الكامل الناتج هو delhi.mylab.local. اضغط Next للانتقال إلى Domain Controller Options.",
          "اضبط خيارات DC وكلمة مرور Directory Services Restore Mode (DSRM)، وضع استعادة خدمة الدليل، حسب متطلبات المختبر."
        ],
        "warnings": [
          "اختيار مجال أب مختلف يغيّر الاسم الكامل للمجال الجديد؛ راجع Parent domain name قبل المتابعة."
        ],
        "notes": [
          "المشهد ينتهي عند خيارات DC؛ لا يعرض اكتمال تثبيت Child Domain."
        ],
        "id": "os1-lesson-4-scene-06",
        "video": "/assets/os1/os1-lesson-4/06.mp4?v=part2-v1",
        "poster": "/assets/os1/os1-lesson-4/06.jpg",
        "seconds": 42.12
      },
      {
        "title": "إنشاء Forest جديدة",
        "steps": [
          "من معالج تهيئة AD DS اختر Add a new forest؛ إنشاء غابة جديدة منفصلة عن الغابة الموجودة.",
          "في Root domain name اكتب الاسم الكامل لأول مجال في الغابة الجديدة، حسب المطلوب.",
          "اضغط Next للانتقال إلى خيارات الغابة والمجال الجديد."
        ],
        "warnings": [
          "لا تستخدم Add a new forest إذا كان المطلوب مجالًا إضافيًا داخل غابة موجودة."
        ],
        "notes": [
          "أسماء الغابة والمجال في الرسم أمثلة توضيحية؛ لا يلزم نسخها إلى كل تمرين."
        ],
        "id": "os1-lesson-4-scene-07",
        "video": "/assets/os1/os1-lesson-4/07.mp4?v=part2-v1",
        "poster": "/assets/os1/os1-lesson-4/07.jpg",
        "seconds": 41.32
      },
      {
        "title": "خيارات الغابة وكلمة مرور الاستعادة",
        "steps": [
          "راجع Forest functional level وDomain functional level؛ مستوى وظائف الغابة والمجال يحدد الميزات وتوافق أنظمة DC.",
          "اختر المستويات المطلوبة والمتوافقة مع المختبر؛ لا تختَر إصدارًا قديمًا لمجرد ظهوره في المثال.",
          "راجع DNS Server، خدمة تحويل الأسماء إلى عناوين، وGlobal Catalog (GC)، الفهرس العام للدليل.",
          "اكتب كلمة مرور DSRM في Password وأعدها كما هي في Confirm password، ثم Next."
        ],
        "warnings": [
          "يظهر في المصدر خطأ عدم تطابق كلمة مرور DSRM مع تأكيدها؛ صحّح الخانتين قبل المتابعة. هذا المشهد لا يثبت نجاح التهيئة."
        ],
        "notes": [
          "يعرض المثال أنظمة أقدم لتوضيح اختيار Functional level؛ قيم المثال ليست تعليمات ثابتة لكل جهاز."
        ],
        "id": "os1-lesson-4-scene-08",
        "video": "/assets/os1/os1-lesson-4/08.mp4?v=part2-v1",
        "poster": "/assets/os1/os1-lesson-4/08.jpg",
        "seconds": 59.8
      },
      {
        "title": "مراجعة الخيارات وتطبيقها على الرسم",
        "steps": [
          "DC إضافي لنفس المجال: Add a domain controller to an existing domain.",
          "مجال جديد داخل نفس الغابة: Add a new domain to an existing forest، ثم Tree Domain أو Child Domain.",
          "غابة جديدة: Add a new forest، ثم تحديد Root domain name.",
          "اقرأ المطلوب أولًا، ثم اختر المسار المناسب بدل حفظ ترتيب الأزرار وحده."
        ],
        "warnings": [],
        "notes": [
          "يمكن إنشاء Child Domain تحت مجال فرعي موجود؛ مثل ab.cte.adatum.com. حدّد الأب الصحيح من الرسم.",
          "نهاية المحاضرة تعرض صفحات لتمرين IFM وModule 3 تمهيدًا لما بعده؛ لم تُدرج كدروس مكتملة ضمن هذا الجزء."
        ],
        "id": "os1-lesson-4-scene-09",
        "video": "/assets/os1/os1-lesson-4/09.mp4?v=part2-v1",
        "poster": "/assets/os1/os1-lesson-4/09.jpg",
        "seconds": 67.6
      }
    ],
    "note": "يُطبّق هذا المختبر خيارات المجالات التي يعرضها الدرس. بعض المصادر تقف عند الخيارات؛ مراجعة النتيجة هنا نموذج تعليمي، ولا تُنسب تهيئة كاملة إلى الفيديو. training.local اسم تدريب للغابة الجديدة التي لم يثبت المصدر اسمًا ملزمًا لها.",
    "sceneCoverage": [
      {
        "scene": "os1-lesson-4-scene-01",
        "actions": [
          "tree"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-4-scene-02",
        "actions": [
          "tree"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-4-scene-03",
        "actions": [
          "tree-options"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-4-scene-04",
        "actions": [
          "tree-review"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-4-scene-05",
        "actions": [
          "child"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-4-scene-06",
        "actions": [
          "child-options"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-4-scene-07",
        "actions": [
          "forest"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-4-scene-08",
        "actions": [
          "forest-options"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-4-scene-09",
        "actions": [
          "child-review",
          "forest-review"
        ],
        "role": "procedure-or-context"
      }
    ]
  },
  {
    "id": "course-5",
    "lesson": 5,
    "scene": 1,
    "title": "Module 3 · Exercise 1 · إنشاء وإدارة كائنات AD — الجزء الأول",
    "subtitle": "Active Directory Users and Computers",
    "kind": "curriculum",
    "console": "Active Directory Users and Computers",
    "host": "LON-DC1",
    "why": "تنظيم المستخدمين والأجهزة والمجموعات داخل OU، والتمييز بين نقل الكائن وعضويته في مجموعة.",
    "question": "نقلت Holly إلى Branch Office 1. ما الذي يثبت موقعها التنظيمي الجديد؟",
    "options": [
      "تغيير اسمها الظاهر فقط.",
      "ظهور حسابها داخل OU المقصودة عند تحديث ADUC.",
      "إضافتها إلى مجموعة تحمل اسم القسم فقط."
    ],
    "answer": 1,
    "explain": "ظهور حسابها داخل OU المقصودة عند تحديث ADUC. نتيجة المحاكاة تخص هذه المحاولة، ولا تثبت تنفيذًا على Windows فعلي.",
    "hint": "راجع الجهاز والحساب والنتيجة الفعلية في لوحة الحالة. تعديل الإعداد يختلف عن فحص أثره.",
    "reveal": "افتح العملية من الأداة، ثم راجع خطوات المصدر والقيم المطلوبة. أدخلها بنفسك، طبّق الإعداد ثم افتح عملية التحقق المرتبطة.",
    "actions": [
      {
        "id": "ou-Branch Office 1",
        "scene": 1,
        "title": "New Object — Organizational Unit · Branch Office 1",
        "op": "put",
        "values": {
          "name": "Branch Office 1",
          "parent": "Adatum.com",
          "protected": true
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "entity": "ous",
        "key": "Branch Office 1",
        "sourceScene": "os1-lesson-5-scene-01",
        "menu": "New Object — Organizational Unit · Branch Office 1"
      },
      {
        "id": "ou-Temporary OU",
        "scene": 2,
        "title": "New Object — Organizational Unit · Temporary OU",
        "op": "put",
        "values": {
          "name": "Temporary OU",
          "parent": "Adatum.com",
          "protected": true
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "entity": "ous",
        "key": "Temporary OU",
        "sourceScene": "os1-lesson-5-scene-02",
        "menu": "New Object — Organizational Unit · Temporary OU"
      },
      {
        "id": "advanced",
        "scene": 2,
        "title": "View → Advanced Features",
        "op": "put",
        "values": {
          "advanced": true
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "entity": "settings",
        "key": "ADUC",
        "sourceScene": "os1-lesson-5-scene-02",
        "menu": "View → Advanced Features"
      },
      {
        "id": "unprotect",
        "scene": 2,
        "title": "OU Properties → Object",
        "op": "put",
        "values": {
          "protected": false
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "entity": "ous",
        "key": "Temporary OU",
        "update": true,
        "requires": [
          "advanced"
        ],
        "sourceScene": "os1-lesson-5-scene-02",
        "menu": "OU Properties → Object"
      },
      {
        "id": "delete-ou",
        "scene": 2,
        "title": "Delete Organizational Unit",
        "op": "delete",
        "values": {
          "confirm": true
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "entity": "ous",
        "key": "Temporary OU",
        "requires": [
          "unprotect"
        ],
        "sourceScene": "os1-lesson-5-scene-02",
        "menu": "Delete Organizational Unit"
      },
      {
        "id": "user-BranchLab",
        "scene": 3,
        "title": "New Object — User · BranchLab",
        "op": "put",
        "values": {
          "name": "BranchLab",
          "ou": "Branch Office 1",
          "password": "Pa$$w0rd",
          "confirm": "Pa$$w0rd",
          "enabled": true,
          "mustChange": false,
          "cannotChange": false,
          "neverExpires": false,
          "first": "Branch",
          "last": "Lab",
          "initials": "BL"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "entity": "users",
        "key": "BranchLab",
        "sourceScene": "os1-lesson-5-scene-03",
        "menu": "New Object — User · BranchLab"
      },
      {
        "id": "user-options",
        "scene": 4,
        "title": "User Properties → Account",
        "op": "view",
        "values": {},
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "entity": "users",
        "key": "BranchLab",
        "expected": {
          "enabled": true,
          "mustChange": false,
          "cannotChange": false
        },
        "sourceScene": "os1-lesson-5-scene-04",
        "menu": "User Properties → Account"
      },
      {
        "id": "group-Branch 1 Help Desk",
        "scene": 5,
        "title": "New Object — Group · Branch 1 Help Desk",
        "op": "put",
        "values": {
          "name": "Branch 1 Help Desk",
          "ou": "Branch Office 1",
          "scope": "Global",
          "type": "Security"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "entity": "groups",
        "key": "Branch 1 Help Desk",
        "sourceScene": "os1-lesson-5-scene-05",
        "menu": "New Object — Group · Branch 1 Help Desk"
      },
      {
        "id": "group-Branch 1 Administrators",
        "scene": 5,
        "title": "New Object — Group · Branch 1 Administrators",
        "op": "put",
        "values": {
          "name": "Branch 1 Administrators",
          "ou": "Branch Office 1",
          "scope": "Global",
          "type": "Security"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "entity": "groups",
        "key": "Branch 1 Administrators",
        "sourceScene": "os1-lesson-5-scene-05",
        "menu": "New Object — Group · Branch 1 Administrators"
      },
      {
        "id": "group-Branch 1 Users",
        "scene": 5,
        "title": "New Object — Group · Branch 1 Users",
        "op": "put",
        "values": {
          "name": "Branch 1 Users",
          "ou": "Branch Office 1",
          "scope": "Global",
          "type": "Security"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "entity": "groups",
        "key": "Branch 1 Users",
        "sourceScene": "os1-lesson-5-scene-05",
        "menu": "New Object — Group · Branch 1 Users"
      },
      {
        "id": "member-BranchLab-Branch 1 Users",
        "scene": 6,
        "title": "Properties → Members → Add",
        "op": "member",
        "values": {
          "member": "BranchLab",
          "group": "Branch 1 Users"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "sourceScene": "os1-lesson-5-scene-06",
        "menu": "Properties → Members → Add"
      },
      {
        "id": "members",
        "scene": 6,
        "title": "Properties → Members",
        "op": "view",
        "values": {},
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "entity": "groups",
        "key": "Branch 1 Users",
        "expected": {
          "members": [
            "BranchLab"
          ]
        },
        "sourceScene": "os1-lesson-5-scene-06",
        "menu": "Properties → Members"
      },
      {
        "id": "move-Holly",
        "scene": 7,
        "title": "Move User — Holly",
        "op": "put",
        "values": {
          "ou": "Branch Office 1"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "entity": "users",
        "key": "Holly",
        "update": true,
        "sourceScene": "os1-lesson-5-scene-07",
        "menu": "Move User — Holly"
      },
      {
        "id": "move-Bart",
        "scene": 7,
        "title": "Move User — Bart",
        "op": "put",
        "values": {
          "ou": "Branch Office 1"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "entity": "users",
        "key": "Bart",
        "update": true,
        "sourceScene": "os1-lesson-5-scene-07",
        "menu": "Move User — Bart"
      },
      {
        "id": "move-Ed",
        "scene": 7,
        "title": "Move User — Ed",
        "op": "put",
        "values": {
          "ou": "Branch Office 1"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "entity": "users",
        "key": "Ed",
        "update": true,
        "sourceScene": "os1-lesson-5-scene-07",
        "menu": "Move User — Ed"
      },
      {
        "id": "move-Connie",
        "scene": 7,
        "title": "Move User — Connie",
        "op": "put",
        "values": {
          "ou": "Branch Office 1"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "entity": "users",
        "key": "Connie",
        "update": true,
        "sourceScene": "os1-lesson-5-scene-07",
        "menu": "Move User — Connie"
      },
      {
        "id": "move-Barbara",
        "scene": 7,
        "title": "Move User — Barbara",
        "op": "put",
        "values": {
          "ou": "Branch Office 1"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "entity": "users",
        "key": "Barbara",
        "update": true,
        "sourceScene": "os1-lesson-5-scene-07",
        "menu": "Move User — Barbara"
      },
      {
        "id": "move-Arlene",
        "scene": 7,
        "title": "Move User — Arlene",
        "op": "put",
        "values": {
          "ou": "Branch Office 1"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "entity": "users",
        "key": "Arlene",
        "update": true,
        "sourceScene": "os1-lesson-5-scene-07",
        "menu": "Move User — Arlene"
      },
      {
        "id": "move-client",
        "scene": 8,
        "title": "Move Computer — LON-CL1",
        "op": "put",
        "values": {
          "ou": "Branch Office 1"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "entity": "computers",
        "key": "LON-CL1",
        "update": true,
        "sourceScene": "os1-lesson-5-scene-08",
        "menu": "Move Computer — LON-CL1"
      },
      {
        "id": "objects",
        "scene": 8,
        "title": "Refresh Branch Office 1",
        "op": "view",
        "values": {},
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "entity": "ous",
        "key": "Branch Office 1",
        "expected": {
          "protected": true
        },
        "sourceScene": "os1-lesson-5-scene-08",
        "menu": "Refresh Branch Office 1"
      }
    ],
    "sources": [
      {
        "id": "os1-lesson-5-scene-01",
        "title": "فتح ADUC وإنشاء OU",
        "video": "/assets/os1/os1-lesson-5/01.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-5/01.jpg",
        "seconds": 80.0,
        "steps": [
          "على LON-DC1 سجّل الدخول بحساب إدارة المختبر، ثم Server Manager → Tools → Active Directory Users and Computers (ADUC)، أداة إدارة المستخدمين والأجهزة.",
          "وسّع Adatum.com، واضغط باليمين على المجال ثم New → Organizational Unit (OU)، وحدة تنظيمية تجمع الكائنات.",
          "اكتب اسم OU ثم OK. لإنشاء OU داخل أخرى، اضغط باليمين على الحاوية الأب نفسها ثم New → Organizational Unit.",
          "لتجهيز تمرين التفويض التالي أنشئ OU باسم Branch Office 1 مباشرة تحت Adatum.com. أمثلة الحاويات السابقة في الشرح ليست بديلًا عن هذه الحاوية."
        ],
        "notes": [
          "التسجيل يعرض مثالًا خارجيًا ضمن شرح المدرس؛ تختلف أسماء البيئة عن مختبر A. Datum."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-5-scene-02",
        "title": "تنظيم الحاويات وحمايتها من الحذف",
        "video": "/assets/os1/os1-lesson-5/02.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-5/02.jpg",
        "seconds": 50.0,
        "steps": [
          "اختر OU الصحيحة قبل الإضافة؛ الكائن الجديد ينشأ داخل الحاوية المحددة.",
          "لرؤية حماية الحذف افتح View → Advanced Features، ثم خصائص OU → Object.",
          "Protect object from accidental deletion يحمي من الحذف غير المقصود. أبقِه مفعّلًا في الاستخدام العادي.",
          "إذا كان المطلوب في المختبر حذف OU تجريبية، أزل الحماية عنها وحدها ثم Apply → OK، وبعدها Delete مع مراجعة الاسم والتحذير.",
          "أعد إنشاء أي OU يحتاجها التمرين التالي؛ الحذف ليس خطوة مطلوبة على Branch Office 1."
        ],
        "notes": [
          "الحماية تقلل الحذف العرضي، ولا تعني أن الحاوية غير قابلة للحذف مطلقًا."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-5-scene-03",
        "title": "إنشاء مستخدم داخل الحاوية",
        "video": "/assets/os1/os1-lesson-5/03.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-5/03.jpg",
        "seconds": 130.0,
        "steps": [
          "داخل OU المطلوبة اختر New → User.",
          "اكتب First name وLast name، وراجع Full name. خانة Initials للأحرف الأولى من الاسم وليست وصف المستخدم.",
          "اكتب User logon name فريدًا واختر لاحقة المجال الصحيحة ثم Next.",
          "اكتب Password وConfirm password بالقيمة المطلوبة في المختبر، واضبط خيارات الحساب في المشهد التالي.",
          "اضغط Next → Finish، ثم افتح خصائص المستخدم للتأكد من الاسم وحاويته."
        ],
        "notes": [
          "Initials تعني الأحرف الأولى للاسم؛ ليست خانة للألقاب مثل Mr أو Dr."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-5-scene-04",
        "title": "خيارات كلمة المرور وحالة الحساب",
        "video": "/assets/os1/os1-lesson-5/04.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-5/04.jpg",
        "seconds": 85.0,
        "steps": [
          "في صفحة كلمة المرور: User must change password at next logon يلزم المستخدم بتغييرها عند دخوله التالي.",
          "User cannot change password يمنع المستخدم من تغييرها بنفسه؛ لا تجمعه مع إلزامه بتغييرها عند الدخول.",
          "Password never expires يوقف انتهاء صلاحية كلمة المرور لهذا الحساب، وليس انتهاء صلاحية الحساب نفسه.",
          "Account is disabled يمنع تسجيل الدخول بالحساب؛ يستخدم لاحقًا في حساب القالب.",
          "اختر ما يطلبه التمرين، ثم Next → Finish. في حساب مستخدم فعلي يحتاج الدخول تأكد أنه غير معطل وأن كلمة المرور تطابق سياسة المجال."
        ],
        "notes": [
          "الحساب المعطل لا يستطيع تسجيل الدخول؛ تعطيله لا يخفيه من أدوات الإدارة."
        ],
        "warnings": [
          "كلمات المرور وخيارات عدم الانتهاء في التسجيل أمثلة مختبر، وليست سياسة موصى بها للحسابات الحقيقية."
        ]
      },
      {
        "id": "os1-lesson-5-scene-05",
        "title": "إنشاء مجموعة وتحديد نوعها",
        "video": "/assets/os1/os1-lesson-5/05.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-5/05.jpg",
        "seconds": 105.0,
        "steps": [
          "اضغط باليمين على OU ثم New → Group.",
          "اكتب اسم المجموعة، واختر Group scope: Global وGroup type: Security في مجموعات هذا التمرين، ثم OK.",
          "داخل Branch Office 1 أنشئ ثلاث مجموعات منفصلة: Branch 1 Help Desk، وBranch 1 Administrators، وBranch 1 Users.",
          "راجع أسماء المجموعات ونوعها وموقعها قبل متابعة التفويض؛ مجرد إنشاء المجموعة لا يضيف إليها مستخدمين."
        ],
        "notes": [
          "Security group مجموعة يمكن استخدامها لإسناد الأذونات. لا يكفي اسم المجموعة لمنح أذونات تلقائيًا."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-5-scene-06",
        "title": "إضافة الأعضاء والتحقق من العضوية",
        "video": "/assets/os1/os1-lesson-5/06.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-5/06.jpg",
        "seconds": 93.0,
        "steps": [
          "المسار الظاهر في المقطع: افتح خصائص المستخدم → Member Of → Add.",
          "اكتب اسم المجموعة المقصودة، ثم Check Names → OK → Apply → OK.",
          "للتحقق افتح المجموعة نفسها → Properties → Members، وتأكد أن المستخدم موجود.",
          "بديل يؤدي نفس الإضافة: من خصائص المجموعة → Members → Add، أدخل المستخدم وتحقق من اسمه.",
          "يمكن إضافة مجموعة إلى مجموعة أخرى بالطريقة نفسها ضمن قواعد نوع المجموعة؛ راجع اتجاه العضوية: المجموعة الموجودة في Member Of هي المجموعة التي ينتمي إليها الكائن."
        ],
        "notes": [
          "Members تعرض أعضاء المجموعة؛ Member Of تعرض المجموعات التي ينتمي إليها الكائن المحدد."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-5-scene-07",
        "title": "نقل المستخدم إلى OU أخرى",
        "video": "/assets/os1/os1-lesson-5/07.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-5/07.jpg",
        "seconds": 41.0,
        "steps": [
          "لنقل مستخدم: اضغط عليه باليمين → Move، واختر OU الوجهة ثم OK؛ النقل يغيّر مكان الكائن وليس عضويته تلقائيًا.",
          "لتجهيز Branch Office 1 انقل Holly Dickson من IT، وBart Duncan من Development، وEd Meadows من Managers.",
          "انقل Connie Vrettos من Marketing، وBarbara Zighetti من Research، وArlene Huff من Sales إلى Branch Office 1 أيضًا.",
          "افتح Branch Office 1 وتأكد أن المستخدمين الستة موجودون قبل بدء الجزء الثاني.",
          "إذا كنت تكرر المختبر فلا تنشئ حسابات بديلة بهذه الأسماء فوق الحسابات الأصلية؛ استخدم نقطة بداية التمرين الصحيحة."
        ],
        "notes": [
          "Move يغير موضع الكائن؛ Add to a group يغير العضوية. العمليتان مختلفتان."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-5-scene-08",
        "title": "نقل حساب الجهاز ومراجعة مكانه",
        "video": "/assets/os1/os1-lesson-5/08.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-5/08.jpg",
        "seconds": 88.0,
        "steps": [
          "في ADUC افتح Computers وابحث عن حساب LON-CL1.",
          "اضغط باليمين على LON-CL1 → Move → Branch Office 1 → OK.",
          "راجع Branch Office 1: المستخدمون الستة والمجموعات الثلاث وحساب LON-CL1. هذه متطلبات الجزء الثاني.",
          "شغّل جهاز LON-CL1 عند الحاجة إلى اختبار الدخول؛ نقل حسابه داخل AD لا ينقل ملفات الجهاز ولا يشغّل الجهاز الافتراضي."
        ],
        "notes": [
          "نقل حساب الجهاز داخل AD لا ينقل ملفات الجهاز ولا ينقله إلى شبكة أخرى."
        ],
        "warnings": []
      }
    ],
    "sceneCoverage": [
      {
        "scene": "os1-lesson-5-scene-01",
        "actions": [
          "ou-Branch Office 1"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-5-scene-02",
        "actions": [
          "ou-Temporary OU",
          "advanced",
          "unprotect",
          "delete-ou"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-5-scene-03",
        "actions": [
          "user-BranchLab"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-5-scene-04",
        "actions": [
          "user-options"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-5-scene-05",
        "actions": [
          "group-Branch 1 Help Desk",
          "group-Branch 1 Administrators",
          "group-Branch 1 Users"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-5-scene-06",
        "actions": [
          "member-BranchLab-Branch 1 Users",
          "members"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-5-scene-07",
        "actions": [
          "move-Holly",
          "move-Bart",
          "move-Ed",
          "move-Connie",
          "move-Barbara",
          "move-Arlene"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-5-scene-08",
        "actions": [
          "move-client",
          "objects"
        ],
        "role": "procedure-or-context"
      }
    ]
  },
  {
    "id": "course-6",
    "lesson": 6,
    "scene": 1,
    "title": "Module 3 · Exercise 1 · تفويض التحكم — الجزء الثاني",
    "subtitle": "Active Directory Users and Computers",
    "kind": "curriculum",
    "console": "Active Directory Users and Computers",
    "host": "LON-DC1",
    "why": "تحديد من يملك تنفيذ مهام معينة وعلى أي كائنات، ثم اختبار الصلاحيات بحساب المفوَّض.",
    "question": "Bart يستطيع إعادة كلمة مرور Connie ولا يستطيع حذف حسابها. ما التفسير؟",
    "options": [
      "صلاحيات Help Desk المفوضة تسمح بإعادة كلمة المرور دون الحذف.",
      "عضوية Domain Users تمنحه جميع صلاحيات الإدارة.",
      "كلمة مرور Bart مختلفة عن كلمة مرور Holly."
    ],
    "answer": 0,
    "explain": "صلاحيات Help Desk المفوضة تسمح بإعادة كلمة المرور دون الحذف. نتيجة المحاكاة تخص هذه المحاولة، ولا تثبت تنفيذًا على Windows فعلي.",
    "hint": "راجع الجهاز والحساب والنتيجة الفعلية في لوحة الحالة. تعديل الإعداد يختلف عن فحص أثره.",
    "reveal": "افتح العملية من الأداة، ثم راجع خطوات المصدر والقيم المطلوبة. أدخلها بنفسك، طبّق الإعداد ثم افتح عملية التحقق المرتبطة.",
    "actions": [
      {
        "id": "preparation",
        "scene": 1,
        "title": "Branch Office 1 — Objects",
        "op": "view",
        "values": {},
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "entity": "ous",
        "key": "Branch Office 1",
        "expected": {},
        "sourceScene": "os1-lesson-6-scene-01",
        "menu": "Branch Office 1 — Objects"
      },
      {
        "id": "admins",
        "scene": 2,
        "title": "Delegation of Control Wizard",
        "op": "put",
        "values": {
          "principal": "Branch 1 Administrators",
          "ou": "Branch Office 1",
          "objects": "Users / Groups",
          "tasks": [
            "manage-users",
            "reset-password",
            "read-users",
            "manage-groups",
            "membership",
            "gpo-links"
          ]
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "entity": "delegations",
        "key": "admins",
        "sourceScene": "os1-lesson-6-scene-02",
        "menu": "Delegation of Control Wizard"
      },
      {
        "id": "computers",
        "scene": 3,
        "title": "Delegation of Control Wizard",
        "op": "put",
        "values": {
          "principal": "Branch 1 Administrators",
          "ou": "Branch Office 1",
          "objects": "Computer",
          "tasks": [
            "create",
            "delete",
            "full-control"
          ]
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "entity": "delegations",
        "key": "computers",
        "sourceScene": "os1-lesson-6-scene-03",
        "menu": "Delegation of Control Wizard"
      },
      {
        "id": "helpdesk",
        "scene": 4,
        "title": "Delegation of Control Wizard",
        "op": "put",
        "values": {
          "principal": "Branch 1 Help Desk",
          "ou": "Branch Office 1",
          "objects": "Users / Groups",
          "tasks": [
            "reset-password",
            "membership"
          ]
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "entity": "delegations",
        "key": "helpdesk",
        "sourceScene": "os1-lesson-6-scene-04",
        "menu": "Delegation of Control Wizard"
      },
      {
        "id": "member-Holly-Branch 1 Administrators",
        "scene": 4,
        "title": "Properties → Members → Add",
        "op": "member",
        "values": {
          "member": "Holly",
          "group": "Branch 1 Administrators"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "sourceScene": "os1-lesson-6-scene-04",
        "menu": "Properties → Members → Add"
      },
      {
        "id": "member-Branch 1 Administrators-Server Operators",
        "scene": 4,
        "title": "Properties → Members → Add",
        "op": "member",
        "values": {
          "member": "Branch 1 Administrators",
          "group": "Server Operators"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "sourceScene": "os1-lesson-6-scene-04",
        "menu": "Properties → Members → Add"
      },
      {
        "id": "login-Holly-6",
        "scene": 5,
        "title": "Windows Security — Sign in",
        "op": "login",
        "values": {
          "account": "Holly",
          "password": "Pa$$w0rd"
        },
        "device": "LON-DC1",
        "console": "Windows Security",
        "sourceScene": "os1-lesson-6-scene-05",
        "menu": "Windows Security — Sign in"
      },
      {
        "id": "holly-inside",
        "scene": 5,
        "title": "ADUC — delete User",
        "op": "permission",
        "values": {
          "ou": "Branch Office 1",
          "kind": "User",
          "operation": "delete"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "actor": "Holly",
        "expectedAllowed": true,
        "sourceScene": "os1-lesson-6-scene-05",
        "menu": "ADUC — delete User"
      },
      {
        "id": "holly-outside",
        "scene": 5,
        "title": "ADUC — delete User",
        "op": "permission",
        "values": {
          "ou": "Sales",
          "kind": "User",
          "operation": "delete"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "actor": "Holly",
        "expectedAllowed": false,
        "sourceScene": "os1-lesson-6-scene-05",
        "menu": "ADUC — delete User"
      },
      {
        "id": "login-Administrator-9",
        "scene": 6,
        "title": "Windows Security — Sign in",
        "op": "login",
        "values": {
          "account": "Administrator",
          "password": "Pa$$w0rd"
        },
        "device": "LON-DC1",
        "console": "Windows Security",
        "sourceScene": "os1-lesson-6-scene-06",
        "menu": "Windows Security — Sign in"
      },
      {
        "id": "member-Bart-Branch 1 Help Desk",
        "scene": 6,
        "title": "Properties → Members → Add",
        "op": "member",
        "values": {
          "member": "Bart",
          "group": "Branch 1 Help Desk"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "sourceScene": "os1-lesson-6-scene-06",
        "menu": "Properties → Members → Add"
      },
      {
        "id": "member-Branch 1 Help Desk-Server Operators",
        "scene": 6,
        "title": "Properties → Members → Add",
        "op": "member",
        "values": {
          "member": "Branch 1 Help Desk",
          "group": "Server Operators"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "sourceScene": "os1-lesson-6-scene-06",
        "menu": "Properties → Members → Add"
      },
      {
        "id": "login-Bart-12",
        "scene": 6,
        "title": "Windows Security — Sign in",
        "op": "login",
        "values": {
          "account": "Bart",
          "password": "Pa$$w0rd"
        },
        "device": "LON-DC1",
        "console": "Windows Security",
        "sourceScene": "os1-lesson-6-scene-06",
        "menu": "Windows Security — Sign in"
      },
      {
        "id": "bart-delete",
        "scene": 6,
        "title": "ADUC — delete User",
        "op": "permission",
        "values": {
          "ou": "Branch Office 1",
          "kind": "User",
          "operation": "delete"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "actor": "Bart",
        "expectedAllowed": false,
        "sourceScene": "os1-lesson-6-scene-06",
        "menu": "ADUC — delete User"
      },
      {
        "id": "bart-reset",
        "scene": 6,
        "title": "ADUC — reset-password User",
        "op": "permission",
        "values": {
          "ou": "Branch Office 1",
          "kind": "User",
          "operation": "reset-password"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "actor": "Bart",
        "expectedAllowed": true,
        "sourceScene": "os1-lesson-6-scene-06",
        "menu": "ADUC — reset-password User"
      }
    ],
    "sources": [
      {
        "id": "os1-lesson-6-scene-01",
        "title": "أجزاء التفويض الثلاثة",
        "video": "/assets/os1/os1-lesson-6/01.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-6/01.jpg",
        "seconds": 98.0,
        "steps": [
          "ابدأ بعد تجهيز Branch Office 1 وكائناتها في الجزء الأول، وعلى LON-DC1 بحساب Administrator الخاص بالمختبر.",
          "حدّد ثلاثة أشياء قبل التفويض: من يستلم الصلاحية، وعلى أي OU أو حاوية، وما العمليات المسموحة.",
          "في هذا التمرين الجهة الأولى Branch 1 Administrators والثانية Branch 1 Help Desk، والوجهة Branch Office 1.",
          "عضوية المستخدم في المجموعة هي التي تمنحه التفويض الممنوح لها؛ وجود حسابه داخل OU وحده لا يمنحه إدارة OU."
        ],
        "notes": [
          "Delegation of Control تفويض إدارة محددة داخل جزء من Active Directory، وليس تحويل المستخدم إلى مسؤول عن المجال كله."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-6-scene-02",
        "title": "تفويض مهام المستخدمين والمجموعات",
        "video": "/assets/os1/os1-lesson-6/02.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-6/02.jpg",
        "seconds": 120.0,
        "steps": [
          "اضغط باليمين على Branch Office 1 → Delegate Control → Next → Add.",
          "اكتب Branch 1 Administrators → Check Names → OK → Next.",
          "اختر Delegate the following common tasks. في العرض حُددت: Create, delete, and manage user accounts؛ Reset user passwords and force password change at next logon؛ Read all user information.",
          "وحُددت أيضًا: Create, delete and manage groups؛ Modify the membership of a group؛ Manage Group Policy links.",
          "اضغط Next، وراجع أن الوجهة Branch Office 1 والمجموعة Branch 1 Administrators، ثم Finish."
        ],
        "notes": [
          "منح إنشاء المستخدمين لا يثبت تلقائيًا صلاحية إنشاء OU أو إدارة كل نوع من الكائنات."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-6-scene-03",
        "title": "تفويض مخصص لكائنات الأجهزة",
        "video": "/assets/os1/os1-lesson-6/03.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-6/03.jpg",
        "seconds": 71.0,
        "steps": [
          "على Branch Office 1 افتح Delegate Control مرة أخرى وأضف Branch 1 Administrators.",
          "اختر Create a custom task to delegate → Next.",
          "اختر Only the following objects in the folder، وحدد Computer objects.",
          "فعّل Create selected objects in this folder وDelete selected objects in this folder ثم Next.",
          "في Permissions اختر Full Control ثم Next → Finish، وراجع أن نوع الكائن هو Computer objects.",
          "هذا تحكم كامل في كائنات الأجهزة المحددة داخل الحاوية، وليس منح Full Control غير محدود على المجال كله."
        ],
        "notes": [
          "Full Control هنا مقيد بنوع الكائن والحاوية المحددين في المعالج."
        ],
        "warnings": [
          "لا تعمم Full Control على جميع كائنات Domain (المجال)."
        ]
      },
      {
        "id": "os1-lesson-6-scene-04",
        "title": "مهام Help Desk وعضوية الحساب",
        "video": "/assets/os1/os1-lesson-6/04.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-6/04.jpg",
        "seconds": 106.0,
        "steps": [
          "كرر Delegate Control على Branch Office 1 للمجموعة Branch 1 Help Desk.",
          "اختر من المهام الشائعة Reset user passwords and force password change at next logon وModify the membership of a group فقط، ثم Next → Finish.",
          "بحساب Administrator، أضف Holly Dickson إلى Branch 1 Administrators: زر يمين على المستخدم → Add to a group → اسم المجموعة → Check Names → OK.",
          "للسماح بالدخول المحلي إلى DC1 في هذا المختبر، أضف Branch 1 Administrators إلى Server Operators بالطريقة نفسها.",
          "تحقق من العضويات قبل تسجيل الخروج؛ اسم مجموعة التفويض ليس حساب تسجيل الدخول."
        ],
        "notes": [
          "التسجيل يضيف حسابًا إلى Server Operators لاحتياجات مختبره."
        ],
        "warnings": [
          "Server Operators مجموعة ذات صلاحيات إدارية واسعة على Domain Controller؛ لا تستخدمها كحل عام لمجرد السماح بتسجيل الدخول.",
          "إضافة المجموعة إلى Server Operators إجراء خاص بهذا المختبر يمنح قدرات أخرى على الخادم؛ لا تعمّمه كشرط لتفويض إدارة OU في بيئة حقيقية."
        ]
      },
      {
        "id": "os1-lesson-6-scene-05",
        "title": "اختبار حدود التفويض",
        "video": "/assets/os1/os1-lesson-6/05.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-6/05.jpg",
        "seconds": 65.0,
        "steps": [
          "سجّل الخروج من DC1، وادخل باسم Adatum\\Holly وكلمة مرور المختبر.",
          "افتح Server Manager؛ إذا ظهر UAC، أدخل Holly وكلمتها حتى يبقى الاختبار بصلاحيات الحساب المفوّض، ثم Tools → ADUC.",
          "جرّب حذف حساب المختبر المحدد داخل Branch Office 1، وقارن بمحاولة حذف حساب داخل Sales خارج الحاوية المفوّضة.",
          "المتوقع: العملية داخل حدود التفويض تنجح، وخارجها ترفض. راجع اسم الكائن ومكانه قبل تأكيد الحذف.",
          "لا تدخل بيانات Administrator في اختبار الصلاحية؛ نجاح العملية عندها لن يثبت صلاحيات Holly."
        ],
        "notes": [
          "نجاح الإجراء بحساب Administrator لا يثبت نجاح التفويض للحساب الآخر."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-6-scene-06",
        "title": "فصل إعادة تعيين كلمة المرور عن الحذف",
        "video": "/assets/os1/os1-lesson-6/06.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-6/06.jpg",
        "seconds": 118.0,
        "steps": [
          "ارجع بحساب Administrator لإكمال الإعداد: أضف Bart Duncan إلى Branch 1 Help Desk، وأضف مجموعة Help Desk إلى Server Operators للدخول إلى DC1 في المختبر.",
          "سجّل الخروج ثم ادخل باسم Adatum\\Bart، وافتح Server Manager وADUC ببيانات Bart عند طلب UAC.",
          "داخل Branch Office 1 جرّب Delete على Connie Vrettos؛ المتوقع رفض الحذف لأن Help Desk لم تُمنح إدارة الحسابات كاملة.",
          "على الحساب نفسه اختر Reset Password، وأدخل كلمة المرور وتأكيدها وخيار تغييرها عند الدخول حسب الطلب، ثم OK.",
          "تحقق من نجاح إعادة تعيين كلمة المرور مع استمرار رفض الحذف؛ اختلاف النتيجتين هو دليل حدود التفويض."
        ],
        "notes": [
          "رسالة رفض الإجراء دليل على حدّ الصلاحية في هذه التجربة، وليست سببًا لمنح الحساب كل الصلاحيات."
        ],
        "warnings": [
          "عمليات الحذف وإعادة كلمات المرور هنا على حسابات المختبر فقط. عضوية Server Operators يضبطها Administrator؛ التفويض المحدود لا يمنح تعديل هذه المجموعة."
        ]
      }
    ],
    "note": "تبدأ هذه التجربة بكائن DelegationTestUser داخل Branch Office 1 لاختبار الحذف دون إزالة حسابات الدرس. إضافة Server Operators إجراء خاص بمعمل المصدر، وليست توصية لمنحها في الإنتاج.",
    "sceneCoverage": [
      {
        "scene": "os1-lesson-6-scene-01",
        "actions": [
          "preparation"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-6-scene-02",
        "actions": [
          "admins"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-6-scene-03",
        "actions": [
          "computers"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-6-scene-04",
        "actions": [
          "helpdesk",
          "member-Holly-Branch 1 Administrators",
          "member-Branch 1 Administrators-Server Operators"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-6-scene-05",
        "actions": [
          "login-Holly-6",
          "holly-inside",
          "holly-outside"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-6-scene-06",
        "actions": [
          "login-Administrator-9",
          "member-Bart-Branch 1 Help Desk",
          "member-Branch 1 Help Desk-Server Operators",
          "login-Bart-12",
          "bart-delete",
          "bart-reset"
        ],
        "role": "procedure-or-context"
      }
    ]
  },
  {
    "id": "course-7",
    "lesson": 7,
    "scene": 1,
    "title": "Module 3 · Exercise 2 · قالب المستخدم والمجلد المنزلي",
    "subtitle": "Active Directory Users and Computers",
    "kind": "curriculum",
    "console": "Active Directory Users and Computers",
    "host": "LON-DC1",
    "why": "إنشاء حساب قالب معطل، وضبط خصائصه ومجموعاته ومسار المجلد المنزلي، ثم نسخ مستخدم والتحقق من دخوله.",
    "question": "لماذا يبقى حساب القالب معطلًا بينما يُفعّل الحساب المنسوخ؟",
    "options": [
      "تعطيل القالب يعطل كل مستخدم نُسخ منه تلقائيًا.",
      "المجلد المنزلي لا يعمل إلا إذا كان المستخدم معطلًا.",
      "القالب لحفظ خصائص متكررة؛ الحساب المنسوخ هو الذي يستخدمه الموظف."
    ],
    "answer": 2,
    "explain": "القالب لحفظ خصائص متكررة؛ الحساب المنسوخ هو الذي يستخدمه الموظف. نتيجة المحاكاة تخص هذه المحاولة، ولا تثبت تنفيذًا على Windows فعلي.",
    "hint": "راجع الجهاز والحساب والنتيجة الفعلية في لوحة الحالة. تعديل الإعداد يختلف عن فحص أثره.",
    "reveal": "افتح العملية من الأداة، ثم راجع خطوات المصدر والقيم المطلوبة. أدخلها بنفسك، طبّق الإعداد ثم افتح عملية التحقق المرتبطة.",
    "actions": [
      {
        "id": "share",
        "scene": 1,
        "title": "Folder Properties → Advanced Sharing",
        "op": "put",
        "values": {
          "path": "C:\\branch1-userdata",
          "name": "branch1-userdata",
          "enabled": true,
          "principal": "Everyone",
          "permission": "Full Control"
        },
        "device": "LON-DC1",
        "console": "File Explorer",
        "entity": "shares",
        "key": "branch1-userdata",
        "sourceScene": "os1-lesson-7-scene-01",
        "menu": "Folder Properties → Advanced Sharing"
      },
      {
        "id": "user-_Branch_template",
        "scene": 2,
        "title": "New Object — User · _Branch_template",
        "op": "put",
        "values": {
          "name": "_Branch_template",
          "ou": "Branch Office 1",
          "password": "Pa$$w0rd",
          "confirm": "Pa$$w0rd",
          "enabled": false,
          "mustChange": false,
          "cannotChange": false,
          "neverExpires": false
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "entity": "users",
        "key": "_Branch_template",
        "sourceScene": "os1-lesson-7-scene-02",
        "menu": "New Object — User · _Branch_template"
      },
      {
        "id": "address",
        "scene": 3,
        "title": "User Properties → Address",
        "op": "put",
        "values": {
          "city": "Jeddah"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "entity": "users",
        "key": "_Branch_template",
        "update": true,
        "sourceScene": "os1-lesson-7-scene-03",
        "menu": "User Properties → Address"
      },
      {
        "id": "member-_Branch_template-Branch 1 Users",
        "scene": 3,
        "title": "Properties → Members → Add",
        "op": "member",
        "values": {
          "member": "_Branch_template",
          "group": "Branch 1 Users"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "sourceScene": "os1-lesson-7-scene-03",
        "menu": "Properties → Members → Add"
      },
      {
        "id": "profile",
        "scene": 4,
        "title": "User Properties → Profile",
        "op": "put",
        "values": {
          "drive": "Z:",
          "home": "\\\\LON-DC1\\branch1-userdata\\%username%"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "entity": "users",
        "key": "_Branch_template",
        "update": true,
        "sourceScene": "os1-lesson-7-scene-04",
        "menu": "User Properties → Profile"
      },
      {
        "id": "copy",
        "scene": 5,
        "title": "Copy Object — User",
        "op": "copy-user",
        "values": {
          "source": "_Branch_template",
          "name": "Ed",
          "first": "Ed",
          "last": "Meadows",
          "enabled": true,
          "password": "Pa$$w0rd",
          "confirm": "Pa$$w0rd"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "sourceScene": "os1-lesson-7-scene-05",
        "menu": "Copy Object — User"
      },
      {
        "id": "login-Ed-6",
        "scene": 6,
        "title": "Windows Security — Sign in",
        "op": "login",
        "values": {
          "account": "Ed",
          "password": "Pa$$w0rd"
        },
        "device": "LON-CL1",
        "console": "Windows Security",
        "sourceScene": "os1-lesson-7-scene-06",
        "menu": "Windows Security — Sign in"
      },
      {
        "id": "home",
        "scene": 6,
        "title": "This PC → Z: → Open",
        "op": "home",
        "values": {
          "user": "Ed"
        },
        "device": "LON-CL1",
        "console": "File Explorer",
        "sourceScene": "os1-lesson-7-scene-06",
        "menu": "This PC → Z: → Open"
      }
    ],
    "sources": [
      {
        "id": "os1-lesson-7-scene-01",
        "title": "تجهيز مجلد المشاركة",
        "video": "/assets/os1/os1-lesson-7/01.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-7/01.jpg",
        "seconds": 30.0,
        "steps": [
          "على LON-DC1 بحساب إدارة المختبر افتح File Explorer → C: وأنشئ مجلدًا باسم branch1-userdata.",
          "افتح Properties للمجلد → Sharing → Advanced Sharing، وفعّل Share this folder؛ اسم المشاركة branch1-userdata.",
          "افتح Permissions، وفعّل Allow: Full Control للمجموعة الافتراضية المعروضة في مثال الكتاب، ثم OK → OK → Close.",
          "تحقق أن المشاركة متاحة بالمسار \\\\LON-DC1\\branch1-userdata قبل ربط المجلد المنزلي بالحساب."
        ],
        "notes": [
          "المشاركة وNTFS طبقتان للأذونات؛ وجود مسار صحيح وحده لا يضمن إمكانية الوصول."
        ],
        "warnings": [
          "Full Control للمشاركة العامة هنا إعداد مثال المختبر؛ صلاحيات المشاركة وصلاحيات NTFS طبقتان مختلفتان، ولا تعمّم إتاحة بيانات المستخدمين على بيئة حقيقية."
        ]
      },
      {
        "id": "os1-lesson-7-scene-02",
        "title": "إنشاء حساب قالب معطل",
        "video": "/assets/os1/os1-lesson-7/02.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-7/02.jpg",
        "seconds": 87.0,
        "steps": [
          "في ADUC افتح Branch Office 1 → New → User.",
          "اكتب Full name: _Branch_template وUser logon name: _Branch_template، ثم Next.",
          "أدخل كلمة مرور المختبر وتأكيدها، وفعّل Account is disabled ثم Next → Finish.",
          "هذا حساب قالب ننسخ خصائصه لإنشاء المستخدمين؛ اتركه معطلًا ولا تستخدمه لتسجيل الدخول."
        ],
        "notes": [
          "القالب حساب ينسخ منه إعداد مشترك، وليس حسابًا يعمل به جميع المستخدمين."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-7-scene-03",
        "title": "خصائص القالب وعضوية المجموعات",
        "video": "/assets/os1/os1-lesson-7/03.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-7/03.jpg",
        "seconds": 114.0,
        "steps": [
          "افتح Properties لحساب _Branch_template → Address، وأدخل City حسب المطلوب؛ الكتاب يعرض Slough، والمدرس استخدم Jeddah في تطبيقه.",
          "افتح Member Of → Add، واكتب Branch 1 Users → Check Names → OK.",
          "اضغط Apply، وتأكد من ظهور عضوية Branch 1 Users قبل الانتقال إلى Profile.",
          "هذه خصائص مشتركة تُنسخ للمستخدم الجديد؛ لا تستخدم بيانات شخص فعلي في القالب."
        ],
        "notes": [
          "بعد النسخ راجع خصائص المستخدم الجديد؛ ليست كل خصائص الحساب قابلة للنسخ بالطريقة نفسها."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-7-scene-04",
        "title": "المجلد المنزلي في Profile",
        "video": "/assets/os1/os1-lesson-7/04.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-7/04.jpg",
        "seconds": 28.0,
        "steps": [
          "من خصائص القالب افتح Profile. تحت Home folder اختر Connect وحدد حرف Z: في هذا المثال.",
          "في To اكتب المسار التالي كاملًا؛ %username% متغير يستبدله النظام باسم دخول المستخدم عند النسخ:",
          "\\\\LON-DC1\\branch1-userdata\\%username%",
          "اضغط Apply → OK. تأكد من شرطتين عكسيتين في بداية مسار الشبكة ومن وجود المشاركة قبل المتابعة."
        ],
        "notes": [
          "مثال المصدر: \\\\LON-DC1\\branch1-userdata\\%username%. راجع اسم المشاركة وحرف القرص في بيئتك."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-7-scene-05",
        "title": "نسخ القالب إلى مستخدم جديد",
        "video": "/assets/os1/os1-lesson-7/05.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-7/05.jpg",
        "seconds": 82.0,
        "steps": [
          "اضغط باليمين على _Branch_template → Copy.",
          "اكتب First name: Ed، وLast name: Meadows، وUser logon name: Ed، ثم Next.",
          "أدخل كلمة مرور المستخدم وتأكيدها حسب المختبر، وأزل Account is disabled للحساب الجديد الذي سيجرب الدخول، ثم Next → Finish.",
          "افتح خصائص Ed: راجع City وMember Of، ثم Profile وتحقق أن %username% استُبدل باسم Ed في مسار Home folder.",
          "إذا كان Ed موجودًا من تجربة سابقة فابدأ من حالة المختبر المناسبة، ولا تحذف حسابًا قائمًا فقط لتجاوز التعارض دون معرفة دوره."
        ],
        "notes": [
          "يظل القالب معطلًا؛ أما الحساب الجديد فيُفعَّل إذا كانت المهمة تتطلب تسجيل الدخول."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-7-scene-06",
        "title": "التحقق من المجلد المنزلي بعد الدخول",
        "video": "/assets/os1/os1-lesson-7/06.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-7/06.jpg",
        "seconds": 9.0,
        "steps": [
          "على LON-CL1 المتصل بالمجال سجّل الدخول باسم Adatum\\Ed وكلمة مروره.",
          "افتح File Explorer → This PC، وابحث عن القرص Z: المرتبط بمجلد Ed على LON-DC1.",
          "افتح القرص وتأكد من عدم ظهور خطأ وصول. وجود حرف Z وحده دون فتحه ليس تحققًا كافيًا.",
          "عند الفشل راجع تشغيل DC1، ومسار المشاركة، وProfile للحساب، وصلاحيات المجلد والمشاركة، ثم أعد الدخول لاختبار التغيير."
        ],
        "notes": [
          "نهاية التسجيل تعرض القرص المنزلي. نجاح النسخ وحده لا يكفي لإثبات أن المشاركة قابلة للوصول."
        ],
        "warnings": []
      }
    ],
    "sceneCoverage": [
      {
        "scene": "os1-lesson-7-scene-01",
        "actions": [
          "share"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-7-scene-02",
        "actions": [
          "user-_Branch_template"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-7-scene-03",
        "actions": [
          "address",
          "member-_Branch_template-Branch 1 Users"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-7-scene-04",
        "actions": [
          "profile"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-7-scene-05",
        "actions": [
          "copy"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-7-scene-06",
        "actions": [
          "login-Ed-6",
          "home"
        ],
        "role": "procedure-or-context"
      }
    ]
  },
  {
    "id": "course-8",
    "lesson": 8,
    "scene": 1,
    "title": "Module 3 · Exercise 3 · إعادة ضبط حساب الجهاز",
    "subtitle": "Active Directory Users and Computers",
    "kind": "curriculum",
    "console": "Active Directory Users and Computers",
    "host": "LON-DC1",
    "why": "فهم علاقة الثقة وحساب الجهاز، ثم متابعة إعادة الانضمام إلى Domain (المجال) مع تمييز ما لم يثبت في نهاية التسجيل.",
    "question": "بعد Reset Account للجهاز، ما الذي يعالج علاقة الثقة في هذا التطبيق؟",
    "options": [
      "إعادة تعيين كلمة مرور المستخدم وحدها.",
      "إعادة الانضمام بحساب مخوّل ثم إعادة التشغيل والتحقق من دخول المجال.",
      "تغيير اسم المستخدم الظاهر في شاشة الدخول فقط."
    ],
    "answer": 1,
    "explain": "إعادة الانضمام بحساب مخوّل ثم إعادة التشغيل والتحقق من دخول المجال. نتيجة المحاكاة تخص هذه المحاولة، ولا تثبت تنفيذًا على Windows فعلي.",
    "hint": "راجع الجهاز والحساب والنتيجة الفعلية في لوحة الحالة. تعديل الإعداد يختلف عن فحص أثره.",
    "reveal": "افتح العملية من الأداة، ثم راجع خطوات المصدر والقيم المطلوبة. أدخلها بنفسك، طبّق الإعداد ثم افتح عملية التحقق المرتبطة.",
    "actions": [
      {
        "id": "login-Holly-0",
        "scene": 1,
        "title": "Windows Security — Sign in",
        "op": "login",
        "values": {
          "account": "Holly",
          "password": "Pa$$w0rd"
        },
        "device": "LON-DC1",
        "console": "Windows Security",
        "sourceScene": "os1-lesson-8-scene-01",
        "menu": "Windows Security — Sign in"
      },
      {
        "id": "reset",
        "scene": 2,
        "title": "Computer → Reset Account",
        "op": "reset-computer",
        "values": {
          "computer": "LON-CL1",
          "confirm": true
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "sourceScene": "os1-lesson-8-scene-02",
        "menu": "Computer → Reset Account"
      },
      {
        "id": "login-.\\Administrator-2",
        "scene": 2,
        "title": "Windows Security — Sign in",
        "op": "login",
        "values": {
          "account": ".\\Administrator",
          "password": "Pa$$w0rd"
        },
        "device": "LON-CL1",
        "console": "Windows Security",
        "sourceScene": "os1-lesson-8-scene-02",
        "menu": "Windows Security — Sign in"
      },
      {
        "id": "network-id",
        "scene": 3,
        "title": "System Properties → Network ID",
        "op": "rejoin",
        "values": {
          "computer": "LON-CL1",
          "business": true,
          "domainNetwork": true,
          "domain": "Adatum.com",
          "account": "Administrator",
          "password": "Pa$$w0rd",
          "reuse": true
        },
        "device": "LON-CL1",
        "console": "System Properties",
        "sourceScene": "os1-lesson-8-scene-03",
        "menu": "System Properties → Network ID"
      },
      {
        "id": "restart",
        "scene": 4,
        "title": "Restart Windows",
        "op": "restart-client",
        "values": {
          "computer": "LON-CL1"
        },
        "device": "LON-CL1",
        "console": "System Properties",
        "sourceScene": "os1-lesson-8-scene-04",
        "menu": "Restart Windows"
      },
      {
        "id": "login-Holly-5",
        "scene": 4,
        "title": "Windows Security — Sign in",
        "op": "login",
        "values": {
          "account": "Holly",
          "password": "Pa$$w0rd"
        },
        "device": "LON-CL1",
        "console": "Windows Security",
        "sourceScene": "os1-lesson-8-scene-04",
        "menu": "Windows Security — Sign in"
      },
      {
        "id": "trust",
        "scene": 4,
        "title": "System → Domain",
        "op": "view",
        "values": {},
        "device": "LON-CL1",
        "console": "System Properties",
        "entity": "computers",
        "key": "LON-CL1",
        "expected": {
          "trust": true,
          "domain": "Adatum.com"
        },
        "sourceScene": "os1-lesson-8-scene-04",
        "menu": "System → Domain"
      }
    ],
    "sources": [
      {
        "id": "os1-lesson-8-scene-01",
        "title": "قراءة مهمة حساب الجهاز وعلاقة الثقة",
        "video": "/assets/os1/os1-lesson-8/01.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-8/01.jpg",
        "seconds": 76.0,
        "steps": [
          "أكمل أولًا تفويض Branch Office 1 ونقل حساب LON-CL1 إليها؛ اختبار Holly يعتمد على صلاحيات الجزء السابق.",
          "على DC1 ادخل باسم Adatum\\Holly، وافتح Server Manager ببيانات Holly عند طلب UAC، ثم Tools → ADUC.",
          "افتح Branch Office 1 وحدد حساب LON-CL1؛ المقصود كائن الجهاز داخل AD وليس ملف الجهاز الافتراضي في Hyper-V.",
          "Reset Account يعيد ضبط حساب الجهاز وعلاقته بالمجال؛ لا يعيد تثبيت Windows ولا يمسح ملفات الجهاز."
        ],
        "notes": [
          "حساب الجهاز في Active Directory مختلف عن حساب المستخدم."
        ],
        "warnings": [
          "إعادة الضبط قد تقطع قناة الثقة الحالية؛ لا تطبقها على جهاز عمل دون تشخيص وخطة إعادة الاتصال."
        ]
      },
      {
        "id": "os1-lesson-8-scene-02",
        "title": "تعليمات إعادة ضبط حساب الجهاز",
        "video": "/assets/os1/os1-lesson-8/02.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-8/02.jpg",
        "seconds": 63.0,
        "steps": [
          "اضغط باليمين على حساب LON-CL1 → Reset Account، ثم وافق على رسالة التأكيد المطلوبة في المهمة.",
          "بعد إعادة الضبط يحتاج الجهاز إلى إعادة إنشاء ارتباط صحيح بالمجال؛ لا تعتبر رسالة Reset وحدها انتهاء الإصلاح.",
          "انتقل إلى جهاز LON-CL1، وافتح حساب الإدارة المسموح به في المختبر. إذا تعذر دخول المجال بسبب علاقة الثقة، يلزم حساب مسؤول محلي متاح مثل .\\Administrator بكلمته المحلية.",
          "عرض المدرس لا يثبت اختبار كل حالة لفشل الثقة؛ مسار الحساب المحلي توضيح لاستكمال التطبيق عند حدوث هذه الحالة."
        ],
        "notes": [
          "يعرض هذا المقطع تعليمات المهمة؛ لا يثبت تنفيذ Reset Account على الشاشة. لا يعادل هذا الإجراء إعادة تثبيت Windows."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-8-scene-03",
        "title": "متابعة معالج الانضمام من الجهاز",
        "video": "/assets/os1/os1-lesson-8/03.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-8/03.jpg",
        "seconds": 84.0,
        "steps": [
          "على LON-CL1 افتح This PC → Properties → Change settings، ثم Computer Name → Network ID.",
          "اختر This computer is part of a business network، ثم My company uses a network with a domain، وتابع Next.",
          "عند طلب حساب المجال أدخل Administrator وكلمة مرور المختبر وDomain: ADATUM، وتابع Next.",
          "راجع اسم الجهاز LON-CL1 والمجال Adatum.com، ووافق على استخدام حساب الجهاز القائم إذا سأل المعالج عنه.",
          "أكمل خيارات المعالج المطلوبة ثم Finish. لا تنشئ مجالًا جديدًا ولا تغيّر اسم الجهاز بدل إصلاح ارتباطه."
        ],
        "notes": [
          "واجهة المعالج في التسجيل من نسخة Windows القديمة المستخدمة في المختبر."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-8-scene-04",
        "title": "إنهاء المعالج وخطوة التحقق المتبقية",
        "video": "/assets/os1/os1-lesson-8/04.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-8/04.jpg",
        "seconds": 43.0,
        "steps": [
          "وافق على إعادة تشغيل LON-CL1 بعد إكمال المعالج، وانتظر عودته.",
          "خطوة تحقق للتطبيق: سجّل الدخول بحساب المجال، وافتح System وتأكد أن Domain هو Adatum.com.",
          "إذا استمر خطأ الثقة، توقف عن إعلان النجاح وراجع DNS والاتصال بـDC1 وحساب الجهاز ونتيجة إعادة الانضمام.",
          "المصدر يعرض المعالج وإعادة التشغيل، ولا يقدم اختبارًا مكتملًا لكل نتائج علاقة الثقة؛ نتيجة جهازك تُحكم من اختباره الفعلي."
        ],
        "notes": [
          "التسجيل ينتهي حول مرحلة إعادة التشغيل؛ لا يعرض دليلًا كافيًا على دخول جديد ناجح بعد اكتمالها."
        ],
        "warnings": []
      }
    ],
    "sceneCoverage": [
      {
        "scene": "os1-lesson-8-scene-01",
        "actions": [
          "login-Holly-0"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-8-scene-02",
        "actions": [
          "reset",
          "login-.\\Administrator-2"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-8-scene-03",
        "actions": [
          "network-id"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-8-scene-04",
        "actions": [
          "restart",
          "login-Holly-5",
          "trust"
        ],
        "role": "procedure-or-context"
      }
    ]
  },
  {
    "id": "course-9",
    "lesson": 9,
    "scene": 1,
    "title": "Module 3 · مراجعة عملية لإدارة AD والتفويض",
    "subtitle": "Active Directory Users and Computers",
    "kind": "curriculum",
    "console": "Active Directory Users and Computers",
    "host": "LON-DC1",
    "why": "تطبيق إضافي يراجع OU والنقل والمجموعات والتفويض واختبار حدود الصلاحيات؛ يحتفظ بدوره كمراجعة مستقلة.",
    "question": "Adel يدير المستخدمين داخل CTE1 لكنه يُرفض خارجها. ماذا تثبت النتيجة؟",
    "options": [
      "التفويض مقيد بالحاوية والمهام وأنواع الكائنات المحددة.",
      "Adel أصبح مسؤولًا عن كامل المجال.",
      "توجد مشكلة في كل حسابات CTE2."
    ],
    "answer": 0,
    "explain": "التفويض مقيد بالحاوية والمهام وأنواع الكائنات المحددة. نتيجة المحاكاة تخص هذه المحاولة، ولا تثبت تنفيذًا على Windows فعلي.",
    "hint": "راجع الجهاز والحساب والنتيجة الفعلية في لوحة الحالة. تعديل الإعداد يختلف عن فحص أثره.",
    "reveal": "افتح العملية من الأداة، ثم راجع خطوات المصدر والقيم المطلوبة. أدخلها بنفسك، طبّق الإعداد ثم افتح عملية التحقق المرتبطة.",
    "actions": [
      {
        "id": "ou-CTE1",
        "scene": 1,
        "title": "New Object — Organizational Unit · CTE1",
        "op": "put",
        "values": {
          "name": "CTE1",
          "parent": "Adatum.com",
          "protected": true
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "entity": "ous",
        "key": "CTE1",
        "sourceScene": "os1-lesson-9-scene-01",
        "menu": "New Object — Organizational Unit · CTE1"
      },
      {
        "id": "ou-CTE2",
        "scene": 1,
        "title": "New Object — Organizational Unit · CTE2",
        "op": "put",
        "values": {
          "name": "CTE2",
          "parent": "Adatum.com",
          "protected": true
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "entity": "ous",
        "key": "CTE2",
        "sourceScene": "os1-lesson-9-scene-01",
        "menu": "New Object — Organizational Unit · CTE2"
      },
      {
        "id": "advanced",
        "scene": 1,
        "title": "View → Advanced Features",
        "op": "put",
        "values": {
          "advanced": true
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "entity": "settings",
        "key": "ADUC",
        "sourceScene": "os1-lesson-9-scene-01",
        "menu": "View → Advanced Features"
      },
      {
        "id": "user-Adel",
        "scene": 2,
        "title": "New Object — User · Adel",
        "op": "put",
        "values": {
          "name": "Adel",
          "ou": "CTE1",
          "password": "Pa$$w0rd",
          "confirm": "Pa$$w0rd",
          "enabled": true,
          "mustChange": false,
          "cannotChange": false,
          "neverExpires": false
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "entity": "users",
        "key": "Adel",
        "sourceScene": "os1-lesson-9-scene-02",
        "menu": "New Object — User · Adel"
      },
      {
        "id": "pc1",
        "scene": 2,
        "title": "New Object — Computer",
        "op": "put",
        "values": {
          "name": "PC1",
          "ou": "CTE1"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "entity": "computers",
        "key": "PC1",
        "sourceScene": "os1-lesson-9-scene-02",
        "menu": "New Object — Computer"
      },
      {
        "id": "group-Group1",
        "scene": 2,
        "title": "New Object — Group · Group1",
        "op": "put",
        "values": {
          "name": "Group1",
          "ou": "CTE1",
          "scope": "Global",
          "type": "Security"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "entity": "groups",
        "key": "Group1",
        "sourceScene": "os1-lesson-9-scene-02",
        "menu": "New Object — Group · Group1"
      },
      {
        "id": "member-Adel-Group1",
        "scene": 2,
        "title": "Properties → Members → Add",
        "op": "member",
        "values": {
          "member": "Adel",
          "group": "Group1"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "sourceScene": "os1-lesson-9-scene-02",
        "menu": "Properties → Members → Add"
      },
      {
        "id": "move",
        "scene": 3,
        "title": "Move PC1",
        "op": "put",
        "values": {
          "ou": "CTE2"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "entity": "computers",
        "key": "PC1",
        "update": true,
        "sourceScene": "os1-lesson-9-scene-03",
        "menu": "Move PC1"
      },
      {
        "id": "moved",
        "scene": 3,
        "title": "Refresh CTE2",
        "op": "view",
        "values": {},
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "entity": "computers",
        "key": "PC1",
        "expected": {
          "ou": "CTE2"
        },
        "sourceScene": "os1-lesson-9-scene-03",
        "menu": "Refresh CTE2"
      },
      {
        "id": "adel",
        "scene": 4,
        "title": "Delegation of Control Wizard",
        "op": "put",
        "values": {
          "principal": "Adel",
          "ou": "CTE1",
          "objects": "Users / Groups",
          "tasks": [
            "manage-users",
            "manage-groups"
          ]
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "entity": "delegations",
        "key": "adel",
        "sourceScene": "os1-lesson-9-scene-04",
        "menu": "Delegation of Control Wizard"
      },
      {
        "id": "member-Adel-Server Operators",
        "scene": 4,
        "title": "Properties → Members → Add",
        "op": "member",
        "values": {
          "member": "Adel",
          "group": "Server Operators"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "sourceScene": "os1-lesson-9-scene-04",
        "menu": "Properties → Members → Add"
      },
      {
        "id": "login-Adel-11",
        "scene": 4,
        "title": "Windows Security — Sign in",
        "op": "login",
        "values": {
          "account": "Adel",
          "password": "Pa$$w0rd"
        },
        "device": "LON-DC1",
        "console": "Windows Security",
        "sourceScene": "os1-lesson-9-scene-04",
        "menu": "Windows Security — Sign in"
      },
      {
        "id": "adel-Usercreate",
        "scene": 5,
        "title": "ADUC — create User",
        "op": "permission",
        "values": {
          "ou": "CTE1",
          "kind": "User",
          "operation": "create"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "actor": "Adel",
        "expectedAllowed": true,
        "sourceScene": "os1-lesson-9-scene-05",
        "menu": "ADUC — create User"
      },
      {
        "id": "adel-Userdelete",
        "scene": 5,
        "title": "ADUC — delete User",
        "op": "permission",
        "values": {
          "ou": "CTE1",
          "kind": "User",
          "operation": "delete"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "actor": "Adel",
        "expectedAllowed": true,
        "sourceScene": "os1-lesson-9-scene-05",
        "menu": "ADUC — delete User"
      },
      {
        "id": "adel-Groupcreate",
        "scene": 5,
        "title": "ADUC — create Group",
        "op": "permission",
        "values": {
          "ou": "CTE1",
          "kind": "Group",
          "operation": "create"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "actor": "Adel",
        "expectedAllowed": true,
        "sourceScene": "os1-lesson-9-scene-05",
        "menu": "ADUC — create Group"
      },
      {
        "id": "adel-Groupdelete",
        "scene": 5,
        "title": "ADUC — delete Group",
        "op": "permission",
        "values": {
          "ou": "CTE1",
          "kind": "Group",
          "operation": "delete"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "actor": "Adel",
        "expectedAllowed": true,
        "sourceScene": "os1-lesson-9-scene-05",
        "menu": "ADUC — delete Group"
      },
      {
        "id": "adel-OUcreate",
        "scene": 5,
        "title": "ADUC — create OU",
        "op": "permission",
        "values": {
          "ou": "CTE1",
          "kind": "OU",
          "operation": "create"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "actor": "Adel",
        "expectedAllowed": false,
        "sourceScene": "os1-lesson-9-scene-05",
        "menu": "ADUC — create OU"
      },
      {
        "id": "adel-Computercreate",
        "scene": 5,
        "title": "ADUC — create Computer",
        "op": "permission",
        "values": {
          "ou": "CTE1",
          "kind": "Computer",
          "operation": "create"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "actor": "Adel",
        "expectedAllowed": false,
        "sourceScene": "os1-lesson-9-scene-05",
        "menu": "ADUC — create Computer"
      },
      {
        "id": "adel-outside",
        "scene": 5,
        "title": "ADUC — create User",
        "op": "permission",
        "values": {
          "ou": "CTE2",
          "kind": "User",
          "operation": "create"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "actor": "Adel",
        "expectedAllowed": false,
        "sourceScene": "os1-lesson-9-scene-05",
        "menu": "ADUC — create User"
      },
      {
        "id": "login-Administrator-19",
        "scene": 6,
        "title": "Windows Security — Sign in",
        "op": "login",
        "values": {
          "account": "Administrator",
          "password": "Pa$$w0rd"
        },
        "device": "LON-DC1",
        "console": "Windows Security",
        "sourceScene": "os1-lesson-9-scene-06",
        "menu": "Windows Security — Sign in"
      },
      {
        "id": "ed",
        "scene": 6,
        "title": "Delegation of Control Wizard",
        "op": "put",
        "values": {
          "principal": "Ed",
          "ou": "Marketing",
          "objects": "All",
          "tasks": [
            "full-control"
          ]
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "entity": "delegations",
        "key": "ed",
        "sourceScene": "os1-lesson-9-scene-06",
        "menu": "Delegation of Control Wizard"
      },
      {
        "id": "member-Ed-Server Operators",
        "scene": 6,
        "title": "Properties → Members → Add",
        "op": "member",
        "values": {
          "member": "Ed",
          "group": "Server Operators"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "sourceScene": "os1-lesson-9-scene-06",
        "menu": "Properties → Members → Add"
      },
      {
        "id": "login-Ed-22",
        "scene": 6,
        "title": "Windows Security — Sign in",
        "op": "login",
        "values": {
          "account": "Ed",
          "password": "Pa$$w0rd"
        },
        "device": "LON-DC1",
        "console": "Windows Security",
        "sourceScene": "os1-lesson-9-scene-06",
        "menu": "Windows Security — Sign in"
      },
      {
        "id": "ed-ou-create",
        "scene": 7,
        "title": "ADUC — create OU",
        "op": "permission",
        "values": {
          "ou": "Marketing",
          "kind": "OU",
          "operation": "create"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "actor": "Ed",
        "expectedAllowed": true,
        "sourceScene": "os1-lesson-9-scene-07",
        "menu": "ADUC — create OU"
      },
      {
        "id": "ed-ou-delete",
        "scene": 7,
        "title": "ADUC — delete OU",
        "op": "permission",
        "values": {
          "ou": "Marketing",
          "kind": "OU",
          "operation": "delete"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "actor": "Ed",
        "expectedAllowed": true,
        "sourceScene": "os1-lesson-9-scene-07",
        "menu": "ADUC — delete OU"
      },
      {
        "id": "ed-outside",
        "scene": 7,
        "title": "ADUC — modify Group",
        "op": "permission",
        "values": {
          "ou": "CTE1",
          "kind": "Group",
          "operation": "modify"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "actor": "Ed",
        "expectedAllowed": false,
        "sourceScene": "os1-lesson-9-scene-07",
        "menu": "ADUC — modify Group"
      }
    ],
    "sources": [
      {
        "id": "os1-lesson-9-scene-01",
        "title": "حماية OU والحذف المقصود في المختبر",
        "video": "/assets/os1/os1-lesson-9/01.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-9/01.jpg",
        "seconds": 89.0,
        "steps": [
          "على LON-DC1 افتح ADUC، وأنشئ OU تجريبية باسم CTE1 وأخرى CTE2 حسب سيناريو المراجعة.",
          "إذا رُفض حذف OU المحمية، افتح View → Advanced Features، ثم Properties لـOU → Object.",
          "أزل Protect object from accidental deletion عن OU التجريبية المطلوب حذفها فقط → Apply → OK.",
          "نفّذ Delete بعد مراجعة اسمها، ثم أعد إنشاء الحاوية إذا كانت مطلوبة لبقية التدريب."
        ],
        "notes": [
          "إظهار الخيارات المتقدمة يتيح رؤية خصائص إضافية، ولا يمنح صلاحيات جديدة."
        ],
        "warnings": [
          "إزالة الحماية هنا تجربة مختبر؛ تحقق من الاسم والمحتويات ولا تعطلها روتينيًا."
        ]
      },
      {
        "id": "os1-lesson-9-scene-02",
        "title": "إنشاء الكائنات وتنظيمها",
        "video": "/assets/os1/os1-lesson-9/02.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-9/02.jpg",
        "seconds": 108.0,
        "steps": [
          "داخل CTE1 أنشئ User باسم Adel مع اسم دخول وكلمة مرور، واترك الحساب مفعّلًا للاختبار.",
          "أنشئ Computer باسم PC1، ثم Group باسم Group1 بنوع Global وSecurity.",
          "أضف Adel إلى Group1 عبر خصائص المستخدم → Member Of → Add → Check Names، أو خصائص المجموعة → Members.",
          "تأكد أن الكائنات داخل الحاوية المقصودة؛ حساب Computer لا يعني إنشاء جهاز افتراضي فعلي."
        ],
        "notes": [
          "تستخدم المراجعة أسماء CTE1 وCTE2 وأمثلة أخرى مختلفة عن تسجيل التمرين الأول."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-9-scene-03",
        "title": "نقل الكائن إلى حاوية أخرى",
        "video": "/assets/os1/os1-lesson-9/03.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-9/03.jpg",
        "seconds": 59.0,
        "steps": [
          "اختر الكائن المطلوب → زر يمين → Move، وحدد OU الوجهة → OK.",
          "افتح الوجهة وتأكد من وصوله، ثم راجع Member Of للمستخدم إن كان الهدف عضوية مجموعة.",
          "نقل المستخدم إلى CTE1 لا يساوي منحه إدارة CTE1؛ التفويض يتم في الخطوة التالية."
        ],
        "notes": [
          "النقل لا يعني أن الكائن أصبح عضوًا في مجموعة تحمل اسم الحاوية."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-9-scene-04",
        "title": "صياغة تفويض محدد",
        "video": "/assets/os1/os1-lesson-9/04.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-9/04.jpg",
        "seconds": 123.0,
        "steps": [
          "على CTE1 اختر Delegate Control → Next → Add، وحدد Adel وتحقق من الاسم.",
          "اختر المهام الشائعة الخاصة بإنشاء وحذف وإدارة حسابات المستخدمين والمجموعات، ثم Next → Finish.",
          "بحساب Administrator أضف Adel إلى Server Operators لغرض دخوله إلى DC1 في هذا المختبر، ثم سجّل الخروج.",
          "ادخل باسم Adatum\\Adel، وشغّل أدوات الإدارة ببيانات Adel عند ظهور UAC؛ هذا يحافظ على صلاحية الاختبار."
        ],
        "notes": [
          "هذه الأجزاء الثلاثة تمنع الخلط بين مكان التطبيق ومن ينفذ وما يجوز له تنفيذه."
        ],
        "warnings": [
          "Server Operators ليست شرطًا عامًا لتفويض OU؛ استخدامها هنا مرتبط بتجربة تسجيل الدخول على DC1."
        ]
      },
      {
        "id": "os1-lesson-9-scene-05",
        "title": "اختبار الإنشاء والحذف بحساب المفوَّض",
        "video": "/assets/os1/os1-lesson-9/05.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-9/05.jpg",
        "seconds": 92.0,
        "steps": [
          "بحساب Adel أنشئ ثم احذف مستخدمًا تجريبيًا ومجموعة داخل CTE1، وراجع نجاح العمليتين.",
          "جرّب إنشاء أو حذف نوع لم يُفوّض مثل OU أو Computer؛ قارن رسالة الرفض بالصلاحيات التي اخترتها.",
          "جرّب العملية خارج CTE1 داخل CTE2؛ لا تتوقع امتداد التفويض إليها.",
          "راجع نوع الكائن ومكانه والحساب المستخدم قبل تفسير النجاح أو الفشل."
        ],
        "notes": [
          "اختبار التفويض يعتمد على هوية المنفذ ونوع الكائن والحاوية، لا على ظهور القائمة فقط."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-9-scene-06",
        "title": "تفويض مخصص ثم مراجعة حدوده",
        "video": "/assets/os1/os1-lesson-9/06.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-9/06.jpg",
        "seconds": 126.0,
        "steps": [
          "السيناريو الثاني يستخدم Ed Meadows، واسم دخوله Ed، لتفويض مختلف على OU اسمها Marketing.",
          "بحساب Administrator افتح Delegate Control على Marketing، وحدد Ed ثم Create a custom task to delegate.",
          "اختر This folder, existing objects in this folder, and creation of new objects in this folder، ثم Full Control → Next → Finish.",
          "جهّز صلاحية دخول Ed إلى DC1 كما في سيناريو المختبر، ثم سجّل الخروج وادخل بحساب Ed واستخدم بياناته في UAC.",
          "راجع الفرق: هذا التفويض أوسع داخل Marketing من تفويض المستخدمين والمجموعات فقط داخل CTE1."
        ],
        "notes": [
          "لا تُعمّم الصلاحية الممنوحة لحاوية على بقية Domain (المجال)."
        ],
        "warnings": [
          "تجنب اعتماد إضافة Server Operators في المراجعة كإجراء عام؛ للمجموعة صلاحيات أوسع من هذه المهمة."
        ]
      },
      {
        "id": "os1-lesson-9-scene-07",
        "title": "مراجعة نتيجة الاختبار",
        "video": "/assets/os1/os1-lesson-9/07.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-9/07.jpg",
        "seconds": 87.0,
        "steps": [
          "بحساب Ed جرّب إنشاء OU تجريبية داخل Marketing ثم حذفها؛ راعِ حماية الحذف عند الحاجة.",
          "قارن ذلك بمحاولة تعديل Group1 داخل CTE1 التي ليست ضمن هذا التفويض.",
          "دوّن لكل اختبار: الحساب، والحاوية، ونوع الكائن، والعملية، والنتيجة. لا تختبر ببيانات Administrator بدل الحساب المفوّض.",
          "وجود حساب Ed نفسه في حاوية أخرى لا يمنع تفويضه على Marketing؛ العضوية ومكان الكائن وحدود الصلاحية أشياء مختلفة."
        ],
        "notes": [
          "حفظ الإعداد ليس دليلًا على صحته حتى تُختبر العملية بهوية المستخدم المقصود."
        ],
        "warnings": []
      }
    ],
    "sceneCoverage": [
      {
        "scene": "os1-lesson-9-scene-01",
        "actions": [
          "ou-CTE1",
          "ou-CTE2",
          "advanced"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-9-scene-02",
        "actions": [
          "user-Adel",
          "pc1",
          "group-Group1",
          "member-Adel-Group1"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-9-scene-03",
        "actions": [
          "move",
          "moved"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-9-scene-04",
        "actions": [
          "adel",
          "member-Adel-Server Operators",
          "login-Adel-11"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-9-scene-05",
        "actions": [
          "adel-Usercreate",
          "adel-Userdelete",
          "adel-Groupcreate",
          "adel-Groupdelete",
          "adel-OUcreate",
          "adel-Computercreate",
          "adel-outside"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-9-scene-06",
        "actions": [
          "login-Administrator-19",
          "ed",
          "member-Ed-Server Operators",
          "login-Ed-22"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-9-scene-07",
        "actions": [
          "ed-ou-create",
          "ed-ou-delete",
          "ed-outside"
        ],
        "role": "procedure-or-context"
      }
    ]
  },
  {
    "id": "course-10",
    "lesson": 10,
    "scene": 1,
    "title": "Module 4 · إدارة Active Directory باستخدام PowerShell",
    "subtitle": "Windows PowerShell",
    "kind": "curriculum",
    "console": "Windows PowerShell",
    "host": "LON-DC1",
    "why": "إنشاء OU ومستخدم ومجموعة بالأوامر، وضبط كلمة المرور وتفعيل الحساب، ثم التحقق من عضوية المجموعة.",
    "question": "أنشأت Ty بـNew-ADUser ثم تعذر دخوله. ما الذي تراجعه في مسار الدرس؟",
    "options": [
      "إنشاء مجموعة ثانية بالاسم نفسه.",
      "إعادة تسمية OU دون فحص حالة المستخدم.",
      "تعيين كلمة مرور صالحة وتفعيل الحساب قبل اختبار الدخول."
    ],
    "answer": 2,
    "explain": "تعيين كلمة مرور صالحة وتفعيل الحساب قبل اختبار الدخول. نتيجة المحاكاة تخص هذه المحاولة، ولا تثبت تنفيذًا على Windows فعلي.",
    "hint": "راجع الجهاز والحساب والنتيجة الفعلية في لوحة الحالة. تعديل الإعداد يختلف عن فحص أثره.",
    "reveal": "افتح العملية من الأداة، ثم راجع خطوات المصدر والقيم المطلوبة. أدخلها بنفسك، طبّق الإعداد ثم افتح عملية التحقق المرتبطة.",
    "actions": [
      {
        "id": "module",
        "scene": 1,
        "title": "Import module",
        "op": "powershell",
        "values": {
          "command": "Import-Module ActiveDirectory"
        },
        "device": "LON-DC1",
        "console": "Windows PowerShell",
        "requires": [],
        "sourceScene": "os1-lesson-10-scene-01",
        "menu": "Import module"
      },
      {
        "id": "ou",
        "scene": 2,
        "title": "Create OU",
        "op": "powershell",
        "values": {
          "command": "New-ADOrganizationalUnit -Name LondonBranch"
        },
        "device": "LON-DC1",
        "console": "Windows PowerShell",
        "requires": [
          "module"
        ],
        "sourceScene": "os1-lesson-10-scene-02",
        "menu": "Create OU"
      },
      {
        "id": "user",
        "scene": 3,
        "title": "Create user",
        "op": "powershell",
        "values": {
          "command": "New-ADUser -Name Ty -DisplayName \"Ty Carlson\" -GivenName Ty -Surname Carlson -Path \"OU=LondonBranch,DC=Adatum,DC=com\""
        },
        "device": "LON-DC1",
        "console": "Windows PowerShell",
        "requires": [
          "module"
        ],
        "sourceScene": "os1-lesson-10-scene-03",
        "menu": "Create user"
      },
      {
        "id": "password",
        "scene": 4,
        "title": "Set account password",
        "op": "powershell",
        "values": {
          "command": "Set-ADAccountPassword Ty"
        },
        "device": "LON-DC1",
        "console": "Windows PowerShell",
        "requires": [
          "module"
        ],
        "sourceScene": "os1-lesson-10-scene-04",
        "menu": "Set account password"
      },
      {
        "id": "enable",
        "scene": 4,
        "title": "Enable account",
        "op": "powershell",
        "values": {
          "command": "Enable-ADAccount Ty"
        },
        "device": "LON-DC1",
        "console": "Windows PowerShell",
        "requires": [
          "module"
        ],
        "sourceScene": "os1-lesson-10-scene-04",
        "menu": "Enable account"
      },
      {
        "id": "login-Ty-8",
        "scene": 5,
        "title": "Windows Security — Sign in",
        "op": "login",
        "values": {
          "account": "Ty",
          "password": "Pa$$w0rd"
        },
        "device": "LON-CL1",
        "console": "Windows Security",
        "sourceScene": "os1-lesson-10-scene-05",
        "menu": "Windows Security — Sign in"
      },
      {
        "id": "group",
        "scene": 6,
        "title": "Create group",
        "op": "powershell",
        "values": {
          "command": "New-ADGroup -Name LondonBranchUsers -Path \"OU=LondonBranch,DC=Adatum,DC=com\" -GroupScope Global -GroupCategory Security"
        },
        "device": "LON-DC1",
        "console": "Windows PowerShell",
        "requires": [
          "module"
        ],
        "sourceScene": "os1-lesson-10-scene-06",
        "menu": "Create group"
      },
      {
        "id": "member",
        "scene": 6,
        "title": "Add group member",
        "op": "powershell",
        "values": {
          "command": "Add-ADGroupMember -Identity LondonBranchUsers -Members Ty"
        },
        "device": "LON-DC1",
        "console": "Windows PowerShell",
        "requires": [
          "module"
        ],
        "sourceScene": "os1-lesson-10-scene-06",
        "menu": "Add group member"
      },
      {
        "id": "read",
        "scene": 7,
        "title": "Get group member",
        "op": "powershell",
        "values": {
          "command": "Get-ADGroupMember -Identity LondonBranchUsers"
        },
        "device": "LON-DC1",
        "console": "Windows PowerShell",
        "requires": [
          "module"
        ],
        "sourceScene": "os1-lesson-10-scene-07",
        "menu": "Get group member"
      }
    ],
    "sources": [
      {
        "id": "os1-lesson-10-scene-01",
        "title": "التعرف على أوامر AD",
        "video": "/assets/os1/os1-lesson-10/01.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-10/01.jpg",
        "seconds": 69.0,
        "steps": [
          "شغّل DC1 وافتح Windows PowerShell عليه بحساب إدارة المختبر. هذا التمرين يستخدم وحدة ActiveDirectory.",
          "New ينشئ كائنًا، وSet يعدّل خاصية، وEnable يفعّل الحساب، وAdd يضيف عضوًا، وGet يقرأ النتيجة.",
          "نفّذ الأوامر التالية سطرًا سطرًا داخل PowerShell على DC1، وليس في Command Prompt أو على جهازك الشخصي.",
          "إذا لم يُعرف الأمر فتحقق من وجود أدوات Active Directory ووحدتها، ثم نفّذ Import-Module ActiveDirectory؛ هذا توضيح مساعد عند الحاجة."
        ],
        "notes": [
          "يلزم توفر وحدة ActiveDirectory وأدوات الإدارة المناسبة في البيئة."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-10-scene-02",
        "title": "إنشاء OU والتحقق من النتيجة",
        "video": "/assets/os1/os1-lesson-10/02.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-10/02.jpg",
        "seconds": 61.0,
        "steps": [
          "أنشئ الوحدة التنظيمية بالأمر الظاهر في المختبر:",
          "New-ADOrganizationalUnit -Name LondonBranch",
          "افتح ADUC تحت Adatum.com ثم Refresh، وتأكد من ظهور LondonBranch.",
          "إذا كانت موجودة من محاولة سابقة فلا تكرر الإنشاء ولا تحذفها عشوائيًا؛ راجع محتواها واستخدم حالة المختبر المطلوبة."
        ],
        "notes": [
          "تظهر في التسجيل أخطاء صلاحية ثم اسم موجود؛ ليست كل ضغطة Enter إنشاءً ناجحًا."
        ],
        "warnings": [
          "لا تعاود إنشاء الكائن عشوائيًا عند الخطأ؛ تحقق من الهوية والمسار والوجود أولًا."
        ]
      },
      {
        "id": "os1-lesson-10-scene-03",
        "title": "إنشاء المستخدم ومراجعة خصائصه",
        "video": "/assets/os1/os1-lesson-10/03.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-10/03.jpg",
        "seconds": 123.0,
        "steps": [
          "أنشئ المستخدم داخل LondonBranch بالأمر الكامل التالي:",
          "New-ADUser -Name Ty -DisplayName \"Ty Carlson\" -GivenName Ty -Surname Carlson -Path \"OU=LondonBranch,DC=Adatum,DC=com\"",
          "Name هو اسم الكائن، وDisplayName اسم العرض، وGivenName الاسم الأول، وSurname اسم العائلة، وPath يحدد مكان إنشائه داخل المجال.",
          "في ADUC حدّث LondonBranch وافتح المستخدم Ty للتأكد من الاسم والموقع. لم نضع له كلمة مرور أو نفعّله بعد."
        ],
        "notes": [
          "الاسم المميز Distinguished Name يصف مسار الكائن مثل OU وDC؛ استخدم قيم بيئة المختبر."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-10-scene-04",
        "title": "كلمة المرور وتفعيل الحساب",
        "video": "/assets/os1/os1-lesson-10/04.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-10/04.jpg",
        "seconds": 33.0,
        "steps": [
          "اضبط كلمة المرور بطريقة المختبر التفاعلية:",
          "Set-ADAccountPassword Ty",
          "عند طلب كلمة المرور الحالية لهذا الحساب الجديد اضغط Enter دون كتابة؛ ثم أدخل كلمة المرور المطلوبة وأعدها في Repeat Password. كتاب المختبر يستخدم Pa$$w0rd.",
          "فعّل الحساب بعد نجاح تعيين كلمة المرور:",
          "Enable-ADAccount Ty",
          "إذا رفضت سياسة المجال كلمة المرور فصححها قبل التفعيل. إنشاء المستخدم وحده لا يجعله جاهزًا للدخول."
        ],
        "notes": [
          "هذا الجزء مثال فيديو يعرضه المدرس داخل تسجيله، ويكمل خطوة التفعيل."
        ],
        "warnings": [
          "لا تضع كلمة مرور حقيقية كنص ظاهر في أمر أو ملف أو ملاحظة."
        ]
      },
      {
        "id": "os1-lesson-10-scene-05",
        "title": "التحقق من تسجيل الدخول",
        "video": "/assets/os1/os1-lesson-10/05.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-10/05.jpg",
        "seconds": 39.0,
        "steps": [
          "على LON-CL1 المتصل بـAdatum.com سجّل الخروج من الحساب الحالي.",
          "ادخل باسم Adatum\\Ty وكلمة المرور التي ضبطتها، وانتظر تحميل سطح المكتب.",
          "عند الفشل راجع كلمة المرور وحالة Enabled وDNS واتصال العميل بـDC1. نجاح New-ADUser وحده ليس اختبار دخول."
        ],
        "notes": [
          "نجاح الدخول في المثال يختبر الحساب؛ لا يثبت أن كل أوامر جلسة أخرى نُفذت بالنتيجة نفسها."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-10-scene-06",
        "title": "إنشاء المجموعة وإضافة العضو",
        "video": "/assets/os1/os1-lesson-10/06.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-10/06.jpg",
        "seconds": 68.0,
        "steps": [
          "ارجع إلى PowerShell على DC1 وأنشئ مجموعة Global من نوع Security داخل LondonBranch:",
          "New-ADGroup -Name LondonBranchUsers -Path \"OU=LondonBranch,DC=Adatum,DC=com\" -GroupScope Global -GroupCategory Security",
          "أضف Ty عضوًا في المجموعة:",
          "Add-ADGroupMember -Identity LondonBranchUsers -Members Ty",
          "راجع كتابة الأسماء؛ المجموعة المنشأة حديثًا لا تحتوي Ty تلقائيًا."
        ],
        "notes": [
          "المثال يحدد Global وSecurity؛ اختيار النوع قرار منفصل عن إضافة العضو."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-10-scene-07",
        "title": "قراءة أعضاء المجموعة",
        "video": "/assets/os1/os1-lesson-10/07.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-10/07.jpg",
        "seconds": 66.0,
        "steps": [
          "اقرأ أعضاء المجموعة بالأمر:",
          "Get-ADGroupMember -Identity LondonBranchUsers",
          "تحقق أن Name أو SamAccountName يعرض Ty، وأن DistinguishedName يشير إلى LondonBranch داخل Adatum.com.",
          "يمكن التأكد أيضًا من ADUC → LondonBranchUsers → Properties → Members. أمر Get يقرأ ولا يضيف عضوًا."
        ],
        "notes": [
          "الناتج يعرض خصائص العضو مثل الاسم ومعرف SID؛ لا تستبدل اختبار العضوية بافتراض نجاح أمر الإضافة."
        ],
        "warnings": []
      }
    ],
    "sceneCoverage": [
      {
        "scene": "os1-lesson-10-scene-01",
        "actions": [
          "module"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-10-scene-02",
        "actions": [
          "ou"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-10-scene-03",
        "actions": [
          "user"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-10-scene-04",
        "actions": [
          "password",
          "enable"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-10-scene-05",
        "actions": [
          "login-Ty-8"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-10-scene-06",
        "actions": [
          "group",
          "member"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-10-scene-07",
        "actions": [
          "read"
        ],
        "role": "procedure-or-context"
      }
    ]
  },
  {
    "id": "course-11",
    "lesson": 11,
    "scene": 1,
    "title": "Module 6 · Exercise 1 · تثبيت DHCP وإدارة العناوين",
    "subtitle": "DHCP",
    "kind": "curriculum",
    "console": "DHCP",
    "host": "LON-SVR1",
    "why": "تثبيت خدمة توزيع العناوين، إعداد Scope والاستثناءات والخيارات، ثم فحص العميل والحجوزات.",
    "question": "حجزت عنوانًا لعميل DHCP. ما الذي يربط الحجز بالعميل في هذا المختبر؟",
    "options": [
      "رقم المنفذ الذي تظهر فيه نافذة DHCP.",
      "عنوان MAC الصحيح للعميل، ثم تجديد الإيجار وفحص نتيجته.",
      "اسم المستخدم الذي سجّل الدخول إلى السيرفر."
    ],
    "answer": 1,
    "explain": "عنوان MAC الصحيح للعميل، ثم تجديد الإيجار وفحص نتيجته. نتيجة المحاكاة تخص هذه المحاولة، ولا تثبت تنفيذًا على Windows فعلي.",
    "hint": "راجع الجهاز والحساب والنتيجة الفعلية في لوحة الحالة. تعديل الإعداد يختلف عن فحص أثره.",
    "reveal": "افتح العملية من الأداة، ثم راجع خطوات المصدر والقيم المطلوبة. أدخلها بنفسك، طبّق الإعداد ثم افتح عملية التحقق المرتبطة.",
    "actions": [
      {
        "id": "static",
        "scene": 1,
        "title": "Local Server → Ethernet → IPv4",
        "op": "put",
        "values": {
          "ip": "172.16.0.11",
          "mask": "255.255.0.0",
          "dns": "172.16.0.10",
          "auto": false
        },
        "device": "LON-SVR1",
        "console": "Network Connections",
        "entity": "interfaces",
        "key": "LON-SVR1",
        "sourceScene": "os1-lesson-11-scene-01",
        "menu": "Local Server → Ethernet → IPv4"
      },
      {
        "id": "role",
        "scene": 1,
        "title": "Add Roles and Features → DHCP Server",
        "op": "put",
        "values": {
          "server": "LON-SVR1",
          "installed": true,
          "features": true
        },
        "device": "LON-SVR1",
        "console": "Server Manager",
        "entity": "roles",
        "key": "DHCP",
        "requires": [
          "static"
        ],
        "sourceScene": "os1-lesson-11-scene-01",
        "menu": "Add Roles and Features → DHCP Server"
      },
      {
        "id": "authorize",
        "scene": 2,
        "title": "Complete DHCP configuration → Authorize",
        "op": "put",
        "values": {
          "authorized": true,
          "account": "Administrator",
          "password": "Pa$$w0rd"
        },
        "device": "LON-SVR1",
        "console": "DHCP",
        "entity": "dhcp",
        "key": "server",
        "requires": [
          "role"
        ],
        "sourceScene": "os1-lesson-11-scene-02",
        "menu": "Complete DHCP configuration → Authorize"
      },
      {
        "id": "scope-BO",
        "scene": 3,
        "title": "New Scope Wizard",
        "op": "put",
        "values": {
          "name": "BO",
          "start": "172.16.0.100",
          "end": "172.16.0.200",
          "mask": "255.255.0.0",
          "exclusions": "190-200,101",
          "leaseDays": 2,
          "gateway": "172.16.0.1",
          "dns": "172.16.0.10",
          "domain": "Adatum.com",
          "wins": "",
          "active": true
        },
        "device": "LON-SVR1",
        "console": "DHCP",
        "entity": "scopes",
        "key": "BO",
        "scenes": [
          3,
          4,
          5
        ],
        "sourceScene": "os1-lesson-11-scene-03",
        "menu": "New Scope Wizard"
      },
      {
        "id": "auto-LON-CORE",
        "scene": 6,
        "title": "Ethernet → IPv4 Properties",
        "op": "put",
        "values": {
          "auto": true,
          "autoDNS": true
        },
        "device": "LON-CORE",
        "console": "Network Connections",
        "entity": "interfaces",
        "key": "LON-CORE",
        "sourceScene": "os1-lesson-11-scene-06",
        "menu": "Ethernet → IPv4 Properties"
      },
      {
        "id": "auto-LON-CL1",
        "scene": 6,
        "title": "Ethernet → IPv4 Properties",
        "op": "put",
        "values": {
          "auto": true,
          "autoDNS": true
        },
        "device": "LON-CL1",
        "console": "Network Connections",
        "entity": "interfaces",
        "key": "LON-CL1",
        "sourceScene": "os1-lesson-11-scene-06",
        "menu": "Ethernet → IPv4 Properties"
      },
      {
        "id": "renew-LON-CORE",
        "scene": 7,
        "title": "ipconfig /renew",
        "op": "client-command",
        "values": {
          "command": "ipconfig /renew"
        },
        "device": "LON-CORE",
        "console": "Command Prompt",
        "sourceScene": "os1-lesson-11-scene-07",
        "menu": "ipconfig /renew"
      },
      {
        "id": "ip-LON-CORE",
        "scene": 7,
        "title": "ipconfig /all",
        "op": "client-command",
        "values": {
          "command": "ipconfig /all"
        },
        "device": "LON-CORE",
        "console": "Command Prompt",
        "sourceScene": "os1-lesson-11-scene-07",
        "menu": "ipconfig /all"
      },
      {
        "id": "renew-LON-CL1",
        "scene": 7,
        "title": "ipconfig /renew",
        "op": "client-command",
        "values": {
          "command": "ipconfig /renew"
        },
        "device": "LON-CL1",
        "console": "Command Prompt",
        "sourceScene": "os1-lesson-11-scene-07",
        "menu": "ipconfig /renew"
      },
      {
        "id": "ip-LON-CL1",
        "scene": 7,
        "title": "ipconfig /all",
        "op": "client-command",
        "values": {
          "command": "ipconfig /all"
        },
        "device": "LON-CL1",
        "console": "Command Prompt",
        "sourceScene": "os1-lesson-11-scene-07",
        "menu": "ipconfig /all"
      },
      {
        "id": "reserve-LON-CL1",
        "scene": 8,
        "title": "New Reservation",
        "op": "reservation",
        "values": {
          "client": "LON-CL1",
          "ip": "172.16.0.191",
          "mac": "00-15-5D-01-00-01",
          "supported": "Both"
        },
        "device": "LON-SVR1",
        "console": "DHCP",
        "sourceScene": "os1-lesson-11-scene-08",
        "menu": "New Reservation"
      },
      {
        "id": "reserved-cl",
        "scene": 9,
        "title": "ipconfig /renew",
        "op": "client-command",
        "values": {
          "command": "ipconfig /renew"
        },
        "device": "LON-CL1",
        "console": "Command Prompt",
        "sourceScene": "os1-lesson-11-scene-09",
        "menu": "ipconfig /renew"
      },
      {
        "id": "verify-cl",
        "scene": 9,
        "title": "ipconfig /all",
        "op": "client-command",
        "values": {
          "command": "ipconfig /all"
        },
        "device": "LON-CL1",
        "console": "Command Prompt",
        "sourceScene": "os1-lesson-11-scene-09",
        "menu": "ipconfig /all"
      },
      {
        "id": "reserve-LON-CORE",
        "scene": 9,
        "title": "New Reservation",
        "op": "reservation",
        "values": {
          "client": "LON-CORE",
          "ip": "172.16.0.105",
          "mac": "00-15-5D-01-00-02",
          "supported": "Both"
        },
        "device": "LON-SVR1",
        "console": "DHCP",
        "sourceScene": "os1-lesson-11-scene-09",
        "menu": "New Reservation"
      },
      {
        "id": "reserved-core",
        "scene": 9,
        "title": "ipconfig /renew",
        "op": "client-command",
        "values": {
          "command": "ipconfig /renew"
        },
        "device": "LON-CORE",
        "console": "Command Prompt",
        "sourceScene": "os1-lesson-11-scene-09",
        "menu": "ipconfig /renew"
      },
      {
        "id": "verify-core",
        "scene": 9,
        "title": "ipconfig /all",
        "op": "client-command",
        "values": {
          "command": "ipconfig /all"
        },
        "device": "LON-CORE",
        "console": "Command Prompt",
        "sourceScene": "os1-lesson-11-scene-09",
        "menu": "ipconfig /all"
      },
      {
        "id": "delete-reservation",
        "scene": 10,
        "title": "Reservation → Delete",
        "op": "delete",
        "values": {
          "confirm": true
        },
        "device": "LON-SVR1",
        "console": "DHCP",
        "entity": "reservations",
        "key": "LON-CL1",
        "sourceScene": "os1-lesson-11-scene-10",
        "menu": "Reservation → Delete"
      },
      {
        "id": "release",
        "scene": 10,
        "title": "ipconfig /release",
        "op": "client-command",
        "values": {
          "command": "ipconfig /release"
        },
        "device": "LON-CL1",
        "console": "Command Prompt",
        "sourceScene": "os1-lesson-11-scene-10",
        "menu": "ipconfig /release"
      },
      {
        "id": "renew",
        "scene": 10,
        "title": "ipconfig /renew",
        "op": "client-command",
        "values": {
          "command": "ipconfig /renew"
        },
        "device": "LON-CL1",
        "console": "Command Prompt",
        "sourceScene": "os1-lesson-11-scene-10",
        "menu": "ipconfig /renew"
      },
      {
        "id": "final",
        "scene": 11,
        "title": "ipconfig /all",
        "op": "client-command",
        "values": {
          "command": "ipconfig /all"
        },
        "device": "LON-CL1",
        "console": "Command Prompt",
        "sourceScene": "os1-lesson-11-scene-11",
        "menu": "ipconfig /all"
      },
      {
        "id": "leases",
        "scene": 11,
        "title": "Address Leases → Refresh",
        "op": "view",
        "values": {},
        "device": "LON-SVR1",
        "console": "DHCP",
        "entity": "leases",
        "key": "LON-CL1",
        "expected": {},
        "sourceScene": "os1-lesson-11-scene-11",
        "menu": "Address Leases → Refresh"
      }
    ],
    "sources": [
      {
        "id": "os1-lesson-11-scene-01",
        "title": "تثبيت دور DHCP Server",
        "video": "/assets/os1/os1-lesson-11/01.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-11/01.jpg",
        "seconds": 74.0,
        "steps": [
          "جهّز LON-DC1 وLON-SVR1 وعملاء المختبر. على SVR1 راجع العنوان الثابت 172.16.0.11 وDNS الذي يشير إلى DC1: 172.16.0.10، واتصال الشبكة قبل تثبيت الخدمة.",
          "Server Manager → Manage → Add Roles and Features → Role-based or feature-based installation → اختر LON-SVR1.",
          "حدد DHCP Server → Add Features، ثم Next حتى صفحة التأكيد → Install. انتظر اكتمال التثبيت؛ لا يكفي وضع علامة على الدور."
        ],
        "notes": [
          "DHCP: Dynamic Host Configuration Protocol، خدمة توزع إعدادات الشبكة تلقائيًا على العملاء. يحتاج الخادم عنوانًا ثابتًا."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-11-scene-02",
        "title": "إكمال الإعداد وتفويض الخادم",
        "video": "/assets/os1/os1-lesson-11/02.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-11/02.jpg",
        "seconds": 97.0,
        "steps": [
          "من إشعار Server Manager افتح Complete DHCP configuration.",
          "تابع Next، واستخدم حساب المختبر الذي يملك صلاحية اعتماد خادم DHCP في المجال، ثم Commit → Close.",
          "افتح Tools → DHCP ووسّع اسم الخادم. إذا لم يكن معتمدًا فاضغط باليمين على الخادم → Authorize ثم Refresh بعد الانتظار.",
          "تحقق من حالة الخادم قبل إنشاء العناوين؛ تثبيت الدور وإتمام اعتماده مرحلتان مختلفتان."
        ],
        "notes": [
          "Authorize يسمح لخادم Windows DHCP بالعمل في بيئة Active Directory."
        ],
        "warnings": [
          "عدم ظهور الحالة الخضراء له أسباب متعددة؛ لا يثبت وحده أن Domain Controller مطفأ."
        ]
      },
      {
        "id": "os1-lesson-11-scene-03",
        "title": "إنشاء Scope وتحديد المجال العددي",
        "video": "/assets/os1/os1-lesson-11/03.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-11/03.jpg",
        "seconds": 66.0,
        "steps": [
          "داخل DHCP على LON-SVR1 افتح IPv4 → New Scope → Next.",
          "اكتب اسم Scope الذي يطلبه تمرينك؛ في الشرح يظهر اختصار BO لنطاق Branch Office.",
          "حدد Start IP: 172.16.0.100 وEnd IP: 172.16.0.200، وLength: 16 / Subnet mask: 255.255.0.0، ثم Next.",
          "راجع البداية والنهاية والقناع معًا قبل المتابعة؛ اسم Scope وحده لا يحدد الشبكة."
        ],
        "notes": [
          "Scope نطاق عناوين تديره خدمة DHCP. المثال يستخدم 172.16.0.100–172.16.0.200 مع قناع 255.255.0.0. طول البادئة /16 عدد بتات الشبكة، وليس عدد العناوين."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-11-scene-04",
        "title": "الاستثناءات ومدة الإيجار",
        "video": "/assets/os1/os1-lesson-11/04.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-11/04.jpg",
        "seconds": 155.0,
        "steps": [
          "في Add Exclusions أدخل البداية 172.16.0.190 والنهاية 172.16.0.200 ثم Add.",
          "أضف استثناء العنوان المنفرد 172.16.0.101 في إدخال مستقل، ثم Add؛ راجع ظهور الاستثناءين في القائمة قبل Next.",
          "في Lease Duration اضبط مدة الإيجار حسب نسختك: كتاب المختبر يطلب يومًا واحدًا، والمدرس يختار يومين بدل القيمة الافتراضية 8 أيام.",
          "لا تخلط هذا الاستثناء مع نطاق 100–110 المستخدم في درس Relay اللاحق؛ إنه تمرين آخر."
        ],
        "notes": [
          "المصدر يعرض استثناء 190–200 ثم يضيف 101 للتوضيح؛ لا تنقل الإضافة التجريبية إلى مطلب مختلف."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-11-scene-05",
        "title": "خيارات العميل وتفعيل Scope",
        "video": "/assets/os1/os1-lesson-11/05.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-11/05.jpg",
        "seconds": 95.0,
        "steps": [
          "اختر Yes, I want to configure these options now.",
          "في Router (Default Gateway) أدخل 172.16.0.1 ثم Add → Next.",
          "في Domain Name and DNS Servers راجع Adatum.com وخادم DNS: 172.16.0.10؛ أضفه إلى القائمة إن لم يكن موجودًا، ثم Next.",
          "اترك WINS دون إضافة في هذا المختبر، ثم اختر Yes, I want to activate this scope now → Next → Finish.",
          "افتح Scope Options وتحقق من البوابة وDNS، وافتح Address Pool لمراجعة مدى العناوين والاستثناءات."
        ],
        "notes": [
          "Address Pool يعرض مجال العناوين؛ Address Leases يعرض الإيجارات الممنوحة فعليًا."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-11-scene-06",
        "title": "تحويل العميل إلى التوزيع التلقائي",
        "video": "/assets/os1/os1-lesson-11/06.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-11/06.jpg",
        "seconds": 111.0,
        "steps": [
          "على العميل افتح خصائص Ethernet → Internet Protocol Version 4 (TCP/IPv4) → Properties.",
          "اختر Obtain an IP address automatically وObtain DNS server address automatically → OK ثم أغلق النوافذ.",
          "كرر الإعداد للعميل الآخر المطلوب. في العرض يحصل Core أولًا على .100، ويتجاوز العميل التالي .101 المستثنى ويحصل على .102.",
          "هذه العناوين نتيجة ترتيب الطلبات في العرض، وليست ضمانًا أن جهازك سيأخذ العنوان نفسه؛ تحقق من بياناته الفعلية."
        ],
        "notes": [
          "هذه الخطوة تخص العميل؛ لا تحول خادم DHCP نفسه من العنوان الثابت إلى التلقائي."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-11-scene-07",
        "title": "قراءة بيانات الإيجار والمحول",
        "video": "/assets/os1/os1-lesson-11/07.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-11/07.jpg",
        "seconds": 96.0,
        "steps": [
          "افتح Command Prompt على العميل واقرأ التهيئة:",
          "ipconfig /all",
          "تحت Ethernet الصحيح راجع DHCP Enabled وIPv4 Address وSubnet Mask وDefault Gateway وDHCP Server وDNS Servers وLease Obtained/Expires.",
          "انسخ Physical Address لهذا المحول عند إنشاء الحجز؛ لا تستخدم MAC لمحول آخر أو قيمة جهاز المدرس.",
          "على SVR1 افتح Scope → Address Leases ثم Refresh، وطابق العنوان واسم العميل وUnique ID مع نتائج العميل."
        ],
        "notes": [
          "لا تستخدم عنوان Tunnel adapter بدل Ethernet adapter. عنوان MAC ليس ضمان هوية لا يمكن تغييره أو تكراره."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-11-scene-08",
        "title": "إنشاء حجز لعميل محدد",
        "video": "/assets/os1/os1-lesson-11/08.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-11/08.jpg",
        "seconds": 138.0,
        "steps": [
          "من Scope → Reservations اضغط باليمين → New Reservation.",
          "اكتب اسمًا يدل على LON-CL1، والعنوان 172.16.0.191، وMAC Address الذي قرأته من Ethernet الخاص به.",
          "أبقِ Supported types وفق إعداد المختبر (Both)، ثم Add → Close، وراجع ظهور الحجز تحت Reservations.",
          "العنوان .191 داخل مدى Scope ومستثنى من التوزيع الديناميكي العادي؛ الحجز يخصصه لهذا العميل. إنشاء الحجز لا يجدد إعداد العميل تلقائيًا."
        ],
        "notes": [
          "Reservation ربط عنوان بعميل محدد عبر DHCP؛ إنشاء الحجز وحده لا يثبت أن العميل حصل عليه."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-11-scene-09",
        "title": "تجديد العميل والتحقق من الحجز",
        "video": "/assets/os1/os1-lesson-11/09.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-11/09.jpg",
        "seconds": 105.0,
        "steps": [
          "على CL1 اطلب تجديد الإيجار ثم اقرأ النتيجة:",
          "ipconfig /renew",
          "ipconfig /all",
          "تحقق أن IPv4 أصبح 172.16.0.191 وأن DHCP Server هو 172.16.0.11؛ حدّث Address Leases على الخادم وتحقق من حالة الحجز.",
          "يكرر المدرس الحجز لعميل Core بعنوان 172.16.0.105: اقرأ MAC الخاص بـCore، وأنشئ حجزًا مستقلًا له، ثم نفّذ renew على Core وتحقق من .105.",
          "لا تنسخ MAC نفسه للحجزين، ولا تعتبر ظهور اسم الحجز وحده دليلًا أن العميل استلمه."
        ],
        "notes": [
          "الحجز يبقى إعدادًا على الخادم، لكن اتصال العميل واستمرار DHCP يحتاجان تحققًا؛ لا تساوِ الحجز بعنوان ثابت يدويًا."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-11-scene-10",
        "title": "إلغاء الحجز وتشخيص التجديد",
        "video": "/assets/os1/os1-lesson-11/10.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-11/10.jpg",
        "seconds": 72.0,
        "steps": [
          "لحذف الحجز، اختر الحجز الصحيح تحت Reservations → Delete وأكد الاسم.",
          "نفّذ ipconfig /renew على العميل. قد يحتفظ بإيجاره السابق مؤقتًا؛ حذف الحجز لا يعني أن العنوان تغير فورًا.",
          "إذا طلب التمرين تحرير الإيجار وإعادة الطلب، وعلى عميل المختبر المحلي فقط:",
          "ipconfig /release",
          "ipconfig /renew",
          "release يقطع اتصال ذلك المحول مؤقتًا؛ لا تستخدمه على جلسة إدارة بعيدة تعتمد عليه."
        ],
        "notes": [
          "التسجيل يعرض تعثرًا مؤقتًا؛ إعادة الأمر دون قراءة الحالة ليست تشخيصًا كافيًا."
        ],
        "warnings": [
          "release يحرر إعداد DHCP وقد يقطع الاتصال عن الجلسة الحالية."
        ]
      },
      {
        "id": "os1-lesson-11-scene-11",
        "title": "إثبات العودة إلى عنوان موزع",
        "video": "/assets/os1/os1-lesson-11/11.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-11/11.jpg",
        "seconds": 64.0,
        "steps": [
          "اقرأ ipconfig /all بعد التجديد، ثم Refresh في Address Leases.",
          "تحقق أن العميل أخذ عنوانًا صالحًا من Scope غير المستثنى، وأن البوابة وDNS والخادم صحيحة.",
          "عنوان 169.254.x.x ليس نجاحًا للتوزيع من هذا الخادم؛ عند ظهوره راجع اتصال Ethernet وحالة Scope والخادم ثم أعد طلب الإيجار.",
          "فرّق بين Address Pool الذي يعرض المدى والاستثناءات، وAddress Leases الذي يعرض ما وُزّع فعليًا."
        ],
        "notes": [
          "عنوان 169.254 في هذه التجربة ليس دليل نجاح DHCP؛ الدليل اللاحق هو عنوان الشبكة مع الإيجار الموافق."
        ],
        "warnings": []
      }
    ],
    "note": "نسخة عرض المدرس: استثناءات DHCP وأيام الإيجار كما في القيم المطلوبة. نسخة الكتاب واختلافاتها ظاهرة في مصدر المشهد؛ لا تخلطهما. عناوين MAC ثابتة لهذه المحاكاة فقط وتُقرأ من ipconfig /all.",
    "sceneCoverage": [
      {
        "scene": "os1-lesson-11-scene-01",
        "actions": [
          "static",
          "role"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-11-scene-02",
        "actions": [
          "authorize"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-11-scene-03",
        "actions": [
          "scope-BO"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-11-scene-04",
        "actions": [
          "scope-BO"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-11-scene-05",
        "actions": [
          "scope-BO"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-11-scene-06",
        "actions": [
          "auto-LON-CORE",
          "auto-LON-CL1"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-11-scene-07",
        "actions": [
          "renew-LON-CORE",
          "ip-LON-CORE",
          "renew-LON-CL1",
          "ip-LON-CL1"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-11-scene-08",
        "actions": [
          "reserve-LON-CL1"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-11-scene-09",
        "actions": [
          "reserved-cl",
          "verify-cl",
          "reserve-LON-CORE",
          "reserved-core",
          "verify-core"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-11-scene-10",
        "actions": [
          "delete-reservation",
          "release",
          "renew"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-11-scene-11",
        "actions": [
          "final",
          "leases"
        ],
        "role": "procedure-or-context"
      }
    ]
  },
  {
    "id": "course-12",
    "lesson": 12,
    "scene": 1,
    "title": "Module 6 · Exercise 2 · DHCP Relay Agent",
    "subtitle": "DHCP",
    "kind": "curriculum",
    "console": "DHCP",
    "host": "LON-SVR1",
    "why": "ربط عملاء شبكة ثانية بخادم DHCP عبر RRAS، مع مراجعة الحجز وفحص عنوان العميل قبل وبعد الإعداد.",
    "question": "لماذا يحتاج العميل في شبكة 10.10.0.0 إلى DHCP Relay هنا؟",
    "options": [
      "لإيصال طلبات DHCP من الشبكة الثانية إلى الخادم في الشبكة الأخرى.",
      "لتحويل عنوان MAC إلى كلمة مرور.",
      "لإلغاء الحاجة إلى Scope للشبكة الثانية."
    ],
    "answer": 0,
    "explain": "لإيصال طلبات DHCP من الشبكة الثانية إلى الخادم في الشبكة الأخرى. نتيجة المحاكاة تخص هذه المحاولة، ولا تثبت تنفيذًا على Windows فعلي.",
    "hint": "راجع الجهاز والحساب والنتيجة الفعلية في لوحة الحالة. تعديل الإعداد يختلف عن فحص أثره.",
    "reveal": "افتح العملية من الأداة، ثم راجع خطوات المصدر والقيم المطلوبة. أدخلها بنفسك، طبّق الإعداد ثم افتح عملية التحقق المرتبطة.",
    "actions": [
      {
        "id": "scope-view",
        "scene": 1,
        "title": "Address Pool / Scope Options",
        "op": "view",
        "values": {},
        "device": "LON-SVR1",
        "console": "DHCP",
        "entity": "scopes",
        "key": "CTE",
        "expected": {
          "exclusions": "100-110",
          "leaseDays": 8
        },
        "sourceScene": "os1-lesson-12-scene-01",
        "menu": "Address Pool / Scope Options"
      },
      {
        "id": "read-core",
        "scene": 2,
        "title": "ipconfig /all",
        "op": "client-command",
        "values": {
          "command": "ipconfig /all"
        },
        "device": "LON-CORE",
        "console": "Command Prompt",
        "sourceScene": "os1-lesson-12-scene-02",
        "menu": "ipconfig /all"
      },
      {
        "id": "reserve-LON-CORE",
        "scene": 2,
        "title": "New Reservation",
        "op": "reservation",
        "values": {
          "client": "LON-CORE",
          "ip": "172.16.0.100",
          "mac": "00-15-5D-01-00-02",
          "supported": "Both"
        },
        "device": "LON-SVR1",
        "console": "DHCP",
        "sourceScene": "os1-lesson-12-scene-02",
        "menu": "New Reservation"
      },
      {
        "id": "reserved-core",
        "scene": 3,
        "title": "ipconfig /renew",
        "op": "client-command",
        "values": {
          "command": "ipconfig /renew"
        },
        "device": "LON-CORE",
        "console": "Command Prompt",
        "sourceScene": "os1-lesson-12-scene-03",
        "menu": "ipconfig /renew"
      },
      {
        "id": "verify-core",
        "scene": 3,
        "title": "ipconfig /all",
        "op": "client-command",
        "values": {
          "command": "ipconfig /all"
        },
        "device": "LON-CORE",
        "console": "Command Prompt",
        "sourceScene": "os1-lesson-12-scene-03",
        "menu": "ipconfig /all"
      },
      {
        "id": "delete-reservation",
        "scene": 3,
        "title": "Delete Reservation",
        "op": "delete",
        "values": {
          "confirm": true
        },
        "device": "LON-SVR1",
        "console": "DHCP",
        "entity": "reservations",
        "key": "LON-CORE",
        "sourceScene": "os1-lesson-12-scene-03",
        "menu": "Delete Reservation"
      },
      {
        "id": "release",
        "scene": 3,
        "title": "ipconfig /release",
        "op": "client-command",
        "values": {
          "command": "ipconfig /release"
        },
        "device": "LON-CORE",
        "console": "Command Prompt",
        "sourceScene": "os1-lesson-12-scene-03",
        "menu": "ipconfig /release"
      },
      {
        "id": "renew",
        "scene": 3,
        "title": "ipconfig /renew",
        "op": "client-command",
        "values": {
          "command": "ipconfig /renew"
        },
        "device": "LON-CORE",
        "console": "Command Prompt",
        "sourceScene": "os1-lesson-12-scene-03",
        "menu": "ipconfig /renew"
      },
      {
        "id": "topology",
        "scene": 4,
        "title": "RRAS → Network Interfaces",
        "op": "view",
        "values": {},
        "device": "LON-RTR",
        "console": "Routing and Remote Access",
        "entity": "interfaces",
        "key": "Ethernet 2",
        "expected": {
          "ip": "10.10.0.1",
          "mask": "255.255.0.0"
        },
        "sourceScene": "os1-lesson-12-scene-04",
        "menu": "RRAS → Network Interfaces"
      },
      {
        "id": "scope-Remote",
        "scene": 5,
        "title": "New Scope Wizard",
        "op": "put",
        "values": {
          "name": "Remote",
          "start": "10.10.0.100",
          "end": "10.10.0.200",
          "mask": "255.255.0.0",
          "exclusions": "100-110",
          "leaseDays": 8,
          "gateway": "10.10.0.1",
          "dns": "172.16.0.10",
          "domain": "Adatum.com",
          "wins": "",
          "active": true
        },
        "device": "LON-SVR1",
        "console": "DHCP",
        "entity": "scopes",
        "key": "Remote",
        "sourceScene": "os1-lesson-12-scene-05",
        "menu": "New Scope Wizard"
      },
      {
        "id": "relay",
        "scene": 6,
        "title": "IPv4 → General → New Routing Protocol → DHCP Relay Agent",
        "op": "put",
        "values": {
          "protocol": "DHCP Relay Agent",
          "interface": "Ethernet 2",
          "enabled": true,
          "server": "172.16.0.11"
        },
        "device": "LON-RTR",
        "console": "Routing and Remote Access",
        "entity": "relay",
        "key": "Remote",
        "sourceScene": "os1-lesson-12-scene-06",
        "menu": "IPv4 → General → New Routing Protocol → DHCP Relay Agent"
      },
      {
        "id": "auto-remote",
        "scene": 7,
        "title": "Ethernet → IPv4 Properties",
        "op": "put",
        "values": {
          "auto": true,
          "autoDNS": true
        },
        "device": "LON-CL2",
        "console": "Network Connections",
        "entity": "interfaces",
        "key": "LON-CL2",
        "sourceScene": "os1-lesson-12-scene-07",
        "menu": "Ethernet → IPv4 Properties"
      },
      {
        "id": "renew-remote",
        "scene": 7,
        "title": "ipconfig /renew",
        "op": "client-command",
        "values": {
          "command": "ipconfig /renew"
        },
        "device": "LON-CL2",
        "console": "Command Prompt",
        "sourceScene": "os1-lesson-12-scene-07",
        "menu": "ipconfig /renew"
      },
      {
        "id": "remote-result",
        "scene": 7,
        "title": "ipconfig /all",
        "op": "client-command",
        "values": {
          "command": "ipconfig /all"
        },
        "device": "LON-CL2",
        "console": "Command Prompt",
        "sourceScene": "os1-lesson-12-scene-07",
        "menu": "ipconfig /all"
      },
      {
        "id": "lease-remote",
        "scene": 7,
        "title": "Address Leases → Refresh",
        "op": "view",
        "values": {},
        "device": "LON-SVR1",
        "console": "DHCP",
        "entity": "leases",
        "key": "LON-CL2",
        "expected": {
          "ip": "10.10.0.111",
          "mask": "255.255.0.0"
        },
        "sourceScene": "os1-lesson-12-scene-07",
        "menu": "Address Leases → Refresh"
      }
    ],
    "sources": [
      {
        "id": "os1-lesson-12-scene-01",
        "title": "مراجعة Scope والاستثناءات",
        "video": "/assets/os1/os1-lesson-12/01.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-12/01.jpg",
        "seconds": 97.0,
        "steps": [
          "هذا تسجيل تمرين Relay؛ لا تفترض أنه يحتفظ بكل إعدادات درس DHCP السابق.",
          "على LON-SVR1 راجع Scope باسم CTE: المدى 172.16.0.100–172.16.0.200، والاستثناء 172.16.0.100–172.16.0.110، ومدة الإيجار المعروضة 8 أيام.",
          "راجع تفعيل Scope وعنوان خادم DHCP: 172.16.0.11، ثم افتح Address Leases واقرأ العميل الموجود بدل افتراض عنوانه."
        ],
        "notes": [
          "هذا التسجيل يستخدم استثناء .100–.110؛ تختلف القيم التجريبية عن التسجيل السابق."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-12-scene-02",
        "title": "تحديد العميل وحجز عنوانه",
        "video": "/assets/os1/os1-lesson-12/02.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-12/02.jpg",
        "seconds": 69.0,
        "steps": [
          "على Core اقرأ ipconfig /all وسجل Physical Address لمحول الشبكة الذي يطلب DHCP.",
          "في SVR1 → IPv4 → CTE → Reservations → New Reservation، اكتب اسم العميل وعنوان 172.16.0.100 وMAC الخاص به.",
          "أضف الحجز ثم أغلق النافذة. لا تستخدم عنوان MAC الموجود في صورة الفيديو على جهاز مختلف."
        ],
        "notes": [
          "اسم الحجز وصف إداري؛ المطابقة تعتمد على بيانات العميل التي يدخلها المسؤول."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-12-scene-03",
        "title": "إكمال الحجز وتجديد العنوان",
        "video": "/assets/os1/os1-lesson-12/03.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-12/03.jpg",
        "seconds": 111.0,
        "steps": [
          "على Core نفّذ ipconfig /renew ثم ipconfig /all، وتحقق من العنوان المحجوز .100.",
          "حدّث Reservations وAddress Leases على الخادم لمقارنة الحجز بالعميل الفعلي.",
          "عند جزء إلغاء الحجز احذف الحجز الصحيح، ثم حرر الإيجار وأعد طلبه على عميل المختبر بـipconfig /release ثم ipconfig /renew. اقرأ النتيجة؛ قد يحتفظ renew وحده بالإيجار السابق."
        ],
        "notes": [
          "يراجع المصدر الفرق بين الإيجار الديناميكي والحجز، ثم ينتقل إلى شبكة أخرى."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-12-scene-04",
        "title": "لماذا نحتاج Relay بين الشبكات؟",
        "video": "/assets/os1/os1-lesson-12/04.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-12/04.jpg",
        "seconds": 81.0,
        "steps": [
          "حدد في رسم المختبر شبكة الخادم 172.16.0.0، وشبكة العميل البعيد 10.10.0.0، وLON-RTR الذي يربطهما.",
          "DHCP Relay Agent ينقل طلب DHCP بين الشبكات؛ بث العميل لا يعبر Router تلقائيًا.",
          "جهّز ثلاثة أشياء معًا: العميل يطلب عنوانًا تلقائيًا، وخادم DHCP يملك Scope مناسبًا لشبكته، وRelay مضبوط على الواجهة المواجهة للعميل وعنوان خادم DHCP.",
          "خدمة Routing and Remote Access وواجهات LON-RTR جاهزة في بيئة هذا التمرين؛ لا يعرض التسجيل بناء الشبكة الافتراضية كلها من الصفر."
        ],
        "notes": [
          "وجود العميل خارج Domain (المجال) لا يمنعه بذاته من أخذ عنوان DHCP؛ المهم مسار الشبكة والإعدادات."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-12-scene-05",
        "title": "إنشاء Scope للشبكة الثانية",
        "video": "/assets/os1/os1-lesson-12/05.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-12/05.jpg",
        "seconds": 63.0,
        "steps": [
          "على SVR1 افتح IPv4 → New Scope وسمّه بما يميز الشبكة الثانية، ثم أدخل 10.10.0.100–10.10.0.200.",
          "اضبط القناع بما يطابق شبكة العميل وRouter: كتاب المختبر الظاهر يحدد 255.255.0.0 (/16). لا تترك القناع المقترح آليًا دون مراجعته.",
          "في عرض المدرس يظهر استثناء 10.10.0.100–10.10.0.110؛ كتاب المختبر يطلب 10.10.0.190–10.10.0.200. اختر نسخة واحدة حسب التكليف؛ تختلف العناوين المتوقع توزيعها تبعًا لها.",
          "اختر إعداد الخيارات الآن، وأضف Router: 10.10.0.1 وDNS: 172.16.0.10 واسم المجال Adatum.com، واترك WINS فارغًا في هذا المختبر.",
          "فعّل Scope ثم Finish. راجع Address Pool وScope Options والقناع من خصائص Scope قبل الانتقال إلى Relay."
        ],
        "notes": [
          "القيم تخص المختبر. إنشاء Scope جديد لا يكمل عمل Relay وحده."
        ],
        "warnings": [
          "اختلاف موثق بين كتاب المختبر وعرض المدرس في الاستثناءات. لا تعتمد العنوان النهائي المعروض دون مطابقة إعداد Scope لديك."
        ]
      },
      {
        "id": "os1-lesson-12-scene-06",
        "title": "تحديد واجهة Relay وعنوان الخادم",
        "video": "/assets/os1/os1-lesson-12/06.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-12/06.jpg",
        "seconds": 76.0,
        "steps": [
          "على LON-RTR افتح Server Manager → Tools → Routing and Remote Access، ثم وسّع الخادم → IPv4.",
          "اضغط باليمين على General → New Routing Protocol → DHCP Relay Agent → OK.",
          "اضغط باليمين على DHCP Relay Agent → New Interface؛ اختر الواجهة المواجهة لشبكة 10.10.0.0 (Ethernet 2 في العرض)، ثم OK، وتأكد من Relay DHCP packets.",
          "اضغط باليمين على DHCP Relay Agent → Properties. أدخل Server address: 172.16.0.11 → Add → OK.",
          "راجع قائمة الواجهات وقائمة الخوادم؛ اختيار بروتوكول Relay وحده لا يحدد إلى أين تُرسل الطلبات."
        ],
        "notes": [
          "عنوان الخادم ليس عنوان العميل ولا عنوان Domain Controller لمجرد أنه موجود في الشبكة."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-12-scene-07",
        "title": "اختبار العميل ثم مراجعة المسار",
        "video": "/assets/os1/os1-lesson-12/07.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-12/07.jpg",
        "seconds": 104.0,
        "steps": [
          "على العميل البعيد افتح خصائص IPv4 واختر العنوان وDNS تلقائيًا، ثم نفّذ ipconfig /renew وبعده ipconfig /all.",
          "راجع عنوانًا من Scope الشبكة الثانية، والقناع الموافق لشبكتها، والبوابة 10.10.0.1 وDNS 172.16.0.10 وخادم DHCP 172.16.0.11.",
          "حدّث Address Leases في Scope الثاني على SVR1 وطابق MAC/اسم العميل. مع استثناء المدرس 100–110 يظهر .111؛ نسخة الكتاب قد تعطي عنوانًا مختلفًا.",
          "إذا فشل الطلب راجع بالترتيب شبكة العميل، وواجهة Relay، وعنوان خادم DHCP، وتفعيل Scope. الانضمام إلى Domain ليس شرطًا للحصول على إيجار DHCP."
        ],
        "notes": [
          "هذا التسجيل يعرض حصول العميل على عنوان بعد الإعداد؛ لا تكتفِ بوجود Relay في الشجرة."
        ],
        "warnings": []
      }
    ],
    "note": "نسخة عرض المدرس: استثناءات DHCP وأيام الإيجار كما في القيم المطلوبة. نسخة الكتاب واختلافاتها ظاهرة في مصدر المشهد؛ لا تخلطهما. عناوين MAC ثابتة لهذه المحاكاة فقط وتُقرأ من ipconfig /all.",
    "sceneCoverage": [
      {
        "scene": "os1-lesson-12-scene-01",
        "actions": [
          "scope-view"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-12-scene-02",
        "actions": [
          "read-core",
          "reserve-LON-CORE"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-12-scene-03",
        "actions": [
          "reserved-core",
          "verify-core",
          "delete-reservation",
          "release",
          "renew"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-12-scene-04",
        "actions": [
          "topology"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-12-scene-05",
        "actions": [
          "scope-Remote"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-12-scene-06",
        "actions": [
          "relay"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-12-scene-07",
        "actions": [
          "auto-remote",
          "renew-remote",
          "remote-result",
          "lease-remote"
        ],
        "role": "procedure-or-context"
      }
    ]
  },
  {
    "id": "course-13",
    "lesson": 13,
    "scene": 1,
    "title": "Module 6 · Exercise 2 · تطبيق إضافي لـ DHCP Relay",
    "subtitle": "DHCP",
    "kind": "curriculum",
    "console": "DHCP",
    "host": "LON-SVR1",
    "why": "تسجيل إضافي مستقل يراجع الحجز وشبكتي المختبر، ثم يطبق Relay ويتحقق من الإيجار على الخادم.",
    "question": "ضبطت Relay لكن العميل لم يحصل على عنوان مناسب. أي فحص يخدم التشخيص؟",
    "options": [
      "اسم الطابعة الافتراضية على العميل.",
      "نوع خط نافذة الأوامر.",
      "واجهة Relay وعنوان خادم DHCP وScope الشبكة الثانية وتفعيله."
    ],
    "answer": 2,
    "explain": "واجهة Relay وعنوان خادم DHCP وScope الشبكة الثانية وتفعيله. نتيجة المحاكاة تخص هذه المحاولة، ولا تثبت تنفيذًا على Windows فعلي.",
    "hint": "راجع الجهاز والحساب والنتيجة الفعلية في لوحة الحالة. تعديل الإعداد يختلف عن فحص أثره.",
    "reveal": "افتح العملية من الأداة، ثم راجع خطوات المصدر والقيم المطلوبة. أدخلها بنفسك، طبّق الإعداد ثم افتح عملية التحقق المرتبطة.",
    "actions": [
      {
        "id": "scope-view",
        "scene": 1,
        "title": "Address Pool / Scope Options",
        "op": "view",
        "values": {},
        "device": "LON-SVR1",
        "console": "DHCP",
        "entity": "scopes",
        "key": "CTE",
        "expected": {
          "exclusions": "100-110",
          "leaseDays": 8
        },
        "sourceScene": "os1-lesson-13-scene-01",
        "menu": "Address Pool / Scope Options"
      },
      {
        "id": "read-core",
        "scene": 1,
        "title": "ipconfig /all",
        "op": "client-command",
        "values": {
          "command": "ipconfig /all"
        },
        "device": "LON-CORE",
        "console": "Command Prompt",
        "sourceScene": "os1-lesson-13-scene-01",
        "menu": "ipconfig /all"
      },
      {
        "id": "reserve-LON-CORE",
        "scene": 1,
        "title": "New Reservation",
        "op": "reservation",
        "values": {
          "client": "LON-CORE",
          "ip": "172.16.0.100",
          "mac": "00-15-5D-01-00-02",
          "supported": "Both"
        },
        "device": "LON-SVR1",
        "console": "DHCP",
        "sourceScene": "os1-lesson-13-scene-01",
        "menu": "New Reservation"
      },
      {
        "id": "reserved-core",
        "scene": 2,
        "title": "ipconfig /renew",
        "op": "client-command",
        "values": {
          "command": "ipconfig /renew"
        },
        "device": "LON-CORE",
        "console": "Command Prompt",
        "sourceScene": "os1-lesson-13-scene-02",
        "menu": "ipconfig /renew"
      },
      {
        "id": "verify-core",
        "scene": 2,
        "title": "ipconfig /all",
        "op": "client-command",
        "values": {
          "command": "ipconfig /all"
        },
        "device": "LON-CORE",
        "console": "Command Prompt",
        "sourceScene": "os1-lesson-13-scene-02",
        "menu": "ipconfig /all"
      },
      {
        "id": "delete-reservation",
        "scene": 2,
        "title": "Delete Reservation",
        "op": "delete",
        "values": {
          "confirm": true
        },
        "device": "LON-SVR1",
        "console": "DHCP",
        "entity": "reservations",
        "key": "LON-CORE",
        "sourceScene": "os1-lesson-13-scene-02",
        "menu": "Delete Reservation"
      },
      {
        "id": "release",
        "scene": 2,
        "title": "ipconfig /release",
        "op": "client-command",
        "values": {
          "command": "ipconfig /release"
        },
        "device": "LON-CORE",
        "console": "Command Prompt",
        "sourceScene": "os1-lesson-13-scene-02",
        "menu": "ipconfig /release"
      },
      {
        "id": "renew",
        "scene": 2,
        "title": "ipconfig /renew",
        "op": "client-command",
        "values": {
          "command": "ipconfig /renew"
        },
        "device": "LON-CORE",
        "console": "Command Prompt",
        "sourceScene": "os1-lesson-13-scene-02",
        "menu": "ipconfig /renew"
      },
      {
        "id": "topology",
        "scene": 3,
        "title": "RRAS → Network Interfaces",
        "op": "view",
        "values": {},
        "device": "LON-RTR",
        "console": "Routing and Remote Access",
        "entity": "interfaces",
        "key": "Ethernet 2",
        "expected": {
          "ip": "10.10.0.1",
          "mask": "255.255.0.0"
        },
        "sourceScene": "os1-lesson-13-scene-03",
        "menu": "RRAS → Network Interfaces"
      },
      {
        "id": "auto-remote",
        "scene": 4,
        "title": "Ethernet → IPv4 Properties",
        "op": "put",
        "values": {
          "auto": true,
          "autoDNS": true
        },
        "device": "LON-CL2",
        "console": "Network Connections",
        "entity": "interfaces",
        "key": "LON-CL2",
        "sourceScene": "os1-lesson-13-scene-04",
        "menu": "Ethernet → IPv4 Properties"
      },
      {
        "id": "scope-Remote",
        "scene": 5,
        "title": "New Scope Wizard",
        "op": "put",
        "values": {
          "name": "Remote",
          "start": "10.10.0.100",
          "end": "10.10.0.200",
          "mask": "255.255.0.0",
          "exclusions": "100-110",
          "leaseDays": 8,
          "gateway": "10.10.0.1",
          "dns": "172.16.0.10",
          "domain": "Adatum.com",
          "wins": "",
          "active": true
        },
        "device": "LON-SVR1",
        "console": "DHCP",
        "entity": "scopes",
        "key": "Remote",
        "sourceScene": "os1-lesson-13-scene-05",
        "menu": "New Scope Wizard"
      },
      {
        "id": "relay",
        "scene": 6,
        "title": "IPv4 → General → New Routing Protocol → DHCP Relay Agent",
        "op": "put",
        "values": {
          "protocol": "DHCP Relay Agent",
          "interface": "Ethernet 2",
          "enabled": true,
          "server": "172.16.0.11"
        },
        "device": "LON-RTR",
        "console": "Routing and Remote Access",
        "entity": "relay",
        "key": "Remote",
        "sourceScene": "os1-lesson-13-scene-06",
        "menu": "IPv4 → General → New Routing Protocol → DHCP Relay Agent"
      },
      {
        "id": "renew-remote",
        "scene": 7,
        "title": "ipconfig /renew",
        "op": "client-command",
        "values": {
          "command": "ipconfig /renew"
        },
        "device": "LON-CL2",
        "console": "Command Prompt",
        "sourceScene": "os1-lesson-13-scene-07",
        "menu": "ipconfig /renew"
      },
      {
        "id": "remote-result",
        "scene": 7,
        "title": "ipconfig /all",
        "op": "client-command",
        "values": {
          "command": "ipconfig /all"
        },
        "device": "LON-CL2",
        "console": "Command Prompt",
        "sourceScene": "os1-lesson-13-scene-07",
        "menu": "ipconfig /all"
      },
      {
        "id": "lease-remote",
        "scene": 7,
        "title": "Address Leases → Refresh",
        "op": "view",
        "values": {},
        "device": "LON-SVR1",
        "console": "DHCP",
        "entity": "leases",
        "key": "LON-CL2",
        "expected": {
          "ip": "10.10.0.111",
          "mask": "255.255.0.0"
        },
        "sourceScene": "os1-lesson-13-scene-07",
        "menu": "Address Leases → Refresh"
      }
    ],
    "sources": [
      {
        "id": "os1-lesson-13-scene-01",
        "title": "مراجعة الحجز وبيانات المحول",
        "video": "/assets/os1/os1-lesson-13/01.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-13/01.jpg",
        "seconds": 64.0,
        "steps": [
          "هذا تسجيل مكمل لنفس تمرين Relay؛ افحص الوضع الحالي قبل إنشاء Scope أو حجز مكرر.",
          "على العميل اقرأ ipconfig /all، ثم طابق IPv4 وPhysical Address وDHCP Server مع Address Leases على SVR1.",
          "لإعادة تجربة الحجز استخدم Reservations → New Reservation، وحدد .100 وMAC العميل الصحيح ثم Add؛ لا تنقل MAC من الفيديو."
        ],
        "notes": [
          "هذا تسجيل آخر للتمرين نفسه؛ يحتفظ بأمثلة الشرح ولا يمثل موديولًا جديدًا."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-13-scene-02",
        "title": "التحقق من تفعيل الحجز",
        "video": "/assets/os1/os1-lesson-13/02.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-13/02.jpg",
        "seconds": 124.0,
        "steps": [
          "نفّذ ipconfig /renew على العميل ثم ipconfig /all وتحقق من .100 بعد الحجز.",
          "حدّث نافذة DHCP لترى الإيجار الفعلي. عند حذف الحجز راجع تجديد الإيجار، واستخدم release ثم renew فقط عندما يتطلب تمرين المختبر إعادة طلبه.",
          "لا تعتبر Address Pool قائمة بالأجهزة المتصلة؛ الأجهزة التي حصلت على عناوين تظهر في Address Leases."
        ],
        "notes": [
          "الحجز وإيجار العميل عنصران مرتبطان لكنهما ليسا الشيء نفسه."
        ],
        "warnings": [
          "ipconfig /release قد يقطع الاتصال؛ ينفذ هنا داخل مختبر يمكن الوصول إليه محليًا."
        ]
      },
      {
        "id": "os1-lesson-13-scene-03",
        "title": "قراءة رسم الشبكتين",
        "video": "/assets/os1/os1-lesson-13/03.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-13/03.jpg",
        "seconds": 105.0,
        "steps": [
          "اقرأ الرسم قبل تغيير الإعدادات: SVR1 هو خادم DHCP في شبكة 172.16.0.0، والعميل الثاني في شبكة 10.10.0.0.",
          "LON-RTR لديه واجهة لكل شبكة؛ دوّن أي واجهة تواجه العميل البعيد. اسم Ethernet 2 في العرض يجب مطابقته بعنوان الواجهة لديك.",
          "DHCP Relay Agent على Router هو الوسيط؛ لا تنقل خادم DHCP إلى شبكة العميل لمجرد أن الطلب بث محلي."
        ],
        "notes": [
          "Router يصل الشبكات، بينما Relay يمرر رسائل DHCP المطلوبة إلى الخادم المحدد."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-13-scene-04",
        "title": "شروط وصول العميل البعيد",
        "video": "/assets/os1/os1-lesson-13/04.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-13/04.jpg",
        "seconds": 111.0,
        "steps": [
          "تأكد أن عميل الشبكة البعيدة مضبوط على Obtain an IP address automatically وObtain DNS server address automatically.",
          "تأكد أن SVR1 معتمد وخدمة DHCP تعمل، وأنه يملك Scope مفعّلًا للشبكة البعيدة.",
          "تأكد أن LON-RTR يستطيع الوصول إلى SVR1 وأن واجهته المواجهة للعميل متاحة. إعداد Relay يحتاج عنوان الخادم وواجهة استقبال الطلبات معًا."
        ],
        "notes": [
          "الشرح يبسط Broadcast وUnicast: الوسيط يستقبل طلبات العملاء ويمررها إلى الخادم، ثم يعيد الاستجابة وفق إعداد البروتوكول."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-13-scene-05",
        "title": "Scope الشبكة الثانية وخياراتها",
        "video": "/assets/os1/os1-lesson-13/05.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-13/05.jpg",
        "seconds": 126.0,
        "steps": [
          "في SVR1 افتح IPv4 → New Scope، وحدد المدى 10.10.0.100–10.10.0.200.",
          "راجع Subnet mask صراحةً: كتاب المختبر الظاهر يحدد 255.255.0.0 (/16)، بينما تظهر قيمة 255.0.0.0 (/8) مقترحة في شاشة المعالج أثناء العرض. استخدم قناع شبكة المختبر الفعلي ولا تعتمد الاقتراح تلقائيًا.",
          "استثناء المدرس هو .100–.110، مقابل .190–.200 في كتاب المختبر. أدخل البداية والنهاية ثم Add، واختر إعدادات نسخة التكليف نفسها.",
          "أضف البوابة 10.10.0.1 وDNS 172.16.0.10 وAdatum.com، ثم فعّل Scope وأنهِ المعالج.",
          "افتح خصائص Scope وAddress Pool وScope Options للتحقق قبل اختبار العميل."
        ],
        "notes": [
          "تتباين قيم الاستثناء بين نص الكتاب وتطبيق المدرس؛ اتبع قيم المهمة التي تطبقها ولا تخلط التجربتين."
        ],
        "warnings": [
          "القناع المعروض في إحدى شاشات المعالج يختلف عن كتاب المختبر؛ لا يُقدَّم هذا الاختلاف كإعداد واحد متطابق. راجع قناع شبكة العميل وRouter أيضًا."
        ]
      },
      {
        "id": "os1-lesson-13-scene-06",
        "title": "إضافة البروتوكول والواجهة",
        "video": "/assets/os1/os1-lesson-13/06.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-13/06.jpg",
        "seconds": 80.0,
        "steps": [
          "على LON-RTR افتح Routing and Remote Access → الخادم → IPv4 → General → New Routing Protocol.",
          "اختر DHCP Relay Agent، ثم من عنصره New Interface واختر الواجهة المتصلة بشبكة العميل البعيد (Ethernet 2 في العرض).",
          "تأكد من تفعيل Relay DHCP packets في خصائص الواجهة.",
          "افتح Properties لعنصر DHCP Relay Agent نفسه، وأضف Server address: 172.16.0.11 بزر Add ثم OK.",
          "إذا كانت الواجهة والبروتوكول موجودين من التسجيل السابق فراجع خصائصهما بدل إضافتهما مرة ثانية."
        ],
        "notes": [
          "اختيار الواجهة جزء مستقل عن إدخال عنوان الخادم؛ راجع الاثنين."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-13-scene-07",
        "title": "تجديد العميل ومطابقة الإيجار",
        "video": "/assets/os1/os1-lesson-13/07.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-13/07.jpg",
        "seconds": 48.0,
        "steps": [
          "على العميل البعيد نفّذ ipconfig /renew ثم ipconfig /all.",
          "طابق الشبكة والقناع والبوابة وDNS وخادم DHCP مع إعداد Scope. في عرض الاستثناء 100–110 يظهر العنوان 10.10.0.111.",
          "على SVR1 حدّث Address Leases في Scope الثاني وقارن اسم العميل وMAC بالإيجار المعروض عليه.",
          "عند الفشل افحص اتصال الشبكتين ثم الواجهة المحددة للـRelay وعنوان الخادم وتفعيل Scope؛ لا تعتبر ظهور البروتوكول وحده نجاحًا للاختبار."
        ],
        "notes": [
          "التحقق يجمع نتيجة العميل مع سجل الخادم؛ لا تعلن نجاح Relay من المعالج وحده."
        ],
        "warnings": []
      }
    ],
    "note": "نسخة عرض المدرس: استثناءات DHCP وأيام الإيجار كما في القيم المطلوبة. نسخة الكتاب واختلافاتها ظاهرة في مصدر المشهد؛ لا تخلطهما. عناوين MAC ثابتة لهذه المحاكاة فقط وتُقرأ من ipconfig /all.",
    "sceneCoverage": [
      {
        "scene": "os1-lesson-13-scene-01",
        "actions": [
          "scope-view",
          "read-core",
          "reserve-LON-CORE"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-13-scene-02",
        "actions": [
          "reserved-core",
          "verify-core",
          "delete-reservation",
          "release",
          "renew"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-13-scene-03",
        "actions": [
          "topology"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-13-scene-04",
        "actions": [
          "auto-remote"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-13-scene-05",
        "actions": [
          "scope-Remote"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-13-scene-06",
        "actions": [
          "relay"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-13-scene-07",
        "actions": [
          "renew-remote",
          "remote-result",
          "lease-remote"
        ],
        "role": "procedure-or-context"
      }
    ]
  },
  {
    "id": "course-14",
    "lesson": 14,
    "scene": 1,
    "title": "Module 7 · Exercise 1 · DNS والمناطق والسجلات",
    "subtitle": "DNS Manager",
    "kind": "curriculum",
    "console": "DNS Manager",
    "host": "LON-DC1",
    "why": "إدارة DNS zones وسجلات الأسماء، والتمييز بين منطقة محفوظة في ملف وأخرى مدمجة في Active Directory عند النسخ المتماثل.",
    "question": "لماذا لم تظهر contoso.com على SVR1 بعد نسخ بيانات AD؟",
    "options": [
      "لأن وجود سجل A يمنع النسخ المتماثل.",
      "لأنها منطقة محفوظة في ملف وغير مدمجة في Active Directory.",
      "لأن كل مناطق DNS تنتقل فقط بإعادة تسمية السيرفر."
    ],
    "answer": 1,
    "explain": "لأنها منطقة محفوظة في ملف وغير مدمجة في Active Directory. نتيجة المحاكاة تخص هذه المحاولة، ولا تثبت تنفيذًا على Windows فعلي.",
    "hint": "راجع الجهاز والحساب والنتيجة الفعلية في لوحة الحالة. تعديل الإعداد يختلف عن فحص أثره.",
    "reveal": "افتح العملية من الأداة، ثم راجع خطوات المصدر والقيم المطلوبة. أدخلها بنفسك، طبّق الإعداد ثم افتح عملية التحقق المرتبطة.",
    "actions": [
      {
        "id": "replica",
        "scene": 1,
        "title": "AD DS Configuration → Additional DC",
        "op": "put",
        "values": {
          "dc": true,
          "dns": false,
          "domain": "Adatum.com",
          "dsrm": "Pa$$w0rd",
          "confirm": "Pa$$w0rd"
        },
        "device": "LON-SVR1",
        "console": "AD DS Configuration Wizard",
        "entity": "servers",
        "key": "LON-SVR1",
        "sourceScene": "os1-lesson-14-scene-01",
        "menu": "AD DS Configuration → Additional DC"
      },
      {
        "id": "zones",
        "scene": 2,
        "title": "Forward / Reverse Lookup Zones",
        "op": "view",
        "values": {},
        "device": "LON-DC1",
        "console": "DNS Manager",
        "entity": "zones",
        "key": "Adatum.com",
        "expected": {
          "integrated": true
        },
        "sourceScene": "os1-lesson-14-scene-02",
        "menu": "Forward / Reverse Lookup Zones"
      },
      {
        "id": "primary",
        "scene": 3,
        "title": "Forward Lookup Zones → New Zone",
        "op": "put",
        "values": {
          "name": "contoso.com",
          "type": "Primary",
          "integrated": false,
          "file": "contoso.com.dns",
          "dynamic": "None"
        },
        "device": "LON-DC1",
        "console": "DNS Manager",
        "entity": "zones",
        "key": "contoso.com",
        "sourceScene": "os1-lesson-14-scene-03",
        "menu": "Forward Lookup Zones → New Zone"
      },
      {
        "id": "www",
        "scene": 4,
        "title": "New Host (A or AAAA)",
        "op": "put",
        "values": {
          "name": "www",
          "zone": "contoso.com",
          "ip": "172.16.0.100",
          "type": "A"
        },
        "device": "LON-DC1",
        "console": "DNS Manager",
        "entity": "records",
        "key": "www.contoso.com",
        "sourceScene": "os1-lesson-14-scene-04",
        "menu": "New Host (A or AAAA)"
      },
      {
        "id": "hints",
        "scene": 5,
        "title": "Server Properties → Root Hints / Forwarders",
        "op": "view",
        "values": {},
        "device": "LON-DC1",
        "console": "DNS Manager",
        "entity": "dnsSettings",
        "key": "LON-DC1",
        "expected": {},
        "sourceScene": "os1-lesson-14-scene-05",
        "menu": "Server Properties → Root Hints / Forwarders"
      },
      {
        "id": "Get-DnsServerRootHint",
        "scene": 5,
        "title": "Get-DnsServerRootHint",
        "op": "dns-command",
        "values": {
          "command": "Get-DnsServerRootHint"
        },
        "device": "LON-DC1",
        "console": "Windows PowerShell",
        "sourceScene": "os1-lesson-14-scene-05",
        "menu": "Get-DnsServerRootHint"
      },
      {
        "id": "Get-DnsServerForwarder",
        "scene": 5,
        "title": "Get-DnsServerForwarder",
        "op": "dns-command",
        "values": {
          "command": "Get-DnsServerForwarder"
        },
        "device": "LON-DC1",
        "console": "Windows PowerShell",
        "sourceScene": "os1-lesson-14-scene-05",
        "menu": "Get-DnsServerForwarder"
      },
      {
        "id": "dns-role",
        "scene": 6,
        "title": "Add Roles → DNS Server",
        "op": "put",
        "values": {
          "dns": true
        },
        "device": "LON-SVR1",
        "console": "Server Manager",
        "entity": "servers",
        "key": "LON-SVR1",
        "update": true,
        "sourceScene": "os1-lesson-14-scene-06",
        "menu": "Add Roles → DNS Server"
      },
      {
        "id": "replicate",
        "scene": 7,
        "title": "NTDS Settings → Connection → Replicate Now",
        "op": "replicate",
        "values": {
          "from": "LON-DC1",
          "to": "LON-SVR1"
        },
        "device": "LON-DC1",
        "console": "Active Directory Sites and Services",
        "sourceScene": "os1-lesson-14-scene-07",
        "menu": "NTDS Settings → Connection → Replicate Now"
      },
      {
        "id": "destination",
        "scene": 7,
        "title": "SVR1 → Forward Lookup Zones",
        "op": "view",
        "values": {},
        "device": "LON-SVR1",
        "console": "DNS Manager",
        "entity": "dnsCopies",
        "key": "LON-SVR1",
        "expected": {},
        "sourceScene": "os1-lesson-14-scene-07",
        "menu": "SVR1 → Forward Lookup Zones"
      },
      {
        "id": "core-record",
        "scene": 8,
        "title": "Adatum.com → New Host",
        "op": "put",
        "values": {
          "name": "LON-CORE",
          "zone": "Adatum.com",
          "ip": "172.16.0.111",
          "type": "A"
        },
        "device": "LON-DC1",
        "console": "DNS Manager",
        "entity": "records",
        "key": "LON-CORE.Adatum.com",
        "sourceScene": "os1-lesson-14-scene-08",
        "menu": "Adatum.com → New Host"
      },
      {
        "id": "replicate-record",
        "scene": 8,
        "title": "Replicate Now",
        "op": "replicate",
        "values": {
          "from": "LON-DC1",
          "to": "LON-SVR1"
        },
        "device": "LON-DC1",
        "console": "Active Directory Sites and Services",
        "sourceScene": "os1-lesson-14-scene-08",
        "menu": "Replicate Now"
      },
      {
        "id": "compare",
        "scene": 8,
        "title": "Refresh DNS on SVR1",
        "op": "view",
        "values": {},
        "device": "LON-SVR1",
        "console": "DNS Manager",
        "entity": "dnsCopies",
        "key": "LON-SVR1",
        "expected": {
          "hasCore": true,
          "hasFileZone": false
        },
        "sourceScene": "os1-lesson-14-scene-08",
        "menu": "Refresh DNS on SVR1"
      }
    ],
    "sources": [
      {
        "id": "os1-lesson-14-scene-01",
        "title": "متطلبات الخادم الثاني في المختبر",
        "video": "/assets/os1/os1-lesson-14/01.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-14/01.jpg",
        "seconds": 96.0,
        "steps": [
          "يفترض هذا المختبر أن LON-DC1 يعمل في Adatum.com وأن LON-SVR1 متصل بالمجال بعنوانه الثابت ويستخدم DC1 في DNS.",
          "التحضير المعروض يضيف AD DS إلى SVR1 ثم يختار Promote this server to a domain controller → Add a domain controller to an existing domain: Adatum.com بحساب إدارة المجال.",
          "في خيارات الترقية لا تثبّت DNS في هذه المرحلة من تمرين المدرس؛ سيضيفه لاحقًا ليراقب النسخ. اضبط كلمة مرور DSRM المطلوبة في المختبر وتابع فحوص المعالج حتى Install وإعادة التشغيل.",
          "راجع اسم الجهاز وحالة انضمامه وترقيته قبل التكرار. شرح الترقية التفصيلي موجود في درس AD DS السابق؛ هذه متطلبات هذا التسجيل وليست إعادة إنشاء مجال جديد."
        ],
        "notes": [
          "هذه تهيئة خاصة بالتمرين لإظهار أثر تثبيت DNS والنسخ؛ ليست توصية بإلغاء DNS في كل عملية ترقية."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-14-scene-02",
        "title": "Forward Lookup وReverse Lookup",
        "video": "/assets/os1/os1-lesson-14/02.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-14/02.jpg",
        "seconds": 121.0,
        "steps": [
          "على LON-DC1 افتح Server Manager → Tools → DNS، ثم وسّع اسم الخادم.",
          "افتح Forward Lookup Zones لقراءة السجلات التي تربط الاسم بعنوان IP، وReverse Lookup Zones لقراءة الربط العكسي عندما توجد منطقة عكسية وسجلات PTR.",
          "افتح Adatum.com وراجع السجلات الموجودة قبل إنشاء منطقة أخرى. لا تنشئ Reverse zone لمجرد شرح الفرق؛ لا ينفذ التسجيل هنا معالجًا كاملًا لها."
        ],
        "notes": [
          "DNS: Domain Name System، نظام يربط الأسماء ببيانات مثل العناوين. يتعثر الشرح الشفهي في اتجاه التحويل؛ الاتجاهان موضحان هنا بدقة."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-14-scene-03",
        "title": "إنشاء Primary zone",
        "video": "/assets/os1/os1-lesson-14/03.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-14/03.jpg",
        "seconds": 61.0,
        "steps": [
          "اضغط باليمين على Forward Lookup Zones → New Zone → Next.",
          "اختر Primary zone. لإنشاء منطقة الاختبار المستقلة في هذا الدرس أزل Store the zone in Active Directory؛ ستُحفظ في ملف بدل دمجها في AD.",
          "اكتب contoso.com، وتابع باسم ملف المنطقة المقترح، ثم اختر Do not allow dynamic updates في هذا المثال المستقل → Next → Finish.",
          "بعد الإنشاء افتح خصائص المنطقة وتحقق من نوعها وتخزينها؛ هذا هو الفرق الذي سيظهر في اختبار النسخ لاحقًا."
        ],
        "notes": [
          "المصدر يلغي حفظ هذه المنطقة في AD؛ لذلك لا تنتقل عبر نسخ AD مثل المنطقة المدمجة فيه. Secondary نسخة للقراءة؛ لا تخلطها بمنطقة Primary."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-14-scene-04",
        "title": "إضافة Host record ومراجعة الاسم الكامل",
        "video": "/assets/os1/os1-lesson-14/04.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-14/04.jpg",
        "seconds": 91.0,
        "steps": [
          "اضغط باليمين على منطقة contoso.com → New Host (A or AAAA).",
          "اكتب Name: www، وIP address: 172.16.0.100 وفق صفحة تمرين المختبر الظاهرة.",
          "راجع أن Fully qualified domain name أصبح www.contoso.com، ثم Add Host → OK → Done.",
          "تأكد من ظهور سجل A بالقيمة الصحيحة. إضافة سجل DNS لا تنشئ موقع ويب ولا تثبت أن خدمة الويب تعمل على ذلك العنوان."
        ],
        "notes": [
          "A يربط الاسم بعنوان IPv4، وAAAA بعنوان IPv6. مثال المصدر يضيف www إلى contoso.com."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-14-scene-05",
        "title": "قراءة Root Hints وForwarders",
        "video": "/assets/os1/os1-lesson-14/05.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-14/05.jpg",
        "seconds": 66.0,
        "steps": [
          "افتح خصائص خادم DNS واقرأ تبويب Root Hints ثم Forwarders.",
          "Root Hints قائمة خوادم الجذر المستخدمة لبدء حل الأسماء عند الحاجة؛ Forwarders خوادم يرسل إليها الخادم استعلامات لا يستطيع حلها محليًا وفق إعداده.",
          "لقراءتهما من PowerShell على خادم DNS:",
          "Get-DnsServerRootHint",
          "Get-DnsServerForwarder",
          "قارن المخرجات بالواجهة. أوامر Get هنا للقراءة؛ لا تستبدل عناوين DNS العاملة بقيم عشوائية."
        ],
        "notes": [
          "الكتاب يعرض أيضًا Get-DnsServerRootHint وGet-DnsServerForwarder للقراءة؛ المقصود فحص الإعداد لا تغييره عشوائيًا."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-14-scene-06",
        "title": "تثبيت DNS على الخادم الإضافي",
        "video": "/assets/os1/os1-lesson-14/06.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-14/06.jpg",
        "seconds": 110.0,
        "steps": [
          "على LON-SVR1 افتح Server Manager → Add Roles and Features → Role-based installation → اختر SVR1.",
          "حدد DNS Server → Add Features ثم Next → Install وانتظر اكتماله.",
          "افتح Tools → DNS على SVR1 وراجع Forward Lookup Zones. التثبيت وحده لا يثبت وصول نسخة مناطق AD؛ تحقق من النتيجة بعد النسخ."
        ],
        "notes": [
          "وجود DNS على خادمين لا يعني نسخ كل المناطق بينهما تلقائيًا."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-14-scene-07",
        "title": "مراجعة اتجاه النسخ المتماثل",
        "video": "/assets/os1/os1-lesson-14/07.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-14/07.jpg",
        "seconds": 101.0,
        "steps": [
          "على DC1 افتح Active Directory Sites and Services → Sites → Default-First-Site-Name → Servers → LON-SVR1 → NTDS Settings.",
          "اختر Connection الذي يوضح From Server: LON-DC1، ثم باليمين → Replicate Now، وتحقق من رسالة العملية.",
          "على SVR1 حدّث DNS → Forward Lookup Zones. المنطقة Adatum.com المدمجة في AD يمكن أن تصل بالنسخ؛ contoso.com المحفوظة في ملف لا تنتقل بهذه الآلية.",
          "راجع اتجاه From Server والوجهة بدل اختيار أي اتصال عشوائي؛ ظهور منطقتين مختلفتين لا يعني خطأً في النسخ."
        ],
        "notes": [
          "Replication نسخ تغييرات الدليل بين الخوادم؛ اتجاه العملية ومكان تخزين المنطقة يحددان ما تتوقع ظهوره."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-14-scene-08",
        "title": "سجل جديد والتحقق على الخادم الآخر",
        "video": "/assets/os1/os1-lesson-14/08.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-14/08.jpg",
        "seconds": 113.0,
        "steps": [
          "في منطقة Adatum.com على خادم المصدر أنشئ New Host باسم LON-CORE وعنوان 172.16.0.111 كما في العرض.",
          "اضغط Add Host وراجع السجل في المنطقة الصحيحة، ثم نفّذ Replicate Now على اتصال الوجهة المطلوب عند الحاجة وحدّث DNS على الخادم الآخر.",
          "قارن الاسم والنوع A والعنوان في الخادمين. لا تنشئ السجل يدويًا في الوجهة ثم تعتبر وجوده دليل نسخ.",
          "هذا اختبار لانتقال السجل؛ اختبار الوصول إلى الجهاز أو خدمته خطوة منفصلة."
        ],
        "notes": [
          "ظهور السجل على الخادم الآخر يختبر النسخ في المثال. لا يعرض هذا المقطع اختبار استعلام من عميل مستقل."
        ],
        "warnings": []
      }
    ],
    "sceneCoverage": [
      {
        "scene": "os1-lesson-14-scene-01",
        "actions": [
          "replica"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-14-scene-02",
        "actions": [
          "zones"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-14-scene-03",
        "actions": [
          "primary"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-14-scene-04",
        "actions": [
          "www"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-14-scene-05",
        "actions": [
          "hints",
          "Get-DnsServerRootHint",
          "Get-DnsServerForwarder"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-14-scene-06",
        "actions": [
          "dns-role"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-14-scene-07",
        "actions": [
          "replicate",
          "destination"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-14-scene-08",
        "actions": [
          "core-record",
          "replicate-record",
          "compare"
        ],
        "role": "procedure-or-context"
      }
    ]
  },
  {
    "id": "course-15",
    "lesson": 15,
    "scene": 1,
    "title": "Module 9 · Exercises 1–2 · إدارة التخزين المحلي",
    "subtitle": "Disk Management",
    "kind": "curriculum",
    "console": "Disk Management",
    "host": "LON-SVR1",
    "why": "تهيئة أقراص المختبر وإنشاء وحدات التخزين وتغيير أحجامها، ثم مقارنة Spanned وStriped وMirrored وRAID-5.",
    "question": "أنشأت Mirrored بحجم1024MB على كل قرص. كم السعة المتاحة للبيانات؟",
    "options": [
      "1024MB؛ القرص الثاني يحمل نسخة من البيانات.",
      "2048MB؛ تُجمع سعتا القرصين.",
      "512MB؛ نصف حجم أصغر قرص."
    ],
    "answer": 0,
    "explain": "1024MB؛ القرص الثاني يحمل نسخة من البيانات. نتيجة المحاكاة تخص هذه المحاولة، ولا تثبت تنفيذًا على Windows فعلي.",
    "hint": "راجع الجهاز والحساب والنتيجة الفعلية في لوحة الحالة. تعديل الإعداد يختلف عن فحص أثره.",
    "reveal": "افتح العملية من الأداة، ثم راجع خطوات المصدر والقيم المطلوبة. أدخلها بنفسك، طبّق الإعداد ثم افتح عملية التحقق المرتبطة.",
    "actions": [
      {
        "id": "disk2",
        "scene": 1,
        "title": "Disk 2 → Online / Initialize",
        "op": "put",
        "values": {
          "online": true,
          "style": "GPT",
          "dynamic": false
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "entity": "disks",
        "key": "2",
        "sourceScene": "os1-lesson-15-scene-01",
        "menu": "Disk 2 → Online / Initialize"
      },
      {
        "id": "Volume1",
        "scene": 2,
        "title": "New Simple Volume",
        "op": "volume",
        "values": {
          "name": "Volume1",
          "type": "Simple",
          "disks": "2",
          "sizes": "4096",
          "filesystem": "NTFS",
          "letter": "F",
          "quick": true
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "sourceScene": "os1-lesson-15-scene-02",
        "menu": "New Simple Volume"
      },
      {
        "id": "Volume2",
        "scene": 3,
        "title": "New Simple Volume",
        "op": "volume",
        "values": {
          "name": "Volume2",
          "type": "Simple",
          "disks": "2",
          "sizes": "5120",
          "filesystem": "ReFS",
          "letter": "G",
          "quick": true
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "sourceScene": "os1-lesson-15-scene-03",
        "menu": "New Simple Volume"
      },
      {
        "id": "shrink",
        "scene": 4,
        "title": "Volume1 → Shrink Volume",
        "op": "resize",
        "values": {
          "name": "Volume1",
          "mode": "Shrink",
          "amount": 1024
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "sourceScene": "os1-lesson-15-scene-04",
        "menu": "Volume1 → Shrink Volume"
      },
      {
        "id": "extend",
        "scene": 4,
        "title": "Volume2 → Extend Volume",
        "op": "resize",
        "values": {
          "name": "Volume2",
          "mode": "Extend",
          "amount": 1024
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "sourceScene": "os1-lesson-15-scene-04",
        "menu": "Volume2 → Extend Volume"
      },
      {
        "id": "disk3",
        "scene": 5,
        "title": "Disk 3 → Online / Initialize",
        "op": "put",
        "values": {
          "online": true,
          "style": "GPT",
          "dynamic": true
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "entity": "disks",
        "key": "3",
        "sourceScene": "os1-lesson-15-scene-05",
        "menu": "Disk 3 → Online / Initialize"
      },
      {
        "id": "disk4",
        "scene": 5,
        "title": "Disk 4 → Online / Initialize",
        "op": "put",
        "values": {
          "online": true,
          "style": "GPT",
          "dynamic": true
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "entity": "disks",
        "key": "4",
        "sourceScene": "os1-lesson-15-scene-05",
        "menu": "Disk 4 → Online / Initialize"
      },
      {
        "id": "disk5",
        "scene": 5,
        "title": "Disk 5 → Online / Initialize",
        "op": "put",
        "values": {
          "online": true,
          "style": "GPT",
          "dynamic": true
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "entity": "disks",
        "key": "5",
        "sourceScene": "os1-lesson-15-scene-05",
        "menu": "Disk 5 → Online / Initialize"
      },
      {
        "id": "Spanned",
        "scene": 6,
        "title": "New Spanned Volume",
        "op": "volume",
        "values": {
          "name": "Spanned",
          "type": "Spanned",
          "disks": "3,4,5",
          "sizes": "2048,1024,4096",
          "filesystem": "NTFS",
          "letter": "H",
          "quick": true
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "sourceScene": "os1-lesson-15-scene-06",
        "menu": "New Spanned Volume"
      },
      {
        "id": "Striped",
        "scene": 7,
        "title": "New Striped Volume",
        "op": "volume",
        "values": {
          "name": "Striped",
          "type": "Striped",
          "disks": "3,4,5",
          "sizes": "3072,3072,3072",
          "filesystem": "NTFS",
          "letter": "I",
          "quick": true
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "sourceScene": "os1-lesson-15-scene-07",
        "menu": "New Striped Volume"
      },
      {
        "id": "Mirror",
        "scene": 8,
        "title": "New Mirrored Volume",
        "op": "volume",
        "values": {
          "name": "Mirror",
          "type": "Mirrored",
          "disks": "3,4",
          "sizes": "1024,1024",
          "filesystem": "NTFS",
          "letter": "J",
          "quick": true
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "sourceScene": "os1-lesson-15-scene-08",
        "menu": "New Mirrored Volume"
      },
      {
        "id": "Mirror-sync",
        "scene": 8,
        "title": "Refresh — Resynching → Healthy",
        "op": "sync",
        "values": {
          "name": "Mirror"
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "sourceScene": "os1-lesson-15-scene-08",
        "menu": "Refresh — Resynching → Healthy"
      },
      {
        "id": "file",
        "scene": 8,
        "title": "File Explorer → New / Open text document",
        "op": "volume-file",
        "values": {
          "volume": "Mirror",
          "name": "test.txt",
          "text": "Lab data"
        },
        "device": "LON-SVR1",
        "console": "File Explorer",
        "sourceScene": "os1-lesson-15-scene-08",
        "menu": "File Explorer → New / Open text document"
      },
      {
        "id": "mirror-Break",
        "scene": 9,
        "title": "Break Mirror",
        "op": "mirror",
        "values": {
          "name": "Mirror",
          "mode": "Break",
          "disk": "4",
          "confirm": true
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "sourceScene": "os1-lesson-15-scene-09",
        "menu": "Break Mirror"
      },
      {
        "id": "mirror-Delete detached",
        "scene": 9,
        "title": "Delete detached Mirror",
        "op": "mirror",
        "values": {
          "name": "Mirror",
          "mode": "Delete detached",
          "disk": "4",
          "confirm": true
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "sourceScene": "os1-lesson-15-scene-09",
        "menu": "Delete detached Mirror"
      },
      {
        "id": "mirror-Add",
        "scene": 9,
        "title": "Add Mirror",
        "op": "mirror",
        "values": {
          "name": "Mirror",
          "mode": "Add",
          "disk": "4",
          "confirm": true
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "sourceScene": "os1-lesson-15-scene-09",
        "menu": "Add Mirror"
      },
      {
        "id": "mirror-Remove",
        "scene": 9,
        "title": "Remove Mirror",
        "op": "mirror",
        "values": {
          "name": "Mirror",
          "mode": "Remove",
          "disk": "4",
          "confirm": true
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "sourceScene": "os1-lesson-15-scene-09",
        "menu": "Remove Mirror"
      },
      {
        "id": "mirror-Add again",
        "scene": 9,
        "title": "Add again Mirror",
        "op": "mirror",
        "values": {
          "name": "Mirror",
          "mode": "Add again",
          "disk": "4",
          "confirm": true
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "sourceScene": "os1-lesson-15-scene-09",
        "menu": "Add again Mirror"
      },
      {
        "id": "resync",
        "scene": 9,
        "title": "Refresh Mirror",
        "op": "sync",
        "values": {
          "name": "Mirror"
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "sourceScene": "os1-lesson-15-scene-09",
        "menu": "Refresh Mirror"
      },
      {
        "id": "Parity",
        "scene": 10,
        "title": "New RAID-5 Volume",
        "op": "volume",
        "values": {
          "name": "Parity",
          "type": "RAID-5",
          "disks": "3,4,5",
          "sizes": "4096,4096,4096",
          "filesystem": "NTFS",
          "letter": "K",
          "quick": true
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "sourceScene": "os1-lesson-15-scene-10",
        "menu": "New RAID-5 Volume"
      },
      {
        "id": "Parity-sync",
        "scene": 10,
        "title": "Refresh — Resynching → Healthy",
        "op": "sync",
        "values": {
          "name": "Parity"
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "sourceScene": "os1-lesson-15-scene-10",
        "menu": "Refresh — Resynching → Healthy"
      },
      {
        "id": "volumes",
        "scene": 10,
        "title": "Volumes — Capacity / Type / Status",
        "op": "view",
        "values": {},
        "device": "LON-SVR1",
        "console": "Disk Management",
        "entity": "volumes",
        "key": "Mirror",
        "expected": {
          "healthy": true,
          "file": "Lab data"
        },
        "sourceScene": "os1-lesson-15-scene-10",
        "menu": "Volumes — Capacity / Type / Status"
      }
    ],
    "sources": [
      {
        "id": "os1-lesson-15-scene-01",
        "title": "قراءة القرص وتهيئته في Disk Management",
        "video": "/assets/os1/os1-lesson-15/01.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-15/01.jpg",
        "seconds": 102.0,
        "steps": [
          "على LON-SVR1 افتح Server Manager → Tools → Computer Management → Storage → Disk Management.",
          "حدد Disk 2 الخاص بالمختبر من رقمه وسعته. لا تعمل على Disk 0 الذي يحمل النظام أو قرص Allfiles.",
          "إذا كان Offline فاضغط باليمين على مربع اسم القرص → Online؛ ثم Initialize Disk، واختر GPT → OK.",
          "تحقق من Online وUnallocated قبل إنشاء الوحدات. التهيئة والتهيئة بنظام ملفات عمليتان مختلفتان، ولا تطبقهما على قرص يحتوي بيانات تريد الاحتفاظ بها."
        ],
        "notes": [
          "الأرقام والأحرف تخص أجهزة المختبر؛ لا تختَر قرصًا حقيقيًا بالاعتماد على تشابه رقمه فقط."
        ],
        "warnings": [
          "التهيئة والحذف والتنسيق قد تفقد البيانات؛ التطبيق هنا على أقراص المختبر المخصصة."
        ]
      },
      {
        "id": "os1-lesson-15-scene-02",
        "title": "إنشاء Simple volume",
        "video": "/assets/os1/os1-lesson-15/02.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-15/02.jpg",
        "seconds": 106.0,
        "steps": [
          "اضغط باليمين على مساحة Unallocated في Disk 2 → New Simple Volume → Next.",
          "أدخل الحجم 4096 MB كما ينفذه المدرس؛ كتاب المختبر الظاهر يطلب 4000 MB. اتبع نسخة التكليف نفسها عند حساب الأحجام اللاحقة.",
          "اختر الحرف F إذا كان متاحًا كما في المختبر، ثم File system: NTFS، وAllocation unit size: Default، وVolume label: Volume1.",
          "اترك Quick format وفق المعالج ثم Next → Finish. انتظر Healthy وتحقق من الاسم والحرف والحجم."
        ],
        "notes": [
          "GPT أسلوب تقسيم القرص؛ NTFS وReFS نظاما ملفات. هذه اختيارات على مستويات مختلفة."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-15-scene-03",
        "title": "الوحدة الثانية ونظام الملفات",
        "video": "/assets/os1/os1-lesson-15/03.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-15/03.jpg",
        "seconds": 85.0,
        "steps": [
          "على المساحة غير المخصصة الباقية من Disk 2 اختر New Simple Volume.",
          "أدخل 5120 MB في تطبيق المدرس، مقابل 5000 MB في كتاب المختبر.",
          "اختر الحرف G كما في العرض، وFile system: ReFS، وVolume label: Volume2، ثم Next → Finish.",
          "تحقق من ظهور Volume1 (F:) بنظام NTFS وVolume2 (G:) بنظام ReFS؛ في تطبيق المدرس تظهر السعتان 4 و5 GB."
        ],
        "notes": [
          "المختبر يقارن NTFS وReFS. لا تفترض توفر كل عمليات تغيير الحجم لكليهما في كل إصدار."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-15-scene-04",
        "title": "تقليص وحدة التخزين وتوسيعها",
        "video": "/assets/os1/os1-lesson-15/04.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-15/04.jpg",
        "seconds": 145.0,
        "steps": [
          "اضغط باليمين على Volume1 → Shrink Volume. انتظر حساب المساحة المتاحة، ثم أدخل 1024 MB في مقدار التقليص → Shrink.",
          "تحقق أن حجمها أصبح 3072 MB إذا بدأت بـ4096، وأن المساحة المحررة أصبحت Unallocated. لا تكتب الحجم النهائي بدل مقدار التقليص.",
          "لتوسيع Volume2 اضغط باليمين عليها → Extend Volume → Next، وحدد 1024 MB إضافية من المساحة المتاحة → Next → Finish.",
          "في تطبيق المدرس تصبح Volume2 بسعة 6144 MB. التوسيع هنا يستخدم مساحة مناسبة بعد الوحدة على القرص؛ وجود مساحة حرة في مكان آخر لا يضمن إتاحة الأمر."
        ],
        "notes": [
          "Shrink يقلص الوحدة؛ لا يعادل حذفها. مقدار التقليص قد يقيده موضع البيانات ونظام الملفات."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-15-scene-05",
        "title": "إعداد الأقراص متعددة الوحدات",
        "video": "/assets/os1/os1-lesson-15/05.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-15/05.jpg",
        "seconds": 100.0,
        "steps": [
          "حدد أقراص المختبر Disk 3 وDisk 4 وDisk 5، واجعل كلًا منها Online.",
          "افتح Initialize Disk للأقراص الجديدة المطلوبة، وحدد GPT ثم OK، وراجع أن المساحات المستخدمة في التمرين Unallocated.",
          "الوحدات Spanned وStriped وMirrored وRAID-5 في هذا الدرس تستخدم Dynamic disks. عند رسالة التحويل راجع أرقام الأقراص المختارة ثم وافق على أقراص المختبر فقط.",
          "لا تحذف وحدات سابقة لتوفير مساحة إلا إن كانت وحدات التجربة المصرح بإعادة إنشائها؛ سجّل أحجام المساحات المتاحة قبل المعالج."
        ],
        "notes": [
          "Dynamic نوع إدارة للأقراص يتيح وحدات متعددة الأقراص في هذا المختبر القديم."
        ],
        "warnings": [
          "لا تحوّل أقراص النظام أو البيانات الشخصية لمجرد تجربة الخيارات؛ الرجوع قد يتطلب نقل البيانات وحذف وحدات."
        ]
      },
      {
        "id": "os1-lesson-15-scene-06",
        "title": "إنشاء Spanned volume وتصحيح السعة",
        "video": "/assets/os1/os1-lesson-15/06.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-15/06.jpg",
        "seconds": 84.0,
        "steps": [
          "اضغط باليمين على Unallocated في أحد أقراص التجربة → New Spanned Volume → Next.",
          "في Select Disks أضف الأقراص المطلوبة بزر Add، وحدد مساحة كل قرص على حدة. بعد تصحيح المدرس للسعة تصبح الأجزاء 2048 و1024 و4096 MB، ومجموعها 7168 MB.",
          "راجع Total volume size قبل Next؛ تحديد قرص جديد قد يغيّر القيمة المعروضة، فلا تفترض أن كتابة حجم مرة واحدة تضبط الجميع.",
          "اختر حرفًا متاحًا واسمًا واضحًا، ثم NTFS → Quick format → Next → Finish، وراجع رسالة التحويل إلى Dynamic.",
          "تحقق من ظهور أجزاء Spanned بلون واحد وسعة إجمالية تقارب 7 GB. هذا النوع يجمع السعات ولا يوفر نسخة احتياطية عند تعطل قرص."
        ],
        "notes": [
          "Spanned يجمع السعة عبر أقراص؛ لا يوفر تحمل تعطل قرص ولا يعادل RAID-0."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-15-scene-07",
        "title": "إنشاء Striped volume",
        "video": "/assets/os1/os1-lesson-15/07.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-15/07.jpg",
        "seconds": 138.0,
        "steps": [
          "من Unallocated اختر New Striped Volume → Next.",
          "أضف أقراص التجربة الثلاثة وحدد 3072 MB لكل قرص في هذا التطبيق؛ المساحة موزعة بأجزاء متساوية، والمجموع 9216 MB.",
          "تابع بالحرف المتاح وNTFS والاسم المطلوب ثم Finish، ووافق على Dynamic للأقراص المقصودة عند ظهور الرسالة.",
          "تحقق من نوع Striped وسعة 9 GB تقريبًا. زيادة عدد الأقراص هنا لا تعطي تحمل أعطال؛ لا تعتبرها مرآة."
        ],
        "notes": [
          "Striped يوزع البيانات على أقراص على هيئة شرائط ويقابل RAID-0؛ لا يوفر حماية من تعطل أحد الأقراص."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-15-scene-08",
        "title": "إنشاء Mirrored volume واختبار ملف",
        "video": "/assets/os1/os1-lesson-15/08.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-15/08.jpg",
        "seconds": 130.0,
        "steps": [
          "من مساحة Unallocated اختر New Mirrored Volume → Next.",
          "أضف قرصًا ثانيًا مختلفًا، وحدد 1024 MB لكل عضو؛ السعة المستخدمة للبيانات 1024 MB وليست مجموع العضوين.",
          "اختر حرفًا وNTFS واسم الوحدة ثم Finish، وانتظر اكتمال Resynching حتى Healthy.",
          "افتح حرف الوحدة من File Explorer وأنشئ ملف اختبار كما في الشرح ثم افتحه. ظهور ملف قابل للقراءة تحقق أساسي، وليس اختبارًا فعليًا لتعطل قرص."
        ],
        "notes": [
          "Mirrored يحتفظ بنسختين ويقابل RAID-1. إنشاء ملف لا يثبت أن تجربة تعطل قرص واستعادته اختُبرت."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-15-scene-09",
        "title": "فصل المرآة وإعادة إنشائها",
        "video": "/assets/os1/os1-lesson-15/09.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-15/09.jpg",
        "seconds": 79.0,
        "steps": [
          "راجع العضوين قبل استخدام أمر من أوامر المرآة. Break Mirrored Volume يفصل العضوين إلى وحدتين مستقلتين تحتفظان بالبيانات الموجودة وقت الفصل.",
          "Remove Mirror يطلب تحديد العضو الذي ستزيل نسخته؛ راجع القرص المحدد والتحذير قبل الموافقة. لا تخلط هذا الأمر مع Break.",
          "لإنشاء المرآة مجددًا اضغط باليمين على الوحدة المراد حمايتها → Add Mirror، واختر قرصًا آخر به مساحة غير مخصصة كافية.",
          "إن كان القرص الهدف Basic ويحتاج التحويل في هذا التمرين، حوّل قرص المختبر المقصود إلى Dynamic ثم أعد Add Mirror.",
          "انتظر المزامنة وتحقق من Healthy ووجود ملف الاختبار. لا تمسح العضوين معًا أثناء تجربة الفصل والإعادة."
        ],
        "notes": [
          "بعد Break Mirror تتوقف المزامنة بين الوحدتين؛ لا تفترض استمرار تطابق الملفات."
        ],
        "warnings": [
          "حذف طرف أو إعادة تكوين التخزين يؤثر في البيانات؛ ينفذ هنا على أقراص تجربة مخصصة."
        ]
      },
      {
        "id": "os1-lesson-15-scene-10",
        "title": "إنشاء RAID-5 ومتابعة المزامنة",
        "video": "/assets/os1/os1-lesson-15/10.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-15/10.jpg",
        "seconds": 155.0,
        "steps": [
          "من Unallocated اختر New RAID-5 Volume؛ أضف ثلاثة أقراص مختلفة على الأقل.",
          "في تطبيق المدرس استخدم 4096 MB من كل واحد من الأقراص الثلاثة؛ السعة المتاحة للبيانات 8192 MB لأن ما يعادل قرصًا يخصص لمعلومات Parity.",
          "اختر حرفًا متاحًا وNTFS واسمًا يميز RAID-5، ثم Finish ووافق على تحويل أقراص المختبر عند الحاجة.",
          "انتظر اكتمال التهيئة أو المزامنة وراجع Healthy والسعة. لا تختبر إزالة قرص على بيانات حقيقية، ولا تعتبر نجاح الإنشاء دليلًا على تنفيذ اختبار عطل؛ التسجيل لا يعرض اختبار عطل مكتملًا."
        ],
        "notes": [
          "RAID-5 يستخدم بيانات تكافؤ موزعة لتحمل تعطل قرص واحد عند سلامة بقية المجموعة."
        ],
        "warnings": [
          "RAID ليس نسخة احتياطية؛ لا يحمي من حذف الملفات أو كل أنواع التلف."
        ]
      }
    ],
    "note": "الأقراص المحاكية 2–5 مخصصة للمختبر. Disk 0 للنظام وDisk 1 لـAllfiles محميان. السعات تتبع عرض المدرس في هذا التسجيل، وليست قيم التسجيل الآخر أو الكتاب. السعة الكلية للأقراص افتراضية داخل المحاكاة؛ أحجام الوحدات هي قيم الدرس. اكتمال المزامنة محاكى، لا اختبار فشل قرص حقيقي.",
    "sceneCoverage": [
      {
        "scene": "os1-lesson-15-scene-01",
        "actions": [
          "disk2"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-15-scene-02",
        "actions": [
          "Volume1"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-15-scene-03",
        "actions": [
          "Volume2"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-15-scene-04",
        "actions": [
          "shrink",
          "extend"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-15-scene-05",
        "actions": [
          "disk3",
          "disk4",
          "disk5"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-15-scene-06",
        "actions": [
          "Spanned"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-15-scene-07",
        "actions": [
          "Striped"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-15-scene-08",
        "actions": [
          "Mirror",
          "Mirror-sync",
          "file"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-15-scene-09",
        "actions": [
          "mirror-Break",
          "mirror-Delete detached",
          "mirror-Add",
          "mirror-Remove",
          "mirror-Add again",
          "resync"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-15-scene-10",
        "actions": [
          "Parity",
          "Parity-sync",
          "volumes"
        ],
        "role": "procedure-or-context"
      }
    ]
  },
  {
    "id": "course-16",
    "lesson": 16,
    "scene": 1,
    "title": "Module 9 · مراجعة مكمّلة للتخزين المحلي وRAID",
    "subtitle": "Disk Management",
    "kind": "curriculum",
    "console": "Disk Management",
    "host": "LON-SVR1",
    "why": "تسجيل مستقل متداخل مع الدرس السابق، محفوظ كمراجعة إضافية بعد مقارنة محتواه؛ كلمة «يحذف» في اسم الأصل لا تثبت استبعاده.",
    "question": "RAID-5 من3أجزاء متساوية بحجم2048MB. كم سعة البيانات؟",
    "options": [
      "6144MB؛ مجموع الأجزاء دون حسم.",
      "2048MB؛ لا يستخدم سوى قرص واحد.",
      "4096MB؛ سعة جزء واحد مكافئة لمعلومات التكافؤ."
    ],
    "answer": 2,
    "explain": "4096MB؛ سعة جزء واحد مكافئة لمعلومات التكافؤ. نتيجة المحاكاة تخص هذه المحاولة، ولا تثبت تنفيذًا على Windows فعلي.",
    "hint": "راجع الجهاز والحساب والنتيجة الفعلية في لوحة الحالة. تعديل الإعداد يختلف عن فحص أثره.",
    "reveal": "افتح العملية من الأداة، ثم راجع خطوات المصدر والقيم المطلوبة. أدخلها بنفسك، طبّق الإعداد ثم افتح عملية التحقق المرتبطة.",
    "actions": [
      {
        "id": "disk2",
        "scene": 1,
        "title": "Disk 2 → Online / Initialize",
        "op": "put",
        "values": {
          "online": true,
          "style": "GPT",
          "dynamic": false
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "entity": "disks",
        "key": "2",
        "sourceScene": "os1-lesson-16-scene-01",
        "menu": "Disk 2 → Online / Initialize"
      },
      {
        "id": "disk3",
        "scene": 1,
        "title": "Disk 3 → Online / Initialize",
        "op": "put",
        "values": {
          "online": true,
          "style": "GPT",
          "dynamic": true
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "entity": "disks",
        "key": "3",
        "sourceScene": "os1-lesson-16-scene-01",
        "menu": "Disk 3 → Online / Initialize"
      },
      {
        "id": "disk4",
        "scene": 1,
        "title": "Disk 4 → Online / Initialize",
        "op": "put",
        "values": {
          "online": true,
          "style": "GPT",
          "dynamic": true
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "entity": "disks",
        "key": "4",
        "sourceScene": "os1-lesson-16-scene-01",
        "menu": "Disk 4 → Online / Initialize"
      },
      {
        "id": "disk5",
        "scene": 1,
        "title": "Disk 5 → Online / Initialize",
        "op": "put",
        "values": {
          "online": true,
          "style": "GPT",
          "dynamic": true
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "entity": "disks",
        "key": "5",
        "sourceScene": "os1-lesson-16-scene-01",
        "menu": "Disk 5 → Online / Initialize"
      },
      {
        "id": "Volume1",
        "scene": 1,
        "title": "New Simple Volume",
        "op": "volume",
        "values": {
          "name": "Volume1",
          "type": "Simple",
          "disks": "2",
          "sizes": "4096",
          "filesystem": "NTFS",
          "letter": "F",
          "quick": true
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "sourceScene": "os1-lesson-16-scene-01",
        "menu": "New Simple Volume"
      },
      {
        "id": "Volume2",
        "scene": 1,
        "title": "New Simple Volume",
        "op": "volume",
        "values": {
          "name": "Volume2",
          "type": "Simple",
          "disks": "2",
          "sizes": "5120",
          "filesystem": "ReFS",
          "letter": "G",
          "quick": true
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "sourceScene": "os1-lesson-16-scene-01",
        "menu": "New Simple Volume"
      },
      {
        "id": "shrink",
        "scene": 1,
        "title": "Volume1 → Shrink Volume",
        "op": "resize",
        "values": {
          "name": "Volume1",
          "mode": "Shrink",
          "amount": 1024
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "sourceScene": "os1-lesson-16-scene-01",
        "menu": "Volume1 → Shrink Volume"
      },
      {
        "id": "extend",
        "scene": 1,
        "title": "Volume2 → Extend Volume",
        "op": "resize",
        "values": {
          "name": "Volume2",
          "mode": "Extend",
          "amount": 1024
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "sourceScene": "os1-lesson-16-scene-01",
        "menu": "Volume2 → Extend Volume"
      },
      {
        "id": "Spanned",
        "scene": 2,
        "title": "New Spanned Volume",
        "op": "volume",
        "values": {
          "name": "Spanned",
          "type": "Spanned",
          "disks": "3,4,5",
          "sizes": "2048,2048,2048",
          "filesystem": "NTFS",
          "letter": "H",
          "quick": true
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "sourceScene": "os1-lesson-16-scene-02",
        "menu": "New Spanned Volume"
      },
      {
        "id": "Striped",
        "scene": 3,
        "title": "New Striped Volume",
        "op": "volume",
        "values": {
          "name": "Striped",
          "type": "Striped",
          "disks": "3,4,5",
          "sizes": "1024,1024,1024",
          "filesystem": "NTFS",
          "letter": "I",
          "quick": true
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "sourceScene": "os1-lesson-16-scene-03",
        "menu": "New Striped Volume"
      },
      {
        "id": "Mirror",
        "scene": 4,
        "title": "New Mirrored Volume",
        "op": "volume",
        "values": {
          "name": "Mirror",
          "type": "Mirrored",
          "disks": "3,4",
          "sizes": "3072,3072",
          "filesystem": "NTFS",
          "letter": "J",
          "quick": true
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "sourceScene": "os1-lesson-16-scene-04",
        "menu": "New Mirrored Volume"
      },
      {
        "id": "Mirror-sync",
        "scene": 4,
        "title": "Refresh — Resynching → Healthy",
        "op": "sync",
        "values": {
          "name": "Mirror"
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "sourceScene": "os1-lesson-16-scene-04",
        "menu": "Refresh — Resynching → Healthy"
      },
      {
        "id": "file",
        "scene": 4,
        "title": "File Explorer → New / Open text document",
        "op": "volume-file",
        "values": {
          "volume": "Mirror",
          "name": "test.txt",
          "text": "Lab data"
        },
        "device": "LON-SVR1",
        "console": "File Explorer",
        "sourceScene": "os1-lesson-16-scene-04",
        "menu": "File Explorer → New / Open text document"
      },
      {
        "id": "mirror-Break",
        "scene": 4,
        "title": "Break Mirror",
        "op": "mirror",
        "values": {
          "name": "Mirror",
          "mode": "Break",
          "disk": "4",
          "confirm": true
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "sourceScene": "os1-lesson-16-scene-04",
        "menu": "Break Mirror"
      },
      {
        "id": "mirror-Delete detached",
        "scene": 4,
        "title": "Delete detached Mirror",
        "op": "mirror",
        "values": {
          "name": "Mirror",
          "mode": "Delete detached",
          "disk": "4",
          "confirm": true
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "sourceScene": "os1-lesson-16-scene-04",
        "menu": "Delete detached Mirror"
      },
      {
        "id": "mirror-Add",
        "scene": 4,
        "title": "Add Mirror",
        "op": "mirror",
        "values": {
          "name": "Mirror",
          "mode": "Add",
          "disk": "4",
          "confirm": true
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "sourceScene": "os1-lesson-16-scene-04",
        "menu": "Add Mirror"
      },
      {
        "id": "mirror-Remove",
        "scene": 4,
        "title": "Remove Mirror",
        "op": "mirror",
        "values": {
          "name": "Mirror",
          "mode": "Remove",
          "disk": "4",
          "confirm": true
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "sourceScene": "os1-lesson-16-scene-04",
        "menu": "Remove Mirror"
      },
      {
        "id": "mirror-Add again",
        "scene": 4,
        "title": "Add again Mirror",
        "op": "mirror",
        "values": {
          "name": "Mirror",
          "mode": "Add again",
          "disk": "4",
          "confirm": true
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "sourceScene": "os1-lesson-16-scene-04",
        "menu": "Add again Mirror"
      },
      {
        "id": "resync",
        "scene": 4,
        "title": "Refresh Mirror",
        "op": "sync",
        "values": {
          "name": "Mirror"
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "sourceScene": "os1-lesson-16-scene-04",
        "menu": "Refresh Mirror"
      },
      {
        "id": "Parity",
        "scene": 5,
        "title": "New RAID-5 Volume",
        "op": "volume",
        "values": {
          "name": "Parity",
          "type": "RAID-5",
          "disks": "3,4,5",
          "sizes": "2048,2048,2048",
          "filesystem": "NTFS",
          "letter": "K",
          "quick": true
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "sourceScene": "os1-lesson-16-scene-05",
        "menu": "New RAID-5 Volume"
      },
      {
        "id": "Parity-sync",
        "scene": 5,
        "title": "Refresh — Resynching → Healthy",
        "op": "sync",
        "values": {
          "name": "Parity"
        },
        "device": "LON-SVR1",
        "console": "Disk Management",
        "sourceScene": "os1-lesson-16-scene-05",
        "menu": "Refresh — Resynching → Healthy"
      },
      {
        "id": "volumes",
        "scene": 6,
        "title": "Volumes — Capacity / Type / Status",
        "op": "view",
        "values": {},
        "device": "LON-SVR1",
        "console": "Disk Management",
        "entity": "volumes",
        "key": "Mirror",
        "expected": {
          "healthy": true,
          "file": "Lab data"
        },
        "sourceScene": "os1-lesson-16-scene-06",
        "menu": "Volumes — Capacity / Type / Status"
      }
    ],
    "sources": [
      {
        "id": "os1-lesson-16-scene-01",
        "title": "إنشاء الوحدات على أقراص المختبر",
        "video": "/assets/os1/os1-lesson-16/01.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-16/01.jpg",
        "seconds": 100.0,
        "steps": [
          "هذا تسجيل مكمل للتخزين، وليس ملفًا محذوفًا لمجرد وجود «يحذف» في اسمه. لا تعِد إنشاء وحدات موجودة من الدرس السابق دون مراجعة القرص.",
          "على SVR1 افتح Computer Management → Disk Management. طابق أرقام أقراص المختبر، ثم Online وInitialize Disk → GPT للأقراص الجديدة فقط.",
          "للوحدة البسيطة: Unallocated → New Simple Volume → الحجم المطلوب → حرف متاح → نظام الملفات واسم الوحدة → Finish.",
          "عند Shrink اكتب مقدار التقليص، وعند Extend اكتب المساحة المضافة؛ راجع الحجم النهائي والمساحة غير المخصصة. تفاصيل إنشاء Volume1 وVolume2 واختلاف قيم الكتاب موضحة في الدرس السابق."
        ],
        "notes": [
          "هذه مراجعة بتسجيل مختلف؛ لم يُحذف المصدر ولم يُعتبر بديلًا تلقائيًا للدرس الأساسي."
        ],
        "warnings": [
          "لا تهيئ أي قرص يحتوي بيانات مطلوبة."
        ]
      },
      {
        "id": "os1-lesson-16-scene-02",
        "title": "إنشاء Spanned volume عبر أقراص",
        "video": "/assets/os1/os1-lesson-16/02.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-16/02.jpg",
        "seconds": 89.0,
        "steps": [
          "من Unallocated اختر New Spanned Volume، وأضف أقراص التجربة الثلاثة في Select Disks.",
          "في هذه الإعادة يخصص المدرس 2048 MB من كل قرص، ليكون مجموع الوحدة 6144 MB؛ هذه قيم هذا التسجيل، وليست مثال 7168 MB في التسجيل السابق.",
          "راجع مجموع السعة، ثم اختر الحرف وNTFS واسمًا واضحًا → Finish، وراجع موافقة التحويل إلى Dynamic للأقراص الصحيحة.",
          "تحقق من ظهور الأجزاء الثلاثة كوحدة Spanned واحدة. فقد أحد أقراصها يعرّض بيانات الوحدة للفقد؛ لا حماية بالتكرار هنا."
        ],
        "notes": [
          "Spanned يجمع أجزاء من عدة أقراص في وحدة واحدة؛ لا يوفر تحمل تعطل قرص."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-16-scene-03",
        "title": "مراجعة Striped volume",
        "video": "/assets/os1/os1-lesson-16/03.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-16/03.jpg",
        "seconds": 100.0,
        "steps": [
          "اختر New Striped Volume من مساحة غير مخصصة، ثم أضف الأقراص الثلاثة.",
          "خصص 1024 MB من كل قرص في هذا التسجيل، ليكون الإجمالي 3072 MB؛ الأجزاء متساوية في Striped.",
          "أكمل الحرف ونظام NTFS والاسم → Finish، ثم تحقق من النوع والسعة.",
          "Striping يوزع البيانات عبر الأقراص، لكنه لا يوفر تحمل تعطل قرص. قارن بنوع Spanned الذي لا يشترط تساوي أحجام الأجزاء."
        ],
        "notes": [
          "Striped وSpanned كلاهما قد يستخدم عدة أقراص؛ طريقة توزيع البيانات مختلفة، وكلاهما دون حماية من تعطل قرص."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-16-scene-04",
        "title": "مراجعة Mirrored volume",
        "video": "/assets/os1/os1-lesson-16/04.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-16/04.jpg",
        "seconds": 70.0,
        "steps": [
          "اختر New Mirrored Volume وأضف قرصًا ثانيًا مختلفًا عن الأول.",
          "حدد 3072 MB لكل عضو كما في هذه الإعادة؛ السعة القابلة للاستخدام 3072 MB رغم استهلاكها من القرصين.",
          "أكمل الحرف وNTFS والاسم ثم Finish، وانتظر Resynching حتى Healthy قبل اعتبار إنشاء المرآة مكتملًا.",
          "راجع الفرق بين Break الذي ينتج نسختين مستقلتين، وRemove Mirror الذي يزيل عضوًا تختاره، وAdd Mirror الذي يعيد المزامنة مع قرص آخر."
        ],
        "notes": [
          "سعة المرآة القابلة للاستخدام ليست مجموع سعتي القرصين."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-16-scene-05",
        "title": "إعداد RAID-5",
        "video": "/assets/os1/os1-lesson-16/05.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-16/05.jpg",
        "seconds": 87.0,
        "steps": [
          "اختر New RAID-5 Volume وأضف ثلاثة أقراص مختلفة من أقراص المختبر.",
          "خصص 2048 MB لكل قرص في هذا التسجيل؛ سعة البيانات الناتجة 4096 MB، وليس 6144 MB.",
          "أكمل الحرف وNTFS والاسم ثم Finish، وراجع حالة المزامنة حتى Healthy.",
          "هذه إعادة بمقادير مختلفة عن RAID-5 في الدرس السابق. لا تطبق قيم التسجيلين على معالج واحد، ولا تعِد تهيئة قرص عليه بيانات تحتاجها."
        ],
        "notes": [
          "التسجيل يتخلله توقف وتواصل صفي؛ المقطع منتقى للخطوات المتعلقة بالتخزين."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-16-scene-06",
        "title": "مراجعة الفروق بين أنواع RAID",
        "video": "/assets/os1/os1-lesson-16/06.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-16/06.jpg",
        "seconds": 153.0,
        "steps": [
          "راجع نوع كل وحدة وسعتها وأقراصها في Disk Management، واربطها بما أنشأته فعليًا.",
          "Spanned يجمع مساحات قد تختلف، وStriped يوزع البيانات على أجزاء متساوية؛ كلاهما لا يتحمل فقد قرص من المجموعة.",
          "Mirrored يحتفظ بنسختين على قرصين بسعة عضو واحد، وRAID-5 يوزع Parity ويحتاج ثلاثة أقراص على الأقل، بسعة (عدد الأقراص − 1) × حجم الجزء المتساوي.",
          "لا تخلط تحمل عطل قرص مع النسخ الاحتياطي، ولا تسجل اختبار تعطل ناجحًا من شرح الأنواع وحده."
        ],
        "notes": [
          "المراجعة تعرض أيضًا مستويات أخرى على الشرائح؛ لا يعني ظهورها أنها طُبقت عمليًا في التسجيل."
        ],
        "warnings": [
          "استمرار العمل عند عطل قرص يحتاج اختبارًا مناسبًا ونسخة احتياطية مستقلة؛ لا يُستنتج من رسم RAID وحده."
        ]
      }
    ],
    "note": "الأقراص المحاكية 2–5 مخصصة للمختبر. Disk 0 للنظام وDisk 1 لـAllfiles محميان. السعات تتبع عرض المدرس في هذا التسجيل، وليست قيم التسجيل الآخر أو الكتاب. السعة الكلية للأقراص افتراضية داخل المحاكاة؛ أحجام الوحدات هي قيم الدرس. اكتمال المزامنة محاكى، لا اختبار فشل قرص حقيقي.",
    "sceneCoverage": [
      {
        "scene": "os1-lesson-16-scene-01",
        "actions": [
          "disk2",
          "disk3",
          "disk4",
          "disk5",
          "Volume1",
          "Volume2",
          "shrink",
          "extend"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-16-scene-02",
        "actions": [
          "Spanned"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-16-scene-03",
        "actions": [
          "Striped"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-16-scene-04",
        "actions": [
          "Mirror",
          "Mirror-sync",
          "file",
          "mirror-Break",
          "mirror-Delete detached",
          "mirror-Add",
          "mirror-Remove",
          "mirror-Add again",
          "resync"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-16-scene-05",
        "actions": [
          "Parity",
          "Parity-sync"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-16-scene-06",
        "actions": [
          "volumes"
        ],
        "role": "procedure-or-context"
      }
    ]
  },
  {
    "id": "course-17",
    "lesson": 17,
    "scene": 1,
    "title": "Module 10 · Exercise 1 · المجلدات المشتركة والأذونات",
    "subtitle": "File Explorer",
    "kind": "curriculum",
    "console": "File Explorer",
    "host": "LON-SVR1",
    "why": "تجهيز مجلدات الأقسام، ضبط أذونات NTFS والمشاركة، واختبار الوصول وإظهار المجلدات حسب صلاحية المستخدم.",
    "question": "إخفاء مجلد بـAccess-Based Enumeration يعني ماذا؟",
    "options": [
      "استبدال أذونات NTFS بأذونات الشاشة فقط.",
      "إخفاء ما لا يملك المستخدم صلاحية رؤيته؛ لا يمنحه صلاحية جديدة.",
      "منح المستخدم Full Control على جميع المجلدات."
    ],
    "answer": 1,
    "explain": "إخفاء ما لا يملك المستخدم صلاحية رؤيته؛ لا يمنحه صلاحية جديدة. نتيجة المحاكاة تخص هذه المحاولة، ولا تثبت تنفيذًا على Windows فعلي.",
    "hint": "راجع الجهاز والحساب والنتيجة الفعلية في لوحة الحالة. تعديل الإعداد يختلف عن فحص أثره.",
    "reveal": "افتح العملية من الأداة، ثم راجع خطوات المصدر والقيم المطلوبة. أدخلها بنفسك، طبّق الإعداد ثم افتح عملية التحقق المرتبطة.",
    "actions": [
      {
        "id": "data",
        "scene": 1,
        "title": "New Folder — Data",
        "op": "put",
        "values": {
          "path": "E:\\Data",
          "inheritance": false,
          "convert": true
        },
        "device": "LON-SVR1",
        "console": "File Explorer",
        "entity": "folders",
        "key": "Data",
        "sourceScene": "os1-lesson-17-scene-01",
        "menu": "New Folder — Data"
      },
      {
        "id": "folder-Development",
        "scene": 1,
        "title": "New Folder — Development",
        "op": "put",
        "values": {
          "path": "E:\\Data\\Development",
          "inheritance": true,
          "usersRead": true
        },
        "device": "LON-SVR1",
        "console": "File Explorer",
        "entity": "folders",
        "key": "Development",
        "sourceScene": "os1-lesson-17-scene-01",
        "menu": "New Folder — Development"
      },
      {
        "id": "folder-Marketing",
        "scene": 1,
        "title": "New Folder — Marketing",
        "op": "put",
        "values": {
          "path": "E:\\Data\\Marketing",
          "inheritance": true,
          "usersRead": true
        },
        "device": "LON-SVR1",
        "console": "File Explorer",
        "entity": "folders",
        "key": "Marketing",
        "sourceScene": "os1-lesson-17-scene-01",
        "menu": "New Folder — Marketing"
      },
      {
        "id": "folder-Research",
        "scene": 1,
        "title": "New Folder — Research",
        "op": "put",
        "values": {
          "path": "E:\\Data\\Research",
          "inheritance": true,
          "usersRead": true
        },
        "device": "LON-SVR1",
        "console": "File Explorer",
        "entity": "folders",
        "key": "Research",
        "sourceScene": "os1-lesson-17-scene-01",
        "menu": "New Folder — Research"
      },
      {
        "id": "folder-Sales",
        "scene": 1,
        "title": "New Folder — Sales",
        "op": "put",
        "values": {
          "path": "E:\\Data\\Sales",
          "inheritance": true,
          "usersRead": true
        },
        "device": "LON-SVR1",
        "console": "File Explorer",
        "entity": "folders",
        "key": "Sales",
        "sourceScene": "os1-lesson-17-scene-01",
        "menu": "New Folder — Sales"
      },
      {
        "id": "acl-Development",
        "scene": 2,
        "title": "Properties → Security → Advanced",
        "op": "put",
        "values": {
          "inheritance": false,
          "convert": true,
          "usersRead": false,
          "principal": "Development",
          "permission": "Modify",
          "system": true,
          "administrators": true,
          "creatorOwner": true
        },
        "device": "LON-SVR1",
        "console": "File Explorer",
        "entity": "folders",
        "key": "Development",
        "update": true,
        "sourceScene": "os1-lesson-17-scene-02",
        "menu": "Properties → Security → Advanced"
      },
      {
        "id": "acl-Marketing",
        "scene": 2,
        "title": "Properties → Security → Advanced",
        "op": "put",
        "values": {
          "inheritance": false,
          "convert": true,
          "usersRead": false,
          "principal": "Marketing",
          "permission": "Modify",
          "system": true,
          "administrators": true,
          "creatorOwner": true
        },
        "device": "LON-SVR1",
        "console": "File Explorer",
        "entity": "folders",
        "key": "Marketing",
        "update": true,
        "sourceScene": "os1-lesson-17-scene-02",
        "menu": "Properties → Security → Advanced"
      },
      {
        "id": "acl-Research",
        "scene": 2,
        "title": "Properties → Security → Advanced",
        "op": "put",
        "values": {
          "inheritance": false,
          "convert": true,
          "usersRead": false,
          "principal": "Research",
          "permission": "Modify",
          "system": true,
          "administrators": true,
          "creatorOwner": true
        },
        "device": "LON-SVR1",
        "console": "File Explorer",
        "entity": "folders",
        "key": "Research",
        "update": true,
        "sourceScene": "os1-lesson-17-scene-02",
        "menu": "Properties → Security → Advanced"
      },
      {
        "id": "acl-Sales",
        "scene": 2,
        "title": "Properties → Security → Advanced",
        "op": "put",
        "values": {
          "inheritance": false,
          "convert": true,
          "usersRead": false,
          "principal": "Sales",
          "permission": "Modify",
          "system": true,
          "administrators": true,
          "creatorOwner": true
        },
        "device": "LON-SVR1",
        "console": "File Explorer",
        "entity": "folders",
        "key": "Sales",
        "update": true,
        "sourceScene": "os1-lesson-17-scene-02",
        "menu": "Properties → Security → Advanced"
      },
      {
        "id": "check-Development",
        "scene": 3,
        "title": "Advanced Security Settings — Development",
        "op": "view",
        "values": {},
        "device": "LON-SVR1",
        "console": "File Explorer",
        "entity": "folders",
        "key": "Development",
        "expected": {
          "inheritance": false,
          "usersRead": false,
          "permission": "Modify"
        },
        "sourceScene": "os1-lesson-17-scene-03",
        "menu": "Advanced Security Settings — Development"
      },
      {
        "id": "check-Marketing",
        "scene": 3,
        "title": "Advanced Security Settings — Marketing",
        "op": "view",
        "values": {},
        "device": "LON-SVR1",
        "console": "File Explorer",
        "entity": "folders",
        "key": "Marketing",
        "expected": {
          "inheritance": false,
          "usersRead": false,
          "permission": "Modify"
        },
        "sourceScene": "os1-lesson-17-scene-03",
        "menu": "Advanced Security Settings — Marketing"
      },
      {
        "id": "check-Research",
        "scene": 3,
        "title": "Advanced Security Settings — Research",
        "op": "view",
        "values": {},
        "device": "LON-SVR1",
        "console": "File Explorer",
        "entity": "folders",
        "key": "Research",
        "expected": {
          "inheritance": false,
          "usersRead": false,
          "permission": "Modify"
        },
        "sourceScene": "os1-lesson-17-scene-03",
        "menu": "Advanced Security Settings — Research"
      },
      {
        "id": "check-Sales",
        "scene": 3,
        "title": "Advanced Security Settings — Sales",
        "op": "view",
        "values": {},
        "device": "LON-SVR1",
        "console": "File Explorer",
        "entity": "folders",
        "key": "Sales",
        "expected": {
          "inheritance": false,
          "usersRead": false,
          "permission": "Modify"
        },
        "sourceScene": "os1-lesson-17-scene-03",
        "menu": "Advanced Security Settings — Sales"
      },
      {
        "id": "share",
        "scene": 4,
        "title": "Advanced Sharing → Permissions",
        "op": "put",
        "values": {
          "path": "E:\\Data",
          "name": "Data",
          "enabled": true,
          "principal": "Authenticated Users",
          "permission": "Change / Read",
          "abe": false,
          "caching": "Manual"
        },
        "device": "LON-SVR1",
        "console": "File Explorer",
        "entity": "shares",
        "key": "Data",
        "sourceScene": "os1-lesson-17-scene-04",
        "menu": "Advanced Sharing → Permissions"
      },
      {
        "id": "login-Bernard-14",
        "scene": 5,
        "title": "Windows Security — Sign in",
        "op": "login",
        "values": {
          "account": "Bernard",
          "password": "Pa$$w0rd"
        },
        "device": "LON-CL1",
        "console": "Windows Security",
        "sourceScene": "os1-lesson-17-scene-05",
        "menu": "Windows Security — Sign in"
      },
      {
        "id": "access-Development",
        "scene": 5,
        "title": "Open \\\\LON-SVR1\\Data\\Development",
        "op": "file-access",
        "values": {
          "share": "Data",
          "folder": "Development"
        },
        "device": "LON-CL1",
        "console": "File Explorer",
        "actor": "Bernard",
        "expectedAllowed": true,
        "sourceScene": "os1-lesson-17-scene-05",
        "menu": "Open \\\\LON-SVR1\\Data\\Development"
      },
      {
        "id": "access-Marketing",
        "scene": 5,
        "title": "Open \\\\LON-SVR1\\Data\\Marketing",
        "op": "file-access",
        "values": {
          "share": "Data",
          "folder": "Marketing"
        },
        "device": "LON-CL1",
        "console": "File Explorer",
        "actor": "Bernard",
        "expectedAllowed": false,
        "sourceScene": "os1-lesson-17-scene-05",
        "menu": "Open \\\\LON-SVR1\\Data\\Marketing"
      },
      {
        "id": "abe",
        "scene": 6,
        "title": "File and Storage Services → Shares → Settings",
        "op": "put",
        "values": {
          "abe": true
        },
        "device": "LON-SVR1",
        "console": "Server Manager",
        "entity": "shares",
        "key": "Data",
        "update": true,
        "sourceScene": "os1-lesson-17-scene-06",
        "menu": "File and Storage Services → Shares → Settings"
      },
      {
        "id": "enumerate",
        "scene": 7,
        "title": "Refresh \\\\LON-SVR1\\Data",
        "op": "enumerate",
        "values": {
          "share": "Data"
        },
        "device": "LON-CL1",
        "console": "File Explorer",
        "actor": "Bernard",
        "sourceScene": "os1-lesson-17-scene-07",
        "menu": "Refresh \\\\LON-SVR1\\Data"
      },
      {
        "id": "offline",
        "scene": 7,
        "title": "Advanced Sharing → Caching",
        "op": "put",
        "values": {
          "caching": "None"
        },
        "device": "LON-SVR1",
        "console": "File Explorer",
        "entity": "shares",
        "key": "Data",
        "update": true,
        "sourceScene": "os1-lesson-17-scene-07",
        "menu": "Advanced Sharing → Caching"
      }
    ],
    "sources": [
      {
        "id": "os1-lesson-17-scene-01",
        "title": "خطة المجلدات والأذونات",
        "video": "/assets/os1/os1-lesson-17/01.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-17/01.jpg",
        "seconds": 110.0,
        "steps": [
          "على LON-SVR1 افتح E: وأنشئ المجلد Data، وداخله Development وMarketing وResearch وSales بالأسماء المطلوبة.",
          "راجع وجود مجموعات المجال المقابلة للأقسام قبل ضبط الأذونات؛ المجلد والمجموعة كائنان مختلفان.",
          "افتح Data → Properties → Security → Advanced → Disable inheritance → Convert inherited permissions into explicit permissions on this object، ثم OK.",
          "التحويل يحفظ الأذونات الحالية كأذونات صريحة؛ لا يعني حذفها. عالج أذونات المجلدات الفرعية كما في الخطوتين التاليتين قبل اختبار المشاركة."
        ],
        "notes": [
          "NTFS نظام ملفات يطبق أذونات على المجلدات والملفات؛ Share permissions أذونات الوصول إلى المشاركة عبر الشبكة."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-17-scene-02",
        "title": "إضافة مجموعة إلى أذونات المجلد",
        "video": "/assets/os1/os1-lesson-17/02.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-17/02.jpg",
        "seconds": 100.0,
        "steps": [
          "افتح Properties للمجلد Development → Security → Advanced. إذا كانت الأذونات موروثة فاختر Disable inheritance → Convert، ثم احذف إدخالي Users (LON-SVR1\\Users) المحددين في تمرين المختبر.",
          "أبقِ إدخالات SYSTEM وAdministrators وCREATOR OWNER المطلوبة؛ لا تستخدم Remove على جميع الأذونات.",
          "من Security → Edit → Add اكتب مجموعة Development في المجال Adatum.com، ثم Check Names → OK.",
          "حدد المجموعة وأعطها Allow: Modify، وراجع أن Read/Write اللازمة أصبحت محددة، ثم Apply → OK.",
          "كرر للمجلدات Marketing وResearch وSales مع مجموعتها المقابلة فقط؛ لا تمنح كل المجموعات صلاحية على كل مجلد."
        ],
        "notes": [
          "استخدم أسماء مجموعات المختبر كما هي؛ تشابه اسم مجلد مع مجموعة لا يمنحها الوصول تلقائيًا."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-17-scene-03",
        "title": "الوراثة والأذونات الصريحة",
        "video": "/assets/os1/os1-lesson-17/03.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-17/03.jpg",
        "seconds": 70.0,
        "steps": [
          "لكل مجلد قسم افتح Security → Advanced وراجع هل الإذن صريح أم موروث، ومن أي حاوية جاء.",
          "Disable inheritance على Data وحده لا يزيل تلقائيًا أذونات Users من مجلدات الأقسام؛ افصل الوراثة وحوّلها ثم أزل إدخالي Users المطلوبين في كل مجلد كما يعرض الكتاب.",
          "راجع مجموعة القسم بصلاحية Modify، مع بقاء إدارة النظام، ثم Apply وأغلق النوافذ.",
          "لا تضف Deny عامًا لتعويض الإعداد الناقص؛ اختبر بحساب عضو في المجموعة الصحيحة بعد إنهاء NTFS والمشاركة."
        ],
        "notes": [
          "Inheritance انتقال الأذونات من المجلد الأب؛ تعطيلها يحتاج مراجعة لما سيبقى على المجلد."
        ],
        "warnings": [
          "لا تحذف أذونات الإدارة أو SYSTEM دون مطلب واضح؛ قد تفقد القدرة على إدارة المجلد."
        ]
      },
      {
        "id": "os1-lesson-17-scene-04",
        "title": "إنشاء مشاركة Data",
        "video": "/assets/os1/os1-lesson-17/04.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-17/04.jpg",
        "seconds": 117.0,
        "steps": [
          "افتح Data → Properties → Sharing → Advanced Sharing، وفعّل Share this folder، وراجع Share name: Data.",
          "افتح Permissions → Add وأضف Authenticated Users، ثم Check Names → OK.",
          "أعطِ هذه المجموعة Allow: Change وRead ثم Apply → OK. تظهر Everyone أيضًا في عرض المدرس؛ لا تفترض أن إضافتك لمجموعة جديدة تحذف الإدخالات السابقة.",
          "أكمل OK لإغلاق Advanced Sharing. إذن المشاركة يسمح بالوصول الشبكي، وأذونات NTFS على مجلد كل قسم تحدد ما يستطيع المستخدم فتحه وتعديله.",
          "مسار المشاركة الذي سيستخدمه العميل:",
          "\\\\LON-SVR1\\Data"
        ],
        "notes": [
          "المصدر يستخدم Authenticated Users وChange في المشاركة؛ يبقى وصول كل مجلد محكومًا أيضًا بأذونات NTFS."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-17-scene-05",
        "title": "اختبار الوصول بحساب المستخدم",
        "video": "/assets/os1/os1-lesson-17/05.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-17/05.jpg",
        "seconds": 87.0,
        "steps": [
          "على LON-CL1 سجّل الدخول بحساب الاختبار Bernard في المجال، وتأكد من عضويته المطلوبة في Development قبل الحكم على الأذونات.",
          "افتح File Explorer واكتب مسار المشاركة:",
          "\\\\LON-SVR1\\Data",
          "افتح Development وتحقق من الوصول، وجرب فتح مجلد قسم لا يملك الحساب صلاحية عليه للتحقق من الرفض.",
          "في هذه المرحلة قد ترى أسماء المجلدات رغم رفض فتحها؛ رؤية الاسم ليست إذن قراءة المحتوى. لا تنفذ الاختبار بحساب Administrator لأنه لا يمثل صلاحيات المستخدم."
        ],
        "notes": [
          "اختبر بالحساب المقصود؛ نجاح فتح المجلد بحساب Administrator لا يثبت صحة أذونات المستخدم."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-17-scene-06",
        "title": "إعداد Access-based Enumeration",
        "video": "/assets/os1/os1-lesson-17/06.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-17/06.jpg",
        "seconds": 45.0,
        "steps": [
          "على SVR1 افتح Server Manager → File and Storage Services → Shares.",
          "اختر مشاركة Data → Properties → Settings، وفعّل Enable access-based enumeration ثم Apply → OK.",
          "هذه الخاصية تخفي عن مستخدم المشاركة العناصر التي لا يملك صلاحية الوصول إليها، لكنها لا تنشئ أذونات NTFS ولا تصلحها بدلًا عنك.",
          "ارجع إلى العميل وأعد فتح المشاركة؛ إذا احتجت تحديث جلسة الحساب فسجّل الخروج والدخول كما في العرض."
        ],
        "notes": [
          "Access-based enumeration إظهار الملفات والمجلدات التي تسمح أذونات المستخدم برؤيتها؛ لا يحل محل أذونات الحماية."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-17-scene-07",
        "title": "التحقق من ظهور المجلدات وخيار Offline Files",
        "video": "/assets/os1/os1-lesson-17/07.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-17/07.jpg",
        "seconds": 150.0,
        "steps": [
          "باستخدام حساب Bernard افتح المشاركة مجددًا وتحقق من ظهور Development وفق صلاحياته، ثم تحقق من فتحه. قارن ذلك باختبار ما قبل ABE.",
          "لإعداد Offline Files المطلوب في نهاية المختبر، على SVR1 افتح Data → Properties → Sharing → Advanced Sharing → Caching.",
          "اختر No files or programs from the shared folder are available offline، ثم OK → OK → Close.",
          "لا تترك Caching بالقيمة الافتراضية؛ التمرين يطلب منع إتاحة ملفات هذه المشاركة دون اتصال. هذا الإعداد منفصل عن إخفاء المجلدات بواسطة ABE."
        ],
        "notes": [
          "Offline Files نسخ محلية تسمح بالعمل دون اتصال. نهاية المصدر تتضمن قراءة تعليمات؛ لا نعد كل خطوة مذكورة تنفيذًا مرئيًا متحققًا."
        ],
        "warnings": []
      }
    ],
    "sceneCoverage": [
      {
        "scene": "os1-lesson-17-scene-01",
        "actions": [
          "data",
          "folder-Development",
          "folder-Marketing",
          "folder-Research",
          "folder-Sales"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-17-scene-02",
        "actions": [
          "acl-Development",
          "acl-Marketing",
          "acl-Research",
          "acl-Sales"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-17-scene-03",
        "actions": [
          "check-Development",
          "check-Marketing",
          "check-Research",
          "check-Sales"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-17-scene-04",
        "actions": [
          "share"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-17-scene-05",
        "actions": [
          "login-Bernard-14",
          "access-Development",
          "access-Marketing"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-17-scene-06",
        "actions": [
          "abe"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-17-scene-07",
        "actions": [
          "enumerate",
          "offline"
        ],
        "role": "procedure-or-context"
      }
    ]
  },
  {
    "id": "course-18",
    "lesson": 18,
    "scene": 1,
    "title": "Module 10 · Exercise 4 · خدمة الطباعة ومشاركة الطابعة",
    "subtitle": "Print Management",
    "kind": "curriculum",
    "console": "Print Management",
    "host": "LON-SVR1",
    "why": "تثبيت أدوات الطباعة وإضافة طابعة عبر TCP/IP ومشاركتها، ثم إعداد عدة منافذ واكتشاف الطابعة من العميل.",
    "question": "ما الذي يتحقق بتمكين Printer Pooling واختيار المنفذين الصحيحين؟",
    "options": [
      "طابعة منطقية واحدة يمكنها استخدام منافذ الطابعات ضمن التجميع.",
      "إثبات أن الورق خرج فعلًا من طابعة حقيقية داخل المحاكاة.",
      "إنشاء مستخدم في Active Directory لكل منفذ."
    ],
    "answer": 0,
    "explain": "طابعة منطقية واحدة يمكنها استخدام منافذ الطابعات ضمن التجميع. نتيجة المحاكاة تخص هذه المحاولة، ولا تثبت تنفيذًا على Windows فعلي.",
    "hint": "راجع الجهاز والحساب والنتيجة الفعلية في لوحة الحالة. تعديل الإعداد يختلف عن فحص أثره.",
    "reveal": "افتح العملية من الأداة، ثم راجع خطوات المصدر والقيم المطلوبة. أدخلها بنفسك، طبّق الإعداد ثم افتح عملية التحقق المرتبطة.",
    "actions": [
      {
        "id": "role",
        "scene": 1,
        "title": "Add Roles → Print and Document Services",
        "op": "put",
        "values": {
          "server": "LON-SVR1",
          "installed": true,
          "service": "Print Server",
          "features": true
        },
        "device": "LON-SVR1",
        "console": "Server Manager",
        "entity": "roles",
        "key": "Print",
        "sourceScene": "os1-lesson-18-scene-01",
        "menu": "Add Roles → Print and Document Services"
      },
      {
        "id": "port1",
        "scene": 2,
        "title": "Add Printer → TCP/IP",
        "op": "put",
        "values": {
          "ip": "172.16.0.200",
          "autoDetect": false,
          "type": "Standard TCP/IP Port",
          "deviceType": "Generic Network Card"
        },
        "device": "LON-SVR1",
        "console": "Print Management",
        "entity": "ports",
        "key": "172.16.0.200",
        "sourceScene": "os1-lesson-18-scene-02",
        "menu": "Add Printer → TCP/IP"
      },
      {
        "id": "printer",
        "scene": 3,
        "title": "Install a new driver / Printer name",
        "op": "put",
        "values": {
          "name": "Branch Office Printer",
          "manufacturer": "Microsoft",
          "driver": "Microsoft XPS Class Driver",
          "port": "172.16.0.200",
          "shared": true,
          "shareName": "Branch Office Printer"
        },
        "device": "LON-SVR1",
        "console": "Print Management",
        "entity": "printers",
        "key": "Branch Office Printer",
        "requires": [
          "role",
          "port1"
        ],
        "sourceScene": "os1-lesson-18-scene-03",
        "menu": "Install a new driver / Printer name"
      },
      {
        "id": "sharing",
        "scene": 4,
        "title": "Printer Properties → Sharing",
        "op": "put",
        "values": {
          "listed": true,
          "directPrinting": true
        },
        "device": "LON-SVR1",
        "console": "Print Management",
        "entity": "printers",
        "key": "Branch Office Printer",
        "update": true,
        "sourceScene": "os1-lesson-18-scene-04",
        "menu": "Printer Properties → Sharing"
      },
      {
        "id": "port2",
        "scene": 5,
        "title": "Ports → Add Port",
        "op": "put",
        "values": {
          "ip": "172.16.0.201",
          "type": "Standard TCP/IP Port",
          "deviceType": "Generic Network Card"
        },
        "device": "LON-SVR1",
        "console": "Print Management",
        "entity": "ports",
        "key": "172.16.0.201",
        "sourceScene": "os1-lesson-18-scene-05",
        "menu": "Ports → Add Port"
      },
      {
        "id": "pool",
        "scene": 6,
        "title": "Printer Properties → Ports",
        "op": "pool",
        "values": {
          "printer": "Branch Office Printer",
          "pooling": true,
          "ports": [
            "172.16.0.200",
            "172.16.0.201"
          ]
        },
        "device": "LON-SVR1",
        "console": "Print Management",
        "sourceScene": "os1-lesson-18-scene-06",
        "menu": "Printer Properties → Ports"
      },
      {
        "id": "check-pool",
        "scene": 6,
        "title": "Reopen Ports",
        "op": "view",
        "values": {},
        "device": "LON-SVR1",
        "console": "Print Management",
        "entity": "printers",
        "key": "Branch Office Printer",
        "expected": {
          "pooling": true,
          "ports": [
            "172.16.0.200",
            "172.16.0.201"
          ]
        },
        "sourceScene": "os1-lesson-18-scene-06",
        "menu": "Reopen Ports"
      },
      {
        "id": "client-printer",
        "scene": 7,
        "title": "Devices and Printers → Add a printer",
        "op": "printer-client",
        "values": {
          "printer": "Branch Office Printer",
          "acceptDriver": true
        },
        "device": "LON-CL1",
        "console": "Devices and Printers",
        "sourceScene": "os1-lesson-18-scene-07",
        "menu": "Devices and Printers → Add a printer"
      },
      {
        "id": "print-dialog",
        "scene": 7,
        "title": "Application → Print",
        "op": "view",
        "values": {},
        "device": "LON-CL1",
        "console": "Devices and Printers",
        "entity": "clientPrinters",
        "key": "LON-CL1",
        "expected": {},
        "sourceScene": "os1-lesson-18-scene-07",
        "menu": "Application → Print"
      }
    ],
    "sources": [
      {
        "id": "os1-lesson-18-scene-01",
        "title": "تثبيت Print and Document Services",
        "video": "/assets/os1/os1-lesson-18/01.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-18/01.jpg",
        "seconds": 35.0,
        "steps": [
          "على LON-SVR1 افتح Server Manager → Manage → Add Roles and Features → Role-based installation → اختر SVR1.",
          "حدد Print and Document Services، وأضف أدوات الإدارة عند الطلب، ثم في Role Services اختر Print Server المطلوب في المختبر.",
          "تابع Install وانتظر اكتماله، ثم Tools → Print Management. لا تضف خدمات طباعة أخرى لمجرد وجودها في القائمة."
        ],
        "notes": [
          "هذا مختبر إدارة طباعة على Windows Server؛ لا يثبت التثبيت وجود طابعة فعلية."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-18-scene-02",
        "title": "إضافة طابعة شبكة",
        "video": "/assets/os1/os1-lesson-18/02.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-18/02.jpg",
        "seconds": 110.0,
        "steps": [
          "داخل Print Management افتح Print Servers → LON-SVR1 → Printers، ثم باليمين → Add Printer.",
          "اختر إضافة TCP/IP printer بعنوان IP، ثم أدخل 172.16.0.200 كما في شبكة المختبر.",
          "أزل خيار Auto detect the printer driver to use في هذه المحاكاة، ثم Next؛ لا يوجد في التسجيل إثبات اتصال بطابعة ورقية حقيقية على هذا العنوان."
        ],
        "notes": [
          "عنوان المثال 172.16.0.200؛ لا تستخدمه في شبكة أخرى دون معرفة خطة عناوينها."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-18-scene-03",
        "title": "المنفذ وبرنامج التشغيل",
        "video": "/assets/os1/os1-lesson-18/03.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-18/03.jpg",
        "seconds": 125.0,
        "steps": [
          "عندما يطلب المعالج معلومات إضافية للمنفذ اختر Standard → Generic Network Card ثم Next.",
          "اختر Install a new driver، ثم Manufacturer: Microsoft وPrinter: Microsoft XPS Class Driver كما في المختبر.",
          "راجع برنامج التشغيل ثم Next. هذا Driver للتجربة؛ في تطبيق فعلي تختار برنامج التشغيل المتوافق مع الطابعة الفعلية."
        ],
        "notes": [
          "Driver برنامج تشغيل الطابعة. Microsoft XPS Class Driver هنا مثال مختبر؛ الطابعة الفعلية تحتاج برنامجًا متوافقًا معها."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-18-scene-04",
        "title": "مشاركة الطابعة وإعلانها",
        "video": "/assets/os1/os1-lesson-18/04.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-18/04.jpg",
        "seconds": 90.0,
        "steps": [
          "سمّ الطابعة Branch Office Printer، وفعّل مشاركتها بالاسم المطلوب نفسه ثم Next → Finish.",
          "من قائمة الطابعة فعّل Enable Branch Office Direct Printing حيث يطلبه تمرين المدرس.",
          "افتح Printer Properties → Sharing، وراجع Share this printer وList in the directory، ثم Apply → OK.",
          "Branch Office Direct Printing وPrinter Pooling ميزتان مختلفتان؛ تفعيل الأولى لا يضيف منفذًا ثانيًا ولا ينشئ Pool."
        ],
        "notes": [
          "نشر الطابعة في الدليل يساعد على اكتشافها؛ لا يثبت خروج صفحة مطبوعة."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-18-scene-05",
        "title": "إضافة منفذ ثانٍ",
        "video": "/assets/os1/os1-lesson-18/05.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-18/05.jpg",
        "seconds": 80.0,
        "steps": [
          "افتح خصائص Branch Office Printer → Ports → Add Port.",
          "اختر Standard TCP/IP Port → New Port، ثم أدخل العنوان الثاني 172.16.0.201 → Next.",
          "عند طلب نوع الجهاز اختر Generic Network Card كما في هذا المختبر، ثم Finish → Close.",
          "راجع ظهور منفذين منفصلين للعنوانين .200 و.201؛ إضافة المنفذ لا تعني أنه أصبح عضوًا في Pool تلقائيًا."
        ],
        "notes": [
          "المثال يستخدم 172.16.0.201 منفذًا إضافيًا؛ لكل جهاز طباعة عنوانه."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-18-scene-06",
        "title": "تفعيل Printer Pooling",
        "video": "/assets/os1/os1-lesson-18/06.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-18/06.jpg",
        "seconds": 85.0,
        "steps": [
          "في خصائص الطابعة → Ports فعّل Enable printer pooling.",
          "حدد مربعي منفذي 172.16.0.200 و172.16.0.201 معًا، ثم Apply → OK.",
          "أعد فتح Ports للتحقق من بقاء الخيار والمنفذين محددين. بدون Pool قد يؤدي اختيار المنفذ الثاني إلى إلغاء اختيار الأول.",
          "في الاستخدام الحقيقي يجب أن تكون طابعات Pool متوافقة مع برنامج التشغيل نفسه. إعداد منفذين في المختبر ليس دليلًا على خروج ورق أو نجاح اختبار تعطل طابعة."
        ],
        "notes": [
          "Printer Pooling مجموعة أجهزة طباعة تقدم للمستخدم كطابعة منطقية واحدة؛ ليست أمرًا لطباعة نسخة متزامنة على كل الأجهزة."
        ],
        "warnings": [
          "يلزم توافق الأجهزة مع برنامج التشغيل؛ لم يختبر التسجيل طباعة ورقية فعلية."
        ]
      },
      {
        "id": "os1-lesson-18-scene-07",
        "title": "اكتشاف الطابعة على العميل",
        "video": "/assets/os1/os1-lesson-18/07.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-18/07.jpg",
        "seconds": 55.0,
        "steps": [
          "على LON-CL1 افتح Control Panel → Devices and Printers → Add a printer.",
          "انتظر البحث ثم اختر Branch Office Printer المنشورة على LON-SVR1 → Next، ووافق على تثبيت برنامج التشغيل المطلوب بحساب المختبر إذا طلبه النظام، ثم Finish.",
          "تحقق من ظهور الطابعة في Devices and Printers، وافتح نافذة Print من تطبيق للتأكد من وجودها ضمن الخيارات.",
          "هذا يثبت اكتشاف الطابعة وإضافتها للعميل؛ لا تسجل طباعة ورقية ناجحة ما لم تُنفَّذ وتتحقق فعليًا."
        ],
        "notes": [
          "ظهور الطابعة في البحث دليل اكتشاف فقط؛ اختبار ورقة فعلية يتطلب جهاز طباعة متاحًا."
        ],
        "warnings": []
      }
    ],
    "sceneCoverage": [
      {
        "scene": "os1-lesson-18-scene-01",
        "actions": [
          "role"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-18-scene-02",
        "actions": [
          "port1"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-18-scene-03",
        "actions": [
          "printer"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-18-scene-04",
        "actions": [
          "sharing"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-18-scene-05",
        "actions": [
          "port2"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-18-scene-06",
        "actions": [
          "pool",
          "check-pool"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-18-scene-07",
        "actions": [
          "client-printer",
          "print-dialog"
        ],
        "role": "procedure-or-context"
      }
    ]
  },
  {
    "id": "course-19",
    "lesson": 19,
    "scene": 1,
    "title": "Module 10 · Exercise 4 · تطبيق إضافي لـ Print Pool",
    "subtitle": "Print Management",
    "kind": "curriculum",
    "console": "Print Management",
    "host": "LON-SVR1",
    "why": "تسجيل آخر يركز على إنشاء الطابعة وإضافة منفذ ثانٍ وتفعيل التجميع، ثم العثور على المشاركة من العميل.",
    "question": "هل إضافة منفذ ثانٍ وحدها تكفي لإثبات إعداد Print Pool؟",
    "options": [
      "نعم؛ مجرد كتابة عنوان المنفذ يكفي.",
      "نعم؛ حتى لو كان المنفذ غير موجود في القائمة.",
      "لا؛ يلزم تفعيل التجميع وتحديد المنافذ ومراجعة الخصائص."
    ],
    "answer": 2,
    "explain": "لا؛ يلزم تفعيل التجميع وتحديد المنافذ ومراجعة الخصائص. نتيجة المحاكاة تخص هذه المحاولة، ولا تثبت تنفيذًا على Windows فعلي.",
    "hint": "راجع الجهاز والحساب والنتيجة الفعلية في لوحة الحالة. تعديل الإعداد يختلف عن فحص أثره.",
    "reveal": "افتح العملية من الأداة، ثم راجع خطوات المصدر والقيم المطلوبة. أدخلها بنفسك، طبّق الإعداد ثم افتح عملية التحقق المرتبطة.",
    "actions": [
      {
        "id": "role",
        "scene": 1,
        "title": "Add Roles → Print and Document Services",
        "op": "put",
        "values": {
          "server": "LON-SVR1",
          "installed": true,
          "service": "Print Server",
          "features": true
        },
        "device": "LON-SVR1",
        "console": "Server Manager",
        "entity": "roles",
        "key": "Print",
        "sourceScene": "os1-lesson-19-scene-01",
        "menu": "Add Roles → Print and Document Services"
      },
      {
        "id": "port1",
        "scene": 2,
        "title": "Add Printer → TCP/IP",
        "op": "put",
        "values": {
          "ip": "172.16.0.200",
          "autoDetect": false,
          "type": "Standard TCP/IP Port",
          "deviceType": "Generic Network Card"
        },
        "device": "LON-SVR1",
        "console": "Print Management",
        "entity": "ports",
        "key": "172.16.0.200",
        "sourceScene": "os1-lesson-19-scene-02",
        "menu": "Add Printer → TCP/IP"
      },
      {
        "id": "printer",
        "scene": 3,
        "title": "Install a new driver / Printer name",
        "op": "put",
        "values": {
          "name": "Branch Office Printer",
          "manufacturer": "Microsoft",
          "driver": "Microsoft XPS Class Driver",
          "port": "172.16.0.200",
          "shared": true,
          "shareName": "Branch Office Printer"
        },
        "device": "LON-SVR1",
        "console": "Print Management",
        "entity": "printers",
        "key": "Branch Office Printer",
        "requires": [
          "role",
          "port1"
        ],
        "sourceScene": "os1-lesson-19-scene-03",
        "menu": "Install a new driver / Printer name"
      },
      {
        "id": "sharing",
        "scene": 3,
        "title": "Printer Properties → Sharing",
        "op": "put",
        "values": {
          "listed": true,
          "directPrinting": true
        },
        "device": "LON-SVR1",
        "console": "Print Management",
        "entity": "printers",
        "key": "Branch Office Printer",
        "update": true,
        "sourceScene": "os1-lesson-19-scene-03",
        "menu": "Printer Properties → Sharing"
      },
      {
        "id": "port2",
        "scene": 4,
        "title": "Ports → Add Port",
        "op": "put",
        "values": {
          "ip": "172.16.0.201",
          "type": "Standard TCP/IP Port",
          "deviceType": "Generic Network Card"
        },
        "device": "LON-SVR1",
        "console": "Print Management",
        "entity": "ports",
        "key": "172.16.0.201",
        "sourceScene": "os1-lesson-19-scene-04",
        "menu": "Ports → Add Port"
      },
      {
        "id": "pool",
        "scene": 5,
        "title": "Printer Properties → Ports",
        "op": "pool",
        "values": {
          "printer": "Branch Office Printer",
          "pooling": true,
          "ports": [
            "172.16.0.200",
            "172.16.0.201"
          ]
        },
        "device": "LON-SVR1",
        "console": "Print Management",
        "sourceScene": "os1-lesson-19-scene-05",
        "menu": "Printer Properties → Ports"
      },
      {
        "id": "check-pool",
        "scene": 5,
        "title": "Reopen Ports",
        "op": "view",
        "values": {},
        "device": "LON-SVR1",
        "console": "Print Management",
        "entity": "printers",
        "key": "Branch Office Printer",
        "expected": {
          "pooling": true,
          "ports": [
            "172.16.0.200",
            "172.16.0.201"
          ]
        },
        "sourceScene": "os1-lesson-19-scene-05",
        "menu": "Reopen Ports"
      },
      {
        "id": "client-printer",
        "scene": 6,
        "title": "Devices and Printers → Add a printer",
        "op": "printer-client",
        "values": {
          "printer": "Branch Office Printer",
          "acceptDriver": true
        },
        "device": "LON-CL1",
        "console": "Devices and Printers",
        "sourceScene": "os1-lesson-19-scene-06",
        "menu": "Devices and Printers → Add a printer"
      },
      {
        "id": "print-dialog",
        "scene": 6,
        "title": "Application → Print",
        "op": "view",
        "values": {},
        "device": "LON-CL1",
        "console": "Devices and Printers",
        "entity": "clientPrinters",
        "key": "LON-CL1",
        "expected": {},
        "sourceScene": "os1-lesson-19-scene-06",
        "menu": "Application → Print"
      }
    ],
    "sources": [
      {
        "id": "os1-lesson-19-scene-01",
        "title": "فتح إدارة الطباعة",
        "video": "/assets/os1/os1-lesson-19/01.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-19/01.jpg",
        "seconds": 60.0,
        "steps": [
          "هذا تسجيل مكمل للطباعة. على SVR1 افتح Server Manager → Tools → Print Management → Print Servers → LON-SVR1 → Printers.",
          "إذا كان دور Print Server غير مثبت فأكمل خطوات تثبيته في الدرس السابق أولًا.",
          "راجع هل Branch Office Printer موجودة بالفعل؛ إن كنت تواصل المختبر نفسه افتح خصائصها بدل إنشاء طابعة مكررة."
        ],
        "notes": [
          "احتُفظ بهذا التسجيل بوصفه تطبيقًا إضافيًا لموضوع الطباعة، لا نسخة مطابقة من التسجيل السابق."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-19-scene-02",
        "title": "عنوان الطابعة ونوع المنفذ",
        "video": "/assets/os1/os1-lesson-19/02.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-19/02.jpg",
        "seconds": 125.0,
        "steps": [
          "لإعادة إنشائها في مختبر جديد اختر Add Printer → TCP/IP printer وأدخل 172.16.0.200.",
          "أزل Auto detect the printer driver to use في سيناريو المحاكاة، ثم Next.",
          "اختر Generic Network Card عند طلب معلومات المنفذ وأكمل المعالج. العنوان يجب أن يطابق شبكة المختبر، لا طابعة حقيقية مفترضة."
        ],
        "notes": [
          "فشل الاكتشاف التلقائي في مختبر بلا طابعة فعلية لا يثبت أن العنوان صالح خارج المختبر."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-19-scene-03",
        "title": "اختيار Driver وتسمية المشاركة",
        "video": "/assets/os1/os1-lesson-19/03.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-19/03.jpg",
        "seconds": 105.0,
        "steps": [
          "اختر Install a new driver → Microsoft → Microsoft XPS Class Driver ثم Next.",
          "اكتب Branch Office Printer، وفعّل مشاركة الطابعة بالاسم المطلوب ثم Finish.",
          "راجع Properties → Sharing → List in the directory لنشرها، وميزة Branch Office Direct Printing عندما يطلبها التمرين.",
          "إذا كانت الطابعة موجودة من التسجيل السابق فاكتفِ بمطابقة Driver والمشاركة؛ لا تغير طابعة أخرى على الجهاز."
        ],
        "notes": [
          "اختيار برنامج تشغيل افتراضي في المختبر لا يغني عن برنامج الطابعة الحقيقية."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-19-scene-04",
        "title": "إضافة المنفذ الإضافي",
        "video": "/assets/os1/os1-lesson-19/04.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-19/04.jpg",
        "seconds": 125.0,
        "steps": [
          "من Printer Properties → Ports → Add Port اختر Standard TCP/IP Port → New Port.",
          "أدخل 172.16.0.201، ثم Generic Network Card عند الطلب → Finish → Close.",
          "راجع وجود المنفذين .200 و.201، وأنك تعدل خصائص الطابعة المشتركة نفسها لا طابعة مستقلة جديدة."
        ],
        "notes": [
          "اسم المنفذ وعنوانه يحتاجان مطابقة؛ لا يكفي ظهور صف جديد."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-19-scene-05",
        "title": "تجميع المنافذ في طابعة واحدة",
        "video": "/assets/os1/os1-lesson-19/05.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-19/05.jpg",
        "seconds": 75.0,
        "steps": [
          "في تبويب Ports فعّل Enable printer pooling، ثم حدد منفذي 172.16.0.200 و172.16.0.201 معًا.",
          "اضغط Apply → OK، ثم افتح الخصائص مرة أخرى للتحقق من حفظ الخيار والاختيارين.",
          "Pool يقدم الطابعات المتوافقة عبر طابعة منطقية مشتركة واحدة؛ ليس معناه تقسيم صفحات كل مهمة بالتساوي بين المنفذين."
        ],
        "notes": [
          "التجميع يتيح استخدام أجهزة متعددة تحت طابعة منطقية واحدة؛ لا يعني تقسيم صفحات كل مهمة بينها بالتساوي."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-19-scene-06",
        "title": "الوصول إلى الطابعة من العميل",
        "video": "/assets/os1/os1-lesson-19/06.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-19/06.jpg",
        "seconds": 49.0,
        "steps": [
          "على CL1 افتح Devices and Printers → Add a printer واختر Branch Office Printer على SVR1 ثم Next → Finish.",
          "تحقق من ظهورها ضمن الطابعات وخيارات نافذة Print في التطبيق.",
          "إذا لم تظهر، راجع اتصال المجال ونشر List in the directory والمشاركة، ثم أعد البحث. لا تعتبر ظهور النافذة دليلًا على إرسال ورق إلى طابعة فعلية.",
          "عند متابعة الدرس السابق على العميل نفسه راجع الطابعة المثبتة بدل إضافة نسخة مكررة."
        ],
        "notes": [
          "يسبق ذلك تعثر دخول في التسجيل؛ المقطع المنتقى يركز على اكتشاف الطابعة، وليس إثبات إصلاح كل حساب أو نجاح طباعة ورقية."
        ],
        "warnings": []
      }
    ],
    "sceneCoverage": [
      {
        "scene": "os1-lesson-19-scene-01",
        "actions": [
          "role"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-19-scene-02",
        "actions": [
          "port1"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-19-scene-03",
        "actions": [
          "printer",
          "sharing"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-19-scene-04",
        "actions": [
          "port2"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-19-scene-05",
        "actions": [
          "pool",
          "check-pool"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-19-scene-06",
        "actions": [
          "client-printer",
          "print-dialog"
        ],
        "role": "procedure-or-context"
      }
    ]
  },
  {
    "id": "course-20",
    "lesson": 20,
    "scene": 1,
    "title": "Module 11 · Exercise 2 · إنشاء GPO والوراثة",
    "subtitle": "Group Policy Management",
    "kind": "curriculum",
    "console": "Group Policy Management",
    "host": "LON-DC1",
    "why": "إنشاء Starter GPO، ثم كائن سياسة مرتبط بالمجال، ومراجعة Block Inheritance وEnforced مع اختبار إعداد واجهة المستخدم.",
    "question": "سياسة حظر USB على المجال Enforced، والاستثناء في IT يعطّل الحظر. أيهما يغلب؟",
    "options": [
      "Not Configured في IT يلغي كل سياسات المجال.",
      "الرابط الأب Enforced يمنع تجاوز الإعداد المتعارض في IT.",
      "سياسة IT تغلب دائمًا لمجرد أنها أقرب للكمبيوتر."
    ],
    "answer": 1,
    "explain": "الرابط الأب Enforced يمنع تجاوز الإعداد المتعارض في IT. نتيجة المحاكاة تخص هذه المحاولة، ولا تثبت تنفيذًا على Windows فعلي.",
    "hint": "راجع الجهاز والحساب والنتيجة الفعلية في لوحة الحالة. تعديل الإعداد يختلف عن فحص أثره.",
    "reveal": "افتح العملية من الأداة، ثم راجع خطوات المصدر والقيم المطلوبة. أدخلها بنفسك، طبّق الإعداد ثم افتح عملية التحقق المرتبطة.",
    "actions": [
      {
        "id": "starter",
        "scene": 1,
        "title": "Starter GPOs → New",
        "op": "put",
        "values": {
          "name": "Internet Explorer Restrictions"
        },
        "device": "LON-DC1",
        "console": "Group Policy Management",
        "entity": "starters",
        "key": "Internet Explorer Restrictions",
        "sourceScene": "os1-lesson-20-scene-01",
        "menu": "Starter GPOs → New"
      },
      {
        "id": "ie-policy",
        "scene": 2,
        "title": "Edit → User Configuration → Internet Control Panel",
        "op": "put",
        "values": {
          "general": "Enabled"
        },
        "device": "LON-DC1",
        "console": "Group Policy Management",
        "entity": "starters",
        "key": "Internet Explorer Restrictions",
        "update": true,
        "choices": {
          "general": [
            "Not Configured",
            "Enabled",
            "Disabled"
          ]
        },
        "sourceScene": "os1-lesson-20-scene-02",
        "menu": "Edit → User Configuration → Internet Control Panel"
      },
      {
        "id": "report",
        "scene": 3,
        "title": "Starter GPO → Settings",
        "op": "view",
        "values": {},
        "device": "LON-DC1",
        "console": "Group Policy Management",
        "entity": "starters",
        "key": "Internet Explorer Restrictions",
        "expected": {
          "general": "Enabled"
        },
        "sourceScene": "os1-lesson-20-scene-03",
        "menu": "Starter GPO → Settings"
      },
      {
        "id": "gpo",
        "scene": 4,
        "title": "Create a GPO in this domain, and Link it here",
        "op": "gpo",
        "values": {
          "name": "IE Restrictions",
          "starter": "Internet Explorer Restrictions",
          "container": "Adatum.com",
          "enabled": true,
          "enforced": false,
          "order": 1
        },
        "device": "LON-DC1",
        "console": "Group Policy Management",
        "sourceScene": "os1-lesson-20-scene-04",
        "menu": "Create a GPO in this domain, and Link it here"
      },
      {
        "id": "link",
        "scene": 5,
        "title": "GPO Link → Properties",
        "op": "put",
        "values": {
          "enforced": true,
          "order": 1
        },
        "device": "LON-DC1",
        "console": "Group Policy Management",
        "entity": "gpos",
        "key": "IE Restrictions",
        "update": true,
        "sourceScene": "os1-lesson-20-scene-05",
        "menu": "GPO Link → Properties"
      },
      {
        "id": "apply-user",
        "scene": 6,
        "title": "Client → Update policy / Internet Options",
        "op": "policy-test",
        "values": {
          "computerOU": "Computers",
          "userOU": "Users",
          "test": "General page"
        },
        "device": "LON-CL1",
        "console": "Internet Options",
        "sourceScene": "os1-lesson-20-scene-06",
        "menu": "Client → Update policy / Internet Options"
      },
      {
        "id": "usb",
        "scene": 7,
        "title": "Starter GPOs → New / Edit",
        "op": "put",
        "values": {
          "name": "Block USB",
          "read": "Enabled",
          "write": "Enabled",
          "execute": "Enabled"
        },
        "device": "LON-DC1",
        "console": "Group Policy Management",
        "entity": "starters",
        "key": "Block USB",
        "choices": {
          "read": [
            "Not Configured",
            "Enabled",
            "Disabled"
          ],
          "write": [
            "Not Configured",
            "Enabled",
            "Disabled"
          ],
          "execute": [
            "Not Configured",
            "Enabled",
            "Disabled"
          ]
        },
        "sourceScene": "os1-lesson-20-scene-07",
        "menu": "Starter GPOs → New / Edit"
      },
      {
        "id": "block",
        "scene": 7,
        "title": "Create and Link GPO",
        "op": "gpo",
        "values": {
          "name": "Block USB",
          "starter": "Block USB",
          "container": "Adatum.com",
          "enabled": true,
          "enforced": false,
          "order": 2
        },
        "device": "LON-DC1",
        "console": "Group Policy Management",
        "sourceScene": "os1-lesson-20-scene-07",
        "menu": "Create and Link GPO"
      },
      {
        "id": "deny-test",
        "scene": 7,
        "title": "Client → Read / Write / Execute",
        "op": "policy-test",
        "values": {
          "computerOU": "IT",
          "userOU": "Users",
          "test": "USB denied"
        },
        "device": "LON-CL1",
        "console": "File Explorer",
        "sourceScene": "os1-lesson-20-scene-07",
        "menu": "Client → Read / Write / Execute"
      },
      {
        "id": "allow",
        "scene": 8,
        "title": "Starter GPOs → Allow USB / Edit",
        "op": "put",
        "values": {
          "name": "Allow USB",
          "read": "Disabled",
          "write": "Disabled",
          "execute": "Disabled"
        },
        "device": "LON-DC1",
        "console": "Group Policy Management",
        "entity": "starters",
        "key": "Allow USB",
        "choices": {
          "read": [
            "Not Configured",
            "Enabled",
            "Disabled"
          ],
          "write": [
            "Not Configured",
            "Enabled",
            "Disabled"
          ],
          "execute": [
            "Not Configured",
            "Enabled",
            "Disabled"
          ]
        },
        "sourceScene": "os1-lesson-20-scene-08",
        "menu": "Starter GPOs → Allow USB / Edit"
      },
      {
        "id": "exception",
        "scene": 8,
        "title": "Create and Link GPO to IT",
        "op": "gpo",
        "values": {
          "name": "Allow USB",
          "starter": "Allow USB",
          "container": "IT",
          "enabled": true,
          "enforced": false,
          "order": 1
        },
        "device": "LON-DC1",
        "console": "Group Policy Management",
        "sourceScene": "os1-lesson-20-scene-08",
        "menu": "Create and Link GPO to IT"
      },
      {
        "id": "move-pc",
        "scene": 8,
        "title": "ADUC → Move Computer to IT",
        "op": "put",
        "values": {
          "ou": "IT"
        },
        "device": "LON-DC1",
        "console": "Active Directory Users and Computers",
        "entity": "computers",
        "key": "LON-CL1",
        "update": true,
        "sourceScene": "os1-lesson-20-scene-08",
        "menu": "ADUC → Move Computer to IT"
      },
      {
        "id": "allow-test",
        "scene": 8,
        "title": "Client → Update policy / USB operations",
        "op": "policy-test",
        "values": {
          "computerOU": "IT",
          "userOU": "Users",
          "test": "USB allowed"
        },
        "device": "LON-CL1",
        "console": "File Explorer",
        "sourceScene": "os1-lesson-20-scene-08",
        "menu": "Client → Update policy / USB operations"
      }
    ],
    "sources": [
      {
        "id": "os1-lesson-20-scene-01",
        "title": "إنشاء Starter GPO",
        "video": "/assets/os1/os1-lesson-20/01.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-20/01.jpg",
        "seconds": 145.0,
        "steps": [
          "على LON-DC1 افتح Server Manager → Tools → Group Policy Management، ثم Forest → Domains → Adatum.com.",
          "افتح Starter GPOs وأنشئ مجلد القوالب إذا ظهر Create Starter GPOs Folder، ثم باليمين → New.",
          "سمّ القالب Internet Explorer Restrictions → OK، ثم باليمين عليه → Edit.",
          "Starter GPO قالب إعدادات للبدء؛ إنشاؤه وتعديله لا يطبقان سياسة على أجهزة أو مستخدمين حتى تنشئ GPO فعلية وتربطها."
        ],
        "notes": [
          "GPO: Group Policy Object، كائن يجمع إعدادات للمستخدمين أو الأجهزة. Starter GPO قالب لإنشاء GPO لاحق؛ لا يطبق مباشرة بمجرد إنشائه."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-20-scene-02",
        "title": "البحث عن الإعداد وتفعيله",
        "video": "/assets/os1/os1-lesson-20/02.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-20/02.jpg",
        "seconds": 108.0,
        "steps": [
          "داخل محرر القالب افتح User Configuration → Administrative Templates → Windows Components → Internet Explorer → Internet Control Panel.",
          "افتح Disable the General page، واختر Enabled ثم Apply → OK.",
          "إذا استخدمت Filter Options للبحث، راجع شروط البحث وألغِ المرشح عند الحاجة لعرض بقية الإعدادات؛ عدم ظهور سياسة تحت مرشح لا يثبت غيابها.",
          "Enabled هنا يفعّل منع صفحة General لأن اسم السياسة يبدأ بـDisable؛ لا يعني تفعيل الصفحة للمستخدم."
        ],
        "notes": [
          "الإعداد هو Disable the General page؛ Enabled يعني تفعيل المنع، وليس تمكين الصفحة. Internet Explorer هنا جزء من المختبر القديم."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-20-scene-03",
        "title": "قراءة تقرير إعداد القالب",
        "video": "/assets/os1/os1-lesson-20/03.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-20/03.jpg",
        "seconds": 54.0,
        "steps": [
          "ارجع إلى Group Policy Management وحدد القالب ثم Settings لقراءة تقريره.",
          "تحقق من ظهور User Configuration والإعداد Disable the General page بحالة Enabled، وراجع أن المسار هو Internet Control Panel.",
          "إذا طلبت الواجهة الموافقة على عرض التقرير المحلي فافتحه واقرأ الإعدادات. التقرير يثبت محتوى القالب فقط، ولا يثبت وصول السياسة إلى العميل."
        ],
        "notes": [
          "تقرير الإعداد يثبت ما حُفظ في الكائن؛ لا يثبت وصوله إلى جلسة المستخدم."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-20-scene-04",
        "title": "إنشاء GPO من القالب وربطه",
        "video": "/assets/os1/os1-lesson-20/04.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-20/04.jpg",
        "seconds": 110.0,
        "steps": [
          "اضغط باليمين على Adatum.com → Create a GPO in this domain, and Link it here.",
          "اكتب IE Restrictions، واختر Source Starter GPO: Internet Explorer Restrictions ثم OK.",
          "راجع ظهور رابط GPO تحت المجال وأن Link Enabled مفعّل، واقرأ Settings للتأكد من انتقال الإعداد من القالب.",
          "انتبه إلى أن السياسة هنا ضمن User Configuration؛ اختبارها يكون بحساب مستخدم داخل نطاق تطبيق الرابط. لا يكفي وجودها في Group Policy Objects دون رابط مناسب."
        ],
        "notes": [
          "إنشاء كائن GPO وربطه بمكان التطبيق خطوتان يجب التحقق منهما؛ وجوده في Group Policy Objects وحده لا يكفي."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-20-scene-05",
        "title": "أولوية الروابط وEnforced",
        "video": "/assets/os1/os1-lesson-20/05.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-20/05.jpg",
        "seconds": 120.0,
        "steps": [
          "راجع روابط GPO على الحاوية وترتيب Link Order؛ الرقم الأصغر له أولوية أعلى بين روابط الحاوية نفسها عند تعارض الإعداد نفسه.",
          "راجع التسلسل المعتاد Local ثم Site ثم Domain ثم OU، مع مراعاة نطاق المستخدم أو الكمبيوتر.",
          "Enforced على رابط الأب يمنع تجاوز إعداداته المتعارضة بسياسة أدنى، ولا يتجاوزه Block Inheritance.",
          "لا تفعّل Enforced أو Block Inheritance على المجال لمجرد التجربة؛ غيّر الرابط المطلوب فقط وسجل وضعه قبل التغيير."
        ],
        "notes": [
          "في المعالجة العادية تتقدم سياسة OU الأقرب عند تعارض الإعداد؛ سياسة Domain (المجال) ليست الأقوى تلقائيًا. Enforced يمنع تجاوز إعدادات الرابط الأعلى. Block Inheritance يحجب الروابط الموروثة العادية، ولا يحجب Enforced."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-20-scene-06",
        "title": "التحقق على جهاز العميل",
        "video": "/assets/os1/os1-lesson-20/06.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-20/06.jpg",
        "seconds": 80.0,
        "steps": [
          "على LON-CL1 ادخل بحساب المجال المقصود، ثم افتح Internet Options وتحقق من اختفاء صفحة General كما في اختبار المدرس.",
          "إذا لم تظهر النتيجة فراجع رابط السياسة ونطاق المستخدم، ثم حدّث السياسة أو أعد الدخول حسب سياق المختبر.",
          "لتحقق إضافي مستقل عن عرض المدرس يمكنك تشغيل gpupdate /force، ثم gpresult /r لقراءة السياسات المطبقة على المستخدم والكمبيوتر.",
          "منع صفحة General لا يمنع الإنترنت كله ولا يخفي كل تبويبات Internet Options. لا تعتبر تقرير الإعداد على الخادم بديلًا عن اختبار العميل."
        ],
        "notes": [
          "هذا دليل على إعداد الواجهة المعروض؛ لا يثبت أن جميع سياسات المستخدم والجهاز طُبقت."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-20-scene-07",
        "title": "مثال إضافي لسياسات التخزين القابل للإزالة",
        "video": "/assets/os1/os1-lesson-20/07.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-20/07.jpg",
        "seconds": 140.0,
        "steps": [
          "هذا مثال إضافي في نهاية الشرح، ولم يعرض التسجيل اختبار USB عمليًا مكتملًا.",
          "في القالب/السياسة المخصصة للحظر افتح Computer Configuration → Administrative Templates → System → Removable Storage Access.",
          "اضبط Removable Disks: Deny execute access وRemovable Disks: Deny read access وRemovable Disks: Deny write access على Enabled، مع Apply → OK لكل إعداد.",
          "إذا بدأت بـStarter GPO باسم Block USB فأنشئ منه GPO فعلية للحظر واربطها بالحاوية المقصودة؛ القالب وحده لا يطبق الحظر.",
          "هذه إعدادات Computer Configuration؛ تأكد من مكان حساب الكمبيوتر، وليس حساب المستخدم فقط، قبل اختبار تأثيرها."
        ],
        "notes": [
          "تفعيل Deny يعني منع العملية المحددة؛ لا تخلط Enabled مع السماح بالوصول."
        ],
        "warnings": []
      },
      {
        "id": "os1-lesson-20-scene-08",
        "title": "استثناء قسم ومراجعة حدود الدليل",
        "video": "/assets/os1/os1-lesson-20/08.mp4?v=batch-v3-final",
        "poster": "/assets/os1/os1-lesson-20/08.jpg",
        "seconds": 135.0,
        "steps": [
          "لتمرين استثناء قسم IT، اجعل حساب الكمبيوتر الذي سيختبر الاستثناء داخل OU الخاصة بـIT، وراجع أنه يتلقى سياسة الحظر الأصلية.",
          "أنشئ GPO للاستثناء أو أنشئها من قالب Allow USB، واضبط سياسات Deny الثلاث نفسها على Disabled، ثم اربط GPO الفعلية بـIT.",
          "Not Configured لا يلغي تلقائيًا حظرًا موروثًا. وإذا كان رابط الحظر في الأب Enforced فلن يتجاوزه رابط الاستثناء في OU؛ راجع التصميم قبل تغيير الأولوية.",
          "حدّث السياسة على جهاز المختبر وتحقق من السياسة الفعلية ثم اختبر القراءة والكتابة والتنفيذ كلًا على حدة بوسيط تجريبي آمن.",
          "هذه قائمة تحقق لاستكمال التطبيق؛ التسجيل يشرح الاستثناء ولا يقدم دليل نجاح جميع اختبارات USB. لا تنسب الاختبار لنفسك أو للفيديو دون تنفيذه."
        ],
        "notes": [
          "التسجيل يوضح إعدادات المنع والاستثناء، لكنه لا يعرض تجربة USB فعلية مكتملة. Enforced على رابط OU ليس شرطًا لكل استثناء، ولا يجعلها تتجاوز رابطًا أعلى مفروضًا؛ راجع الأولوية والتطبيق الفعلي."
        ],
        "warnings": [
          "Block Inheritance يؤثر في سياسات موروثة متعددة؛ لا تستخدمه كاستثناء ضيق دون مراجعة ما سيُحجب."
        ]
      }
    ],
    "note": "نتائج Internet Options وUSB هنا نتائج نموذج محاكاة. الفيديو لا يعرض اختبار USB مكتملًا. الاستثناء يتطلب Disabled لسياسات Deny الثلاث، ولا يتجاوز رابط أب Enforced.",
    "sceneCoverage": [
      {
        "scene": "os1-lesson-20-scene-01",
        "actions": [
          "starter"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-20-scene-02",
        "actions": [
          "ie-policy"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-20-scene-03",
        "actions": [
          "report"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-20-scene-04",
        "actions": [
          "gpo"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-20-scene-05",
        "actions": [
          "link"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-20-scene-06",
        "actions": [
          "apply-user"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-20-scene-07",
        "actions": [
          "usb",
          "block",
          "deny-test"
        ],
        "role": "procedure-or-context"
      },
      {
        "scene": "os1-lesson-20-scene-08",
        "actions": [
          "allow",
          "exception",
          "move-pc",
          "allow-test"
        ],
        "role": "procedure-or-context"
      }
    ]
  }
];
const clone=x=>JSON.parse(JSON.stringify(x)),same=(a,b)=>String(a??'').trim().toLowerCase()===String(b??'').trim().toLowerCase();
const ip=x=>/^(\d{1,3}\.){3}\d{1,3}$/.test(x||'')&&x.split('.').every(n=>+n<=255), num=x=>x.split('.').reduce((n,v)=>n*256+Number(v),0);
const match=(actual,wanted)=>Object.entries(wanted).every(([k,v])=>Array.isArray(v)?Array.isArray(actual?.[k])&&actual[k].length===v.length&&v.every(x=>actual[k].includes(x)):typeof v==='boolean'?actual?.[k]===v:typeof v==='number'?Number(actual?.[k])===v:same(actual?.[k],v));
const get=(r,entity,key)=>r[entity]?.[key];
function put(r,entity,key,value){r[entity]??={};r[entity][key]={...(r[entity][key]||{}),...value};return r[entity][key];}
function seed(n){
 const r={ous:{},users:{},groups:{},computers:{},settings:{},roles:{},interfaces:{},dhcp:{},scopes:{},reservations:{},leases:{},relay:{},disks:{},volumes:{},folders:{},shares:{},ports:{},printers:{},clientPrinters:{},starters:{},gpos:{},delegations:{},domains:{},domainOptions:{},servers:{},zones:{},records:{},dnsCopies:{},dnsSettings:{}};
 for(const name of ['IT','Development','Managers','Marketing','Research','Sales','Computers','Users'])r.ous[name]={name,parent:'Adatum.com',protected:true};
 const names=['Holly','Bart','Ed','Connie','Barbara','Arlene','Bernard'],ous=['IT','Development','Managers','Marketing','Research','Sales','Development'];
 names.forEach((name,i)=>r.users[name]={name,ou:ous[i],enabled:true,passwordSet:true});
 for(const name of ['Server Operators','Development','Marketing','Research','Sales'])r.groups[name]={name,scope:'Global',type:'Security',members:name==='Development'?['Bernard']:[]};
 for(const name of ['LON-CL1','LON-CL2','LON-CORE'])r.computers[name]={name,ou:'Computers',trust:true,domain:'Adatum.com'};
 for(const [name,mac,subnet] of [['LON-CL1','00-15-5D-01-00-01','172.16.0'],['LON-CORE','00-15-5D-01-00-02','172.16.0'],['LON-CL2','00-15-5D-01-00-03','10.10.0']])r.interfaces[name]={name,mac,subnet,auto:false,autoDNS:false};
 r.interfaces['Ethernet 2']={ip:'10.10.0.1',mask:'255.255.0.0',up:true};r.interfaces['LON-SVR1']={ip:'172.16.0.11',dns:'172.16.0.10',mask:'255.255.0.0',auto:false};
 if([6,7,8].includes(n)){r.ous['Branch Office 1']={name:'Branch Office 1',parent:'Adatum.com',protected:true};for(const k of names.slice(0,6))r.users[k].ou='Branch Office 1';r.computers['LON-CL1'].ou='Branch Office 1';for(const g of ['Branch 1 Help Desk','Branch 1 Administrators','Branch 1 Users'])r.groups[g]={name:g,ou:'Branch Office 1',scope:'Global',type:'Security',members:[]};}
 if(n===6)r.users.DelegationTestUser={name:'DelegationTestUser',ou:'Branch Office 1',enabled:true,passwordSet:true};
 if(n===7)delete r.users.Ed; // Separate clean checkpoint, explicitly declared in the UI.
 if(n===8){r.groups['Branch 1 Administrators'].members=['Holly'];r.groups['Server Operators'].members=['Branch 1 Administrators'];r.delegations.computers={principal:'Branch 1 Administrators',ou:'Branch Office 1',objects:'Computer',tasks:['full-control']};}
 if([12,13].includes(n)){r.roles.DHCP={installed:true,features:true,server:'LON-SVR1'};r.dhcp.server={authorized:true};r.scopes.CTE={name:'CTE',start:'172.16.0.100',end:'172.16.0.200',mask:'255.255.0.0',exclusions:'100-110',leaseDays:8,gateway:'172.16.0.1',dns:'172.16.0.10',domain:'Adatum.com',active:true};r.interfaces['LON-CORE'].auto=true;r.interfaces['LON-CORE'].autoDNS=true;r.leases['LON-CORE']={ip:'172.16.0.111',mask:'255.255.0.0',server:'172.16.0.11',mac:r.interfaces['LON-CORE'].mac,gateway:'172.16.0.1',dns:'172.16.0.10',scope:'CTE'};}
 for(let d=0;d<6;d++)r.disks[d]={online:d<2,style:d<2?'GPT':'RAW',dynamic:false,capacity:d<2?65536:32768,protected:d<2,extents:[]};
 r.servers['LON-DC1']={dc:true,dns:true,domain:'Adatum.com'};r.zones['Adatum.com']={name:'Adatum.com',type:'Primary',integrated:true,dynamic:'Secure'};r.dnsSettings['LON-DC1']={rootHints:['a.root-servers.net','b.root-servers.net'],forwarders:[]};
 return r;
}
const def=id=>catalog.find(x=>x.id===id);
function create(id,v){if(!def(id))return base.create(id,v);const s=base.create(id,0),t=def(id);s.name=t.host;s.domain='Adatum.com';s.lab={version:1,resources:seed(t.lesson),actor:'Administrator',device:t.host,proofs:{},events:[],output:'اختر الأداة ثم العملية. الحالة الابتدائية مستقلة لهذا الدرس؛ لا تغيّر تطبيقًا آخر.',passwordStage:null};return s;}
function groupsFor(r,account){const found=new Set([account]);let changed=true;while(changed){changed=false;for(const [k,g] of Object.entries(r.groups)){if(!found.has(k)&&(g.members||[]).some(x=>found.has(x))){found.add(k);changed=true;}}}return found;}
function permission(r,account,ou,kind,operation){if(account==='Administrator')return true;const principals=groupsFor(r,account);return Object.values(r.delegations).some(d=>principals.has(d.principal)&&d.ou===ou&&(d.objects==='All'&&d.tasks.includes('full-control')||d.objects===kind&&d.tasks.includes('full-control')||(kind==='User'&&d.tasks.includes('manage-users')&&['create','delete','modify'].includes(operation))||(kind==='Group'&&d.tasks.includes('manage-groups')&&['create','delete','modify'].includes(operation))||(kind==='User'&&operation==='reset-password'&&d.tasks.includes('reset-password'))));}
function excluded(scope,value){const last=Number(value.split('.').at(-1));return String(scope.exclusions||'').split(',').some(v=>{const [a,b=a]=v.trim().split('-').map(Number);return last>=a&&last<=b;});}
function allocate(r,client){const face=r.interfaces[client];if(!face?.auto||!face.autoDNS)throw Error('اختر الحصول التلقائي للعنوان وDNS على العميل.');if(!r.roles.DHCP?.installed||!r.dhcp.server?.authorized)throw Error('DHCP غير مثبت أو غير معتمد.');if(face.subnet==='10.10.0'&&(!r.relay.Remote?.enabled||r.relay.Remote.interface!=='Ethernet 2'||r.relay.Remote.server!=='172.16.0.11'))throw Error('لا يصل بث العميل إلى الخادم. راجع واجهة Relay وعنوان الخادم.');const scope=Object.values(r.scopes).find(q=>q.active&&q.start.startsWith(face.subnet+'.'));if(!scope)throw Error('لا يوجد Scope مفعّل مناسب لشبكة العميل.');const reservation=r.reservations[client];let address=reservation?.mac===face.mac?reservation.ip:null;if(!address){const old=r.leases[client]?.ip;if(old&&num(old)>=num(scope.start)&&num(old)<=num(scope.end)&&!excluded(scope,old))address=old;else for(let i=num(scope.start);i<=num(scope.end);i++){const v=[i>>>24,(i>>>16)&255,(i>>>8)&255,i&255].join('.');if(!excluded(scope,v)&&!Object.entries(r.leases).some(([c,l])=>c!==client&&l.ip===v)&&!Object.values(r.reservations).some(q=>q.ip===v)){address=v;break;}}}if(!address)throw Error('لا توجد عناوين متاحة.');return r.leases[client]={ip:address,mask:scope.mask,gateway:scope.gateway,dns:scope.dns,server:'172.16.0.11',scope:scope.name,mac:face.mac,leaseDays:scope.leaseDays};}
function fileAllowed(r,actor,share,folder){const sh=r.shares[share],f=r.folders[folder];return !!(sh?.enabled&&f&&(actor==='Administrator'||(sh.permission.includes('Read')||sh.permission==='Full Control')&&(f.usersRead||groupsFor(r,actor).has(f.principal))));}
function effectivePolicy(r,computerOU,userOU){const result={},enforced=new Set();const links=Object.values(r.gpos).filter(g=>g.enabled).sort((a,b)=>(a.container==='Adatum.com'?0:1)-(b.container==='Adatum.com'?0:1)||b.order-a.order);for(const g of links){for(const [k,v] of Object.entries(g.settings||{})){if(!['general','read','write','execute'].includes(k)||v==='Not Configured')continue;const ou=k==='general'?userOU:computerOU;if(g.container!=='Adatum.com'&&g.container!==ou)continue;if(enforced.has(k))continue;result[k]=v;if(g.enforced)enforced.add(k);}}return result;}
function parseCommand(raw){const tokens=String(raw).match(/"[^"]*"|'[^']*'|\S+/g)||[];const command=(tokens.shift()||'').toLowerCase(),p={},position=[];for(let i=0;i<tokens.length;i++){let v=tokens[i];if(v.startsWith('-')){const k=v.slice(1).toLowerCase();p[k]=(tokens[++i]||'').replace(/^["']|["']$/g,'');}else position.push(v.replace(/^["']|["']$/g,''));}return {command,p,position};}
function powershell(s,raw){const r=s.lab.resources,{command:c,p,position}=parseCommand(raw),name=p.name||p.identity||position[0],path=p.path?.match(/^OU=([^,]+),DC=Adatum,DC=com$/i)?.[1];if(c==='import-module'&&same(position[0],'ActiveDirectory')){r.settings.module={loaded:true};return 'ActiveDirectory module loaded.';}if(!r.settings.module?.loaded)throw Error('Import-Module ActiveDirectory أولًا.');if(c==='new-adorganizationalunit'){if(!name||r.ous[name])throw Error('OU غير صالحة أو موجودة.');r.ous[name]={name,parent:'Adatum.com',protected:true};}
 else if(c==='new-aduser'){if(!path||!r.ous[path]||!name||r.users[name])throw Error('راجع Path والاسم؛ المستخدم موجود أو الحاوية غير موجودة.');r.users[name]={name,displayName:p.displayname,first:p.givenname,last:p.surname,ou:path,enabled:false,passwordSet:false};}
 else if(c==='set-adaccountpassword'){if(!r.users[name])throw Error('المستخدم غير موجود.');s.lab.passwordStage={user:name,step:'current'};return 'Current password (Enter للحساب الجديد):';}
 else if(c==='enable-adaccount'){if(!r.users[name]?.passwordSet)throw Error('اضبط كلمة المرور قبل تفعيل الحساب.');r.users[name].enabled=true;}
 else if(c==='new-adgroup'){if(!name||r.groups[name]||!r.ous[path])throw Error('راجع اسم المجموعة وPath.');r.groups[name]={name,ou:path,scope:p.groupscope,type:p.groupcategory,members:[]};}
 else if(c==='add-adgroupmember'){if(!r.groups[name]||!r.users[p.members])throw Error('المجموعة أو المستخدم غير موجود.');r.groups[name].members=[...new Set([...(r.groups[name].members||[]),p.members])];}
 else if(c==='get-adgroupmember'){if(!r.groups[name])throw Error('المجموعة غير موجودة.');return (r.groups[name].members||[]).map(m=>`${m}\nDistinguishedName: CN=${m},OU=${r.users[m].ou},DC=Adatum,DC=com`).join('\n')||'No members';}
 else throw Error('الأمر غير ممثل في هذا الدرس؛ راجع مصدر PowerShell.');return 'Command completed.';}
function act(input,action,data={}){
 if(!def(input.id))return base.act(input,action,data);let s=clone(input),t=def(s.id),b=s.lab,r=b.resources;
 if(action==='lab-device'){if(!machines(t).includes(data.device))return s;b.sessions??={};b.sessions[b.device]=b.actor;b.device=data.device;b.actor=b.sessions[data.device]||'Administrator';s.message='الجهاز الحالي: '+data.device;return s;}
 if(action==='lab-password'){try{const st=b.passwordStage;if(!st)throw Error('لا توجد مطالبة كلمة مرور.');if(st.step==='current'){if(data.value!=='')throw Error('الحساب جديد؛ اترك الحالية فارغة.');st.step='new';b.output='New password:';}else if(st.step==='new'){if(data.value!=='Pa$$w0rd')throw Error('استخدم Pa$$w0rd في المختبر.');st.step='repeat';b.output='Repeat password:';}else{if(data.value!=='Pa$$w0rd')throw Error('كلمتا المرور غير متطابقتين.');r.users[st.user].passwordSet=true;b.passwordStage=null;b.proofs.password={ok:true,revision:s.revision+1};if(b.issues)delete b.issues.password;b.output='Password set. Enable the account next.';}s.revision++;}catch(err){b.output=err.message;}s.message=b.output;return s;}
 if(action!=='lab-action')return base.act(s,action,data);
 const a=t.actions.find(x=>x.id===data.id);if(!a)return s;const v=clone(data.values||{});let output='',ok=false,denied=false;const before=clone(r);
 try{
  if(b.device!==a.device)throw Error('هذه العملية على '+a.device+'؛ بدّل الجهاز أولًا.');
  if((a.requires||[]).some(k=>!b.proofs[k]?.ok))throw Error('أكمل المتطلبات السابقة: '+a.requires.filter(k=>!b.proofs[k]?.ok).join('، '));
  if(a.actor&&b.actor!==a.actor)throw Error('اختبر بهوية '+a.actor+'، لا بهوية '+b.actor+'.');
  const adminOps=['put','delete','member','copy-user','reservation','volume','resize','mirror','gpo','replicate','pool'];
  if(adminOps.includes(a.op)&&b.actor!=='Administrator')throw Error('Access is denied. عد بحساب الإدارة لإعداد المختبر؛ اختبار التفويض له عملية مستقلة.');
  if(a.op==='put'){
   for(const [k,val] of Object.entries(v))if(['password','confirm','dsrm'].includes(k)&&val!=='Pa$$w0rd')throw Error('استخدم Pa$$w0rd في حقول كلمة مرور المختبر.');
   if(v.mustChange&&(v.cannotChange||v.neverExpires))throw Error('خيارات كلمة المرور متعارضة.');
   if(v.ou&&!r.ous[v.ou])throw Error('OU الوجهة غير موجودة.');
   if(a.entity==='scopes'){if(!ip(v.start)||!ip(v.end)||!ip(v.mask)||num(v.start)>num(v.end)||v.start.split('.').slice(0,3).join('.')!==v.end.split('.').slice(0,3).join('.'))throw Error('مدى Scope أو القناع غير صالح.');if(!r.roles.DHCP?.installed||!r.dhcp.server?.authorized)throw Error('ثبّت واعتمد خادم DHCP أولًا.');if(!ip(v.gateway)||!ip(v.dns)||+v.leaseDays<=0)throw Error('راجع الخيارات ومدة الإيجار.');}
   if(a.entity==='dhcp'&&!r.roles.DHCP?.installed)throw Error('الدور غير مثبت.');
   if(a.entity==='records'&&(!r.zones[v.zone]||!ip(v.ip)))throw Error('المنطقة غير موجودة أو عنوان السجل غير صالح.');
   if(a.entity==='disks'&&r.disks[a.key]?.protected)throw Error('قرص النظام/Allfiles محمي.');
   if(a.entity==='printers'&&!a.update&&(!r.roles.Print?.installed||!r.ports[v.port]))throw Error('دور الطباعة أو منفذ الطابعة غير موجود.');
   if(a.entity==='ports'&&!ip(v.ip))throw Error('عنوان المنفذ غير صالح.');
   if(a.entity==='delegations'&&!r.users[v.principal]&&!r.groups[v.principal])throw Error('Check Names: لم يوجد المستخدم أو المجموعة.');
   if(a.entity==='domainOptions'&&!r.domains[a.key])throw Error('حدد عملية النشر أولًا.');
   const key=(!a.update&&['users','groups','ous','scopes','zones','printers','starters'].includes(a.entity))?v.name:a.key;if(!key||/^(?:__proto__|constructor|prototype)$/.test(key))throw Error('اسم غير صالح.');
   if(a.update&&!get(r,a.entity,key))throw Error('الكائن المطلوب تعديله غير موجود.');
   if(!a.update&&get(r,a.entity,key)&&['users','groups','ous','zones','printers','starters'].includes(a.entity))throw Error('الكائن موجود. افتح خصائصه أو أعد المحاولة من نقطة البداية؛ لا تنشئ نسخة أخرى.');
   const clean={...v};for(const k of ['password','confirm','dsrm'])delete clean[k];if(v.password||v.dsrm)clean.passwordSet=true;if(a.entity==='groups')clean.members=[];
   put(r,a.entity,key,clean);ok=match(v,a.values);output=JSON.stringify(get(r,a.entity,key),null,2);
  }else if(a.op==='view'){const obj=get(r,a.entity,a.key);if(!obj)throw Error('لم يوجد الكائن؛ أنشئه أو طبّق الإعداد أولًا.');output=JSON.stringify(obj,null,2);ok=match(obj,a.expected);}
  else if(a.op==='delete'){const obj=get(r,a.entity,a.key);if(!v.confirm)throw Error('راجع الكائن ثم أكد الحذف.');if(!obj)throw Error('الكائن غير موجود.');if(obj.protected)throw Error('Object is protected from accidental deletion.');delete r[a.entity][a.key];ok=true;output='Deleted: '+a.key;}
  else if(a.op==='member'){if(!r.groups[v.group]||!r.users[v.member]&&!r.groups[v.member])throw Error('Check Names: اسم غير موجود.');if(v.group===v.member||groupsFor(r,v.group).has(v.member))throw Error('عضوية دورية غير صالحة.');const g=r.groups[v.group];g.members=[...new Set([...(g.members||[]),v.member])];ok=match(v,a.values);output=g.members.join('\n');}
  else if(a.op==='login'){if(v.password!=='Pa$$w0rd')throw Error('كلمة مرور المختبر غير صحيحة.');const local=v.account==='.\\Administrator';if(!local&&v.account!=='Administrator'&&(!r.users[v.account]?.enabled||!r.users[v.account]?.passwordSet))throw Error('الحساب معطل أو لم تضبط كلمة مروره.');if(!local&&a.device.startsWith('LON-CL')&&!r.computers[a.device]?.trust)throw Error('The trust relationship failed. استخدم المسؤول المحلي للإصلاح.');if(a.device==='LON-DC1'&&v.account!=='Administrator'&&!groupsFor(r,v.account).has('Server Operators'))throw Error('هذا الحساب لا يملك تسجيل الدخول إلى DC1 في مختبر الدرس.');b.actor=local?'Administrator':v.account;ok=match(v,a.values);output='Signed in: '+v.account+' on '+a.device;}
  else if(a.op==='permission'){const allow=permission(r,b.actor,v.ou,v.kind,v.operation);denied=!allow;ok=allow===a.expectedAllowed&&match(v,a.values);const entities={User:'users',Group:'groups',OU:'ous',Computer:'computers'},entity=entities[v.kind],object='DelegationTest'+v.kind;if(allow){if(v.operation==='create'){if(r[entity][object])throw Error('الكائن التجريبي موجود؛ راجع الحذف قبل إعادة الإنشاء.');put(r,entity,object,{name:object,ou:v.ou,parent:v.ou,protected:false,enabled:true,passwordSet:true});}else if(v.operation==='delete'){if(!r[entity][object]||r[entity][object].ou!==v.ou)throw Error('الكائن المطلوب حذفه غير موجود داخل OU المحددة.');delete r[entity][object];}else if(v.operation==='reset-password'){if(!r.users.Connie)throw Error('حساب Connie غير موجود.');r.users.Connie.passwordSet=true;r.users.Connie.mustChange=true;}put(r,'permissionTests',a.id,{actor:b.actor,...v,object:v.operation==='reset-password'?'Connie':object,result:'allowed'});}output=allow?'Operation completed on '+(v.operation==='reset-password'?'Connie':object)+' inside '+v.ou:'Access is denied.';}
  else if(a.op==='copy-user'){const source=r.users[v.source];if(!source||r.users[v.name])throw Error('القالب غير موجود أو اسم المستخدم مستخدم. نقطة البداية لهذا الدرس لا تحتوي Ed.');if(v.password!=='Pa$$w0rd'||v.confirm!==v.password)throw Error('كلمتا المرور غير متطابقتين.');r.users[v.name]={...source,name:v.name,first:v.first,last:v.last,enabled:v.enabled,passwordSet:true,home:(source.home||'').replace('%username%',v.name)};for(const g of Object.values(r.groups))if(g.members?.includes(v.source))g.members.push(v.name);ok=match(v,a.values);output=JSON.stringify(r.users[v.name],null,2);}
  else if(a.op==='home'){const user=r.users[v.user],sh=r.shares['branch1-userdata'];if(b.actor!==v.user||!user?.enabled||!sh?.enabled||user.home!==`\\\\LON-DC1\\branch1-userdata\\${v.user}`||user.drive!=='Z:'||sh.permission!=='Full Control')throw Error('تعذر فتح المجلد المنزلي. راجع Profile والمشاركة والحساب.');ok=true;output='Z: → '+user.home+'\nFolder opened successfully.';}
  else if(a.op==='reset-computer'){const c=r.computers[v.computer];if(!c||!v.confirm||!permission(r,b.actor,c.ou,'Computer','reset'))throw Error('راجع الجهاز والتأكيد وصلاحية Computer objects.');c.trust=false;ok=true;output='Computer account reset. Existing secure channel invalidated.';}
  else if(a.op==='rejoin'){if(b.actor!=='Administrator'||v.account!=='Administrator'||v.password!=='Pa$$w0rd'||!same(v.domain,'Adatum.com')||!v.business||!v.domainNetwork||!v.reuse)throw Error('راجع حساب الإدارة وخيارات Network ID والمجال.');r.computers[v.computer].pendingTrust=true;ok=true;output='Network ID completed. Restart required.';}
  else if(a.op==='restart-client'){const c=r.computers[v.computer];if(!c?.pendingTrust)throw Error('لا توجد عملية إعادة انضمام مكتملة تنتظر التشغيل.');c.trust=true;c.pendingTrust=false;ok=true;output='Restart completed; verify domain sign-in.';}
  else if(a.op==='powershell'){output=powershell(s,v.command);const parsed=parseCommand(v.command),expected=parseCommand(a.values.command);ok=parsed.command===expected.command&&match(parsed.p,expected.p)&&expected.position.every((x,i)=>same(x,parsed.position[i]));if(a.id==='password')ok=false;}
  else if(a.op==='client-command'){const command=String(v.command||'').trim().toLowerCase(),face=r.interfaces[a.device];if(!face)throw Error('لا يوجد محول للعميل.');if(command==='ipconfig /renew')output=JSON.stringify(allocate(r,a.device),null,2);else if(command==='ipconfig /release'){delete r.leases[a.device];output='Lease released. IPv4: 0.0.0.0';}else if(command==='ipconfig /all'){output=JSON.stringify({adapter:'Ethernet',physicalAddress:face.mac,dhcpEnabled:face.auto,...r.leases[a.device]},null,2);if(a.id.includes('verify')||a.id.includes('result')||a.id==='final'){if(!r.leases[a.device])throw Error('لم يحصل العميل على إيجار.');}}else throw Error('الأمر المتاح هنا ipconfig /all أو /renew أو /release.');ok=same(v.command,a.values.command);}
  else if(a.op==='reservation'){if(!ip(v.ip)||!r.interfaces[v.client]||!Object.values(r.scopes).some(q=>num(v.ip)>=num(q.start)&&num(v.ip)<=num(q.end)))throw Error('العنوان خارج Scope أو العميل غير موجود.');if(Object.entries(r.reservations).some(([c,q])=>c!==v.client&&(q.mac===v.mac||q.ip===v.ip)))throw Error('عنوان أو MAC محجوز لعميل آخر.');put(r,'reservations',v.client,v);ok=match(v,a.values);output='Reservation saved. Renew the client to test it.';}
  else if(a.op==='dns-command'){const key=v.command==='Get-DnsServerRootHint'?'rootHints':v.command==='Get-DnsServerForwarder'?'forwarders':null;if(!key)throw Error('أمر DNS غير ممثل.');output=JSON.stringify(r.dnsSettings['LON-DC1'][key]);ok=same(v.command,a.values.command);}
  else if(a.op==='replicate'){if(v.from!=='LON-DC1'||v.to!=='LON-SVR1'||!r.servers[v.to]?.dc||!r.servers[v.to]?.dns)throw Error('راجع اتجاه الاتصال ودور DC وDNS على الوجهة.');r.dnsCopies[v.to]={zones:Object.values(r.zones).filter(z=>z.integrated).map(z=>z.name),records:Object.values(r.records).filter(q=>r.zones[q.zone]?.integrated),hasCore:!!r.records['LON-CORE.Adatum.com'],hasFileZone:false};ok=true;output=JSON.stringify(r.dnsCopies[v.to],null,2);}
  else if(a.op==='volume'){
   const ds=String(v.disks).split(',').map(x=>x.trim()),sizes=String(v.sizes).split(',').map(Number),type=v.type;
   if(!['Simple','Spanned','Striped','Mirrored','RAID-5'].includes(type)||!['NTFS','ReFS','FAT32'].includes(v.filesystem))throw Error('نوع الوحدة أو نظام الملفات غير صالح.');
   if(!v.name||r.volumes[v.name]||new Set(ds).size!==ds.length||sizes.length!==ds.length||sizes.some(x=>!Number.isInteger(x)||x<=0))throw Error('راجع الاسم والأقراص وأحجام الأجزاء.');
   if(type==='Simple'&&ds.length!==1||type==='Mirrored'&&ds.length!==2||type==='RAID-5'&&ds.length<3||['Spanned','Striped'].includes(type)&&ds.length<2)throw Error('عدد الأقراص لا يناسب النوع.');
   if(['Striped','Mirrored','RAID-5'].includes(type)&&new Set(sizes).size!==1)throw Error('هذا النوع يحتاج أجزاء متساوية.');
   if(!/^[F-Z]$/.test(v.letter)||Object.values(r.volumes).some(x=>x.letter===v.letter))throw Error('الحرف غير متاح.');
   ds.forEach((d,i)=>{const disk=r.disks[d];if(!disk||disk.protected||!disk.online||disk.style!=='GPT'||type!=='Simple'&&!disk.dynamic)throw Error('راجع Online وGPT وDynamic لأقراص المختبر فقط.');if(disk.extents.reduce((n,e)=>n+e.size,0)+sizes[i]>disk.capacity)throw Error('المساحة غير كافية على Disk '+d);});
   const capacity=type==='Mirrored'?sizes[0]:type==='RAID-5'?(ds.length-1)*sizes[0]:sizes.reduce((a,b)=>a+b,0);
   r.volumes[v.name]={...v,disks:ds,sizes,capacity,healthy:!['Mirrored','RAID-5'].includes(type),file:null};ds.forEach((d,i)=>r.disks[d].extents.push({name:v.name,size:sizes[i]}));ok=match(v,a.values);output=JSON.stringify(r.volumes[v.name],null,2);
  }else if(a.op==='resize'){const vol=r.volumes[v.name],amount=Number(v.amount);if(!vol||!Number.isInteger(amount)||amount<=0||vol.type!=='Simple')throw Error('وحدة بسيطة ومقدار موجب مطلوبان.');const disk=r.disks[vol.disks[0]],ix=disk.extents.findIndex(e=>e.name===v.name);if(v.mode==='Shrink'){if(vol.filesystem!=='NTFS'||amount>=vol.capacity)throw Error('يمكن تقليص NTFS بمقدار أقل من سعته.');vol.capacity-=amount;disk.extents[ix].size-=amount;disk.extents.splice(ix+1,0,{name:null,size:amount});}else if(v.mode==='Extend'){if(disk.extents.slice(ix+1).some(e=>e.name)||disk.capacity-disk.extents.reduce((n,e)=>n+e.size,0)<amount)throw Error('التوسيع يحتاج مساحة متجاورة بعد الوحدة.');vol.capacity+=amount;disk.extents[ix].size+=amount;}else throw Error('اختر Shrink أو Extend.');ok=match(v,a.values);output=v.name+': '+vol.capacity+' MB';}
  else if(a.op==='sync'){const vol=r.volumes[v.name];if(!vol)throw Error('الوحدة غير موجودة.');vol.healthy=true;ok=true;output=v.name+' — Healthy — '+vol.capacity+' MB (محاكاة زمن المزامنة).';}
  else if(a.op==='volume-file'){const vol=r.volumes[v.volume];if(!vol?.healthy)throw Error('انتظر Healthy.');vol.file=v.text;ok=match(v,a.values);output='Opened '+v.name+': '+vol.file;}
  else if(a.op==='mirror'){const vol=r.volumes[v.name];if(!vol||!v.confirm)throw Error('راجع الوحدة وأكد التغيير.');if(v.mode==='Break'){if(vol.type!=='Mirrored'||!vol.disks.includes(v.disk))throw Error('اختر عضوًا صحيحًا في وحدة مرآة.');vol.type='Simple';vol.detached={disk:v.disk,file:vol.file,size:vol.capacity};vol.disks=vol.disks.filter(d=>d!==v.disk);vol.sizes=[vol.capacity];}else if(v.mode==='Delete detached'){if(!vol.detached||vol.detached.disk!==v.disk)throw Error('اختر العضو المنفصل في هذه التجربة.');r.disks[v.disk].extents=r.disks[v.disk].extents.filter(e=>e.name!==v.name);vol.detached=null;}else if(v.mode==='Remove'){if(vol.type!=='Mirrored'||!vol.disks.includes(v.disk))throw Error('Remove Mirror يحتاج مرآة وعضوًا صحيحًا.');r.disks[v.disk].extents=r.disks[v.disk].extents.filter(e=>e.name!==v.name);vol.disks=vol.disks.filter(d=>d!==v.disk);vol.sizes=[vol.capacity];vol.type='Simple';}else if(v.mode==='Add'||v.mode==='Add again'){const d=r.disks[v.disk];if(vol.type!=='Simple'||!d?.online||!d?.dynamic||vol.disks.includes(v.disk)||d.capacity-d.extents.reduce((n,e)=>n+e.size,0)<vol.capacity)throw Error('الهدف غير مناسب للمرآة.');d.extents.push({name:v.name,size:vol.capacity});vol.disks.push(v.disk);vol.sizes=[vol.capacity,vol.capacity];vol.type='Mirrored';vol.healthy=false;}else throw Error('عملية مرآة غير صالحة.');ok=match(v,a.values);output=JSON.stringify(vol,null,2);}
  else if(a.op==='file-access'){const allow=fileAllowed(r,b.actor,v.share,v.folder);denied=!allow;ok=allow===a.expectedAllowed;output=allow?'Folder opened: '+v.folder:'Access is denied.';}
  else if(a.op==='enumerate'){const sh=r.shares[v.share];if(!sh?.enabled)throw Error('المشاركة غير موجودة.');const visible=Object.keys(r.folders).filter(k=>k!=='Data'&&(!sh.abe||fileAllowed(r,b.actor,v.share,k)));output=visible.join('\n');ok=sh.abe&&visible.length===1&&visible[0]==='Development';}
  else if(a.op==='pool'){const p=r.printers[v.printer];if(!p||!v.ports?.every(k=>r.ports[k]))throw Error('الطابعة أو أحد المنافذ غير موجود.');if(!v.pooling&&v.ports.length>1)throw Error('فعّل Printer Pooling لاختيار أكثر من منفذ.');p.pooling=v.pooling;p.ports=v.ports;ok=match(v,a.values);output=JSON.stringify(p,null,2);}
  else if(a.op==='printer-client'){const p=r.printers[v.printer];if(!p?.shared||!p.listed||!v.acceptDriver)throw Error('الطابعة غير مشتركة/منشورة أو لم تقبل برنامج التشغيل.');r.clientPrinters[a.device]={name:v.printer,server:'LON-SVR1',driver:p.driver};ok=match(v,a.values);output='Printer added to Devices and Printers; no physical print job performed.';}
  else if(a.op==='gpo'){const starter=r.starters[v.starter];if(!starter||!r.ous[v.container]&&v.container!=='Adatum.com')throw Error('القالب أو حاوية الربط غير موجودين.');if(r.gpos[v.name])throw Error('GPO موجودة؛ لا تنشئ نسخة مكررة.');r.gpos[v.name]={...v,settings:clone(starter)};ok=match(v,a.values);output=JSON.stringify(r.gpos[v.name],null,2);}
  else if(a.op==='policy-test'){if(v.computerOU==='IT'&&v.test==='USB allowed'&&r.computers['LON-CL1'].ou!=='IT')throw Error('حساب الكمبيوتر لم يُنقل إلى IT.');const effective=effectivePolicy(r,v.computerOU,v.userOU);if(v.test==='General page')ok=effective.general==='Enabled';else if(v.test==='USB denied')ok=['read','write','execute'].every(k=>effective[k]==='Enabled');else ok=['read','write','execute'].every(k=>effective[k]==='Disabled');output=JSON.stringify({effective,generalPage:effective.general!=='Enabled',read:effective.read!=='Enabled',write:effective.write!=='Enabled',execute:effective.execute!=='Enabled'},null,2);}
  else throw Error('Unsupported laboratory operation.');
  b.issues??={};if(ok)delete b.issues[a.id];else if(JSON.stringify(before)!==JSON.stringify(r)&&!b.passwordStage)b.issues[a.id]=a.title;
  s.revision++;b.proofs[a.id]={ok,revision:s.revision,actor:b.actor,device:b.device,denied};
  b.events=[...b.events.slice(-299),{id:a.id,revision:s.revision,ok,actor:b.actor,device:b.device,denied}];
 }catch(error){b.resources=before;output=error.message;b.proofs[a.id]={ok:false,revision:s.revision,actor:b.actor,device:b.device,error:true};}
 b.output=output;s.message=output;s.lastCheck=null;return s;
}
function machines(t){return [...new Set([t.host,...t.actions.map(a=>a.device)])];}
api.tasks.push(...catalog);api.curriculum=catalog;api.isCurriculum=id=>!!def(id);api.machines=id=>machines(def(id));
api.target=(id,v)=>def(id)?{...base.target(id,0),name:def(id).host}:base.target(id,v);api.create=create;api.act=act;
function finalState(s){const r=s.lab.resources,n=def(s.id).lesson;
 if(n===4)return ['tree','child','forest'].every(k=>r.domains[k]&&r.domainOptions[k]?.passwordSet);
 if(n===5)return !r.ous['Temporary OU']&&['Holly','Bart','Ed','Connie','Barbara','Arlene'].every(k=>r.users[k]?.ou==='Branch Office 1')&&r.computers['LON-CL1'].ou==='Branch Office 1';
 if(n===6)return permission(r,'Bart','Branch Office 1','User','reset-password')&&!permission(r,'Bart','Branch Office 1','User','delete')&&!permission(r,'Holly','Sales','User','delete')&&r.users.Connie?.mustChange;
 if(n===7)return r.users._Branch_template?.enabled===false&&r.users.Ed?.enabled&&r.users.Ed.home.endsWith('\\Ed')&&r.groups['Branch 1 Users'].members.includes('Ed');
 if(n===8)return r.computers['LON-CL1'].trust&&!r.computers['LON-CL1'].pendingTrust;
 if(n===9)return r.computers.PC1?.ou==='CTE2'&&permission(r,'Adel','CTE1','User','create')&&!permission(r,'Adel','CTE1','OU','create')&&permission(r,'Ed','Marketing','OU','create')&&!permission(r,'Ed','CTE1','Group','modify');
 if(n===10)return r.users.Ty?.enabled&&r.users.Ty?.passwordSet&&r.groups.LondonBranchUsers?.members.includes('Ty');
 if(n===11)return r.leases['LON-CORE']?.ip==='172.16.0.105'&&r.leases['LON-CL1']?.ip!=='172.16.0.191'&&!!r.leases['LON-CL1']&&!r.reservations['LON-CL1'];
 if(n===12||n===13)return r.leases['LON-CL2']?.ip==='10.10.0.111'&&r.leases['LON-CORE']?.ip==='172.16.0.111'&&r.relay.Remote?.enabled;
 if(n===14)return r.dnsCopies['LON-SVR1']?.hasCore===true&&r.dnsCopies['LON-SVR1']?.hasFileZone===false&&r.zones['contoso.com']?.integrated===false;
 if(n===15||n===16)return r.volumes.Mirror?.type==='Mirrored'&&r.volumes.Mirror?.healthy&&r.volumes.Mirror?.file==='Lab data'&&r.volumes.Volume1?.capacity===3072&&r.volumes.Volume2?.capacity===6144&&r.volumes.Parity?.capacity===(n===15?8192:4096);
 if(n===17)return fileAllowed(r,'Bernard','Data','Development')&&['Marketing','Research','Sales'].every(k=>!fileAllowed(r,'Bernard','Data',k))&&r.shares.Data?.abe&&r.shares.Data?.caching==='None';
 if(n===18||n===19)return r.printers['Branch Office Printer']?.pooling&&r.printers['Branch Office Printer'].ports?.length===2&&r.clientPrinters['LON-CL1']?.name==='Branch Office Printer';
 if(n===20){const e=effectivePolicy(r,'IT','Users');return r.computers['LON-CL1'].ou==='IT'&&e.read==='Disabled'&&e.write==='Disabled'&&e.execute==='Disabled'&&e.general==='Enabled';}
 return false;
}
api.inspect=s=>{if(!def(s.id))return base.inspect(s);const checks=def(s.id).actions.map(a=>({label:a.title+' · المشهد '+a.scene,ok:!!s.lab.proofs[a.id]?.ok}));checks.push({label:'الإعدادات النهائية وآثارها الحالية',ok:!!finalState(s)});for(const title of Object.values(s.lab.issues||{}))checks.push({label:'راجع الإعداد غير المطابق: '+title,ok:false});return {passed:checks.length>0&&checks.every(c=>c.ok),checks};};
api.labInternals={permission,allocate,effectivePolicy,fileAllowed,match,seed,parseCommand};
})(typeof window==='undefined'?globalThis:window);
