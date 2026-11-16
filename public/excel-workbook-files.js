/* Shared original workbooks for the sixteen workbook lessons. */
(()=>{'use strict';
const files=[{"name":"تمرين اكسل (1) (2).xlsx","asset":"excel-exercise.xlsx","label":"تنزيل ملف التمرين","url":"/downloads/excel/excel-exercise.xlsx","bytes":18968,"sha256":"60aab1cd086d69a0f0ec9e76f55e2a96df91c6110223107a702636bc45bb87a1"},{"name":"حل تمرين 1.xlsx","asset":"excel-solution.xlsx","label":"تنزيل ملف الحل","url":"/downloads/excel/excel-solution.xlsx","bytes":21351,"sha256":"2fac559b4500ec2359286cee3928a7d749917a53854631b23ac9d4b5b0fc15a5"}];
const isLesson=l=>/^excel-workbook-(0[1-9]|1[0-6])$/.test(l?.id||'');
const number=l=>Number(l.id.slice(-2));
const intro='١٦ تطبيقًا من ملفَي التمرين والحل، منفصلة عن دروس الفيديو في الوحدات ١–١٢.';
function markup(){return '<div class="workbook-files" aria-label="ملفات التمارين الأصلية"><p>ملفان مشتركان لجميع التطبيقات الـ١٦. نزّل التمرين للتطبيق، ثم افتح الحل للمقارنة.</p><div class="bottom-actions">'+files.map((f,i)=>'<a class="button '+(i===0?'primary':'')+'" href="'+f.url+'" download="'+f.name+'">'+f.label+' <small>(XLSX)</small></a>').join('')+'</div><p class="small muted">الملفات الأصلية: تمرين اكسل (1) (2).xlsx · حل تمرين 1.xlsx</p></div>';}
window.MADAR_EXCEL_WORKBOOK={isLesson,number,intro,markup};
})();
