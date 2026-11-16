export const COURSE_REGISTRY=[{id:'office',name:'تطبيقات الحاسب المتقدمة',subjects:['Word','Excel','Access']},{id:'network',name:'التوجيه والتحويل ١',subjects:['Network']},{id:'os1',name:'نظم التشغيل 1',subjects:['OS1']}];
import {UNIT_NAMES} from './course-unit-names.mjs';
import access from './access-content.json' with {type:'json'};
export const ACCESS_BASE=access;
import excel from './excel-content-reviewed.json' with {type:'json'};
export const EXCEL_BASE=excel;
export const courseOf=id=>String(id||'').startsWith('os1-')?'OS1':String(id||'').startsWith('network-')?'Network':String(id||'').startsWith('excel-')?'Excel':String(id||'').startsWith('access-')?'Access':'Word';
export const courseFrom=req=>new URL(req.url).searchParams.get('subject')||'Word';
export const COURSES=['Word','Excel','Access'];
export function toOffice(d,subject="Excel"){return {bankVersion:d.bankVersion,unitNames:d.unitNames,lessons:d.lessons.map(l=>({id:l.id,sourceNumber:l.sourceNumber,subject,unit:subject==='Excel'&&l.id.startsWith('excel-workbook-')?'workbook':l.unit,title:l.title,video:l.video||null,summary:l.sections.find(s=>s.kind==='summary')?.text||'',sections:l.sections.filter(s=>s.kind!=='summary').map(({title,text,table,kind})=>({title,text,table,kind})),references:l.references,source_limit:l.source_limit,locator:l.locator})),questions:d.questions.filter(q=>!q.paused).map(q=>({...q,subject,unit:subject==='Excel'&&q.lesson.startsWith('excel-workbook-')?'workbook':q.unit}))};}
