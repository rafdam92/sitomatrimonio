/* countdown.js — live al 24 Luglio 2027 ore 11:00 */

(function () {
  const TARGET = new Date('2027-07-24T11:00:00').getTime();
  const pad = (n, l = 2) => String(n).padStart(l, '0');

  function tick() {
    const diff = TARGET - Date.now();
    const wrap = document.getElementById('cd-wrap');
    if (!wrap) return;

    if (diff <= 0) {
      wrap.innerHTML = '<p style="font-family:var(--fd);font-style:italic;font-size:2rem;color:#FEFCF8">Oggi è il giorno! 🌸</p>';
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor(diff % 86400000 / 3600000);
    const m = Math.floor(diff % 3600000 / 60000);
    const s = Math.floor(diff % 60000 / 1000);

    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set('cd-d', pad(d, 3));
    set('cd-h', pad(h));
    set('cd-m', pad(m));
    set('cd-s', pad(s));
  }
  tick();
  setInterval(tick, 1000);
})();
