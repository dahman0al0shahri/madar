import {accessBankCompatible} from './access-bank-compat.mjs';
import {wordBankCompatible} from './word-bank-compat.mjs';
const uuid=x=>typeof x==='string'&&/^[0-9a-f-]{36}$/.test(x);
const index=x=>Number.isInteger(x)&&x>=0&&x<4;
export function validReview(x){
 if(x==null)return true;
 return x.schema===1&&uuid(x.id)&&['all','Word','Excel','Access'].includes(x.filter)&&['practice','exam'].includes(x.mode)&&typeof x.finished==='boolean'&&x.banks&&['Word','Excel'].every(k=>typeof x.banks[k]==='string'&&x.banks[k].length<=80)&&Array.isArray(x.items)&&x.items.length>0&&x.items.length<=1000&&Number.isInteger(x.index)&&x.index>=0&&x.index<x.items.length&&x.items.every(i=>i&&['Word','Excel','Access'].includes(i.subject)&&(i.subject!=='Access'||typeof x.banks.Access==='string'&&x.banks.Access.length<=80)&&typeof i.id==='string'&&(i.subject==='Word'?/^mcq26-\d{3}$/:i.subject==='Access'?/^access-mcq-\d{3}$/:/^excel-mcq-\d{3}$/).test(i.id)&&uuid(i.eventId)&&(i.answer===null||index(i.answer))&&typeof i.recorded==='boolean'&&(!i.recorded||i.answer!==null))&&new Set(x.items.map(i=>i.id)).size===x.items.length&&(!x.finished||x.items.every(i=>i.recorded));
}
export function validReviewHistory(x){return x===undefined||(Array.isArray(x)&&x.length<=30&&x.every(h=>h&&uuid(h.id)&&['all','Word','Excel','Access'].includes(h.filter)&&['exam','practice'].includes(h.mode)&&Number.isInteger(h.total)&&h.total>0&&h.total<=1000&&Number.isInteger(h.score)&&h.score>=0&&h.score<=h.total&&typeof h.date==='string'&&h.date.length<=40&&Number.isFinite(Date.parse(h.date))));}
export function activeMistakes(word,excel,wordIds,events,access={questions:[]},accessEvents=[]){
 const latest=new Map();for(const e of [...(events||[]),...accessEvents])if(e.kind==='attempt'&&!latest.has(e.payload?.question))latest.set(e.payload.question,e.payload);
 return [...word.questions.filter(q=>wordIds.includes(q.id)).map(q=>({...q,subject:'Word'})),...excel.questions.filter(q=>latest.get(q.id)?.correct===false).map(q=>({...q,subject:'Excel'})),...access.questions.filter(q=>latest.get(q.id)?.correct===false).map(q=>({...q,subject:'Access'}))];
}
export function reviewMatches(s,banks){return validReview(s)&&s&&s.items.every(i=>banks[i.subject]?.questions.some(q=>q.id===i.id))&&s.items.every(i=>(s.banks[i.subject]===banks[i.subject].bankVersion||i.subject==='Word'&&wordBankCompatible(s.banks.Word,banks.Word.bankVersion,s.items.filter(x=>x.subject==='Word').map(x=>x.id),banks.Word.questions)||i.subject==='Access'&&accessBankCompatible(s.banks.Access,banks.Access.bankVersion,s.items.filter(x=>x.subject==='Access').map(x=>x.id),banks.Access.questions)));}
