function syncHalo(){
  haloCaption.textContent=haloNames[haloLevel-1];root.style.setProperty('--mr-halo-color',haloColors[haloLevel-1]);
  haloButton.textContent=haloPlaying?'إيقاف حركة الهالة':'تشغيل حركة الهالة';haloButton.setAttribute('aria-pressed',String(haloPlaying));
  haloButton.disabled=reduced.matches;replayButton.disabled=reduced.matches;if(reduced.matches)haloButton.textContent='حركة مخفّضة';
  drawHalo();if(frame)cancelAnimationFrame(frame);frame=0;lastTick=0;
  if(haloPlaying&&!reduced.matches&&visible&&!document.hidden)frame=requestAnimationFrame(tick);
 }
 function restore(saved){const v=saved?.modelContent||saved;if(v&&['1','2','3','full'].includes(v.level)&&Number.isFinite(+v.count)){state={level:v.level,count:Math.max(1,Math.min(99,Math.round(+v.count)))};}}
 restore(window.openai?.widgetState);
 function render(){
  const full=state.level==='full',degree=full?3:+state.level,count=Math.min(state.count,4);
  // Provisional display model only: degree weight 3, count weight 1,
  // full explanation adds weight 3. Not a validated mastery measure.
  const score=3*degree+count+(full?3:0), layers=Math.max(1,Math.min(5,Math.ceil(score/16*5)));
  root.style.setProperty('--mr-degree',levelColors[state.level]);
  root.style.setProperty('--mr-count-color',full?countColors[3]:countColors[count-1]);
  root.dataset.level=state.level;root.dataset.count=state.count;root.dataset.score=score;root.dataset.layers=layers;
  haloLevel=layers;syncHalo();
  q('#mr-degree-label').textContent=full?'احتجت شرحًا للخطوة كاملة':`تلميح من الدرجة ${['','الأولى','الثانية','الثالثة'][degree]}`;
  q('#mr-degree-detail').textContent=full?'شاهدت طريقة تنفيذ الخطوة كاملة.':['','إشارة للمكان وسؤال يوجّه تفكيرك.','تلميح أوضح يقرّبك من الإجراء.','تلميح مباشر يحدّد الإجراء أكثر.'][degree];
  q('#mr-count').textContent=ar(state.count);q('#mr-count-input').value=state.count;
  q('#mr-count-detail').textContent=full?'الشرح الكامل يجعل العدّاد بنفسجيًا':state.count>=4?'اللون ثابت من ٤، والعدد يستمر':state.count===1?'مرة واحدة':state.count===2?'مرتان':'٣ مرات';
  q('#mr-need').textContent=['','مراجعة خفيفة','راجع هذه الخطوة','مراجعة مركّزة','أولوية مراجعة عالية','أولوية المراجعة الأعلى'][layers];
  q('#mr-pyramid-title').textContent=`احتياج المراجعة: ${layers} طبقات من 5؛ مؤشر تجريبي`;
  const fills=['#ffe33b','#ffc12e','#ff9b27','#ff773f','#ff4d62'];
  root.querySelectorAll('[data-layer]').forEach(p=>{const i=+p.dataset.layer;p.style.fill=i<=layers?fills[i-1]:'#383a36';});
  root.querySelectorAll('.mr-signal b').forEach((b,i)=>b.style.opacity=i<degree?'1':'.18');
  root.querySelectorAll('[data-level]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.level===state.level)));
  q('#mr-next-copy').textContent=full?'ارجع للخطوة وفسّر سببها، ثم جرّب تنفيذها دون فتح الشرح.':'أعد تنفيذ الخطوة، وحاول قبل فتح التلميح.';
  q('#mr-minus').disabled=state.count===1;q('#mr-plus').disabled=state.count===99;
 }
 function save(){render();window.openai?.setWidgetState?.({modelContent:{level:state.level,count:state.count,preview:'مؤشر احتياج المراجعة؛ بيانات توضيحية'},privateContent:{haloPlaying}})?.catch(()=>{});}
 if(typeof window.openai?.widgetState?.privateContent?.haloPlaying==='boolean')haloPlaying=window.openai.widgetState.privateContent.haloPlaying&&!reduced.matches;
 haloButton.onclick=()=>{haloPlaying=!haloPlaying;save();};
 replayButton.onclick=()=>{introStart=haloTime;firstDischarge=false;discharges=[];haloPlaying=true;save();};
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;syncHalo();}).observe(root);
 document.addEventListener('visibilitychange',syncHalo);
 reduced.addEventListener('change',()=>{haloPlaying=!reduced.matches;syncHalo();});
 new ResizeObserver(resizeScene).observe(stage);
 root.querySelectorAll('[data-level]').forEach(b=>b.addEventListener('click',()=>{state.level=b.dataset.level;save();}));
 q('#mr-minus').onclick=()=>{state.count=Math.max(1,state.count-1);save();};q('#mr-plus').onclick=()=>{state.count=Math.min(99,state.count+1);save();};
 q('#mr-count-input').addEventListener('change',e=>{state.count=Math.max(1,Math.min(99,Math.round(Number(e.target.value)||1)));save();});
 window.addEventListener('openai:set_globals',e=>{if(e.detail?.globals?.widgetState){const saved=e.detail.globals.widgetState;restore(saved);if(typeof saved.privateContent?.haloPlaying==='boolean')haloPlaying=saved.privateContent.haloPlaying&&!reduced.matches;render();}});
 render();
})();
</script>

