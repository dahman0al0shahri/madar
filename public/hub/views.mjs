// Route presentation returns markup or a destination; the composition root mounts it.
export function createHubViews({ courses, available, canCourse, canLesson, lessonBy,
  courseIcon, icon, srweAnnouncement, carouselMarkup, about, resume, heading, courseCard,
  account, admin, courseHome, courseSection, lessonPage, hosted, isAdmin }) {
  function chrome(state, course) {
    const permitted = course && canCourse(course);
    return { picker: available().map(id=>`<button data-go="course:${id}:home" ${course===id?'aria-current="page"':''}>${courseIcon(id)}${courses[id].name}${course===id?icon('check'):''}</button>`).join('')+`<button class="mh-all-courses" data-go="courses">عرض جميع المقررات ${icon('arrow-left')}</button>`, subnav: permitted?`<div class="mh-subbar"><button class="mh-return" data-go="home">${icon('arrow-right')}رئيسية مدار</button><span class="mh-course-name">${courses[course].name}</span><nav class="mh-course-nav" aria-label="أقسام ${courses[course].name}">${courses[course].sections.map(([id,name])=>`<button data-go="course:${course}:${id}" ${(state.route===`course:${course}:${id}`||(course==='network'&&((state.route.startsWith('lesson:')&&id===(lessonBy(state.route.split(':')[1])?.section==='theory'?'theory':'lessons'))||(state.route==='course:network:lab'&&id==='lessons')||(id==='quiz'&&/^course:network:(practice(?:-(?:vlan|trunk|inter))?|exam)$/.test(state.route)))))?'aria-current="page"':''}>${name}</button>`).join('')}</nav></div>`:'' };
  }
  function page(state, course) {
    const permitted = course && canCourse(course);
    let html='';if(state.route==='home')html=srweAnnouncement()+carouselMarkup(null)+about()+resume()+`<section class="mh-course-door"><div><h2>المقررات</h2><p>لكل مقرر مساحته. ولكل خطوة بداية.</p></div><button class="mh-primary" data-go="courses">استعرض المقررات ${icon('arrow-left')}</button></section>`;
    else if(state.route==='courses')html=heading('المقررات')+`<div class="mh-courses">${available().map(courseCard).join('')}</div>`+(available().length?'':'<div class="mh-empty">لا توجد مقررات متاحة لهذا العرض الآن.</div>');
    else if(state.route==='account'){if(hosted)return {redirect:'/account'};html=account();}else if(state.route==='admin'&&(!hosted||isAdmin))html=admin();
    else if(hosted&&state.route.startsWith('course:office:'))return {redirect:'/applications#'+state.route.split(':')[2]};else if(state.route.startsWith('course:')&&permitted){const sec=state.route.split(':')[2];html=sec==='home'?courseHome(course):courseSection(course,sec);}
    else if(state.route.startsWith('lesson:')&&canLesson(lessonBy(state.route.split(':')[1])))html=lessonPage(lessonBy(state.route.split(':')[1]));
    else html=heading('المحتوى غير متاح')+`<div class="mh-empty"><p>قد لا يكون متاحًا لهذا العرض حاليًا.</p><button data-go="courses">العودة إلى المقررات</button></div>`;

    return { html };
  }
  return { chrome, page };
}
