const BACTERIA_STORAGE_KEY = "showBacteria";

document.addEventListener("DOMContentLoaded", () => {

  /* ================== TOGGLE ================== */
  const toggle = document.getElementById("toggle-bacteria");
  const canvas = document.getElementById("bacteria-bg");
  const ctx = canvas.getContext("2d");

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Stato iniziale
  let bacteriaEnabled = localStorage.getItem(BACTERIA_STORAGE_KEY) === "true";
  canvas.style.display = bacteriaEnabled ? "block" : "none";

  if (toggle) {
    toggle.checked = bacteriaEnabled;
    toggle.addEventListener("change", () => {
      bacteriaEnabled = toggle.checked;
      localStorage.setItem(BACTERIA_STORAGE_KEY, bacteriaEnabled);
      canvas.style.display = bacteriaEnabled ? "block" : "none";
    });
  }

  /* ================== MOUSE ================== */
  const mouse = { x: width / 2, y: height / 2 };
  window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  /* ================== COLORI ================== */
  function randomBacteriaColor() {
    const colors = [
      'rgba(250,245,230,0.9)',
      'rgba(235,235,235,0.9)',
      'rgba(255,250,200,0.9)',
      'rgba(240,240,220,0.9)'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /* ================== DRAW ================== */
  function drawBacteria(b) {
    const gradient = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
    gradient.addColorStop(0, 'rgba(255,255,255,0.9)');
    gradient.addColorStop(0.5, b.color.replace(/[\d\.]+\)$/,'0.3)'));
    gradient.addColorStop(1, b.color);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
  }

  /* ================== BATTERI ================== */
  const NUM_BACTERIA = 120;
  const bacteria = [];

  for (let i = 0; i < NUM_BACTERIA; i++) {
    const r = 4 + Math.random() * 10;
    bacteria.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      color: randomBacteriaColor()
    });
  }

  /* ================== ANIMAZIONE ================== */
  function animate() {
    requestAnimationFrame(animate);

    if (!bacteriaEnabled) return;

    ctx.clearRect(0, 0, width, height);

    for (let b of bacteria) {
      // Interazione mouse
      const dx = b.x - mouse.x;
      const dy = b.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 100 && dist > 0.1) {
        const force = (100 - dist) / 100 * 0.5;
        b.vx += (dx / dist) * force;
        b.vy += (dy / dist) * force;
      }

      // Movimento organico
      b.vx += (Math.random() - 0.5) * 0.05;
      b.vy += (Math.random() - 0.5) * 0.05;

      b.vx *= 0.95;
      b.vy *= 0.95;

      b.x += b.vx;
      b.y += b.vy;

      // Loop bordi
      if (b.x < -b.r) b.x = width + b.r;
      if (b.x > width + b.r) b.x = -b.r;
      if (b.y < -b.r) b.y = height + b.r;
      if (b.y > height + b.r) b.y = -b.r;

      drawBacteria(b);
    }
  }

  animate();
});