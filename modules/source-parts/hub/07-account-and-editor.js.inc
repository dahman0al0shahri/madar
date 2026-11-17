/* hub:editor-composition */
  const editor = createEditorController({ getState: () => state, lessonBy, saves, persist,
    now: () => Date.now(), today: nowDay });
  const editorViews = createEditorViews({ getState: () => state, getAccountFilter: () => accountFilter,
    courses, lessons, profile, available, canLesson, lessonBy, lessonPosition, heading, esc, icon, scene,
    hosted: environment.hosted, getGrants: () => config?.grants || {} });
  function account(){return editorViews.account();}
  function admin(){return editorViews.admin();}
  function readEditorFields() {
    const form = $('#mh-editor-form');
    if (!form) return;
    const fields = Object.fromEntries(['title','body','course','placement','status','date','start','end','duration','destination']
      .map(name => [name, form.elements.namedItem(name).value]));
    fields.pin = form.elements.namedItem('pin').checked;
    return fields;
  }

  const editorActions = createEditorActions({ editor, getDraft: () => stateModel.value.editor,
    readFields: readEditorFields, reportValidity: () => $('#mh-editor-form').reportValidity(), saves, render,
    showError: message => { $('#mh-editor-error').textContent = message; },
    notifySaved: () => say(environment.hosted ? 'تم حفظ المستجد.' : 'تم حفظ المستجد في المعاينة فقط.'),
    showPreview: paintEditorPreview,
    showDestinations: update => { $('#mh-editor-form [name=destination]').innerHTML = editorViews.targetOptions(update); },
    openDelete: () => $('#mh-confirm').showModal(), closeDelete: () => $('#mh-confirm').close() });
