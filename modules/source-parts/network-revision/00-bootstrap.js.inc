(()=>{'use strict';
 const KEY='srwe-4-5-6-practice-v2',OLD='srwe-4-5-6-practice-v1',BANK='srwe-456-84-v1';
 const qs=[...document.querySelectorAll('main .question')],byId=new Map(qs.map(q=>[q.dataset.qid,q])),anchors=new Map(),translated=new Set();
 const expected=q=>q.dataset.answer.split(' + ').map(c=>'ABCD'.indexOf(c)).sort(),equal=(a,b)=>a.length===b.length&&a.every((v,i)=>v===b[i]);
 const fresh=()=>({choices:[],graded:false,revealed:false,translationUsed:false,previouslyExposed:false});
 let state={version:2,bank:BANK,study:{},history:[],exam:null},review='all',retryIds=new Set();
 const active=()=>!!state.exam&&!state.exam.submitted,responses=()=>state.exam?state.exam.responses:state.study,rec=q=>responses()[q.dataset.qid]||fresh();
 const grade=document.querySelector('#show'),arabic=document.querySelector('#arabic');grade.textContent='تصحيح إجاباتي';document.querySelector('#hide').textContent='طيّ الشروح';
 const panel=document.createElement('section');panel.className='practice-panel';panel.setAttribute('aria-label','خيارات التدريب');
 panel.innerHTML=`<div class="panel-heading"><div><span class="eyebrow">STUDY & PRACTICE</span><h2>التدريب والمراجعة</h2></div><span class="mode-badge">وضع المذاكرة</span></div>
 <p class="study-help">أكد إجابتك أسفل كل سؤال لعرض التصحيح والشرح، أو اختر «عرض الحل والشرح» دون إجابة. الأسئلة التي كُشف حلها لا تدخل نتيجتك.</p>
 <div class="study-tools"><label>قائمة المراجعة <select id="review-filter"><option value="all">جميع الأسئلة</option><option value="retry">دفعة إعادة التدريب</option><option value="wrong">الإجابات الخاطئة</option><option value="revealed">الأسئلة المكشوفة</option><option value="unanswered">لم أجب عنها</option></select></label><button id="retry-list">إعادة تدريب هذه القائمة</button><button id="new-round">محاولة جديدة</button></div>
 <div class="exam-setup"><label>حجم الدفعة <select id="exam-count"><option value="10">10 أسئلة</option><option value="20" selected>20 سؤالًا</option><option value="all">كل أسئلة الشابتر المختار</option></select></label><button id="start-exam">بدء اختبار بالإنجليزية</button><span class="fine">من الشابتر المحدد أعلى الصفحة؛ تدريب دون مؤقت، وليس محاكاة مؤكدة لاختبار المدرس.</span></div>
 <div class="exam-controls" hidden><button id="submit-exam">تسليم الاختبار وعرض النتيجة</button><button id="leave-exam">العودة للمذاكرة</button><span id="exam-progress" role="status"></span></div>
 <p id="practice-score" role="status" aria-live="polite"></p><p id="review-counts" class="fine"></p>
 <div class="backup-tools"><button id="export-progress">حفظ نسخة من تقدمي</button><button id="import-progress">استعادة التقدم من ملف</button><input type="file" id="progress-file" accept="application/json,.json" hidden></div>
 <p id="save-status" class="fine">الحفظ في هذا المتصفح فقط، دون مزامنة مدار. نزّل نسخة من تقدمك لنقله أو الاحتفاظ به.</p><p id="backup-message" role="status" aria-live="polite"></p>`;
 document.querySelector('main').prepend(panel);const score=panel.querySelector('#practice-score'),msg=panel.querySelector('#backup-message');
 const examHost=document.createElement('section');examHost.id='exam-questions';panel.after(examHost);
 function save(){let ok=true;try{localStorage.setItem(KEY,JSON.stringify(state));}catch{ok=false;}document.querySelector('#save-status').textContent=ok?'الحفظ في هذا المتصفح فقط، دون مزامنة مدار. نزّل نسخة من تقدمك لنقله أو الاحتفاظ به.':'تعذر حفظ التقدم في المتصفح. استخدم «حفظ نسخة من تقدمي» قبل إغلاق الصفحة.';}
 