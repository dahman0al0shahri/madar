(()=>{
'use strict';
const round=(n,d)=>{if(!Number.isFinite(n)||!Number.isInteger(d)||Math.abs(d)>6)throw Error('استخدم من −٦ إلى ٦ منازل.');const shift=(x,k)=>{const [a,b='0']=String(x).split('e');return Number(a+'e'+(Number(b)+k));};return Math.sign(n)*shift(Math.round(shift(Math.abs(n),d)),-d);};
const numeric=x=>x!==''&&Number.isFinite(Number(x));
function calculate(op,v){
 const a=Number(v.a),b=Number(v.b),n=[v.a,v.b,v.c].filter(numeric).map(Number),k=Number(v.k||2);let value,formula,why;
 switch(op){
 case 'IF':formula='=IF(A2>400,"عالية","منخفضة")';value=a>400?'عالية':'منخفضة';why='المقارنة > لا تشمل 400 نفسها.';break;
 case 'LOGIC':formula=v.logic==='NOT'?'=NOT(A2>5)':`=${v.logic}(A2>5,B2>600)`;value=v.logic==='AND'?a>5&&b>600:v.logic==='OR'?a>5||b>600:!(a>5);why='AND: كل الشروط. OR: شرط واحد على الأقل. NOT: عكس شرط واحد.';break;
 case 'ROUND':formula=`=ROUND(A2,${k})`;value=round(a,k);why='موجب: منازل عشرية. صفر: عدد صحيح. سالب: إلى يسار الفاصلة. أنصاف القيم تُقرّب بعيدًا عن الصفر.';break;
 case 'NESTED':formula='=IF(AND(A2>5,B2>600),"مستحق","غير مستحق")';value=a>5&&b>600?'مستحق':'غير مستحق';why='تحدد AND نتيجة الاختبار، ثم تختار IF النص المناسب.';break;
 case 'SUM':formula='=SUM(A2:C2)';value=n.reduce((s,x)=>s+x,0);why='الدالة تجمع الأرقام في النطاق وتتجاهل الخلايا الفارغة.';break;
 case 'COUNT':formula='=COUNT(A2:C2)';value=n.length;why='الصفر رقم يُعد، أما الخلية الفارغة فلا تُعد.';break;
 case 'AVERAGE':formula='=AVERAGE(A2:C2)';value=n.length?n.reduce((s,x)=>s+x,0)/n.length:'#DIV/0!';why='المتوسط = مجموع القيم الرقمية ÷ عددها؛ الصفر يدخل في العدد والفراغ لا يدخل.';break;
 case 'SMALL':case 'LARGE':formula=`=${op}(A2:C2,${k})`;value=Number.isInteger(k)&&k>=1&&k<=n.length?[...n].sort((a,b)=>op==='SMALL'?a-b:b-a)[k-1]:'#NUM!';why='الرتبة تبدأ من 1، والرتبة خارج عدد القيم تُرجع #NUM!.';break;
 case 'COUNTIF':formula=`=COUNTIF(A2:C2,">=${k}")`;value=n.filter(x=>x>=k).length;why='الحد نفسه محسوب لأن الشرط >= يشمل المساواة.';break;
 case 'MINMAX':formula=`=${v.logic}(A2:C2)`;value=n.length?(v.logic==='MIN'?Math.min(...n):Math.max(...n)):0;why='تُختار أصغر أو أكبر قيمة رقمية في النطاق.';break;
 case 'CONCATENATE':formula='=CONCATENATE(A2," ",B2)';value=v.a+' '+v.b;why='المسافة داخل علامتي التنصيص تُضاف بين النصين.';break;
 case 'VLOOKUP':formula='=VLOOKUP(A2,D2:E4,2,FALSE)';value=({101:'قلم',102:'دفتر',103:'مسطرة'})[String(a)]||'#N/A';why='FALSE تعني مطابقة تامة. إذا غاب المفتاح عن أول عمود تظهر #N/A.';break;
 default:throw Error('هذا النوع غير مدعوم.');
 }return {value,formula,why};
}
const valid=(v,min,max)=>Number.isInteger(v)&&v>=min&&v<=max;
const transpose=rows=>rows[0].map((_,i)=>rows.map(r=>r[i]));
globalThis.MADAR_EXCEL_CORE={round,calculate,valid,transpose};
})();
