import BANK from './srwe-bank.json' with {type:'json'};
const ids=new Map(BANK.questions.map(q=>[q.localId,q]));
const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
const records=x=>object(x)&&Object.entries(x).every(([id,r])=>ids.has(id)&&object(r)&&Array.isArray(r.choices)&&r.choices.length<=4&&new Set(r.choices).size===r.choices.length&&r.choices.every(i=>Number.isInteger(i)&&i>=0&&i<4)&&['graded','revealed','translationUsed','previouslyExposed'].every(k=>typeof r[k]==='boolean')&&(!r.graded||r.choices.length===ids.get(id).correct.length));
export function validSrweState(x){
 if(x?.version!==2||x.bank!==BANK.bankVersion||!records(x.study)||!Array.isArray(x.history)||x.history.length>5000||!object(x.meta)||Object.keys(x.meta).length>84||!Object.entries(x.meta).every(([id,m])=>ids.has(id)&&object(m)&&Number.isInteger(m.mistakes)&&m.mistakes>=0&&m.mistakes<=100000&&typeof m.marked==='boolean'&&typeof m.note==='string'&&m.note.length<=6000))return false;
 if(x.location!==null&&!(typeof x.location==='string'&&/^(study-controls|q-[456]-\d\d|page-\d{1,2})$/.test(x.location)))return false;
 if(x.exam!==null){const e=x.exam;if(!object(e)||typeof e.id!=='string'||e.id.length>80||typeof e.submitted!=='boolean'||!Array.isArray(e.ids)||!e.ids.length||e.ids.length>84||new Set(e.ids).size!==e.ids.length||e.ids.some(id=>!ids.has(id))||!records(e.responses)||Object.keys(e.responses).some(id=>!e.ids.includes(id))||!e.submitted&&Object.values(e.responses).some(r=>r.graded||r.revealed))return false;}
 return x.history.every(h=>object(h)&&typeof h.event==='string'&&h.event.length<=40&&(!h.questionId||ids.has(h.questionId))&&(!h.answers||Array.isArray(h.answers)&&h.answers.length<=84&&h.answers.every(a=>ids.has(a.questionId)&&Array.isArray(a.selected)&&a.selected.every(s=>'ABCD'.includes(s)&&s.length===1))));
}
export {BANK as SRWE_BANK};
