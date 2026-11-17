function learningRender(){
 migrateHelperNavigation(active());
 const a=active(),t=a.training;
 for(const x of state.labs)if(x.training&&x.course&&!courseNames[x.course])courseNames[x.course]=(x.training.scope?({all:'الأجزاء من 2 إلى 4',vlan:'VLAN — الجزء 2',trunk:'Trunk — الجزء 3',inter:'Inter-VLAN — الجزء 4'}[x.training.scope]+' · '):'')+(x.training.exercise.seed?'مختبر عشوائي '+x.training.exercise.seed:'Lab 4.5.2');
 $('.ml-task').hidden=a.kind==='scratch'&&!t&&!a.helper;
 // Old saves remain readable; adding the course never changes existing networks.
 for(const x of state.labs.filter(x=>x.kind==='original'))if(![...$('#ml-course').options].some(o=>o.value===x.course)){const o=document.createElement('option');o.value=x.course;o.textContent=courseNames[x.course]||x.name;$('#ml-course').append(o);}
 $('#ml-course').value=state.course;learningPanel.hidden=!t;
 $('#ml-restart').hidden=a.kind==='scratch'&&!a.helper&&!t;
 $('#ml-restart').textContent=a.helper?'إعادة المحاولة في المساعد':a.course?.startsWith('lesson-')&&a.kind==='original'?'إعادة الدرس من البداية':a.kind==='original'?'إعادة التمرين من البداية':'إعادة المحاولة من البداية';
 $('#ml-restart').disabled=B.busy();
 if(learningIssue&&diagnosticRevision!==a.revision){B.learning.clearFocus();learningIssue=null;$('#ml-diagnosis').hidden=true;$('#ml-diagnostic-output').textContent='';}
 const key=a.id+'|'+(t?.step||'');if(key!==learningKey){B.learning.clearFocus();learningIssue=null;$('#ml-diagnosis').hidden=true;learningKey=key;}
 if(t){$('#ml-task-title').textContent=L.titles[t.step];$('#ml-task-detail').textContent=t.assessment?'الخطوات السابقة جاهزة؛ نفّذ هذه الخطوة فقط ثم فسّرها. التلميحات والنسخ يُسجّلان كمساعدة.':'خطوة واحدة في كل مرة. اقرأ المتطلبات، طبّق، ثم تحقّق.';$('#ml-step-position').textContent=(t.assessment?'إعادة تقييم':'الخطوة '+(L.order.indexOf(t.step)+1)+' من '+L.order.length)+' · '+L.locator[t.step];renderRequirements(t.exercise);$('#ml-next-step').hidden=!t.checks[t.step]?.ok||!!t.assessment||t.completed;$('#ml-learning-status').textContent=t.completed?'اكتمل تطبيق الأجزاء 2–4؛ جرّب إعادة تقييم بقيم جديدة. لا تعني هذه النتيجة وحدها إتقان المنهج.':t.assessment?'المساعدة متاحة، لكن استخدامها يبقي النتيجة «تنفيذًا بمساعدة».':'';}
 practiceRender();
 if(typeof renderLessonGuide==='function')renderLessonGuide();if(typeof renderSelfTest==='function')renderSelfTest();
 const rows=B.learning.reviews(),current=rows.find(r=>r.attempt===a.data.assistance?.attempt)||rows[0];
 const triangle=document.getElementById('madar-review-assistance');
 if(triangle?.updateReview){const k=JSON.stringify([a.id,rows]);if(k!==reviewKey){reviewKey=k;reviewChooser.replaceChildren();rows.forEach((r,i)=>{const op=document.createElement('option');op.value=i;op.textContent=((a.helpArchive||[]).find(x=>x.key===r.key)?.goal||'مساعدة سابقة')+' · '+r.count+' مساعدة · '+(r.full?'كشف كامل':'درجة '+r.degree);reviewChooser.append(op);});reviewChooser.hidden=!rows.length;reviewChooser.value=rows.indexOf(current);triangle.updateReview(current,(a.helpArchive||[]).find(x=>x.key===current?.key)?.goal);}}
}
engine.addEventListener('labs:show-observed',e=>{if(loading||!active().training)return;const t=active().training;t.observed??={};t.observed[e.detail.device+'|'+e.detail.what]={...e.detail,revision:active().revision};});
engine.addEventListener('labs:help-exposure',e=>{if(loading)return;const a=active();a.helpArchive??=[];const record=clone(e.detail),key=JSON.stringify([record.attempt,record.key,record.hint]);record.context={version:1,labId:a.id,labName:a.name,kind:a.helper?'المحاكي المساعد':a.kind==='original'?'مختبر الدرس أو التمرين':'مختبر مستقل',course:a.course||null,sourceOriginal:a.sourceOriginal||null,scope:a.training?.scope||null,step:a.training?.step||null,stepTitle:L.titles[a.training?.step]||null,exercise:a.training?.exercise?clone(a.training.exercise):null};if(!a.helpArchive.some(x=>JSON.stringify([x.attempt,x.key,x.hint])===key))a.helpArchive.push(record);if(a.training)a.training.archive=a.helpArchive;
 for(const source of assistanceOwners(a))if(source.training?.assessment)source.training.assessment.helpUsed=true;
 if(a.training?.assessment)a.training.assessment.helpUsed=true;changed('help');learningRender();});
