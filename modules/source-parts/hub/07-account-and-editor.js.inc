/* hub:editor-composition */
  const editor = createEditorController({ getState: () => state, lessonBy, saves, persist,
    now: () => Date.now(), today: nowDay });
  const editorViews = createEditorViews({ getState: () => state, getAccountFilter: () => accountFilter,
    courses, lessons, profile, available, canLesson, lessonBy, lessonPosition, heading, esc, icon,
    hosted: environment.hosted, getGrants: () => config?.grants || {} });
  function account(){return editorViews.account();}
  function admin(){return editorViews.admin();}
  const targetOptions = editorViews.targetOptions;
  function captureEditor() {
    const form = $('#mh-editor-form');
    if (!form) return;
    const fields = Object.fromEntries(['title','body','course','placement','status','date','start','end','duration','destination']
      .map(name => [name, form.elements.namedItem(name).value]));
    fields.pin = form.elements.namedItem('pin').checked;
    editor.capture(fields);
  }

