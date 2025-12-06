/* ============================
   main.js — Funzioni comuni
   ============================ */

// --- SCROLL TO TOP ---
const scrollBtn = document.createElement('button');
scrollBtn.id = "scroll-top";
scrollBtn.textContent = "↑";
document.body.appendChild(scrollBtn);

const scrollTopBtn = document.getElementById('scroll-top');
const footer = document.querySelector('.site-footer');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const windowH = window.innerHeight;
  const footerTop = footer.getBoundingClientRect().top + scrollY;
  const btnHeight = scrollTopBtn.offsetHeight;

  // Mostra il tasto dopo 300px
  if (scrollY > 300) scrollTopBtn.classList.add('show');
  else scrollTopBtn.classList.remove('show');

  // Ferma il tasto appena sopra il footer
  const bottomLimit = footerTop + 10 - btnHeight; // 20px margine sopra il footer
  if (scrollY + windowH > bottomLimit) {
    scrollTopBtn.style.bottom = `${scrollY + windowH - bottomLimit - 10}px`;
  } else {
    scrollTopBtn.style.bottom = '80px'; // default sopra footer
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  if(header){
    document.body.style.paddingTop = header.offsetHeight + "px";
  }
});

// --- COUNTDOWN GENERICO ---
function initCountdown(targetDateISO, ids){
  const target = new Date(targetDateISO).getTime();
  if (isNaN(target)) return;

  function update(){
    const now = Date.now();
    const diff = target - now;

    const days  = Math.max(0, Math.floor(diff / (1000*60*60*24)));
    const hours = Math.max(0, Math.floor((diff/(1000*60*60)) % 24));
    const mins  = Math.max(0, Math.floor((diff/(1000*60)) % 60));
    const secs  = Math.max(0, Math.floor((diff/1000) % 60));

    if (document.getElementById(ids.days))  document.getElementById(ids.days).textContent  = String(days).padStart(2,'0');
    if (document.getElementById(ids.hours)) document.getElementById(ids.hours).textContent = String(hours).padStart(2,'0');
    if (document.getElementById(ids.mins))  document.getElementById(ids.mins).textContent  = String(mins).padStart(2,'0');
    if (document.getElementById(ids.secs))  document.getElementById(ids.secs).textContent  = String(secs).padStart(2,'0');

    if (diff <= 0) clearInterval(timer);
  }

  update();
  const timer = setInterval(update, 1000);
}

// Countdown globale (per home e altre pagine)
document.addEventListener("DOMContentLoaded", () => {
  const deadline = "2026-04-30T14:59:59Z"; // impostabile per pagina specifica
  initCountdown(deadline, {days: "cd-days", hours: "cd-hours", mins: "cd-mins", secs: "cd-secs"});
  initCountdown(deadline, {days: "cd-days-lg", hours: "cd-hours-lg", mins: "cd-mins-lg", secs: "cd-secs-lg"});
});
