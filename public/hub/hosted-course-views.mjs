// Hosted course routing and access-dependent templates, with explicit course adapters.
export function createHostedCourseViews({ courses, lessons, canLesson, getBoot, getRoute, heading, esc,
  lessonRows, osSection, osLessonPage, networkPracticalIndex, networkSelfTestPage,
  networkTheoryIndex, networkReference, theoryLessonPage, hintHistory }) {
  const selfTestSections = ['quiz', 'practice', 'exam', 'practice-vlan', 'practice-trunk', 'practice-inter'];

  function labPage(course) {
    if (!getBoot().canPractice) {
      return heading('المختبر غير متاح لهذا الحساب')
        + '<p>يتطلب هذا المختبر صلاحية أجزاء VLAN وTrunk وInter-VLAN جميعها.</p>';
    }
    return heading('مختبرات الشبكات', course.name)
      + '<iframe allowfullscreen id="mh-network-lab" title="محاكي الشبكات" data-network-src="/network-lab" style="width:100%;height:1400px;border:0;border-radius:16px"></iframe>';
  }

  function labCover(section) {
    const title = section === 'quiz' ? 'اختبر فهمك بالتطبيق' : 'مختبر جاهز أو تبويب جديد حر';
    return '<div class="mh-course-cover"><h2>' + title + '</h2>'
      + '<p>متطلبات متغيرة وإرشاد تختاره. مختبراتك مستقلة، ويمكنك النسخ بينها باختيارك.</p>'
      + '<button class="mh-primary" data-go="course:network:lab">فتح محاكي الشبكات</button></div>';
  }

  function courseSection(courseId, section) {
    if (courseId === 'os1') return osSection(section);
    if (courseId === 'network' && section === 'lessons') return networkPracticalIndex();

    const course = courses[courseId];
    const title = course.sections.find(([key]) => key === section)?.[1] || 'مختبرات الشبكات';
    if (courseId === 'network') {
      if (selfTestSections.includes(section)) return networkSelfTestPage(section);
      if (section === 'hints') return hintHistory();
    }
    if (section === 'theory') return networkTheoryIndex();
    if (section === 'lab') return labPage(course);

    const isReference = section === 'reference';
    const visibleLessons = lessons.filter(lesson =>
      lesson.course === courseId && canLesson(lesson) && (isReference || lesson.section !== 'theory')
    );
    let html = heading(title, course.name);
    if (section === 'lessons' || section === 'quiz') html += labCover(section);

    if (isReference && getBoot().canPractice) {
      html += networkReference() + lessonRows(visibleLessons.filter(lesson => lesson.section === 'theory'));
    } else {
      html += lessonRows(visibleLessons);
    }
    if (isReference) {
      html += '<section class="mh-feedback-fold" aria-labelledby="mh-feedback-title"><h2 id="mh-feedback-title">شارك تجربتك أو بلّغ عن مشكلة</h2><div id="mh-network-feedback"></div></section>';
    }
    return html;
  }

  function practicalLessonPage(lesson) {
    const title = heading(lesson.title, courses[lesson.course].name + ' / الدرس العملي');
    const referenceButton = lesson.practice
      ? `<button class="mh-btn" data-go="lesson:${esc(lesson.id)}:reference">الشرح والصور وأسئلة المراجعة</button>`
      : '';
    const lab = `<iframe allowfullscreen id="mh-network-lab" title="${esc(lesson.title)} — الدرس والمحاكي"`
      + ` data-network-src="/network-lab?lesson=${encodeURIComponent(lesson.id)}"`
      + ' style="width:100%;height:1400px;border:0;border-radius:16px"></iframe>';
    const notes = '<details class="mh-note-box mh-space-top"><summary>ملاحظاتي في هذا الدرس</summary><div id="lesson-notes"></div></details>';
    return title + referenceButton + lab + notes;
  }

  function lessonPage(lesson) {
    if (lesson.course === 'os1') return osLessonPage(lesson);

    const showTheory = lesson.theory && (!lesson.practice || getRoute().endsWith(':reference'));
    if (showTheory) {
      const practiceButton = lesson.practice
        ? `<button class="mh-btn" data-go="lesson:${esc(lesson.id)}">ارجع للتطبيق العملي</button>`
        : '';
      return practiceButton + theoryLessonPage(lesson);
    }

    if (!getBoot().canPractice) {
      return heading(lesson.title, courses[lesson.course].name)
        + '<div class="mh-empty">المختبر غير متاح لهذا الحساب. يتطلب الوصول إلى أجزاء VLAN وTrunk وInter-VLAN.</div>';
    }
    return practicalLessonPage(lesson);
  }

  return { courseSection, lessonPage };
}
