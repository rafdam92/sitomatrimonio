/* storia.js — il filo che si disegna scorrendo + rivelazione capitoli */

(function () {
  const track = document.getElementById('storia-track');
  const path  = document.getElementById('vine-path');
  if (!track || !path) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── disegna il filo in base allo scroll ─────────────────
  const len = path.getTotalLength();
  path.style.strokeDasharray  = len;
  path.style.strokeDashoffset = reduceMotion ? 0 : len;

  function updateVine() {
    if (reduceMotion) return;
    const rect = track.getBoundingClientRect();
    const vh   = window.innerHeight;
    let progress = (vh - rect.top) / (vh + rect.height);
    progress = Math.max(0, Math.min(1, progress));
    path.style.strokeDashoffset = len * (1 - progress);
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { updateVine(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });
  updateVine();

  // ── rivelazione dei capitoli ─────────────────────────────
  const chapters = document.querySelectorAll('.storia-chapter');
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        ro.unobserve(e.target);
      }
    });
  }, { threshold: 0.35 });
  chapters.forEach(c => ro.observe(c));
})();
