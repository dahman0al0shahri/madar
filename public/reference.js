/* Unified catalogue. Lesson links keep the existing course readers and saves. */
(()=>{'use strict';
const courses=[{id:'word',name:'الوورد',en:'Word',letter:'W'},{id:'excel',name:'الإكسل',en:'Excel',letter:'X'},{id:'access',name:'الأكسس',en:'Access',letter:'A'}];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ar=n=>Number(n).toLocaleString('ar-SA'),normalize=s=>String(s??'').normalize('NFKC').replace(/[\u064b-\u065f\u0670\u0640]/g,'').replace(/[أإآ]/g,'ا').toLocaleLowerCase('ar');
let root=null,request=null,generation=0,scope='all',query='',loaded={};
const workbook=window.MADAR_EXCEL_WORKBOOK;
const href=(id,l)=>(id==='word'?'#learn/':'#'+id+'/')+encodeURIComponent(l.id);
function results(){if(!root)return;const terms=normalize(query).split(/\s+/).filter(Boolean);let count=0,failed=0;
const html=courses.filter(c=>scope==='all'||scope===c.id).map(c=>{const data=loaded[c.id];if(!data){failed++;return '<section class="reference-course ref-'+c.id+'"><h2>'+c.name+'</h2><p>ما اكتمل تحميل دروس '+c.name+'.</p><button data-reference-retry>إعادة التحميل</button></section>';}
const lessons=data.lessons.filter(l=>terms.every(t=>normalize([l.title,c.name,c.en,workbook.isLesson(l)?'ملفات التمارين '+workbook.intro:'',...(data.unitNames?[data.unitNames[Number(l.unit)-1]]:[])].join(' ')).includes(t)));count+=lessons.length;
if(!lessons.length)return '';
const units=[...new Set(lessons.map(l=>l.unit))];
return '<section class="reference-course ref-'+c.id+'"><header><span class="reference-program-mark" aria-hidden="true">'+c.letter+'</span><div><h2>'+c.name+'</h2><span>'+ar(lessons.length)+' درسًا</span></div><a href="#'+c.id+'" aria-label="افتح قسم '+c.name+'">افتح القسم ↗</a></header>'+units.map(u=>{const rows=lessons.filter(l=>l.unit===u),name=data.unitNames?.[Number(u)-1]||(u==='workbook'?'ملفات التمارين':'الوحدة '+ar(u));return '<details class="reference-unit" '+(terms.length?'open':'')+'><summary><span><small>'+((u==='workbook'||c.id==='excel'&&rows.every(l=>l.id.startsWith('excel-workbook-')))?'تطبيق عملي':'الوحدة '+ar(u))+'</small><strong>'+esc(name)+'</strong></span><span class="reference-count">'+ar(rows.length)+'</span></summary>'+((c.id==='excel'&&rows.every(workbook.isLesson))?'<div class="panel"><p>'+workbook.intro+'</p>'+workbook.markup()+'</div>':'')+'<ul>'+rows.map(l=>'<li><a href="'+href(c.id,l)+'"><span>'+(workbook.isLesson(l)?ar(workbook.number(l))+'. ':'')+esc(l.title)+'</span><span aria-hidden="true">←</span></a></li>').join('')+'</ul></details>';}).join('')+'</section>';
}).join('');
root.querySelector('#reference-results').innerHTML=html||'<div class="reference-empty"><h2>ما لقينا درسًا بهذا الاسم</h2><p>جرّب كلمة أقصر أو اختر «كل البرامج».</p><button id="reference-clear">مسح البحث</button></div>';
root.querySelector('#reference-count').textContent=ar(count)+' درسًا'+(query.trim()?' يطابق بحثك':' في المرجع')+(failed?' · بعض البرامج لم يكتمل تحميلها':'');
root.querySelectorAll('[data-reference-scope]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.referenceScope===scope)));
root.querySelectorAll('[data-reference-retry]').forEach(b=>b.onclick=()=>mount());
root.querySelector('#reference-clear')?.addEventListener('click',()=>{query='';root.querySelector('#reference-search').value='';results();root.querySelector('#reference-search').focus();});
}
async function mount(){unmount();root=document.querySelector('#main');const current=++generation;request=new AbortController();loaded={word:window.MADAR_DATA};
root.innerHTML='<section class="reference-hero"><div class="reference-planes" aria-hidden="true"><i></i><i></i><i></i></div><p class="eyebrow">ثلاثة برامج · مرجع واحد</p><h1>المرجع</h1><p>دور على الدرس اللي تحتاجه، وافتح شرحه وتطبيقه من مكان واحد.</p><div class="reference-search"><label for="reference-search">وش تبي تراجع؟</label><input id="reference-search" type="search" maxlength="120" placeholder="ابحث باسم الدرس أو الوحدة…" autocomplete="off"></div></section><nav class="reference-filters" aria-label="تصفية المرجع حسب البرنامج">'+[{id:'all',name:'كل البرامج'},...courses].map(c=>'<button type="button" data-reference-scope="'+c.id+'" aria-pressed="'+(c.id===scope)+'">'+c.name+'</button>').join('')+'</nav><p id="reference-count" role="status" aria-live="polite">نحمّل فهرس البرامج…</p><div id="reference-results" class="reference-grid" aria-busy="true"></div>';
root.querySelector('#reference-search').value=query;
root.querySelector('#reference-search').oninput=e=>{query=e.target.value;results();};
root.querySelectorAll('[data-reference-scope]').forEach(b=>b.onclick=()=>{scope=b.dataset.referenceScope;results();});
const responses=await Promise.allSettled(courses.slice(1).map(async c=>{const r=await fetch('/api/content?subject='+c.en+(window.MADAR_CONTENT_PREVIEW?'&preview=1':''),{cache:'no-store',signal:AbortSignal.any([request.signal,AbortSignal.timeout(15000)])});if(!r.ok)throw Error('content');const {data:d}=await r.json();if(!Array.isArray(d?.lessons))throw Error('shape');return d;}));
if(current!==generation||!root)return;responses.forEach((r,i)=>{if(r.status==='fulfilled')loaded[courses[i+1].id]=r.value;});results();root.querySelector('#reference-results').setAttribute('aria-busy','false');window.MADAR_TRANSITIONS?.afterRender();}
function unmount(){generation++;request?.abort();request=null;root=null;}
window.MADAR_REFERENCE={mount,unmount};
})();
