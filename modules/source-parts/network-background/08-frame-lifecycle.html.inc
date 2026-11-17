function sync(){pause.textContent=paused?'▶':'Ⅱ';pause.setAttribute('aria-pressed',String(paused));pause.setAttribute('aria-label',paused?'تشغيل حركة الخلفية':'إيقاف حركة الخلفية');tip.hidden=true;hover=-1;}
    function save(){stateStamp=Math.max(Date.now(),stateStamp+1);const data={paused,scene,view,stamp:stateStamp};try{localStorage.setItem('madar-network-background-v2',JSON.stringify(data))}catch{};window.openai?.setWidgetState?.({modelContent:{design:'اكتشاف تدريجي: جهاز يعكس تفاعل المستخدم داخل المعاينة',paused,view},privateContent:data})?.catch(()=>{})}
    function reflection(){
      // Copy only this preview's canvas and duplicate its own DOM; no screen capture or external data.
      const ratio=mirrorCanvas.width/screen.clientWidth;mirrorCtx.fillStyle='#090c10';mirrorCtx.fillRect(0,0,mirrorCanvas.width,mirrorCanvas.height);
      mirrorCtx.drawImage(canvas,mirrorX*ratio,mirrorY*ratio,W*mirrorScale*ratio,H*mirrorScale*ratio);
      pointer.style.left=(mirrorX+cursorX*mirrorScale)+'px';pointer.style.top=(mirrorY+cursorY*mirrorScale)+'px';
      if(pointer.classList.contains('touch')&&performance.now()>touchUntil)pointer.style.opacity='0';
    }
    function render(){background();foreground();reflection();root.dataset.paused=String(paused);root.dataset.time=clock.toFixed(3);}
    function advanceTraffic(dt){
      for(const f of traffic){
        let distance=f.speed*dt;
        while(distance>0){
          const e=edges[f.edge],a=nodes[e.a],b=nodes[e.b];
          const length=Math.max(1,Math.hypot(a.x-b.x,a.y-b.y));
          const remaining=(1-f.position)*length;
          if(distance<remaining){f.position+=distance/length;break;}
          distance-=remaining;
          const reached=f.forward?e.b:e.a;
          const options=[];edges.forEach((edge,index)=>{if(index!==f.edge&&(edge.a===reached||edge.b===reached))options.push(index)});
          f.edge=options.length?options[Math.floor(rand()*options.length)]:f.edge;
          f.forward=edges[f.edge].a===reached;
          f.position=0;
        }
      }
    }
    function scheduleFrame(){if(!frameHandle&&visible&&!paused)frameHandle=requestAnimationFrame(frame);}
    function syncVisibility(){visible=hostActive&&!document.hidden;last=0;if(!visible||paused){cancelAnimationFrame(frameHandle);frameHandle=0;}else scheduleFrame();}
    function frame(now){frameHandle=0;if(!root.isConnected||!visible)return;const dt=last?Math.min((now-last)/1000,.08):0;last=now;if(!paused){clock+=dt;advanceTraffic(dt);mx+=(tx-mx)*.035;my+=(ty-my)*.035;}render();scheduleFrame();}
    addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==parent||e.data?.type!=='madar-background-active')return;hostActive=e.data.active===true;syncVisibility();});
    addEventListener('pagehide',()=>{cancelAnimationFrame(frameHandle);frameHandle=0;});
    addEventListener('pageshow',syncVisibility);

    pause.addEventListener('click',()=>{paused=!paused;sync();save();render();syncVisibility()});
    buttons.forEach((b,i)=>b.addEventListener('click',()=>{scene=i;clock=3.8;sync();save();render()}));
    stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect();cursorX=e.clientX-r.left;cursorY=e.clientY-r.top;if(e.pointerType==='touch')return;pointer.classList.remove('touch');pointer.style.opacity='1';signals|=1;root.dataset.discovery=String(signals);if(reduced)return;tx=(cursorX/W-.5)*14;ty=(cursorY/H-.5)*10});
    stage.addEventListener('pointerdown',e=>{const r=stage.getBoundingClientRect();cursorX=e.clientX-r.left;cursorY=e.clientY-r.top;if(e.pointerType==='touch'){pointer.classList.add('touch');pointer.style.opacity='1';touchUntil=performance.now()+650;signals|=1;root.dataset.discovery=String(signals)}});
    stage.addEventListener('pointerleave',()=>{tx=ty=0;hover=-1;tip.hidden=true;pointer.style.opacity='0'});
    scroller.addEventListener('scroll',()=>{mirrorPage.style.transform='translateY('+(-scroller.scrollTop)+'px)';signals|=2;root.dataset.discovery=String(signals)},{passive:true});
    page.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>openView(b.dataset.view)));
    page.querySelector('.demo-start').addEventListener('click',()=>{if(view==='home')openView('lessons');else scroller.scrollTo({top:page.querySelector('.demo-lessons').offsetTop-32,behavior:reduced?'instant':'smooth'})});
    hits.forEach((b,i)=>{const show=()=>{hover=i;tip.textContent=deviceNames[0][i];tip.style.left=clamp(points[i].x,85,W-85)+'px';tip.style.top=Math.max(40,points[i].y-24)+'px';tip.hidden=false;render()};b.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')show()});b.addEventListener('focus',show);b.addEventListener('click',show);b.addEventListener('blur',()=>{tip.hidden=true;hover=-1});b.addEventListener('pointerleave',()=>{tip.hidden=true;hover=-1})});
    document.addEventListener('visibilitychange',syncVisibility);
    window.addEventListener('openai:set_globals',e=>{const s=e.detail?.globals?.widgetState?.privateContent;if(!s||Number(s.stamp||0)<stateStamp)return;stateStamp=Number(s.stamp)||stateStamp;if(typeof s.paused==='boolean')paused=s.paused;if(Number.isInteger(s.scene))scene=Math.max(0,Math.min(4,s.scene));sync();render();syncVisibility()});
    refreshMirror();if(saved.view==='lessons')openView('lessons',false);new ResizeObserver(()=>{build();render()}).observe(stage);build();sync();render();scheduleFrame();
  })();
  </script>
</div>
