<script>
  (()=>{
    const root=document.getElementById('madar-net-space');
    const canvas=root.querySelector('canvas'),ctx=canvas.getContext('2d'),stage=root.querySelector('.net-stage');
    const pause=root.querySelector('.net-pause');
    const hits=[...root.querySelectorAll('.device-hit')],tip=root.querySelector('.net-tip'),buttons=[...root.querySelectorAll('[data-scene]')];
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    let saved=window.openai?.widgetState?.privateContent||{};
    try{if(!Object.keys(saved).length)saved=JSON.parse(localStorage.getItem('madar-network-background-v2')||'{}')}catch{}
    const scroller=root.querySelector('.demo-scroll'),page=root.querySelector('.demo-page');
    const mirrorSurface=root.querySelector('.mirror-surface'),mirrorCanvas=root.querySelector('.mirror-canvas'),mirrorCtx=mirrorCanvas.getContext('2d'),screen=root.querySelector('.self-screen'),device=root.querySelector('.self-device'),pointer=root.querySelector('.mirror-pointer');
    let mirrorPage=null,view='home',cursorX=0,cursorY=0,touchUntil=0,signals=0,mirrorScale=1,mirrorX=0,mirrorY=0;
    function refreshMirror(){
      mirrorPage=page.cloneNode(true);mirrorPage.classList.add('mirror-page');mirrorPage.setAttribute('inert','');mirrorPage.querySelectorAll('button').forEach(b=>b.removeAttribute('data-view'));mirrorSurface.replaceChildren(mirrorPage);layoutMirror();
    }
    function layoutMirror(){
      if(!W||!mirrorPage)return;
      mirrorScale=Math.min(screen.clientWidth/W,screen.clientHeight/H);mirrorX=(screen.clientWidth-W*mirrorScale)/2;mirrorY=(screen.clientHeight-H*mirrorScale)/2;
      mirrorSurface.style.width=W+'px';mirrorSurface.style.height=H+'px';mirrorSurface.style.left=mirrorX+'px';mirrorSurface.style.top=mirrorY+'px';mirrorSurface.style.transform='scale('+mirrorScale+')';mirrorPage.style.width=W+'px';mirrorPage.style.transform='translateY('+(-scroller.scrollTop)+'px)';
      mirrorCanvas.width=Math.round(screen.clientWidth*Math.min(devicePixelRatio||1,2));mirrorCanvas.height=Math.round(screen.clientHeight*Math.min(devicePixelRatio||1,2));
    }
    function openView(next,persist=true){
      view=next;page.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view)));
      page.querySelector('h2').innerHTML=view==='home'?'من فهم الشبكة…<br>إلى ضبطها بيدك.':'كل خطوة…<br>لها معنى.';
      page.querySelector('.demo-hero p').textContent=view==='home'?'تعرف وش خطوتك الجاية، وتفهم ليه تسويها، وتشوف دليل تقدّمك.':'ابدأ بالفهم، ثم طبّق على الشبكة بنفسك.';
      page.querySelector('.demo-start').textContent=view==='home'?'يلا نبدأ نذاكر':'شوف الدروس';
      if(persist)signals|=4;scroller.scrollTop=0;refreshMirror();root.dataset.discovery=String(signals);if(persist)save();
    }
    let stateStamp=Number(saved.stamp)||0;
    let hostActive=parent===window,frameHandle=0;
    let paused=typeof saved.paused==='boolean'?saved.paused:reduced;
    let scene=Number.isInteger(saved.scene)?Math.max(0,Math.min(4,saved.scene)):0;
    let W=0,H=0,mobile=false,clock=3.8,last=0,hover=-1,mx=0,my=0,tx=0,ty=0,visible=hostActive&&!document.hidden;
    let nodes=[],edges=[],landmarks=[],traffic=[],points=[],lastPhase='';
    const duration=18;
    const names=['نافذة على العالم','وجهًا لوجه… عبر المسافات','عالم واحد. لاعبان.','ملفاتك، أينما كنت','رسالة تعبر المسافات'];
    const phases=[['طلب موقع يسافر عبر الشبكة','الخادم يستقبل الطلب','تعود الصور والنصوص إلى جهازك','صفحة اكتملت… واتصال يستمر'],['بدء الاتصال بين الطرفين','الصوت والصورة في الاتجاهين','حديث متبادل، لحظة بلحظة','المسافة تختفي خلف الاتصال'],['لاعبان يتصلان بخادم اللعبة','حركة اللاعب تصل إلى الخادم','تحديث اللعب يصل للطرف الآخر','اللعب مستمر بين الجهازين'],['صورة على جهازك، جاهزة للرفع','الملف في طريقه إلى السحابة','اكتمل الرفع إلى السحابة','صورتك أصبحت على جهازك الثاني'],['رسالة تُكتب على الجهاز','إرسال البريد عبر الشبكة','وصلت رسالة جديدة','تُفتح الرسالة عند الطرف الآخر']];
    const deviceNames=[['حاسب متصل','خادم موقع','هاتف متصل'],['طرف المكالمة الأول','Router الشبكة','طرف المكالمة الثاني'],['جهاز اللاعب الأول','خادم اللعبة','جهاز اللاعب الثاني'],['حاسب يرفع الملف','التخزين السحابي','هاتف يستقبل الملف'],['مرسل البريد','خادم البريد','مستقبل البريد']];
    