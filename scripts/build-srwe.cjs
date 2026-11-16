const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8').replace(/\r\n/g,'\n'),write=(p,s)=>fs.writeFileSync(path.join(root,p),s);
let s=read('modules/srwe-review/practice-base.js');const replace=(a,b)=>{if(!s.includes(a))throw Error('Missing SRWE build anchor: '+a.slice(0,100));s=s.replace(a,b);};
replace("(()=>{'use strict';","(async()=>{'use strict';");
replace("history:[],exam:null},review=","history:[],exam:null,meta:{},location:null},review=");
replace("<option value=\"wrong\">الإجابات الخاطئة</option>","<option value=\"wrong\">أخطائي السابقة</option><option value=\"marked\">الأسئلة المعلّمة</option>");
replace('<button id="retry-list">إعادة تدريب هذه القائمة</button><button id="new-round">محاولة جديدة</button>','');
replace(" document.querySelector('#retry-list').onclick=()=>retry(false);document.querySelector('#new-round').onclick=()=>retry(true);",'');
replace("function save(){let ok=true;try{localStorage.setItem(KEY,JSON.stringify(state));}catch{ok=false;}document.querySelector('#save-status').textContent=ok?'الحفظ في هذا المتصفح فقط، دون مزامنة مدار. نزّل نسخة من تقدمك لنقله أو الاحتفاظ به.':'تعذر حفظ التقدم في المتصفح. استخدم «حفظ نسخة من تقدمي» قبل إغلاق الصفحة.';}",`let cloud=null,saveVersion=0;
 function save(){if(!cloud)return;const version=++saveVersion;const el=document.querySelector('#save-status');el.textContent='جارٍ حفظ التقدم…';el.dataset.status='pending';cloud.save(state).then(()=>{if(version!==saveVersion)return;el.dataset.status='saved';el.textContent=cloud.account.user?'محفوظ في حسابك في مدار؛ يشمل الإجابات والأخطاء والعلامات والملاحظات.':'محفوظ للضيف في هذا المتصفح؛ سجّل الدخول للحفظ في الحساب. لا تُنقل بيانات الضيف تلقائيًا.';}).catch(err=>{el.dataset.status='error';el.textContent=err.message+' استخدم زر نسخة التقدم للاحتفاظ بمسودتك.';});}
 document.querySelector('#save-status').textContent='جارٍ استعادة الحفظ…';`);
replace('return clean;}','return hydrateExtra(data,clean);}');
replace('data.history.length>10000','data.history.length>5000');
const start=s.indexOf(' try{const raw=localStorage.getItem(KEY);'),end=s.indexOf('\n function rowStatus',start);
if(start<0||end<0)throw Error('Load anchor missing');
s=s.slice(0,start)+`\n const integrationReady=()=>{};
 // Declarations below are initialized before awaiting the account store.
 `+s.slice(end);
replace("wrong:!!r?.graded&&!r.revealed&&!equal(r.choices,expected(q)),","wrong:(state.meta[q.dataset.qid]?.mistakes||0)>0,marked:state.meta[q.dataset.qid]?.marked===true,");
replace('status.textContent=`${count} سؤالًا ظاهرًا من 84`;', 'status.textContent=`${count} سؤالًا ظاهرًا من 84`;refreshOutline();');
replace('إعادة التدريب لا تمحو سجل المحاولات السابق.`;}','إعادة التدريب لا تمحو سجل المحاولات السابق.`;refreshOutline();}');
replace('state.history.push(batch);save();tally();','recordBatch(batch);save();tally();');
replace("state.history.push({event:'exam',examId:e.id", "recordBatch({event:'exam',examId:e.id");
// Preserve accumulated history when importing a backup. The explicit snapshot restores active counters.
replace('state=clean;translated.clear();',`const existing=state.history;const seen=new Set(clean.history.map(h=>JSON.stringify(h)));clean.history=[...existing.filter(h=>!seen.has(JSON.stringify(h))),...clean.history];state=clean;translated.clear();`);
// Avoid stale per-question metadata references after import.
const extras=read('modules/srwe-review/integration.js').replaceAll('m.marked=!m.marked','meta(id).marked=!meta(id).marked').replace('marked:m.marked,at:', 'marked:meta(id).marked,at:').replace('if(active()||!m.mistakes)return;const old=m.mistakes;m.mistakes=0','if(active()||!meta(id).mistakes)return;const old=meta(id).mistakes;meta(id).mistakes=0').replace('m.note=e.target.value','meta(id).note=e.target.value');
replace(' for(const q of qs){const id=q.dataset.qid,required=',extras+`\ntry{cloud=await MadarStore.open('srwe');if(cloud.value)state=validate(cloud.value);window.MADAR_ACCOUNT=cloud.account;document.body.classList.remove('srwe-loading');document.querySelector('#srwe-load').hidden=true;}catch(err){document.querySelector('#srwe-load').textContent=err.message+' أعد تحميل الصفحة للمحاولة. لم يُستبدل تقدمك.';return;}\n for(const q of qs){const id=q.dataset.qid,required=`);
replace(' enterMode();\n})();',` setupOutline();const requestedChapter=new URLSearchParams(location.search).get('chapter');if(['4','5','6'].includes(requestedChapter))chapter.value=requestedChapter;enterMode();
 const feedback=document.createElement('section');feedback.id='srwe-feedback';feedback.className='srwe-feedback';document.querySelector('main').append(feedback);feedback.innerHTML=MADAR_FEEDBACK.markup();
 fetch('/network-review/catalog').then(r=>r.ok?r.json():Promise.reject()).then(d=>MADAR_FEEDBACK.bind({subject:'Network',...d})).catch(()=>feedback.textContent='تعذر تجهيز البلاغات؛ أعد تحميل الصفحة.');
 const retrySave=document.createElement('button');retrySave.textContent='إعادة محاولة الحفظ';retrySave.id='srwe-retry-save';retrySave.onclick=save;document.querySelector('.backup-tools').append(retrySave);
 const reload=document.createElement('button');reload.textContent='تحميل نسخة الحساب';reload.onclick=()=>cloud.discardAndReload();document.querySelector('.backup-tools').append(reload);
 document.querySelector('#save-status').textContent=cloud.conflict?'توجد نسخة أحدث في الحساب. نزّل مسودتك قبل تحميل نسخة الحساب.':cloud.account.user?'تمت استعادة تقدمك من حسابك في مدار.':'وضع الضيف: الحفظ في هذا المتصفح، منفصل عن الحساب.';
 window.SRWE_READY=true;
 const requestedQuestion=location.hash.slice(1);if(/^q-[456]-\\d{2}$/.test(requestedQuestion))jump(requestedQuestion);
})();`);
write('public/srwe-review/app.js',read('modules/srwe-review/base.js')+'\n'+s+'\n'+read('modules/srwe-review/source-viewer.js'));new Function(read('public/srwe-review/app.js'));
write('public/srwe-review/madar.css',read('modules/srwe-review/madar.css'));
console.log('Built MADAR SRWE review');
