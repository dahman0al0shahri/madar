(() => {
  'use strict';

  const data = JSON.parse(document.getElementById('inventory').textContent);
  const {
    map,
    guide,
    files
  } = data;
  const names = Object.keys(files);
  const ids = id => document.getElementById(id);
  const el = (tag, text, cls) => {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (cls) node.className = cls;
    return node;
  };
  const option = (value, label) => new Option(label, value);
  const format = n => Intl.NumberFormat('ar-SA').format(n);
  const roles = {
    source: 'مصدر أو إعداد',
    part: 'جزء أصلي للتجميع',
    generated: 'ناتج مولّد',
    vendor: 'مصدر خارجي',
    test: 'اختبار أو مرجع اختبار',
    documentation: 'توثيق',
    asset: 'مورد ثنائي'
  };
  const reverse = new Map(),
    relatedSteps = new Map(),
    cached = new Map();
  for (const [file, f] of Object.entries(files)) {
    for (const dep of f.deps || []) {
      if (!reverse.has(dep)) reverse.set(dep, []);
      reverse.get(dep).push(file);
    }
  }
  for (const feature of Object.values(guide)) for (const step of feature.steps) {
    if (!relatedSteps.has(step[1])) relatedSteps.set(step[1], []);
    relatedSteps.get(step[1]).push(step);
  }
  const parts = new Map(map.sourceAssemblies.flatMap(unit => unit.parts.map(part => [part, unit])));
  let current = '',
    line = 1,
    ticket = 0,
    page = 0,
    decoded = null,
    lines = [],
    offsets = [];
  const perPage = 18;
  function button(label, action, cls = 'link') {
    const b = el('button', label, cls);
    b.type = 'button';
    b.addEventListener('click', action);
    return b;
  }
  function go(tab, file, at = 1) {
    const route = new URLSearchParams({
      view: tab
    });
    if (file) {
      route.set('file', file);
      route.set('line', at);
    }
    location.hash = route.toString();
    // Selecting the current deep link still restores focus to the reader.
    if (tab === 'files' && file) ids('file-panel').scrollIntoView({
      block: 'nearest'
    });
  }
  function fileLink(file, at = 1, label = file) {
    const a = el('a', label, 'link path');
    a.href = '#' + new URLSearchParams({
      view: 'files',
      file,
      line: at
    }).toString();
    return a;
  }
  function group(host, title, paths) {
    if (!paths?.length) return;
    const d = el('details'),
      links = el('div', undefined, 'links');
    d.append(el('summary', title + ' · ' + format(paths.length)), links);
    for (const p of paths) links.append(fileLink(p));
    host.append(d);
  }
  function showTab(tab) {
    for (const name of ['map', 'files', 'build', 'audit']) ids(name).hidden = tab !== name;
    for (const b of ids('tabs').children) b.setAttribute('aria-current', String(b.dataset.tab === tab));
  }
  function featureMap(id) {
    const feature = map.features.find(f => f.id === id) || map.features[0],
      info = guide[feature.id];
    ids('feature-name').textContent = info.title;
    ids('feature-note').textContent = info.note;
    for (const b of ids('features').children) b.setAttribute('aria-pressed', String(b.dataset.id === feature.id));
    ids('trail').replaceChildren(...info.steps.map(([relation, file, at, why]) => {
      const row = el('div', undefined, 'stop');
      row.append(el('strong', relation), fileLink(file, at, file + ' · L' + at), el('p', why));
      return row;
    }));
    const host = ids('related');
    host.replaceChildren();
    group(host, 'المدخل', [feature.entry]);
    group(host, 'المصادر', feature.sources);
    group(host, 'الربط والتوثيق', feature.integration);
  }
  function listFiles() {
    const query = ids('query').value.trim().toLowerCase(),
      role = ids('role').value;
    const matches = names.filter(p => (!role || files[p].role === role) && (!query || p.toLowerCase().includes(query) || files[p].symbols?.some(symbol => symbol.toLowerCase().includes(query))));
    page = Math.min(page, Math.max(0, Math.ceil(matches.length / perPage) - 1));
    ids('results').textContent = matches.length ? format(page * perPage + 1) + '–' + format(Math.min(matches.length, (page + 1) * perPage)) + ' / ' + format(matches.length) : 'لا توجد نتائج';
    ids('prevFiles').disabled = page === 0;
    ids('nextFiles').disabled = (page + 1) * perPage >= matches.length;
    ids('matches').replaceChildren(...matches.slice(page * perPage, (page + 1) * perPage).map(p => {
      const b = button(p, () => go('files', p), 'filebtn path');
      b.setAttribute('aria-current', String(p === current));
      return b;
    }));
  }
  async function unpack(key) {
    if (cached.has(key)) return cached.get(key);
    const raw = Uint8Array.from(atob(data.payloads[key]), c => c.charCodeAt(0));
    const stream = new Blob([raw]).stream().pipeThrough(new DecompressionStream('gzip'));
    const value = JSON.parse(await new Response(stream).text());
    if (cached.size >= 3) cached.delete(cached.keys().next().value);
    cached.set(key, value);
    return value;
  }
  function setPosition(n) {
    if (!lines.length) return;
    line = Math.max(1, Math.min(lines.length, Math.trunc(Number(n)) || 1));
    ids('line').value = line;
    const start = Math.max(0, Math.min(line - 5, lines.length - 12));
    ids('code').replaceChildren(...lines.slice(start, start + 12).map((str, i) => {
      const at = start + i + 1,
        b = button('', () => jump(at), 'src');
      b.append(el('b', String(at)), el('span', str.slice(0, 1000) + (str.length > 1000 ? ' …' : '')));
      b.setAttribute('aria-pressed', String(at === line));
      return b;
    }));
    explain();
  }
  function jump(n) {
    go('files', current, n);
  }
  function localText(file, text) {
    const t = text.trim(),
      ext = file.replace(/\.inc$/, '').split('.').pop().toLowerCase();
    if (!t) return 'فاصل فارغ بين أجزاء المصدر.';
    if (/^(\/\/|\/\*|\*|<!--|--\s)/.test(t)) return 'تعليق في المصدر؛ يُقرأ مع التعليمات التي يصفها.';
    if (/^[}\]);,\s]+$/.test(t)) return 'نهاية كتلة أو تعبير مفتوح في الأسطر السابقة.';
    if (ext === 'sql') {
      const statement = (lines.slice(0, line).join('\n').split(';').filter(x => x.trim()).at(-1) || t).match(/\b(CREATE TABLE|CREATE INDEX|ALTER TABLE|INSERT INTO|UPDATE|SELECT|DELETE FROM)\s+(?:IF NOT EXISTS\s+)?[\x60"\[]?([\w.]+)/i);
      if (statement) return 'هذا السطر جزء من تعليمة قاعدة البيانات ' + statement[1] + ' على ' + statement[2] + '. راجع قيود الحقول وترتيب الترحيلات عند تعديله.';
    }
    if (ext === 'css' || ext === 'html' && t.startsWith('.')) {
      const prop = t.match(/(?:^|[;{])\s*(--?[\w-]+|[a-z][\w-]*)\s*:\s*([^;}]+)/);
      if (prop) return 'يضبط التنسيق ' + prop[1] + ' على ' + prop[2].slice(0, 90) + ' داخل هذه القاعدة.';
      if (t.includes('{')) return 'تبدأ هنا قاعدة التنسيق ' + t.split('{')[0].slice(0, 130) + '.';
    }
    if (ext === 'html' || ext === 'svg') {
      const tag = t.match(/<(\/?)([a-z][\w:-]*)/i);
      if (tag) return (tag[1] ? 'يغلق عنصر ' : 'يتضمن عنصر ') + tag[2] + ' في بنية المستند. افحص الخصائص والنص الكامل أدناه.';
    }
    if (ext === 'json' || ext === 'yml' || ext === 'yaml') {
      const key = t.match(/^\s*["']?([^"':{}\[\],]+)["']?\s*:/);
      return key ? 'يضبط الحقل ' + key[1] + ' ضمن سجل البيانات أو الإعداد الحالي.' : 'جزء من بنية البيانات؛ يحدّد المفتاح أو العنصر المحيط كيفية قراءته.';
    }
    if (ext === 'md') return t.startsWith('#') ? 'عنوان ينظّم القسم التالي من الدليل.' : 'نص توثيقي يقرأ ضمن عنوان القسم المحيط.';
    if (ext === 'py' || ext === 'sh' || t.startsWith('#!')) return 'جزء من برنامج تشغيل أو أتمتة. يظهر النص الفعلي في نافذة المصدر.';
    return 'سطر ضمن السياق المبين؛ لا توجد له علة مستقلة موثّقة في دليل الخريطة.';
  }
  const verbs = {
    if: 'يتحقق من الشرط',
    choose: 'يختار قيمة بحسب',
    return: 'يعيد إلى المستدعي',
    throw: 'يرفع خطأ',
    await: 'ينتظر اكتمال',
    new: 'ينشئ كائنًا عبر',
    call: 'يستدعي',
    bind: 'يعرّف أو يربط الاسم',
    assign: 'يسند قيمة إلى',
    loop: 'يكرّر بحسب',
    catch: 'يعالج الاستثناء',
    import: 'يستورد من',
    export: 'يعيد التصدير من'
  };
  function explain() {
    const h = ids('explanation'),
      text = lines[line - 1] || '',
      start = offsets[line - 1],
      end = start + Math.max(1, text.length);
    h.replaceChildren();
    ids('line-title').textContent = 'السطر ' + format(line);
    const here = (relatedSteps.get(current) || []).filter(step => step[2] === line);
    for (const step of here) h.append(el('p', step[3]));
    const scope = decoded.symbols.filter(([a, b]) => a < end && b > start).sort((a, b) => a[1] - a[0] - (b[1] - b[0]));
    if (scope.length) h.append(el('p', 'التعريف المحيط: ' + scope[0][2], 'tag'));
    const owner = scope[0];
    const anchors = relatedSteps.get(current) || [];
    if (owner && !here.length) {
      const purpose = anchors.find(step => offsets[step[2] - 1] <= owner[0] && offsets[step[2] - 1] + lines[step[2] - 1].length >= owner[0]);
      if (purpose) h.append(el('p', 'وظيفة التعريف في مدار: ' + purpose[3]));
    }
    const guarded = decoded.branches.filter(([a, b]) => a <= start + text.search(/\S|$/) && b > start);
    for (const [,, expected, condition] of guarded) {
      const row = el('p', 'يتنفذ هذا الفرع عندما يكون الشرط ' + (expected ? 'متحققًا' : 'غير متحقق') + ' · ');
      row.append(el('bdi', condition));
      h.append(row);
    }
    const direct = decoded.ops.filter(op => op[0] >= start && op[0] < end);
    const ops = direct.length ? direct : decoded.ops.filter(op => op[0] < start && op[1] > start).sort((a, b) => a[1] - a[0] - (b[1] - b[0])).slice(0, 1);
    if (ops.length) {
      const wrap = el('div');
      const appendOp = op => {
        const row = el('div', undefined, 'op');
        row.append(document.createTextNode((verbs[op[2]] || op[2]) + ' '), el('bdi', op[3] || '—'));
        wrap.append(row);
      };
      ops.slice(0, 8).forEach(appendOp);
      h.append(wrap);
      if (ops.length > 8) {
        const b = button('عرض بقية العمليات (' + format(ops.length - 8) + ')', () => {
          ops.slice(8).forEach(appendOp);
          b.remove();
        }, 'more');
        h.append(b);
      }
    } else h.append(el('p', localText(current, text)));
    if (decoded.fields.length) {
      const pos = start + text.search(/\S|$/);
      const selected = decoded.fields.filter(field => field[0] <= pos && field[1] > pos).at(-1);
      if (selected) {
        const segments = [];
        let field = selected;
        while (field && field[2] >= 0) {
          segments.unshift(field[3]);
          field = decoded.fields[field[2]];
        }
        const pointer = '/' + segments.map(key => String(key).replaceAll('~', '~0').replaceAll('/', '~1')).join('/');
        const p = el('p', segments.length ? 'موقع القيمة داخل بنية البيانات · ' : 'جذر ملف البيانات · ');
        p.append(el('bdi', segments.length ? pointer : '(root)'));
        h.append(p);
        const packageEntry = current.endsWith('package-lock.json') && segments[0] === 'packages';
        if (packageEntry) {
          const meanings = {
            version: 'الإصدار المثبّت الذي يستخدمه التثبيت القابل للتكرار.',
            integrity: 'بصمة تتحقق بها أداة التثبيت من محتوى الحزمة.',
            resolved: 'العنوان الذي سُجّل لجلب هذه الحزمة.',
            dependencies: 'حزم يحتاجها هذا الإدخال عند التثبيت.',
            engines: 'إصدارات بيئة التشغيل التي يعلن هذا الإدخال دعمها.'
          };
          const key = segments.slice(2).find(k => Object.hasOwn(meanings, k));
          if (key) h.append(el('p', meanings[key]));
        }
      }
    }
    const refs = decoded.bindings.filter(([at, label, uses]) => at >= start && at < end || uses.some(i => i >= start && i < end));
    if (refs.length) {
      const box = el('details');
      box.append(el('summary', 'التعريفات ومواضع استخدامها في هذا الملف · ' + format(refs.length)));
      const number = offset => {
        let lo = 0,
          hi = offsets.length;
        while (lo < hi) {
          const mid = lo + hi >> 1;
          if (offsets[mid] <= offset) lo = mid + 1;else hi = mid;
        }
        return Math.max(1, lo);
      };
      for (const [at, label, uses] of refs) {
        const row = el('p');
        row.append(el('bdi', label), document.createTextNode(' · التعريف '), fileLink(current, number(at), 'L' + number(at)));
        const sites = [...new Set(uses.map(number))];
        if (sites.length) {
          row.append(document.createTextNode(' · يُستخدم في '));
          for (const site of sites) row.append(fileLink(current, site, 'L' + site), document.createTextNode(' '));
        }
        box.append(row);
      }
      h.append(box);
    }
    const change = files[current].history?.find(([first, count]) => first <= line && line < first + count);
    if (change) {
      const p = el('p', 'آخر تعديل مسجّل لهذا السطر في تاريخ المستودع: '),
        a = el('a', data.subjects[change[2]] || change[2].slice(0, 10), 'link');
      a.href = 'https://github.com/dahman0al0shahri/madar/commit/' + change[2];
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      p.append(a);
      h.append(p);
    }
    if (text.length > 1000) {
      const d = el('details'),
        pre = el('pre', text);
      pre.dir = 'ltr';
      pre.style.whiteSpace = 'pre-wrap';
      pre.style.overflowWrap = 'anywhere';
      d.append(el('summary', 'السطر كاملًا · ' + format(text.length) + ' حرفًا'), pre);
      h.append(d);
    }
  }
  async function openFile(name, n) {
    if (!Object.hasOwn(files, name)) name = 'public/hub/course-views.mjs';
    if (name === current && decoded) {
      setPosition(n);
      return;
    }
    const token = ++ticket;
    ids('file-panel').setAttribute('aria-busy','true');
    current = name;
    decoded = null;
    lines = [];
    offsets = [];
    const f = files[name],
      assembly = parts.get(name),
      feature = Object.values(guide).find(g => g.steps.some(step => step[1] === name));
    ids('filename').textContent = name;
    const context = data.summaries[name] || (relatedSteps.get(name) || [])[0]?.[3] || map.areas[name.split('/')[0]] || 'ملف على مستوى جذر المستودع.';
    ids('file-desc').textContent = roles[f.role] + ' · ' + (f.text ? format(f.lines) + ' سطر' : 'حجم ' + format(f.bytes) + ' بايت') + ' — ' + context;
    const relations = ids('file-rel');
    relations.replaceChildren();
    if (feature) relations.append(el('small', feature.title));
    const inputs = f.deps || [],
      callers = reverse.get(name) || [];
    if (inputs.length || callers.length) {
      const graph = el('details', undefined, 'dependency-map');
      graph.open = true;
      graph.append(el('summary', 'خريطة ارتباط هذا الملف'));
      const lanes = el('div', undefined, 'lanes');
      function lane(title, paths) {
        const col = el('section');
        col.append(el('strong', title));
        paths.slice(0, 4).forEach(p => col.append(fileLink(p)));
        if (paths.length > 4) group(col, 'بقية الملفات', paths.slice(4));
        return col;
      }
      const center = el('section', undefined, 'selected-node');
      center.append(el('strong', 'الملف المحدد'), el('bdi', name.split('/').at(-1)));
      if (callers.length) lanes.append(lane('ملفات تستورده', callers));
      lanes.append(center);
      if (inputs.length) lanes.append(lane('ملفات يستوردها', inputs));
      graph.append(lanes);
      relations.append(graph);
    }
    if (assembly) group(relations, 'يُجمّع في', [assembly.output]);
    const unit = map.sourceAssemblies.find(x => x.output === name);
    if (unit) group(relations, 'مصادر التعديل بالترتيب', unit.parts);
    const stage = map.generation.groups.find(g => g.outputs.includes(name));
    if (stage) group(relations, 'مرحلة التوليد', [stage.stage]);
    ids('source-area').hidden = !f.text;
    ids('code').replaceChildren();
    ids('explanation').replaceChildren();
    ids('line').disabled = true;
    ids('symbol').disabled = true;
    listFiles();
    if (!f.text) {
      ids('file-panel').setAttribute('aria-busy','false');
      return;
    }
    try {
      const result = await unpack(f.payload);
      if (token !== ticket) return;
      decoded = result;
      lines = result.content.split('\n');
      if (lines.at(-1) === '') lines.pop();
      let at = 0;
      offsets = lines.map(str => {
        const i = at;
        at += str.length + 1;
        return i;
      });
      function number(offset) {
        let lo = 0,
          hi = offsets.length;
        while (lo < hi) {
          const mid = lo + hi >> 1;
          if (offsets[mid] <= offset) lo = mid + 1;else hi = mid;
        }
        return Math.max(1, lo);
      }
      ids('line').max = Math.max(1, lines.length);
      ids('line').disabled = !lines.length;
      ids('symbol').replaceChildren(option('', 'اختر تعريفًا'), ...result.symbols.map(s => option(number(s[0]), s[2] + ' · ' + number(s[0]))));
      ids('symbol').disabled = !result.symbols.length;
      setPosition(n);
    } catch (error) {
      if (token === ticket) ids('explanation').textContent = 'تعذّر فتح المصدر المضغوط. افتح النسخة بمتصفح حديث. ' + error.message;
    } finally {
      if (token === ticket) ids('file-panel').setAttribute('aria-busy','false');
    }
  }
  function build() {
    const name = ids('product').value,
      g = map.generation.groups.find(x => x.outputs.includes(name)),
      unit = map.sourceAssemblies.find(x => x.output === name);
    const h = ids('assembly');
    h.replaceChildren();
    h.append(el('h3', 'مرحلة البناء'), fileLink(g.stage));
    if (unit) {
      const ol = el('ol');
      for (const p of unit.parts) {
        const li = el('li');
        li.append(fileLink(p));
        ol.append(li);
      }
      h.append(el('h3', 'الأجزاء بالترتيب'), ol);
    } else group(h, 'المدخلات المسجلة للمرحلة كاملة', g.sources);
    h.append(el('h3', 'الناتج'), fileLink(name));
  }
  function audit() {
    const host = ids('findings');
    const fixed = [['قراءة رابط البوابة', 'الرابط غير مكتمل الترميز كان يرمي URIError، وبعض أسماء المسارات كانت تُقرأ من خصائص JavaScript الموروثة.', 'public/hub/navigation.mjs', 'tests/hub-core.test.mjs'], ['نتيجة بحث زائفة', 'المقرر الذي لا يملك اسم بحث بديلًا كان يظهر عند البحث عن undefined.', 'public/hub/search.mjs', 'tests/hub-views.test.mjs'], ['قراءة إعدادات الحساب', 'أزيل تحليل نفس نص JSON مرتين عند تحميل سجل الإعدادات.', 'lib/madar-state.mjs'], ['أنواع الخادم والبناء', 'أضيفت أنواع Vite للموارد الخام، ووُضّح التعامل مع غياب قاعدة البيانات ونوع سجل الإعلان.', 'tsconfig.json', 'app/api/madar/route.ts']];
    for (const [title, why, ...paths] of fixed) {
      const item = el('section', undefined, 'audit-item');
      item.append(el('h3', title), el('p', why));
      for (const p of paths) item.append(fileLink(p), document.createTextNode(' '));
      host.append(item);
    }
    const d = el('details');
    d.append(el('summary', 'مجموعات ملفات متطابقة بالكامل · ' + format(data.exactGroups.length)), el('p', 'تطابق معرّف محتوى Git يثبت تساوي البايتات. قد تُطلب النسختان بمسارين مختلفين أو ينتج أحدهما من الآخر.'));
    for (const paths of data.exactGroups) group(d, paths[0], paths);
    host.append(d);
    for (const [title, rows] of [['مفاتيح مكررة مرشحة للمراجعة', data.duplicateKeys], ['ملاحظات المحلل النحوي', data.parseNotes]]) {
      const box = el('details');
      box.append(el('summary', title + ' · ' + format(rows.length)));
      for (const [file, n, why] of rows) {
        const p = el('p');
        p.append(fileLink(file, n, file + ' · L' + n), document.createTextNode(' — ' + why));
        box.append(p);
      }
      host.append(box);
    }
    host.append(el('p', 'روابط الاستيراد تخص المراجع المحلية الثابتة التي أمكن حلّها. شرح العمليات مستخرج من بنية الشيفرة؛ الأسباب الخاصة التي راجعناها مبيّنة في مسارات الوظائف. الوسائط مفهرسة بالمسار والحجم.', 'hint'));
  }
  function navigate() {
    const params = new URLSearchParams(location.hash.slice(1)),
      view = params.get('view') || 'map';
    const tab = ['map', 'files', 'build', 'audit'].includes(view) ? view : 'map';
    showTab(tab);
    if (tab === 'map') featureMap(params.get('feature'));
    if (tab === 'files') openFile(params.get('file') || current, params.get('line') || 1);
  }
  ids('revision').textContent = 'MADAR / ' + data.revision.slice(0, 10);
  for (const [n, label] of [[names.length, 'ملف مفهرس'], [data.stats.lines, 'سطر نصّي'], [map.features.length, 'مسارات رئيسية']]) {
    const item = el('div');
    item.append(el('strong', format(n)), el('small', label));
    ids('metrics').append(item);
  }
  for (const f of map.features) {
    const b = button(guide[f.id].title, () => {
      location.hash = 'view=map&feature=' + encodeURIComponent(f.id);
    }, '');
    b.dataset.id = f.id;
    ids('features').append(b);
  }
  for (const b of ids('tabs').children) b.addEventListener('click', () => go(b.dataset.tab, b.dataset.tab === 'files' ? current : undefined, line));
  ids('role').append(option('', 'كل الأنواع'), ...Object.entries(roles).map(([k, v]) => option(k, v)));
  ids('query').oninput = ids('role').onchange = () => {
    page = 0;
    listFiles();
  };
  ids('prevFiles').onclick = () => {
    page--;
    listFiles();
  };
  ids('nextFiles').onclick = () => {
    page++;
    listFiles();
  };
  function selectLine() {
    jump(Math.max(1, Math.min(lines.length, Number(ids('line').value) || 1)));
  }
  ids('line').onchange = selectLine;
  ids('line').onkeydown = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      selectLine();
    }
  };
  ids('symbol').onchange = e => {
    if (e.target.value) jump(e.target.value);
  };
  ids('product').append(...map.generation.groups.flatMap(g => g.outputs).map(p => option(p, p)));
  ids('product').onchange = build;
  build();
  audit();
  window.addEventListener('hashchange', navigate);
  navigate();
})();
