document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById("team-container");

  fetch("data/team.json")
    .then(res => res.json())
    .then(data => {

      data.team.forEach((member, index) => {
        const el = document.createElement("div");
        el.className = "member";
        el.dataset.index = index;

        el.innerHTML = `
          <div class="photo">
            <img src="${member.photo}" alt="${member.name}">
            <div class="overlay"><p>${member.short_description}</p></div>
          </div>
          <h4>${member.name}</h4>
          <small>${member.Project}</small>
          <a class="linkedin-btn" href="${member.linkedin}" target="_blank">
            <img src="images/linkedin.png" alt="LinkedIn">
          </a>
          <a class="btn primary project-btn" href="jobs.html?job=${member.job_id || ''}">Project Description</a>
        `;
        container.appendChild(el);
      });

      // ---------------- MODALE TEAM ----------------
      const modal = document.getElementById("team-modal");
      const overlay = document.getElementById("team-modal-overlay");
      const closeBtn = document.getElementById("team-modal-close");
      const closeBottom = document.getElementById("team-modal-close-bottom");
      const modalImage = document.getElementById("team-modal-image");
      const modalTitle = document.getElementById("team-modal-title");
      const modalProject = document.getElementById("team-modal-project");
      const modalDescription = document.getElementById("team-modal-description");

      function openModal(member) {
        modalTitle.textContent = member.name;
        modalProject.textContent = member.Project;
        modalImage.src = member.photo;
        modalImage.alt = member.name;
        modalDescription.innerHTML = member.description.split("\n").map(p => `<p>${p}</p>`).join("");
        modal.classList.add("active");        // <-- ADDED
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      }

      function closeModal() {
        modal.classList.remove("active");     // <-- CHANGED
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      }

      // click su tutta la card tranne LinkedIn
      document.querySelectorAll("#team-container .member").forEach(card => {
        card.addEventListener("click", e => {
          if (!e.target.closest(".linkedin-btn")) {
            const index = card.dataset.index;
            openModal(data.team[index]);
          }
        });
      });

      overlay.addEventListener("click", closeModal);
      closeBtn.addEventListener("click", closeModal);
      closeBottom.addEventListener("click", closeModal);
      document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

    })
    .catch(err => console.error("Errore caricamento team:", err));
});
