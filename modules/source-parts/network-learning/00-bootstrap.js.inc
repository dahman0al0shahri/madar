// Lives inside app.js's controller closure. Lab metadata owns learning history;
// topology undo deliberately cannot roll back an exposure or an assessment.
const L=window.MadarLearning;
for(const a of state.labs)if(a.training&&a.course)courseNames[a.course]=(a.training.scope?({all:'الأجزاء 2–4 كاملة',vlan:'VLAN — الجزء 2',trunk:'Trunk — الجزء 3',inter:'Inter-VLAN — الجزء 4'}[a.training.scope]+' · '):'')+(a.training.exercise.seed?'مختبر عشوائي '+a.training.exercise.seed:'Lab 4.5.2 — الأجزاء 2–4');
const learningTools=document.createElement('div');learningTools.className='ml-learning-tools';learningTools.innerHTML='<button id="ml-full-course">مختبر VLAN وInter-VLAN</button><button id="ml-random-course">تمرين عشوائي</button><button id="ml-history">سجل المساعدات</button><button id="ml-restart">ابدأ المحاولة من جديد</button><button id="ml-retests">إعادة تقييم ومراجعات</button>';
$('.ml-task').after(learningTools);
const learningPanel=document.createElement('section');learningPanel.id='ml-learning-panel';learningPanel.hidden=true;learningPanel.innerHTML='<p id="ml-step-position"></p><section id="ml-requirements" aria-labelledby="ml-requirements-title"><h3 id="ml-requirements-title">متطلبات المختبر</h3><div id="ml-requirements-content"></div><small class="ml-requirements-source">النطاق: Lab 4.5.2، الأجزاء 2–4. Ping أداة تحقق إضافية، وليس توسيعًا لنطاق التقييم.</small></section><p id="ml-learning-status" role="status"></p><button id="ml-next-step" hidden>الخطوة التالية</button><div id="ml-diagnosis" hidden><strong>التحقق لم يكتمل؛ ابدأ بهذه النقطة فقط</strong><p id="ml-diagnostic-message"></p><button id="ml-locate">؟ — أمر العرض وتحديد موضع الخلل · الدرجة الثالثة</button><pre id="ml-diagnostic-output" dir="ltr"></pre><p id="ml-diagnostic-guide"></p></div>';
learningTools.after(learningPanel);
let learningIssue=null,learningKey='',reviewKey='',diagnosticRevision=null;
const integratedReview=document.getElementById('ml-review-panel');log.after(integratedReview);
const reviewChooser=document.createElement('select');reviewChooser.id='ml-review-choice';reviewChooser.setAttribute('aria-label','اختر خطوة لعرض مثلث مراجعتها');integratedReview.querySelector('summary').after(reviewChooser);
reviewChooser.onchange=()=>{const rows=B.learning.reviews(),r=rows[+reviewChooser.value];document.getElementById('madar-review-assistance').updateReview(r,(active().helpArchive||[]).find(x=>x.key===r?.key)?.goal);};
const learningOriginalVerify=$('#ml-verify').onclick,learningOriginalHelper=$('#ml-helper').onclick;
function training(exercise,data){return {version:1,exercise:clone(exercise),step:L.order[0],initial:clone(data),archive:[],evidence:[],checks:{},assessments:[],completed:false};}
function newCourse(seed){if(B.busy()){toast('أكمل توصيل الكابل أولًا.');return;}capture();const e=L.make(seed),c=seed?'random-'+uid():'lab452';if(lab('original-'+c)){activate('original-'+c);return;}const previous=clone(active().data),data=B.learning.fresh(e);loading=true;B.restore(previous);loading=false;const n=makeLab('original-'+c,'مختبر التمرين','original',data,c);n.training=training(e,data);courseNames[c]=seed?'مختبر عشوائي '+seed:'Lab 4.5.2 — الأجزاء 2–4';state.labs.push(n);state.course=c;activate(n.id);toast('ابدأ بالخطوة الحالية؛ المساعدة والتحقق يستخدمان متطلبات هذا المختبر نفسها.');}
$('#ml-full-course').onclick=()=>guard(()=>newCourse(0));
$('#ml-random-course').onclick=()=>guard(()=>newCourse(1+crypto.getRandomValues(new Uint32Array(1))[0]%96));

let requirementsKey='';
