  function lessonPage(l){
    if(l.course==='os1')return osLessonPage(l);
    if(l.theory&&(!l.practice||state.route.endsWith(':reference')))return (l.practice?'<button class="mh-btn" data-go="lesson:'+esc(l.id)+'">ارجع للتطبيق العملي</button>':'')+theoryLessonPage(l);
    if(!boot.canPractice)return heading(l.title,courses[l.course].name)+'<div class="mh-empty">المختبر غير متاح لهذا الحساب. يتطلب الوصول إلى أجزاء VLAN وTrunk وInter-VLAN.</div>';
    return heading(l.title,courses[l.course].name+' / الدرس العملي')+(l.practice?'<button class="mh-btn" data-go="lesson:'+esc(l.id)+':reference">الشرح والصور وأسئلة المراجعة</button>':'')+'<iframe allowfullscreen id="mh-network-lab" title="'+esc(l.title)+' — الدرس والمحاكي" data-network-src="/network-lab?lesson='+encodeURIComponent(l.id)+'" style="width:100%;height:1400px;border:0;border-radius:16px"></iframe><details class="mh-note-box mh-space-top"><summary>ملاحظاتي في هذا الدرس</summary><div id="lesson-notes"></div></details>';
  }
