// These are existing client-side editing operations, not an authorization boundary.
// Server authorization remains authoritative. No permissions are granted at import.
export function createAccessActions({ getState, getGrants, hosted, saves,
  resetAccountFilter, render, syncViewer }) {
  function setGrants(id, text) {
    if (!hosted || !id) return;
    getGrants()[id] = text.split(',').map(value => value.trim()).filter(Boolean);
    saves.scheduleSave();
  }

  function setCourseAccess(id, value) {
    if (!id) return;
    getState().access[id] = value;
    saves.scheduleSave();
  }

  function setContentAccess(id, value) {
    if (!id) return;
    getState().contentAccess[id] = value;
    saves.scheduleSave();
  }

  async function switchViewer(next) {
    await saves.guard(async () => {
      getState().viewer = next;
      resetAccountFilter();
      render();
      await saves.persist();
    });
    syncViewer(getState().viewer);
  }

  return { setGrants, setCourseAccess, setContentAccess, switchViewer };
}
