// Delegation owns listener lifetimes; actions own model and browser operations.
// Returning disposal lets a future remount remove exactly the listeners it added.
export function bindHubEvents({ root, documentTarget, actions, clickActions, dataActions }) {
  const listeners = [];
  function listen(target, name, handler) {
    target.addEventListener(name, handler);
    listeners.push(() => target.removeEventListener(name, handler));
  }
  listen(root, 'click', async event => {
    const button = event.target.closest('button');
    if (!button) return;
    const handler = clickActions[button.id];
    if (handler) { await handler(button, event); return; }
    for (const [key, action] of Object.entries(dataActions)) {
      if (button.dataset[key] !== undefined) { await action(button.dataset[key], button, event); return; }
    }
  });
  for (const name of ['input', 'change', 'submit', 'keydown', 'pointerdown', 'focusin']) {
    if (actions[name]) listen(root, name, actions[name]);
  }
  listen(documentTarget, 'click', actions.outsideClick);
  return () => { for (const dispose of listeners.splice(0)) dispose(); };
}
