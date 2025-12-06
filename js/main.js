/* ============================
   main.js — Funzioni comuni
   ============================ */

// --- FOOTER YEAR ---
document.addEventListener("DOMContentLoaded", () => {
  const y = new Date().getFullYear();
  document.querySelectorAll("[data-year]").forEach(el => el.textContent = y);
});

// --- SCROLL TO TOP ---
const scrollBtn = document.createElement('button');
scrollBtn.id = "scroll-top";
scrollBtn.textContent = "↑";
document.body.appendChild(scrollBtn);

const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) { // compare dopo 300px di scroll
    scrollTopBtn.classList.add('show');
  } else {
    scrollTopBtn.classList.remove('show');
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
  const deadline = "2026-01-31T23:59:59"; // impostabile per pagina specifica
  initCountdown(deadline, {days: "cd-days", hours: "cd-hours", mins: "cd-mins", secs: "cd-secs"});
  initCountdown(deadline, {days: "cd-days-lg", hours: "cd-hours-lg", mins: "cd-mins-lg", secs: "cd-secs-lg"});
});
