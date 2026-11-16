import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const content=path.join(root,'lib/content-base.json');
const data=JSON.parse(fs.readFileSync(content,'utf8'));
if(data.lessons.some(l=>l.id==='v49'))throw Error('Alt text already present; do not duplicate');
if(data.bankVersion!=='word-20261021-units-1-10'||data.questions.length!==152)throw Error('Unexpected source bank');
const archive=path.join(root,'lib/word-bank-v81.json');
if(!fs.existsSync(archive))fs.copyFileSync(content,archive);
const prior=JSON.parse(fs.readFileSync(archive,'utf8'));
if(JSON.stringify(prior)!==JSON.stringify(data))throw Error('Prior bank differs');
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const section=(title,kind,text)=>({title,kind,text,html:text.split('\n').map(x=>'<p>'+esc(x)+'</p>').join('')});
const steps=[
'للصورة في الواجهة المشروحة: انقر بزر الفأرة الأيمن على الصورة، ثم Format Picture — تنسيق الصورة.',
'اختر Layout & Properties — تخطيط وخصائص، ثم وسّع Alt Text — نصوص بديلة.',
'اكتب المعنى الذي تنقله الصورة في Description — الوصف، وأضف Title — عنوانًا مختصرًا عند الحاجة، ثم أغلق الجزء.',
'للجدول: انقر بزر الفأرة الأيمن عليه، ثم Table Properties — خصائص الجدول.',
'افتح تبويب Alt Text — نص بديل، واكتب الوصف والعنوان المناسب عند الحاجة، ثم OK — موافق.',
'احفظ المستند بعد التعديل. في بعض الإصدارات الحديثة يظهر أمر Edit Alt Text أو View Alt Text — تحرير النص البديل أو عرضه — مباشرة في قائمة الصورة.'
];
const difference='الوصف يشرح المعلومات المقصودة؛ العنوان ملخص قصير اختياري عند وجود وصف مطوّل، وليس شرطًا دائمًا لتعبئة الخانتين. قد تظهر خانة وصف واحدة للصورة في الواجهات الحديثة. النص البديل ليس اسم ملف الصورة ولا تعليقًا مرئيًا أسفلها؛ اختر وصفًا ذا معنى بدل الاكتفاء بكلمة «صورة».';
const example='مثال تدريبي: صورة رسم تقارن عدد الطلبات خلال ثلاثة أشهر. وصف مفيد: «ارتفع عدد الطلبات من 20 في يناير إلى 35 في فبراير ثم 50 في مارس». إذا ظهرت خانة العنوان، يمكن كتابة «الطلبات الشهرية». الأرقام مثال تعليمي، وليست بيانات مستند المستخدم.';
const lesson={id:'v49',number:11,sourceNumber:6,unit:2,title:'استخدام النصوص البديلة',sections:[
section('الفكرة','concept','Alt Text — النص البديل — وصف مكتوب يوضح معنى الصورة أو الكائن في سياق المستند. يستفيد منه Screen Reader — قارئ الشاشة — وهو برنامج ينطق المعلومات للمستخدم الذي لا يرى المحتوى المرئي. هذا الدرس يتناول الصور والجداول في Word.'),
section('متى أستخدمها؟','concept','عند إعداد تقرير يحتوي صورة أو جدولًا يحمل معلومات مهمة، أضف وصفًا يوضح الغرض والمعلومة للقارئ. لا تكتفِ بذكر نوع العنصر أو اسم ملفه؛ اجعل الوصف مناسبًا لما يشرحه المستند.'),
section('خطوات التنفيذ','steps',steps.join('\n')),
section('انتبه للفرق','concept',difference),
section('مثال تطبيقي','example',example),
section('ملخص للحفظ','summary','للصورة في واجهة الدرس: تنسيق الصورة ← تخطيط وخصائص ← نصوص بديلة.\nللجدول: خصائص الجدول ← نص بديل ← موافق.\nالوصف ينقل المعنى، والعنوان المختصر يضاف عند الحاجة. قد يختلف مسار الصورة حسب إصدار Word.')
],example,difference:[difference],steps,video:'https://www.youtube.com/watch?v=JFb1_1AZuec',references:[
'https://support.microsoft.com/en-us/accessibility/office-accessibility/add-alternative-text-to-a-shape-picture-chart-smartart-graphic-or-other-object',
'https://support.microsoft.com/en-us/office/graphics-visuals/format-object-alt-text',
'https://learn.microsoft.com/en-us/office/vba/api/word.table.title'
],provenance:'secondary',locator:'قائمة Word الوحدة 2، الدرس 6؛ النص المرسل في 21 أكتوبر 2026',source_limit:'مبني على النص المرسل ومراجعة وثائق Microsoft. لم يُشاهد الفيديو ولم تطابق توقيتاته. مسار تنسيق الصورة هنا للواجهة المشروحة، وقد تختلف واجهة الإصدار الحديث.'};
const items=[
['تستخدم واجهة Word المشروحة في الدرس، وتريد وصف صورة لقارئ الشاشة. بعد فتح «تنسيق الصورة»، أي مسار تختار؟',
['تخطيط وخصائص ← نصوص بديلة','حجم واقتصاص ← اقتصاص الصورة','تأثيرات ← ظل','تعبئة وخط ← حدود الصورة'],0,
['هذا هو مسار النص البديل للصورة في الواجهة المشروحة.','الاقتصاص يغير الجزء الظاهر من الصورة ولا يكتب وصفها البديل.','الظل تأثير بصري وليس وصفًا لقارئ الشاشة.','الحدود تتحكم في مظهر الإطار ولا تضيف النص البديل.']],
['أردت إضافة نص بديل إلى جدول موجود في المستند. أي إجراء يفتح موضع العنوان والوصف؟',
['النقر على الصورة ثم اختيار تنسيق الصورة','النقر داخل الجدول ثم تغيير نمط حدوده','النقر بزر الفأرة الأيمن على الجدول ← خصائص الجدول ← نص بديل','تحديد الجدول ثم إدراج تسمية توضيحية'],2,
['تنسيق الصورة يخص الصورة المحددة وليس خصائص الجدول.','نمط الحدود يغير شكل الجدول ولا يفتح النص البديل.','تبويب النص البديل ضمن خصائص الجدول يتيح كتابة عنوانه ووصفه.','التسمية التوضيحية نص ظاهر، وهي غير تبويب النص البديل في خصائص الجدول.']],
['وجدت خانتي «العنوان» و«الوصف» أثناء إضافة نص بديل لصورة. ما التصرف الأنسب لنقل معناها؟',
['كتابة اسم ملف الصورة في الخانتين دائمًا','كتابة وصف للمعلومة وإضافة عنوان مختصر عند الحاجة','ترك الوصف فارغًا لأن العنوان يغني عنه دائمًا','كتابة «صورة» فقط مهما كان محتواها'],1,
['اسم الملف قد لا يشرح المعلومة المقصودة، ولا يلزم تكراره في الخانتين.','الوصف ينقل المعلومة، ويكون العنوان ملخصًا اختياريًا عند الحاجة إلى وصف مطول.','العنوان المختصر لا يحل دائمًا محل الوصف الذي ينقل معنى العنصر.','كلمة صورة وحدها لا توضح محتواها أو دورها في المستند.']]
];
const questions=items.map(([prompt,options,answer,rationales],i)=>({id:'mcq26-'+(153+i),lesson:lesson.id,unit:2,type:'mcq',trial:true,prompt,options,answer,explanation:rationales[answer],rationales,source:{lesson:lesson.id,section:'خطوات التنفيذ وانتبه للفرق',excerpt:steps.join('\n')+'\n'+difference,video:lesson.video,basis:'user_supplied_summary_and_editorial_review',verification:'source_text_and_relevant_microsoft_documentation_not_video_viewing'}}));
data.lessons.splice(data.lessons.findIndex(l=>l.id==='v11'),0,lesson);
data.lessons.forEach((l,i)=>{l.number=i+1});
data.questions.push(...questions);
data.bankVersion='word-20261021-alt-text';data.version='word-units-1-10-alt-text-20261021';data.fullBankCount=data.questions.length;
fs.writeFileSync(content,JSON.stringify(data,null,2)+'\n');
fs.writeFileSync(path.join(root,'public/word-bank-v81-signatures.mjs'),'export default '+JSON.stringify(Object.fromEntries(prior.questions.map(q=>[q.id,JSON.stringify([q.lesson,q.unit,q.prompt,q.options,q.answer])])),null,2)+';\n');
console.log(JSON.stringify({lessons:data.lessons.length,questions:data.questions.length,addedLesson:lesson.id,addedQuestions:questions.map(q=>q.id)}));
