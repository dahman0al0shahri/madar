const initial={version:1,route:'home',viewer:'student',access:{office:'public',network:'public'},contentAccess:{},profiles:{student:{visits:{},notes:{},latest:null},guest:{visits:{},notes:{},latest:null}},editor:null,updates:[
    {id:'hub',title:'مدار يجمع رحلتك',body:'مقرراتك في مكان واحد. ادخل إلى مساحة كل مقرر، وارجع إلى تعلّمك من المكان اللي وقفت عنده.',course:'',target:'courses',places:['global'],status:'published',pin:true,date:'2026-10-15',start:'',end:'',duration:12,scene:'hub'},
    {id:'network',title:'مساحة للشبكات. وفهم أقرب للتطبيق.',body:'دروس وتدريب عملي يجمعان الفكرة وتنفيذها، مع إرشاد يساعدك عند الحاجة.',course:'network',target:'course:network:lessons',places:['global','course'],status:'published',pin:false,date:'2026-10-15',start:'',end:'',duration:14,scene:'network'},
    {id:'office',title:'مذاكرتك صارت مترابطة',body:'تنتقل بين Word وExcel وAccess، وتجمع الشرح والتطبيق والمراجعة داخل مقرر واحد.',course:'office',target:'course:office:home',places:['global','course'],status:'published',pin:false,date:'2026-10-15',start:'',end:'',duration:12,scene:'office'}
  ]};
  function normalize(v){if(!v||v.version!==1)return clone(initial);const d=clone(initial);Object.assign(d,v);for(const k of ['student','guest'])d.profiles[k]={visits:{},notes:{},latest:null,...v.profiles?.[k]};d.viewer=['student','guest'].includes(d.viewer)?d.viewer:'student';d.access={...initial.access,...v.access};d.contentAccess=v.contentAccess||{};d.updates=Array.isArray(v.updates)?v.updates:clone(initial.updates);return d;}
  let scheduleDay=nowDay();
  let restored=window.openai?.widgetState?.privateContent?.hub;
  if(!restored)try{restored=JSON.parse(localStorage.getItem(KEY)||'null');}catch{}
  let state=normalize(restored), dirty=false, saveTimer=null, chain=Promise.resolve(), pending=null, carousel=null, raf=0, lastFrame=0, elapsed=0, paused=reduced, slideIndex=0, keyboard=false, toastTimer, deleteId=null, accountFilter='all';
  const profile=()=>state.profiles[state.viewer];
  const canCourse=id=>!!courses[id]&&(state.access[id]==='public'||(state.access[id]==='restricted'&&state.viewer==='student'));
  const canLesson=l=>!!l&&canCourse(l.course)&&(state.contentAccess[l.id]!=='draft')&&(state.contentAccess[l.id]!=='restricted'||state.viewer==='student');
  const available=()=>Object.keys(courses).filter(canCourse);
  const lessonBy=id=>lessons.find(l=>l.id===id);
  