function assessTask(a,s){
 const {cells:c,formats:f,rules:r,validation:v,control:t,events:e,protect,locked,customList}=s;
 const all=(area,fn)=>range(area).every(fn),has=k=>e.has(k);
 const checks={
 conditional:[[all('B2:B5',k=>{const top=r.find(x=>range(x.area).includes(k)&&Number(c[k])>x.limit);return r.some(x=>range(x.area).includes(k)&&x.limit===80&&x.color==='red')&&(!(+c[k]>80)||top?.color==='red');}),'حدد B2:B5، وسوّ قاعدة أكبر من 80 بالتعبئة الحمراء.'],[c.B2==='85','غيّر B2 إلى 85 وشوف هل يتغير لونها.']],
 validation:[[all('B2:B5',k=>v[k]?.min===0&&v[k]?.max===100),'حدد B2:B5، واختر عدد صحيح بين 0 و100.'],[has('valid-B2-0')&&has('valid-B2-100'),'في B2 جرّب 0، وبعدها 100. اضغط Enter بعد كل رقم.'],[has('invalid-B2-101')&&has('invalid-B2-1.5'),'في B2 جرّب 101، وبعدها 1.5. المفروض يرفض الرقمين.']],
 control:[[t?.link==='B5'&&t.min===1&&t.max===50&&t.step===1,'افتح تنسيق عنصر التحكم: اربطه بـB5، وخله من 1 إلى 50 بخطوة 1.'],[['spin-up','spin-down','spin-max','spin-limit'].every(has),'خل القيمة 49. اضغط ▲ مرتين، ثم ▼. المفروض تشوف 50 ثم 50 ثم 49.'],[t?.current===49&&c.B5==='49','بعد تجربة الحد الأعلى، اضغط ▼ لين ترجع القيمة 49.']],
 rules:[[r[0]?.limit===90&&r[0]?.color==='blue'&&r[0]?.area==='B2:B5'&&r.some(x=>x.limit===60&&x.color==='red'),'من إدارة القواعد، حرّك القاعدة الزرقاء >90 فوق الحمراء >60، وخل القاعدتين موجودتين.']],
 number:[[f.B2?.type==='number'&&f.B2?.digits===2,'حدد B2، وافتح تنسيق خلايا. اختر مخصص — رقم واكتب #,##0.00.'],[c.B2==='1234.567','التنسيق يغيّر العرض فقط. رجّع قيمة B2 إلى 1234.567.']],
 date:[[f.B2?.type==='date'&&f.B2?.code==='dddd','حدد B2، واختر مخصص — تاريخ واكتب dddd.'],[c.B2==='46303','خل القيمة الأصلية في B2 مثل ما كانت: 46303. غيّر تنسيقها فقط.']],
 style:[[all('B2:B5',k=>f[k]?.bold&&f[k]?.color==='blue'),'حدد B2:B5 كاملًا، وطبّق نمط بتعبئة زرقاء وخط عريض.']],
 themes:[[all('B2:B3',k=>f[k]?.theme&&f[k]?.color==='blue'),'من تخطيط الصفحة، افتح ألوان واختر لون التمييز الأزرق.'],[all('B2:B3',k=>f[k]?.font==='Tahoma'&&f[k]?.heading==='Tahoma'),'افتح خطوط، واختر Tahoma للعناوين والنص الأساسي.']],
 protection:[[protect&&locked.B2!==false,'أمّن B2 من تنسيق خلايا، وبعدها فعّل حماية ورقة من مراجعة.'],[has('protected-B2'),'وأنت على B2 جرّب تكتب 99. المفروض تظهر رسالة تمنع التعديل.'],[c.B2==='80','خل القيمة الأصلية 80 مثل ما كانت قبل الحماية.']],
 changes:[[c.B2==='500'&&has('reject-B2'),'من مراجعة، افتح قبول/رفض التغييرات واختر رفض. المفروض ترجع B2 إلى 500.']],
 trace:[[has('precedents-C2'),'حدد C2 أولًا، ثم صيغ ← تتبع السابقات.'],[has('dependents-A2'),'حدد A2، ثم صيغ ← تتبع التوابع.']],
 fill:[[JSON.stringify(customList)===JSON.stringify(['الرياض','جدة','الدمام','مكة']),'من ملف ← خيارات، أضف الرياض، جدة، الدمام، مكة؛ كل اسم بسطر.'],[has('fill-A2:A6')&&['الرياض','جدة','الدمام','مكة','الرياض'].every((x,i)=>c['A'+(i+2)]===x),'اكتب الرياض في A2، وحدد A2:A6، ثم تعبئة لأسفل. لازم يظهر التسلسل كاملًا.']],
 transpose:[[/^=TRANSPOSE\(A2:C3\)$/i.test(c.E2||''),'حدد E2 واكتب =TRANSPOSE(A2:C3)، بدل كتابة النتائج يدويًا.'],[c.A2==='9','غيّر A2 إلى 9 عشان تختبر ارتباط النتيجة بالمصدر.'],[['E2','F2','E3','F3','E4','F4'].every((k,i)=>value(c,k)===value(c,['A2','A3','B2','B3','C2','C3'][i])),'راجع نتيجة التبديل كاملة في E2:F4. لازم تبقى مرتبطة بالمصدر.']]
 };
 return checks[a.kind]||[];
}

globalThis.MADAR_SHEET_CORE={assessTask,range,position,shift,evaluate,value,allowed,compare,verifyFormula};
if(typeof document==='undefined')return;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let cleanup=()=>{};
