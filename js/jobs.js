document.addEventListener("DOMContentLoaded", () => {

  /* --- helper NL -> <p> con margin per paragrafi --- */
  const formatText = (s = "") => {
    if (!s) return "";
    return s.split("\n").map(line => `<p style="margin-bottom:0.8em">${line}</p>`).join("");
  };

  /* ============================
     Carica jobs da JSON e monta l'accordion
     ============================ */
  fetch("data/jobs.json")
    .then(r => r.json())
    .then(data => {
      const container = document.querySelector(".positions");
      if (!container) return;
      container.innerHTML = "";

      (data.jobs || []).forEach(job => {
        const acc = document.createElement("div");
        acc.className = "position accordion";

        let projectDesc = "";
        if (job.objectives || job.expected_results) {
          if (job.objectives) projectDesc += `<h4>Objectives</h4>${formatText(job.objectives)}`;
          if (job.expected_results) projectDesc += `<h4>Expected Results</h4>${formatText(job.expected_results)}`;
        } else projectDesc = "";
        if (!job.objectives && job.expected_results) projectDesc = formatText(job.expected_results);

        acc.innerHTML = `
          <button class="acc-header" type="button">
            ${job.title || "Untitled position"}
            <span class="acc-icon">+</span>
          </button>

          <div class="acc-body">
            <p class="pos-meta"><strong>Organisation/Institute:</strong> ${job.organisation || ""}</p>
            <p class="pos-meta"><strong>Supervisor:</strong> ${job.supervisor || ""}</p>
            <p class="pos-meta"><strong>Contacts:</strong> ${(job.contacts || []).filter(c => c.trim()).join("; ") || ""}</p>

            <h3>Project Description</h3>
            ${projectDesc}

            ${job.secondments ? `<h4>Planned secondments</h4><p>${formatText(job.secondments)}</p>` : ""}
            ${job.requirements ? `<h4>Specific requirements for the project</h4>${formatText(job.requirements)}` : ""}
            ${job.salary ? `<h4>Gross Salary</h4><p>${job.salary}</p>` : ""}
            ${job.salary_employee ? `<h4>Gross salary to the employee</h4><p>${job.salary_employee}</p>` : ""}

            <p class="pos-actions">
              <a class="btn primary" href="${job.download_form || 'files/application_form.pdf'}" download>Download application form</a>
              <a class="btn ghost" href="mailto:${job.email || 'jobs@example.com'}?subject=Application for%20${encodeURIComponent(job.title || '')}">Send application by email</a>
            </p>
          </div>
        `;
        container.appendChild(acc);
      });

      /* ============================
         Funzioni accordion con animazione JS
         ============================ */
      const headers = container.querySelectorAll(".acc-header");
      const headerFixed = document.querySelector(".site-header");
      const headerHeight = headerFixed ? headerFixed.offsetHeight : 0;
      const marginTop = 10;

      function animateOpen(body, acc) {
        body.classList.add("open");
        const header = body.previousElementSibling;
        if (header) header.querySelector(".acc-icon").textContent = "−";

        const startHeight = 0;
        const endHeight = body.scrollHeight;
        body.style.height = startHeight + "px";

        let startTime = null;
        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime;
          const duration = 300;
          const progress = Math.min(elapsed / duration, 1);
          body.style.height = (startHeight + (endHeight - startHeight) * progress) + "px";

          // scroll in tempo reale
          const rect = acc.getBoundingClientRect();
          const absoluteTop = rect.top + window.pageYOffset;
          if (rect.top < headerHeight + marginTop) {
            window.scrollTo({ top: absoluteTop - headerHeight - marginTop });
          }

          if (progress < 1) requestAnimationFrame(step);
          else body.style.height = "auto";
        }
        requestAnimationFrame(step);
      }

      function animateClose(body) {
        const header = body.previousElementSibling;
        if (header) header.querySelector(".acc-icon").textContent = "+";

        const startHeight = body.scrollHeight;
        const endHeight = 0;
        body.style.height = startHeight + "px";

        let startTime = null;
        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime;
          const duration = 300;
          const progress = Math.min(elapsed / duration, 1);
          body.style.height = (startHeight - (startHeight - endHeight) * progress) + "px";

          if (progress < 1) requestAnimationFrame(step);
          else {
            body.classList.remove("open");
            body.style.height = "0px";
          }
        }
        requestAnimationFrame(step);
      }

      headers.forEach(header => {
        header.addEventListener("click", () => {
          const body = header.nextElementSibling;
          const acc = header.parentElement;

          // chiudi altre aperte
          container.querySelectorAll(".acc-body.open").forEach(b => {
            if (b !== body) animateClose(b);
          });

          if (body.classList.contains("open")) {
            animateClose(body);
          } else {
            animateOpen(body, acc);
          }
        });
      });

      window.addEventListener("resize", () => {
        container.querySelectorAll(".acc-body.open").forEach(b => b.style.height = "auto");
      });

      /* ============================
         Apri job specifico via query string
         ============================ */
      function getQueryParam(name) {
        const params = new URLSearchParams(window.location.search);
        return params.get(name);
      }

      // apertura istantanea via query
function openJobById(jobId) {
  if (!jobId) return;
  const acc = Array.from(container.querySelectorAll(".position")).find(a => {
    const header = a.querySelector(".acc-header");
    return header && header.textContent.includes(jobId);
  });
  if (!acc) return;

  const header = acc.querySelector(".acc-header");
  const body = acc.querySelector(".acc-body");

  // chiudi tutte le altre
  container.querySelectorAll(".acc-body.open").forEach(b => {
    b.classList.remove("open");
    b.style.height = "0px";
    const ic = b.previousElementSibling && b.previousElementSibling.querySelector(".acc-icon");
    if (ic) ic.textContent = "+";
  });

  // apertura istantanea (senza animazione)
  body.classList.add("open");
  body.style.height = body.scrollHeight + "px";
  header.querySelector(".acc-icon").textContent = "−";

  // subito dopo forza auto per gestire resize futuri
  setTimeout(() => body.style.height = "auto", 0);

  // scroll immediato
  const headerFixed = document.querySelector(".site-header");
  const headerHeight = headerFixed ? headerFixed.offsetHeight : 0;
  const marginTop = 10;
  const rect = acc.getBoundingClientRect();
  const absoluteTop = rect.top + window.pageYOffset;
  window.scrollTo({ top: Math.max(0, absoluteTop - headerHeight - marginTop) });
}



      openJobById(getQueryParam("job"));

    })
    .catch(err => console.error("Errore caricamento jobs:", err));

  /* ====================
     COUNTDOWN
     ==================== */
  const deadline = "2026-04-30T14:59:59Z";

  function initCountdown(targetDateISO, ids) {
    const target = new Date(targetDateISO).getTime();
    if (isNaN(target)) return;

    function update() {
      const now = Date.now();
      const diff = target - now;

      const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
      const hours = Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24));
      const mins = Math.max(0, Math.floor((diff / (1000 * 60)) % 60));
      const secs = Math.max(0, Math.floor((diff / 1000) % 60));

      if (document.getElementById(ids.days)) document.getElementById(ids.days).textContent = String(days).padStart(2, "0");
      if (document.getElementById(ids.hours)) document.getElementById(ids.hours).textContent = String(hours).padStart(2, "0");
      if (document.getElementById(ids.mins)) document.getElementById(ids.mins).textContent = String(mins).padStart(2, "0");
      if (document.getElementById(ids.secs)) document.getElementById(ids.secs).textContent = String(secs).padStart(2, "0");
    }

    update();
    setInterval(update, 1000);
  }

  initCountdown(deadline, {
    days: "cd-days-lg",
    hours: "cd-hours-lg",
    mins: "cd-mins-lg",
    secs: "cd-secs-lg"
  });

});
