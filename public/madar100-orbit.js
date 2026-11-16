(()=>{
// Curated triads, not random RGB: broad variety without muddy or near-identical mixes.
const orbitTriads=[
  ['#31D7EA','#8467F5','#F6A7D8'],['#18D3B1','#379DFA','#E3B9FF'],
  ['#FFB45E','#F46491','#8A75F4'],['#51E0C1','#D5EE8F','#F4B364'],
  ['#5AB9FC','#E093F8','#FFCE94'],['#F58BA7','#D6ABFC','#89DCD5'],
  ['#30C3CD','#3172D7','#DBB0FA'],['#F8D078','#F68B65','#CD6CA9'],
  ['#89C6FF','#63E1C1','#EEE0A1'],['#A58AFF','#F3ABD7','#FFC79C'],
  ['#4DCDB4','#9BB4FD','#F6CF88'],['#ED7E9E','#FFBA77','#96A2F5'],
  ['#61D6E9','#3B8BBF','#F2CF9D'],['#B393F6','#71BCEB','#A7E4C8'],
  ['#F6A38C','#E9C185','#C393EA'],['#2FBFA8','#79DBD5','#F2AECE'],
  ['#7AA9EE','#E1A1C6','#F5DCAE'],['#EF91CA','#956BEC','#65DCE0'],
  ['#F7BE6E','#BA8CE2','#6FBBCF'],['#91E3C3','#4AA9D8','#CFACF2'],
  ['#EE8A78','#F0BD98','#7B9FE4'],['#65CDE1','#F0C5EC','#A59CED'],
  ['#B8DE8D','#49BFB8','#AD9BE9'],['#F1A6D0','#ECA65C','#7BBBDD']
];
let orbitPaletteOffset=Math.floor(Math.random()*orbitTriads.length);
// Decorative scene only. Shared pause state; palette timing is independent of travel speed.
function createLiquidOrbit(mark,options={}){
  const bubble=mark.querySelector(options.bubbleSelector||'.mh-liquid-bubble'),canvas=bubble.querySelector('canvas');
  const ctx=canvas.getContext('2d',{alpha:true});
  const size=options.size??(mark.classList.contains('mh-orbit')||mark.classList.contains('vm-orbit-badge')?40:112);canvas.width=canvas.height=size;
  const paletteOffset=options.paletteIndex??orbitPaletteOffset++;
  const image=ctx?.createImageData(size,size),pixels=[];
  let seconds=options.seconds||0,colorSeconds=options.colorSeconds||0,last=0,lastDraw=-1,width=mark.clientWidth,visible=false;
  const resize=new ResizeObserver(()=>{width=mark.clientWidth;lastDraw=-1;});resize.observe(mark);
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=0;});observer.observe(mark);
  const smooth=x=>x*x*(3-2*x);
  function palette(n){return orbitTriads[(paletteOffset+n)%orbitTriads.length].map(hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255));}
  if(image)for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    const px=(x+.5)/size*2-1,py=(y+.5)/size*2-1,r=px*px+py*py;
    if(r<1)pixels.push({i:(y*size+x)*4,x:px,y:py,z:Math.sqrt(1-r),a:Math.min(1,(1-r)*size/2)});
  }
  function draw(){
    // Hold exactly three source colours, then dissolve to a new triad every five active seconds.
    // Start immediately in gold for 60 active seconds, then show the 24 triads.
    // Repeat every 180 active seconds; a fresh mount starts in gold again.
    // The original24triads and default renderer remain unchanged elsewhere.
    const phase=options.signatureGold?(colorSeconds+120)%180:colorSeconds;
    const signature=!!options.signatureGold&&phase>=120;
    const cycle=Math.floor(phase/5),mix=smooth(Math.min(1,((signature?phase-120:phase)%5)/1.35));
    const gold=[[6,7,10],[242,202,112],[68,49,22]].map(c=>c.map(v=>v/255));
    const goldMix=signature?(colorSeconds<60?1:smooth(Math.min(1,(phase-120)/1.35))):0;
    const from=signature?palette(23):(options.signatureGold&&cycle===0&&colorSeconds>=60?gold:palette(Math.max(0,cycle-1))),to=signature?gold:palette(cycle);
    const blend=signature?goldMix:mix;
    const goldStrength=signature?goldMix:(options.signatureGold&&phase<1.35?1-mix:0);
    const colors=to.map((c,i)=>c.map((v,j)=>from[i][j]+(v-from[i][j])*blend));
    if(options.signatureGold)mark.dataset.paletteStyle=signature?'black-gold':'original';
    bubble.style.background=`linear-gradient(135deg,${colors.map(c=>`rgb(${c.map(v=>Math.round(v*255)).join(' ')})`).join(',')})`;
    if(options.position!==false){
    const angle=seconds*Math.PI/3-.5,rx=width*.72,ry=width*.31,tilt=-Math.PI/12;
    const x=rx*Math.cos(angle),y=ry*Math.sin(angle);
    bubble.style.transform=`translate(-50%,-50%) translate(${x*Math.cos(tilt)-y*Math.sin(tilt)}px,${x*Math.sin(tilt)+y*Math.cos(tilt)}px) scale(${.88+.12*Math.sin(angle)})`;
    bubble.style.zIndex=Math.sin(angle)>=0?'4':'1';
    }
    mark.dataset.orbitSeconds=seconds.toFixed(3);mark.dataset.palette=String(cycle);
    if(!image)return;
    // Fluid has its own pace: broad moving folds stay readable in a 24–36px bubble.
    // Palette dwell and fluid motion are independent: gold stays gold while its
    // folds visibly flow. Integrate both speeds so palette boundaries never
    // reset or jump the fluid clock (60*.55 + 120 = 153 per complete cycle).
    const elapsed=colorSeconds%180;
    const fluidSeconds=options.signatureGold
      ?120+Math.floor(colorSeconds/180)*153+(elapsed<60?elapsed*.55:33+elapsed-60)
      :colorSeconds;
    const t=fluidSeconds*.95,data=image.data;
    for(const p of pixels){
      // A differential swirl bends the centre faster than the edge; the folds also deform.
      const twist=t*.52+(p.x*p.x+p.y*p.y)*1.3*Math.sin(t*.6);
      const ct=Math.cos(twist),st=Math.sin(twist);
      const u=p.x*ct-p.y*st,v=p.x*st+p.y*ct;
      const a=u+.42*Math.sin(v*2.5+t)+.12*Math.sin(v*4.5-t*.6);
      const b=v+.40*Math.sin(u*2.3-t*.8)+.12*Math.cos(a*3.5+t*.5);
      const field=Math.sin(a*2.5+b*1.8+Math.sin(b*2.2-a*1.6+t*.7));
      const field2=Math.sin(b*2.6-a*1.7+Math.cos(a*2.8+t*.6));
      const weights=[Math.exp(field*2.7),Math.exp(field2*2.7),Math.exp(-(field+field2)*2.1)];
      if(goldStrength){weights[0]*=1+goldStrength*1.2;weights[2]*=1-goldStrength*.35;}
      const sum=weights[0]+weights[1]+weights[2];
      const light=.62+.38*p.z,rim=Math.pow(1-p.z,4)*(.24-.16*goldStrength);
      const spec=Math.exp(-((p.x+.36)**2/.027+(p.y+.43)**2/.013))*(.85-.5*goldStrength);
      for(let c=0;c<3;c++)data[p.i+c]=Math.min(255,255*((colors[0][c]*weights[0]+colors[1][c]*weights[1]+colors[2][c]*weights[2])/sum*light+rim+spec));
      data[p.i+3]=p.a*255;
    }
    ctx.putImageData(image,0,0);
  }
  draw();
  return {
    tick(t,stopped){
      if(stopped||!visible||document.hidden||!mark.isConnected){last=0;return;}
      if(last){const delta=Math.min((t-last)/1000,.1);seconds+=delta*(options.speed??.5);colorSeconds+=delta*(options.colorSpeed??1);}last=t;
      if(t-lastDraw>=1000/30){draw();lastDraw=t;}
    },
    snapshot(){return {seconds,colorSeconds,paletteIndex:paletteOffset};},
    dispose(){resize.disconnect();observer.disconnect();}
  };
}

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

})();