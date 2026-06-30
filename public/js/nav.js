/* nav.js — protezione psw + hamburger mobile + scroll reveal */

// ── PROTEZIONE PAGINE INTERNE ─────────────────────────────
if (sessionStorage.getItem('preview') !== '1') {
  window.location.replace('/index.html');
}

// ── HAMBURGER ─────────────────────────────────────────────
const toggle = document.querySelector('.nav-toggle');
const links  = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = toggle.classList.toggle('open');
    links.classList.toggle('open', open);
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    toggle.classList.remove('open');
    links.classList.remove('open');
  }));
}

// ── ACTIVE LINK ───────────────────────────────────────────
const page = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.getAttribute('href') === page) a.classList.add('active');
});

// ── SCROLL REVEAL ─────────────────────────────────────────
const ro = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 70);
      ro.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));
