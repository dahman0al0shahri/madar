const replaceExpected = require('./checked-replacement.cjs');
const { fillHubSlots } = require('./hub-slots.cjs');
const shellFile = 'modules/madar-hub/shell.html';

function integrateLab(read, write) {
  const file = 'lib/network-simulator.html';
  const styles = replaceExpected(read(file), file, 'lab styles', '</head>', '<link rel="stylesheet" href="/network-page.css"><link rel="stylesheet" href="/notes.css"></head>');
  const boot = '<script src="/network-boot.js">';
  write('lib/network-simulator.html', replaceExpected(styles, file, 'lab scripts', boot, '<script src="/notes.js"></script><script src="/network-page.js"></script>' + boot));
}

function hubScript(read) {
  const join = files => files.map(read).join('\n');
  const hintsFile = 'public/network-hint-history.html';
  const hints = read(hintsFile).replace(/\r\n/g, '\n').match(/<main id="history">[\s\S]*?<\/main>/g) || [];
  if (hints.length !== 1) throw Error(hintsFile + ': expected one hint history template, found ' + hints.length);
  const hintMarkup = hints[0].replace('<main id="history">', '<div id="history">').replace('</main>', '</div>');
  return fillHubSlots(read('modules/madar-hub/app.js'), {
    'preview-catalog': '',
    environment: read('modules/madar-hub/host-environment.js'),
    'frame-support': join(['modules/madar-hub/network-frame.js', 'modules/madar-hub/mobile-practical.js',
      'modules/madar-hub/lesson-progress.js', 'modules/madar-hub/page-reflection.js', 'modules/madar-hub/background-lifecycle.js']),
    'scene-support': join(['modules/madar-hub/liquid-orbit.js', 'modules/madar-hub/network-news-host.js', 'modules/madar-hub/srwe-announcement.js']),
    'course-support': join(['modules/madar-hub/os1.js', 'modules/madar-hub/os-practice.js', 'modules/madar-hub/os-wallpaper.js',
      'modules/madar-hub/os-desktop.js', 'modules/madar-hub/os-curriculum.js',
      'modules/madar-hub/network-practical-index.js', 'modules/madar-hub/network-theory.js', 'modules/madar-hub/lesson-integrated.js'])
      + '\nconst hintHistoryMarkup = ' + JSON.stringify('<section id="mh-hint-history-root">'+hintMarkup+'</section>') + ';\n',
    'course-tools': join(['modules/madar-hub/search.js', 'modules/madar-hub/network-reference.js', 'modules/madar-hub/network-selftest.js']),
    'mount-adapter': read('modules/madar-hub/route-adapter.js'),
    startup: read('modules/madar-hub/host-startup.js'),
  });
}

function homeDocument(read) {
  let shell = read(shellFile);
  const preview = shell.match(/<details class="mh-preview-tools"[\s\S]*?<\/details>/g) || [];
  if (preview.length !== 1) throw Error(shellFile + ': expected one preview toolbar, found ' + preview.length);
  shell = shell.replace(preview[0], '<div hidden><input id="mh-fail" type="checkbox"><select id="mh-viewer"><option value="student">الحساب الحالي</option></select></div><div id="mh-owner-tools" hidden><button data-go="admin">إدارة المقررات والمستجدات</button></div>');
  shell = replaceExpected(shell, shellFile, 'delete wording', 'سيُحذف من هذه المعاينة ومن كل أماكن ظهوره. لن يؤثر هذا في المنصة المنشورة أو تقدّم أي طالب.','سيُحذف المستجد من جميع أماكن ظهوره. لا تُحذف المختبرات أو ملاحظات الطلاب.');
  shell = replaceExpected(shell, shellFile, 'recovery buttons', '<button id="mh-stay">','<button id="mh-recover-export">تنزيل المسودة</button><button id="mh-recover-load">تحميل نسخة الحساب</button><button id="mh-stay">');
  shell = replaceExpected(shell, shellFile, 'background frame', '<div class="mh-atmosphere"','<iframe id="mh-network-background" title="خلفية الشبكة" tabindex="-1" aria-hidden="true" hidden></iframe><div class="mh-atmosphere"');
  const legacy=`<script>if(['account','my-space'].includes(location.hash.slice(1)))location.replace('/account');else if(['home','word','excel','access','learn','quiz','reference','saved','mistakes','about','session','results'].includes(location.hash.slice(1).split('/')[0]))location.replace('/applications'+location.search+location.hash);</script>`;
  shell+='<link rel="stylesheet" href="/hint-history-embedded.css"><script src="/hint-history-model.js"></script><script src="/hint-history.js"></script>';
  return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>مدار · مقرراتك في مكان واحد</title>${legacy}<link rel="icon" href="/assets/favicon-orbit.svg"><link rel="stylesheet" href="/madar-hub.css"><link rel="stylesheet" href="/notes.css"><link rel="stylesheet" href="/feedback-center.css"><script src="/vendor/lucide-0.468.0.min.js"></script></head><body>${shell}<script src="/madar-persistence.js"></script><script src="/activity.js"></script><script src="/notes.js"></script><script src="/feedback-center.js"></script><script src="/os-practice-model.js"></script><script src="/madar-hub.js"></script><script src="/madar-space.js"></script></body></html>`;
}

function hubStyles(read) {
  const sources = [
    'styles.css',
    'refinement.css',
    'global-space.css',
    'liquid-orbit.css',
    'office-celebration.css',
    'network-card.css',
    'network-news.css',
    'network-theory.css',
    'network-practical-index.css',
    'os1.css',
    'os-practice.css',
    'os-desktop.css',
    'os-curriculum.css',
  ];
  const sheets = sources.map(name => read('modules/madar-hub/' + name));
  return sheets.join('\n') + '\nhtml,body{margin:0;background:#101118}#madar-hub{border-radius:0;min-height:100vh}#mh-owner-tools{padding:15px 34px}#mh-network-background{position:fixed;inset:0;width:100%;height:100%;border:0;z-index:-1;pointer-events:none}#madar-hub[data-course=network] .mh-atmosphere{display:none}#madar-hub[data-course=network]{background:#090b0e}#madar-hub[data-course=network] #mh-main{background:transparent}';
}

function embeddedHints(css) {
  return css.replace(/([^{}]+)\{/g, (whole, selector) => {
    const rule = selector.trim();
    if (rule.startsWith('@')) return whole;
    if ([':root', 'html,body', 'body'].includes(rule)) return '#mh-hint-history-root{';
    return '#mh-hint-history-root :is(' + rule + '){';
  });
}

module.exports = function buildHub({ read, write }) {
  integrateLab(read, write);
  const app = hubScript(read);
  const space = read('modules/madar-hub/global-space.js');
  new Function(app);
  new Function(space);
  write('public/madar-space.js', space);
  write('public/madar-hub.js', app);
  write('public/hint-history-embedded.css', embeddedHints(read('public/hint-history.css')));
  write('public/madar-hub.css', hubStyles(read));
  write('lib/madar-home.html', homeDocument(read));
};
