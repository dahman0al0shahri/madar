function cleanSaved(v){
 const out={bookmarks:[],mistakes:[],history:[],active:null,lastResult:null,lastLesson:'v01',theme:'launch'};
 if(!v||v.version!==2)return out;
 out.bookmarks=Array.isArray(v.bookmarks)?v.bookmarks.filter(id=>L(id)):[];
 out.mistakes=Array.isArray(v.mistakes)?v.mistakes.filter(id=>Q(id)):[];
 out.history=Array.isArray(v.history)?v.history.filter(h=>h&&typeof h.title==='string'&&Number.isInteger(h.score)&&Number.isInteger(h.total)&&['exam','practice'].includes(h.mode)).slice(-30):[];
 const valid=q=>compatibleWordSession(q)&&typeof q.title==='string'&&Array.isArray(q.items)&&q.items.length&&q.items.every(i=>Q(i.id)&&Array.isArray(i.order)&&i.order.length===4&&new Set(i.order).size===4&&i.order.every(n=>Number.isInteger(n)&&n>=0&&n<4)&&(i.answer===null||Number.isInteger(i.answer)&&i.answer>=0&&i.answer<4))&&['practice','exam'].includes(q.mode)&&Number.isInteger(q.index)&&q.index>=0&&q.index<q.items.length;
 if([v.active,v.lastResult].some(q=>q&&!compatibleWordSession(q)))window.MADAR_CONTENT_CHANGED=true;
 if(valid(v.active))out.active=v.active;if(valid(v.lastResult))out.lastResult=v.lastResult;
 if(window.MADAR_MISTAKES.validReview(v.mistakeReview))out.mistakeReview=v.mistakeReview||null;if(window.MADAR_MISTAKES.validReviewHistory(v.mistakeHistory))out.mistakeHistory=v.mistakeHistory||[];
 if(L(v.lastLesson))out.lastLesson=v.lastLesson;if(v.theme==='calm')out.theme='calm';return out;
}
if(window.MADAR_CONTENT_PREVIEW){saved=cleanSaved(null);}else if(account.user){saved=cleanSaved(account.state);try{const pending=JSON.parse(sessionStorage.getItem(pendingKey()));if(pending){saved=cleanSaved(pending.state);syncDirty=true;syncBlocked=pending.revision!==account.revision||!!account.error;syncMessage=syncBlocked?'لديك نسخة غير مرفوعة من جلسة سابقة. نزّلها من حسابي أو حمّل نسخة الحساب.':'نستعيد تغييراتك غير المرفوعة…';}}catch{}}
else if(!account.error){try{saved=cleanSaved(JSON.parse(localStorage.getItem(KEY)));if(!localStorage.getItem(KEY)){const old=JSON.parse(localStorage.getItem(OLD_KEY));if(old?.bookmarks)saved.bookmarks=old.bookmarks.filter(id=>L(id));}}catch{$('#storage-warning').hidden=false;}}
lastLesson=saved.lastLesson||'v01';
function persist(){if(window.MADAR_CONTENT_PREVIEW)return;if(account.error){toast('تعذر التحقق من الحساب. أعد الاتصال من حسابي قبل الحفظ.');return;}if(account.user){queueSync();return;}try{localStorage.setItem(KEY,JSON.stringify({version:2,...saved}));}catch{$('#storage-warning').hidden=false;}}
function applyTheme(){document.body.dataset.theme='celebration';}
function toast(t){$('#toast').textContent=t;$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),2600);}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
