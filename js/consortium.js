document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("network-list");

  fetch("data/consortium.json")
    .then(r => r.json())
    .then(data => {
      (data.network || []).forEach(net => {
        const card = document.createElement("div");
        card.className = "network-card";

        card.innerHTML = `
        <div class="network-card-inner">
            <div class="network-banner" style="background-image:url('${net.image}')"></div>
            <div class="network-left">
            <img src="${net.icon}" alt="${net.name} logo" class="network-icon">
            </div>
            <div class="network-center">
            <h4 class="network-name">${net.name}</h4>
            <p class="network-contact">
                Principal Investigator: 
                <a href="${net.contact_link}" target="_blank" rel="noopener">${net.contact}</a>
            </p>
            </div>
            <a class="network-link" href="${net.website}" target="_blank" rel="noopener">
            <span class="network-link-arrow">→</span>
            </a>
        </div>
        `;

        container.appendChild(card);
      });
    })
    .catch(err => console.error("Errore caricamento network:", err));
});
