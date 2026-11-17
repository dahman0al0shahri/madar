  const saves = createSaveController({
    getState: () => stateModel.value,
    write: environment.write,
    onDirty: value => { dirty = value; },
    onStatus: (phase, error) => {
      const messages = { pending: 'تغييرات بانتظار الحفظ', saving: 'جارٍ الحفظ…',
        saved: environment.savedMessage, failed: environment.hosted ? error?.message || 'لم يكتمل الحفظ' : 'لم يكتمل الحفظ' };
      status(messages[phase]);
      if (phase === 'saved') $('#mh-error').hidden = true;
    },
    onError: error => { status(environment.hosted ? error.message || 'لم يكتمل الحفظ' : 'لم يكتمل الحفظ'); $('#mh-error').hidden = false; },
    beforeLeave: async () => {
      if (!environment.hosted) return;
      const frame = $('#mh-network-lab');
      const lab = frame?.contentWindow?.document.getElementById('madar-labs');
      if (lab?.flushSave) await lab.flushSave();
      syncLessonProgress(frame);
      if (window.MADAR_NOTES?.hasPending()) {
        await window.MADAR_NOTES.retry();
        if (window.MADAR_NOTES.hasPending()) throw Error('ملاحظتك لم تُحفظ بعد');
      }
    },
  });
  const persist = saves.persist;
  const scheduleSave = saves.scheduleSave;
  const guarded = saves.guard;

