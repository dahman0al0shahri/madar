async function save(payload){
 if(!window.MADAR_ACCOUNT.available){message('تعذر التحقق من الحساب؛ أعد التحميل قبل الحفظ.');return false;}
 if(window.MADAR_CONTENT_PREVIEW){message('معاينة فقط؛ لا تحفظ نتائج.');return true;}
 if(!window.MADAR_ACCOUNT.user){
  let value;
  if(payload.kind==='attempt'){const q=D.questions.find(q=>q.id===payload.question);value={question:q.id,answer:payload.answer,correct:payload.answer===q.answer,mode:payload.mode||'practice'};}
  else if(payload.kind==='bookmark')value={value:payload.value};
  else if(payload.kind==='training')value={result:payload.result,source:'client_reported_simulation',mastery:false};
  else if(payload.kind==='session')value=payload.session;
  else value={due:payload.value==='clear'?null:new Date(Date.now()+(payload.value==='tomorrow'?1:3)*86400000).toISOString()};
  const e={event_id:payload.eventId,kind:payload.kind,lesson:payload.lesson,payload:value,created_at:new Date().toISOString()};
  const previousEvents=events;events=events.filter(x=>!(x.kind===e.kind&&(e.kind==='attempt'?x.payload.question===value.question:x.lesson===e.lesson)));events.unshift(e);guestEvents=events;
  try{localStorage.setItem(guestKey,JSON.stringify(events));message('انحفظ على هذا المتصفح. تسجيل الدخول اختياري لحفظها في حسابك.');}
  catch{events=previousEvents;guestEvents=previousEvents;message('ما قدرنا نحفظ على المتصفح. إجابتك باقية هنا؛ أعد المحاولة قبل إغلاق الصفحة.');return false;}
  return true;
 }

 if(saveError){message('تعذر تحميل سجل حسابك. أعد تحميل الصفحة قبل حفظ مراجعات جديدة.');return false;}
 try{const r=await fetch('/api/excel-study',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({owner:window.MADAR_ACCOUNT.user.id,...payload}),signal:AbortSignal.timeout(12000)});if(!r.ok)throw Error();const d=await r.json();events=events.filter(e=>e.event_id!==d.event.event_id);events.unshift(d.event);pendingSaves=pendingSaves.filter(p=>p.eventId!==payload.eventId);persistPending();message('حُفظ في حسابك.');return true;}catch{if(!pendingSaves.some(p=>p.eventId===payload.eventId))pendingSaves.push(payload);persistPending();message('لم يُحفظ في الحساب. أعد المحاولة بالزر نفسه عند توفر الاتصال.');return false;}
}
