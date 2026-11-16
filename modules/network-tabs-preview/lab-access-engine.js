// These controls are shared by every workspace, including previously saved labs.
q('#nf-all').onclick=()=>{fitDevicesToView();wake();save();};
cableCompatible=function(c){
 if(!c.a||!c.b)return false;const a=labPortKind(c.a),b=labPortKind(c.b);
 if(c.type==='console')return [a,b].sort().join('|')==='console|rs232';
 if(c.type==='serial')return a==='serial'&&b==='serial'&&[c.a,c.b].includes(c.dce);
 if(a!=='ethernet'||b!=='ethernet')return false;return practicalCableCompatible(c);
};
network.env.serialRole=k=>{const c=cableFor(k);return c?.type==='serial'&&cableCompatible(c)?(c.dce===k?'DCE':'DTE'):null;};
network.env.consoleConnected=(pc,id)=>{const c=cableFor(pc+':RS232');return !!c&&c.type==='console'&&peer(c,pc+':RS232')===id+':Console'&&cableCompatible(c)&&power[pc]&&power[id];};
const hardwareConnectTo=connectTo;
connectTo=function(c,side,key){const other=side===0?c.b:c.a,oldKey=c[side===0?'a':'b']||c[side===0?'homeA':'homeB'],wasDCE=c.dce===oldKey,type=c.autoPending?recommendedCable(other,key):c.type;
 if(cableFor(key)&&cableFor(key)!==c)return;
 if(other){const kinds=[labPortKind(other),labPortKind(key)].sort().join('|');if(type==='console'&&kinds!=='console|rs232'||type==='serial'&&kinds!=='serial|serial'||!['console','serial'].includes(type)&&kinds!=='ethernet|ethernet'){announce('لا يدخل هذا الموصل في المنفذ المختار؛ طابق Console أو Serial أو Ethernet.');return;}}
 if(wasDCE)c.dce=key;hardwareConnectTo(c,side,key);if(c[side===0?'a':'b']===key)recolorCable(c,c.type);
};
root.labsBridge.setDCE=function(){const c=cableFor(selected);if(!c||c.type!=='serial'||busy)return false;rememberEdit();c.dce=selected;recolorCable(c,c.type);invalidatePing();updateUI();save();wake();return true;};
const priorCableInfo=root.labsBridge.cableInfo;root.labsBridge.cableInfo=id=>{const info=priorCableInfo(id),c=cables.find(c=>c.id===id);if(info&&c?.type==='serial')info.label+=' · DCE: '+(c.dce||'غير موصول');return info;};
const priorCableFingerprint=root.labsBridge.fingerprint;root.labsBridge.fingerprint=()=>priorCableFingerprint()+JSON.stringify(cables.map(c=>[c.id,c.type,c.dce]));
const dataPortUp=network.env.up;network.env.up=k=>!['console','rs232'].includes(labPortKind(k))&&dataPortUp(k);
const accessRefresh=refreshCli;
refreshCli=function(){accessRefresh();const s=ios.session(ports[selected]?.id||cliDevice);cliInput.type=s.auth?'password':'text';cliInput.placeholder=s.auth?'كلمة مرور المختبر':'?';q('#nf-cli-help').disabled=!!s.auth;if(s.auth){q('#nf-mode-title').textContent='Authentication · تسجيل الدخول';q('#nf-mode-explain').textContent='أدخل كلمة المرور التي أعددتها؛ لن تظهر أحرفها أو تُضاف إلى سجل الأوامر.';}};
root.labsBridge.chooseCable=type=>{if(busy||wireDrag||linking||!['auto',...Object.keys(cableTypes)].includes(type))return false;cableChoice=type;save();return true;};
root.labsBridge.practical.connect=function(a,b,type='auto',dce=null){
 if(!ports[a]||!ports[b]||a.split(':')[0]===b.split(':')[0])return {ok:false,message:'اختر منفذين موجودين في جهازين مختلفين.'};
 if(cableFor(a)||cableFor(b))return {ok:false,message:'المنفذ مشغول؛ افصل الوصلة السابقة أولًا.'};
 type=type==='auto'?recommendedCable(a,b):type;if(!cableTypes[type])return {ok:false,message:'نوع كابل غير متاح.'};
 const candidate={a,b,type,dce:type==='serial'?(dce||a):null};if(!cableCompatible(candidate))return {ok:false,message:'نوع الكابل لا يناسب المنفذين. Console ↔ RS232، وSerial ↔ Serial، وEthernet ↔ Ethernet.'};
 rememberEdit();makeCable('manual-'+crypto.randomUUID(),a,b,cableTypes[type].color,null,{type,dce:candidate.dce});afterEdit();save();return {ok:true};
};
const terminal=document.createElement('details');terminal.id='ml-terminal';terminal.innerHTML='<summary>Console وTerminal · اتصال إدارة الجهاز</summary><p>Console اتصال محلي للإعداد لا يحتاج عنوان IP. صِل RS232 في PC بمنفذ Console في Router أو Switch، ثم افتح Terminal.</p><div class="mp-terminal-fields"><label>الحاسب<select id="ml-terminal-pc"></select></label><label>الجهاز<select id="ml-terminal-device"></select></label><label>Bits per second<select id="ml-terminal-baud"><option>9600</option><option>19200</option><option>115200</option></select></label><label>Data bits<select id="ml-terminal-bits"><option>8</option><option>7</option></select></label><label>Parity<select id="ml-terminal-parity"><option>None</option><option>Even</option><option>Odd</option></select></label><label>Stop bits<select id="ml-terminal-stop"><option>1</option><option>2</option></select></label><label>Flow control<select id="ml-terminal-flow"><option>None</option><option>Hardware</option></select></label></div><button id="ml-terminal-connect">وصّل كابل Console</button><button id="ml-terminal-open">افتح Terminal</button><button id="ml-terminal-disconnect">افصل كابل Console</button><p id="ml-terminal-result" role="status"></p><p class="mp-muted">النافذة أدناه تمثل جلسة الجهاز المحلي. إغلاقها لا يمسح إعداده. VTY يُضبط وفق المصدر؛ الاتصال البعيد خارج نطاق هذه المحاكاة.</p>';
q('#nf-console').before(terminal);
let terminalKey='';function refreshTerminal(){const key=Object.keys(devices).join('|');if(key===terminalKey)return;terminalKey=key;for(const[selector,isPC]of [['#ml-terminal-pc',true],['#ml-terminal-device',false]]){const el=q(selector),old=el.value;el.replaceChildren(...Object.keys(devices).filter(d=>(devices[d].type==='PC')===isPC).map(d=>{const o=document.createElement('option');o.value=d;o.textContent=d;return o;}));if([...el.options].some(o=>o.value===old))el.value=old;}}
root.addEventListener('labs:context',refreshTerminal);refreshTerminal();
q('#ml-terminal-connect').onclick=()=>{const r=root.labsBridge.practical.connect(q('#ml-terminal-pc').value+':RS232',q('#ml-terminal-device').value+':Console','console');q('#ml-terminal-result').textContent=r.ok?'الكابل موصول؛ افتح Terminal للدخول.':r.message;};
q('#ml-terminal-disconnect').onclick=()=>{const pc=q('#ml-terminal-pc').value;root.labsBridge.practical.disconnect(pc+':RS232');q('#ml-terminal-result').textContent='فُصل Console. إعدادات الجهاز باقية.';};
q('#ml-terminal-open').onclick=()=>{
 const pc=q('#ml-terminal-pc').value,id=q('#ml-terminal-device').value;
 if(!network.env.consoleConnected(pc,id)){q('#ml-terminal-result').textContent='لا يوجد اتصال Console صحيح بين الجهازين، أو أحدهما مطفأ.';return;}
 if(q('#ml-terminal-baud').value!=='9600'||q('#ml-terminal-bits').value!=='8'||q('#ml-terminal-parity').value!=='None'||q('#ml-terminal-stop').value!=='1'||q('#ml-terminal-flow').value!=='None'){q('#ml-terminal-result').textContent='إعدادات Terminal لا تطابق منفذ الجهاز في المختبر: 9600، 8، None، 1، None.';return;}
 ios.openConsole(id,pc);selectDevice(id);cliDetails.open=true;refreshCli();save();q('#ml-terminal-result').textContent='جلسة Console: '+pc+' → '+id;root.dispatchEvent(new CustomEvent('labs:practical-command',{detail:{device:id,command:'open console',ok:true,at:new Date().toISOString()}}));cliInput.focus();
};
