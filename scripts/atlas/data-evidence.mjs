// Compare a physical line deletion inside the smallest unchanged enclosing JSON container.
import {contextField} from './context-fields.mjs';
const pointer = keys => keys.length ? '/'+keys.map(k=>String(k).replaceAll('~','~0').replaceAll('/','~1')).join('/') : '(الجذر)';
const brief = value => JSON.stringify(value)?.slice(0,95) ?? 'غير موجود';

export function changed(before,after,keys) {
  if(Array.isArray(before) && Array.isArray(after)){
    if(before.length!==after.length){
      let i=0;
      while(i<Math.min(before.length,after.length) && JSON.stringify(before[i])===JSON.stringify(after[i]))i++;
      return 'تغيّر عدد العناصر عند '+pointer(keys)+' من '+before.length+' إلى '+after.length+'؛ أول موضع مختلف في المقارنة '+(i+1)+'.';
    }
  }
  if(before && after && typeof before==='object' && typeof after==='object'){
    const removed=Object.keys(before).filter(k=>!Object.hasOwn(after,k));
    const added=Object.keys(after).filter(k=>!Object.hasOwn(before,k));
    if(removed.length||added.length)return 'تغيّرت الحقول عند '+pointer(keys)+'. '+(removed.length?'الحقول المحذوفة: '+removed.join('، ')+'. ':'')+(added.length?'الحقول المضافة: '+added.join('، ')+'.':'');
    for(const key of Object.keys(before)){
      if(JSON.stringify(before[key])!==JSON.stringify(after[key]))return changed(before[key],after[key],[...keys,key]);
    }
  }
  if(JSON.stringify(before)===JSON.stringify(after))return 'بقيت البيانات المقروءة مطابقة بعد حذف السطر.';
  return 'تغيّرت القيمة عند '+pointer(keys)+' من '+brief(before)+' إلى '+brief(after)+'.';
}

export function jsonRemoval(content,root,fields,stack,start,end){
  let left=0,right=content.length,original=root,keys=[];
  for(const id of stack){
    const [,stop,,key,open]=fields[id];
    const ch=content[open];
    if(open>=start || stop<=end || (ch!=='{' && ch!=='['))break;
    left=open;right=stop;
    if(fields[id][2]>=0){keys.push(key);original=original[key];}
  }
  const modified=content.slice(left,start)+content.slice(end,right);
  try{
    const result=JSON.parse(modified.replace(/^\uFEFF/,''));
    return 'عند حذف هذا السطر تجريبيًا: '+changed(original,result,keys);
  }catch(error){
    return 'بعد حذف السطر تعذّرت قراءة JSON عند '+pointer(keys)+'. أبلغ المحلل: '+error.message.split(/ at position | at line /)[0].slice(0,105)+'.';
  }
}

const simulator={
  host:['يعيّن جهاز بدء التجربة وأول جهاز معروض ضمن الأجهزة المتاحة.','modules/madar-hub/os-curriculum-model.js','s.name=t.host'],
  hint:['يعطي المتدرّب إرشادًا عند طلب التلميح. يأخذ العرض النص الآخر عند اختيار كشف الخطوة.','modules/madar-hub/os-practice.js','t.reveal:t.hint'],
  reveal:['يُعرض عند اختيار كشف الخطوة كاملة؛ وتستخدم واجهة المساعدة حقل التلميح في حالة الإرشاد.','modules/madar-hub/os-practice.js','t.reveal:t.hint'],
};
const terms={
  unitNames:'يحدد أسماء الوحدات بحسب ترتيب المقرر.',bankVersion:'يميز نسخة بنك المحتوى الذي تجري مراجعته.',sourceModule:'يربط العنصر بالوحدة المصدرية التي نُقل عنها.',
  subject:'يعيّن المقرر المرتبط بالسجل.',headers:'يسمّي الأعمدة حتى يمكن تفسير قيم الصفوف بحسب ترتيبها.',rows:'يحفظ صفوف الجدول بالترتيب الذي يقابله ترتيب الأعمدة.',table:'يربط هذا القسم ببيانات جدوله.',slides:'يربط المادة برقم الشريحة أو مجموعة الشرائح المستند إليها.',parts:'يحدد أجزاء العنصر وترتيب جمعها.',offset:'يحدد نقطة البداية داخل المورد.',size:'يسجل حجم الجزء بالوحدة المعتمدة في ملفه.',command:'يحفظ الأمر المرافق لهذه الخطوة.',chapter:'يربط المادة بالفصل المقابل.',terms:'يجمع المصطلحات التي تفسّرها المادة.',range:'يحدّد مجال القيم أو المواقع التي تنطبق عليها الخطوة.',prerequisites:'يحدد ما تحتاجه الخطوة قبل تنفيذها.',purpose:'يصرح بالغرض المسجل لهذا العنصر.',output:'يصف الناتج المرتبط بالعملية.',outputs:'يسجل النواتج التي تتابعها مرحلة البناء.',explain:'يفسر سبب الإجابة أو النتيجة في سياق السؤال.',subtitle:'يوفر العنوان التوضيحي المصاحب للعنوان الرئيسي.',actions:'يرتب الخطوات التي يتطلبها التمرين.',ou:'يعيّن الوحدة التنظيمية التي يتناولها تمرين الدليل.',account:'يسمّي الحساب الوارد في بيانات التدريب.',actor:'يعيّن هوية المنفذ في المحاكاة.',takeaway:'يسجل الخلاصة التي يرجع إليها القارئ بعد الشرح.',skill:'يربط الحالة بالمهارة المستهدفة.',sourceFile:'يحدد الملف الذي يُرجع إليه للتحقق من المادة.',reference:'يحفظ الإحالة المرجعية المرتبطة بهذه المعلومة.',sourceNote:'يبيّن قيدًا أو ملاحظة عن المصدر.',entity:'يحدد الكيان المنطقي الذي تتناوله العملية.',role:'يسجل الدور المرتبط بالعنصر في سياق هذا السجل.',devices:'يجمع الأجهزة المعنية بهذه الحالة.',sources:'يجمع أصول المادة التي يمكن الرجوع إليها.',operation:'يعيّن العملية المطلوبة في النشاط.',scene:'يربط المحتوى بمشهد محدد.',question:'يوفر السؤال الذي يُعرض لهذا الموقف.'
};

function questionMeaning(record,key,index){
  if(!Array.isArray(record?.options) || !Number.isInteger(record.answer) || record.answer<0 || record.answer>=record.options.length)return '';
  const label='«'+(record.id||record.title||'السؤال')+'»';
  const selected=record.answer,correct=record.options[selected];
  if(typeof correct!=='string')return '';
  if(key==='options'||key==='rationales'){
    if(index===undefined)return key==='options'?'ترتيب بدائل '+label+' يحدد معنى answer. الفهرس '+selected+' يحيل إلى «'+correct+'».':'يتطابق ترتيب المبررات مع ترتيب بدائل '+label+'؛ المبرر والبديل يتشاركان الفهرس نفسه.';
    const option=record.options[index],why=record.rationales?.[index];
    if(typeof option!=='string')return '';
    return 'البديل '+(index+1)+' في '+label+' هو «'+option+'». '+(index===selected?'هذا هو الجواب المعتمد في السجل.':'يشير مفتاح الإجابة في السجل إلى البديل '+(selected+1)+'.')+(typeof why==='string'?' يورد المصدر لهذا البديل التفسير الآتي: '+why:'');
  }
  if(key==='answer')return 'يبدأ ترقيم مصفوفة البدائل من صفر. القيمة '+selected+' تختار «'+correct+'» في '+label+'.';
  if(key==='prompt'||key==='question')return 'المطلوب المعروض للمتدرب في '+label+'. تربطه البيانات بالجواب «'+correct+'»'+(typeof record.explanation==='string'?' وتفسره بقولها: '+record.explanation:'.');
  if(key==='explanation'||key==='explain')return 'يربط هذا التفسير بين المطلوب والجواب «'+correct+'» في '+label+'.';
  return '';
}
function schemaField(keys,value){
  const [,table,group,column,attr]=keys;
  if(keys[0]!=='tables'||!table)return '';
  if(group!=='columns'||!column)return '';
  const target=table+'.'+column;
  if(keys.length===4)return 'يحفظ تعريف العمود '+target+' كما كان في لقطة الترحيل هذه.';
  if(attr==='notNull')return value?'يشترط العمود '+target+' قيمة غير NULL عند كتابة الصف.':'هذا العلم لا يفرض شرط NOT NULL على '+target+'.';
  if(attr==='primaryKey')return value?'يصنّف '+target+' مفتاحًا أساسيًا للجدول في هذه اللقطة.':'لا يعلن تعريف العمود '+target+' مفتاحًا أساسيًا منفردًا بهذا العلم.';
  if(attr==='type')return 'يسجل النوع المعلن للعمود '+target+' وهو '+value+' في مخطط SQLite.';
  if(attr==='name')return 'يربط مفتاح اللقطة '+column+' بالاسم الفعلي '+value+' في الجدول '+table+'.';
  if(attr==='autoincrement')return 'يضبط خيار AUTOINCREMENT للعمود '+target+' على '+String(value)+'.';
  return '';
}
export function dataMeaning(file,keys,value,root){
  if(file.startsWith('drizzle/meta/')){
    const schema=schemaField(keys,value);
    if(schema)return schema;
  }
  if(file.startsWith('lib/')){
    const index=typeof keys.at(-1)==='number'?keys.at(-1):undefined;
    const keyAt=keys.length-(index===undefined?1:2), field=keys[keyAt];
    if(['options','rationales','prompt','answer','explanation','question','explain'].includes(field)){
      const record=keys.slice(0,keyAt).reduce((v,k)=>v?.[k],root);
      const result=questionMeaning(record,field,index);
      if(result)return result;
    }
  }
  const key=keys.filter(k=>typeof k==='string').at(-1);
  if(file==='lib/os-simulator-curriculum.json' && Object.hasOwn(simulator,key))return simulator[key][0];
  if(file==='.madar-repository.json'){
    const guard={project:'يميز المشروع باسم MADAR عند مطابقة هوية النسخة.',projectId:'يثبت هوية مشروع مدار قبل نقل الملفات إلى نسخة الرفع.',repository:'يضبط اسم المالك والمستودع الذي تقبل أداة الرفع مخاطبته.',repositoryId:'تستخدم الحماية المعرّف الرقمي الثابت للتحقق من وجهة الرفع حتى لو تغير اسم المستودع.',ownerId:'تتحقق أداة النشر من المعرّف الرقمي لمالك المستودع.',remote:'يجب أن يطابق عنوان Git المعتمد قبل السماح بالرفع.',defaultBranch:'يعين الفرع الذي يستهدفه طلب المراجعة.',visibility:'تقارن أداة النشر الإتاحة المعتمدة بالحالة التي يعيدها GitHub.',pullRequestCreationPolicy:'تتحقق أداة النشر من سياسة فتح طلبات المراجعة لهذا المستودع.'};
    if(Object.hasOwn(guard,key))return guard[key];
  }
  if(file==='lib/os-simulator-curriculum.json' && keys.includes('actions') && keys.includes('values'))return 'تدخل هذه القيمة في بيانات الخطوة المرجعية. عند فحص العملية يقارن المحاكي مدخلات المحاولة بالقيم المسجلة في actions[].values.';
  if(file==='package.json' && keys[0]==='scripts' && typeof value==='string')return 'عند تشغيل npm run '+keys[1]+' من جذر المشروع تبدأ سلسلة الأوامر '+value+'.';
  if(file.endsWith('project-map.json') && keys[0]==='sourceAssemblies' && keys.includes('parts')){
    const assembly=root.sourceAssemblies[keys[1]];
    return 'يُقرأ هذا الجزء حسب ترتيبه ثم يُضم إلى '+assembly.output+'؛ يحدد ترتيبه الموضع النهائي للشيفرة.';
  }
  if(file==='lib/os-media-manifest.json' && (key==='offset'||key==='size'))return key==='offset'?'إزاحة بداية الجزء بالبايت داخل الملف المجزأ.':'عدد بايتات هذا الجزء عند تجميع مورد الوسائط.';
  if(file==='package-lock.json' && keys[0]==='packages' && keys.length===2)return 'يسجل وصف الحزمة المثبتة في '+(keys[1]||'جذر المشروع')+' وتُقرأ تحته نسخة الحزمة ومتطلباتها المتاحة.';
  if(file==='tsconfig.json')return 'يدخل هذا الضبط في إعداد فاحص TypeScript للمشروع تحت '+pointer(keys)+'.';
  const specific=contextField(file,keys,value,root);
  if(specific)return specific;
  if(file==='package-lock.json')return '';
  return Object.hasOwn(terms,key)?terms[key]:'';
}

export function dataAnchors(file,files,source){
  if(file!=='lib/os-simulator-curriculum.json')return;
  const anchors={};
  for(const [key,[,path,marker]] of Object.entries(simulator)){
    if(!files[path])throw Error('Missing data consumer '+path);
    const lines=source(path).split('\n');
    const index=lines.findIndex(s=>s.includes(marker));
    if(index<0)throw Error('Missing data consumer expression '+marker);
    anchors[key]=[path,index+1];
  }
  return anchors;
}
