/* One clock owns the carousel. Scene examples never save learner data. */
(()=>{'use strict';let dispose=()=>{};
window.MADAR_UPDATES={unmount(){dispose();dispose=()=>{};},mount(main){
 this.unmount();const data=window.MADAR_UPDATE_SCENES;if(!data)return;
 const root=document.createElement('section');root.id='madar-updates';root.setAttribute('aria-roledescription','عرض بطاقات');root.setAttribute('aria-labelledby','updates-heading');
 root.innerHTML='<header class="updates-header"><div><span class="updates-kicker">الجديد في مساحتك</span><h2 id="updates-heading">آخر مستجدات تطبيقات الحاسب المتقدمة</h2></div><button class="updates-play" type="button">إيقاف الحركة</button></header><div class="updates-frame"><div class="updates-slides">'+data.cards.map((c,i)=>c.html.replace('class="update-slide"','class="update-slide"'+(i?' hidden inert':'')+' role="group" aria-roledescription="بطاقة" aria-label="'+(i+1)+' من 4: '+c.title+'"')).join('')+'</div><button class="updates-next" type="button" aria-label="التحديث التالي"><span class="peek-orbit" aria-hidden="true"></span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg><span>اسحب</span></button></div><footer class="updates-footer"><button class="updates-prev" type="button" aria-label="التحديث السابق">→</button><div class="updates-dots" aria-label="اختر تحديثًا">'+data.cards.map((c,i)=>'<button type="button" data-slide="'+i+'" aria-label="'+c.title+'" aria-current="'+(i===0)+'"><span></span></button>').join('')+'</div><span class="updates-count" aria-live="polite"></span><button class="updates-replay" type="button">إعادة المشهد</button></footer><div class="updates-progress" aria-hidden="true"><span></span></div>';
 main.prepend(root);const q=s=>root.querySelector(s),slides=[...root.querySelectorAll('.update-slide')],scenes=data.factories.map(f=>f());
 const reduced=matchMedia('(prefers-reduced-motion:reduce)'),abort=new AbortController(),on=(el,event,fn)=>el.addEventListener(event,fn,{signal:abort.signal});
 let index=0,elapsed=0,last=0,raf=0,paused=reduced.matches,visible=false,transitioning=false,disposed=false,timer=0,endTimer=0,touch=null,suppress=false;
 function running(){return !paused&&visible&&!document.hidden&&!transitioning&&document.body.dataset.skyRunning!=='false';}
 function draw(){const play=running();root.dataset.playing=String(play);root.dataset.index=String(index);root.dataset.elapsed=elapsed.toFixed(2);root.dataset.tint=data.cards[index].tint;q('.updates-play').textContent=play?'إيقاف الحركة':'تشغيل الحركة';scenes[index].render(elapsed,play);q('.updates-progress span').style.width=(elapsed/scenes[index].duration*100)+'%';}
 function controls(){q('.updates-count').textContent=(index+1)+' / '+slides.length;root.querySelectorAll('[data-slide]').forEach((b,i)=>b.setAttribute('aria-current',String(i===index)));}
 function pause(){paused=true;last=0;draw();}
 function toggle(){if(transitioning)return;paused=!paused;last=0;draw();}
 function change(to){if(transitioning||to===index)return;transitioning=true;last=0;root.classList.add('updates-changing');q('.updates-next').disabled=true;
  timer=setTimeout(()=>{if(disposed)return;slides[index].hidden=true;slides[index].inert=true;index=(to+slides.length)%slides.length;slides[index].hidden=false;slides[index].inert=false;elapsed=0;controls();draw();},reduced.matches?0:230);
  endTimer=setTimeout(()=>{if(disposed)return;transitioning=false;root.classList.remove('updates-changing');q('.updates-next').disabled=false;last=0;draw();},reduced.matches?1:900);
 }
 on(q('.updates-play'),'click',toggle);on(q('.updates-next'),'click',()=>change((index+1)%slides.length));on(q('.updates-prev'),'click',()=>change((index-1+slides.length)%slides.length));
 on(q('.updates-replay'),'click',()=>{if(transitioning)return;elapsed=0;paused=false;last=0;draw();});
 root.querySelectorAll('[data-slide]').forEach(b=>on(b,'click',()=>change(Number(b.dataset.slide))));
 root.querySelectorAll('.preview-controls').forEach(e=>{e.hidden=true;e.inert=true;e.setAttribute('aria-hidden','true');});
 root.querySelectorAll('.next-peek,.next-slide').forEach(e=>{e.hidden=true;e.inert=true;});
 root.addEventListener('click',e=>{if(suppress&&performance.now()<suppress){e.preventDefault();e.stopImmediatePropagation();suppress=false;}},{capture:true,signal:abort.signal});
 for(const scene of root.querySelectorAll('.scene-toggle'))on(scene,'click',toggle);
 // Keyboard focus stops rotation until explicit Play. Pointer clicks keep their own action.
 let pointerFocus=false;on(root,'pointerdown',e=>{pointerFocus=true;if(e.pointerType==='touch')touch={x:e.clientX,y:e.clientY};});
 on(root,'focusin',()=>{if(!pointerFocus)pause();pointerFocus=false;});
 on(root,'pointerup',e=>{pointerFocus=false;if(!touch)return;const dx=e.clientX-touch.x,dy=e.clientY-touch.y;touch=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3){suppress=performance.now()+600;change((index+(dx<0?1:-1)+slides.length)%slides.length);}});
 on(root,'pointercancel',()=>{touch=null;});root.querySelectorAll('.copy a').forEach(a=>{on(a,'pointerdown',pause);on(a,'focus',pause);});
 on(document,'visibilitychange',()=>{last=0;draw();});on(reduced,'change',()=>{if(reduced.matches)pause();});
 const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=0;draw();},{threshold:.15});io.observe(root);
 const ro=new ResizeObserver(()=>draw());ro.observe(root);const mo=new MutationObserver(()=>{last=0;draw();});mo.observe(document.body,{attributes:true,attributeFilter:['data-sky-running']});
 function tick(now){if(disposed)return;if(!root.isConnected){cleanup();return;}if(last&&running()){elapsed=Math.min(scenes[index].duration,elapsed+Math.min((now-last)/1000,.1));draw();if(elapsed>=scenes[index].duration)change((index+1)%slides.length);}last=now;raf=requestAnimationFrame(tick);}
 function cleanup(){disposed=true;cancelAnimationFrame(raf);clearTimeout(timer);clearTimeout(endTimer);abort.abort();io.disconnect();ro.disconnect();mo.disconnect();}
 controls();draw();raf=requestAnimationFrame(tick);dispose=cleanup;
}};
})();
