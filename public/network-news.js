(async () => {
  'use strict';
  let renderer;
  try {
    const T=window.THREE,LED=window.MadarNetworkLED;
    const cadResponse=await fetch('/rj45-molex-449150001.json');if(!cadResponse.ok)throw Error('RJ45 model unavailable');const rj45=await cadResponse.json();
    renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
    renderer.setPixelRatio(1);
    renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
    renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.VSMShadowMap;
    document.body.prepend(renderer.domElement);
    const scene=new T.Scene(),camera=new T.PerspectiveCamera(33,1,.005,50);
    const world=new T.Group();scene.add(world);
    let seed=19;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    const textures=[],geometries=[],materials=[];
    function material(p){const m=new T.MeshStandardMaterial(p);materials.push(m);return m;}
    function texture(w,h,paint,color=true){const c=document.createElement('canvas');c.width=w;c.height=h;paint(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);if(color)t.colorSpace=T.SRGBColorSpace;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());textures.push(t);return t;}
    const grain=texture(512,512,(c,w,h)=>{c.fillStyle='#999';c.fillRect(0,0,w,h);for(let y=0;y<h;y++){const n=125+random()*45;c.strokeStyle=`rgb(${n},${n},${n})`;c.globalAlpha=.27;c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke();}c.globalAlpha=.15;for(let i=0;i<3500;i++){c.fillStyle=random()>.5?'#fff':'#111';c.fillRect(random()*w,random()*h,random()*18+.5,.5);}},false);
    grain.wrapS=grain.wrapT=T.RepeatWrapping;grain.repeat.set(2,2);
    const steel=material({color:0x6c7479,metalness:.9,roughness:.4,bumpMap:grain,bumpScale:.008});
    const paint=material({color:0x465158,metalness:.55,roughness:.48,bumpMap:grain,bumpScale:.006});
    const face=material({color:0x414c52,metalness:.55,roughness:.43,bumpMap:grain,bumpScale:.004});
    const black=material({color:0x070a0c,metalness:.1,roughness:.73}),rubber=material({color:0x10252b,roughness:.72});
    const chrome=material({color:0x9ea8aa,metalness:1,roughness:.3}),gold=material({color:0xc4a05c,metalness:.9,roughness:.35});
    const jacketGrain=texture(256,256,(c,w,h)=>{c.fillStyle='#888';c.fillRect(0,0,w,h);for(let i=0;i<22000;i++){const n=110+random()*35;c.fillStyle=`rgb(${n},${n},${n})`;c.fillRect(random()*w,random()*h,1,1);}},false);
    jacketGrain.wrapS=jacketGrain.wrapT=T.RepeatWrapping;jacketGrain.repeat.set(16,2);
    const cableMat=material({color:0x31596b,metalness:0,roughness:.48,bumpMap:jacketGrain,bumpScale:.0008});
    const glass=new T.MeshPhysicalMaterial({color:0xdde8eb,metalness:0,roughness:.13,transparent:true,opacity:.3,depthWrite:false,ior:1.58,clearcoat:.8,clearcoatRoughness:.12,envMapIntensity:.75,side:T.DoubleSide});materials.push(glass);
    function mesh(g,m,parent=world){geometries.push(g);const o=new T.Mesh(g,m);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
    function box(w,h,d,m,x,y,z,parent=world){const o=mesh(new T.BoxGeometry(w,h,d),m,parent);o.position.set(x,y,z);return o;}
    function rounded(w,h,d,r,m,x,y,z,parent=world){
      const s=new T.Shape(),a=-w/2,b=-h/2;
      s.moveTo(a+r,b);s.lineTo(a+w-r,b);s.quadraticCurveTo(a+w,b,a+w,b+r);s.lineTo(a+w,b+h-r);s.quadraticCurveTo(a+w,b+h,a+w-r,b+h);s.lineTo(a+r,b+h);s.quadraticCurveTo(a,b+h,a,b+h-r);s.lineTo(a,b+r);s.quadraticCurveTo(a,b,a+r,b);
      const bevel=Math.min(.008,Math.min(w,h,d)*.12);const g=new T.ExtrudeGeometry(s,{depth:d,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:bevel,bevelThickness:bevel,curveSegments:8});g.translate(0,0,-d/2);
      const o=mesh(g,m,parent);o.position.set(x,y,z);return o;
    }
    function label(text,w,h,x,y,z,parent=world,top=false){const map=texture(1024,128,(c,cw,ch)=>{c.clearRect(0,0,cw,ch);c.fillStyle='#c4ccd0';c.font='500 44px Arial';c.textAlign='center';c.textBaseline='middle';c.fillText(text,cw/2,ch/2);});const m=new T.MeshBasicMaterial({map,transparent:true,depthWrite:false});materials.push(m);const o=mesh(new T.PlaneGeometry(w,h),m,parent);o.position.set(x,y,z);if(top)o.rotation.x=-Math.PI/2;return o;}
    function screw(x,y,z,parent,top=false){const o=mesh(new T.CylinderGeometry(.022,.022,.009,12),chrome,parent);o.position.set(x,y,z);if(!top)o.rotation.x=Math.PI/2;const a=box(.025,.004,.002,black,x,y,z+.006,parent);if(top){a.position.set(x,y+.006,z);a.rotation.x=-Math.PI/2;}else box(.004,.025,.002,black,x,y,z+.007,parent);}
    const ledHalo=texture(128,128,(c,w,h)=>{const g=c.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.12,'rgba(255,255,255,.85)');g.addColorStop(.32,'rgba(255,255,255,.28)');g.addColorStop(.65,'rgba(255,255,255,.07)');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(0,0,w,h);});
    function lightLed(m,strength,color=0x64ff8b){
      m.color.setHex(strength?color:0x17241b);m.emissive.setHex(color);m.emissiveIntensity=strength*LED.appearance.emission;
      const halo=m.userData.halo;halo.visible=strength>0;halo.material.color.setHex(color);halo.material.opacity=strength*LED.appearance.halo;
      if(m.userData.spill){m.userData.spill.color.setHex(color);m.userData.spill.intensity=strength*.035;}
    }
    function led(x,y,z,parent,lit=false){
      const m=material({color:0x18251b,emissive:0x64ff8b,emissiveIntensity:0,roughness:.25});
      box(.022,.017,.006,m,x,y,z,parent);
      const glowMaterial=new T.SpriteMaterial({map:ledHalo,color:0x64ff8b,transparent:true,depthWrite:false,depthTest:true,blending:T.AdditiveBlending,toneMapped:false});materials.push(glowMaterial);
      const halo=new T.Sprite(glowMaterial);halo.position.set(x,y,z+.012);halo.scale.set(.18,.15,1);parent.add(halo);m.userData.halo=halo;
      lightLed(m,lit?1:0);return m;
    }
    function ledSpill(m){const glow=m.userData.halo,light=new T.PointLight(0x64ff8b,0,.34,2);light.position.copy(glow.position);light.position.z+=.025;glow.parent.add(light);m.userData.spill=light;}
    function port(x,y,z,parent){
      // Metal lip, recessed socket, latch recess and eight individual brass contacts.
      box(.177,.148,.012,chrome,x,y,z,parent);box(.151,.121,.016,black,x,y,z+.009,parent);
      box(.136,.006,.055,steel,x,y+.055,z+.029,parent);box(.006,.105,.055,steel,x-.07,y,z+.029,parent);box(.006,.105,.055,steel,x+.07,y,z+.029,parent);
      box(.053,.025,.018,black,x,y-.056,z+.018,parent);
      for(let i=0;i<8;i++)box(.008,.005,.058,gold,x-.049+i*.014,y+.025,z+.028,parent);
      return led(x+.065,y+.087,z+.008,parent);
    }
    // Studio reflections: large soft panels, not a flat ambient-only material.
    const room=new T.Scene();room.background=new T.Color(0x252a30);
    for(const [x,y,z,w,h,color] of [[-4,5,1,5,4,0xe7efff],[4,3,-3,4,3,0xd3c1a7],[0,6,0,3,5,0xffffff]]){const p=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color,side:T.DoubleSide}));p.position.set(x,y,z);p.lookAt(0,0,0);room.add(p);}
    const pmrem=new T.PMREMGenerator(renderer),env=pmrem.fromScene(room,.08);scene.environment=env.texture;pmrem.dispose();room.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
    scene.add(new T.HemisphereLight(0xbac8d7,0x171b20,1.6));
    const key=new T.DirectionalLight(0xffedd9,3.5);key.position.set(-3,6,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-5;key.shadow.camera.right=5;key.shadow.camera.top=4;key.shadow.camera.bottom=-4;key.shadow.normalBias=.018;key.shadow.bias=-.0002;key.shadow.radius=3;scene.add(key);
    const fill=new T.DirectionalLight(0xa9cbef,1.6);fill.position.set(5,3,-2);scene.add(fill);
    const floor=mesh(new T.PlaneGeometry(30,30),new T.ShadowMaterial({opacity:.3}));floor.rotation.x=-Math.PI/2;floor.position.y=.015;floor.castShadow=false;
    const switchGroup=new T.Group();world.add(switchGroup);switchGroup.position.set(-.12,.28,.25);
    rounded(4.4,.42,2.25,.035,paint,0,0,0,switchGroup);
    box(4.32,.012,2.17,steel,0,.218,0,switchGroup);
    rounded(4.4,.42,.035,.025,face,0,0,1.143,switchGroup);
    const switchLeds=[];
    for(let row=0;row<2;row++)for(let col=0;col<12;col++){const x=-.88+col*.205,y=row===0?.09:-.095;switchLeds.push(port(x,y,1.168,switchGroup));}
    label('Switch  /  24 PORT GIGABIT',.94,.12,-1.61,.07,1.171,switchGroup);
    label('SYS    LINK    ACT',.6,.065,-1.6,-.11,1.172,switchGroup);const switchStatusLeds=[];for(let i=0;i<3;i++)switchStatusLeds.push(led(-1.79+i*.16,-.055,1.18,switchGroup,i===0));
    for(let i=0;i<12;i++)label(String(i+1),.12,.035,-.88+i*.205,.193,1.177,switchGroup);
    for(const x of [-2.09,2.09])for(const y of [-.13,.13])screw(x,y,1.175,switchGroup);
    for(const x of [-2.02,2.02])for(const z of [-.94,.94])screw(x,.23,z,switchGroup,true);
    for(let i=0;i<26;i++){box(.009,.13,.017,black,2.207,0,-.94+i*.069,switchGroup);box(.009,.13,.017,black,-2.207,0,-.94+i*.069,switchGroup);}
    for(const x of [-1.8,1.8])for(const z of [-.8,.8])box(.21,.055,.21,black,x,-.24,z,switchGroup);
    const routerGroup=new T.Group();world.add(routerGroup);routerGroup.position.set(.2,.76,-.28);
    rounded(2.9,.4,1.75,.04,steel,0,0,0,routerGroup);box(2.82,.012,1.67,paint,0,.209,0,routerGroup);
    rounded(2.88,.39,.036,.025,face,0,0,.894,routerGroup);
    const routerLeds=[];for(let i=0;i<4;i++)routerLeds.push(port(.27+i*.235,-.015,.92,routerGroup));
    label('Router',.7,.16,-.85,.055,.925,routerGroup);label('WAN / LAN',.62,.065,.63,.145,.926,routerGroup);
    label('PWR   SYS',.44,.06,-.85,-.13,.925,routerGroup);led(-.99,-.07,.93,routerGroup,true);led(-.77,-.07,.93,routerGroup,true);
    for(const x of [-1.33,1.33]){screw(x,0,.93,routerGroup);for(const z of [-.7,.7])screw(x,.22,z,routerGroup,true);}
    for(let i=0;i<22;i++)for(let row=0;row<3;row++)box(.025,.002,.10,black,-1.07+i*.08,.219,-.55+row*.2,routerGroup);
    for(let i=0;i<19;i++)box(.008,.12,.018,black,1.457,0,-.7+i*.074,routerGroup);
    for(const x of [-1.15,1.15])for(const z of [-.62,.62])box(.16,.065,.16,black,x,-.235,z,routerGroup);
    // Factory-style label: generic information, not a counterfeit manufacturer logo.
    const sticker=texture(512,256,(c,w,h)=>{c.fillStyle='#b6b9b6';c.fillRect(0,0,w,h);c.fillStyle='#30383b';c.font='bold 22px Arial';c.fillText('NETWORK EQUIPMENT',18,35);c.font='16px monospace';c.fillText('MODEL R4  |  DC INPUT',18,65);for(let i=0;i<100;i++){const x=18+i*4;c.fillRect(x,100,random()> .4?2:1,75);}c.fillText('R4 - 000248',18,211);});
    const stickerMat=material({map:sticker,roughness:.8,metalness:0});const st=mesh(new T.PlaneGeometry(.72,.36),stickerMat,routerGroup);st.rotation.x=-Math.PI/2;st.position.set(.76,.224,-.48);
    // The body, clip and contact geometry come from Molex's actual STEP model.
    // Only uniform scale and a rigid axis conversion are applied to the reference shape.
    const connectorFactory=window.MadarRJ45.create(T,rj45,{glass,gold,cableMaterial:cableMat});
    function plug(){const g=connectorFactory.plug();world.add(g);return g;}
    const pressLatch=connectorFactory.pressLatch;
    // Batch repeated contacts, vents and screws; the detailed model need not cost one draw per pin.
    world.updateMatrixWorld(true);
    const batches=new Map();
    [switchGroup,routerGroup].forEach(group=>group.traverse(o=>{if(!o.isMesh||!['BoxGeometry','CylinderGeometry'].includes(o.geometry.type))return;const k=o.geometry.type+JSON.stringify(o.geometry.parameters)+o.material.uuid;if(!batches.has(k))batches.set(k,[]);batches.get(k).push(o);}));
    for(const items of batches.values()){if(items.length<3)continue;const inst=new T.InstancedMesh(items[0].geometry,items[0].material,items.length);inst.castShadow=inst.receiveShadow=true;items.forEach((o,i)=>{inst.setMatrixAt(i,o.matrixWorld);o.removeFromParent();});world.add(inst);}
    const routerEnd=new T.Vector3(.47,.745,.66),target=new T.Vector3(.845,.37,1.445);
    const plugA=plug(),plugB=plug();plugA.position.copy(routerEnd);plugB.position.copy(target);
    let cable=null,lastCable=-1,cableLength=null;
    const v=(x,y,z)=>new T.Vector3(x,y,z);
    function cablePath(end,reach){
      const start=routerEnd.clone().add(v(0,0,.14)),path=new T.CurvePath();
      const low=v(-.48,.057,reach),turn=v(.42,.057,reach+.27);
      // C1 continuous segments: both heads leave axially, then broad gravity-shaped bends.
      path.add(new T.CubicBezierCurve3(start,start.clone().add(v(0,0,.58)),v(-.48,.057,reach-.58),low));
      path.add(new T.CubicBezierCurve3(low,low.clone().add(v(0,0,.35)),turn.clone().add(v(-.4,0,0)),turn));
      path.add(new T.CubicBezierCurve3(turn,turn.clone().add(v(.55,0,0)),end.clone().add(v(0,0,.6)),end));
      return path;
    }
    function updateCable(time){
      const insertion=T.MathUtils.smootherstep(time,1.2,3.2),release=time>12?T.MathUtils.smootherstep(time,12.25,14):0;
      const gap=.45*(1-insertion+release);plugB.position.copy(target);plugB.position.z+=gap;
      const press=T.MathUtils.smoothstep(time,11.8,12.2)*(1-T.MathUtils.smoothstep(time,13.5,14));
      pressLatch(plugB,press);
      const end=plugB.position.clone().add(v(0,0,.14));
      if(cableLength===null)cableLength=cablePath(target.clone().add(v(0,0,.14)),2.65).getLength();
      let lo=2.05,hi=3.15;
      for(let i=0;i<12;i++){const mid=(lo+hi)/2;if(cablePath(end,mid).getLength()>cableLength)hi=mid;else lo=mid;}
      const curve=cablePath(end,(lo+hi)/2),geometry=new T.TubeGeometry(curve,160,.031,16,false);
      if(!cable){cable=new T.Mesh(geometry,cableMat);cable.castShadow=true;cable.receiveShadow=true;world.add(cable);}else{cable.geometry.dispose();cable.geometry=geometry;}
      document.body.dataset.cableLength=curve.getLength().toFixed(4);
      document.body.dataset.connectorGap=gap.toFixed(4);
      return insertion>.99&&release<.01;
    }
    ledSpill(switchLeds[9]);ledSpill(routerLeds[0]);
    let elapsed=0,last=0,raf=0,active=false,paused=false,disposed=false,lastPaint=0;
    let viewZoom=1;
    const viewOffset=new T.Vector3(),screenRight=new T.Vector3(),screenUp=new T.Vector3();
    const canvas=renderer.domElement;canvas.tabIndex=0;canvas.setAttribute('aria-label','مشهد الأجهزة: اسحب لتحريك العرض، واستخدم أزرار التكبير أو Ctrl مع عجلة الماوس');
    const pointers=new Map();let pinchDistance=0;
    function projection(){camera.zoom=(innerWidth/innerHeight<1.2?1.3:1.2)*viewZoom;camera.updateProjectionMatrix();document.body.dataset.zoom=viewZoom.toFixed(2);document.getElementById('zoom-value').textContent=viewZoom.toFixed(1)+'×';document.getElementById('zoom-out').disabled=viewZoom<=1;document.getElementById('zoom-in').disabled=viewZoom>=12;}
    function zoomBy(factor){viewZoom=T.MathUtils.clamp(viewZoom*factor,1,12);if(viewZoom===1)viewOffset.set(0,0,0);projection();draw();}
    function resetView(){viewZoom=1;viewOffset.set(0,0,0);projection();draw();}
    function pan(dx,dy){const scale=2*camera.position.distanceTo(new T.Vector3(.1,.45,.8).add(viewOffset))*Math.tan(T.MathUtils.degToRad(camera.fov/2))/(innerHeight*camera.zoom);screenRight.setFromMatrixColumn(camera.matrixWorld,0);screenUp.setFromMatrixColumn(camera.matrixWorld,1);viewOffset.addScaledVector(screenRight,-dx*scale).addScaledVector(screenUp,dy*scale);viewOffset.clampLength(0,6);draw();}
    document.getElementById('zoom-in').onclick=()=>zoomBy(1.4);
    document.getElementById('zoom-out').onclick=()=>zoomBy(1/1.4);
    document.getElementById('zoom-reset').onclick=resetView;
    canvas.addEventListener('wheel',e=>{if(!e.ctrlKey)return;e.preventDefault();zoomBy(Math.exp(-e.deltaY*.003));},{passive:false});
    canvas.addEventListener('keydown',e=>{if(['+','=','-','0','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();if(e.key==='+'||e.key==='=')zoomBy(1.4);else if(e.key==='-')zoomBy(1/1.4);else if(e.key==='0')resetView();else pan(e.key==='ArrowLeft'?30:e.key==='ArrowRight'?-30:0,e.key==='ArrowUp'?30:e.key==='ArrowDown'?-30:0);}});
    canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;canvas.focus({preventScroll:true});canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});pinchDistance=0;canvas.classList.add('dragging');});
    canvas.addEventListener('pointermove',e=>{const old=pointers.get(e.pointerId);if(!old)return;const next={x:e.clientX,y:e.clientY};pointers.set(e.pointerId,next);if(pointers.size===1)pan(next.x-old.x,next.y-old.y);else{const [a,b]=[...pointers.values()],distance=Math.hypot(a.x-b.x,a.y-b.y);if(pinchDistance>0)zoomBy(distance/pinchDistance);pinchDistance=distance;}});
    function releasePointer(e){pointers.delete(e.pointerId);pinchDistance=0;if(!pointers.size)canvas.classList.remove('dragging');}
    ['pointerup','pointercancel','lostpointercapture'].forEach(type=>canvas.addEventListener(type,releasePointer));
    const reduce=matchMedia('(prefers-reduced-motion: reduce)'),phase=document.getElementById('phase');
    // Link/activity indication, based on Microchip VSC8574-01 section 3.15.3:
    // 5 Hz, 50% duty cycle. Traffic is an illustrative schedule, not a live trace.
    // Frames arriving close together share the visible activity interval.
    const frameTimes=[];
    for(const [start,count,spacing] of [[.55,11,.018],[2.05,17,.022],[4.4,7,.025],[6.2,24,.016],[7.9,6,.026]]){
      for(let i=0;i<count;i++)frameTimes.push(start+i*spacing);
    }
    function linkActivity(seconds,connected,staticView=false,frames=frameTimes){
      if(!connected)return {light:0,traffic:false};
      if(staticView)return {light:1,traffic:false};
      const traffic=frames.some(frame=>seconds>=frame&&seconds-frame<.2);
      // Idle link stays ON; activity switches fully OFF/ON, never half-bright.
      return {light:LED.level(true,traffic,seconds,staticView),traffic};
    }
    function draw(){
      const t=reduce.matches?6:elapsed%16;
      if(Math.abs(t-lastCable)>.025){updateCable(t);lastCable=t;}
      // Establishment delay is illustrative; exact negotiation time depends on hardware.
      const seated=t>=3.2&&t<12.25,linked=t>=3.85&&t<12.25;
      const activity=linkActivity(t-3.85,linked,reduce.matches),blink=activity.light;
      lightLed(switchLeds[9],blink);lightLed(routerLeds[0],blink);
      lightLed(switchStatusLeds[1],linked?1:0);lightLed(switchStatusLeds[2],activity.traffic?blink:0);
      document.body.dataset.traffic=activity.traffic?'active':'idle';
      document.body.dataset.linkStatus=linked?'up':seated?'negotiating':'down';
      document.body.dataset.linkGlow=blink.toFixed(2);
      const push=reduce.matches?0:Math.sin(Math.PI*Math.min(1,t/5))**2;
      const angle=reduce.matches?0:Math.sin(t*Math.PI/8)*.35;
      camera.position.set(4.25+angle,3.1-.16*push,7.35-.5*push).add(viewOffset);camera.lookAt(new T.Vector3(.1+.18*push,.45,.8+.1*push).add(viewOffset));
      phase.textContent=linked?(activity.traffic?'— إرسال واستقبال بيانات':'— الرابط قائم'):seated?'— انتظار قيام الرابط':t>=12.25?'— فصل الكابل':'— توصيل الكابل';
      document.body.dataset.phase=linked?'linked':seated?'negotiating':t>=12.25?'disconnecting':'connecting';document.body.dataset.time=elapsed.toFixed(3);
      renderer.render(scene,camera);
    }
    addEventListener('madar-reflection-refresh',()=>{if(!disposed)renderer.render(scene,camera);});
    function animate(now){raf=0;if(disposed||!active||paused||document.hidden||reduce.matches){last=0;return;}if(last)elapsed+=Math.min((now-last)/1000,.1);last=now;if(now-lastPaint>1000/30){draw();lastPaint=now;}raf=requestAnimationFrame(animate);}
    function sync(){cancelAnimationFrame(raf);raf=0;last=0;if(active&&!paused&&!document.hidden&&!reduce.matches)raf=requestAnimationFrame(animate);else draw();}
    function resize(){const w=innerWidth,h=innerHeight,dpr=Math.min(4,Math.max(devicePixelRatio,2),Math.sqrt(12000000/(w*h)));renderer.setPixelRatio(dpr);renderer.setSize(w,h);camera.aspect=w/h;camera.fov=w/h<1.2?42:33;projection();document.body.dataset.renderRatio=dpr.toFixed(2);draw();}
    addEventListener('message',e=>{if(e.source!==parent||e.origin!==location.origin||e.data?.type!=='madar-news-scene')return;active=!!e.data.active;paused=!!e.data.paused;sync();});
    document.addEventListener('visibilitychange',sync);reduce.addEventListener('change',sync);addEventListener('resize',resize);visualViewport?.addEventListener('resize',resize);
    renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(raf);document.body.classList.add('failed');});
    renderer.domElement.addEventListener('webglcontextrestored',()=>location.reload());
    addEventListener('pagehide',()=>{disposed=true;cancelAnimationFrame(raf);connectorFactory.dispose();textures.forEach(t=>t.dispose());geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());cable?.geometry.dispose();env.dispose();renderer.dispose();});
    resize();document.body.dataset.ready='true';parent.postMessage({type:'madar-news-ready'},location.origin);
  } catch(error){renderer?.dispose();document.body.classList.add('failed');console.error('Network news scene:',error);}
})();
