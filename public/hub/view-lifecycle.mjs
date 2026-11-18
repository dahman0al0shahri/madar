// Own route resources separately from templates and application data.
export function createViewLifecycle({ begin, resolve, redirect, beforeReplace, replace,
  mount, finish, dispose }) {
  let stopped = false;
  function render() {
    if (stopped) return;
    begin();
    const page = resolve();
    if (page.redirect) { redirect(page.redirect); return; }
    beforeReplace();
    replace(page);
    mount(page);
    finish();
  }
  function stop() {
    if (stopped) return;
    stopped = true;
    dispose();
  }
  return { render, dispose: stop };
}
