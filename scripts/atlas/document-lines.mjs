import path from 'node:path';
import passages from '../../docs/code-atlas/paragraphs.json' with { type: 'json' };

const subjects=[
  [/PULL_REQUEST_TEMPLATE/,'تسليم طلب المراجعة للمراجع مع أثر التغيير والدليل عليه'],
  [/AGENTS\.md/,'تحديد صلاحيات المنفذ وإجراءات صيانة هذا المستودع'],
  [/CHANGELOG/,'معرفة التغييرات المسجلة منذ النسخة السابقة'],
  [/BACKUP|RECOVERY/,'إعادة البيانات والتحقق من صلاحية النسخة الاحتياطية'],
  [/BROWSER_TESTS|APPEARANCE/,'مقارنة ما يعرضه المتصفح وتحديد التغييرات المرئية المقصودة'],
  [/GITHUB_WORKFLOW|CONTRIBUTING/,'التأكد من وجهة الرفع ومراجعة التغييرات قبل الدمج'],
  [/HOSTED_VERIFICATION/,'التحقق من الاستضافة باستخدام حسابات وبيانات مخصصة للاختبار'],
  [/COURSE_INTEGRATION|LOCAL_INTEGRATION/,'ربط المقرر بخدمات مدار وفحص ما يتأثر عند دمجه'],
  [/RELEASE|MAINTENANCE/,'التحقق من جاهزية النسخة وتوثيقها قبل تسليمها'],
  [/decisions\//,'فهم القرار الهندسي وسياقه وما يترتب عليه عند تغيير التنفيذ'],
  [/CODE_MAP|SOURCE_LAYOUT|ARCHITECTURE|HUB_CORE|ENGINEERING|source-parts/,'تعيين مصدر التعديل وعلاقته بمسار التنفيذ والتوليد'],
  [/HISTORY|STORY/,'تتبّع الوقائع المسجلة وراء تطور مدار'],
  [/SECURITY/,'التعامل مع البلاغات والبيانات الحساسة وفق إجراءات المستودع'],
  [/RIGHTS|LICENSE/i,'تحديد النص المرفق بالمورد والشرط أو المصطلح الذي تنتمي إليه الفقرة'],
  [/os1|DESIGN_REFINEMENT|LOCAL_REFINEMENT/i,'مراجعة قرار التصميم أو السلوك في النسخة الموثّقة'],
  [/DEVELOPMENT|START_HERE/,'تشغيل المشروع أو الوصول إلى الموضع المناسب لبدء التعديل'],
  [/atlas/,'توليد خريطة المصدر وفهم كيفية قراءة أدلتها'],
  [/REPOSITORY_REPORT/,'فحص حالة المستودع وسير صيانته وحدود التحقق'],
  [/RJ45_SOURCE/,'الرجوع إلى أصل الشكل الهندسي المستخدم لتمثيل الوصلة']
];
const concepts=[
  [/changelog/i,'يحتاج المراجع وصفًا لما تغيّر يمكن الرجوع إليه بعد الدمج.'],
  [/generated|generation|assembl|مولّد|توليد/i,'يتعلق ببناء الناتج من أصوله؛ إعادة التوليد يمكن أن تستبدل التعديل المباشر في الناتج.'],
  [/snapshot|baseline|screenshot|لقط[ةات]/i,'تُستخدم النسخة المرجعية لمقارنة الحالة التالية وكشف فرق محدد.'],
  [/restore|backup|استرجاع|احتياط/i,'الخطوة مرتبطة بإمكان استعادة حالة سابقة وفحص البيانات المسترجعة.'],
  [/authenticat|authoriz|credential|secret|تفويض|سرّي/i,'تحدد من يستطيع تنفيذ الإجراء وما يمكن كشفه عند المراجعة.'],
  [/commit|pull request|main branch|merge|الدمج/i,'يوضح أين يُحفظ التغيير أو متى يصبح جزءًا من الفرع المعتمد.'],
  [/revisio[n]|conflict|concurren|تعارض/i,'تؤثر النسخة التي يبدأ منها التعديل في اكتشاف التغييرات المتزامنة.'],
  [/provenance|evidence|verif|دليل|تحقق/i,'يربط هذه الخطوة بالدليل الذي يمكن للقارئ الرجوع إليه للتحقق.'],
  [/^\s*(?:the )?permission is hereby granted/i,'تبدأ هنا العبارة التي تعدد الأفعال المسموح بها في النص المرفق.'],
  [/warranty|liability|ضمان/i,'تنتمي العبارة إلى بند الضمان أو المسؤولية في النص المرفق.']
];
export function documentNotes(file,lines){
  const purpose=subjects.find(([match])=>match.test(file))?.[1]||'استخدام دليل '+path.posix.basename(file);
  const headings=[],notes=[];
  let fence='',tableHeader=[],item=0;
  for(let i=0;i<lines.length;i++){
    const t=lines[i].trim(), heading=/^(#{1,6})\s+(.+)/.exec(t);
    const marks=/^(`{3,}|~{3,})(.*)/.exec(t);
    const scope=()=>headings.filter(Boolean).join(' / ')||path.posix.basename(file);
    if(marks && (!fence||marks[1][0]===fence[0]&&marks[1].length>=fence.length)){
      const closing=!!fence;fence=closing?'':marks[1];
      notes.push((closing?'ينتهي هنا عرض المثال':'يبدأ هنا عرض مثال'+(marks[2]?' بلغة '+marks[2]:''))+' ضمن «'+scope()+'».');continue;
    }
    if(fence){notes.push('جزء من المثال الوارد في «'+scope()+'». '+(/^(?:npm|node|git|npx)\s/.test(t)?'السطر يحدد أمرًا يمكن مطابقته بأوامر المستودع: ':'تظهر هذه التعليمة أو النتيجة للقارئ كما كُتبت داخل كتلة المثال: ')+t);continue;}
    if(heading){headings.length=heading[1].length-1;headings.push(heading[2]);item=0;notes.push('يفتح قسم «'+scope()+'» ضمن دليل '+purpose+'. تتبع الفقرات الواقعة بعده هذا العنوان حتى العنوان المناظر التالي.');continue;}
    if(!t){notes.push('يفصل فقرتين ضمن «'+scope()+'» ويؤثر في تجميعهما عند عرض المستند.');continue;}
    const quoted=[...t.matchAll(/`([^`]+)`/g)].map(x=>x[1]);
    const links=[...t.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)].map(x=>x[1]+' ← '+x[2]);
    const terms=concepts.filter(([match])=>match.test(t)).slice(0,2).map(x=>x[1]).join(' ');
    if (Object.hasOwn(passages[file] || {}, t)) {
      notes.push(passages[file][t] + (links.length ? ' '+links.join('، ') : ''));
      continue;
    }
    let action;
    if(/^\|/.test(t)){
      const cells=t.replace(/^\||\|$/g,'').split('|').map(x=>x.trim());
      if(!/^\|/.test(lines[i-1]?.trim()||''))tableHeader=cells;
      action=cells.every(v=>/^:?-+:?$/.test(v))?'يفصل رأس الجدول عن بياناته ويحدد محاذاة الأعمدة.':tableHeader===cells?'يحدد معاني أعمدة المقارنة: '+cells.join('، '):'يربط خلايا هذا الصف بعناوينها: '+cells.map((v,j)=>(tableHeader[j]||String(j+1))+' ← '+v).join('؛ ');
    }else if(/^[-*] \[[ xX]\]/.test(t))action='بند تحقق يضع المراجع علامة أمامه بعد فحص الشرط المذكور.';
    else if(/^[-*] .+:$/.test(t))action='خانة يملؤها صاحب الطلب لتمكين المراجع من التحقق من '+t.slice(2,-1)+'.';
    else if(/^\d+[.)]\s/.test(t))action='خطوة مرتبة رقم '+t.match(/^\d+/)[0]+'؛ موضعها يحدد متى ينفذ القارئ الإجراء في هذا القسم.';
    else if(links.length)action='يقدم إحالات للوصول إلى '+links.join('، ')+'.';
    else if(/^https?:\/\//.test(t))action='يسجل مصدرًا يمكن الرجوع إليه للتحقق من مادة هذا القسم.';
    else if(/^[-*] /.test(t))action=(file==='CHANGELOG.md'?'يسجل تغييرًا يستطيع القارئ تتبعه بعد مراجعة النسخة.':'يضيف بندًا مستقلًا إلى قائمة «'+scope()+'».');
    else if(/^(do not|never|لا |يمنع)/i.test(t))action='يضع حدًا لما يجوز تنفيذه في حالة هذا القسم.';
    else action='تحدد الفقرة '+(++item)+' في «'+scope()+'» معلومة يحتاجها القارئ عند '+purpose+'.';
    notes.push(action+' '+terms+(quoted.length?' الأسماء أو القيم التي يتناولها السطر: '+quoted.join('، ')+'.':''));
  }
  return notes;
}
