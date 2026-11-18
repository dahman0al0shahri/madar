// Integrate the course hub, account persistence, navigation and shared styles.
// Integration order and template whitespace are compatibility-sensitive.
module.exports = function buildHub({ site, read, write, replace, execFileSync, path }) {
let shell=read('modules/madar-hub/shell.html');
write('lib/network-simulator.html',read('lib/network-simulator.html').replace('</head>','<link rel="stylesheet" href="/network-page.css"><link rel="stylesheet" href="/notes.css"></head>').replace('<script src="/network-boot.js">','<script src="/notes.js"></script><script src="/network-page.js"></script><script src="/network-boot.js">'));
shell=shell.replace(/<details class="mh-preview-tools"[\s\S]*?<\/details>/,'<div hidden><input id="mh-fail" type="checkbox"><select id="mh-viewer"><option value="student">الحساب الحالي</option></select></div><div id="mh-owner-tools" hidden><button data-go="admin">إدارة المقررات والمستجدات</button></div>');
shell=shell.replace('سيُحذف من هذه المعاينة ومن كل أماكن ظهوره. لن يؤثر هذا في المنصة المنشورة أو تقدّم أي طالب.','سيُحذف المستجد من جميع أماكن ظهوره. لا تُحذف المختبرات أو ملاحظات الطلاب.');
const { fillHubSlots } = require('./hub-slots.cjs');
const join = files => files.map(read).join('\n');
const hintMarkup=read('public/network-hint-history.html').replace(/\r\n/g,'\n').match(/<main id="history">[\s\S]*?<\/main>/)?.[0]?.replace('<main id="history">','<div id="history">').replace('</main>','</div>');
if(!hintMarkup)throw Error('Missing hint history template');
const app = fillHubSlots(read('modules/madar-hub/app.js'), {
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
shell=shell.replace('<button id="mh-stay">','<button id="mh-recover-export">تنزيل المسودة</button><button id="mh-recover-load">تحميل نسخة الحساب</button><button id="mh-stay">');
new Function(read('modules/madar-hub/global-space.js'));write('public/madar-space.js',read('modules/madar-hub/global-space.js'));
// Only static document/style assembly remains here; runtime rules belong to native modules/adapters.
write('public/hint-history-embedded.css',read('public/hint-history.css').replace(/([^{}]+)\{/g,(whole,selector)=>{const s=selector.trim();if(s.startsWith('@'))return whole;if([':root','html,body','body'].includes(s))return '#mh-hint-history-root{';return '#mh-hint-history-root :is('+s+'){';}));
new Function(app);write('public/madar-hub.js',app);write('public/madar-hub.css',read('modules/madar-hub/styles.css')+'\n'+read('modules/madar-hub/refinement.css')+'\n'+read('modules/madar-hub/global-space.css')+'\n'+read('modules/madar-hub/liquid-orbit.css')+'\n'+read('modules/madar-hub/office-celebration.css')+'\n'+read('modules/madar-hub/network-card.css')+'\n'+read('modules/madar-hub/network-news.css')+'\n'+read('modules/madar-hub/network-theory.css')+'\n'+read('modules/madar-hub/network-practical-index.css')+'\n'+read('modules/madar-hub/os1.css')+'\n'+read('modules/madar-hub/os-practice.css')+'\n'+read('modules/madar-hub/os-desktop.css')+'\n'+read('modules/madar-hub/os-curriculum.css')+'\nhtml,body{margin:0;background:#101118}#madar-hub{border-radius:0;min-height:100vh}#mh-owner-tools{padding:15px 34px}#mh-network-background{position:fixed;inset:0;width:100%;height:100%;border:0;z-index:-1;pointer-events:none}#madar-hub[data-course=network] .mh-atmosphere{display:none}#madar-hub[data-course=network]{background:#090b0e}#madar-hub[data-course=network] #mh-main{background:transparent}');
shell=shell.replace('<div class="mh-atmosphere"','<iframe id="mh-network-background" title="خلفية الشبكة" tabindex="-1" aria-hidden="true" hidden></iframe><div class="mh-atmosphere"');
const legacy=`<script>if(['account','my-space'].includes(location.hash.slice(1)))location.replace('/account');else if(['home','word','excel','access','learn','quiz','reference','saved','mistakes','about','session','results'].includes(location.hash.slice(1).split('/')[0]))location.replace('/applications'+location.search+location.hash);</script>`;
shell+='<link rel="stylesheet" href="/hint-history-embedded.css"><script src="/hint-history-model.js"></script><script src="/hint-history.js"></script>';
write('lib/madar-home.html',`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>مدار · مقرراتك في مكان واحد</title>${legacy}<link rel="icon" href="/assets/favicon-orbit.svg"><link rel="stylesheet" href="/madar-hub.css"><link rel="stylesheet" href="/notes.css"><link rel="stylesheet" href="/feedback-center.css"><script src="/vendor/lucide-0.468.0.min.js"></script></head><body>${shell}<script src="/madar-persistence.js"></script><script src="/activity.js"></script><script src="/notes.js"></script><script src="/feedback-center.js"></script><script src="/os-practice-model.js"></script><script src="/madar-hub.js"></script><script src="/madar-space.js"></script></body></html>`);
};
