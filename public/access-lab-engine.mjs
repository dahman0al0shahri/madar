// Bounded educational database model. Never executes SQL, VBA, or real files.
export const LAB_VERSION='access-lab-1';
export const clone=x=>JSON.parse(JSON.stringify(x));
export const TYPES=['نص قصير','رقم','عملة','تاريخ/وقت','ترقيم تلقائي'];
export const seed=()=>({name:'الشركة.accdb',view:'data',active:'الموظفون',selectedField:'الاسم',selectedRow:1,tab:'الصفحة الرئيسية',tables:{
 'الموظفون':{fields:[{name:'المعرف',type:'ترقيم تلقائي',primary:true},{name:'الاسم',type:'نص قصير'},{name:'القسم',type:'رقم'},{name:'المدينة',type:'نص قصير'},{name:'الراتب',type:'عملة'},{name:'الجوال',type:'نص قصير'}],rows:[{المعرف:1,الاسم:'أحمد',القسم:1,المدينة:'الرياض',الراتب:1000,الجوال:'0501234567'},{المعرف:2,الاسم:'سارة',القسم:2,المدينة:'جدة',الراتب:2500,الجوال:'0559876543'},{المعرف:3,الاسم:'خالد',القسم:1,المدينة:'الرياض',الراتب:4000,الجوال:'0534567890'}],hidden:[],frozen:[],description:''},
 'الأقسام':{fields:[{name:'رقم القسم',type:'رقم',primary:true},{name:'اسم القسم',type:'نص قصير'}],rows:[{'رقم القسم':1,'اسم القسم':'التقنية'},{'رقم القسم':2,'اسم القسم':'الإدارة'}],hidden:[],frozen:[],description:''},
 'الجدد':{fields:[{name:'المعرف',type:'رقم'},{name:'الاسم',type:'نص قصير'},{name:'القسم',type:'رقم'},{name:'المدينة',type:'نص قصير'},{name:'الراتب',type:'عملة'},{name:'الجوال',type:'نص قصير'}],rows:[{المعرف:4,الاسم:'نورة',القسم:2,المدينة:'جدة',الراتب:3000,الجوال:'0541112223'}],hidden:[],frozen:[],description:''}},
 relationships:[],queries:{},forms:{},query:{source:'الموظفون',fields:[],criteria:{},type:'تحديد',target:'',name:'',parameter:''},results:null,filter:null,sort:null,found:null,files:[],settings:{},imports:[],specs:{},exports:[],backup:null,check:null});
const table=s=>s.tables[s.active];
const field=(s,n)=>table(s)?.fields.find(f=>f.name===n);
const nonempty=(v,label)=>{if(!String(v||'').trim())throw Error('أدخل '+label+' أولًا.');return String(v).trim();};
function nextAuto(t,f){const used=new Set(t.rows.map(r=>Number(r[f.name])));t.nextId=Math.max(t.nextId||1,1,...[...used].filter(Number.isFinite).map(n=>n+1));if(f.newValues==='عشوائي'){let n=t.randomSeed||9371;do{n=(Math.imul(n,1664525)+1013904223)>>>0;}while(used.has(n%2147483647));t.randomSeed=n;return n%2147483647;}return t.nextId++;}
export function matches(value,criteria,parameter=''){
 let c=String(criteria||'').trim();if(!c)return true;
 if(/^\[.+\]$/.test(c))c=parameter;
 const m=c.match(/^(>=|<=|<>|>|<|=)\s*(.*)$/);const op=m?.[1]||'=',raw=(m?.[2]??c).replace(/^"|"$/g,'');
 if(['>','<','>=','<='].includes(op)){if(raw===''||!Number.isFinite(Number(raw))||!Number.isFinite(Number(value)))throw Error('المقارنة العددية تحتاج رقمًا صحيح الصياغة.');const a=Number(value),b=Number(raw);return op==='>'?a>b:op==='<'?a<b:op==='>='?a>=b:a<=b;}
 return op==='<>'?String(value)!==raw:String(value)===raw;
}
export function visibleRows(s){let rows=clone(table(s)?.rows||[]);if(s.filter)rows=rows.filter(r=>matches(r[s.filter.field],s.filter.criteria));if(s.sort){const {field,dir}=s.sort;rows.sort((a,b)=>(typeof a[field]==='number'?a[field]-b[field]:String(a[field]??'').localeCompare(String(b[field]??''),'ar'))*(dir==='تصاعدي'?1:-1));}return rows;}
export function queryRows(s){const q=s.query,t=s.tables[q.source];if(!t)throw Error('أضف جدول مصدر أولًا.');if(!q.fields.length)throw Error('أضف حقلًا واحدًا على الأقل إلى شبكة التصميم.');for(const f of q.fields)if(!t.fields.some(x=>x.name===f))throw Error('الحقل '+f+' غير موجود في المصدر.');return t.rows.filter(r=>Object.entries(q.criteria).every(([f,c])=>matches(r[f],c,q.parameter))).map(r=>Object.fromEntries(q.fields.map(f=>[f,r[f]])));}
function validateValue(f,value){if(f.type==='ترقيم تلقائي')throw Error('قيمة الترقيم التلقائي ينشئها البرنامج.');if(['رقم','عملة'].includes(f.type)){if(String(value).trim()===''||!Number.isFinite(Number(value)))throw Error('الحقل «'+f.name+'» يقبل رقمًا؛ لم تتغير بياناتك.');value=Number(value);}if(f.size&&String(value).length>Number(f.size))throw Error('القيمة تتجاوز حجم الحقل.');if(f.rule&&!matches(value,f.rule))throw Error(f.validationText||'القيمة لا تحقق قاعدة التحقق.');if(f.mask==='0000000000'&&!/^\d{10}$/.test(value))throw Error('قناع الإدخال يتطلب عشرة أرقام.');return value;}
export function reduce(state,action,v={}){
 const s=clone(state);s.check=null;const t=table(s);
 switch(action){
 case 'open':if(!s.tables[v.name])throw Error('الجدول غير موجود.');s.active=v.name;s.selectedField=s.tables[v.name].fields[0]?.name||'';s.view='data';s.filter=null;s.sort=null;break;
 case 'view':s.view=v.view;break;
 case 'selectField':s.selectedField=v.name;break;
 case 'selectRow':s.selectedRow=Number(v.id);break;
 case 'newDB':s.name=nonempty(v.name,'اسم قاعدة البيانات')+'.accdb';s.tables={};s.active='';s.view='data';break;
 case 'newTable':{const n=nonempty(v.name,'اسم الجدول');if(s.tables[n])throw Error('يوجد جدول بهذا الاسم؛ اختر اسمًا مختلفًا.');s.tables[n]={fields:[{name:'المعرف',type:'ترقيم تلقائي',primary:true}],rows:[],hidden:[],frozen:[],description:''};s.active=n;s.selectedField='المعرف';s.view=v.design?'design':'data';break;}
 case 'addField':{if(!t)throw Error('افتح جدولًا أولًا.');const n=nonempty(v.name,'اسم الحقل');if(t.fields.some(f=>f.name===n))throw Error('اسم الحقل مستخدم.');if(!TYPES.includes(v.type))throw Error('اختر نوع البيانات.');if(v.type==='ترقيم تلقائي'&&t.fields.some(f=>f.type===v.type))throw Error('يسمح بحقل ترقيم تلقائي واحد في الجدول.');t.fields.push({name:n,type:v.type});for(const r of t.rows)r[n]='';s.selectedField=n;break;}
 case 'deleteField':{const f=field(s,s.selectedField);if(!f)throw Error('حدد الحقل أولًا.');if(f.primary)throw Error('هذا مفتاح أساسي؛ اختر الحقل المطلوب في المهمة.');t.fields=t.fields.filter(x=>x.name!==f.name);t.rows.forEach(r=>delete r[f.name]);s.selectedField=t.fields[0]?.name;break;}
 case 'primary':{const f=field(s,s.selectedField);if(!f)throw Error('حدد صف الحقل أولًا.');const vals=t.rows.map(r=>r[f.name]);if(vals.some(x=>x===''||x==null)||new Set(vals).size!==vals.length)throw Error('المفتاح الأساسي لا يقبل الفراغ أو التكرار.');t.fields.forEach(x=>x.primary=x===f);break;}
 case 'property':{const f=field(s,s.selectedField);if(!f)throw Error('حدد الحقل أولًا.');if(v.key==='type'){if(!TYPES.includes(v.value))throw Error('نوع غير مدعوم.');if(v.value==='ترقيم تلقائي'&&t.fields.some(x=>x!==f&&x.type===v.value))throw Error('يوجد بالفعل حقل ترقيم تلقائي.');for(const row of t.rows)if(['رقم','عملة'].includes(v.value)&&!Number.isFinite(Number(row[f.name])))throw Error('توجد بيانات نصية غير قابلة للتحويل؛ لم نغير النوع.');}f[v.key]=v.value;if(v.key==='type'&&['رقم','عملة'].includes(v.value))for(const row of t.rows)row[f.name]=Number(row[f.name]);break;}
 case 'cell':{const f=field(s,v.field),row=t.rows.find(r=>r.المعرف===Number(v.id));if(!f||!row)throw Error('حدد خلية موجودة.');const value=validateValue(f,v.value);if(f.primary&&t.rows.some(r=>r!==row&&r[f.name]===value))throw Error('قيمة المفتاح مكررة.');if(v.field==='القسم'&&s.relationships.some(r=>r.enforce)&&!s.tables['الأقسام'].rows.some(r=>r['رقم القسم']===Number(value)))throw Error('التكامل المرجعي: القسم غير موجود في جدول الأقسام.');row[v.field]=value;break;}
 case 'addRecord':{const row={};for(const f of t.fields)row[f.name]=f.type==='ترقيم تلقائي'?nextAuto(t,f):validateValue(f,v[f.name]??f.default??'');if(s.relationships.some(r=>r.enforce)&&'القسم'in row&&!s.tables['الأقسام'].rows.some(r=>r['رقم القسم']===Number(row.القسم)))throw Error('اختر قسمًا موجودًا؛ التكامل المرجعي يمنع القيمة غير الموجودة.');for(const f of t.fields.filter(f=>f.primary))if(t.rows.some(r=>r[f.name]===row[f.name]))throw Error('قيمة المفتاح مكررة.');t.rows.push(row);s.selectedRow=row.المعرف;break;}
 case 'deleteRecord':for(const f of t.fields.filter(f=>f.type==='ترقيم تلقائي'))t.nextId=Math.max(t.nextId||1,...t.rows.map(r=>(Number(r[f.name])||0)+1));t.rows=t.rows.filter(r=>r.المعرف!==s.selectedRow);break;
 case 'hide':if(!t.hidden.includes(s.selectedField))t.hidden.push(s.selectedField);break;
 case 'unhide':t.hidden=[];break;
 case 'freeze':t.frozen=[s.selectedField];break;
 case 'unfreeze':t.frozen=[];break;
 case 'description':t.description=nonempty(v.description,'الوصف');break;
 case 'sort':s.sort={field:s.selectedField,dir:v.dir};break;
 case 'filter':s.filter={field:s.selectedField,criteria:nonempty(v.criteria,'معيار التصفية')};visibleRows(s);break;
 case 'clearFilter':s.filter=null;break;
 case 'find':{const value=nonempty(v.value,'النص المطلوب');const rows=t.rows;const target=rows.find(r=>Object.entries(r).some(([k,x])=>(v.scope==='الجدول'||k===s.selectedField)&&(v.match==='الحقل بالكامل'?String(x)===value:String(x).includes(value))));s.found=target?.المعرف??null;s.selectedRow=s.found;break;}
 case 'relation':{const from=s.tables[v.from],to=s.tables[v.to];if(!from||!to||v.from===v.to)throw Error('اختر جدولين مختلفين.');const a=from.fields.find(f=>f.name===v.fromField),b=to.fields.find(f=>f.name===v.toField);if(!a?.primary||!b)throw Error('اربط المفتاح الأساسي بحقل مقابل موجود.');if(v.enforce&&to.rows.some(r=>!from.rows.some(x=>String(x[a.name])===String(r[b.name]))))throw Error('توجد سجلات بلا مفتاح مقابل؛ لم تنشأ العلاقة.');s.relationships=[{...v,enforce:!!v.enforce}];s.view='relations';break;}
 case 'queryNew':s.query={source:v.source||'الموظفون',fields:[],criteria:{},type:'تحديد',target:'',name:'',parameter:''};s.results=null;s.view='query';break;
 case 'wizard':{if(!v.fields?.length)throw Error('انقل حقلًا واحدًا على الأقل إلى الحقول المحددة.');s.query={source:v.source,fields:v.fields,criteria:{},type:'تحديد',target:'',name:nonempty(v.name,'اسم الاستعلام'),parameter:''};s.results=queryRows(s);s.queries[s.query.name]=clone(s.query);s.view='results';break;}
 case 'queryField':if(!s.query.fields.includes(v.field))s.query.fields.push(v.field);break;
 case 'queryRemoveField':s.query.fields=s.query.fields.filter(f=>f!==v.field);delete s.query.criteria[v.field];break;
 case 'criteria':s.query.criteria[v.field]=v.value;s.results=null;break;
 case 'queryType':s.query.type=v.type;s.query.target=v.target||'';break;
 case 'querySave':s.query.name=nonempty(v.name,'اسم الاستعلام');s.queries[s.query.name]=clone(s.query);break;
 case 'queryDelete':if(!s.queries[v.name])throw Error('اختر استعلامًا موجودًا.');delete s.queries[v.name];break;
 case 'queryOpen':if(!s.queries[v.name])throw Error('الاستعلام غير موجود.');s.query=clone(s.queries[v.name]);s.view='query';break;
 case 'run':{s.query.parameter=v.parameter||'';const rows=queryRows(s);if(s.query.type==='تكوين جدول'){const n=nonempty(s.query.target,'اسم الجدول الهدف');if(s.tables[n])throw Error('يوجد جدول بهذا الاسم. لن نستبدله؛ اختر اسمًا آخر.');s.tables[n]={fields:s.tables[s.query.source].fields.filter(f=>s.query.fields.includes(f.name)).map(f=>({name:f.name,type:f.type==='ترقيم تلقائي'?'رقم':f.type})),rows:clone(rows),hidden:[],frozen:[]};}else if(s.query.type==='إلحاق'){const target=s.tables[s.query.target];if(!target)throw Error('الإلحاق يحتاج جدول هدف موجودًا.');for(const f of s.query.fields)if(!target.fields.some(x=>x.name===f))throw Error('طابق حقول المصدر والهدف.');for(const row of rows){for(const f of target.fields.filter(f=>f.primary))if(target.rows.some(r=>r[f.name]===row[f.name]))throw Error('تكرار مفتاح أساسي؛ لم تلحق أي سجلات.');}target.rows.push(...clone(rows));}s.results=rows;s.view='results';break;}
 case 'form':{const n=nonempty(v.name,'اسم النموذج');s.forms[n]={type:v.type,source:v.source||'',items:v.items||[]};s.view='forms';break;}
 case 'nav':s.settings.navigation=v.group;break;
 case 'print':s.settings.print={orientation:v.orientation,paper:v.paper};s.view='print';break;
 case 'export':s.exports.push({table:s.active,format:v.format,name:nonempty(v.name,'اسم ملف التصدير'),rows:clone(t.rows),saved:!!v.saved});s.view='files';break;
 case 'saveAs':{const name=nonempty(v.name,'اسم الملف');s.files.push({name:name+v.format,kind:v.format,source:s.name});s.view='files';break;}
 case 'backup':s.backup={name:nonempty(v.name,'اسم النسخة'),tables:clone(s.tables)};s.files.push({name:s.backup.name+'.accdb',kind:'نسخة احتياطية'});s.view='files';break;
 case 'restore':if(!s.backup)throw Error('لا توجد نسخة احتياطية في هذا التدريب.');s.tables=clone(s.backup.tables);s.settings.restored=true;s.view='data';break;
 case 'compact':s.settings.compacted=true;s.settings.beforeSize=12;s.settings.afterSize=9;s.view='files';break;
 case 'encrypt':if(String(v.password||'').length<4||v.password!==v.confirm)throw Error('استخدم كلمة تجريبية من4أحرف على الأقل وطابق التأكيد. لا تستخدم كلمة حقيقية.');s.settings.encrypted=true;s.view='files';break;
 case 'split':{const name=nonempty(v.name,'اسم ملف البيانات');s.files.push({name:name+'.accdb',kind:'جداول البيانات'},{name:s.name,kind:'واجهة بجداول مرتبطة'});Object.values(s.tables).forEach(t=>t.linked=name+'.accdb');s.settings.split=true;s.view='files';break;}
 case 'import':{const name=nonempty(v.name,'اسم الجدول');if(s.tables[name])throw Error('اختر اسمًا جديدًا للجدول.');if(v.source==='نص'&&v.delimiter!==',')throw Error('معاينة الملف تفصلها فاصلة؛ اختر الفاصلة لقراءة عمودين.');const fields=v.headers?[{name:'الاسم',type:'نص قصير'},{name:'المدينة',type:'نص قصير'}]:[{name:'حقل1',type:'نص قصير'},{name:'حقل2',type:'نص قصير'}];const rows=v.headers?[{الاسم:'ريم',المدينة:'الرياض'},{الاسم:'علي',المدينة:'جدة'}]:[{حقل1:'الاسم',حقل2:'المدينة'},{حقل1:'ريم',حقل2:'الرياض'},{حقل1:'علي',حقل2:'جدة'}];if(v.key){fields.unshift({name:'المعرف',type:'ترقيم تلقائي',primary:true});rows.forEach((r,i)=>r.المعرف=i+1);}s.tables[name]={fields,rows,hidden:[],frozen:[],linked:v.link?'المصدر.accdb':''};s.imports.push({...v});s.active=name;s.view='data';break;}
 case 'spec':s.specs[nonempty(v.name,'اسم المواصفة')]={delimiter:v.delimiter,headers:!!v.headers};break;
 case 'relink':if(!t?.linked)throw Error('اختر الجدول المرتبط أولًا.');t.linked=nonempty(v.path,'المسار الجديد');s.view='data';break;
 default:throw Error('هذا الأمر غير متاح في التدريب.');
 }return s;
}
export const valueAt=(s,path)=>path.split('/').reduce((v,k)=>v?.[k],s);
export function initial(task){let s=seed();for(const [action,v] of task.setup||[]){if(action==='removePrimary')s.tables['الموظفون'].fields.forEach(f=>f.primary=false);else if(action==='numericPhone'){s.tables['الموظفون'].fields[5].type='رقم';s.tables['الموظفون'].rows.forEach(r=>r.الجوال=Number(r.الجوال));}else if(action==='randomID')s.tables['الموظفون'].fields[0].newValues='عشوائي';else s=reduce(s,action,v);}s.check=null;return s;}
export function grade(s,task){return task.goals.map(g=>{const actual=g.path==='visibleCount'?visibleRows(s).length:g.path==='resultCount'?s.results?.length:valueAt(s,g.path);const ok=g.op==='includes'?Array.isArray(actual)&&actual.includes(g.value):g.op==='exists'?actual!==undefined:g.op==='absent'?actual===undefined:g.op==='gte'?actual>=g.value:JSON.stringify(actual)===JSON.stringify(g.value);return {...g,ok,actual};});}
export function validLabState(s){return s&&typeof s.name==='string'&&['data','design','query','results','relations','files','forms','print'].includes(s.view)&&s.tables&&typeof s.tables==='object'&&!Array.isArray(s.tables)&&Object.values(s.tables).every(t=>Array.isArray(t.fields)&&t.fields.length<=30&&t.fields.every(f=>typeof f.name==='string'&&TYPES.includes(f.type))&&Array.isArray(t.rows)&&t.rows.length<=100&&Array.isArray(t.hidden)&&Array.isArray(t.frozen))&&Array.isArray(s.relationships)&&s.queries&&s.query&&Array.isArray(s.query.fields)&&s.query.criteria&&Array.isArray(s.files)&&Array.isArray(s.exports)&&Array.isArray(s.imports)&&s.settings&&s.forms;}
