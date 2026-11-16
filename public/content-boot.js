(async()=>{

 const preview=new URLSearchParams(location.search).has('contentPreview');window.MADAR_CONTENT_PREVIEW=preview;
 try{await Promise.all([import('/mistake-review.mjs'),import('/saved-lessons.mjs'),import('/word-bank-compat.mjs').then(m=>{window.MADAR_WORD_BANK_COMPATIBLE=m.wordBankCompatible;})]);const r=await fetch('/api/content'+(preview?'?preview=1':''),{cache:'no-store',signal:AbortSignal.timeout(15000)});if(!r.ok)throw Error();const value=await r.json();if(!Array.isArray(value.data?.lessons)||!Array.isArray(value.data?.questions))throw Error();window.MADAR_DATA=value.data;
 if(preview){const banner=document.createElement('div');banner.textContent='معاينة خاصة للمسودة · لا تُسجّل نتائج أو ملاحظات';banner.style.cssText='padding:12px;text-align:center;background:#50384b;color:#f4dab0';document.body.prepend(banner);}
 const script=document.createElement('script');script.src='/account-boot.js';document.body.append(script);
 }catch{const main=document.getElementById('main');main.replaceChildren();const p=document.createElement('p');p.textContent=preview?'تعذر تحميل المسودة. تأكد من دخول حساب المالك.':'تعذر تحميل آخر محتوى. أعد المحاولة عند عودة الاتصال.';const b=document.createElement('button');b.textContent='إعادة المحاولة';b.onclick=()=>location.reload();main.append(p,b);}
})();
