// Account-wide recovery, limited to the current owner's known MADAR records.
export function recordType(key, owner) {
  if (key === `madar-pending:${owner}`) return {type:'word',label:'مراجعة Word'};
  for (const subject of ['excel','access']) if(key===`madar-${subject}-pending:${owner}`) return {type:'events',subject,label:`مراجعة ${subject==='excel'?'Excel':'Access'}`};
  for(const [prefix,type,label] of [[`madar-notes-v1:account:${owner}:`,'note','ملاحظة'],[`madar-worksheet-v1:${owner}:`,'worksheet','تدريب'],[`madar-state-v1:${owner}:`,'state','مساحة المقرر']]) {
    if(key.startsWith(prefix)) {const id=key.slice(prefix.length);if(id&&!(type==='state'&&id==='config'))return {type,id,label:`${label} · ${id}`};}
  }
  return null;
}
export function collectDrafts(storage,owner) {
  if(!owner)return [];
  const rows=[];
  for(let i=0;i<storage.length;i++) {const key=storage.key(i),kind=recordType(key,owner);if(!kind)continue;
    const raw=storage.getItem(key);let value,broken=false;try{value=JSON.parse(raw);}catch{broken=true;}
    const pending=broken||(kind.type==='word'?!!value:kind.type==='events'?Array.isArray(value)&&value.length>0:kind.type==='state'?!!value?.pending:!!value?.dirty);
    if(pending) rows.push({...kind,key,raw,value,broken});
  }
  return rows;
}
export function guestBackup(storage) {
  const data={};
  for(let i=0;i<storage.length;i++){const key=storage.key(i);if(['madar-word-trial-mcq-20261005','madar-word-trial-v2','madar-excel-guest-v1','madar-access-guest-v1'].includes(key)||['madar-state-v1:guest:','madar-worksheet-v1:guest:','madar-notes-v1:guest:'].some(p=>key.startsWith(p))){if(key==='madar-state-v1:guest:config')continue;const raw=storage.getItem(key);try{data[key]=JSON.parse(raw);}catch{data[key]={unparsed:raw};}}}
  return {schema:1,owner:'guest',exportedAt:new Date().toISOString(),localOnly:true,data};
}
export function resource(row,owner) {
  if(row.type==='word')return '/api/progress';
  if(row.type==='events')return `/api/${row.subject}-study`;
  const query=new URLSearchParams({[row.type==='state'?'kind':'lesson']:row.id,owner});
  return (row.type==='state'?'/api/madar/state':row.type==='note'?'/api/notes':'/api/worksheet')+'?'+query;
}
export async function verifyIdentity(fetcher,owner){const r=await fetcher('/api/account',{cache:'no-store'});if(!r.ok||(await r.json()).user?.id!==owner)throw Error('تغيّر الحساب أو تعذر التحقق منه. لم ننقل المسودة إلى حساب آخر.');}
export async function retryDraft(row,owner,storage,fetcher=fetch) {
  if(row.broken)throw Error('تعذر قراءة هذه المسودة؛ نزّلها قبل أي تغيير.');
  await verifyIdentity(fetcher,owner);
  if(storage.getItem(row.key)!==row.raw)throw Error('تغيّرت المسودة أثناء العملية؛ أعد المحاولة.');
  const d=row.value,url=resource(row,owner);
  const send=async(body,method='PUT')=>{const r=await fetcher(url,{method,headers:{'Content-Type':'application/json','X-Madar-Owner':owner},body:JSON.stringify(body),signal:AbortSignal.timeout(15000)});if(!r.ok)throw Error(r.status===409?'هناك نسخة أحدث في الحساب. نزّل المسودة قبل اختيار نسخة الحساب.':'تعذر حفظ المسودة؛ بقيت في هذه الجلسة.');const result=await r.json();if(result.owner&&result.owner!==owner)throw Error('تغير الحساب؛ أوقفنا الاستعادة.');return result;};
  if(row.type==='events') {
    for(const event of [...d]) {await send({...event,owner},'POST');if(storage.getItem(row.key)!==row.raw)throw Error('تغيّرت المسودة؛ أوقفنا الاستعادة.');d.shift();row.raw=JSON.stringify(d);storage.setItem(row.key,row.raw);}
  } else {
    const body=row.type==='word'?d:row.type==='note'?{text:d.text,revision:d.revision}:row.type==='state'?d.pending:d.request||{snapshot:d.snapshot,revision:d.revision,requestId:crypto.randomUUID()};
    // Keep the request ID across network retries, including worksheet drafts made before a save.
    if(row.type==='worksheet'&&!d.request){d.request=body;row.raw=JSON.stringify(d);storage.setItem(row.key,row.raw);}
    await send(body);
  }
  if(storage.getItem(row.key)===row.raw)storage.removeItem(row.key);
}
export async function useCloudDraft(row,owner,storage,fetcher=fetch) {
  await verifyIdentity(fetcher,owner);
  const r=await fetcher(resource(row,owner),{cache:'no-store',headers:{'X-Madar-Owner':owner}});
  if(!r.ok)throw Error('تعذر تحميل نسخة الحساب؛ لم نحذف المسودة.');
  const d=await r.json();if(d.owner&&d.owner!==owner)throw Error('تغيّر الحساب؛ لم نحذف المسودة.');
  if(storage.getItem(row.key)!==row.raw)throw Error('تغيرت المسودة؛ لم نستبدلها.');
  storage.removeItem(row.key);
}
export function lessonHref(l){if(/^network-srwe-[456]$/.test(l.id))return '/network-review?chapter='+l.id.slice(-1);return l.course==='office'?`/applications#${l.section==='word'?'learn':l.section}/${encodeURIComponent(l.id)}`:`/#lesson:${encodeURIComponent(l.id)}`;}
