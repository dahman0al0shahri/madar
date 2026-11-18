  window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
  window.addEventListener('pagehide', event => {
    // A back/forward-cache page stays live; dispose only a document being discarded.
    if (!event.persisted) { viewLifecycle.dispose(); disposeHubEvents(); clearTimeout(toastTimer); }
  });
  if (!environment.hosted) window.addEventListener('openai:set_globals',e=>{const next=e.detail?.globals?.widgetState?.privateContent?.hub;if(next&&!dirty){state=stateModel.replace(next);render();}});
  motionPreference.addEventListener('change',e=>{if(e.matches)setPaused(true);});
  /* hub:startup:start */
  render();status(restored?'استُعيدت بيانات المعاينة':'');
  /* hub:startup:end */
  requestAnimationFrame(()=>{if(motionPreference.matches)setPaused(true);});
  // Read-only diagnostics for the local acceptance tests; never academic evidence.
  root.previewState=()=>clone(state);
})().catch(()=>{const main=document.getElementById('mh-main');main.innerHTML='<p role="alert">تعذر تحميل بيانات مدار. لم نستبدل الحفظ السابق.</p><button onclick="location.reload()">إعادة المحاولة</button>';});
