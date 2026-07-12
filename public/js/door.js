/* door.js — apertura porta + petali arcobaleno pastello */

(function () {
  const canvas = document.getElementById('petal-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const COLORS = ['#F3B9C6','#F0B888','#F5DFA0','#9BAF8E','#A8CBDD','#C9A8C0','#E8C4B8'];
  let petals = [];
  let running = false;

  function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
  window.addEventListener('resize', resize);
  resize();

  function makePetal() {
    return {
      x: Math.random() * canvas.width,
      y: -20,
      r: Math.random() * 8 + 4,
      rx: Math.random() * 4 + 2,
      speed: Math.random() * 2 + 1.2,
      wind: (Math.random() - .5) * 1.2,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - .5) * .04,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: Math.random() * .5 + .4,
    };
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.rx, p.r, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  let lastSpawn = 0;
  function loop(ts) {
    if (!running) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (ts - lastSpawn > 80) { petals.push(makePetal()); lastSpawn = ts; }
    petals = petals.filter(p => p.y < canvas.height + 40);
    petals.forEach(p => {
      p.y += p.speed; p.x += p.wind; p.rot += p.rotSpeed;
      drawPetal(p);
    });
    requestAnimationFrame(loop);
  }

  window.startPetals = function () {
    canvas.classList.add('active');
    running = true;
    petals = [];
    for (let i = 0; i < 24; i++) { const p = makePetal(); p.y = Math.random() * canvas.height; petals.push(p); }
    requestAnimationFrame(loop);
    setTimeout(() => { running = false; setTimeout(() => canvas.classList.remove('active'), 2000); }, 4500);
  };
})();

(function () {
  const door = document.getElementById('door');
  if (!door) return;

  function openDoor() {
    door.classList.add('opening');
    if (window.startPetals) window.startPetals();
    setTimeout(() => {
      door.classList.add('gone');
      document.body.style.overflow = '';
    }, 1400);
  }

  document.body.style.overflow = 'hidden';
  document.getElementById('door-cta-btn').addEventListener('click', openDoor);
  door.addEventListener('click', e => {
    if (!e.target.closest('.door-cta')) openDoor();
  });

  let _ty = 0;
  door.addEventListener('touchstart', e => _ty = e.touches[0].clientY, { passive: true });
  door.addEventListener('touchend', e => {
    if (_ty - e.changedTouches[0].clientY > 50) openDoor();
  }, { passive: true });
})();
