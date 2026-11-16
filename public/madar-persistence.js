(()=>{'use strict';
 const clone=x=>structuredClone(x),handles=new Set();let accountPromise;
 function downloadSnapshot(kind,owner,snapshot){
  // Some embedded browsers only handle downloads from the top-level document.
  // Use the nearest same-origin host; never pass a backup to another origin.
  let host=window;
  try{while(host.parent!==host&&host.parent.location.origin===location.origin)host=host.parent;}catch{}
  const url=host.URL.createObjectURL(new Blob([JSON.stringify({kind,owner,snapshot},null,2)],{type:'application/json'}));
  const link=host.document.createElement('a');link.href=url;link.download='madar-'+kind+'-backup.json';link.hidden=true;
  host.document.body.appendChild(link);
  try{link.click();}finally{link.remove();host.setTimeout(()=>host.URL.revokeObjectURL(url),60000);}
 }
 const account=()=>accountPromise??=(async()=>{const r=await fetch('/api/account',{cache:'no-store',signal:AbortSignal.timeout(12000)});if(!r.ok)throw Error('تعذر التحقق من الحساب؛ لم نفتح حفظًا بديلًا.');return r.json();})();
 const error=d=>Error(d==='conflict'?'هناك نسخة أحدث في الحساب. نزّل مسودتك قبل إعادة تحميل نسخة الحساب.':d==='identity_changed'?'تغير الحساب. أعد فتح الصفحة؛ لن ننقل عملك إلى حساب آخر.':'تعذر الحفظ؛ مسودتك باقية. أعد المحاولة.');
 async function open(kind,admin=false){const a=await account(),owner=a.user?.id||'guest',key=`madar-state-v1:${owner}:${kind}`,store=owner==='guest'?localStorage:sessionStorage,url=admin?'/api/admin/madar':`/api/madar/state?kind=${kind}&owner=${encodeURIComponent(owner)}`;let revision=0,value=null,pending=null,conflict=false,busy=false,queued=0,queue=Promise.resolve();
  const h={account:a,key,get value(){return clone(value)},get dirty(){return !!pending||busy||queued>0},download(){downloadSnapshot(kind,owner,pending?.snapshot||value);},async write(next){if(conflict)throw error('conflict');const raw=JSON.stringify(next);if(!pending&&raw===JSON.stringify(value))return;if(pending&&JSON.stringify(pending.snapshot)!==raw)pending=null;pending??={snapshot:clone(next),revision,requestId:crypto.randomUUID()};store.setItem(key,JSON.stringify({value,revision,pending}));if(owner==='guest'){value=clone(next);store.setItem(key,JSON.stringify({value,revision:++revision,pending:null}));pending=null;return;}busy=true;try{const r=await fetch(url,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(pending),signal:AbortSignal.timeout(15000)}),d=await r.json();if(!r.ok){conflict=r.status===409;throw error(d.error);}if(d.owner!==owner)throw error('identity_changed');revision=d.revision;value=clone(pending.snapshot);pending=null;store.setItem(key,JSON.stringify({value,revision,pending:null}));}finally{busy=false;}},async discardAndReload(){if(h.dirty&&!confirm(owner==='guest'?'إعادة التحميل قد تفقد التغييرات التي لم تُحفظ. نزّل نسخة منها أولًا إن احتجتها. متابعة؟':'تحميل نسخة الحساب يستبدل المسودة غير المحفوظة في هذه الصفحة. نزّلها أولًا إن احتجتها. متابعة؟'))return false;if(owner!=='guest')store.removeItem(key);location.reload();return true;}};
  let local;try{local=JSON.parse(store.getItem(key)||'null');}catch{throw Error('تعذر قراءة الحفظ المحلي؛ لم نستبدله.');}
  if(owner==='guest'){value=local?.pending?.snapshot||local?.value||null;revision=local?.revision||0;}
  else{const r=await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(12000)});if(!r.ok)throw Error('تعذر استعادة بيانات الحساب؛ أعد المحاولة دون إغلاق مسودتك.');const d=await r.json();if(d.owner!==owner)throw error('identity_changed');revision=d.revision;value=d.snapshot;pending=local?.pending||null;if(pending){if(pending.revision!==revision){conflict=true;h.conflict=true;}value=clone(pending.snapshot);}}
  h.save=next=>{const copy=clone(next);queued++;const job=queue.catch(()=>{}).then(()=>h.write(copy));queue=job;return job.finally(()=>{queued--;});};
  handles.add(h);return h;
 }
 addEventListener('beforeunload',e=>{if([...handles].some(h=>h.dirty)){e.preventDefault();e.returnValue='';}});
 window.MadarStore={open,account,hasPending:()=>[...handles].some(h=>h.dirty)};
})();
