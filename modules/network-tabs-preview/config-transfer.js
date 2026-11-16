// Configuration transfer is explicit and independent of the bounded CLI transcript.
// Store a reversible field patch, never a whole-lab rollback.
const transferTools=document.createElement('div');transferTools.className='ml-transfer-tools';
transferTools.innerHTML='<button id="ml-transfer-config" type="button">نسخ إعدادات الأوامر إلى تبويب آخر</button><button id="ml-undo-config" type="button" disabled>تراجع عن نقل الإعدادات</button>';
$('#ml-context').after(transferTools);
const configEqual=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const configObject=x=>!!x&&typeof x==='object'&&!Array.isArray(x);
function configDiff(before,after,path=[],out=[]){
 if(configEqual(before,after))return out;
 if(configObject(before)&&configObject(after)){
  for(const k of new Set([...Object.keys(before),...Object.keys(after)]))configDiff(before[k],after[k],[...path,k],out);
 }else out.push({path,before:before===undefined?null:clone(before),after:after===undefined?null:clone(after),hadBefore:before!==undefined,hasAfter:after!==undefined});
 return out;
}
function configAt(object,path){return path.reduce((v,k)=>v?.[k],object);}
function configSet(object,path,value,present){
 let p=object;for(const k of path.slice(0,-1)){if(!configObject(p[k]))p[k]={};p=p[k];}
 if(present)p[path.at(-1)]=clone(value);else delete p[path.at(-1)];
}
function configPayload(data,id){return {network:clone(data.network[id]),admin:Object.fromEntries(Object.entries(data.admin||{}).filter(([k])=>k.startsWith(id+':')).map(([k,v])=>[k.slice(id.length+1),v]))};}
function writeConfig(data,id,value){
 data.network[id]=clone(value.network);
 for(const k of Object.keys(data.admin||{}))if(k.startsWith(id+':'))delete data.admin[k];
 for(const[k,v]of Object.entries(value.admin))data.admin[id+':'+k]=v;
 // Retain the transcript, but do not leave a prompt pointing to a removed interface/VLAN.
 const session=data.cli?.[id];if(session){session.mode='user';session.port=null;session.range=[];session.vlan=null;session.pending=null;}
}
function invalidateConfig(a){
 a.revision++;a.verdict='';a.data.editUndo=null;
 if(a.training){a.training.completed=false;a.training.checks={};a.training.observed={};}
 clearTimeout(pendingPings.get(a.id));pendingPings.delete(a.id);
 a.data.ui={...a.data.ui,pingResult:'تغيّرت الإعدادات؛ أعد فحص الاتصال.',pingOk:null,pingPending:false,pingTrace:''};
}
function renderConfigTransfer(){
 $('#ml-transfer-config').disabled=B.busy()||state.labs.length<2;
 $('#ml-undo-config').disabled=B.busy()||!active().configUndo?.devices?.length;
}
$('#ml-transfer-config').onclick=()=>{
 if(B.busy())return;capture();const source=active(),sourceId=source.id;
 const destinations=state.labs.filter(a=>a.id!==sourceId);
 modal('نسخ إعدادات الأوامر',`<p>من <strong>${esc(source.name)}</strong>. اختر الوجهة ثم طبّق. تُستبدل إعدادات الأجهزة المقابلة، بما فيها إعداداتها المحفوظة، دون نقل الأجهزة أو الكابلات أو سجل المساعدة.</p><label>إلى التبويب<select id="ml-transfer-target">${destinations.map(a=>`<option value="${esc(a.id)}">${esc(a.name)}${a.course?' · '+esc(courseNames[a.course]||a.course):''}${a.hidden?' · مخفي':''}</option>`).join('')}</select></label><div id="ml-transfer-map"></div><p id="ml-transfer-note" role="status"></p><button id="ml-transfer-apply" type="button">طبّق الإعدادات</button>`);
 const validate=()=>{
  const values=[...body.querySelectorAll('[data-config-source]')].map(x=>x.value),valid=values.length>0&&values.every(Boolean)&&new Set(values).size===values.length;
  $('#ml-transfer-apply').disabled=!valid;
  $('#ml-transfer-note').textContent=valid?'التراجع متاح داخل تبويب الوجهة. النقل لا يعني أن التطبيق صحيح أو أنك نفّذته باستقلال.':'اختر جهازًا مختلفًا من النوع نفسه لكل جهاز مصدر. إذا كانت الوجهة فارغة، أضف الأجهزة أو انسخها أولًا.';
 };
 const draw=()=>{
  const target=lab($('#ml-transfer-target').value);if(!target)return;
  $('#ml-transfer-map').innerHTML=Object.entries(source.data.devices).map(([id,d])=>{
   const choices=Object.entries(target.data.devices).filter(([,v])=>v.type===d.type);
   return `<label class="ml-config-map"><bdi>${esc(source.aliases[id]||id)} · ${d.type==='S'?'Switch':d.type==='R'?'Router':'PC'}</bdi><select data-config-source="${esc(id)}" aria-label="الجهاز المقابل لـ ${esc(id)}"><option value="">اختر الجهاز المقابل</option>${choices.map(([key])=>`<option value="${esc(key)}" ${key===id?'selected':''}>${esc(target.aliases[key]||key)} (${esc(key)})</option>`).join('')}</select></label>`;
  }).join('');
  body.querySelectorAll('[data-config-source]').forEach(s=>s.onchange=validate);validate();
 };
 $('#ml-transfer-target').onchange=draw;draw();
 $('#ml-transfer-apply').onclick=()=>{
  if(B.busy()||active().id!==sourceId)return;capture();
  const target=lab($('#ml-transfer-target').value);if(!target||target===source)return;
  const pairs=[...body.querySelectorAll('[data-config-source]')].map(x=>[x.dataset.configSource,x.value]);
  if(!pairs.length||new Set(pairs.map(x=>x[1])).size!==pairs.length||pairs.some(([s,d])=>!source.data.devices[s]||!target.data.devices[d]||source.data.devices[s].type!==target.data.devices[d].type))return;
  const entries=pairs.map(([s,d])=>{const before=configPayload(target.data,d),after=configPayload(source.data,s);return {id:d,instance:target.data.devices[d].instanceId,patch:configDiff(before,after),after};}).filter(x=>x.patch.length);
  if(!entries.length){close();toast('الإعدادات موجودة بالفعل في تبويب الوجهة؛ لم يتغير شيء.');return;}
  for(const e of entries)writeConfig(target.data,e.id,e.after);
  target.configUndo={source:source.name,at:Date.now(),devices:entries.map(({after,...e})=>e)};
  target.copied=true;if(target.training?.selfTest)target.training.selfTest.copied=true;if(target.training?.assessment)target.training.assessment.helpUsed=true;
  invalidateConfig(target);target.logs.push({text:`نُقلت إعدادات ${entries.length} أجهزة من ${source.name}. لم يُتحقق من صحتها بعد.`,at:Date.now()});target.logOpen=true;
  close();activate(target.id);toast('طُبّقت الإعدادات في هذا التبويب. يمكنك التراجع من «تراجع عن نقل الإعدادات».');
 };
};
$('#ml-undo-config').onclick=()=>{
 if(B.busy())return;capture();const a=active(),undo=a.configUndo;if(!undo)return;
 let restored=0,kept=0;
 for(const e of undo.devices){
  if(!e.instance||a.data.devices[e.id]?.instanceId!==e.instance){kept+=e.patch.length;continue;}
  const current=configPayload(a.data,e.id);let count=0;
  for(const p of e.patch){const now=configAt(current,p.path),expected=p.hasAfter?p.after:undefined;
   if(configEqual(now,expected)){configSet(current,p.path,p.before,p.hadBefore);restored++;count++;}else kept++;
  }
  if(count)writeConfig(a.data,e.id,current);
 }
 a.configUndo=null;
 if(restored){invalidateConfig(a);loading=true;try{B.restore(a.data);}finally{loading=false;}}
 a.logs.push({text:'تراجع عن نقل الإعدادات: '+restored+' تغييرًا مستعادًا'+(kept?'؛ بقيت '+kept+' تغييرات لأن إعدادها أو جهازها تغيّر لاحقًا.':'.'),at:Date.now()});
 changed('view');render();toast('تم التراجع عن الإعدادات التي لم تتغير بعد النقل.'+(kept?' احتفظنا بالتعديلات اللاحقة والأجهزة البديلة.':''));
};
