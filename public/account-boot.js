(async()=>{
 const ctx=window.MADAR_ACCOUNT={user:null,available:false,revision:0,state:null,error:null};
 if(window.MADAR_CONTENT_PREVIEW){Object.assign(ctx,{available:true,signIn:'/#account'});}else try{
  const r=await fetch('/api/account',{cache:'no-store',signal:AbortSignal.timeout(12000)});if(!r.ok)throw Error('account');
  Object.assign(ctx,await r.json(),{available:true});
  if(ctx.user){const p=await fetch('/api/progress',{cache:'no-store',signal:AbortSignal.timeout(12000)});if(!p.ok)throw Error('progress');Object.assign(ctx,await p.json());}
 }catch(e){ctx.error='تعذر التحقق من حسابك. يمكنك تصفح الدروس؛ أعد المحاولة قبل حفظ تقدّم جديد.';}
 window.MadarNavigation?.update(ctx.error?null:ctx);
 const helper=document.createElement('script');helper.src='/account.js';helper.onload=()=>{const script=document.createElement('script');script.src='/app.js';document.body.append(script)};document.body.append(helper);
})();
