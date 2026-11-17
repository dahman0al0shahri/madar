function drawHalo(){
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,sceneWidth,sceneHeight);
  const color=haloColors[haloLevel-1],power=haloLevel/5;
  const bound=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const intro=reduced.matches?9:haloTime-introStart,charge=bound((intro-.3)/1.8),ready=intro>=2.35;
  const ease=t=>1-Math.pow(1-t,3);
  const release=bound((intro-2.35)/.85),impactEnergy=intro>=2.35&&intro<3.2?Math.exp(-(intro-2.35)*5):0;
  const compression=bound((intro-1.85)/.42)*(1-ease(bound((intro-2.35)/.2)));
  svg.style.setProperty('--mr-outline',510*(1-ease(bound((intro-.16)/.6))));
  q('.mr-shell').style.fillOpacity=ease(bound((intro-.2)/.4));
  root.querySelectorAll('[data-layer]').forEach(p=>{const i=+p.dataset.layer,t=bound((intro-.28-(i-1)*.105)/.56),settle=t===1?1:1-Math.pow(2,-9*t)*Math.cos(t*9);p.style.opacity=bound(t*3);p.style.transform=`translate(${(1-settle)*(i%2?52:-52)}px,${(1-settle)*22}px) scaleX(${.65+settle*.35})`;});
  stage.dataset.phase=intro>=3.2?'running':ready?'release':intro<1.2?'forming':'charging';
  // A persistent light halo and distinct outward discharges; no flashing of the card.
  function path(points,width,alpha,blur,stroke){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.lineJoin='round';ctx.lineCap='round';ctx.globalAlpha=alpha;ctx.shadowColor=color;ctx.shadowBlur=blur;ctx.stroke();}
  const rim=Array.from({length:181},(_,i)=>perimeter(i/180));
  const mist=ctx.createRadialGradient(sceneWidth/2,sceneHeight/2,25,sceneWidth/2,sceneHeight/2,125);
  mist.addColorStop(0,color+'00');mist.addColorStop(.42,color+'28');mist.addColorStop(.73,color+'14');mist.addColorStop(1,color+'00');
  ctx.fillStyle=mist;ctx.globalAlpha=(.6+power*.4)*charge;ctx.fillRect(0,0,sceneWidth,sceneHeight);
  path(rim.slice(0,Math.max(2,Math.ceil(ease(bound(intro/1.35))*rim.length))),6+power*5,(.12+power*.1)*charge,15+haloLevel*3,color);
  path(rim,2,.25*charge,7,color);
  const hash=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  // Recursive, irregular channels instead of equal-sized zigzags.
  function fracture(a,b,seed,depth=4,rough=.18){
   if(!depth)return [a,b];
   const dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||1,t=.3+hash(seed)*.4;
   const bend=(hash(seed+9)-.5)*len*rough*2;
   const m={x:a.x+dx*t-dy/len*bend,y:a.y+dy*t+dx/len*bend};
   return fracture(a,m,seed+17,depth-1,rough).slice(0,-1).concat(fracture(m,b,seed+31,depth-1,rough));
  }
  if(intro<3.4&&!reduced.matches){
   // One focal event: ignition, accelerating collection, compression, release.
   const cx=sceneWidth/2,cy=sceneHeight/2;
   ctx.shadowBlur=0;ctx.fillStyle='#080b0e';ctx.globalAlpha=.54*(1-ease(bound((intro-2.35)/.65)));ctx.fillRect(0,0,sceneWidth,sceneHeight);
   if(intro<.55){
    const leader=fracture({x:sceneWidth*.14,y:14},perimeter(0),319,5,.15),head=bound(intro/.17);
    const segment=leader.slice(0,Math.max(2,Math.ceil(head*leader.length))),light=bound(intro/.06)*Math.exp(-Math.max(0,intro-.19)*8);
    path(segment,6,light*.45,19,color);path(segment,1.4,light,5,'#fff5d6');
   }
   // Stable seeds retain flowing trajectories instead of jittering particle positions.
   for(let j=0;j<42;j++){
    const delay=.32+hash(j+80)*1.23,duration=.6+hash(j+190)*.55,t=bound((intro-delay)/duration);
    if(t===0||t===1)continue;
    const edge=j%4,target=perimeter(hash(j+25)),start={x:edge<2?(edge?sceneWidth-8:8):hash(j+40)*sceneWidth,y:edge>=2?(edge===2?8:sceneHeight-8):hash(j+70)*sceneHeight};
    const trajectory=u=>{const v=u*u;return{x:start.x+(target.x-start.x)*v,y:start.y+(target.y-start.y)*v+Math.sin(u*Math.PI)*(hash(j+22)-.5)*65};};
    const a=trajectory(t),b=trajectory(Math.max(0,t-.045));
    const opacity=Math.sin(t*Math.PI)*.85;
    path([b,a],j%7===0?1.6:.7,opacity,j%7===0?10:4,j%5===0?'#fff4d8':color);
   }
   if(intro>.8&&intro<2.35){
    const pressure=bound((intro-.8)/1.55),inner=ctx.createRadialGradient(cx,cy,4,cx,cy,105-pressure*37);
    inner.addColorStop(0,color+'bb');inner.addColorStop(.35,color+'55');inner.addColorStop(1,color+'00');ctx.fillStyle=inner;ctx.globalAlpha=pressure*.7;ctx.shadowBlur=0;ctx.fillRect(cx-110,cy-110,220,220);
    path(rim,2.2,pressure*.85,14+pressure*12,'#fff0bd');
   }
   if(impactEnergy>0){
    const light=ctx.createRadialGradient(cx,cy,4,cx,cy,90+release*150);
    light.addColorStop(0,'#fff5d9');light.addColorStop(.18,color+'cc');light.addColorStop(.65,color+'45');light.addColorStop(1,color+'00');
    ctx.globalAlpha=impactEnergy*.65;ctx.fillStyle=light;ctx.shadowBlur=0;ctx.fillRect(0,0,sceneWidth,sceneHeight);
    for(let j=0;j<28;j++){
     const p=perimeter(hash(j+500)),angle=Math.atan2(p.y-cy,p.x-cx)+(hash(j+510)-.5),distance=release*(60+hash(j+520)*160),a={x:p.x+Math.cos(angle)*distance,y:p.y+Math.sin(angle)*distance+release*release*30};
     path([{x:a.x-Math.cos(angle)*(2+release*9),y:a.y-Math.sin(angle)*(2+release*9)},a],.7,(1-release)*.72,4,j%3?color:'#fff4da');
    }
   }
  }
  function surfaceDamage(seed,heading){
   // Cached per strike: mottled soot, broken coating and directional metal grain.
   // No outlined crater, radial spiderweb, or solid circular burn decal.
   const tile=document.createElement('canvas');tile.width=tile.height=128;
   const tc=tile.getContext('2d'),pixels=tc.createImageData(128,128),salt=seed|0;
   const rand=(x,y)=>{let n=Math.imul(x^salt,374761393)+Math.imul(y,668265263);n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967295;};
   const noise=(x,y)=>{const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);return (rand(ix,iy)*(1-u)+rand(ix+1,iy)*u)*(1-v)+(rand(ix,iy+1)*(1-u)+rand(ix+1,iy+1)*u)*v;};
   const cs=Math.cos(heading),sn=Math.sin(heading);
   for(let y=0;y<128;y++)for(let x=0;x<128;x++){
    const px=(x-64)/53,py=(y-64)/53,u=px*cs+py*sn,v=-px*sn+py*cs;
    const large=noise(x*.048+7,y*.048+12),medium=noise(x*.135,y*.135),fine=rand(x,y);
    const r=Math.hypot(u*.86,v*1.15)+(large-.5)*.38+(medium-.5)*.13;
    const soot=clamp((1.04-r)*2.6,0,1)*(0.6+medium*.35);
    if(soot<=0)continue;
    let red=12+large*8,green=12+large*6,blue=12+large*5,alpha=soot*.82;
    const grainLine=Math.abs(v+.12*Math.sin(u*7+large*3));
    const exposed=r<.65&&grainLine<.08+medium*.24&&large>.42&&medium>.37;
    if(exposed){
     const grain=noise(x*.8,y*.085)*24+fine*19;
     const burnt=clamp((.43-r)*3,0,1);
     const shade=40+grain-py*10-burnt*18;
     red=shade*.96;green=shade;blue=shade*1.015;alpha=.94;
     if(fine>.91){red*=.5;green*=.5;blue*=.5;}
    }
    const lip=Math.abs(grainLine-(.08+medium*.24));
    if(lip<.009&&r<.56&&large>.42&&medium>.37){red=78+fine*19;green=81+fine*19;blue=82+fine*19;alpha=.72;}
    const i=(y*128+x)*4;pixels.data[i]=red;pixels.data[i+1]=green;pixels.data[i+2]=blue;pixels.data[i+3]=Math.round(alpha*255);
   }
   tc.putImageData(pixels,0,0);return tile;
  }
  function emit(at){
   const seed=Math.random()*100000,origin=perimeter(Math.random());
   // Sample a two-dimensional surface, not equal radii around the emitter.
   let end,tries=0;
   do{end={x:32+Math.random()*(sceneWidth-64),y:30+Math.random()*(sceneHeight-60)};tries++;}
   while(tries<80&&((Math.abs(end.x-sceneWidth/2)<79&&Math.abs(end.y-sceneHeight/2)<83)||((end.x-origin.x)*origin.nx+(end.y-origin.y)*origin.ny<15)||discharges.some(e=>Math.hypot(e.end.x-end.x,e.end.y-end.y)<38)));
   if(tries>=80)return;
   const heading=Math.atan2(end.y-origin.y,end.x-origin.x);
   const channel=fracture(origin,end,seed,5,.24),branches=[];
   for(let j=0;j<haloLevel+1;j++){
    const index=6+Math.floor(hash(seed+j)*19),p=channel[index];
    const a=heading+(hash(seed+j+44)>.5?1:-1)*(.3+hash(seed+j+51)*.9),l=9+hash(seed+j+61)*23;
    branches.push(fracture(p,{x:clamp(p.x+Math.cos(a)*l,8,sceneWidth-8),y:clamp(p.y+Math.sin(a)*l,8,sceneHeight-8)},seed+j+83,3,.21));
   }
   const cracks=[];
   if(haloLevel>=4)for(let j=0;j<(haloLevel===5?3:1);j++){
    const a=heading+(hash(seed+j+112)-.5)*2.4,l=(haloLevel===5?19:9)*(0.6+hash(seed+j+73));
    const start={x:end.x+(hash(seed+j+173)-.5)*8,y:end.y+(hash(seed+j+187)-.5)*8};
    cracks.push(fracture(start,{x:clamp(end.x+Math.cos(a)*l,4,sceneWidth-4),y:clamp(end.y+Math.sin(a)*l,4,sceneHeight-4)},seed+j+161,3,.17));
   }
   discharges.push({at,seed,channel,branches,end,cracks,heading,texture:haloLevel>=4?surfaceDamage(seed,heading):null});strikeSerial++;
  }
  if(sceneLevel!==haloLevel){sceneLevel=haloLevel;discharges=[];nextStrike=haloTime+.2;}
  if(ready&&!firstDischarge&&!reduced.matches&&haloPlaying){firstDischarge=true;emit(haloTime);emit(haloTime+.045);if(haloLevel>=4)emit(haloTime+.095);nextStrike=haloTime+1.1;}
  if(ready&&!reduced.matches&&haloPlaying&&haloTime>=nextStrike){
   // No angular sequence: independent origins and non-periodic delays.
   emit(haloTime);if(haloLevel===5&&Math.random()>.45)emit(haloTime+.035);
   nextStrike=haloTime+(haloLevel>=4?.68:1.1)+Math.random()*(haloLevel>=4?.65:1.2);
  }
  discharges=discharges.filter(e=>haloTime-e.at<5.4).slice(-9);
  let active=0,damage=0,shock=0;
  for(const e of discharges){
   const age=reduced.matches?.16:haloTime-e.at;if(age<0)continue;
   const life=clamp((5.4-age)/2,0,1),impact=age>=.045;
   if(e.cracks.length&&impact){
    damage++;const diameter=haloLevel===5?49:28;
    ctx.shadowBlur=0;ctx.globalAlpha=life;ctx.drawImage(e.texture,e.end.x-diameter/2,e.end.y-diameter/2,diameter,diameter);
    for(const crack of e.cracks){
     const portion=crack.slice(0,Math.max(2,Math.ceil(Math.min(1,age/.18)*crack.length)));
     path(portion,haloLevel===5?.8:.5,life*.65,0,'#090b0d');
     path(portion.map(p=>({x:p.x+.35,y:p.y-.35})),.25,life*.32,0,'#a0a6a5');
    }
    if(age<1.35){
     const debris=haloLevel===5?9:3;
     for(let j=0;j<debris;j++){
      const a=hash(e.seed+j+301)*Math.PI*2,speed=12+hash(e.seed+j+330)*(haloLevel===5?53:25),dt=Math.max(0,age-.05);
      const x=e.end.x+Math.cos(a)*speed*dt,y=e.end.y+Math.sin(a)*speed*dt+dt*dt*15;
      const size=(haloLevel===5?1.25:.7)*(1-dt/1.4);
      ctx.globalAlpha=clamp(1-dt/1.3,0,1);ctx.shadowBlur=0;ctx.save();ctx.translate(x,y);ctx.rotate(a+dt*5);ctx.fillStyle=j%4?'#777d7e':'#d7b18a';ctx.fillRect(-size,-size*.22,size*2.1,size*.45);ctx.fillStyle='#171a1d';ctx.fillRect(-size,0,size*1.8,size*.45);ctx.restore();
     }
    }
   }
   const fade=Math.exp(-Math.max(0,age-.04)*12),grow=clamp(age/.045,0,1);
   if(fade>.012){
    active++;const pts=e.channel.slice(0,Math.max(2,Math.ceil(grow*e.channel.length)));
    ctx.globalCompositeOperation='lighter';
    path(pts,4+power*3,fade*.28,14+haloLevel*2,color);
    path(pts,1.8+power,fade*.8,5,color);
    for(let j=1;j<pts.length;j++)path([pts[j-1],pts[j]],(1.4+power*.5)*(1-j/pts.length*.55),fade,0,'#fff8ed');
    for(const branch of e.branches)path(branch,.45+power*.35,fade*.65,4,'#ffe8d6');
    const bloom=ctx.createRadialGradient(e.end.x,e.end.y,0,e.end.x,e.end.y,haloLevel>=4?21:10);
    bloom.addColorStop(0,'#fff7dc');bloom.addColorStop(.14,color);bloom.addColorStop(1,color+'00');
    ctx.fillStyle=bloom;ctx.globalAlpha=impact?fade*.65:0;ctx.fillRect(e.end.x-24,e.end.y-24,48,48);
    ctx.globalCompositeOperation='source-over';
    if(haloLevel>=4)shock=Math.max(shock,fade*(haloLevel===5?1.8:.6));
   }
  }
  if(!reduced.matches){
   const kick=Math.max(shock,impactEnergy*3.2),scale=1-compression*.065+impactEnergy*.085;
   svg.style.transform=`translate(${Math.sin(haloTime*59)*kick}px,${Math.cos(haloTime*73)*kick*.6}px) scale(${scale})`;
   svg.style.filter=`brightness(${1+compression*.35+impactEnergy*.9}) drop-shadow(0 0 ${3+charge*5+impactEnergy*15}px ${color}${intro<3.2?'bb':'33'})`;
  }else{svg.style.transform='none';svg.style.filter='none';}
  canvas.dataset.strikes=strikeSerial;canvas.dataset.damage=damage;canvas.dataset.active=active;
  canvas.dataset.targets=JSON.stringify(discharges.map(e=>[Math.round(e.end.x),Math.round(e.end.y)]));
  ctx.globalAlpha=1;ctx.shadowBlur=0;canvas.dataset.time=haloTime.toFixed(3);
 }
 function tick(t){frame=0;if(!root.isConnected||!visible||document.hidden||!haloPlaying||reduced.matches)return;
  if(lastTick&&t-lastTick<32){frame=requestAnimationFrame(tick);return;}
  haloTime+=lastTick?Math.min((t-lastTick)/1000,.08):0;lastTick=t;drawHalo();frame=requestAnimationFrame(tick);
 }
 