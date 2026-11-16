  function networkPracticalIndex(){
    const available=lessons.filter(l=>l.course==='network'&&canLesson(l));
    const full=available.filter(l=>l.practice&&l.section!=='theory').sort((a,b)=>a.id.localeCompare(b.id,undefined,{numeric:true}));
    const review=available.filter(l=>!l.practice&&l.section!=='theory');
    return heading('دروس العملي كاملة','التوجيه والتحويل ١')+
      '<section class="np-intro"><div><span class="mh-kicker">'+full.length+' دروس من المصادر العملية المتاحة</span><h2>من التوصيل إلى التحقق من النتيجة</h2><p>افتح الدرس لتنفّذ خطواته داخل المحاكي. الرسم، إعداد الأجهزة، الأوامر وفحص النتيجة في المسار نفسه؛ والشرح وصور المصدر بجانب تطبيقك عند الحاجة.</p></div>'+
      (boot.canPractice?'<button class="mh-btn" data-go="course:network:lab">مختبراتي والمساحة الحرة</button>':'')+'</section>'+
      '<ol class="np-lessons" aria-label="الدروس العملية بترتيب المصادر">'+full.map((l,i)=>'<li class="np-lesson"><span class="np-number" aria-hidden="true">'+String(i+1).padStart(2,'0')+'</span><div class="np-body"><h2>'+theoryText(l.title.replace(/^\d+\s*·\s*/,''))+'</h2><p>'+theoryText(l.steps.filter(s=>!s.includes('كيف تستخدم')).join(' · '))+'</p><details class="np-source"><summary>مصدر هذا الدرس</summary><p>'+esc(l.source||'المصدر المرفق بالدرس')+'</p></details><div class="np-actions"><button class="mh-primary" data-go="lesson:'+esc(l.id)+'">افتح التطبيق الكامل '+icon('arrow-left')+'</button><button class="mh-btn" data-go="lesson:'+esc(l.id)+':reference">الشرح وصور المصدر</button></div></div></li>').join('')+'</ol>'+
      (review.length?'<details class="np-review"><summary>تدريبات مركزة للمراجعة · '+review.length+'</summary><p>تطبيقات جزئية للعودة إلى مهارة محددة. المسار الكامل لهذه المهارات موجود في الدروس أعلاه.</p>'+lessonRows(review)+'</details>':'');
  }
