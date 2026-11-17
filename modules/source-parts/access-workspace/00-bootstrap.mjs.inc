import tasks from './access-lab-tasks.mjs';
import {LAB_VERSION,TYPES,clone,initial,reduce,grade,visibleRows,validLabState} from './access-lab-engine.mjs';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ar=n=>Number(n).toLocaleString('ar-SA');
const menus={
 'ملف':[['newDB','جديد'],['saveAs','حفظ باسم'],['backup','نسخ احتياطي'],['restore','استعادة النسخة'],['encrypt','تشفير بكلمة مرور'],['print','طباعة ومعاينة']],
 'الصفحة الرئيسية':[['viewData','ورقة البيانات'],['viewDesign','طريقة عرض التصميم'],['addRecord','سجل جديد'],['deleteRecord','حذف سجل'],['find','بحث'],['asc','تصاعدي'],['desc','تنازلي'],['filter','تصفية'],['clearFilter','إزالة التصفية']],
 'إنشاء':[['newTable','جدول'],['designTable','تصميم جدول'],['addField','إضافة حقل'],['form','أجزاء التطبيق / نموذج'],['queryNew','تصميم الاستعلام'],['wizard','معالج الاستعلامات']],
 'بيانات خارجية':[['importExcel','Excel'],['importAccess','Access'],['importText','ملف نصي'],['spec','خيارات متقدمة للنص'],['relink','إدارة الجداول المرتبطة'],['export','تصدير']],
 'أدوات قاعدة البيانات':[['relation','العلاقات'],['compact','ضغط وإصلاح'],['split','تقسيم القاعدة']],
 'تصميم الجدول':[['primary','مفتاح أساسي'],['addField','إضافة حقل'],['deleteField','حذف الحقل'],['description','خصائص الجدول']],
 'حقول الجدول':[['hide','إخفاء الحقول'],['unhide','إظهار الحقول'],['freeze','تجميد الحقول'],['unfreeze','إلغاء التجميد']],
 'تصميم الاستعلام':[['querySave','حفظ الاستعلام'],['queryDelete','حذف الاستعلام'],['queryType','نوع الاستعلام'],['run','تشغيل Run']]
};
export 