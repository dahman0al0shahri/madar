(function(root){'use strict';
const active=new WeakMap(),clamp=v=>Math.max(0,Math.min(1,v)),ease=v=>{v=clamp(v);return v*v*(3-2*v);},out=v=>1-Math.pow(1-clamp(v),3),span=(t,a,b)=>clamp((t-a)/(b-a));
const profiles={1:{duration:1440,rgb:'255,225,100'},2:{duration:1440,rgb:'255,194,77'},3:{duration:1440,rgb:'255,145,77'},full:{duration:1440,rgb:'255,100,119'}};
function paint(canvas,level,t,center){const box=canvas.getBoundingClientRect(),w=Math.max(1,box.width),h=Math.max(1,box.height),dpr=Math.min(devicePixelRatio||1,2),ctx=canvas.getContext('2d');if(!ctx)return;if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);if(t>=1)return;
const c=center?center():{x:w/2,y:h/2},x=c.x,y=c.y,rgb=profiles[level].rgb,settle=1-ease(span(t,.72,1)),charge=ease(span(t,0,.26)),col=a=>'rgba('+rgb+','+clamp(a)+')';ctx.lineCap='round';ctx.lineJoin='round';
function path(points,width,a,glow=0,white=false){ctx.save();ctx.strokeStyle=white?'rgba(255,244,224,'+clamp(a)+')':col(a);ctx.shadowColor=col(a*.7);ctx.shadowBlur=glow;ctx.lineWidth=width;ctx.beginPath();points.forEach(([u,v],i)=>i?ctx.lineTo(u,v):ctx.moveTo(u,v));ctx.stroke();ctx.restore();}
function dot(u,v,r,a){ctx.save();ctx.fillStyle=col(a);ctx.shadowBlur=5;ctx.shadowColor=col(a);ctx.beginPath();ctx.arc(u,v,r,0,Math.PI*2);ctx.fill();ctx.restore();}
function arc(r,a,b,alpha,width=1.2){ctx.save();ctx.strokeStyle=col(alpha);ctx.lineWidth=width;ctx.beginPath();ctx.arc(x,y,r,a,b);ctx.stroke();ctx.restore();}
const light=ctx.createRadialGradient(x,y,10,x,y,39);light.addColorStop(0,col(.015));light.addColorStop(.65,col((.035+charge*.075)*settle));light.addColorStop(1,col(0));ctx.fillStyle=light;ctx.fillRect(0,0,w,h);
if(level==='1'){
 const sweep=out(span(t,.08,.64)),a=-Math.PI*.82+sweep*Math.PI*1.42;arc(28,-Math.PI*.82,Math.PI*.6,.13*settle);arc(28,a-.36,a,(.25+charge*.5)*settle,1.5);dot(x+Math.cos(a)*28,y+Math.sin(a)*28,1.3,settle*.85);
 for(const d of [-.82,-.35,.12,.6]){const a=d*Math.PI;path([[x+Math.cos(a)*30,y+Math.sin(a)*30],[x+Math.cos(a)*33,y+Math.sin(a)*33]],1,.3*settle);}return;
}
if(level==='2'){
 const route=[[-29,-23],[-29,19],[-24,26],[24,26],[29,19],[29,-23]],progress=out(span(t,.1,.68)),lengths=route.slice(1).map((p,i)=>Math.hypot(p[0]-route[i][0],p[1]-route[i][1])),total=lengths.reduce((a,b)=>a+b,0);path(route.map(([a,b])=>[x+a,y+b]),1,.16*settle);
 let remaining=progress*total,drawn=[[x+route[0][0],y+route[0][1]]];for(let i=0;i<lengths.length;i++){const k=Math.min(1,remaining/lengths[i]);if(k<0)break;drawn.push([x+route[i][0]+(route[i+1][0]-route[i][0])*k,y+route[i][1]+(route[i+1][1]-route[i][1])*k]);remaining-=lengths[i];if(k<1)break;}path(drawn,1.7,.68*settle,5);const head=drawn.at(-1);dot(head[0],head[1],1.7,settle);for(const i of [0,2,3,5])dot(x+route[i][0],y+route[i][1],1.2,(progress>i/5?.7:.16)*settle);return;
}
if(level==='3'){
 const lock=out(span(t,.08,.47)),gap=34-9*lock,confirm=Math.sin(span(t,.47,.72)*Math.PI);for(const sx of [-1,1])for(const sy of [-1,1]){const px=x+sx*gap,py=y+sy*gap;path([[px-sx*7,py],[px,py],[px,py-sy*7]],1.6,(.3+.55*lock)*settle,3);path([[px-sx*5,py-sy*2],[px-sx*2,py-sy*2],[px-sx*2,py-sy*5]],.6,confirm*.6,0,true);}return;
}
// Full reveal releases two retaining brackets. Discharge travels outward once.
const split=out(span(t,.25,.57)),fade=1-ease(span(t,.58,.88));for(const side of [-1,1]){const dx=side*(26+split*8),tilt=side*split*2,pts=[[x+dx-side*8,y-25+tilt],[x+dx,y-25],[x+dx,y+25],[x+dx-side*8,y+25-tilt]];path(pts,3.1,.1*fade,5);path(pts,1.15,(.25+charge*.55)*fade,3);path(pts,.45,.5*fade,0,true);}
const arcs=[[[x-24,y-15],[x-28,y-18],[x-27,y-22],[x-34,y-25],[4,8]],[[x+24,y-10],[x+28,y-13],[x+27,y-18],[x+34,y-22],[w-4,10]],[[x-24,y+13],[x-30,y+15],[x-28,y+20],[x-34,y+23],[4,h-7]],[[x+24,y+14],[x+29,y+17],[x+28,y+21],[x+35,y+24],[w-4,h-7]]];
const energy=Math.sin(span(t,.30,.69)*Math.PI)*settle,growth=out(span(t,.30,.45));for(const points of arcs){if(energy<=0)continue;const drawn=points.slice(0,Math.max(2,Math.ceil(growth*points.length)));path(drawn,2.4,energy*.2,7);path(drawn,1.1,energy*.8,3);path(drawn,.4,energy*.8,0,true);}
const fly=span(t,.35,.88);if(fly>0&&fly<1)for(let i=0;i<8;i++){const side=i%2?1:-1,up=i%4<2?-1:1,speed=5+i*.75,u=x+side*(26+out(fly)*speed),v=y+up*(18+out(fly)*7)+fly*fly*3;path([[u,v],[u-side*(1-fly)*2.5,v-up*(1-fly)*1.5]],i%3===0?1.2:.7,(1-fly)*.7,2);}
}
function stop(canvas){const run=active.get(canvas);if(!run)return;cancelAnimationFrame(run.raf);active.delete(canvas);canvas.dataset.motion='stopped';run.done?.('stopped');}
function play(canvas,level,{center,done,phase}={}){if(!profiles[level]||active.has(canvas))return false;const reduced=matchMedia('(prefers-reduced-motion: reduce)'),run={start:performance.now(),raf:0,done,lastPhase:''};active.set(canvas,run);canvas.dataset.level=level;canvas.dataset.motion='running';function finish(status){active.delete(canvas);canvas.dataset.motion=status;done?.(status);}if(reduced.matches){paint(canvas,level,1,center);finish('reduced');return true;}
function frame(now){if(!canvas.isConnected||document.hidden){finish('stopped');return;}if(reduced.matches){paint(canvas,level,1,center);finish('reduced');return;}const t=clamp((now-run.start)/profiles[level].duration),current=t<.25?'anticipate':t<.72?'action':'settle';if(current!==run.lastPhase){run.lastPhase=current;canvas.dataset.phase=current;phase?.(current);}paint(canvas,level,t,center);if(t<1)run.raf=requestAnimationFrame(frame);else finish('complete');}run.raf=requestAnimationFrame(frame);return true;}
root.MadarAssistanceMotion={profiles,play,stop,paint};
})(window);
