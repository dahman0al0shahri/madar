import { cloneState } from './state.mjs';

// Inject storage, pending-work flushes and UI notifications. Never access the DOM here.
export function createSaveController({ getState, write, beforeLeave = async () => {},
  onDirty = () => {}, onStatus = () => {}, onError = () => {},
  schedule = setTimeout, cancel = clearTimeout, delay = 350 }) {
  let timer = null;
  let queue = Promise.resolve();
  let pendingAction = null;

  function markDirty() { onDirty(true); }
  function persist() {
    cancel(timer);
    timer = null;
    const snapshot = cloneState(getState());
    onStatus('saving');
    const job = queue.catch(() => {}).then(async () => {
      await write(snapshot);
      // An older response must not mark newer edits as saved.
      if (JSON.stringify(snapshot) === JSON.stringify(getState())) {
        onDirty(false);
        onStatus('saved');
      }
      return true;
    }).catch(error => {
      markDirty();
      onStatus('failed', error);
      onError(error);
      throw error;
    });
    queue = job;
    return job;
  }

  function scheduleSave() {
    markDirty();
    onStatus('pending');
    cancel(timer);
    timer = schedule(() => { void persist().catch(() => {}); }, delay);
  }

  async function guard(action) {
    const request = { action };
    pendingAction = request;
    try {
      await beforeLeave();
      await persist();
      // Only the latest uncancelled navigation may proceed.
      if (pendingAction !== request) return false;
      pendingAction = null;
      await action();
      return true;
    } catch (error) {
      // Also surface failures in dependent notes/labs before the profile save.
      onError(error);
      return false;
    }
  }

  return {
    markDirty, persist, scheduleSave, guard,
    hasPendingAction: () => pendingAction !== null,
    cancelPendingAction() { pendingAction = null; },
    retry: () => pendingAction ? guard(pendingAction.action) : persist(),
  };
}
