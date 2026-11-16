/* Deliberately memory-only: every new document starts dark, regardless of OS/storage. */
(()=>{
 const root=document.documentElement;
 function set(light){
  root.dataset.appearance=light?'light':'dark';root.style.colorScheme=light?'light':'dark';
  document.querySelector('meta[name="color-scheme"]')?.setAttribute('content',light?'light':'dark');
  document.querySelectorAll('.appearance-toggle').forEach(b=>{
   b.setAttribute('aria-pressed',String(light));
   b.setAttribute('aria-label',light?'تفعيل المظهر الداكن':'تفعيل المظهر الفاتح');
   b.title=light?'العودة إلى أجواء مَدار الداكنة':'جرّب ألوان المريمية الفاتحة';
   b.querySelector('.appearance-label').textContent=light?'المظهر الداكن':'المظهر الفاتح';
  });
  document.dispatchEvent(new CustomEvent('madar:appearance',{detail:{light}}));
 }
 function init(){
  const button=document.createElement('button');button.type='button';button.id='theme-toggle';button.className='appearance-toggle';
  button.innerHTML='<span class="appearance-swatch" aria-hidden="true"><i>✦</i><i>✦</i><i>✦</i></span><span class="appearance-label"></span>';
  button.addEventListener('click',()=>set(root.dataset.appearance!=='light'));
  const header=document.querySelector('header.top')||document.querySelector('main header')||document.querySelector('header');
  if(header)header.append(button);else{const bar=document.createElement('div');bar.className='appearance-bar';bar.append(button);document.body.prepend(bar);}
  set(false);
 }
 init();window.addEventListener('pageshow',e=>{if(e.persisted)set(false);});
})();
