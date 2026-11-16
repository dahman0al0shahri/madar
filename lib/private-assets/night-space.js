(()=>{
 const canvas=document.getElementById('space'),ctx=canvas.getContext('2d'),button=document.getElementById('motion'),reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let w,h,stars=[],paused=reduce.matches,raf,next=performance.now()+7000,meteors=[];
 function size(){
  w=innerWidth;h=innerHeight;const d=Math.min(devicePixelRatio||1,2);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);
  stars=Array.from({length:Math.min(150,Math.round(w*h/8500))},()=>({x:Math.random()*w,y:Math.random()*h,r:.4+Math.random()*.8,a:.18+Math.random()*.48,p:Math.random()*6}));paint(performance.now());
 }
 function drawMeteor(m,t){
  const u=(t-m.t)/m.duration;if(u<0||u>1.05)return;
  const x=w*(m.x+m.dx*u),y=h*(m.y+m.dy*u),angle=Math.atan2(h*m.dy,w*m.dx),red=m.scene==='crimson',len=Math.min(w*.46,420)*m.scale;
  ctx.save();ctx.globalAlpha=Math.min(1,u/.09,(1.05-u)/.16);ctx.translate(x,y);ctx.rotate(angle);
  const tail=ctx.createLinearGradient(-len,0,3,0);tail.addColorStop(0,red?'#fc193c00':'#fa6c1500');tail.addColorStop(.65,red?'#ff294855':'#ee602a77');tail.addColorStop(1,red?'#ff4965':'#fff0cd');
  ctx.fillStyle=tail;ctx.beginPath();ctx.moveTo(-len,-1);ctx.quadraticCurveTo(-len*.2,-10*m.scale,3,0);ctx.quadraticCurveTo(-len*.2,10*m.scale,-len,1);ctx.fill();
  ctx.fillStyle=red?'#ffd9df':'#fff9ea';ctx.shadowColor=red?'#ff3054':'#ff862e';ctx.shadowBlur=16;ctx.beginPath();ctx.ellipse(0,0,5*m.scale,2.6*m.scale,0,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
  if(!red){for(let i=0;i<22;i++){const q=((t/600+i*.047)%1),sx=-q*len*.7,sy=Math.sin(i*32)*q*23*m.scale;ctx.globalAlpha=(1-q)*Math.min(1,u/.09,(1.05-u)/.16);ctx.fillStyle=i%3?'#fb9b3a':'#ffdd9a';ctx.fillRect(sx,sy,1.2+(1-q)*1.7,1.2);}}
  ctx.restore();ctx.globalAlpha=1;
 }
 function paint(t){
  ctx.clearRect(0,0,w,h);
  for(const s of stars){ctx.globalAlpha=s.a*(paused?.8:.75+.25*Math.sin(t/2300+s.p));ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();}
  ctx.globalAlpha=1;
  if(!paused){meteors=meteors.filter(m=>t-m.t<=m.duration*1.05);for(const m of meteors)drawMeteor(m,t);}
 }
 function frame(t){
  if(!paused&&!document.hidden&&t>=next){
   next=t+7000;const scene=document.body.dataset.scene||'crimson';
   // Separate screen regions with independent, sub-second arrivals.
   const regions=[{x:.40,y:.10},{x:.83,y:.26},{x:.49,y:.46},{x:.88,y:.65},{x:.32,y:.78}];
   const delays=[0,75,155,245,330].sort(()=>Math.random()-.5);
   meteors=regions.map((p,i)=>{
    const dx=-(.32+Math.random()*.18),dy=.10+Math.random()*.10;
    return {t:t+delays[i]+Math.random()*20,duration:850+Math.random()*200,x:p.x-dx*.45+(Math.random()-.5)*.06,y:p.y-dy*.45+(Math.random()-.5)*.04,dx,dy,scale:.74+Math.random()*.24,scene};
   });
  }
  paint(t);raf=requestAnimationFrame(frame);
 }
 function update(){
  button.textContent=paused?'تشغيل الحركة':'إيقاف الحركة';button.setAttribute('aria-pressed',String(paused));meteors=[];next=performance.now()+7000;cancelAnimationFrame(raf);
  if(!paused&&!document.hidden)raf=requestAnimationFrame(frame);else paint(performance.now());
 }
 button.onclick=()=>{paused=!paused;update()};reduce.addEventListener('change',()=>{paused=reduce.matches;update()});document.addEventListener('visibilitychange',update);addEventListener('resize',size);size();update();
})();
