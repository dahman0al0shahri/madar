/* Short route transitions. Content remains interactive; the latest route wins. */
(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let current=null,entry=null,revision=0,indicator=null;
 const nav=document.querySelector('.top nav');
 function positionIndicator(){
  const active=nav?.querySelector('[data-nav].active');if(!active)return;
  if(!indicator){indicator=document.createElement('span');indicator.className='nav-orbit-indicator';indicator.setAttribute('aria-hidden','true');nav.prepend(indicator);nav.classList.add('has-orbit-indicator');}
  const n=nav.getBoundingClientRect(),a=active.getBoundingClientRect();indicator.style.width=`${a.width}px`;indicator.style.height=`${a.height}px`;indicator.style.transform=`translate(${a.left-n.left}px,${a.top-n.top}px)`;
  nav.querySelectorAll('[data-nav]').forEach(link=>{if(link===active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
 }
 function afterRender(){window.MADAR_PROGRAM_UI?.afterRender();positionIndicator();}
 function navigate(render){
  const id=++revision;current?.skipTransition();entry?.cancel();
  const update=()=>{if(id!==revision)return;render();afterRender();};
  if(reduced.matches||document.hidden){update();return;}
  if(typeof document.startViewTransition==='function'){
   try{const transition=document.startViewTransition(update);current=transition;transition.ready.catch(()=>{});transition.finished.catch(()=>{}).finally(()=>{if(current===transition)current=null;});return;}catch{/* Older implementations fall back to a normal route update. */}
  }
  update();const panel=document.querySelector('.shell');if(panel?.animate)entry=panel.animate([{opacity:.2,transform:'translateY(9px)'},{opacity:1,transform:'translateY(0)'}],{duration:260,easing:'cubic-bezier(.2,.7,.2,1)'});
 }
 reduced.addEventListener('change',()=>{if(reduced.matches){current?.skipTransition();entry?.cancel();}});
 if(nav)new ResizeObserver(positionIndicator).observe(nav);document.fonts?.ready.then(positionIndicator);
 window.MADAR_TRANSITIONS={navigate,afterRender,whenSettled:()=>current?.finished.catch(()=>{})||Promise.resolve()};
})();
