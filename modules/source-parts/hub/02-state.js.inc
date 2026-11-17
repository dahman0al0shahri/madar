const initial={version:1,route:'home',viewer:'student',access:{office:'public',network:'public'},contentAccess:{},profiles:{student:{visits:{},notes:{},latest:null},guest:{visits:{},notes:{},latest:null}},editor:null,updates:[
    {id:'hub',title:'مدار يجمع رحلتك',body:'مقرراتك في مكان واحد. ادخل إلى مساحة كل مقرر، وارجع إلى تعلّمك من المكان اللي وقفت عنده.',course:'',target:'courses',places:['global'],status:'published',pin:true,date:'2026-10-15',start:'',end:'',duration:12,scene:'hub'},
    {id:'network',title:'مساحة للشبكات. وفهم أقرب للتطبيق.',body:'دروس وتدريب عملي يجمعان الفكرة وتنفيذها، مع إرشاد يساعدك عند الحاجة.',course:'network',target:'course:network:lessons',places:['global','course'],status:'published',pin:false,date:'2026-10-15',start:'',end:'',duration:14,scene:'network'},
    {id:'office',title:'مذاكرتك صارت مترابطة',body:'تنتقل بين Word وExcel وAccess، وتجمع الشرح والتطبيق والمراجعة داخل مقرر واحد.',course:'office',target:'course:office:home',places:['global','course'],status:'published',pin:false,date:'2026-10-15',start:'',end:'',duration:12,scene:'office'}
  ]};

  /* hub:environment:start */
  const environment = createPreviewEnvironment({ initial, key: KEY,
    getWidget: () => window.openai, storage: localStorage, shouldFail: () => $('#mh-fail').checked });
  /* hub:environment:end */
  const { boot, store, adminStore, config, restored } = environment;
  const stateModel = createHubState({ initial: environment.initial, restored, courses, lessons,
    isAdmin: environment.isAdmin });
  let state = stateModel.value;
  const { profile, canCourse, canLesson, available, lessonBy } = stateModel;
  // Temporary view compatibility: save status is driven only by the controller.
  let dirty = false;
  let scheduleDay = nowDay();
  let carousel = null, raf = 0, lastFrame = 0, elapsed = 0, paused = reduced;
  let slideIndex = 0, keyboard = false, toastTimer, accountFilter = 'all';
  
