function run(items,mode,resume=null){
 const seq=generation,bankVersion=D.bankVersion,sessionEvents=new Map(),sessionId=resume?.sessionId||crypto.randomUUID();track(resume?'quiz_resume':'quiz_start',{value:mode});const answers=resume?.answers?[...resume.answers]:[];let i=answers.length,score=answers.reduce((n,a,j)=>n+Number(a===items[j].answer),0);
 const remember=finished=>{const key=String(finished)+':'+answers.length;if(!sessionEvents.has(key))sessionEvents.set(key,crypto.randomUUID());return save({eventId:sessionEvents.get(key),kind:'session',lesson:items[0].lesson,session:{sessionId,bankVersion,mode,ids:items.map(q=>q.id),answers:[...answers],finished}});};
 async function results(){if(seq!==generation||!root)return;$('#access-question').innerHTML='<section class="panel"><p role="status">نحفظ نهاية المراجعة…</p></section>';const ok=await remember(true);if(seq!==generation||!root)return;if(!ok){$('#access-question').innerHTML='<section class="panel"><h2>إجاباتك موجودة، لكن ما اكتمل حفظ النتيجة</h2><p>تأكد من الاتصال، ثم جرّب مرة ثانية.</p><button id="access-finish-retry">إعادة حفظ النتيجة</button></section>';$('#access-finish-retry').onclick=results;return;}track('quiz_finish',{value:score});
  $('#access-question').innerHTML='<section class="panel"><p class="eyebrow">نتيجة هذه الجلسة</p><h2>'+ar(score)+' من '+ar(items.length)+'</h2><p>هذه نتيجة الأسئلة التي أجبت عنها، ولا تثبت إتقان المقرر كاملًا.</p><div class="bottom-actions"><a class="button" href="#mistakes/access">أخطائي المحفوظة</a><button id="access-again">مراجعة جديدة</button></div></section>'+items.map((q,n)=>'<details class="panel"><summary>'+ar(n+1)+'. '+(answers[n]===q.answer?'صحيحة':'تحتاج مراجعة')+' · '+rich(q.prompt)+'</summary><p>إجابتك: '+rich(q.options[answers[n]])+'</p><p>الصحيح: '+rich(q.options[q.answer])+'</p><p>'+rich(q.explanation)+'</p><a href="#access/'+q.lesson+'">ارجع إلى الدرس</a></details>').join('');
  $('#access-again').onclick=()=>quiz();
 }
 function question(){
  const q=items[i],l=D.lessons.find(l=>l.id===q.lesson);let checked=false;
  $('#access-question').innerHTML='<section class="panel"><p class="eyebrow">'+ar(i+1)+' / '+ar(items.length)+' · '+esc(l.title)+'</p><h2>'+rich(q.prompt)+'</h2><form id="excel-answer"><fieldset><legend class="sr-only">اختر إجابة واحدة</legend>'+q.options.map((o,n)=>'<label class="check excel-answer"><input type="radio" name="answer" value="'+n+'" required><span>'+rich(o)+'</span></label>').join('')+'</fieldset><button class="primary">'+(mode==='exam'?'تثبيت الإجابة':'تحقق من الإجابة')+'</button></form><p><a href="#about/report/question/'+q.id+'">بلّغ عن مشكلة في السؤال</a></p><div id="access-feedback" aria-live="polite"></div></section>';
  $('#excel-answer').onsubmit=async e=>{
   e.preventDefault();if(checked)return;checked=true;
   const answer=Number(new FormData(e.target).get('answer')),correct=answer===q.answer;answers.push(answer);if(correct)score++;
   window.MADAR_QUALITY?.record({sessionId,mode,bankVersion:D.bankVersion},[{id:q.id,answer}]);track('quiz_answer',{question:q.id,lesson:q.lesson});track('quiz_check',{question:q.id,lesson:q.lesson,value:correct?'correct':'incorrect'});
   const pending={eventId:crypto.randomUUID(),kind:'attempt',lesson:q.lesson,question:q.id,answer,mode};
   e.target.querySelectorAll('input,button').forEach(x=>x.disabled=true);
   $('#access-feedback').innerHTML=(mode==='practice'?'<div class="panel soft"><h3>'+(correct?'إجابة صحيحة':'تحتاج مراجعة هذه النقطة')+'</h3><p>الإجابة: '+rich(q.options[q.answer])+'</p><p>'+rich(q.explanation)+'</p><a href="'+href(l)+'">راجع الشرح والفيديو</a></div>':'<p>ثُبّتت إجابتك. يظهر التصحيح في نهاية الاختبار.</p>')+'<div class="bottom-actions"><button id="access-next" class="primary" disabled>'+(i+1<items.length?'السؤال التالي':'النتيجة')+'</button><button id="access-retry-save" hidden>إعادة حفظ الإجابة</button></div>';
   const next=$('#access-next'),retry=$('#access-retry-save');
   const persistAnswer=async()=>{retry.disabled=true;const answerSaved=await save(pending);if(seq!==generation)return;const ok=answerSaved&&await remember(false);if(seq!==generation)return;retry.hidden=ok;retry.disabled=false;next.disabled=!ok;};
   retry.onclick=persistAnswer;next.onclick=()=>{i++;if(i<items.length)question();else results();};await persistAnswer();
  };
 }if(i>=items.length)results();else question();
}
