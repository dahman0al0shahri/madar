// One owner-tools registry for the global account AND the existing Office account.
// Every destination must independently enforce owner authorization on the server.
window.MadarAccountTools=Object.freeze([
 ['/admin/members','سجل الحسابات','الحسابات ورموز مدار'],
 ['/admin/alerts','تنبيهات الأعطال','الحفظ والخدمات والمصادر'],
 ['/admin/insights','ملخص الاستخدام','النشاط عبر أقسام مدار'],
 ['/admin/feedback','الملاحظات والبلاغات','اقتراحات الطلاب ومشكلات المحتوى'],
 ['/admin/quality','جودة الأسئلة','مراجعة بنوك الأسئلة المدعومة'],
 ['/admin/content','إدارة المحتوى','تحرير المحتوى في المحرر المتاح'],
 ['/#admin','المقررات والمستجدات','الظهور والصلاحيات وأخبار التحديثات'],
 ['/admin/campaigns','روابط الترويج','روابط التعريف بمدار'],
 ['/admin','سجل النشاط','السجل العام للحسابات والضيوف']
].map(Object.freeze));
