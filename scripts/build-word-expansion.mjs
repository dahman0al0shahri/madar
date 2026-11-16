import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {lessons,units,refs} from './word-expansion-data.mjs';
import {questions} from './word-expansion-questions.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const project=path.resolve(root,'../../../../../..');
const originalPath=path.join(root,'lib/word-bank-v55.json');
if(!fs.existsSync(originalPath))fs.copyFileSync(path.join(root,'lib/content-base.json'),originalPath);
const base=JSON.parse(fs.readFileSync(originalPath,'utf8'));
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function clean(text){return text.replace(/\$\\leftarrow\$/g,'←').replace(/\\([*`#.:()&-])/g,'$1').replace(/\\\r?\n/g,'\n').replace(/\*/g,'').replace(/`/g,'').replace(/\[\[?\d\d:\d\d(?::\d\d)?\]?(?:\([^)]*\))?\]/g,'').replace(/^\s*---\s*$/gm,'').replace(/^\s*[\\*]\s*$/gm,'').replace(/واستر خيار/g,'واختر خيار').replace(/أجام/g,'أحجام').replace(/أقام/g,'أرقام').replace(/للن التأكد/g,'للتأكد').replace(/كليئيهما/g,'كليهما').replace(/بسريعة/g,'بسرعة').replace(/الحمايه/g,'الحماية').replace(/الاجزاء السريعه/g,'الأجزاء السريعة').replace(/تتحدث تلقائيًا/g,'يمكن تحديثها').replace(/تتحدث/g,'تتحدّث');}
function edit(s,u,p){
 if(u===6&&p===2)s=s.replace('لجعل العنوان الفرعي عنوانًا رئيسيًا','لرفع العنوان مستوى واحدًا في التسلسل الهرمي');
 if(u===6&&p===4)s=s.replace('يلزم النقر فوقه بالتزامن مع الضغط على مفتاح Ctrl','يستخدم عادة Ctrl مع النقر، وفق إعدادات Word');
 if(u===6&&p===5)s=s.replace('ليتم تحديث الأنماط في جميع المستندات المرتبطة','لاستخدام التعديل في المستندات الجديدة المبنية على القالب');
 if(u===7&&p===4)s=s.replace(/\*?\s*\(اختياري\)[^\n]+/g,'').replace('يشترط الأساس لنجاح','من الطرق الشائعة لنجاح');
 if(u===8&&p===1)s=s.replace('تمنع المستخدم من العبث بتنسيق النموذج الأصلي','تساعد على تنظيم تعبئة النموذج؛ أما تقييد تعديل التصميم فيحتاج إعداد الحماية');
 if(u===8&&p===2)s=s.replace('للخروج منه وحفظ التعديلات','للخروج منه، ثم احفظ ملف النموذج');
 if(u===9&&p===1)s=s.replace(/والتي يتم تحديثها تلقائيًا عند تغير البيانات المرتبطة بها/g,'ويمكن تحديث نتائجها بحسب نوع الحقل وإعداداته').replace('دون الحاجة لتحديثها يدويًا','مع مراعاة أن بعض الحقول تحتاج أمر تحديث').replace('مثل حالة الأسطر أو تنسيق الأحرف','مثل تنسيق الأحرف');
 if(u===9&&p===5)s=s.replace(/إزالة السجلات المكررة/g,'استبعاد السجلات المكررة من الدمج').replace(/إزالة أي تكرارات/g,'استبعاد التكرارات غير المرغوبة').replace('لحذف الأسماء المكررة:','لاستبعاد سجلات مكررة من الدمج:');
 if(u===9&&p===6)s=s.replace('مطابق الحقول','مطابقة الحقول');
 if(u===9&&p===7)s=s.replace('自动化 مذهلة','أتمتة لتخصيص النصوص').replace(/والا/g,'وإلا');
 if(u===9&&p===8)s=s.replace(/لاكتشاف أي بيانات ناقصة ومعالجتها مبكرًا/g,'للمساعدة في كشف أخطاء الدمج مبكرًا').replace(/للتأكد من عدم وجود بيانات ناقصة في القائمة/g,'لفحص أخطاء الدمج، مع مراجعة البيانات يدويًا').replace(/يقوم برنامج وورد بالتحقق التلقائي من المشكلات مثل وجود معلومات ناقصة في قائمة المستلمين/g,'يجري Word الفحص وفق الخيار المحدد؛ راجع البيانات والمعاينة أيضًا، فالفحص لا يضمن اكتشاف كل قيمة ناقصة أو غير صحيحة');
 if(u===10&&p===1)s=s.replace('المخزنة في المستند أو القوالب','المخزنة في القوالب');
 if(u===10&&p===2)s=s.replace('معرض الأجزاء السريعة أو النماذج','معرض الأجزاء السريعة أو مربعات النص');
 return s;
}
const newLessons=lessons.map(([unit,pos,file,title,video,key,note],i)=>{
 const sourcePath=path.join(project,`docs/sources/OFFICE-WORD${String(unit).padStart(2,'0')}-20261021`,file);
 const raw=clean(fs.readFileSync(sourcePath,'utf8'));
 const chunks=[...raw.matchAll(/^###\s+(\d)\.\s*([^\n]+)\n([\s\S]*?)(?=^###\s+\d\.|$(?![\s\S]))/gm)];
 if(chunks.length!==7)throw Error(`Expected seven source sections: ${file}, got ${chunks.length}`);
 const sections=chunks.slice(0,6).map(m=>{
  const n=Number(m[1]);let text=edit(m[3].trim(),unit,pos);
  if(n===4)text=note;
  if(unit===7&&pos===4&&n===5)text='لإظهار فصلين من مستويات العناوين: طبّق أنماط العناوين على النص، ثم افتح مراجع ← جدول المحتويات ← جدول محتويات مخصص، واضبط إظهار المستويات إلى 2 وراجع المعاينة ثم وافق.';
  if(unit===8&&pos===3&&n===5)text='للحفاظ على حقل اسم قابل للتعبئة: حدد العنصر ← المطور ← خصائص ← فعّل «يتعذر حذف عنصر تحكم المحتوى»، واترك «يتعذر تحرير المحتويات» غير محدد، ثم موافق.';
  if(unit===9&&pos===7&&n===5)text='إذا كانت الدرجات أرقامًا: اضبط قاعدة تعرض «مستوفٍ» عندما تكون الدرجة أكبر من أو تساوي 60، وإلا تعرض «غير مستوفٍ». عاين سجلًا درجته 60 وآخر درجته 59 لتختبر الحد والحالتين.';
  if(n===6)text+='\n'+note;
  const lines=text.split(/\r?\n/).map(x=>x.trim()).filter(Boolean).map(x=>x.replace(/^[*\-]\s*/,'').replace(/^\d+\.\s*/,'').replace(/\s+\./g,'.').replace(/ {2,}/g,' '));
  const kind=n===3?'steps':n===5?'example':n===6?'summary':'concept';
  return {title:n===1?'الفكرة':n===2?'متى أستخدمها؟':n===3?'خطوات التنفيذ':n===4?'انتبه للفرق':n===5?'مثال تطبيقي':'ملخص للحفظ',kind,text:lines.join('\n'),html:kind==='steps'?'<ol>'+lines.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol>':lines.map(x=>'<p>'+esc(x)+'</p>').join('')};
 });
 if(sections.some(s=>!s.text||/\*\*|\$|\\|\]\(|自动化|https?:|###/.test(s.text)))throw Error('Unclean source text: '+file);
 return {id:'v'+String(25+i).padStart(2,'0'),number:25+i,sourceNumber:pos,unit,title,sections,example:sections.find(s=>s.kind==='example').text,difference:[note],steps:sections.find(s=>s.kind==='steps').text.split('\n'),video:'https://www.youtube.com/watch?v='+video,references:[refs[key]],provenance:'secondary',locator:`قائمة الوحدة ${unit}، الدرس ${pos}؛ النص المرسل في 21 أكتوبر 2026`,source_limit:'مبني على النص المرسل مع مراجعة وثائق Microsoft؛ لم تُشاهد المادة المرئية ولم تُطابق توقيتاتها. الشرح لبرنامج Word على سطح المكتب، وقد تختلف الواجهة حسب الإصدار.'};
});
if(questions.length!==newLessons.length)throw Error('Question coverage mismatch');
const newQuestions=questions.flatMap((items,i)=>items.map((item,j)=>{
 const lesson=newLessons[i],index=i*3+j,rotation=index%4;
 const pairs=item.slice(1);if(pairs.length!==4)throw Error('Four choices required');
 const ordered=pairs.map((_,k)=>pairs[(k-rotation+4)%4]);
 return {id:'mcq26-'+String(81+index).padStart(3,'0'),lesson:lesson.id,unit:lesson.unit,type:'mcq',trial:true,prompt:item[0],options:ordered.map(x=>x[0]),answer:rotation,explanation:pairs[0][1],rationales:ordered.map(x=>x[1]),source:{lesson:lesson.id,section:'خطوات التنفيذ وانتبه للفرق',excerpt:lesson.steps.join('\n')+'\n'+lesson.difference[0],video:lesson.video,basis:'user_supplied_summary_and_editorial_review',verification:'source_text_and_relevant_microsoft_documentation_not_video_viewing'}};
}));
const result={...base,unitNames:[...base.unitNames,...units],lessons:[...base.lessons,...newLessons],questions:[...base.questions,...newQuestions],version:'word-units-1-10-20261021',bankVersion:'word-20261021-units-1-10',fullBankCount:base.questions.length+newQuestions.length};
fs.writeFileSync(path.join(root,'lib/content-base.json'),JSON.stringify(result,null,2)+'\n');
fs.writeFileSync(path.join(root,'public/word-bank-v55-signatures.mjs'),'export default '+JSON.stringify(Object.fromEntries(base.questions.map(q=>[q.id,JSON.stringify([q.lesson,q.unit,q.prompt,q.options,q.answer])])),null,2)+';\n');
console.log(JSON.stringify({lessons:result.lessons.length,questions:result.questions.length,newLessons:newLessons.length,newQuestions:newQuestions.length,units:result.unitNames.length}));
// Preserve the later unit 2 addition when rebuilding this source collection.
await import('./add-word-alt-text.mjs');
