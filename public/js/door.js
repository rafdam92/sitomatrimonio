/* door.js — apertura porta + Esplosione di Fiori Botanici Dettagliati */

(function () {
  const canvas = document.getElementById('petal-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // Tavolozza colori botanici pastello dai vostri fiori di riferimento
  const FLOWER_COLORS = {
    petalPink: '#E8C4B8', // Rosa cipria
    petalMauve: '#C9A8C0', // Malva tenue
    petalPeach: '#F2D9D0', // Pesca chiarissimo
    centerGold: '#FFD700', // Oro per il centro dei fiori
    stemGreen: '#9BAF8E'   // Verde salvia per steli e foglie
  };

  let flowers = [];
  let running = false;

  function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
  window.addEventListener('resize', resize);
  resize();

  // --- FUNZIONI DI DISEGNO VETTORIALE PER FIORI SPECIFICI ---

  // 1. Disegna una singola Foglia (Verde Salvia)
  function drawLeaf(ctx, p) {
    ctx.fillStyle = FLOWER_COLORS.stemGreen;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(3 * p.scale, -8 * p.scale, 0, -15 * p.scale);
    ctx.quadraticCurveTo(-3 * p.scale, -8 * p.scale, 0, 0);
    ctx.fill();
  }

  // 2. Disegna un Fiore tipo Cosmea (come Top-Left/Center nella tua immagine)
  function drawCosmosFlower(ctx, p, color) {
    // Petali (8 petali ovali)
    ctx.fillStyle = color;
    for (let i = 0; i < 8; i++) {
      ctx.save();
      ctx.rotate((Math.PI / 4) * i);
      ctx.beginPath();
      ctx.ellipse(0, -8 * p.scale, 5 * p.scale, 9 * p.scale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    // Centro Oro
    ctx.fillStyle = FLOWER_COLORS.centerGold;
    ctx.beginPath();
    ctx.circle(0, 0, 4 * p.scale);
    ctx.fill();
  }

  // 3. Disegna un Grappolo di Boccioli (come Bottom-Right nella tua immagine)
  function drawBudCluster(ctx, p) {
    // Stelo principale
    ctx.strokeStyle = FLOWER_COLORS.stemGreen;
    ctx.lineWidth = 1 * p.scale;
    ctx.beginPath();
    ctx.moveTo(0, 15 * p.scale);
    ctx.lineTo(0, -5 * p.scale);
    ctx.stroke();

    // Boccioli (3 piccoli ovali rosa/pesca)
    ctx.fillStyle = FLOWER_COLORS.petalPink;
    
    // Bocciolo centrale
    ctx.beginPath();
    ctx.ellipse(0, -10 * p.scale, 3 * p.scale, 5 * p.scale, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bocciolo sinistro
    ctx.save();
    ctx.translate(-5 * p.scale, -5 * p.scale);
    ctx.rotate(-Math.PI / 6);
    ctx.beginPath();
    ctx.ellipse(0, 0, 2.5 * p.scale, 4 * p.scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Bocciolo destro (pesca)
    ctx.fillStyle = FLOWER_COLORS.petalPeach;
    ctx.save();
    ctx.translate(5 * p.scale, -5 * p.scale);
    ctx.rotate(Math.PI / 6);
    ctx.beginPath();
    ctx.ellipse(0, 0, 2.5 * p.scale, 4 * p.scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // --- GESTIONE DELLE PARTICELLE (FIORI) ---

  function makeFlower() {
    const type = Math.floor(Math.random() * 6); // Sceglie uno dei 6 tipi di fiore
    return {
      type: type,
      x: Math.random() * canvas.width,
      y: -50, // Partono da più in alto
      scale: Math.random() * 0.7 + 0.6, // Dimensione variabile ma definita
      speed: Math.random() * 1.5 + 1,    // Caduta lenta e fluttuante
      wind: (Math.random() - .5) * 1.5, // Spostamento laterale simulando brezza
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - .5) * .02, // Rotazione lenta
      opacity: Math.random() * .3 + .6,     // Meno trasparenti per mostrare i dettagli
    };
  }

  function drawFlowerElement(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = p.opacity;

    // Disegna il tipo di fiore specifico in base all'indice estratto
    switch (p.type) {
      case 0: drawCosmosFlower(ctx, p, FLOWER_COLORS.petalPink); break;  // Cosmea Rosa (Top-Left)
      case 1: drawCosmosFlower(ctx, p, FLOWER_COLORS.petalMauve); break; // Cosmea Malva (Top-Center)
      case 2: drawCosmosFlower(ctx, p, FLOWER_COLORS.petalPink);         // Fiore doppio Rosa (Top-Right)
              ctx.save(); ctx.scale(0.8, 0.8); drawCosmosFlower(ctx, p, FLOWER_COLORS.petalPink); ctx.restore(); break;
      case 3: drawLeaf(ctx, p); break;                                  // Singola Foglia (Verde)
      case 4: drawBudCluster(ctx, p); break;                             // Grappolo di Boccioli (Bottom-Right)
      case 5: ctx.save(); ctx.rotate(Math.PI/4); drawLeaf(ctx, p); ctx.restore(); // Foglia inclinata
              drawBudCluster(ctx, p); break;                             // Più complesso
    }

    ctx.restore();
  }

  let lastSpawn = 0;
  function loop(ts) {
    if (!running) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Genera un nuovo fiore ogni 120ms (più lento per non affollare)
    if (ts - lastSpawn > 120) { flowers.push(makeFlower()); lastSpawn = ts; }
    
    // Rimuove i fiori che escono dallo schermo
    flowers = flowers.filter(f => f.y < canvas.height + 60);
    
    // Aggiorna e disegna ogni fiore
    flowers.forEach(f => {
      f.y += f.speed; f.x += f.wind; f.rot += f.rotSpeed;
      drawFlowerElement(f);
    });
    
    requestAnimationFrame(loop);
  }

  // --- FUNZIONE PUBBLICA PER ATTIVARE L'ESPLOSIONE ---
  window.startPetals = function () {
    canvas.classList.add('active');
    running = true;
    flowers = [];
    
    // Genera 15 fiori iniziali a mezz'aria per un effetto immediato
    for (let i = 0; i < 15; i++) {
      const f = makeFlower();
      f.y = Math.random() * canvas.height * 0.7; // Spulciati sullo schermo
      flowers.push(f);
    }
    
    requestAnimationFrame(loop);
    
    // Ferma la generazione dopo 5 secondi e pulisce il canvas dopo altri 2
    setTimeout(() => { 
      running = false; 
      setTimeout(() => canvas.classList.remove('active'), 2000); 
    }, 5000);
  };
})();

// --- GESTIONE DELL'APERTURA DELLA PORTA ---
(function () {
  const door = document.getElementById('door');
  if (!door) return;

  function openDoor() {
    // Se la porta è già in fase di apertura, non fare nulla
    if (door.classList.contains('opening')) return;
    
    door.classList.add('opening');
    
    // Attiva l'esplosione di fiori botanici
    if (window.startPetals) window.startPetals();
    
    // Rimuove l'elemento porta dopo l'animazione e ripristina lo scroll
    setTimeout(() => {
      door.classList.add('gone');
      document.body.style.overflow = ''; // Riattiva lo scorrimento della pagina
    }, 1600); // Leggermente più lungo per far godere i fiori
  }

  // Blocca lo scorrimento della pagina finché la porta è chiusa
  document.body.style.overflow = 'hidden';
  
  // Gestione del click sul pulsante "Apri l'invito"
  document.getElementById('door-cta-btn').addEventListener('click', openDoor);
  
  // Gestione del click su qualsiasi parte della porta
  door.addEventListener('click', e => {
    if (!e.target.closest('.door-cta')) openDoor();
  });

  // Gestione dello swipe verso l'alto (per mobile)
  let _ty = 0;
  door.addEventListener('touchstart', e => _ty = e.touches[0].clientY, { passive: true });
  door.addEventListener('touchend', e => {
    // Se lo swipe è verso l'alto e supera i 50px
    if (_ty - e.changedTouches[0].clientY > 50) openDoor();
  }, { passive: true });
})();
