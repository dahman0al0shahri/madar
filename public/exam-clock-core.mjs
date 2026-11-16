// Confirmed by the owner: 12 October 2026, 09:50 in Mecca (UTC+03).
export const examClock = Object.freeze({
  target: Date.parse('2026-10-12T09:50:00+03:00'),
  start: Date.parse('2026-10-12T00:00:00+03:00'),
  timezone: 'Asia/Riyadh'
});

export function clockSnapshot(now = Date.now()) {
  const remaining = Math.max(0, Math.ceil((examClock.target - now) / 1000));
  return { ...examClock, now, remaining,
    progress: Math.max(0, Math.min(1, (now - examClock.start) / (examClock.target - examClock.start))) };
}

export function clockMarkup(now = Date.now()) {
  // A finished exam is no longer an upcoming event on the course pages.
  if (now >= examClock.target) return '';
  const s = clockSnapshot(now), pad = n => String(n).padStart(2, '0');
  const units = [['hours', Math.floor(s.remaining / 3600), 'ساعة'], ['minutes', Math.floor(s.remaining / 60) % 60, 'دقيقة'], ['seconds', s.remaining % 60, 'ثانية']];
  return `<aside id="exam-countdown" dir="rtl" aria-labelledby="exam-clock-title" data-now="${now}" data-target="${s.target}" data-start="${s.start}" ${s.remaining ? '' : 'data-ended="true"'}>
    <div class="exam-clock-inner">
      <div class="exam-clock-heading"><span class="exam-clock-orbit" aria-hidden="true"><i></i></span><div><strong id="exam-clock-title">الباقي على اختبار التطبيقات فقط</strong><small>١٢ أكتوبر · ٩:٥٠ صباحًا <span>بتوقيت مكة</span></small></div></div>
      <div class="exam-clock-time" role="timer" aria-live="off" aria-label="الوقت المتبقي للاختبار" dir="ltr">${units.map(([id, value, label]) => `<span class="exam-clock-unit"><b data-clock="${id}">${pad(value)}</b><small>${label}</small></span>`).join('<span class="exam-clock-colon" aria-hidden="true">:</span>')}</div>
      <div class="exam-clock-controls"><button class="exam-clock-motion" type="button" aria-label="إيقاف حركة المؤقت الزخرفية" title="إيقاف الحركة الزخرفية" aria-pressed="false"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M8 6v12M16 6v12"/></svg></button><button class="exam-clock-hide" type="button" aria-label="إخفاء المؤقت" aria-controls="exam-countdown">إخفاء <span aria-hidden="true">×</span></button></div>
      <span class="exam-clock-status" role="status">${s.remaining ? '' : 'حان موعد الاختبار'}</span>
    </div>
    <div class="exam-clock-track" role="progressbar" aria-label="الوقت المنقضي من بداية يوم الاختبار حتى موعده" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.floor(s.progress * 100)}"><span style="transform:scaleX(${s.progress})"></span></div>
  </aside><div class="exam-clock-return" hidden><button type="button" aria-controls="exam-countdown" aria-expanded="false" aria-label="إظهار المؤقت" title="إظهار المؤقت"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/></svg></button></div><div class="exam-clock-spacer" aria-hidden="true"></div>`;
}

