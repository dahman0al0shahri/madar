// Source observations are learner-authored and explicitly self-reviewed, never auto-graded prose.
function renderSourceReview(l,s,p){
 $('#mp-source-review')?.remove();
 const host=document.createElement('details');host.id='mp-source-review';host.className='mp-source-review';
 if(!s.questions?.length)return;
 host.innerHTML='<summary>اقرأ الناتج وفسّره · '+s.questions.length+' من أسئلة المصدر</summary><p>اكتب ما لاحظته؛ حفظ النص ومراجعتك الذاتية منفصلان عن فحص إعداد الشبكة، ولا يعنيان تصحيح الإجابة آليًا.</p>';
 for(const q of s.questions){
  const r=p.responses?.[q.id]||{},reviewed=r.reviewed&&r.draft===r.text,item=document.createElement('article');item.className='mp-observation';
  item.innerHTML='<label for="'+q.id+'">'+esc(q.prompt)+'</label><small>'+esc(q.source)+'</small><textarea id="'+q.id+'" rows="3" maxlength="6000" placeholder="ملاحظتي من الأمر أو نتيجة الاختبار…">'+esc(r.draft??r.text??'')+'</textarea><label class="mp-review-confirm"><input type="checkbox" '+(reviewed?'checked':'')+'> راجعت تفسيري مقابل الناتج أو مرجع الإجابة</label><div><button type="button" data-review-save>احفظ ملاحظتي</button><button type="button" data-review-reveal>كشف مرجع الإجابة · مساعدة 4</button></div><p data-review-status role="status">'+(r.at?'ملاحظة محفوظة'+(reviewed?' ومراجعة ذاتيًا.':'؛ لم تسجّل مراجعتها بعد.'):'')+'</p><div data-review-answer hidden></div>';
  const input=item.querySelector('textarea'),confirm=item.querySelector('input'),status=item.querySelector('[data-review-status]'),answer=item.querySelector('[data-review-answer]');
  input.oninput=()=>{p.responses??={};p.responses[q.id]??={};p.responses[q.id].draft=input.value;confirm.checked=false;p.finalVerified=null;status.textContent='مسودة قيد الحفظ؛ احفظ الملاحظة بعد مراجعتها.';changed('metadata');};
  item.querySelector('[data-review-save]').onclick=()=>{if(!input.value.trim()){status.textContent='اكتب ملاحظتك أولًا.';return;}window.MadarPractical.recordReview(p,q.id,input.value,confirm.checked,new Date().toISOString());input.value=p.responses[q.id].text;status.textContent=confirm.checked?'حُفظت الملاحظة والمراجعة الذاتية؛ لم تُقيَّم صحة النص آليًا.':'حُفظت الملاحظة؛ راجعها ثم سجّل مراجعتك.';p.finalVerified=null;changed('metadata');};
  item.querySelector('[data-review-reveal]').onclick=()=>{if(!p.help.some(h=>h.step===q.id)){p.help.push({step:q.id,degree:4,full:true,at:new Date().toISOString(),body:q.answer});root.dispatchEvent(new CustomEvent('labs:help-exposure',{detail:{level:4,step:q.id,lesson:l.id,full:true}}));changed('metadata');}answer.hidden=false;answer.textContent=q.answer;};
  host.append(item);
 }
 dock.append(host);
 const open=document.createElement('button');open.type='button';open.id='mp-open-review';open.textContent='أسئلة هذا الجزء · '+s.questions.length;open.onclick=()=>{host.open=true;host.scrollIntoView({block:'nearest',behavior:'smooth'});};$('#mp-current-review')?.remove();$('#mp-check').after(open);
}
