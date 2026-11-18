// Existing templates use explicit catalog, formatting and model readers.
// Rendering does not save, navigate or mutate model state.
export function createEditorViews({ getState, getAccountFilter, courses, lessons, profile,
  available, canLesson, lessonBy, lessonPosition, heading, esc, icon, scene, hosted, getGrants }) {
  function visitRow(courseId) {
    const visit = profile().visits[courseId];
    const lesson = lessonBy(visit?.lesson);
    if (!canLesson(lesson)) return '';

    return `<article class="mh-list-row">${icon('bookmark')}<div><span class="mh-kicker">${courses[courseId].name}</span>`
      + `<h3>${esc(lesson.title)}</h3><p class="mh-muted">آخر موضع: ${esc(lessonPosition(lesson, visit))}</p>`
      + '<p class="mh-footnote">آخر وصول محفوظ، وليس دليل إتقان.</p></div>'
      + `<button data-go="lesson:${lesson.id}">متابعة</button></article>`;
  }

  function noteRow([id, text]) {
    return `<article class="mh-list-row"><div><span class="mh-kicker">${courses[lessonBy(id).course].name}</span>`
      + `<h3>${esc(lessonBy(id).title)}</h3><p style="white-space:pre-wrap">${esc(text)}</p></div>`
      + `<button data-go="lesson:${id}">فتح الدرس</button></article>`;
  }

  function account() {
    const filter = getAccountFilter();
    const visible = available();
    const visits = visible.filter(id => filter === 'all' || id === filter).map(visitRow).join('');
    const notes = Object.entries(profile().notes).filter(([id, text]) =>
      text && canLesson(lessonBy(id)) && (filter === 'all' || lessonBy(id).course === filter)
    );

    const title = heading('مساحتك في مدار');
    const tabs = [['all', 'كل المقررات'], ...visible.map(id => [id, courses[id].name])];
    const filters = tabs.map(([id, label]) =>
      `<button data-filter="${id}" aria-pressed="${filter === id}">${label}</button>`
    ).join('');
    const visitList = visits || '<div class="mh-empty">ابدأ درسًا ليظهر مكانك هنا.</div>';
    const noteList = notes.map(noteRow).join('') || '<div class="mh-empty">لا توجد ملاحظات محفوظة في هذه المعاينة بعد.</div>';

    return title + `<div class="mh-account-tabs">${filters}</div>`
      + `<div class="mh-section-head"><h2>آخر مكان وقفت عنده</h2></div><div class="mh-list">${visitList}</div>`
      + `<div class="mh-section-head mh-space-top"><h2>ملاحظاتي</h2></div><div class="mh-list">${noteList}</div>`;
  }

  function grantsMarkup() {
    return '<p>للصلاحية الخاصة: اكتب معرّفات الحسابات مفصولة بفاصلة. يمكن الرجوع إلى <a href="/admin/members">إدارة المشتركين</a>.</p>'
      + `<label>حسابات مقرر الشبكات<input data-grant="network" value="${esc((getGrants().network || []).join(','))}"></label>`;
  }

  function lessonGrantMarkup(lesson) {
    return `<input aria-label="حسابات ${esc(lesson.title)}" data-grant="${lesson.id}" value="${esc((getGrants()[lesson.id] || []).join(','))}">`;
  }

  function accessOptions(value) {
    const options = [['public', 'متاح للجميع'], ['restricted', 'بصلاحية'], ['draft', 'مسودة']];
    return options.map(([key, label]) =>
      `<option value="${key}" ${key === value ? 'selected' : ''}>${label}</option>`
    ).join('');
  }

  function courseAccessRows(id, state) {
    const courseRow = `<div class="mh-admin-row"><h3>${courses[id].name}</h3><label>حالة المقرر`
      + `<select data-course-access="${id}">${accessOptions(state.access[id])}</select></label></div>`;
    const lessonRows = lessons.filter(lesson => lesson.course === id).map(lesson =>
      `<div class="mh-admin-row"><span>${lesson.title}</span><label>ظهور المحتوى${hosted ? lessonGrantMarkup(lesson) : ''}`
      + `<select data-content-access="${lesson.id}">${accessOptions(state.contentAccess[lesson.id] || 'public')}</select></label></div>`
    ).join('');
    return courseRow + lessonRows;
  }

  function updateRow(update) {
    const status = update.status === 'draft' ? 'مسودة' : (hosted ? 'متاح' : 'متاح في المعاينة');
    return `<div class="mh-admin-row"><div><h3>${esc(update.title)}</h3><span class="mh-badge">${status}</span> `
      + `<small>${update.pin ? 'مثبّت · ' : ''}${update.course ? courses[update.course]?.name : 'مدار'}</small></div>`
      + `<div class="mh-actions"><button data-edit-update="${esc(update.id)}">تعديل ومعاينة</button>`
      + `<button data-delete-update="${esc(update.id)}" aria-label="حذف ${esc(update.title)}">${icon('trash-2')}</button></div></div>`;
  }

  function admin() {
    const state = getState();
    const title = heading(hosted ? 'إدارة المقررات والمستجدات' : 'إدارة المعاينة', hosted ? 'الظهور والمستجدات' : 'تعديلات محلية فقط');
    const grants = hosted ? grantsMarkup() : '';
    const courseIds = hosted ? ['network'] : Object.keys(courses);
    const rows = courseIds.map(id => courseAccessRows(id, state)).join('');
    const accessNote = hosted
      ? 'الصلاحيات تتحقق في الخادم. المسودات للمسؤول فقط؛ تطبيقات الحاسب تبقى متاحة للجميع.'
      : 'المحتوى لا يتجاوز صلاحية مقرره. المسودات تبقى في الإدارة فقط، والحفظ السابق لا يُحذف عند تغيير الظهور.';

    return title + '<div class="mh-actions"><button data-go="home">معاينة الرئيسية</button><button data-go="courses">معاينة المقررات</button></div>'
      + `<section class="mh-admin-block"><h2>المقررات وصلاحيات المحتوى</h2>${grants}${rows}<p class="mh-footnote">${accessNote}</p></section>`
      + '<section class="mh-admin-block"><div class="mh-section-head"><h2>المستجدات</h2>'
      + `<button id="mh-new-update">${icon('plus')}مستجد جديد</button></div>${state.updates.map(updateRow).join('')}</section>`
      + `<div id="mh-editor-slot">${state.editor ? editorMarkup() : ''}</div>`;
  }

  function targetOptions(update) {
    const home = `<option value="auto" ${!update.target.startsWith('lesson:') ? 'selected' : ''}>رئيسية المقرر أو المقررات</option>`;
    const targets = lessons.filter(lesson => lesson.course === update.course).map(lesson => {
      const target = `lesson:${lesson.id}`;
      return `<option value="${target}" ${update.target === target ? 'selected' : ''}>${lesson.title}</option>`;
    }).join('');
    return home + targets;
  }

  function courseOptions(selected) {
    return Object.keys(courses).map(id =>
      `<option value="${id}" ${selected === id ? 'selected' : ''}>${courses[id].name}</option>`
    ).join('');
  }

  function placementOptions(places) {
    const selected = places.length === 2 ? 'both' : places[0];
    return [['global', 'رئيسية مدار'], ['course', 'رئيسية المقرر'], ['both', 'المكانان']].map(([key, label]) =>
      `<option value="${key}" ${selected === key ? 'selected' : ''}>${label}</option>`
    ).join('');
  }

  function editorMarkup() {
    const update = getState().editor;
    const content = `<label class="mh-wide">العنوان<input name="title" maxlength="100" required value="${esc(update.title)}"></label>`
      + `<label class="mh-wide">النص<textarea name="body" maxlength="500" required>${esc(update.body)}</textarea></label>`;
    const destination = `<label>المقرر<select name="course"><option value="">مدار العامة</option>${courseOptions(update.course)}</select></label>`
      + `<label>مكان الظهور<select name="placement">${placementOptions(update.places)}</select></label>`
      + `<label>وجهة زر البطاقة<select name="destination">${targetOptions(update)}</select></label>`;
    const status = '<label>الحالة<select name="status">'
      + `<option value="draft" ${update.status === 'draft' ? 'selected' : ''}>مسودة</option>`
      + `<option value="published" ${update.status === 'published' ? 'selected' : ''}>${hosted ? 'متاح' : 'متاح في المعاينة'}</option></select></label>`;
    const schedule = `<label>تاريخ المستجد<input name="date" type="date" required value="${esc(update.date)}"></label>`
      + `<label>بداية الظهور — بتوقيت مكة<input name="start" type="date" value="${esc(update.start)}"></label>`
      + `<label>آخر يوم للظهور — بتوقيت مكة<input name="end" type="date" value="${esc(update.end)}"></label>`
      + `<label>مدة المشهد بالثواني<input name="duration" type="number" min="8" max="60" value="${update.duration}"></label>`
      + `<label class="mh-check"><input name="pin" type="checkbox" ${update.pin ? 'checked' : ''}>تثبيت في البداية</label>`;
    const actions = '<div class="mh-actions"><button type="button" id="mh-save-update" class="mh-primary">حفظ التعديل</button>'
      + '<button type="button" id="mh-preview-update">معاينة البطاقة</button><button type="button" id="mh-cancel-edit">إنهاء التحرير</button></div>';

    return '<section class="mh-admin-block"><h2>تحرير المستجد</h2><form id="mh-editor-form"><div class="mh-admin-grid">'
      + content + destination + status + schedule + '</div>' + actions
      + '<p id="mh-editor-error" role="alert" class="mh-footnote"></p></form><div id="mh-update-preview"></div></section>';
  }

  function previewMarkup(update) {
    return `<div class="mh-news-shell mh-space-top"><article class="mh-news-slide" style="--slide-accent:${courses[update.course]?.color || '#e9c691'}">`
      + `<div class="mh-news-copy"><span class="mh-eyebrow">معاينة قبل الإتاحة</span><h2>${esc(update.title || 'عنوان المستجد')}</h2><p>${esc(update.body)}</p></div>`
      + `<div class="mh-visual">${scene({ ...update, scene: update.course || 'hub' })}</div></article></div>`;
  }

  return { account, admin, targetOptions, editorMarkup, previewMarkup };
}
