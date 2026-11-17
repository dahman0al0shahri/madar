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
 