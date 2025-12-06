document.addEventListener("DOMContentLoaded", () => {

  /* --- FOOTER YEAR --- */
  const y = new Date().getFullYear();
  document.querySelectorAll("[data-year], #year-op, #year-team, #year-news, #year")
    .forEach(el => el && (el.textContent = y));

  /* --- helper NL -> <br> --- */
  const nl2br = (s = "") => String(s).replace(/\n/g, "<br>");

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

        // markup sempre presente, ma sezioni vuote se non c'è contenuto
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

            ${job.objectives ? `<h4>Objectives</h4><p>${nl2br(job.objectives)}</p>` : ""}
            ${job.expected_results ? `<h4>Expected Results</h4><p>${nl2br(job.expected_results)}</p>` : ""}
            ${job.secondments ? `<h4>Planned secondments</h4><p>${job.secondments}</p>` : ""}
            ${job.requirements ? `<h4>Specific requirements for the project</h4><p>${nl2br(job.requirements)}</p>` : ""}
            ${job.salary ? `<h4>Gross Salary</h4><p>${job.salary}</p>` : ""}
            ${job.salary_employee ? `<h4>Gross salary to the employee</h4><p>${job.salary_employee}</p>` : ""}

            <p class="pos-actions">
              <a class="btn primary" href="${job.download_form || 'files/application_form.pdf'}" download>Download application form</a>
              <a class="btn ghost" href="mailto:${job.email || 'jobs@example.com'}?subject=Candidatura%20${encodeURIComponent(job.title || '')}">Send application by email</a>
            </p>
          </div>
        `;

        container.appendChild(acc);
      });

      /* ============================
         Funzioni accordion robuste
         ============================ */
      const headers = container.querySelectorAll(".acc-header");

      function measureOpenHeight(body) {
        body.classList.add("open");
        body.style.maxHeight = "none";
        const h = body.scrollHeight || Array.from(body.children).reduce((sum, ch) => sum + (ch.getBoundingClientRect().height || 0), 0);
        const BUFFER = 40;
        body.style.maxHeight = Math.ceil(h + BUFFER) + "px";
        return h;
      }

      function closeBody(body) {
        body.style.maxHeight = null;
        body.classList.remove("open");
      }

      headers.forEach(header => {
        header.addEventListener("click", () => {
          const body = header.nextElementSibling;

          // chiudi altri
          container.querySelectorAll(".acc-body.open").forEach(b => {
            if (b !== body) {
              closeBody(b);
              const ic = b.previousElementSibling.querySelector(".acc-icon");
              if (ic) ic.textContent = "+";
            }
          });

          // toggle
          if (body.classList.contains("open")) {
            closeBody(body);
            header.querySelector(".acc-icon").textContent = "+";
          } else {
            measureOpenHeight(body);
            header.querySelector(".acc-icon").textContent = "−";
          }
        });
      });

      window.addEventListener("resize", () => {
        container.querySelectorAll(".acc-body.open").forEach(b => {
          b.style.maxHeight = Math.ceil(b.scrollHeight + 40) + "px";
        });
      });

    })
    .catch(err => console.error("Errore caricamento jobs:", err));

  /* ====================
     COUNTDOWN
     ==================== */
  const deadline = "2026-01-31T23:59:59";

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
