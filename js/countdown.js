/* ============================================================
   Titan DigiStack — countdown.js
   Configurable end date. When expired, the offer banner hides.
   ============================================================ */

(function () {
  /* === EDIT ME ============================================
     Set the promotion end date here.
     Format: 'YYYY-MM-DDTHH:mm:ss' in local time (or append 'Z' for UTC)
     Example: '2026-06-30T23:59:59'
     ======================================================== */
  const END_DATE = '2026-12-31T23:59:59';

  const banner = document.getElementById('offerBanner');
  const root   = document.getElementById('countdown');
  if (!root) return;

  const cells = {
    days:    root.querySelector('[data-cd="days"]'),
    hours:   root.querySelector('[data-cd="hours"]'),
    minutes: root.querySelector('[data-cd="minutes"]'),
    seconds: root.querySelector('[data-cd="seconds"]'),
  };

  const target = new Date(END_DATE).getTime();
  if (Number.isNaN(target)) {
    console.warn('[countdown] Invalid END_DATE:', END_DATE);
    return;
  }

  const pad = (n) => String(n).padStart(2, '0');

  function tick() {
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      Object.values(cells).forEach(el => el && (el.textContent = '00'));
      if (banner) banner.hidden = true;
      clearInterval(timer);
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (cells.days)    cells.days.textContent    = pad(days);
    if (cells.hours)   cells.hours.textContent   = pad(hours);
    if (cells.minutes) cells.minutes.textContent = pad(minutes);
    if (cells.seconds) cells.seconds.textContent = pad(seconds);
  }

  tick();
  const timer = setInterval(tick, 1000);
})();
