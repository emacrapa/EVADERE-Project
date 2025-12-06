document.addEventListener('DOMContentLoaded', function () {

  const list = document.getElementById("news-list");

  fetch("data/news.json")
  .then(res => res.json())
  .then(data => {

    data.news.forEach(item => {

      const card = document.createElement("article");
      card.className = "news-card";
      card.dataset.id = item.id;

      card.innerHTML = `
        <div class="news-cover">
          <img src="${item.image}" alt="${item.title}">
        </div>

        <div class="news-body">
          <h2 class="news-title">${item.title}</h2>
          <div class="meta">
            <span class="date">${item.date}</span> •
            <span class="author">${item.author}</span>
          </div>

          <p class="excerpt">${item.excerpt}</p>

          <p class="news-actions">
            <a class="btn primary" data-open="${item.id}" href="#0">Approfondisci</a>

            <button class="share-btn" data-share="${item.id}">
              <img src="images/share-icon.png" alt="Condividi">
            </button>
          </p>
        </div>
      `;

      list.appendChild(card);
    });

    // Attiva share
    initShareButtons();

    // Attiva modal **dopo che i bottoni sono nel DOM**
    initModal(data.news);

  })
  .catch(err => console.error("Errore caricamento news:", err));
});


// ---------------- SHARE BUTTON ----------------
function initShareButtons(){
  document.querySelectorAll('.share-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.getAttribute('data-share');
      const url = window.location.origin + window.location.pathname + "?news=" + id;

      if(navigator.share){
        navigator.share({
          title: "Progetto Lab — News",
          url: url
        });
      } else {
        navigator.clipboard.writeText(url);
        alert("Link copiato negli appunti!");
      }
    });
  });
}


// ---------------- MODAL POPUP ----------------
function initModal(newsData){
  const modal = document.getElementById('news-modal');
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close');
  const closeBottom = document.getElementById('modal-close-bottom');
  const modalArticle = document.getElementById('modal-article');
  const modalTitle = document.getElementById('modal-title');
  const modalMeta = document.getElementById('modal-meta');
  const modalImage = document.getElementById('modal-image');

  function openArticle(id){
    const art = newsData.find(n=>n.id==id);
    if(!art) return;
    modalTitle.textContent = art.title;
    modalMeta.textContent = `${art.date} • ${art.author}`;
    modalImage.src = art.image || '';
    modalImage.alt = art.title;
    modalArticle.innerHTML = art.content.map(p=>`<p>${p}</p>`).join('');
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
  }

  function closeModal(){
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
  }

  document.querySelectorAll('[data-open]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      e.preventDefault();
      openArticle(btn.getAttribute('data-open'));
    });
  });

  overlay.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);
  if(closeBottom) closeBottom.addEventListener('click', closeModal);
  document.addEventListener('keydown', e=>{if(e.key==='Escape')closeModal()});
}
