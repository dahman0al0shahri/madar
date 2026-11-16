/* Living opening artwork. The user can pause all ambient motion. */
(()=>{
 const ns='http://www.w3.org/2000/svg',reduced=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width:600px)');
 let enabled=true,stage=null,visible=true,observer=null,generation=0;
 function starfield(target){
  document.querySelector('.space-stars')?.remove();
  const sky=document.createElement('div');sky.className='space-stars';sky.setAttribute('aria-hidden','true');let seed=947;
  const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const count=mobile.matches?36:72,cols=mobile.matches?6:12;
  for(let i=0;i<count;i++){const star=document.createElement('i'),x=((i%cols)+.15+random()*.7)/cols*100,y=(Math.floor(i/cols)+.12+random()*.76)/6*100,near=i%12===0;
   star.className='space-star'+(near?' space-star-near':'');
   star.style.cssText=`left:${x.toFixed(2)}%;top:${y.toFixed(2)}%;--size:${((near?2.8:1.5)+random()*1.2).toFixed(2)}px;--period:${(4.8+random()*5.8).toFixed(2)}s;--phase:${(-random()*14).toFixed(2)}s;--peak:${(.65+random()*.2).toFixed(2)};--star-color:${i%4===0?'#c7ddff':i%7===0?'#f6d8ab':'#f4efff'};`;
   sky.append(star);
  }target.prepend(sky);
 }
 function sync(){const running=enabled&&!reduced.matches&&!document.hidden&&document.body.dataset.theme!=='calm';document.body.dataset.skyRunning=String(running);if(stage)stage.dataset.ambientRunning=String(running&&visible);document.querySelectorAll('.ambient-toggle').forEach(button=>{button.disabled=reduced.matches;button.setAttribute('aria-pressed',String(enabled&&!reduced.matches));button.textContent=reduced.matches?'الحركة مخففة حسب جهازك':enabled?'Ⅱ إيقاف الأجواء المتحركة':'▷ تشغيل الأجواء المتحركة';});}
 function control(parent){const button=document.createElement('button');button.type='button';button.className='ambient-toggle';button.addEventListener('click',()=>{enabled=!enabled;if(!enabled)stage?.querySelector('.stop-celebration')?.click();sync();});parent.append(button);}
 async function artwork(){const target=stage,id=++generation;if(!target)return;const picture=target.querySelector('.festival-picture');if(!picture)return;
  try{const response=await fetch('/assets/festival'+(mobile.matches?'-mobile':'')+(document.documentElement.dataset.appearance==='light'?'-sage':'')+'.svg');if(!response.ok)return;const parsed=new DOMParser().parseFromString(await response.text(),'image/svg+xml');if(id!==generation||!target.isConnected||parsed.querySelector('parsererror'))return;
   const svg=document.importNode(parsed.documentElement,true);svg.classList.add('festival-art');svg.setAttribute('aria-hidden','true');
   const uses=[...svg.querySelectorAll('use')];uses.forEach((star,i)=>{const g=document.createElementNS(ns,'g');g.classList.add('ambient-star');g.style.setProperty('--delay',`${-i*1.7}s`);g.style.setProperty('--duration',`${6.5+i%3*1.4}s`);star.replaceWith(g);g.append(star);});
   [...svg.querySelectorAll('path[stroke^="url"]')].forEach((p,i)=>{const g=document.createElementNS(ns,'g');g.classList.add('ambient-ribbon');g.style.setProperty('--delay',`${-i*2}s`);p.replaceWith(g);g.append(p);const glint=p.cloneNode(true);glint.classList.add('ribbon-glint');glint.setAttribute('stroke','#fff3d1');glint.setAttribute('stroke-width',mobile.matches?'1.5':'2.5');glint.setAttribute('stroke-linecap','round');glint.setAttribute('pathLength','1000');glint.style.setProperty('--delay',`${-i*3}s`);g.append(glint);});
   [...svg.children].filter(g=>g.tagName.toLowerCase()==='g'&&g.hasAttribute('stroke')).forEach((g,i)=>{g.classList.add('ambient-burst');g.style.setProperty('--delay',`${-i*2}s`);});
   picture.replaceChildren(svg);target.dataset.ambientReady='true';sync();
  }catch{target.dataset.ambientReady='unavailable';}
 }
 function bind(){const found=document.querySelector('.opening-stage');if(found===stage)return;observer?.disconnect();stage=found;if(!stage){sync();return;}visible=true;
  control(stage.querySelector('.celebration-controls'));
  observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:0});observer.observe(stage);sync();void artwork();
 }
 starfield(document.body);const bar=document.querySelector('.workspace-bar');if(bar)control(bar);sync();
 new MutationObserver(bind).observe(document.documentElement,{childList:true,subtree:true});
 document.addEventListener('madar:appearance',()=>{sync();void artwork();});document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);mobile.addEventListener('change',()=>{starfield(document.body);sync();void artwork();});document.addEventListener('click',e=>{if(e.target.closest('#theme-toggle'))sync();});
})();

