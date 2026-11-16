// Homepage-only announcement. Demonstration data never enters the learner store.
let disposeSrweAnnouncement=()=>{};
const SRWE_EXAM_START='2026-11-10T09:50:00+03:00';
function srweExamRemaining(now=Date.now()){
 const total=Math.max(0,Math.ceil((Date.parse(SRWE_EXAM_START)-now)/1000));
 return {hours:Math.floor(total/3600),minutes:Math.floor(total%3600/60),seconds:total%60,reached:total===0};
}
function srweAnnouncement(){
 if(![4,5,6].every(c=>lessons.some(l=>l.id==='network-srwe-'+c&&canLesson(l))))return '';
 return `<section class="sa" id="srwe-announcement" aria-labelledby="sa-title" data-stage="0" data-running="false">
 <div class="sa-atmosphere" aria-hidden="true"><i></i><i></i><div class="sa-grid"></div><div class="sa-edge"></div></div>
 <div class="sa-top"><span class="sa-release"><i></i>بوابة مرجع الاختبار</span><span class="sa-series" dir="ltr">SRWE <b>04 / 05 / 06</b></span><button type="button" class="sa-motion" aria-pressed="false" aria-label="إيقاف حركة الإعلان">${icon('pause')}<span>إيقاف الحركة</span></button></div>
 <div class="sa-exam-schedule"><div class="sa-exam-date"><span>${icon('calendar-clock')}موعد الاختبار النظري</span><time datetime="${SRWE_EXAM_START}"><strong>الثلاثاء، 10 نوفمبر 2026</strong><small><b>9:50 صباحًا</b> · بتوقيت السعودية</small></time></div><div class="sa-countdown-wrap"><span class="sa-countdown-label">الوقت المتبقي لبدء الاختبار</span><div class="sa-countdown" role="timer" aria-live="off" aria-label="الوقت المتبقي لبدء الاختبار" dir="ltr" data-target="${SRWE_EXAM_START}">${[['hours','ساعة'],['minutes','دقيقة'],['seconds','ثانية']].map(([key,label])=>`<div class="sa-time-unit"><strong data-exam-time="${key}">--</strong><span>${label}</span></div>`).join('<i aria-hidden="true">:</i>')}</div></div></div>
 <div class="sa-layout">
 <div class="sa-copy"><div class="sa-overline">التوجيه والتحويل 1 · الجزء النظري</div><h1 id="sa-title">مرجع الاختبار النظري<br><span dir="ltr">4 <i>·</i> 5 <i>·</i> 6</span></h1><p class="sa-lead">راجع الشابترات المحددة للاختبار<br>بالشرح والأسئلة والتصحيح.</p><p class="sa-description">ابدأ مراجعتك من هنا: أسئلة تدريبية بالإنجليزية مع ترجمة عربية عند الطلب، وشرح لسبب صحة كل إجابة، ورسوم توضّح المفاهيم.</p>
 <div class="sa-facts"><div><strong>84</strong><span>سؤالًا مفسّرًا</span></div><div><strong>3</strong><span>شابترات</span></div><div><strong dir="ltr">EN <i>↔</i> AR</strong><span>إنجليزي وعربي</span></div></div>
 <a class="sa-cta" href="/network-review"><span>ادخل إلى مرجع الاختبار</span>${icon('arrow-up-left')}</a><span class="sa-saving">${icon('cloud-check')}مع تسجيل الدخول، يُحفظ تقدمك في حسابك.</span></div>
 <div class="sa-showcase"><div class="sa-stage-shadow" aria-hidden="true"></div><div class="sa-display">
 <div class="sa-display-top"><div class="sa-window-dots" aria-hidden="true"><i></i><i></i><i></i></div><span>معاينة المرجع</span><span class="sa-demo">مثال توضيحي</span></div>
 <div class="sa-panels">
 <div class="sa-panel" id="sa-panel-0" role="tabpanel" aria-labelledby="sa-tab-0">
 <div class="sa-panel-heading"><span class="sa-mini-icon">${icon('network')}</span><div><small>شرح مرئي للمفهوم</small><h2 dir="ltr">Inter-VLAN Routing</h2></div><span class="sa-chapter">04</span></div>
 <div class="sa-topology" aria-label="Router يربط شبكة VLAN 10 بشبكة VLAN 20 عبر Switch">
 <svg viewBox="0 0 440 245" role="img" aria-label="مسار بين جهازين في شبكتين مختلفتين يمر عبر Router"><defs><linearGradient id="sa-cable" x2="1" y2="1"><stop stop-color="#74d6d0"/><stop offset="1" stop-color="#bdacff"/></linearGradient><linearGradient id="sa-device" x2="0" y2="1"><stop stop-color="#304653"/><stop offset="1" stop-color="#14252c"/></linearGradient></defs>
 <ellipse cx="220" cy="224" rx="184" ry="13" fill="#000" opacity=".2"/>
 <path class="sa-wire" d="M220 72V123M193 145H86V180M247 145H354V180"/>
 <path class="sa-packet sa-up" pathLength="100" d="M86 180V145H220V72"/><path class="sa-packet sa-down" pathLength="100" d="M220 72V145H354V180"/>
 <g class="sa-router"><ellipse cx="220" cy="65" rx="43" ry="16" fill="#0b181e"/><path d="M177 50v15c0 22 86 22 86 0V50" fill="url(#sa-device)" stroke="#6a979e"/><ellipse cx="220" cy="50" rx="43" ry="15" fill="#304d58" stroke="#86c0c3"/><path d="m204 47 11 5-11 5m31-14-11 5 11 5m-21-15 7 4 7-4" fill="none" stroke="#b5e7e2" stroke-width="2"/><text x="220" y="18">Router</text></g>
 <g class="sa-switch"><path d="m177 128 14-10h64l14 10v24h-92Z" fill="url(#sa-device)" stroke="#607b8c"/><path d="M177 128h92M191 118l-14 10m78-10 14 10" stroke="#8ca7b3"/><path d="M188 138h8m5 0h8m5 0h8m5 0h8m5 0h8m5 0h6" stroke="#8bd2cb" stroke-width="4"/><text x="307" y="140">Switch</text></g>
 <g class="sa-pc"><rect x="60" y="179" width="52" height="34" rx="4" fill="#152c36" stroke="#80c7cd"/><path d="M64 183h44v24H64Z" fill="#254551"/><path d="m71 199 8-7 9 7 11-12" fill="none" stroke="#7dd5cf" stroke-width="2"/><path d="M86 213v7m-14 1h28" stroke="#80a9af" stroke-width="3"/><text x="86" y="240">VLAN 10</text></g>
 <g class="sa-pc"><rect x="328" y="179" width="52" height="34" rx="4" fill="#252c41" stroke="#b9a8eb"/><path d="M332 183h44v24h-44Z" fill="#3b3c57"/><path d="m339 199 8-7 9 7 11-12" fill="none" stroke="#c4b4f4" stroke-width="2"/><path d="M354 213v7m-14 1h28" stroke="#ad9dcf" stroke-width="3"/><text x="354" y="240">VLAN 20</text></g></svg>
 <span class="sa-route-tag">${icon('route')}الاتصال بين VLANs يحتاج إلى توجيه.</span></div>
 <div class="sa-source-line">${icon('file-text')}شرح مرتبط بصفحات المصدر الأصلية<span>Chapter 4</span></div>
 </div>
 <div class="sa-panel" id="sa-panel-1" role="tabpanel" aria-labelledby="sa-tab-1" hidden>
 <div class="sa-panel-heading"><span class="sa-mini-icon">${icon('list-checks')}</span><div><small>سؤال وتصحيح مفسّر</small><h2 dir="ltr">Question 4–01</h2></div><button type="button" class="sa-lang" data-sa-translate aria-pressed="false" aria-label="ترجمة سؤال المعاينة وخياراته إلى العربية"><span class="sa-lang-rays" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span><span class="sa-lang-face" aria-hidden="true"></span><span class="sa-lang-icon" aria-hidden="true">${icon('languages')}</span><span class="sa-lang-label"><b>ترجمة</b><small dir="ltr">EN ↔ AR</small></span></button></div>
 <p class="sa-question" data-sa-demo-text="question" dir="ltr" lang="en">What is required for hosts in different VLANs to communicate?</p>
 <div class="sa-option" dir="ltr"><span>A</span><b class="sa-option-text" data-sa-demo-text="a">The same access port number</b><i></i></div><div class="sa-option sa-option-correct" dir="ltr"><span>D</span><b class="sa-option-text" data-sa-demo-text="d">A Router or a Layer 3 Switch</b>${icon('check-circle-2')}</div>
 <div class="sa-explanation"><strong>${icon('check')}لماذا هذه الإجابة؟</strong><p>نقل الحزم بين شبكات VLAN المختلفة يحتاج إلى وظيفة التوجيه في الطبقة الثالثة.</p></div>
 <div class="sa-source-line">${icon('message-square-text')}شرح الإجابة بعد التأكيد أو باختيارك</div>
 </div>
 <div class="sa-panel" id="sa-panel-2" role="tabpanel" aria-labelledby="sa-tab-2" hidden>
 <div class="sa-panel-heading"><span class="sa-mini-icon">${icon('bookmark-check')}</span><div><small>مراجعة منظمة</small><h2>أخطاؤك والأسئلة المعلّمة</h2></div><span class="sa-chapter">↺</span></div>
 <div class="sa-review-tabs"><span>${icon('circle-alert')}أخطائي السابقة</span><span>${icon('bookmark')}المعلّمة</span></div>
 <div class="sa-review-row"><span class="sa-review-dot"></span><div><b dir="ltr">Q4–01</b><small>التواصل بين شبكات VLAN</small></div><span class="sa-example-badge">خطأ سابق</span></div>
 <div class="sa-review-row"><span class="sa-review-dot sa-purple"></span><div><b dir="ltr">Q5–12</b><small>أولوية Root Bridge</small></div>${icon('bookmark')}</div>
 <div class="sa-review-row"><span class="sa-review-dot sa-mint"></span><div><b dir="ltr">Q6–24</b><small>قراءة حالة EtherChannel</small></div>${icon('check-circle-2')}</div>
 <div class="sa-retry-demo">${icon('rotate-ccw')}زر واحد لإعادة محاولة الأسئلة المصحّحة</div><p class="sa-demo-note">حالات توضيحية لعرض الميزة، وليست نتائجك.</p>
 </div></div>
 <div class="sa-sequence" role="tablist" aria-label="مراحل معاينة المرجع">${[['network','الشرح'],['list-checks','التصحيح'],['bookmark-check','المراجعة']].map(([ic,t],i)=>`<button type="button" role="tab" id="sa-tab-${i}" aria-controls="sa-panel-${i}" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-sa-stage="${i}">${icon(ic)}<span>${t}</span><i></i></button>`).join('')}</div>
 </div><div class="sa-caption"><i></i>معاينة متحركة لميزات المرجع<span dir="ltr">MADAR / NETWORK</span></div></div>
 </div>
 <div class="sa-bottom"><div class="sa-chapter-links" aria-label="افتح شابترًا محددًا">${[[4,'Inter-VLAN Routing','ربط شبكات VLAN'],[5,'STP Concepts','منع حلقات الشبكة'],[6,'EtherChannel','تجميع الوصلات']].map(([n,en,ar])=>`<a href="/network-review?chapter=${n}"><b>0${n}</b><span><strong dir="ltr">${en}</strong><small>${ar}</small></span>${icon('arrow-up-left')}</a>`).join('')}</div><div class="sa-detail-strip sa-summary"><span class="sa-summary-icon" aria-hidden="true">${icon('book-open')}</span><p>جمعنا لك الشرح والأسئلة والترجمة، ووضّحنا أسباب الإجابات ورتّبنا مراجعة أخطائك، لتذاكر بوضوح وتعود لما تحتاجه بسهولة.</p></div></div>
 </section>`;
}
function mountSrweAnnouncement(){
 disposeSrweAnnouncement();const el=document.querySelector('#srwe-announcement');if(!el)return;
 const controller=new AbortController(),signal=controller.signal,pref=matchMedia('(prefers-reduced-motion: reduce)');let stage=0,elapsed=0,visible=false,manuallyPaused=false;
 try{manuallyPaused=sessionStorage.getItem('madar-srwe-announcement-motion')==='paused';}catch{}
 const tabs=[...el.querySelectorAll('[data-sa-stage]')],panels=[...el.querySelectorAll('.sa-panel')],motion=el.querySelector('.sa-motion');
 const running=()=>visible&&!document.hidden&&!pref.matches&&!manuallyPaused;
 function updateCountdown(){const remaining=srweExamRemaining();for(const key of ['hours','minutes','seconds']){const cell=el.querySelector('[data-exam-time="'+key+'"]'),value=String(remaining[key]).padStart(2,'0');if(cell.textContent!==value)cell.textContent=value;}const timer=el.querySelector('.sa-countdown'),label=el.querySelector('.sa-countdown-label');timer.setAttribute('aria-label',remaining.reached?'حل موعد الاختبار المحدد':`متبقي ${remaining.hours} ساعة و${remaining.minutes} دقيقة و${remaining.seconds} ثانية`);label.textContent=remaining.reached?'حل موعد الاختبار المحدد':'الوقت المتبقي لبدء الاختبار';el.dataset.examReached=String(remaining.reached);}
 updateCountdown();const countdownTimer=setInterval(()=>{if(!document.hidden)updateCountdown();},1000);
 function sync(){el.dataset.running=String(running());motion.setAttribute('aria-pressed',String(manuallyPaused||pref.matches));motion.disabled=pref.matches;const name=pref.matches?'الحركة مخفّضة':manuallyPaused?'تشغيل الحركة':'إيقاف الحركة';motion.querySelector('span').textContent=name;motion.setAttribute('aria-label',name+' في الإعلان');const svg=motion.querySelector('svg');if(svg)svg.innerHTML=manuallyPaused||pref.matches?'<path d="m8 5 11 7-11 7Z"/>':'<path d="M8 5v14M16 5v14"/>';}
 function show(i){stage=i;elapsed=0;el.dataset.stage=String(i);tabs.forEach((t,k)=>{t.setAttribute('aria-selected',String(k===i));t.tabIndex=k===i?0:-1;panels[k].hidden=k!==i;});}
 el.querySelector('[data-sa-translate]').addEventListener('click',e=>{const button=e.currentTarget,ar=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(ar));button.setAttribute('aria-label',ar?'إعادة سؤال المعاينة وخياراته إلى الإنجليزية':'ترجمة سؤال المعاينة وخياراته إلى العربية');button.querySelector('b').textContent=ar?'الأصل':'ترجمة';const copy=ar?{question:'ما المطلوب لتمكين الأجهزة الموجودة في شبكات VLAN مختلفة من التواصل؟',a:'رقم منفذ الوصول نفسه',d:'Router أو Switch من الطبقة الثالثة'}:{question:'What is required for hosts in different VLANs to communicate?',a:'The same access port number',d:'A Router or a Layer 3 Switch'};for(const node of el.querySelectorAll('[data-sa-demo-text]')){node.textContent=copy[node.dataset.saDemoText];node.dir=ar?'rtl':'ltr';node.lang=ar?'ar':'en';}el.querySelectorAll('#sa-panel-1 .sa-option').forEach(node=>node.dir=ar?'rtl':'ltr');},{signal});
 el.addEventListener('click',e=>{const tab=e.target.closest('[data-sa-stage]');if(tab){show(Number(tab.dataset.saStage));return;}if(e.target.closest('.sa-motion')){manuallyPaused=!manuallyPaused;try{sessionStorage.setItem('madar-srwe-announcement-motion',manuallyPaused?'paused':'running');}catch{}sync();}},{signal});
 el.addEventListener('keydown',e=>{const t=e.target.closest('[data-sa-stage]');if(!t)return;const key=e.key;if(!['ArrowLeft','ArrowRight','Home','End'].includes(key))return;e.preventDefault();const i=key==='Home'?0:key==='End'?2:(Number(t.dataset.saStage)+(key==='ArrowLeft'?1:2))%3;show(i);tabs[i].focus();},{signal});

 const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:0});io.observe(el.querySelector('.sa-showcase'));
 document.addEventListener('visibilitychange',()=>{sync();updateCountdown();},{signal});pref.addEventListener('change',sync,{signal});
 const timer=setInterval(()=>{if(running()){elapsed+=250;if(elapsed>=9000)show((stage+1)%3);}},250);
 const display=el.querySelector('.sa-display');el.querySelector('.sa-showcase').addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||pref.matches||manuallyPaused)return;const r=display.getBoundingClientRect();display.style.setProperty('--sa-rx',((.5-(e.clientY-r.top)/r.height)*3).toFixed(2)+'deg');display.style.setProperty('--sa-ry',(((e.clientX-r.left)/r.width-.5)*4).toFixed(2)+'deg');},{signal});el.querySelector('.sa-showcase').addEventListener('pointerleave',()=>{display.style.removeProperty('--sa-rx');display.style.removeProperty('--sa-ry');},{signal});
 sync();disposeSrweAnnouncement=()=>{clearInterval(timer);clearInterval(countdownTimer);io.disconnect();controller.abort();disposeSrweAnnouncement=()=>{};};
}
