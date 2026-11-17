function repairCopyNumbering(s){
 if(s.copyNumberingVersion===2)return repairLabLifecycle(s);
 s.copyCounters=s.copyCounters||{};
 for(const group of new Set(s.labs.filter(x=>x.helper&&x.cloneOf).map(x=>x.cloneOf))){
  const source=s.labs.find(x=>x.id===group);if(!source)continue;
  const copies=s.labs.filter(x=>x.cloneOf===group&&!x.helper).sort((a,b)=>(a.copyNumber||0)-(b.copyNumber||0));
  copies.forEach((x,i)=>{x.copyNumber=i+1;if(!x.custom)x.name=`نسخة ${copies.length===1?'':(i+1).toLocaleString('ar-SA')+' '}من ${source.name}`;});
  s.copyCounters[group]=copies.length;
  for(const h of s.labs.filter(x=>x.helper&&x.cloneOf===group)){h.copyNumber=null;if(!h.custom)h.name='مساعد '+(courseNames[source.course]||source.name);}
 }
 s.copyNumberingVersion=2;return repairLabLifecycle(s);
}
function normalizeCopies(s){
 for(const group of new Set(s.labs.filter(x=>x.cloneOf&&!x.helper).map(x=>x.cloneOf))){
  const source=s.labs.find(x=>x.id===group),copies=s.labs.filter(x=>x.cloneOf===group&&!x.helper).sort((a,b)=>(a.copyNumber||0)-(b.copyNumber||0));
  const sourceName=source?.name||copies.find(x=>x.copySourceName)?.copySourceName||copies.find(x=>!x.custom)?.name.match(/^نسخة(?: [\d٠-٩]+)? من (.+)$/)?.[1];
  copies.forEach((x,i)=>{x.copyNumber=i+1;if(sourceName)x.copySourceName=sourceName;if(!x.custom&&sourceName)x.name=`نسخة ${copies.length===1?'':(i+1).toLocaleString('ar-SA')+' '}من ${sourceName}`;});
 }
 // This is a live count, never a serial identity. Hidden copies still exist.
 s.copyCounters=Object.fromEntries([...new Set(s.labs.filter(x=>x.cloneOf&&!x.helper).map(x=>x.cloneOf))].map(id=>[id,s.labs.filter(x=>x.cloneOf===id&&!x.helper).length]));
}
function repairLabLifecycle(s){
 normalizeCopies(s);
 for(const a of s.labs){
  // A legacy undo lacks the creation identity needed to distinguish replacements.
  if(a.undo&&!a.undo.instances){a.undo=null;s.legacyUndoDiscarded=true;}
 }
 s.helperUseSequence=Math.max(s.helperUseSequence||0,...s.labs.map(x=>x.helperUseOrder||0));
 if(s.labLifecycleVersion!==1){
  // Older saves have no usage history. Only their active helper is known.
  const a=s.labs.find(x=>x.id===s.active);if(a?.helper)a.helperUseOrder=++s.helperUseSequence;
  s.labLifecycleVersion=1;
 }
 return s;
}
