// Reuse the original liquid renderer and its 24 triads. CSS owns the existing
// 34-second orbital path; its parent changes depth at the ellipse endpoints.
const centenaryOrbits=new Map(),centenaryReduced=matchMedia('(prefers-reduced-motion: reduce)');
function mountCentenaryOrbits(){
  for(const [mark,renderer] of centenaryOrbits)if(!mark.isConnected){renderer.dispose();centenaryOrbits.delete(mark);}
  document.querySelectorAll('#madar-hub .m100-universe').forEach(mark=>{
    if(centenaryOrbits.has(mark))return;
    const moon=mark.querySelector('.m100-moon');if(!moon)return;
    for(const ring of mark.querySelectorAll('.m100-orbit')){
      const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
      svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');
      const ellipse=document.createElementNS(svg.namespaceURI,'ellipse');
      for(const attr of ['cx','cy','rx','ry'])ellipse.setAttribute(attr,'50%');
      svg.append(ellipse);ring.append(svg);
    }
    const canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');moon.append(canvas);
    centenaryOrbits.set(mark,createLiquidOrbit(mark,{bubbleSelector:'.m100-moon',position:false,signatureGold:true,size:mark.closest('.m100-emblem')?40:112}));
  });
}
let centenaryFrame=0;
function tickCentenaryOrbits(t){
  const stopped=centenaryReduced.matches||document.hidden||document.documentElement.dataset.m100Paused==='true'||document.documentElement.dataset.m100Hidden==='true';
  for(const [mark,renderer] of centenaryOrbits)renderer.tick(t,stopped||!!mark.closest('.m100-paused'));
  centenaryFrame=requestAnimationFrame(tickCentenaryOrbits);
}
const centenaryObserver=new MutationObserver(mountCentenaryOrbits);
centenaryObserver.observe(document.querySelector('#madar-hub'),{childList:true,subtree:true});
mountCentenaryOrbits();centenaryFrame=requestAnimationFrame(tickCentenaryOrbits);
addEventListener('pagehide',()=>{cancelAnimationFrame(centenaryFrame);centenaryFrame=0;});
addEventListener('pageshow',()=>{if(!centenaryFrame)centenaryFrame=requestAnimationFrame(tickCentenaryOrbits);});
