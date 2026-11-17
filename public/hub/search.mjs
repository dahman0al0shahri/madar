const aliases = {
  office: 'أوفيس Office', network: 'شبكات Networking', word: 'Word وورد ورد',
  excel: 'Excel إكسل اكسيل', access: 'Access أكسس اكسيس', vlan: 'VLAN فيلان',
  trunk: 'Trunk ترنك', inter: 'Inter VLAN انتر فيلان',
};

export function searchText(value) {
  return String(value || '').normalize('NFKD').replace(/\p{M}/gu, '').replace(/ـ/g, '')
    .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي')
    .replace(/[٠-٩]/g, c => String('٠١٢٣٤٥٦٧٨٩'.indexOf(c))).toLowerCase().trim();
}

// Visibility is supplied by the model. Search never changes state or permissions.
export function findSearchResults({ query, scope, courses, lessons, available, canLesson, hosted }) {
  const text = hosted ? searchText(query) : query.trim().toLocaleLowerCase();
  const words = text.split(/\s+/).filter(Boolean);
  const matches = value => hosted
    ? words.every(word => searchText(value).includes(word))
    : value.toLowerCase().includes(text);
  const courseHits = available().filter(id => (scope === 'all' || scope === id)
    && matches(courses[id].name + (hosted ? ' ' + aliases[id] : '')))
    .map(id => ({ title: courses[id].name, sub: 'مقرر', route: `course:${id}:home` }));
  const lessonHits = lessons.filter(lesson => canLesson(lesson)
    && (scope === 'all' || scope === lesson.course)
    && matches(lesson.title + ' ' + lesson.kind + ' ' + courses[lesson.course].name
      + (hosted ? ' ' + (aliases[lesson.section] || '') + ' '
        + (lesson.theory ? lesson.theory.english + ' ' + lesson.theory.terms.join(' ') : '') : '')))
    .map(lesson => ({ title: lesson.title, sub: courses[lesson.course].name + ' · ' + lesson.kind, route: `lesson:${lesson.id}` }));
  return [...courseHits, ...lessonHits];
}

export function searchResultsMarkup(results, { limit, hosted, esc, icon }) {
  const shown = hosted ? results.slice(0, limit) : results;
  const hits = shown.map(hit => `<button class="mh-search-hit" data-search-go="${hosted ? esc(hit.route) : hit.route}"><span>${esc(hit.title)}<small>${esc(hit.sub)}</small></span>${icon('arrow-left')}</button>`).join('');
  if (!hosted) return hits || '<p class="mh-muted">لا توجد نتائج متاحة مطابقة.</p>';
  return '<p class="mh-search-count" role="status">' + (results.length
    ? 'عرض ' + shown.length + ' من ' + results.length + ' نتيجة'
    : 'لا توجد نتائج مطابقة؛ جرّب كلمة أقصر أو غيّر النطاق.') + '</p>' + hits
    + (results.length > shown.length ? '<button id="mh-search-more">عرض المزيد</button>' : '');
}

export function createSearchController({ readQuery, readScope, showResults, paintIcons, ...catalog }) {
  let limit = 20;
  function search(reset = true) {
    if (reset) limit = 20;
    const results = findSearchResults({ ...catalog, query: readQuery(), scope: readScope() });
    showResults(searchResultsMarkup(results, { ...catalog, limit }));
    paintIcons();
  }
  return { search, more() { limit += 20; search(false); } };
}
