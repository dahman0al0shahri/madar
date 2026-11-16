  function networkSelfTestPage(section){
    const practical=lessons.filter(l=>l.course==='network'&&['vlan','trunk','inter'].includes(l.section)&&canLesson(l));
    const head=heading('تمارين وتقييم',courses.network.name)+(section==='quiz'?networkReviewCard():'');
    if(!boot.canPractice)return head+'<div class="mh-empty">التطبيق العملي غير متاح لهذا الحساب.</div>';
    const card=(label,title,text,route,button)=>'<article class="mh-selftest-card"><span class="mh-eyebrow">'+label+'</span><h2>'+esc(title)+'</h2><p>'+esc(text)+'</p><button class="mh-primary" data-go="'+route+'">'+button+' <span aria-hidden="true">←</span></button></article>';
    if(section==='quiz')return head+'<div class="mh-selftest-grid">'+card('01 / تمارين','تمرّن على درس','اختر درسًا من الجزء العملي. تتغيّر المتطلبات، وتختار الإرشاد المناسب لك.','course:network:practice','اختيار الدرس')+card('02 / تقييم شامل','اجمع الدروس في تقييم واحد','VLAN وTrunk وInter-VLAN في شبكة واحدة. نفّذ المتطلبات، ثم سلّم لمراجعة نتيجتك في كل جزء.','course:network:exam','فتح التقييم')+'</div>';
    if(section==='practice')return heading('تمارين الدروس',courses.network.name)+'<button class="mh-selftest-back" data-go="course:network:quiz">← تمارين وتقييم</button><div class="mh-selftest-grid">'+practical.map((l,i)=>card(String(i+1).padStart(2,'0')+' / تمرين متغيّر',l.title,'نفس مهارات الدرس، بقيم جديدة. تُجهّز المتطلبات السابقة اللازمة للبدء دون احتسابها من عملك.','course:network:practice-'+l.section,'فتح التمرين')).join('')+'</div>';
    const exam=section==='exam',scope=exam?'all':section.replace('practice-',''),lesson=practical.find(l=>l.section===scope);
    if(!exam&&!lesson)return head+'<div class="mh-empty">هذا التمرين غير متاح.</div>';
    const title=exam?'تقييم الدروس العملي كاملًا':'تمرين · '+lesson.title;
    return heading(title,courses.network.name)+'<button class="mh-selftest-back" data-go="course:network:'+(exam?'quiz':'practice')+'">← '+(exam?'تمارين وتقييم':'تمارين الدروس')+'</button><iframe allowfullscreen id="mh-network-lab" title="'+esc(title)+'" data-network-src="/network-lab?selftest='+(exam?'exam':'practice')+'&amp;scope='+scope+'" style="width:100%;height:1400px;border:0;border-radius:16px"></iframe>';
  }
