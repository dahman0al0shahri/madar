(()=>{'use strict';const nav=document.createElement('nav');nav.id='madar-course-navigation';nav.setAttribute('aria-label','التنقل بين مقررات مدار');nav.innerHTML='<a href="/">← رئيسية مدار</a><a href="/account">حسابك في مدار</a><strong>تطبيقات الحاسب المتقدمة</strong><details><summary>المقررات</summary><a href="/#courses">جميع المقررات</a><a href="/applications#home" aria-current="page">تطبيقات الحاسب المتقدمة</a><a href="/#course:os1:home">نظم التشغيل 1</a><a data-network-course hidden href="/#course:network:home">التوجيه والتحويل ١</a></details>';document.querySelector('.app-frame').before(nav);
 fetch('/api/madar',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(b=>{if(b?.allowed?.includes('network'))nav.querySelector('[data-network-course]').hidden=false;}).catch(()=>{});
 let rememberQueue=Promise.resolve();
 function remember(){const view=location.hash.slice(1).split('/')[0],id=location.hash.slice(1).split('/')[1];if(!['learn','excel','access'].includes(view)||!id)return;rememberQueue=rememberQueue.catch(()=>{}).then(async()=>{try{const s=await MadarStore.open('profile'),p=s.value||{version:1,visits:{},notes:{},latest:null};p.visits.office={lesson:id,step:0};p.latest='office';await s.save(p);}catch{nav.dataset.resumeSave="failed";}});}
 addEventListener('hashchange',remember);setTimeout(remember,1000);
})();


