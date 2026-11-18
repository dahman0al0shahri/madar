// Meanings are scoped to their source format and repository consumer.
export function contextField(file, keys, value, root) {
  if (!keys.length || (value !== null && typeof value === 'object')) return '';
  const key = keys.filter(k => typeof k === 'string').at(-1);
  const text = String(value);
  if (file === 'lib/os-simulator-curriculum.json') {
    const step = keys[1] === 'actions' ? root[keys[0]].actions[keys[2]] : undefined;
    if (step) {
      if (keys[3] === 'key') return 'يعرّف الإجراء «'+text+'» في المحاكاة. تستخدم قائمة requires اسم الإجراء عند تسجيل تبعية خطوة لخطوة.';
      if (keys[3] === 'requires') return 'يشترط سجل الخطوة «'+step.key+'» إنجاز الإجراء «'+text+'» أولًا.';
      if (keys[3] === 'choices') return 'من القيم التي يتيحها سجل الإجراء «'+step.key+'» للحقل '+keys[4]+': «'+text+'».';
      if (keys[3] === 'expected') return 'القيمة المرجعية لحقل '+keys[4]+' في الإجراء «'+step.key+'» هي «'+text+'». تقع هذه القيمة في بيانات النتيجة المنتظرة للمحاكاة.';
    }
    if(key==='note')return 'ملاحظة تخص حدود تجربة «'+root[keys[0]].title+'» وطريقة فهم نتيجتها. نصها: '+text;
  }
  if (file === 'lib/network-theory-expanded.json' || file === 'lib/network-practical-guides.json') {
    const unit=root[keys[0]],theory=unit?.theory;
    if(keys.includes('glossary'))return 'يعرّف قاموس درس «'+unit.title+'» مصطلح '+key+' بالشرح التالي: '+text;
    if(keys.includes('flow'))return 'الخطوة '+(Number(keys.at(-1))+1)+' في تسلسل العمل بموضوع «'+(theory.topics[keys[keys.indexOf('topics')+1]]?.title||unit.title)+'»: '+text;
    const meanings={skillTitle:'يسمّي المهارة التي يستهدفها الدرس',chapterTitle:'يسجل عنوان الفصل المرجعي',part:'يحدد موضع المادة في الفصل أو الدليل العملي',english:'يحفظ عنوان المادة في حقل الاسم المقابل للمصدر',note:'يوضح قيدًا أو تفصيلًا مصاحبًا لموضوع الدرس',code:'يورد تعليمات المثال التي يقرؤها المتدرب في سياق الموضوع',link:'يحيل إلى مرجع الموضوع للرجوع إليه',sourceId:'يربط الدليل بمعرّف مصدره',originalFile:'يسمّي الملف الذي نُقلت منه مادة الدليل'};
    if(Object.hasOwn(meanings,key))return meanings[key]+' ضمن «'+unit.title+'».';
  }
  if(file==='lib/feedback-lessons.json')return key==='general'?'خيار البلاغ العام حين لا تخص الملاحظة درسًا محددًا.':'يعرض «'+text+'» عند تحديد الدرس ذي المعرّف '+key+' في البلاغ.';
  if(file.startsWith('lib/')&&key==='fullBankCount')return 'العدد الكلي الذي يعلنه ملف البنك للأسئلة هو '+text+'. يمكن التحقق منه بمقارنته بعدد سجلات الأسئلة الملائمة لهذا البنك.';
  if(file.startsWith('lib/')&&key==='version')return 'يميز إصدار بيانات '+file.split('/').at(-1)+' بالقيمة «'+text+'» عند المقارنة بين نسخ المحتوى.';
  if(file==='lib/os-media-manifest.json'&&key==='key')return 'مفتاح ملف الوسائط المجمّع الذي تنسب إليه إزاحات المقاطع وأحجامها: '+text+'.';
  if(file==='lib/night-review-content.json'){
    const notes={schema:'يعلن إصدار بنية ملف المراجعة الليلية.',notice:'يحفظ التنبيه المصاحب لاستخدام مواد المراجعة.',origin:'يحدد المنشأ المسجل لسؤال المراجعة.'};
    if(Object.hasOwn(notes,key))return notes[key];
  }
  if(file.startsWith('drizzle/meta/')){
    if(key==='default'&&keys[0]==='tables')return 'عند إغفال العمود '+keys[1]+'.'+keys[3]+' في الإدراج، يسجل المخطط التعبير الافتراضي '+text+'.';
    const meanings={version:'إصدار صيغة سجل Drizzle أو لقطة مخططه.',dialect:'لهجة SQL التي ولّد لها Drizzle بيانات المخطط.',prevId:'معرّف لقطة المخطط السابقة لربط نسخ الترحيل.',idx:'رقم ترتيب الترحيل في سجل Drizzle.',when:'وقت الترحيل المسجل بالمللي ثانية منذ بداية توقيت Unix.',tag:'اسم الترحيل الذي يربط هذا الإدخال بملف SQL.'};
    if(Object.hasOwn(meanings,key))return meanings[key]+' القيمة المسجلة «'+text+'».';
  }
  if(file==='project-map.json'){
    if(keys[0]==='areas')return 'يشرح هذا المدخل مسؤولية المجلد '+keys[1]+'/ ليعرف المطور أين يبدأ التعديل. وصفه في الخريطة: '+text;
    if(keys[0]==='features'&&['integration','entry'].includes(key))return (key==='entry'?'هذا مدخل الميزة':'هذا ملف يربط الميزة ببقية التطبيق')+' في سجل '+(root.features[keys[1]].id||String(keys[1]))+'، ومساره '+text+'.';
    const m={entry:'المسار الذي يبدأ منه أمر التوليد.',stage:'مرحلة البناء المسؤولة عن مجموعة المخرجات.',generators:'أحد ملفات المولدات التي تشارك في بناء المخرجات.',schemaVersion:'رقم إصدار بنية خريطة المشروع.',description:'يحدد نطاق ما تصفه خريطة المشروع.'};
    if(Object.hasOwn(m,key))return m[key]+' القيمة «'+text+'».';
  }
  if(file==='package.json'||file==='package-lock.json'){
    const install={dependencies:'اعتمادية تشغيل',devDependencies:'اعتمادية تطوير وفحص',overrides:'قاعدة تستبدل قرار اختيار الإصدار في شجرة الاعتماديات',engines:'متطلب إصدار بيئة التشغيل'};
    if(file==='package.json'&&Object.hasOwn(install,keys[0]))return install[keys[0]]+' لـ '+keys.slice(1).join(' / ')+' بقيد الإصدار «'+text+'» عند حل الاعتماديات.';
    if(file==='package-lock.json' && keys[0]==='packages' && keys[2]==='devDependencies')return 'اعتمادية تطوير معلنة للحزمة '+(keys[1]||'الجذر')+'، اسمها '+keys[3]+' وقيدها '+text+'.';
    const roles={name:'اسم الحزمة الذي يتعرف عليه npm.',version:'الإصدار المسجل للحزمة.',lockfileVersion:'إصدار بنية ملف القفل الذي يقرأه npm.',deprecated:'رسالة إيقاف دعم نشرها مؤلف الحزمة لهذا الإصدار.',libc:'أحد تطبيقات مكتبة C التي تعلن هذه الحزمة توافقها معها.',bundleDependencies:'اسم اعتمادية تُرفق داخل الحزمة المنشورة.',workspaces:'نمط مسارات يستخدمه تعريف مساحات العمل للحزمة.'};
    if(Object.hasOwn(roles,key))return roles[key]+' '+(keys[1]&&keys[0]==='packages'?'الحزمة '+keys[1]+'، ':'')+'القيمة «'+text+'».';
  }
  if(file==='tests/browser/screenshots/provenance.json'){
    const meanings={path:'مسار لقطة المقارنة المحفوظة',width:'عرض الصورة المرجعية بالبكسل',height:'ارتفاع الصورة المرجعية بالبكسل',capturedAt:'تاريخ التقاط الأصل المرجعي',sourceApplicationBase:'نسخة التطبيق التي كانت أساس الالتقاط',captureCommit:'التزام عملية الالتقاط',captureRun:'تشغيل الفحص الذي أنتج اللقطات',artifactId:'معرّف حزمة الأدلة التي نشرها الفحص',artifactSha256:'بصمة الحزمة للتحقق من سلامتها',review:'عبارة المراجعة المسجلة على اللقطات',os:'نظام تشغيل بيئة الالتقاط',playwright:'إصدار أداة قيادة المتصفح',locale:'اللغة والإعداد الإقليمي للمتصفح',timezone:'المنطقة الزمنية المثبتة عند الالتقاط',date:'التاريخ المعطى للتطبيق أثناء المقارنة',reducedMotion:'تفضيل الحركة الذي طُبق أثناء الالتقاط',font:'الخط المستخدم في بيئة المقارنة'};
    if(Object.hasOwn(meanings,key))return meanings[key]+' «'+text+'»'+(typeof keys[1]==='number'?' للصورة '+root.images[keys[1]].path:'')+'.';
  }
  if(file==='components.json'){
    if(keys[0]==='aliases')return 'يحل مولّد مكونات الواجهة الاسم '+key+' إلى مسار الاستيراد '+text+'.';
    const meanings={$schema:'عنوان مخطط التحقق من إعداد مولّد الواجهة.',style:'نمط المكونات المستخدم عند توليدها.',config:'مسار إعداد Tailwind الاختياري في المولد.',css:'ملف التنسيق الذي يستهدفه المولّد.',baseColor:'عائلة الألوان الأساسية للمكونات المولدة.',prefix:'البادئة المضبوطة لفئات Tailwind.'};
    if(Object.hasOwn(meanings,key))return meanings[key]+(text?' القيمة «'+text+'».':' القيمة فارغة في هذه النسخة.');
  }
  if(file==='.openai/hosting.json'){
    const m={project_id:'يربط إعداد النشر بهوية مشروع الاستضافة.',d1:'اسم ربط قاعدة D1 في بيئة الاستضافة.',r2:'اسم ربط مخزن كائنات R2 في بيئة الاستضافة.'};
    if(Object.hasOwn(m,key))return m[key];
  }
  if(file==='.vscode/tasks.json'){
    const m={version:'إصدار مخطط ملف المهام الذي يقرأه VS Code.',label:'اسم المهمة الظاهر في قائمة تشغيل المهام.',group:'المجموعة التي يصنف فيها المحرر هذه المهمة.'};
    if(Object.hasOwn(m,key))return m[key]+' القيمة «'+text+'».';
  }
  if(file==='docs/code-atlas/guide.json'&&key==='note')return 'ملاحظة تفسيرية في جولة «'+(root[keys[0]]?.title||keys[0])+'» توجه القارئ عند تتبع مسار الميزة.';
  if(file==='docs/code-atlas/paragraphs.json')return 'يظهر هذا الشرح العربي للفقرة المطابقة في '+keys[0]+' عندما تتطابق عبارة المصدر مع المفتاح المحفوظ.';
  return '';
}
