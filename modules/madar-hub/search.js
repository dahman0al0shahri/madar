let searchLimit=20;
function searchText(value){return String(value||'').normalize('NFKD').replace(/\p{M}/gu,'').replace(/ـ/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/[٠-٩]/g,c=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(c))).toLowerCase().trim();}
function search(reset=true){
 if(reset)searchLimit=20;
 const query=searchText($('#mh-query').value),words=query.split(/\s+/).filter(Boolean),scope=$('#mh-search-scope').value;
 const matches=text=>words.every(w=>searchText(text).includes(w));
 const aliases={office:'أوفيس Office',network:'شبكات Networking',word:'Word وورد ورد',excel:'Excel إكسل اكسيل',access:'Access أكسس اكسيس',vlan:'VLAN فيلان',trunk:'Trunk ترنك',inter:'Inter VLAN انتر فيلان'};
 const courseHits=available().filter(id=>(scope==='all'||scope===id)&&matches(courses[id].name+' '+aliases[id])).map(id=>({title:courses[id].name,sub:'مقرر',route:`course:${id}:home`}));
 const hits=lessons.filter(l=>canLesson(l)&&(scope==='all'||scope===l.course)&&matches(l.title+' '+l.kind+' '+courses[l.course].name+' '+(aliases[l.section]||'')+' '+(l.theory?l.theory.english+' '+l.theory.terms.join(' '):''))).map(l=>({title:l.title,sub:courses[l.course].name+' · '+l.kind,route:`lesson:${l.id}`}));
 const all=[...courseHits,...hits],shown=all.slice(0,searchLimit);
 $('#mh-search-results').innerHTML='<p class="mh-search-count" role="status">'+(all.length?'عرض '+shown.length+' من '+all.length+' نتيجة':'لا توجد نتائج مطابقة؛ جرّب كلمة أقصر أو غيّر النطاق.')+'</p>'+shown.map(h=>`<button class="mh-search-hit" data-search-go="${esc(h.route)}"><span>${esc(h.title)}<small>${esc(h.sub)}</small></span>${icon('arrow-left')}</button>`).join('')+(all.length>shown.length?'<button id="mh-search-more">عرض المزيد</button>':'');
 paintIcons();
}
