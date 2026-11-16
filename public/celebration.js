/* Local visual prototype. Brief, silent, cancellable motion. No learner data. */
(()=>{
 let frame=0,active=false,entered=false,started=0,particles=[],canvas,ctx;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function stop(){cancelAnimationFrame(frame);frame=0;active=false;particles=[];ctx?.clearRect(0,0,canvas.width,canvas.height);document.querySelector('.stop-celebration')?.setAttribute('hidden','');}
 function start(){stop();const stage=document.querySelector('.opening-stage');canvas=stage?.querySelector('canvas');if(!canvas)return;if(reduced.matches||document.body.dataset.theme==='calm'){const label=document.querySelector('.moment-label');if(label)label.textContent='نحتفل بوجودك… بهدوء ✦';return;}
  const rect=stage.getBoundingClientRect(),w=rect.width,h=rect.height,dpr=Math.min(devicePixelRatio||1,2);canvas.width=w*dpr;canvas.height=h*dpr;ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);document.querySelector('.stop-celebration')?.removeAttribute('hidden');
  const colors=['#edca85','#f4dfb5','#e9a9bc','#9bbded','#ccb9ef'];
  for(let i=0;i<(w<600?90:170);i++){const side=i%2;particles.push({x:side?w+10:-10,y:h*.43+Math.random()*h*.2,vx:(side?-1:1)*(2.2+Math.random()*4.8),vy:-4.5-Math.random()*5.5,spin:Math.random()*6,turn:(Math.random()-.5)*.14,s:3+Math.random()*4,c:colors[i%colors.length],shape:i%5===0?'star':'rect'});}
  started=performance.now();active=true;let last=started;
  function tick(now){if(!active)return;const age=now-started;if(age>4200||!document.contains(canvas)){stop();return;}const dt=Math.min((now-last)/16.67,2);last=now;ctx.clearRect(0,0,w,h);ctx.globalAlpha=age>3100?Math.max(0,(4200-age)/1100):Math.min(1,age/160);
   for(const p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=.075*dt;p.vx*=Math.pow(.998,dt);p.spin+=p.turn*dt;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.spin);ctx.fillStyle=p.c;if(p.shape==='star'){ctx.beginPath();for(let n=0;n<8;n++){const a=n*Math.PI/4,r=n%2?p.s*.27:p.s;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();ctx.fill();}else{ctx.scale(Math.cos(p.spin*.7)*.65+.35,1);ctx.fillRect(-p.s/2,-p.s,p.s,p.s*1.7);}ctx.restore();}
   frame=requestAnimationFrame(tick);
  }frame=requestAnimationFrame(tick);
 }
 function bind(){const stage=document.querySelector('.opening-stage');if(!stage)return;const replay=stage.querySelector('.replay-celebration');if(replay.dataset.bound)return;replay.dataset.bound='true';replay.onclick=start;stage.querySelector('.stop-celebration').onclick=stop;if(!entered){entered=true;setTimeout(()=>{if(document.contains(stage))start();},450);}}
 new MutationObserver(bind).observe(document.documentElement,{childList:true,subtree:true});
 window.addEventListener('hashchange',stop);window.addEventListener('resize',stop);reduced.addEventListener('change',stop);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});document.addEventListener('click',e=>{if(e.target.closest('#theme-toggle'))stop();});
})();
