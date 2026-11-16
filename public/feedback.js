window.MADAR_FEEDBACK={bind(){
 const form=document.querySelector('#feedback-form');if(!form)return;
 const note=form.querySelector('#feedback-text'),lesson=form.querySelector('#feedback-lesson'),status=form.querySelector('#feedback-status'),button=form.querySelector('[type=submit]');
 let busy=false;
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(busy)return;
  if(note.value.trim().length<3){status.textContent='اكتب ملاحظتك أولًا (٣ أحرف على الأقل).';note.focus();return;}
  window.MADAR_ACTIVITY?.emit('feedback_attempt');
  const message=note.value.trim(),selected=lesson.value;busy=true;button.disabled=true;note.readOnly=true;lesson.disabled=true;button.textContent='جارٍ إرسال الملاحظة…';status.textContent='';
  try{
   const preflight=await fetch('/api/feedback',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({lesson:selected,message,website:form.elements.website.value}),signal:AbortSignal.timeout(12000)});
   const validation=await preflight.json();
   if(!preflight.ok||validation.ready!==true){window.MADAR_ACTIVITY?.emit('feedback_failure');status.textContent=validation.error==='rate_limited'?'وصلت للحد المؤقت للإرسال. احتفظنا بنصك؛ حاول بعد قليل.':'تعذر بدء الإرسال. احتفظنا بنصك؛ يمكنك المحاولة لاحقًا أو نسخه.';return;}
   const response=await fetch('https://formsubmit.co/ajax/dahmanshahri@gmail.com',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({_subject:'مَدار — ملاحظة جديدة',lesson:lesson.selectedOptions[0].textContent,message,_url:'https://madar-word-lab.d7d7y7.chatgpt.site/',_template:'table',_honey:form.elements.website.value}),signal:AbortSignal.timeout(20000)});
   const data=await response.json();
   if(!response.ok||!(data.success===true||data.success==='true')){window.MADAR_ACTIVITY?.emit('feedback_failure');
    status.textContent=/activation|activate/i.test(String(data.message))?'استقبال الملاحظات لم يُفعّل بعد. احتفظنا بنصك ويمكنك نسخه الآن.':'تعذر إرسال الملاحظة الآن. احتفظنا بنصك؛ يمكنك المحاولة لاحقًا أو نسخه.';
   }else{window.MADAR_ACTIVITY?.emit('feedback_success');note.value='';status.textContent='شكرًا لك! استلمت خدمة البريد ملاحظتك لإرسالها إلى دحمان.';}
  }catch{window.MADAR_ACTIVITY?.emit('feedback_failure');status.textContent='تعذر تأكيد الإرسال. احتفظنا بنصك؛ تحقق من الاتصال وانتظر قليلًا قبل المحاولة مجددًا.';}
  finally{busy=false;button.disabled=false;note.readOnly=false;lesson.disabled=false;button.textContent='إرسال الملاحظة';}
 });
 form.querySelector('#copy-feedback').addEventListener('click',async()=>{
  if(!note.value.trim()){status.textContent='اكتب ملاحظتك أولًا.';note.focus();return;}
  const text=`ملاحظة على مَدار\nالدرس: ${lesson.selectedOptions[0].textContent}\n${note.value.trim()}`;
  try{await navigator.clipboard.writeText(text);status.textContent='نُسخت الملاحظة.';}catch{note.focus();note.select();status.textContent='حددنا النص لتنسخه يدويًا.';}
 });
}};
