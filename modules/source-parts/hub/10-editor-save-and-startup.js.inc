async function saveEditor() {
    if (!$('#mh-editor-form').reportValidity()) return;
    captureEditor();
    try {
      const result = await editor.save();
      if (!result.saved) { $('#mh-editor-error').textContent = result.error; return; }
      say(environment.hosted ? 'تم حفظ المستجد.' : 'تم حفظ المستجد في المعاينة فقط.');
      render();
    } catch { /* The save controller exposes retry without discarding the draft. */ }
  }
  window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
  window.addEventListener('openai:set_globals',e=>{const next=e.detail?.globals?.widgetState?.privateContent?.hub;if(next&&!dirty){state=stateModel.replace(next);render();}});
  motionPreference.addEventListener('change',e=>{if(e.matches)setPaused(true);});
  render();status(restored?'استُعيدت بيانات المعاينة':'');
  requestAnimationFrame(()=>{if(motionPreference.matches)setPaused(true);});
  // Read-only diagnostics for the local acceptance tests; never academic evidence.
  root.previewState=()=>clone(state);
})();
