// Own only this scene's observer and listeners; never remove another component's handlers.
export function createNewsFramePlayer({ frame, eventTarget, origin, observe, isPaused }) {
  if (!frame) return null;
  let showing = false, disposed = false;
  function send() {
    if (!disposed) frame.contentWindow?.postMessage({ type: 'madar-news-scene', active: showing, paused: isPaused() }, origin);
  }
  const observer = observe(entries => { showing = entries[0].isIntersecting; send(); });
  observer.observe(frame);
  function ready(event) {
    if (event.source === frame.contentWindow && event.origin === origin && event.data?.type === 'madar-news-ready') send();
  }
  frame.addEventListener('load', send);
  eventTarget.addEventListener('message', ready);
  return { sync: send, dispose() {
    if (disposed) return;
    disposed = true;
    observer.disconnect();
    frame.removeEventListener('load', send);
    eventTarget.removeEventListener('message', ready);
  } };
}
