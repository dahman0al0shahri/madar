const replaceExpected = require('./checked-replacement.cjs');
const backgroundFile = 'modules/network-background.html';
const homeFile = 'lib/madar-home.html';

function backgroundDocument(read) {
  let bg = replaceExpected(read(backgroundFile), backgroundFile, 'persistence host',
    'window.openai', 'window.MadarBackgroundPersistence', 2);
  bg = replaceExpected(bg, backgroundFile, 'background integration', 'function reflection(){','function reflection(){if(!canvas.width||!canvas.height||!W||!H)return;');
  bg = replaceExpected(bg, backgroundFile, 'background integration', '    refreshMirror();if(saved.view',`    addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==parent||e.data?.type!=='madar-background-page'||typeof e.data.markup!=='string')return;const box=document.createElement('div');box.id='madar-hub';box.innerHTML=e.data.markup;box.querySelectorAll('script,iframe').forEach(x=>x.remove());box.inert=true;page.replaceChildren(box);refreshMirror();});
    refreshMirror();if(saved.view`);
  bg+=`<style>html,body{margin:0;background:#090b0e}#madar-net-space .net-stage{height:100vh}#madar-net-space .demo-scroll{visibility:hidden}#madar-net-space .net-pause{display:none}</style><script>addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==parent||e.data?.type!=='madar-background-pointer')return;const stage=document.querySelector('.net-stage');stage.dispatchEvent(new PointerEvent('pointermove',{clientX:e.data.x,clientY:e.data.y,pointerType:'mouse'}));});</script>`;
  return '<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><link rel="stylesheet" href="/madar-hub.css"><script src="/vendor/lucide-0.468.0.min.js"></script><script src="/network-led.js"></script></head><body>'+bg+'</body></html>';
}

function finishHome(home) {
  const styles = ['madar100', 'madar100-orbit'];
  const links = styles.map(name => '<link rel="stylesheet" href="/' + name + '.css">').join('');
  const scripts = styles.map(name => '<script src="/' + name + '.js" defer></script>').join('');
  const head = replaceExpected(home, homeFile, 'home stylesheet insertion', '</head>', links + '</head>');
  return replaceExpected(head, homeFile, 'home script insertion', '</body>', scripts + '</body>');
}

module.exports = function buildSharedAssets({ read, write }) {
  const home = finishHome(read(homeFile));
  write('public/network-background.html', backgroundDocument(read));
  const assets = [
    ['modules/network-rj45.js', 'network-rj45.js'],
    ['modules/network-led.js', 'network-led.js'],
    ['modules/madar-hub/network-news.html', 'network-news.html'],
    ['modules/madar-hub/network-news.js', 'network-news.js'],
    ['modules/madar-hub/rj45-molex-449150001.json', 'rj45-molex-449150001.json'],
    ['modules/madar-hub/centenary-orbit.css', 'madar100-orbit.css'],
  ];
  for (const [source, name] of assets) write('public/' + name, read(source));
  const orbit = ['liquid-orbit.js', 'centenary-orbit.js'].map(name => read('modules/madar-hub/' + name)).join('\n');
  write('public/madar100-orbit.js', '(()=>{\n' + orbit + '\n})();');
  write(homeFile, home);
  write('public/index.html', home);
  write('public/madar-hub.css', read('public/madar-hub.css') + '\n' + read('modules/madar-hub/srwe-announcement.css'));
};
