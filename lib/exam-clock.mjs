import {clockMarkup} from '../public/exam-clock-core.mjs';
export {clockSnapshot} from '../public/exam-clock-core.mjs';

export function addExamClock(response) {
  // Only decorate successful HTML; authorization checks and API payloads stay intact.
  if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) return response;
  const decorated = new HTMLRewriter()
    .on('head', { element(el) { el.append('<link rel="stylesheet" href="/exam-clock.css">', { html: true }); } })
    .on('body', { element(el) { el.prepend(clockMarkup(), { html: true }); el.append('<script type="module" src="/exam-clock.js"></script>', { html: true }); } })
    .transform(response);
  // A cached page must not bootstrap the timer from an old server timestamp.
  decorated.headers.set('Cache-Control', 'private, no-store');
  return decorated;
}
