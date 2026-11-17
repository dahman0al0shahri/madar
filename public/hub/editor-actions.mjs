// Coordinate existing editor workflows through explicit model and UI adapters.
// This module never reads form elements, storage or browser globals directly.
export function createEditorActions({ editor, getDraft, readFields, reportValidity,
  saves, render, showError, notifySaved, showPreview, showDestinations,
  openDelete, closeDelete }) {
  let deleteId = null;

  function capture() {
    const fields = readFields();
    if (fields) editor.capture(fields);
  }
  function editAndRender(action) { action(); render(); saves.scheduleSave(); }
  function changed() { capture(); saves.scheduleSave(); }
  function courseChanged() {
    capture();
    editor.resetDestination();
    showDestinations(getDraft());
  }
  function preview() { capture(); showPreview(getDraft()); }
  async function save() {
    if (!reportValidity()) return;
    capture();
    try {
      const result = await editor.save();
      if (!result.saved) { showError(result.error); return; }
      notifySaved();
      render();
    } catch { /* The save controller exposes retry without discarding the draft. */ }
  }
  function requestDelete(id) { deleteId = id; openDelete(); }
  function confirmDelete() {
    editor.remove(deleteId);
    deleteId = null;
    closeDelete();
    render();
    saves.scheduleSave();
  }

  return { capture, changed, courseChanged, preview, save, requestDelete, confirmDelete,
    begin: () => editAndRender(editor.begin), cancel: () => editAndRender(editor.cancel),
    edit: id => editAndRender(() => editor.edit(id)) };
}
