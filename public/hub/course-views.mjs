// Course presentation keeps the original markup and receives course-specific renderers.
export function createCourseViews({ courses, lessons, profile, lessonBy, canLesson, esc, icon,
  carouselMarkup, officeArt, networkArt, osCourseArt, osHome, networkReviewCard, integrations = {} }) {
function lessonPosition(l,v){return v?.labStep?(v.completed?'اكتمل تطبيق الدرس؛ يمكنك مراجعته':'الخطوة '+(v.step+1)+' من '+v.stepTotal+' · '+v.stepTitle):(l.steps[v?.step||0]||'افتح الدرس للمتابعة');}
  function resume(course){const id=course||profile().latest,v=profile().visits[id],l=lessonBy(v?.lesson);if(!canLesson(l))return '';return `<section class="mh-resume"><div class="mh-resume-copy"><span class="mh-eyebrow">كمّل من وين وقفت</span><h3>${esc(l.title)}</h3><p>${courses[id].name} · ${esc(lessonPosition(l,v))}</p></div><button class="mh-primary" data-go="lesson:${l.id}">متابعة ${icon('arrow-left')}</button></section>`;}
  function about(){return `<section class="mh-about"><span class="mh-eyebrow">عن مدار</span><div class="mh-about-intro"><h2>تعلّم بفهم.<br>وتقدّم باستقلال.</h2><p>مدار منصة تعليمية تجمع مقرراتك في مكان واحد، وتربط الشرح بالتطبيق والمراجعة، وتقدّم التدريب والإرشاد والمساعدة اللازمة؛ لتتعلّم بفهم وتتقدّم نحو التطبيق باستقلال.</p></div><div class="mh-beliefs"><article class="mh-belief"><div class="mh-belief-title">${icon('telescope')}<h3>رؤيتنا</h3></div><p>أن يكون مدار بيئة تعليمية متكاملة، تساعد الطالب على فهم مقرراته، وتنمية مهاراته، والاستعداد لاختباراته، وتربط تعلّمه بمتطلبات سوق العمل؛ ليبني كفاءة عملية تدعم دخوله إلى المجال المهني وتطوّره فيه بثقة.</p></article><article class="mh-belief"><div class="mh-belief-title">${icon('compass')}<h3>رسالتنا</h3></div><p>نقدّم تجربة تعليمية تجمع المحتوى الواضح، والتدريب العملي، والإرشاد والمساعدة اللازمة، والمراجعة التي تكشف ما يحتاج إلى تقوية؛ لنساعد الطالب على فهم ما يتعلّمه، وتطبيقه باستقلال، وبناء مهارات ترتبط باحتياجاته الدراسية ومتطلبات سوق العمل.</p></article></div></section>`;}
  function heading(title,kicker=''){return `<div class="mh-page-heading"><div>${kicker?`<div class="mh-kicker">${esc(kicker)}</div>`:''}<h1>${esc(title)}</h1></div></div>`;}
  function officeCelebration(){return '<div class="mh-office-celebration" aria-hidden="true">'+Array.from({length:27},(_,i)=>`<i style="--x:${4+(i*29)%92}%;--y:${8+(i*37)%78}%;--size:${3+i%3}px;--party-color:${['#83bdff','#70d9b1','#f195bb'][i%3]};--duration:${6+i%5}s;--delay:-${i*.71}s;--turn:${i*43}deg;--drift:${i%2?12:-12}px"></i>`).join('')+'<span class="mh-celebration-ribbon"></span><span class="mh-celebration-ribbon"></span></div>';}
  function courseArtwork(id) {
    if (id === 'os1') return osCourseArt();
    if (id === 'office') return officeCelebration() + officeArt();
    return networkArt();
  }

  function courseCard(id) {
    const course = courses[id];
    const visit = profile().visits[id];
    const lesson = lessonBy(visit?.lesson);

    const art = courseArtwork(id);
    const tags = course.tags.map(tag => `<span>${tag}</span>`).join('');
    const badges = id === 'office'
      ? `<span class="mh-course-badge mh-featured-badge">${icon('star')}<b>مميز</b></span>`
        + `<span class="mh-course-badge mh-origin-badge">${icon('party-popper')}<b>بداية مدار</b></span>`
      : '';
    const lastVisit = canLesson(lesson) ? `<div class="mh-last">آخر وصول: ${esc(lesson.title)}</div>` : '';

    return `<article class="mh-course-card ${id}" style="--mh-accent:${course.color}">`
      + `<div class="mh-course-art">${art}</div><div class="mh-course-body">`
      + `<div class="mh-course-tags">${tags}${badges}</div><h2>${course.name}</h2><p>${course.description}</p>`
      + lastVisit
      + `<div class="mh-actions"><button class="mh-primary" data-go="course:${id}:home">دخول المقرر ${icon('arrow-left')}</button></div></div></article>`;
  }

  function sectionLinks(id) {
    const sections = id === 'office' ? [
      ['word', 'Word', 'شرح المستندات وتحريرها ومراجعتها.', 'file-text'],
      ['excel', 'Excel', 'الجداول والدوال وتحليل البيانات.', 'table-2'],
      ['access', 'Access', 'قواعد البيانات والحقول والاستعلامات.', 'database'],
    ] : [
      ['theory', 'الجزء النظري', 'افهم الفكرة، تابع الأمثلة، وارجع للمصطلحات من داخل الدرس.', 'book-open'],
      ['lessons', 'الجزء العملي', 'افتح درسًا داخل المحاكي، أو تدرّب في مختبر جاهز أو تبويب حر.', 'network'],
      ['reference', 'المرجع', 'ارجع للمفهوم والدرس من مكان واحد.', 'library'],
    ];
    return sections.map(([section, title, description, symbol]) =>
      `<article class="mh-section-link">${icon(symbol)}<h3>${title}</h3><p>${description}</p>`
      + `<button data-go="course:${id}:${section}">دخول ${icon('arrow-left')}</button></article>`
    ).join('');
  }

  function courseHome(id) {
    if (id === 'os1') return osHome();
    const course = courses[id];
    return carouselMarkup(id)
      + `<div class="mh-course-cover"><span class="mh-eyebrow">مساحتك للتعلّم</span><h1>${course.name}</h1><p>${course.description}</p></div>`
      + resume(id)
      + (id === 'network' ? networkReviewCard() : '')
      + `<div class="mh-section-links">${sectionLinks(id)}</div>`;
  }

  function lessonRows(list){return `<div class="mh-list">${list.map(l=>`<article class="mh-list-row">${icon(l.kind==='مختبر'?'network':'book-open')}<div><span class="mh-kicker">${l.kind} · ${courses[l.course].name}</span><h3>${esc(l.title)}</h3></div><button data-go="lesson:${l.id}">فتح ${icon('arrow-left')}</button></article>`).join('')}</div>`;}
  function previewCourseSection(id, section) {
    const course = courses[id];
    const title = course.sections.find(([key]) => key === section)?.[1] || 'الدروس';
    if (section === 'quiz') {
      return heading('اختبر نفسك', course.name)
        + '<div class="mh-empty"><h3>مكان الاختبارات داخل المقرر</h3>'
        + `<p>هذه المعاينة تختبر تنظيم الصفحات والتنقّل. بنك الأسئلة ونتائج الاختبارات يبقيان ضمن مقرر ${course.name} عند الربط.</p>`
        + `<button data-go="course:${id}:home">العودة لرئيسية المقرر</button></div>`;
    }

    const includeAllSections = id === 'network' || section === 'reference';
    const visibleLessons = lessons.filter(lesson =>
      lesson.course === id && canLesson(lesson) && (includeAllSections || lesson.section === section)
    );
    return heading(title, course.name) + lessonRows(visibleLessons)
      + '<p class="mh-footnote">عينة لتنقّل المعاينة؛ ليست قائمة المنهج كاملة.</p>';
  }

  function previewLessonPage(lesson) {
    const visit = profile().visits[lesson.course];
    const step = Math.min(2, visit?.step || 0);
    const title = heading(lesson.title, courses[lesson.course].name + ' / ' + lesson.kind);
    const content = `<span class="mh-eyebrow">مساحة الدرس</span><h2>${esc(lesson.steps[step])}</h2><p>${esc(lesson.intro)}</p>`;
    const indicators = lesson.steps.map((_, index) =>
      `<span class="${index === step ? 'mh-step-current' : ''}">${index + 1}</span>`
    ).join('');
    const controls = `<button data-step="${step - 1}" ${step === 0 ? 'disabled' : ''}>السابق</button>`
      + `<button data-step="${step + 1}" ${step === 2 ? 'disabled' : ''} class="mh-primary">التالي ${icon('arrow-left')}</button>`;
    const note = esc(profile().notes[lesson.id] || '');

    return title + `<div class="mh-learning-layout"><section class="mh-lesson">${content}`
      + `<div class="mh-step" aria-label="الموضع داخل الدرس">${indicators}</div><div class="mh-actions">${controls}</div>`
      + '<p class="mh-footnote">لتجربة حفظ موضعك: انتقل بين الخطوات واكتب ملاحظة، ثم غيّر المقرر وارجع إليه. هذا ليس تشغيلًا للمختبر أو تقييمًا لتعلّمك.</p></section>'
      + '<aside class="mh-note-box"><label for="mh-note">ملاحظتي في هذا الدرس'
      + `<textarea id="mh-note" placeholder="اكتب ملاحظتك…">${note}</textarea></label>`
      + '<p class="mh-footnote">تُحفظ تلقائيًا مع هذا الدرس.</p></aside></div>';
  }

  return { lessonPosition, resume, about, heading, courseCard, courseHome, lessonRows,
    courseSection: (id, section) => integrations.courseSection ? integrations.courseSection(id, section) : previewCourseSection(id, section),
    lessonPage: lesson => integrations.lessonPage ? integrations.lessonPage(lesson) : previewLessonPage(lesson) };
}
