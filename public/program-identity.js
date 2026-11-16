/* Approved Office outline artwork and finite motion; no learning state is written here. */
(()=>{'use strict';
const artwork={"word": "<svg class=\"mo-symbol\" viewBox=\"0 0 140 140\" aria-hidden=\"true\">\n        <defs><mask id=\"madar-nav-word-mask\"><rect width=\"140\" height=\"140\" fill=\"white\" stroke=\"none\"/><rect x=\"7\" y=\"39\" width=\"70\" height=\"69\" rx=\"5\" fill=\"black\" stroke=\"none\"/></mask></defs>\n        <g class=\"mo-sheet mo-back\" mask=\"url(#madar-nav-word-mask)\"><rect x=\"41\" y=\"19\" width=\"84\" height=\"105\" rx=\"6\"/><path d=\"M41 45H125M41 71H125M41 97H125\"/></g>\n        <g class=\"mo-tile\"><rect x=\"10\" y=\"42\" width=\"64\" height=\"63\" rx=\"4\"/><path class=\"mo-letter\" d=\"M21 59H27L32 82L38 59H45L51 82L56 59H62L54 90H47L41 68L35 90H28Z\"/></g>\n      </svg>", "excel": "<svg class=\"mo-symbol\" viewBox=\"0 0 140 140\" aria-hidden=\"true\">\n        <defs><mask id=\"madar-nav-excel-mask\"><rect width=\"140\" height=\"140\" fill=\"white\" stroke=\"none\"/><rect x=\"7\" y=\"39\" width=\"70\" height=\"69\" rx=\"5\" fill=\"black\" stroke=\"none\"/></mask></defs>\n        <g class=\"mo-back\" mask=\"url(#madar-nav-excel-mask)\"><rect x=\"41\" y=\"19\" width=\"84\" height=\"105\" rx=\"6\"/><path d=\"M83 19V124M41 45H125M41 71H125M41 97H125\"/><path class=\"mo-cell\" style=\"--i:0\" d=\"M83 19H119Q125 19 125 25V45H83Z\"/><path class=\"mo-cell\" style=\"--i:1\" d=\"M83 45H125V71H83Z\"/><path class=\"mo-cell\" style=\"--i:2\" d=\"M83 71H125V97H83Z\"/><path class=\"mo-cell\" style=\"--i:3\" d=\"M83 97H125V118Q125 124 119 124H83Z\"/><path class=\"mo-cell\" style=\"--i:4\" d=\"M41 97H83V124H47Q41 124 41 118Z\"/></g>\n        <rect x=\"10\" y=\"42\" width=\"64\" height=\"63\" rx=\"4\"/><path class=\"mo-letter\" d=\"M26 58H34L42 69L49 58H57L46 74L58 91H50L42 79L34 91H26L38 74Z\"/>\n      </svg>", "access": "<svg class=\"mo-symbol\" viewBox=\"0 0 140 140\" aria-hidden=\"true\">\n        <defs><mask id=\"madar-nav-access-mask\"><rect width=\"140\" height=\"140\" fill=\"white\" stroke=\"none\"/><rect x=\"7\" y=\"39\" width=\"70\" height=\"69\" rx=\"5\" fill=\"black\" stroke=\"none\"/></mask></defs>\n        <g class=\"mo-back\" mask=\"url(#madar-nav-access-mask)\"><g class=\"mo-tier\" style=\"--i:0;--rise:2\"><path d=\"M42 85V109C42 129 125 129 125 109V85M42 85C42 105 125 105 125 85\"/></g><g class=\"mo-tier\" style=\"--i:1;--rise:5\"><path d=\"M42 58V85C42 105 125 105 125 85V58M42 58C42 78 125 78 125 58\"/></g><g class=\"mo-tier\" style=\"--i:2;--rise:9\"><ellipse cx=\"83.5\" cy=\"30\" rx=\"41.5\" ry=\"13\"/><path d=\"M42 30V58C42 78 125 78 125 58V30\"/></g></g>\n        <rect x=\"10\" y=\"42\" width=\"64\" height=\"63\" rx=\"4\"/><path class=\"mo-letter\" d=\"M25 91L37 58H46L59 91H51L48 83H35L32 91ZM37 77H46L41.5 64Z\"/>\n      </svg>"};
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const timers=new Map();
let nextAnimationAt=0;
const animationDuration=2900,animationRest=900;
const cardTimers=new Map();
let nextCardAt=0;
const cardSelector='.panel,.unit-card,.lesson-notes,.list-card,.metric,.empty,.al-entry,.home-review';
function shimmer(card){
 if(reduced.matches||document.body.dataset.skyRunning==='false'||document.hidden||document.documentElement.dataset.appearance==='light')return;
 if(cardTimers.size||performance.now()<nextCardAt)return;
 nextCardAt=performance.now()+1900;
 card.classList.add('card-sheen');
 cardTimers.set(card,setTimeout(()=>{card.classList.remove('card-sheen');cardTimers.delete(card);},1200));
}
function decorateCards(){
 if(!document.body.dataset.program)return;
 for(const card of document.querySelectorAll(cardSelector)){
  // Treat nested content as one card; do not layer highlights over one another.
  if(card.classList.contains('program-card')||card.parentElement.closest(cardSelector))continue;
  card.classList.add('program-card');
  card.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')shimmer(card);});
  card.addEventListener('focusin',e=>{if(!card.contains(e.relatedTarget))shimmer(card);});
 }
}
const sky=document.createElement('div');sky.className='program-universe';sky.setAttribute('aria-hidden','true');
for(const name of ['word','excel','access']){const layer=document.createElement('div');layer.className='program-universe-layer';layer.dataset.sky=name;layer.innerHTML='<span class="program-cloud"></span>';sky.append(layer);}
document.body.prepend(sky);
function play(link){
 if(reduced.matches||document.body.dataset.skyRunning==='false'||document.hidden)return;
 // One animation across the entire navigation. Ignore bursts; never queue replays.
 if(timers.size||performance.now()<nextAnimationAt)return;
 nextAnimationAt=performance.now()+animationDuration+animationRest;
 link.classList.add('mo-playing');
 timers.set(link,setTimeout(()=>{link.classList.remove('mo-playing');timers.delete(link);},animationDuration));
}
function decorate(){
 for(const [key,name] of Object.entries({word:'word',excel:'excel',access:'access'})){
  const link=document.querySelector('[data-nav="'+key+'"]');if(!link||link.dataset.program)continue;
  link.querySelector('svg')?.remove();link.dataset.program=name;link.classList.add('program-tab','mo-'+name);
  const label=document.createElement('span');label.className='program-label';while(link.firstChild)label.append(link.firstChild);
  const emblem=document.createElement('span');emblem.className='mo-emblem';emblem.setAttribute('aria-hidden','true');emblem.innerHTML=artwork[name];
  const space=document.createElement('span');space.className='mo-space';space.setAttribute('aria-hidden','true');space.innerHTML='<i class="mo-stars"></i>';
  link.append(space,emblem,label);
  emblem.querySelectorAll('path,rect,ellipse').forEach(shape=>{
   if(shape.closest('defs'))return;
   if(shape.classList.contains('mo-cell')){const g=document.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('class','mo-cell');g.setAttribute('style',shape.getAttribute('style'));shape.before(g);g.append(shape);shape.removeAttribute('class');shape.removeAttribute('style');}
   const edge=shape.cloneNode(true);edge.setAttribute('class','mo-edge');edge.setAttribute('pathLength','100');edge.style.setProperty('--edge-delay',(emblem.querySelectorAll('.mo-edge').length%3*45)+'ms');shape.after(edge);
  });
  link.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')play(link);});
  link.addEventListener('focus',()=>play(link));link.addEventListener('click',()=>play(link));
 }
}
function afterRender(){
 decorate();const parts=location.hash.slice(1).split('/');const view=parts[0]||'home';
 let name=['excel','access'].includes(view)?view:['word','learn','session','results'].includes(view)?'word':null;
 // Word uses the original #quiz route; an omitted course is not a neutral view.
 if(view==='quiz')name=['excel','access'].includes(parts[1])?parts[1]:'word';
 if(['saved','mistakes'].includes(view))name=['word','excel','access'].includes(parts[1])?parts[1]:null;
 if(name)document.body.dataset.program=name;else delete document.body.dataset.program;
 decorateCards();
 sky.querySelectorAll('[data-sky]').forEach(layer=>layer.dataset.active=String(layer.dataset.sky===name));
 const active=document.querySelector('.top nav a.active');document.querySelector('.top nav')?.classList.toggle('program-active',!!active?.dataset.program);
}
function stop(){if(reduced.matches||document.hidden||document.body.dataset.skyRunning==='false'){for(const [link,timer] of timers){clearTimeout(timer);link.classList.remove('mo-playing');}timers.clear();for(const [card,timer] of cardTimers){clearTimeout(timer);card.classList.remove('card-sheen');}cardTimers.clear();}}
new MutationObserver(stop).observe(document.body,{attributes:true,attributeFilter:['data-sky-running']});
reduced.addEventListener('change',stop);document.addEventListener('visibilitychange',stop);
window.MADAR_PROGRAM_UI={afterRender};
})();
