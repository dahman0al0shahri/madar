/* MADAR's shared sky. Draw once at display resolution; animate only composited layers.
   Course scenes retain their own identity. No learner/account state is read or written. */
(()=>{
  'use strict';
  const root=document.getElementById('madar-hub');
  const sky=root?.querySelector('.mh-atmosphere');
  if(!sky||sky.querySelector('.mh-space-field'))return;
  const canvas=document.createElement('canvas');
  canvas.className='mh-space-field';
  const glints=document.createElement('div');
  glints.className='mh-space-glints';
  sky.append(canvas,glints);
  const ctx=canvas.getContext('2d',{alpha:false});
  if(!ctx){canvas.remove();glints.remove();return;}
  const button=document.createElement('button');
  button.className='mh-space-motion';
  button.type='button';
  button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path class="mh-space-pause" d="M9 7v10M15 7v10"/><path class="mh-space-play" d="m9 6 9 6-9 6Z"/></svg>';
  root.append(button);
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  const storageKey='madar:space-motion:v1';
  let manualPause=false;
  try{manualPause=localStorage.getItem(storageKey)==='paused';}catch{}
  let width=0,height=0,pixelRatio=0,resizeTimer=0,disposed=false;
  function random(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t^=t+Math.imul(t^t>>>7,61|t);return((t^t>>>14)>>>0)/4294967296;};}
  function hash(x,y){let n=Math.imul(x,374761393)+Math.imul(y,668265263);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967295;}
  function noise(x,y){const a=Math.floor(x),b=Math.floor(y);let u=x-a,v=y-b;u=u*u*(3-2*u);v=v*v*(3-2*v);const p=hash(a,b),q=hash(a+1,b),r=hash(a,b+1),s=hash(a+1,b+1);return p+(q-p)*u+(r-p)*v+(p-q-r+s)*u*v;}
  function cloud(x,y){return .52*noise(x,y)+.28*noise(x*2.08+19,y*2.08+4)+.14*noise(x*4.2+7,y*4.2+31)+.06*noise(x*8.5,y*8.5);}
  function paint(){
    if(disposed||root.dataset.course!=='global'||document.hidden)return;
    const w=Math.max(1,Math.round(sky.clientWidth)),h=Math.max(1,Math.round(sky.clientHeight));
    // Up to native 4K, without allocating unbounded buffers on high-DPR phones.
    const dpr=Math.min(devicePixelRatio||1,2,Math.sqrt(8294400/(w*h)));
    if(w===width&&h===height&&dpr===pixelRatio)return;
    width=w;height=h;pixelRatio=dpr;
    canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.fillStyle='#06090e';ctx.fillRect(0,0,w,h);
    // The dust is deliberately diffuse; pin-sharp stars are drawn separately at display DPR.
    const dust=document.createElement('canvas');
    dust.width=Math.min(900,Math.round(w));dust.height=Math.max(1,Math.round(dust.width*h/w));
    const dc=dust.getContext('2d'),pixels=dc.createImageData(dust.width,dust.height);
    const ratio=w/h;
    for(let y=0;y<dust.height;y++)for(let x=0;x<dust.width;x++){
      const u=x/dust.width,v=y/dust.height;
      const n=cloud(u*5.5*ratio+12,v*5.5+8);
      const bend=.037*Math.sin(u*12)+.065*(cloud(u*3+5,v*3)-.5);
      const diagonal=v-(.9-.82*u+bend);
      const band=Math.exp(-diagonal*diagonal/0.014);
      const veins=Math.max(0,n-.37)*3;
      const fine=noise(u*120*ratio,v*120);
      const glow=band*veins*(.7+.3*fine);
      const outer=cloud(u*2+80,v*2+21)*.8;
      const i=(x+y*dust.width)*4;
      pixels.data[i]=6+glow*48+outer*3;
      pixels.data[i+1]=9+glow*32+outer*4;
      pixels.data[i+2]=14+glow*18+outer*7;
      pixels.data[i+3]=255;
    }
    dc.putImageData(pixels,0,0);ctx.drawImage(dust,0,0,w,h);
    const rng=random(11823),count=Math.min(4400,Math.round(w*h/520));
    for(let i=0;i<count;i++){
      const x=rng()*w,y=rng()*h,bright=rng(),size=.2+rng()*.52;
      ctx.fillStyle=bright>.83?'rgba(237,205,156,.5)':bright>.65?'rgba(147,195,223,.42)':'rgba(202,211,221,.24)';
      ctx.beginPath();ctx.arc(x,y,size,0,Math.PI*2);ctx.fill();
    }
    glints.replaceChildren();
    const spark=random(72046),sparkCount=w<600?12:24;
    for(let i=0;i<sparkCount;i++){
      const star=document.createElement('span');
      star.className='mh-space-star';
      star.style.cssText=`left:${(3+spark()*94).toFixed(2)}%;top:${(4+spark()*92).toFixed(2)}%;--star-size:${(1.4+spark()*1.5).toFixed(2)}px;--star-color:${i%4===0?'135,204,255':'255,210,151'};--star-time:${(5+spark()*7).toFixed(2)}s;--star-delay:${(-spark()*15).toFixed(2)}s`;
      glints.append(star);
    }
    sky.dataset.ready='true';
  }
  function sync(){
    const global=root.dataset.course==='global';
    const paused=manualPause||preference.matches;
    sky.dataset.motion=paused||document.hidden||!global?'paused':'running';
    button.hidden=!global;
    button.disabled=preference.matches;
    button.setAttribute('aria-pressed',String(paused));
    const label=preference.matches?'حركة الخلفية متوقفة حسب إعداد تقليل الحركة':paused?'تشغيل حركة الخلفية':'إيقاف حركة الخلفية';
    button.setAttribute('aria-label',label);button.title=label;
    paint();
  }
  button.addEventListener('click',()=>{
    manualPause=!manualPause;
    try{localStorage.setItem(storageKey,manualPause?'paused':'running');}catch{}
    sync();
  });
  const observer=new MutationObserver(sync);
  observer.observe(root,{attributes:true,attributeFilter:['data-course']});
  function resize(){clearTimeout(resizeTimer);resizeTimer=setTimeout(paint,180);}
  addEventListener('resize',resize,{passive:true});
  document.addEventListener('visibilitychange',sync);
  preference.addEventListener('change',sync);
  addEventListener('pagehide',e=>{if(e.persisted)return;disposed=true;clearTimeout(resizeTimer);observer.disconnect();document.removeEventListener('visibilitychange',sync);preference.removeEventListener('change',sync);removeEventListener('resize',resize);},{once:true});
  addEventListener('pageshow',sync);
  sync();
})();
