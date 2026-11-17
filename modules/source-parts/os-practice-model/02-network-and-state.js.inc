const same=(a,b)=>String(a).trim().toLowerCase()===String(b).trim().toLowerCase();
 const ipv4=x=>/^(\d{1,3}\.){3}\d{1,3}$/.test(x)&&x.split('.').every(n=>Number(n)<=255);
 function canResolve(s){const g=target(s.id,s.variant);return s.dcOn&&s.mask===g.mask&&ipv4(s.ip)&&s.ip.startsWith(g.ip.slice(0,g.ip.lastIndexOf('.'))+'.')&&s.ip!==g.dns&&s.dns===g.dns;}
 function touch(s){s.revision++;s.lastCheck=null;}
 function out(s,text){s.output=[...s.output.slice(-49),text];s.message=text;}
 function reboot(s){if(s.pendingName){s.name=s.pendingName;s.pendingName='';}if(s.pendingDomain){s.domain=s.pendingDomain;s.pendingDomain='';}if(s.pendingDC){s.dc=true;s.pendingDC=false;}s.session='local';s.shell='prompt';touch(s);out(s,'اكتملت إعادة التشغيل داخل المحاكاة. الحساب الحالي محلي؛ اختر حساب المجال إذا طلبته المهمة.');}
 function join(s,domain,auth){if(!canResolve(s))return out(s,'تعذر العثور على DC في المحاكاة. راجع إعداد الشبكة وDNS وتشغيل DC1.');if(!same(domain,'adatum.com'))return out(s,'هذا المجال غير موجود في بيئة التدريب.');if(auth!=='domain')return out(s,'استخدم حساب المجال التجريبي المخوّل، لا الحساب المحلي.');s.pendingDomain='adatum.com';touch(s);out(s,'Welcome to adatum.com. العضوية تنتظر إعادة التشغيل.');}
 