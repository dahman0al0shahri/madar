import { DatabaseSync } from 'node:sqlite';

// Only the repository's ordered CREATE/ALTER TABLE migrations are supported here.
function snapshot(prior,sql) {
  const db=new DatabaseSync(':memory:');
  try {
    db.exec(prior);
    db.exec(sql);
    const tables=db.prepare("SELECT name FROM sqlite_schema WHERE type='table' ORDER BY name").all();
    const facts=new Set();
    for(const {name} of tables){
      facts.add('TABLE '+name);
      for(const col of db.prepare('SELECT * FROM pragma_table_info(?) ORDER BY cid').all(name)){
        const def=[name+'.'+col.name,col.type,col.notnull?'NOT NULL':'NULL',col.pk?'PRIMARY KEY #'+col.pk:'',col.dflt_value===null?'':'DEFAULT '+col.dflt_value].filter(Boolean);
        facts.add(def.join(' '));
      }
    }
    for(const row of db.prepare("SELECT name, tbl_name, sql FROM sqlite_schema WHERE type='index' AND sql IS NOT NULL ORDER BY name").all()){
      facts.add(row.sql.trim());
    }
    return facts;
  }finally{db.close();}
}

export function migrationTrials(paths,source){
  const results=new Map();
  let prior='';
  for(const path of [...paths].filter(p=>/^drizzle\/\d+_[^/]+\.sql$/.test(p)).sort()){
    const sql=source(path);
    if(/\b(?:ATTACH|DETACH|PRAGMA|load_extension|VACUUM|INSERT|UPDATE|DELETE|DROP|TRIGGER)\b/i.test(sql))throw Error('Review unsupported migration before experimenting: '+path);
    const full=snapshot(prior,sql);
    const rows=sql.split('\n');
    if(rows.at(-1)==='')rows.pop();
    results.set(path,rows.map((_,i)=>{
      const edited=rows.slice(0,i).concat(rows.slice(i+1)).join('\n');
      let result;
      try{result=snapshot(prior,edited);}catch(e){return 'عند حذف السطر في قاعدة اختبار مؤقتة رفض SQLite الترحيل: '+e.message+'.';}
      const removed=[...full].filter(x=>!result.has(x)),added=[...result].filter(x=>!full.has(x));
      if(!added.length&&!removed.length)return 'بعد تشغيل الترحيل مرة أخرى دون السطر تطابقت أسماء الجداول والأعمدة وأنواعها والقيود والقيم الافتراضية التي يفحصها الاختبار.';
      return 'نتيجة حذف السطر وإعادة الترحيل في الذاكرة. '+(removed.length?'اختفى من المخطط: '+removed.join('، ')+'. ':'')+(added.length?'ظهر بدلًا منه: '+added.join('، ')+'.':'');
    }));
    prior+='\n'+sql;
  }
  return results;
}

export function sqlMeaning(text,statement){
  const t=text.trim();
  const index=t.match(/CREATE\s+(UNIQUE\s+)?INDEX\s+[`"]?([\w]+)[`"]?\s+ON\s+[`"]?([\w]+)[`"]?\s*\(([^)]+)\)/i);
  if(index)return 'ينشئ الفهرس '+index[2]+' في الجدول '+index[3]+' بالترتيب '+index[4].replaceAll('`','')+'. '+(index[1]?'يشترط تفرد مفاتيح الفهرس غير الخالية.':'يتيح البحث باستخدام أعمدة الفهرس بهذا الترتيب.');
  if(t==='--> statement-breakpoint')return 'علامة تفصل تعليمتي ترحيل لأدوات Drizzle. يقرأها SQLite تعليقًا عند تشغيل نص الترحيل دفعة واحدة.';
  const table=t.match(/CREATE TABLE\s+[`"]?([\w]+)[`"]?/i);
  if(table)return 'يبدأ تعريف الجدول '+table[1]+'؛ الأسطر حتى قوس الإغلاق تحدد شكل الصف الذي يستطيع التطبيق تخزينه.';
  const col=t.match(/^[`"]([^"`]+)[`"]\s+(text|integer|real|blob|numeric)\b/i);
  if(col)return 'يضيف العمود '+col[1]+' في '+statement+' بنوع '+col[2]+'. '+(/NOT NULL/i.test(t)?'يرفض الصف الذي يحمل NULL هنا. ':'يسمح بقيمة NULL. ')+(/PRIMARY KEY/i.test(t)?'هذه القيمة تميّز الصف. ':'')+(t.match(/DEFAULT\s+(\S+)/i)?'القيمة المفترضة عند إغفال العمود '+t.match(/DEFAULT\s+(\S+)/i)[1].replace(/,$/,'')+'.':'');
  if(/PRIMARY KEY/i.test(t))return 'يفرض تفرّد توليفة الأعمدة '+t.replace(/.*?PRIMARY KEY\s*/i,'')+' في '+statement+'؛ بذلك يمكن تمييز سجل لكل توليفة.';
  if(/ALTER TABLE/i.test(t))return 'يعدّل بنية جدول موجود عند تطبيق هذا الترحيل: '+t;
  if(/^\);/.test(t))return 'يُنهي تعريف أعمدة '+statement+' ويتيح تنفيذ تعليمة الإنشاء كوحدة واحدة.';
  return 'ضمن '+statement+' تُطبّق التعليمة '+t+' وفق ترتيب الترحيلات.';
}
