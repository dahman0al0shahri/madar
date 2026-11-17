function homeView(){
 $('#main').innerHTML=`<section class="opening-stage" aria-labelledby="launch-title">
<picture class="festival-picture" aria-hidden="true"><source media="(max-width:600px)" srcset="assets/festival-mobile.svg"><img class="festival-art" src="assets/festival.svg" width="1440" height="900" alt=""></picture>
<div class="stage-top"><span class="opening-edition"><i></i> احتفالًا بأول خطوة</span><span class="stage-serial" lang="en">THE OPENING EDITION / 001</span></div>
<div class="opening-content"><div class="opening-emblem" aria-hidden="true"><span>✦</span></div><p class="opening-overline">من فكرةٍ صغيرة… إلى بدايةٍ تستحق الاحتفال.</p>
<h1 id="launch-title" class="opening-heading"><span class="headline-intro">لأنك <span class="story-foundation">أساس<svg class="foundation-stroke" viewBox="0 0 180 18" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="foundation-gold"><stop stop-color="#ae7940"/><stop offset=".45" stop-color="#f3d79b"/><stop offset="1" stop-color="#d5ac6a"/></linearGradient></defs><path d="M0 16 Q83 0 180 4 L166 7 Q85 4 0 16Z" fill="url(#foundation-gold)"/></svg></span> الحكاية..</span> <span class="headline-main">بدينا <span class="gold-word">مدار.</span></span></h1>
<p class="opening-description">مساحة تعليمية تعرف فيها وش خطوتك الجاية، وتفهم ليه تسويها، وتشوف دليل تقدّمك.</p><div class="opening-actions"><button class="button primary" data-jump="study-edition">ابدأ تعلّمك <span aria-hidden="true">↓</span></button><button class="replay-celebration" type="button"><span aria-hidden="true">✦</span> احتفل معنا</button></div>
</div>
<div class="celebration-controls"><button class="stop-celebration" type="button" hidden>إيقاف القصاصات</button></div>
<div class="opening-footer"><span>بدايتنا أجمل بوجودك</span><button data-jump="study-edition">يلا نبدأ نذاكر <span aria-hidden="true">↓</span></button><span lang="en">A NEW ORBIT BEGINS</span></div>
<canvas class="celebration-canvas" aria-hidden="true"></canvas></section>
 <section id="study-edition" class="study-edition" aria-labelledby="edition-title">
 <div class="edition-intro"><p class="eyebrow">تطبيقات الحاسب المتقدمة</p><h2 id="edition-title">تطبيقات الحاسب المتقدمة</h2><p>مذاكرة الاختبار الدوري الأول</p><p class="muted">اختر البرنامج اللي تبي تذاكره، وابدأ من المكان اللي يناسبك.</p></div>
 <div class="study-programs">
 <a class="study-program study-word" href="#word"><span class="study-program-name">الوورد <small lang="en">Microsoft Word</small></span><span>الدروس والمراجعة <b aria-hidden="true">←</b></span></a>
 <a class="study-program study-excel" href="#excel"><span class="study-program-name">الإكسل <small lang="en">Microsoft Excel</small></span><span>الدروس والتدريب العملي <b aria-hidden="true">←</b></span></a>
 <a class="study-program study-access" href="#access"><span class="study-program-name">الأكسس <small lang="en">Microsoft Access</small></span><span>الدروس والتدريب العملي <b aria-hidden="true">←</b></span></a>
 </div>
 <div class="study-how"><h2>كيف تتعلّم في تطبيقات الحاسب المتقدمة<br><span>مذاكرة الاختبار الدوري الأول؟</span></h2><p>شاهد الشرح للفهم، وارجع للملخص للمراجعة. جرّب التدريب العملي في الإكسل والأكسس، أو اختبر نفسك وراجع أخطاءك. والدروس اللي تبي ترجع لها، احفظها في «برجع لها».</p><p class="muted">اختر اللي تحتاجه، بالترتيب اللي يناسبك.</p><div class="study-shortcuts"><a href="#quiz">اختبر نفسك</a><a href="#mistakes">أخطائي</a><a href="#saved">برجع لها</a></div></div>
 </section><p class="madar-origin-date">بدأت حكاية مدار في ٢ أكتوبر ٢٠٢٦</p>`;
 $$('[data-jump]').forEach(b=>b.onclick=()=>document.getElementById(b.dataset.jump)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'}));
 window.MADAR_UPDATES?.mount($('#main'));
}
