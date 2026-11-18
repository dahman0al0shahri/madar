import path from 'node:path';
import { functionalContext } from './functional-context.mjs';

const sample = text => text.trim().replace(/\s+/g,' ').slice(0,140);
const dataRoles = {
  id:'يربط هذا السجل بمرجعه عند اختيار المقرر أو الدرس أو المورد.', title:'يوفر الاسم المقروء الذي يعرضه المستهلك لهذا السجل.', prompt:'يوفر نص المطلوب الذي يقرأه المتدرّب قبل الإجابة.', choices:'يوفر البدائل التي يعرضها السؤال.', options:'يضبط الخيارات المسجلة لهذا العنصر.', correct:'يحدد الإجابة المعتمدة للمقارنة.', explanation:'يوفر تفسير الإجابة الذي يمكن عرضه عند المراجعة.', rationales:'يربط خيارات الإجابة بمبرراتها التعليمية.', verification:'يسجل طريقة التحقق المصاحبة للمهمة.', trial:'يصف التجربة المرتبطة بهذه الخطوة.', basis:'يسجل أساس الاستدلال الذي يعتمد عليه المحتوى.', steps:'يحفظ خطوات هذا العنصر بترتيبها.', image:'يربط المحتوى بمورد الصورة.', poster:'يوفر صورة معاينة للمورد.', seconds:'يسجل قيمة الزمن بالثواني لهذا العنصر.', source:'يربط السجل بمصدره.', locator:'يحدد موضع المادة داخل المصدر.', sha256:'يوفر بصمة للمقارنة عند التحقق من تطابق المحتوى.', primaryKey:'يحدد ما إذا كان الحقل يميز السجل كمفتاح أساسي.', notNull:'يسجل شرط قبول القيم الخالية في العمود.', autoincrement:'يسجل إعداد توليد قيمة العمود تزايديًا.', lesson:'يربط هذه القيمة بالدرس المحدد.', references:'يحفظ المراجع المرتبطة بهذه القيمة.', summary:'يحفظ النص المختصر المستخدم لتعريف العنصر.', en:'يوفر الصياغة الإنجليزية.', ar:'يوفر الصياغة العربية.', scenes:'يحفظ ترتيب المشاهد المرتبطة بالمحتوى.'
};
Object.assign(dataRoles,{
  text:'يحمل النص الذي يرتبط بهذا الجزء من المحتوى.', html:'يحفظ المحتوى المنسق بعناصر HTML.', kind:'يميز فئة السجل لفرز أنواعه أو اختيار طريقة عرضه.', type:'يحدد نوع القيمة أو السجل في هذا الموضع.', video:'يربط العنصر بمقطع الفيديو المسجل له.', unit:'يربط المادة بوحدتها ضمن المقرر.', name:'يسمي العنصر داخل السجل.', answer:'يحفظ الجواب المرجعي لهذا السؤال.', section:'يربط السجل بقسم المادة.', excerpt:'يحفظ المقتطف الذي يستند إليه العنصر الحالي.', notes:'يحتفظ بالملاحظات المصاحبة لهذا العنصر.', number:'يسجل رقم العنصر بحسب ترقيم المصدر.', sections:'يرتب أقسام المادة داخل السجل.', warnings:'يحفظ التنبيهات المرتبطة بهذه الخطوة.', difference:'يصف الفرق الذي توثقه هذه المقارنة.', columns:'يحدد الأعمدة وترتيبها داخل بنية الجدول.', values:'يحفظ قيم العناصر في هذا الجزء من السجل.', sourceNumber:'يربط العنصر بترقيمه في المصدر.', provenance:'يوثق أصل المادة المرتبطة بهذا السجل.', example:'يوفر مثال التطبيق المرتبط بالمعلومة.', scene:'يحدد المشهد المرتبط بهذا السجل.', source_limit:'يبين حدود ما يغطيه المصدر لهذا المحتوى.', actions:'يرتب الإجراءات المرتبطة بالخطوة.', console:'يسمي أداة التحكم التي تجري فيها خطوة المحاكاة.', op:'يميز العملية الممثلة بهذا السجل.', device:'يعيّن الجهاز المقصود بهذه الخطوة.', sourceScene:'يربط الخطوة بالمشهد الأصلي.', menu:'يحدد القائمة المقصودة في مسار التفاعل.', url:'يسجل عنوان المورد المشار إليه.', indexes:'يسجل فهارس بنية الجدول.', paragraphs:'يرتب فقرات النص.', compositePrimaryKeys:'يسجل الأعمدة التي تميز السجل مجتمعة.', why:'يحفظ مبرر الخطوة الذي يقدمه المحتوى نفسه.', question:'يقدم السؤال المتصل بهذا السجل.'
});
const lockRoles={license:'يوثق الترخيص المعلن للحزمة في سجل التثبيت.',funding:'يحفظ مرجع تمويل ناشر الحزمة.',cpu:'يقيد التثبيت بمعماريات المعالج المدرجة.',os:'يقيد التثبيت بأنظمة التشغيل المدرجة.',peerDependenciesMeta:'يسجل خصائص الاعتماديات المشتركة ومنها الاختيارية.',bin:'يربط اسم أمر التنفيذ بملف الحزمة.',optionalDependencies:'يحدد الحزم الاختيارية عند التثبيت.',hasInstallScript:'ينبه أداة التثبيت إلى وجود سكربت تثبيت لهذه الحزمة.',version:'يثبت إصدار هذه الحزمة لإعادة التثبيت.',integrity:'يحدد بصمة المحتوى للتحقق من سلامة تنزيل الحزمة.',resolved:'يسجل مكان جلب نسخة الحزمة.',dependencies:'يحدد متطلبات الحزمة عند تثبيتها.',engines:'يحدد إصدارات بيئة التشغيل المدعومة.',optional:'يحدد حالة الاعتمادية الاختيارية.',peerDependencies:'يحدد الإصدارات المتوافقة من اعتماديات البيئة المضيفة.',dev:'يميز اعتماديات التطوير في شجرة التثبيت.'};
const cssRoles={display:'طريقة ترتيب الصناديق',position:'مرجع تموضع العنصر',color:'لون النص',background:'خلفية العنصر',opacity:'درجة العتامة',overflow:'سلوك المحتوى عند تجاوز المساحة',transform:'تحويل إحداثيات العرض',gap:'المسافة بين العناصر',width:'عرض العنصر',height:'ارتفاع العنصر','font-family':'ترتيب الخطوط','z-index':'ترتيب التراكب','pointer-events':'استقبال أحداث المؤشر',direction:'اتجاه العرض',animation:'تشغيل الحركة'};
const htmlRoles={button:'ينشئ زرًا يستقبل تفاعل المستخدم',input:'يوفر حقل إدخال',a:'يربط النص أو العنصر بوجهة التنقل',iframe:'يخصص إطارًا لمستند داخلي',script:'يحمل تعليمات المتصفح أو البيانات بحسب نوع الوسم',style:'يجمع قواعد تنسيق المستند',label:'يسمي عنصر الإدخال المرتبط به',section:'يجمع جزءًا من محتوى الصفحة',svg:'يحدد مساحة الرسم المتجهي',path:'يحدد هندسة مسار الرسم',link:'يربط المستند بمورد',meta:'يضبط وصف المستند أو طريقة عرضه',img:'يعرض الصورة المحددة',form:'يجمع حقول الإدخال لإرسالها',select:'يعرض تحكم اختيار قيمة',option:'يعرف قيمة قابلة للاختيار',details:'يجمع محتوى قابلًا للفتح والطي',summary:'يسمي مدخل المحتوى القابل للطي'};
const shellRoles={export:'يمرر المتغير إلى الأوامر الفرعية',exec:'يسلّم التنفيذ إلى البرنامج المذكور',set:'يضبط خيارات تنفيذ الصدفة',exit:'ينهي العملية بالحالة المحددة',return:'يعيد التحكم إلى مستدعي الدالة',source:'يحمّل الملف داخل بيئة الصدفة الحالية',echo:'يكتب الرسالة إلى المخرج',printf:'ينسق الرسالة ويكتبها',mkdir:'يجهز المجلد الذي تحتاجه الخطوات التالية',cd:'يغيّر دليل تنفيذ الخطوات التالية',test:'يفحص شرطًا وتعبّر حالة الخروج عن النتيجة',if:'يختار ما ينفذ وفق نتيجة الأمر',elif:'يختبر فرعًا بديلًا',fi:'يغلق الفرع الشرطي',for:'يكرر العمل على العناصر المذكورة',done:'ينهي جسم الحلقة',case:'يطابق القيمة مع أحد الفروع',esac:'يغلق كتلة المطابقة',trap:'يربط إجراءً بإشارة أو بخروج العملية'};


export function makeLineNotes(file,content,analysis) {
  const name=path.posix.basename(file), ext=path.posix.extname(name.replace(/\.inc$/,'')).slice(1).toLowerCase();
  const lines=content.split('\n'); if(lines.at(-1)==='') lines.pop();
  const script=new Map(analysis.scriptNotes.map(row=>[row[0],row]));
  const fields=analysis.fields||[], stack=[];
  const rootData=fields.length?JSON.parse(content.replace(/^\uFEFF/,'')):null;
  let index=0, pos=0, heading='', rule='', statement='', workflow='', blockComment=false, inStyle=false;
  const records=[];
  for(let i=0;i<lines.length;i++){
    const raw=lines[i],t=raw.trim(),first=pos+Math.max(0,raw.search(/\S/)), scriptRow=script.get(first);
    const finish=(cat,msg)=>records.push([cat,msg]);
    if(!t)finish('structure','يفصل بصريًا بين '+(i && lines[i-1].trim()? '«'+sample(lines[i-1])+'»':'المقطع السابق')+' والمقطع التالي في الملف.');
    else if(ext==='json' && fields.length){
      while(index<fields.length&&fields[index][0]<=first){
        const f=fields[index];while(stack.length && fields[stack.at(-1)][1]<=f[0])stack.pop();
        stack.push(index++);
      }
      while(stack.length && fields[stack.at(-1)][1]<=first)stack.pop();
      const path=stack.map(j=>fields[j][3]).slice(1);
      const pointer=path.length?'/'+path.map(k=>String(k).replaceAll('~','~0').replaceAll('/','~1')).join('/'):'(الجذر)';
      const key=path.filter(k=>typeof k==='string').at(-1);
      const roles=name==='package-lock.json'?lockRoles:dataRoles;
      const roleKey=name==='package-lock.json'?path[2]:key;
      const role=Object.hasOwn(roles,roleKey)?roles[roleKey]:'';
      let record='',value=rootData;
      for(const part of path){
        if(value && typeof value==='object' && !Array.isArray(value)){
          const label=value.title??value.id??value.name;
          if(typeof label==='string'||typeof label==='number')record=String(label).slice(0,96);
        }
        value=value?.[part];
      }
      const shape=Array.isArray(value)?'يرتب '+value.length+' عنصرًا داخل هذه القائمة.':value && typeof value==='object'?'يجمع '+Object.keys(value).length+' حقول في سجل واحد.':typeof value==='boolean'?'يحفظ حالة '+(value?'التفعيل':'التعطيل')+' لهذا الحقل.':value===null?'يسجل غياب القيمة لهذا الحقل.':'يحفظ قيمة '+(key||'العنصر')+' التي تُنقل مع السجل.';
      const mark=t.match(/^[}\]],?$/)?'يغلق قيمة':'يحدد قيمة';
      finish('data',mark+' '+pointer+' في '+name+'. '+(role||shape)+(record?' ضمن «'+record+'».':''));
    } else if(scriptRow)finish('syntax',scriptRow[2]);
    else if(t.startsWith('/*')||t.startsWith('//')||t.startsWith('<!--')||blockComment||t.startsWith('-- ')){
      finish('comment','يوثّق المصدر هنا '+sample(t.replace(/^(?:\/\*+|\/\/|<!--|-- |\*)\s?/,''))+' ضمن '+name+'.');
      if(t.startsWith('/*')||t.startsWith('<!--'))blockComment=true;
      if(t.includes('*/')||t.includes('-->'))blockComment=false;
    } else if(ext==='md'||ext==='txt' && name.includes('README')||/license/i.test(name)){
      const h=t.match(/^#+\s+(.+)/);
      if(h)heading=h[1];
      const links=[...t.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)].map(m=>m[2]);
      finish('document',h?'يفتح قسم «'+heading+'» الذي تنتظم تحته الفقرات التالية.':links.length?'يوجه القارئ من «'+(heading||name)+'» إلى '+links.join('، ')+'.':t.startsWith('|')?'يسجل صف الجدول «'+sample(t.split('|').find(x=>x.trim())||t)+'» في قسم '+(heading||name)+'.':'يحفظ ضمن «'+(heading||name)+'» '+(t.startsWith('```')?'حد كتلة المثال أو الأمر.':'النص المرجعي «'+sample(t)+'».'));
    } else if(ext==='css'||inStyle && !t.includes('</style')||name==='night-review-style.txt'){
      if(t.includes('{'))rule=sample(t.slice(0,t.indexOf('{'))) || rule;
      const prop=/(?:^|[;{])\s*([\w-]+)\s*:\s*([^;}]+)/.exec(t);
      finish('style',prop?'يضبط '+(cssRoles[prop[1]]||'خاصية '+prop[1])+' إلى '+sample(prop[2])+' ضمن '+(rule||name)+'.':t.startsWith('}')?'تنتهي هنا قاعدة '+(rule||name)+'.':'يحدد مجال تطبيق التنسيق '+(rule||sample(t))+'.');
    } else if(ext==='html'||ext==='svg'){
      if(t.includes('<style'))inStyle=!t.includes('</style');if(t.includes('</style'))inStyle=false;
      const tag=t.match(/<(\/?)([\w:-]+)/);
      finish('markup',tag?(tag[1]?'يغلق عنصر '+tag[2]:(htmlRoles[tag[2]]||'ينشئ عنصر '+tag[2]))+' في '+name+(t.match(/\b(?:id|class|src|href|name)=["']([^"']+)/)?.[1]?'، بالقيمة «'+sample(t.match(/\b(?:id|class|src|href|name)=["']([^"']+)/)[1])+'»':'')+'.':'يدخل «'+sample(t)+'» في محتوى المستند '+name+' عند عرض هذا الموضع.');
    } else if(ext==='sql'){
      const m=t.match(/\b(CREATE\s+(?:UNIQUE\s+)?(?:TABLE|INDEX)|ALTER TABLE|INSERT INTO|UPDATE|DROP TABLE|SELECT)\s+(?:IF (?:NOT )?EXISTS\s+)?[`"\[]?([\w.]+)/i);if(m)statement=m[1]+' '+m[2];
      const purpose=/PRIMARY KEY/i.test(t)?'يحدد المفتاح الذي يميز الصف.':/FOREIGN KEY|REFERENCES/i.test(t)?'يربط قيمة العمود بسجل في جدول مرجعي.':/NOT NULL/i.test(t)?'يشترط وجود قيمة للعمود.':/DEFAULT/i.test(t)?'يحدد القيمة المستخدمة عند غياب مدخل صريح.':/CREATE.*INDEX/i.test(t)?'ينشئ فهرسًا لمفاتيح البحث المذكورة.':'يحدد جزءًا من تعليمة الترحيل وترتيب تطبيقها.';
      finish('sql',(statement||name)+' · '+purpose+' '+sample(t));
    } else if(ext==='sh'||name==='pre-push'||ext==='py'){
      const word=t.match(/^[A-Za-z_][\w.-]*/)?.[0];const assign=t.match(/^([\w_]+)=/);
      finish('automation',t.startsWith('#!')?'يحدد مفسّر الملف '+t.slice(2)+'.':assign?'يضبط '+assign[1]+' لتستخدمه خطوات '+name+' اللاحقة.':(shellRoles[word]|| (t.startsWith('#')?'يشرح خطوة التشغيل':ext==='py'?'تعليمة Python في مولّد الصورة':'جزء من أمر أو تدفق تنفيذ في '+name))+' · '+sample(t));
    } else if(['yaml','yml'].includes(ext)||['.npmrc','.gitignore','.gitattributes'].includes(name)){
      const key=t.match(/^(?:-\s*)?([\w-]+):\s*(.*)/);
      if(key?.[1]==='name')workflow=key[2];
      finish('configuration',name==='.gitignore'?'تطبّق قاعدة Git «'+t+'» على إدراج المسارات غير المتتبعة.':key?'يضبط '+key[1]+' ضمن '+(workflow||name)+' '+(key[2]?'بالقيمة '+sample(key[2]):'وتفصّل الأسطر التابعة قيمته')+'.':'يحدد «'+sample(t)+'» ضمن إعدادات '+(workflow||name)+'.');
    } else finish('literal','يحفظ «'+sample(t)+'» ضمن '+name+' في موضعه من النص الأصلي.');
    const effect=functionalContext(file,t);
    if(effect && (scriptRow || ext==='py'))records.at(-1)[1]+=' '+effect;
    pos+=raw.length+1;
  }
  return records;
}
