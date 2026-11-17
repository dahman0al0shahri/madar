'use strict';
const activity=(type,fields)=>window.MADAR_ACTIVITY?.emit(type,fields);
const D=window.MADAR_DATA,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const L=id=>D.lessons.find(l=>l.id===id),Q=id=>D.questions.find(q=>q.id===id);
const compatibleWordSession=q=>!!q&&window.MADAR_WORD_BANK_COMPATIBLE(q.bankVersion||'mcq-2026-10-05',D.bankVersion,Array.isArray(q.items)?q.items.map(i=>i?.id):[],D.questions);
const OLD_KEY='madar-word-trial-v2',KEY='madar-word-trial-mcq-20261005', ar=n=>Number(n).toLocaleString('ar-SA');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link=l=>`#learn/${l.id}`;
let saved={bookmarks:[],mistakes:[],history:[],active:null}, quiz=null, lastResult=null, mode='summary', lastLesson='v01';
