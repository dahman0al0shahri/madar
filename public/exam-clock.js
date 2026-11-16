import {clockMarkup} from './exam-clock-core.mjs';
(() => {
  const serverRendered = !!document.getElementById('exam-countdown');
  if (!serverRendered) document.body.insertAdjacentHTML('afterbegin', clockMarkup());
  const root = document.getElementById('exam-countdown');
  if (!root || root.dataset.initialized) return;
  root.dataset.initialized = 'true';
  const target = Number(root.dataset.target), start = Number(root.dataset.start);
  let serverNow = Number(root.dataset.now), anchor = performance.now(), syncing = false;
  let ready = serverRendered;
  const fields = ['hours', 'minutes', 'seconds'].map(k => root.querySelector(`[data-clock="${k}"]`));
  const bar = root.querySelector('.exam-clock-track'), fill = bar.firstElementChild;
  const status = root.querySelector('.exam-clock-status'), motion = root.querySelector('.exam-clock-motion');
  const hideButton = root.querySelector('.exam-clock-hide');
  const returnBar = document.querySelector('.exam-clock-return'), showButton = returnBar.querySelector('button');
  const hiddenKey = `madar-clock-hidden:${target}`;
  function setHidden(hidden, focus = false) {
    root.hidden = hidden; returnBar.hidden = !hidden;
    document.documentElement.classList.toggle('exam-clock-collapsed', hidden);
    size();
    if (focus) (hidden ? showButton : hideButton).focus({ preventScroll: true });
  }
  hideButton.addEventListener('click', () => {
    setHidden(true, true);
    try { localStorage.setItem(hiddenKey, '1'); } catch {}
  });
  showButton.addEventListener('click', () => {
    setHidden(false, true); tick(); sync();
    try { localStorage.removeItem(hiddenKey); } catch {}
  });
  try { setHidden(localStorage.getItem(hiddenKey) === '1'); } catch {}
  window.addEventListener('storage', event => {
    if (event.key === hiddenKey || event.key === null) {
      try { setHidden(localStorage.getItem(hiddenKey) === '1'); } catch {}
    }
  });
  if (!ready) { fields.forEach(el => el.textContent = '—'); delete root.dataset.ended; status.textContent = ''; }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches;
  try { paused = paused || sessionStorage.getItem('madar-clock-still') === '1'; } catch {}
  function setMotion() {
    root.dataset.still = String(paused || reduced.matches);
    motion.setAttribute('aria-pressed', String(paused || reduced.matches));
    const label = paused ? 'تشغيل حركة المؤقت الزخرفية' : 'إيقاف حركة المؤقت الزخرفية';
    motion.setAttribute('aria-label', label); motion.title = label;
    motion.querySelector('path').setAttribute('d', paused ? 'M9 5l10 7-10 7z' : 'M8 6v12M16 6v12');
  }
  motion.addEventListener('click', () => { paused = !paused; setMotion(); try { sessionStorage.setItem('madar-clock-still', paused ? '1' : '0'); } catch {} });
  reduced.addEventListener('change', setMotion); setMotion();
  function size() {
    document.documentElement.style.setProperty('--exam-clock-height', `${Math.ceil(root.getBoundingClientRect().height)}px`);
    const top = document.querySelector('.top');
    if (top) top.classList.toggle('exam-clock-sticky-offset', ['sticky', 'fixed'].includes(getComputedStyle(top).position));
  }
  new ResizeObserver(size).observe(root); size();
  window.addEventListener('resize', size);
  function tick() {
    if (!ready) return;
    const now = serverNow + performance.now() - anchor;
    const seconds = Math.max(0, Math.ceil((target - now) / 1000));
    const values = [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60];
    fields.forEach((el, i) => {
      const text = String(values[i]).padStart(2, '0');
      if (el.textContent !== text) {
        el.textContent = text;
        if (!root.hidden && !paused && !reduced.matches && !document.hidden && !root.dataset.ended) el.animate([{ opacity: .55, transform: 'translateY(-3px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 220 });
      }
    });
    const fraction = Math.min(1, Math.max(0, (now - start) / (target - start)));
    fill.style.transform = `scaleX(${fraction})`;
    bar.setAttribute('aria-valuenow', String(Math.floor(fraction * 100)));
    if (!seconds && !root.dataset.ended) { root.dataset.ended = 'true'; status.textContent = 'حان موعد الاختبار'; }
    if (seconds && root.dataset.ended) { delete root.dataset.ended; status.textContent = ''; }
  }
  async function sync() {
    if (syncing || document.hidden) return;
    syncing = true;
    const sent = performance.now();
    try {
      const response = await fetch('/api/exam-clock', { cache: 'no-store' });
      if (!response.ok) throw new Error('clock unavailable');
      const data = await response.json();
      if (Number.isFinite(data.now) && data.target === target) {
        anchor = performance.now(); serverNow = data.now + (anchor - sent) / 2;
        ready = true; if (!root.dataset.ended) status.textContent = '';
        tick();
      }
    } catch { if (!ready) status.textContent = 'تعذر تحديث الوقت، جارٍ إعادة المحاولة'; }
    finally { syncing = false; }
  }
  tick(); sync();
  setInterval(() => { if (!document.hidden) tick(); }, 250);
  setInterval(sync, 300000);
  setInterval(() => { if (!ready) sync(); }, 15000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) { tick(); sync(); } });
  window.addEventListener('pageshow', sync);
  window.addEventListener('online', sync);
})();
