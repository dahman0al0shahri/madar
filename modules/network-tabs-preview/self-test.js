// Self tests reuse the practical lesson's exercise, checker, hints and persistence.
for(const a of state.labs)if(a.training?.selfTest?.mode==='exam'&&['مختبر الاختبار','مختبر التقويم'].includes(a.name))a.name='مختبر التقييم';
const selfTestPanel=document.createElement('section');selfTestPanel.id='ml-selftest';selfTestPanel.hidden=true;
$('.ml-task').before(selfTestPanel);
let selfTestContext=null,selfTestRenderKey='';
const selfTestNames={vlan:'إنشاء VLAN وتعيين المنافذ',trunk:'إعداد وصلات Trunk',inter:'إعداد Inter-VLAN على Router',all:'تقييم الدروس العملي كاملًا'};
for(const a of state.labs)if(a.training?.selfTest)courseNames[a.course]=a.description||selfTestNames[a.training.scope];
function selfTestLabs(mode,scope){return state.labs.filter(a=>a.kind==='original'&&a.training?.selfTest?.mode===mode&&a.training.scope===scope);}
function selfTestCreate(mode,scope,variables=['vlans','names','nets','ports'],guidance='request'){
 if(B.busy())throw Error('أكمل توصيل الكابل أولًا.');
 if(state.labs.length>=100)throw Error('وصلت إلى الحد الأقصى للمختبرات؛ احذف مختبرًا مستقلًا غير مطلوب بعد حفظ نسخته.');
 capture();const previous=clone(active().data),older=selfTestLabs(mode,scope),seeds=older.map(a=>a.training.exercise.seed),unused=seeds.length>=96?seeds.slice(-1):seeds;
 const seed=L.nextSeed(unused,crypto.getRandomValues(new Uint32Array(1))[0]),e=L.configure(seed,variables),sequence=[...practiceScopes[scope].steps];let data;
 loading=true;try{B.learning.fresh(e);if(mode==='practice'&&sequence[0]!==L.order[0])B.learning.prerequisites(e,sequence[0]);data=B.capture();}finally{B.restore(previous);loading=false;}
 const c='selftest-'+uid(),n=makeLab('original-'+c,mode==='exam'?'مختبر التقييم':'مختبر التمرين','original',data,c);
 n.training=training(e,data);Object.assign(n.training,{sequence,scope,guidance:mode==='exam'?'independent':guidance,step:sequence[0],selfTest:{version:1,mode,createdAt:new Date().toISOString(),submissions:[]}});
 courseNames[c]=selfTestNames[scope]+' · محاولة '+(older.length+1);n.description=courseNames[c];state.labs.push(n);selfTestContext={mode,scope,labId:n.id};activate(n.id);return n;
}
root.openSelfTest=async({mode,scope})=>{
 if(root.dataset.ready!=='true'||restoreFailure)throw Error('انتظر استعادة المختبرات.');
 if(!['practice','exam'].includes(mode)||!practiceScopes[scope]||(mode==='exam'&&scope!=='all')||(mode==='practice'&&scope==='all'))throw Error('نطاق التقييم غير معروف.');
 const existing=selfTestLabs(mode,scope).at(-1),key=mode+':'+scope,same=state.openSelfTestKey===key;state.openSelfTestKey=key;lessonContext=null;lessonGuide.hidden=true;delete root.dataset.lesson;
 if(existing){selfTestContext={mode,scope,labId:existing.id};if(same&&(active().id===existing.id||active().sourceOriginal===existing.id))render();else activate(existing.id);}else selfTestCreate(mode,scope);
 await root.flushSave();
};
function selfTestOptions(){
 const a=active(),t=a.training,st=t?.selfTest;if(!st)return;const scope=t.scope,mode=st.mode;
 modal('محاولة جديدة بقيم مختلفة','<p>ستبقى هذه المحاولة ونتائجها محفوظة. المحاولة الجديدة تفتح في مختبر مستقل.</p><fieldset id="ml-selftest-variables"><legend>ما الذي يتغيّر؟</legend>'+Object.entries(variableLabels).map(([k,v])=>'<label><input type="checkbox" value="'+k+'" '+(t.exercise.variables?.includes(k)?'checked':'')+'> '+v+'</label>').join('')+'</fieldset>'+(mode==='practice'?'<label>الإرشاد<select id="ml-selftest-guidance">'+Object.entries(guidanceModes).map(([k,v])=>'<option value="'+k+'" '+(t.guidance===k?'selected':'')+'>'+v+'</option>').join('')+'</select></label>':'')+'<p id="ml-selftest-error" role="alert"></p><button id="ml-selftest-create">ابدأ المحاولة الجديدة</button><button id="ml-selftest-cancel">إلغاء</button>');
 $('#ml-selftest-cancel').onclick=close;$('#ml-selftest-create').onclick=()=>{const variables=[...body.querySelectorAll('input:checked')].map(n=>n.value);if(!variables.length){$('#ml-selftest-error').textContent='اختر نوعًا واحدًا على الأقل من المتطلبات المتغيرة.';return;}try{selfTestCreate(mode,scope,variables,$('#ml-selftest-guidance')?.value||'independent');close();}catch(e){$('#ml-selftest-error').textContent=e.message;}};
}
function selfTestAssistance(a){
 const helpers=state.labs.filter(h=>h.helper&&assistanceOwners(h).some(x=>x.id===a.id));
 const events=a.data.assistance?.events||[],helperEvents=helpers.flatMap(h=>h.data.assistance?.events||[]);
 const all=[...events,...helperEvents,...(a.training.selfTest.helpEvents||[])],unique=[...new Map(all.map(e=>[JSON.stringify(e),e])).values()],copied=!!a.copied||!!a.training.selfTest.copied;
 return {count:unique.length,degree:unique.length?Math.max(...unique.map(e=>e[3]==='full'?4:Number(e[3])||0)):0,copied,assisted:copied||unique.length>0};
}
engine.addEventListener('labs:help-exposure',()=>{const a=active();for(const source of assistanceOwners(a)){if(!source.training?.selfTest)continue;const st=source.training.selfTest;st.helpEvents=[...new Map([...(st.helpEvents||[]),...(a.data.assistance?.events||[])].map(e=>[JSON.stringify(e),clone(e)])).values()];}changed('help');});
function selfTestSubmit(a){
 if(active().id!==a.id||B.busy())return;
 capture();const t=a.training,st=t.selfTest;if(!st||st.mode!=='exam')return;
 const signature=JSON.stringify([a.revision,t.observed,selfTestAssistance(a)]);
 if(st.submissions.at(-1)?.signature===signature){close();toast('هذه الحالة سبق تسليمها؛ نتيجتها محفوظة.');return;}
 const rows=practiceSequence(t).map(step=>{let check=B.learning.check(t.exercise,step,false);if(check.ok&&step.endsWith('check')){const what=step==='vlan-check'?'vlan':'brief',missing=L.targets(step).find(id=>t.observed?.[id+'|'+what]?.revision!==a.revision);if(missing)check={ok:false,issues:[{device:missing,field:'دليل العرض',actual:'نفّذ أمر العرض على الحالة الحالية قبل التسليم'}]};}return{step,title:L.titles[step],ok:check.ok,issues:clone(check.issues||[])};});
 const assistance=selfTestAssistance(a),result={id:uid(),at:new Date().toISOString(),signature,seed:t.exercise.seed,revision:a.revision,rows,passed:rows.filter(r=>r.ok).length,total:rows.length,assistance};
 st.submissions.push(result);t.completed=result.passed===result.total;t.evidence.push({type:'exam-submit',id:result.id,at:result.at,passed:result.passed,total:result.total,assisted:assistance.assisted});
 for(const r of rows)root.dispatchEvent(new CustomEvent('labs:configuration-check',{detail:{step:r.step,ok:r.ok}}));
 close();changed('view');renderSelfTest();$('#ml-selftest-result')?.scrollIntoView({block:'nearest',behavior:'smooth'});
}
const selfTestVerify=$('#ml-verify').onclick;
$('#ml-verify').onclick=()=>{const a=active();if(a.kind!=='original'||a.training?.selfTest?.mode!=='exam'){selfTestVerify();return;}
 modal('تسليم التقييم؟','<p>سنفحص جميع متطلبات الدروس الثلاثة في الحالة الحالية. تُحفظ النتيجة وسجل المساعدة، ويمكنك متابعة التصحيح أو بدء محاولة جديدة.</p><button id="ml-selftest-submit">سلّم وراجع النتيجة</button><button id="ml-selftest-continue">أكمل العمل</button>');$('#ml-selftest-continue').onclick=close;$('#ml-selftest-submit').onclick=()=>selfTestSubmit(a);
};
function renderSelfTest(){
 const a=active(),t=a.training,st=a.kind==='original'&&t?.selfTest;selfTestPanel.hidden=!st;
 $('#ml-verify').textContent=st?.mode==='exam'?'تسليم التقييم':'تحقّق من التطبيق';
 if(!st)return;
 const exam=st.mode==='exam',seq=practiceSequence(t),rows=st.submissions||[],last=rows.at(-1),key=JSON.stringify([a.id,a.revision,t.step,t.completed,rows,selfTestAssistance(a)]);
 if(key!==selfTestRenderKey){selfTestRenderKey=key;selfTestPanel.innerHTML='<div class="ml-selftest-heading"><div><span class="ml-kicker">'+(exam?'تقييم شامل · جميع الدروس العملية':'تمرين متغيّر من دروس الجزء العملي')+'</span><h3>'+esc(selfTestNames[t.scope])+'</h3></div><button id="ml-selftest-new">محاولة جديدة</button></div><p>'+(exam?'نفّذ المتطلبات في شبكة واحدة. اختر أي جزء للعمل عليه، والنتيجة تظهر بعد التسليم. المساعدة والنسخ متاحان ويُسجّلان مع النتيجة.':'نفّذ مهارات الدرس بقيم هذه المحاولة. المتطلبات السابقة مجهزة، ولا تُحسب ضمن تنفيذك.')+'</p>'+(exam?'<label>الجزء الذي تعمل عليه<select id="ml-selftest-step">'+seq.map(k=>'<option value="'+k+'" '+(t.step===k?'selected':'')+'>'+esc(L.titles[k])+'</option>').join('')+'</select></label>':'')+(last?'<section id="ml-selftest-result" aria-label="نتيجة التقييم"><h4>'+last.passed+' / '+last.total+' متطلبات مكتملة عند التسليم</h4><p>'+ (last.assistance.assisted?'تنفيذ بمساعدة مسجلة أو نسخ.':'دون مساعدة أو نسخ مسجّل في هذه المحاولة.')+' هذه نتيجة التطبيق الحالي، وليست درجة تقييم المقرر أو إثباتًا للاحتفاظ.</p><ul>'+last.rows.map(r=>'<li data-ok="'+r.ok+'"><strong>'+(r.ok?'✓ ':'○ ')+esc(r.title)+'</strong>'+(r.ok?'':'<span>'+esc(r.issues[0]?.device||'')+' · '+esc(r.issues[0]?.field||'راجع المتطلبات')+'</span>')+'</li>').join('')+'</ul><p>'+ (last.revision!==a.revision?'عدّلت المختبر بعد هذه النتيجة؛ سلّم مجددًا لتقييم الحالة الحالية.':'النتيجة تخص آخر تسليم محفوظ.')+'</p><details><summary>سجل التسليمات ('+rows.length+')</summary><ol>'+rows.map(r=>'<li>'+esc(new Date(r.at).toLocaleString('ar-SA',{timeZone:'Asia/Riyadh'}))+' — '+r.passed+'/'+r.total+' · '+(r.assistance.assisted?'بمساعدة أو نسخ':'دون مساعدة مسجلة')+'</li>').join('')+'</ol></details></section>':'');
 $('#ml-selftest-new').onclick=()=>guard(selfTestOptions);if(exam)$('#ml-selftest-step').onchange=()=>{t.step=$('#ml-selftest-step').value;changed('view');};}
 $('#ml-task-detail').textContent=lessonTarget(t);
 $('#ml-requirements small').textContent='نفس مهارات دروس الجزء العملي · Lab 4.5.2، الأجزاء 2–4. القيم خاصة بهذه المحاولة؛ الإعدادات المسبقة ليست من عملك.';
 if(exam){$('#ml-next-step').hidden=true;$('#ml-diagnosis').hidden=true;$('#ml-step-position').textContent='العمل على '+L.locator[t.step]+' · التقييم عند التسليم';$('#ml-learning-status').textContent=last?'نتيجة آخر تسليم محفوظة أعلى المتطلبات.':'يمكنك العمل على المتطلبات بأي ترتيب. لا يوجد مؤقت لهذا التقييم.';}
}
