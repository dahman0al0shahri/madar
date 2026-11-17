// Build the background and shared assets, then finalize the home document.
// Integration order and template whitespace are compatibility-sensitive.
module.exports = function buildSharedAssets({ site, read, write, replace, execFileSync, path }) {
// Preserve approved background geometry. The sample content is hidden, never used as lesson data.
let bg=read('modules/network-background.html').replaceAll('window.openai','window.MadarBackgroundPersistence');
bg=bg.replace('function reflection(){','function reflection(){if(!canvas.width||!canvas.height||!W||!H)return;');
bg=bg.replace('    refreshMirror();if(saved.view',`    addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==parent||e.data?.type!=='madar-background-page'||typeof e.data.markup!=='string')return;const box=document.createElement('div');box.id='madar-hub';box.innerHTML=e.data.markup;box.querySelectorAll('script,iframe').forEach(x=>x.remove());box.inert=true;page.replaceChildren(box);refreshMirror();});
    refreshMirror();if(saved.view`);
bg=bg.replace('</div>\n  <script>','</div>\n  <script>');
bg+=`<style>html,body{margin:0;background:#090b0e}#madar-net-space .net-stage{height:100vh}#madar-net-space .demo-scroll{visibility:hidden}#madar-net-space .net-pause{display:none}</style><script>addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==parent||e.data?.type!=='madar-background-pointer')return;const stage=document.querySelector('.net-stage');stage.dispatchEvent(new PointerEvent('pointermove',{clientX:e.data.x,clientY:e.data.y,pointerType:'mouse'}));});</script>`;
write('public/network-background.html','<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><link rel="stylesheet" href="/madar-hub.css"><script src="/vendor/lucide-0.468.0.min.js"></script><script src="/network-led.js"></script></head><body>'+bg+'</body></html>');
write('public/network-rj45.js',read('modules/network-rj45.js'));
write('public/network-led.js',read('modules/network-led.js'));
write('public/network-news.html',read('modules/madar-hub/network-news.html'));
write('public/network-news.js',read('modules/madar-hub/network-news.js'));
write('public/rj45-molex-449150001.json',read('modules/madar-hub/rj45-molex-449150001.json'));
write('lib/madar-home.html',read('lib/madar-home.html').replace('</head>','<link rel="stylesheet" href="/madar100.css"></head>').replace('</body>','<script src="/madar100.js" defer></script></body>'));
write('public/madar100-orbit.css',read('modules/madar-hub/centenary-orbit.css'));
write('public/madar100-orbit.js','(()=>{\n'+read('modules/madar-hub/liquid-orbit.js')+'\n'+read('modules/madar-hub/centenary-orbit.js')+'\n})();');
write('lib/madar-home.html',read('lib/madar-home.html').replace('</head>','<link rel="stylesheet" href="/madar100-orbit.css"></head>').replace('</body>','<script src="/madar100-orbit.js" defer></script></body>'));
write('public/index.html',read('lib/madar-home.html'));
write('public/madar-hub.css',read('public/madar-hub.css')+'\n'+read('modules/madar-hub/srwe-announcement.css'));
};
