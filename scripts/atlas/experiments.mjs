import assert from 'node:assert/strict';

const bootstrap = 'lib/hub-bootstrap.mjs';
const day = '2026-11-18';
const visible = (module, range) => module.updateVisible({ status:'published', target:'global', ...range }, [], new Set(), day);

// Each experiment changes one named expression in an in-memory copy of one pure module.
// Baseline and counterfactual expectations are separate so a stale explanation fails the build.
const cases = [
  ['update.start <= day','update.start < day', m => visible(m,{start:day}),true,false,'يشمل أول يوم من العرض. عندما استُخدمت مقارنة صارمة اختفى الإعلان في يوم بدايته.'],
  ['update.end >= day','update.end > day', m => visible(m,{end:day}),true,false,'يشمل آخر يوم من العرض. المقارنة الصارمة أخفت الإعلان قبل نهاية يومه المحدد.'],
  ['if (!snapshot) return null','if (!snapshot) return {}', m => m.summarizeReview(null),null,{},'يسمح للبوابة بتمييز غياب سجل المراجعة عن نتيجة مراجعة محفوظة. تغيير القيمة استبدل null بكائن فارغ.'],
  ['item.mistakes > 0','item.mistakes >= 0',m=>m.summarizeReview({meta:{a:{mistakes:0},b:{mistakes:3}}}).wrong,1,2,'يعدّ العناصر التي وقع فيها خطأ واحد على الأقل. إدخال الصفر عدّ العنصر الصحيح ضمن الأخطاء.'],
  ['filter(item => item.marked)','filter(item => !item.marked)',m=>m.summarizeReview({meta:{a:{marked:true},b:{marked:true},c:{marked:false}}}).marked,2,1,'يجمع العناصر المعلّمة للمراجعة. عكس الشرط جعل العدّاد يعرض عدد العناصر غير المعلّمة.'],
  ['filter(item => item.graded)','filter(item => !item.graded)',m=>m.summarizeReview({study:{a:{graded:true},b:{graded:true},c:{graded:false}}}).answered,2,1,'يحسب عناصر الدراسة التي جرى تقييمها. عكس الشرط نقل العدّ إلى العناصر غير المقيّمة.'],
  ['subject.toLowerCase()','subject',m=>m.hubLesson({subject:'Word'}).section,'word','Word','يوحّد معرف القسم مع وجهة التنقل الصغيرة الحروف؛ درس Word أصبح يُرجع Word بدل word عند إزالة التحويل.'],
  ['Boolean(lesson.practice)','lesson.practice',m=>m.hubLesson({subject:'Network',practice:1}).practice,true,1,'يوحّد نوع حقل التدريب في الاستجابة؛ دخل الاختبار بالعدد 1 وأعادت البوابة القيمة المنطقية true.'],
  ["lesson.summary || ''","lesson.summary || null",m=>m.hubLesson({subject:'Word'}).intro,'',null,'يُبقي المقدمة نصًا عند غياب الملخص كي يتلقى المستهلك نفس نوع القيمة.'],
  ["lesson.steps || ['الشرح والتطبيق والمراجعة']","lesson.steps || []",m=>m.hubLesson({subject:'Word'}).steps,['الشرح والتطبيق والمراجعة'],[],'يوفر خطوة افتراضية للدرس القديم الذي يفتقد قائمة الخطوات. تجربة إزالتها أعادت قائمة فارغة.']
];

export async function runExperiments(source) {

  const load=code=>import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));

  const results=[];
  const groups = [
    [bootstrap,cases],
    ['public/hub/search.mjs', [
      [".replace(/ـ/g, '')", '', m=>m.searchText('مـدار'),'مدار','مـدار','يوحّد الكلمة المكتوبة بالتطويل مع الكلمة العادية عند البحث.'],
      [".replace(/ى/g, 'ي')", '', m=>m.searchText('على'),'علي','على','يوحّد الألف المقصورة والياء في مفتاح البحث.'],
      ["(aliases[id] || '')",'aliases[id]',m=>m.findSearchResults({query:'undefined',scope:'all',courses:{os1:{name:'OS'}},lessons:[],available:()=>['os1'],canLesson:()=>true,hosted:true}).length,0,1,'يحافظ المقرر بلا اسم بديل على نتائج بحث صحيحة؛ ظهرت نتيجة وهمية عند إدخال القيمة المفقودة في النص.']
    ]],
    ['public/hub/navigation.mjs',[
      ["route || 'home'","route || ''",m=>m.routeFromHash('#'),'home','','يوجه الرابط الفارغ إلى الرئيسية عند بدء البوابة.'],
      ["routeAliases.get(route)","undefined",m=>m.routeFromHash('#my-space'),'account','my-space','يتيح فتح الحساب عبر رابط my-space المحفوظ.'],
      ["hashAliases.get(route)","undefined",m=>m.hashForRoute('home'),'#madar','#home','يحافظ على عنوان الرئيسية الخارجي عند توليد رابط من اسم المسار الداخلي.']
    ]]
  ];
  for(const [file,experiments] of groups){
    const text=source(file),baseline=await load(text);
    for(const [expression,replacement,probe,expected,alternative,reason] of experiments){
    assert.equal(text.split(expression).length,2,'Experiment anchor: '+expression);
    const changed=await load(text.replace(expression,replacement));
    const actual=probe(baseline), observed=probe(changed);
    assert.deepEqual(actual,expected,expression);
    assert.deepEqual(observed,alternative,replacement);
    assert.notDeepEqual(actual,observed,expression);
    results.push({file,line:text.slice(0,text.indexOf(expression)).split('\n').length,expression,replacement,actual,observed,reason});
  }
  }
  return results;
}
