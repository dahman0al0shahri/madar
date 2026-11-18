const courses={
    os1:{name:'نظم التشغيل 1',color:'#91c8ff',description:'Windows Server · التثبيت، Server Core، وإدارة المجال.',tags:['Windows Server','Server Core','AD DS'],sections:[['home','رئيسية المقرر'],['lessons','الجزء العملي'],['practice','طبّق وتحقّق'],['reference','الملاحظات والمصادر']]},
    office:{name:'تطبيقات الحاسب المتقدمة',color:'#8fbfff',description:'من المستندات والجداول إلى قواعد البيانات؛ شرح وتطبيق ومراجعة في Word وExcel وAccess.',tags:['Word','Excel','Access'],sections:[['home','رئيسية المقرر'],['word','Word'],['excel','Excel'],['access','Access'],['quiz','اختبر نفسك'],['reference','المرجع']]},
    network:{name:'التوجيه والتحويل ١',color:'#efb472',description:'افهم الشبكة من اتصال أجهزتها إلى إعدادها؛ دروس وتطبيق عملي في VLAN وInter-VLAN.',tags:['VLAN','Inter-VLAN','تطبيق عملي'],sections:[['home','رئيسية المقرر'],['theory','الجزء النظري'],['lessons','الجزء العملي'],['hints','سجل التلميحات'],['quiz','تمارين وتقييم'],['reference','المرجع']]}
  };
/* hub:preview-catalog:start */
  const lessons=[
    {id:'word-compare',course:'office',section:'word',title:'مقارنة المستندات ودمجها',kind:'درس',intro:'تعرّف الفروق بين نسختين من المستند، ثم راجع التغييرات قبل دمجها.',steps:['التعرّف على نسخ المستند','مقارنة التغييرات','مراجعة النتيجة']},
    {id:'excel-functions',course:'office',section:'excel',title:'استخدام الدالتين Average وCountIF',kind:'درس',intro:'تعرّف حساب المتوسط وعدّ الخلايا التي تحقق شرطًا في جدول البيانات.',steps:['قراءة بيانات الجدول','اختيار الدالة المناسبة','مراجعة النتيجة']},
    {id:'access-fields',course:'office',section:'access',title:'خصائص الحقول',kind:'تدريب',intro:'تعرّف أثر خصائص الحقل في البيانات التي يمكن إدخالها.',steps:['تحديد الحقل','إعداد قاعدة التحقق','فحص البيانات']},
    {id:'net-vlan',course:'network',section:'practical',title:'إعداد VLAN على Switch',kind:'مختبر',intro:'VLAN شبكة محلية افتراضية تفصل الأجهزة منطقيًا. جهّز مجموعات الشبكة واربط المنافذ بالمجموعة المطلوبة.',steps:['قراءة متطلبات الشبكة','إنشاء VLAN','التحقق باستخدام Show']},
    {id:'net-trunk',course:'network',section:'practical',title:'إعداد Trunk',kind:'مختبر',intro:'Trunk وصلة تسمح بمرور أكثر من VLAN بين أجهزة الشبكة.',steps:['تحديد الوصلة','إعداد المنافذ','التحقق من الإعداد']},
    {id:'net-inter',course:'network',section:'practical',title:'التطبيق العملي لـ Inter-VLAN',kind:'مختبر',intro:'Inter-VLAN هو الاتصال بين الشبكات المحلية الافتراضية باستخدام Router أو جهاز يدعم التوجيه.',steps:['قراءة متطلبات الاتصال','إعداد واجهات Router','التحقق من الوصول']}
  ];
    /* hub:preview-catalog:end */
