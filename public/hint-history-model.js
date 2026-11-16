(function(root){
 'use strict';
 const labels={1:'تلميح من الدرجة الأولى',2:'تلميح من الدرجة الثانية',3:'تلميح من الدرجة الثالثة',full:'كشف الخطوة كاملة'}, scopes={vlan:'VLAN',trunk:'Trunk',inter:'Inter-VLAN',all:'VLAN وTrunk وInter-VLAN'};
 const text=v=>typeof v==='string'?v:'', arr=v=>Array.isArray(v)?v:[], copy=v=>JSON.parse(JSON.stringify(v));
 const level=v=>v==='full'||v===4?'full':[1,2,3].includes(Number(v))?Number(v):null;
 const time=v=>typeof v==='string'&&Number.isFinite(Date.parse(v))?Date.parse(v):null;
 function project(state){
  if(!state)return {records:[],labs:[]};
  if(state.schema!==1||!Array.isArray(state.labs))throw Error('صيغة المختبرات غير معروفة؛ لم نغيّر بياناتك.');
  const labs=state.labs.map(x=>({...x}));
  if(state.lastDeletedLab?.lab&&!labs.some(x=>x.id===state.lastDeletedLab.lab.id))labs.push({...state.lastDeletedLab.lab,deleted:true});
  const byId=new Map(labs.map(l=>[l.id,l])), rows=new Map();
  function lineage(l){const seen=new Set();while(l.cloneOf&&!l.helper&&!seen.has(l.id)){seen.add(l.id);const p=byId.get(l.cloneOf);if(!p)return l.cloneOf;l=p;}return l.id;}
  const meta=l=>({id:text(l.id),name:text(l.name)||'مختبر بلا اسم',kind:l.helper?'المحاكي المساعد':l.kind==='original'?'مختبر الدرس أو التمرين':'مختبر مستقل',hidden:!!l.hidden,deleted:!!l.deleted,copy:!!l.cloneOf&&!l.helper,course:text(l.course),scope:text(l.training?.scope),lineage:lineage(l)});
  for(const lab of labs){
   const m=meta(lab), archives=[...arr(lab.helpArchive),...arr(lab.training?.archive)].filter(x=>x&&typeof x==='object');
   const events=arr(lab.data?.assistance?.events).filter(e=>Array.isArray(e)&&e.length>=4);
   const keys=new Set(events.map(e=>JSON.stringify(e.slice(0,3))));
   for(const r of archives)if(!keys.has(JSON.stringify([r.attempt,r.key,r.hint]))){events.push([r.attempt,r.key,r.hint,r.level,r.at]);keys.add(JSON.stringify([r.attempt,r.key,r.hint]));}
   for(const e of events){
    if(!e.slice(0,3).every(v=>typeof v==='string'&&v))continue;
    // Legacy helpers can share "preview-1"; lineage prevents merging unrelated labs.
    const id=JSON.stringify([m.lineage,...e.slice(0,5)]), record=archives.find(r=>r.attempt===e[0]&&r.key===e[1]&&r.hint===e[2]), degree=level(e[3]);
    let row=rows.get(id);
    if(!row){row={id,group:JSON.stringify([m.lineage,e[0],e[1]]),attemptGroup:JSON.stringify([m.lineage,e[0]]),attempt:e[0],key:e[1],hint:e[2],level:degree,label:labels[degree]||'درجة غير مسجلة',at:time(e[4])===null?null:e[4],goal:null,body:null,remaining:null,context:null,locations:[],feedback:[],rawEvent:copy(e)};rows.set(id,row);}
    if(record){if(!row.body&&text(record.body)){row.goal=text(record.goal)||null;row.body=record.body;row.remaining=text(record.remaining)||null;row.context=record.context?copy(record.context):null;}row.goal ||= text(record.goal)||null;}
    if(!row.locations.some(x=>x.id===m.id))row.locations.push(m);
    for(const f of arr(lab.data?.assistance?.feedback))if(Array.isArray(f)&&f[0]===e[0]&&f[1]===e[1]&&f[2]===e[2]&&!row.feedback.some(x=>JSON.stringify(x)===JSON.stringify(f)))row.feedback.push(copy(f));
   }
  }
  const records=[...rows.values()], groups=new Map();
  for(const r of records){if(!groups.has(r.group))groups.set(r.group,[]);groups.get(r.group).push(r);}
  for(const r of records){const group=groups.get(r.group);r.count=new Set(group.map(x=>x.hint)).size;r.strongest=group.some(x=>x.level==='full')?'full':Math.max(0,...group.map(x=>x.level||0))||null;r.scope=r.context?.scope||r.locations.find(x=>x.scope)?.scope||'';r.scopeLabel=scopes[r.scope]||'نطاق غير مسجل';r.goal||='خطوة سابقة — '+r.key.split('@')[0];}
  records.sort((a,b)=>(time(b.at)??-Infinity)-(time(a.at)??-Infinity)||a.id.localeCompare(b.id));
  return {records,labs:labs.map(meta)};
 }
 async function decode(snapshot){
  if(snapshot==null)return null;
  if(snapshot.privateContent?.format!=='madar-tabs-gzip-1'||typeof snapshot.privateContent.data!=='string')throw Error('صيغة الحفظ غير مدعومة في السجل؛ لم نغيّر بياناتك.');
  const input=snapshot.privateContent.data;if(input.length>2000000)throw Error('ملف السجل أكبر من حد القراءة الآمنة.');
  const bytes=Uint8Array.from(atob(input),c=>c.charCodeAt(0)), reader=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip')).getReader();
  const chunks=[];let length=0;
  try{for(;;){const {done,value}=await reader.read();if(done)break;length+=value.length;if(length>32*1024*1024)throw Error('حجم السجل بعد فك الضغط أكبر من حد القراءة الآمنة.');chunks.push(value);}}finally{await reader.cancel().catch(()=>{});}
  return JSON.parse(await new Blob(chunks).text());
 }
 function filter(records,{query='',lab='',degree='',scope='',attempt='',sort='new'}={}){
  const words=query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return records.filter(r=>(!lab||r.locations.some(x=>x.id===lab))&&(!degree||String(r.level)===degree)&&(!scope||r.scope===scope)&&(!attempt||r.attemptGroup===attempt)&&words.every(w=>[r.goal,r.body,r.remaining,r.key,r.hint,...r.locations.map(x=>x.name)].join(' ').toLocaleLowerCase().includes(w))).sort((a,b)=>{const ta=time(a.at),tb=time(b.at);if(ta===null)return tb===null?0:1;if(tb===null)return -1;return sort==='old'?ta-tb:tb-ta;});
 }
 const api={project,decode,filter,labels,scopes,time};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MadarHintHistory=api;
})(globalThis);
