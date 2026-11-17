async function saveEditor(){if(!$('#mh-editor-form').reportValidity())return;captureEditor();const u=state.editor;if(!u.title.trim()||!u.body.trim()){ $('#mh-editor-error').textContent='أدخل عنوان المستجد ونصه.';return;}if(!u.course&&u.places.includes('course')){$('#mh-editor-error').textContent='اختر مقررًا لظهور المستجد في رئيسيته.';return;}if(u.start&&u.end&&u.end<u.start){$('#mh-editor-error').textContent='نهاية الظهور يجب ألا تسبق بدايته.';return;}if(u.target.startsWith('lesson:')&&lessonBy(u.target.split(':')[1])?.course!==u.course){$('#mh-editor-error').textContent='اختر وجهة من المقرر نفسه.';return;}u.scene=u.course||'hub';const i=state.updates.findIndex(x=>x.id===u.id);if(i<0)state.updates.push(clone(u));else state.updates[i]=clone(u);dirty=true;try{await persist();say('تم حفظ المستجد في المعاينة فقط.');render();}catch{}}
  root.addEventListener('submit',e=>{e.preventDefault();if(e.target.id==='mh-editor-form')saveEditor();});
  root.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.tagName==='INPUT'&&e.target.closest('#mh-editor-form')){e.preventDefault();saveEditor();}if(e.key==='Enter'&&e.target.id==='mh-query')e.preventDefault();});
  root.addEventListener('keydown',e=>{keyboard=true;if(e.key==='Escape'){const dialog=$('dialog[open]');if(dialog){e.preventDefault();dialog.close();return;}if(!$('#mh-picker').hidden){$('#mh-picker').hidden=true;$('#mh-picker-button').setAttribute('aria-expanded','false');$('#mh-picker-button').focus();}}});
  root.addEventListener('pointerdown',()=>keyboard=false);
  root.addEventListener('focusin',e=>{if(keyboard&&e.target.closest('.mh-carousel')&&e.target.id!=='mh-pause')setPaused(true);});
  document.addEventListener('click',e=>{if(!e.target.closest('.mh-picker-wrap')){$('#mh-picker').hidden=true;$('#mh-picker-button').setAttribute('aria-expanded','false');}});
  window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
  window.addEventListener('openai:set_globals',e=>{const next=e.detail?.globals?.widgetState?.privateContent?.hub;if(next&&!dirty){state=normalize(next);render();}});
  motionPreference.addEventListener('change',e=>{if(e.matches)setPaused(true);});
  render();status(restored?'استُعيدت بيانات المعاينة':'');
  requestAnimationFrame(()=>{if(motionPreference.matches)setPaused(true);});
  // Read-only diagnostics for the local acceptance tests; never academic evidence.
  root.previewState=()=>clone(state);
})();
