fetch("data/team.json")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("team-container");

    data.team.forEach(member => {
      const el = document.createElement("div");
      el.className = "member";
      el.innerHTML = `
        <div class="photo">
          <img src="${member.photo}" alt="${member.name}">
          <div class="overlay"><p>${member.hover}</p></div>
        </div>
        <h4>${member.name}</h4>
        <small>${member.role}</small>
      `;
      container.appendChild(el);
    });
  })
  .catch(err => console.error("Errore caricamento team:", err));