document.addEventListener('DOMContentLoaded', function() {

  // ----------- NOTIZIA DEL GIORNO -----------
  const dailyTitle = document.getElementById('daily-title');
  const dailyExcerpt = document.getElementById('daily-excerpt');
  const dailyLink = document.getElementById('daily-link');

  fetch('data/news.json')
    .then(res => res.json())
    .then(data => {
      const index = 0; // cambia qui l'indice della notizia da mostrare
      if(data.news[index]){
        const n = data.news[index];
        dailyTitle.textContent = n.title;
        dailyExcerpt.textContent = n.excerpt;
        dailyLink.href = `news.html?news=${n.id}`;
      }
    })
    .catch(err => console.error("Errore caricamento notizia del giorno:", err));

  // ----------- TEAM CAROUSEL -----------
  const carousel = document.getElementById('team-carousel');
  const prevBtn = document.querySelector('.team-nav.prev');
  const nextBtn = document.querySelector('.team-nav.next');

  fetch('data/team.json')
    .then(res => res.json())
    .then(data => {
      const team = data.team;

      // Duplico le card all'inizio e alla fine per loop infinito
      const extendedTeam = [...team, ...team, ...team]; // triplo array
      extendedTeam.forEach(member => {
        const el = document.createElement('div');
        el.className = 'member';
        el.innerHTML = `
          <div class="photo">
            <img src="${member.photo}" alt="${member.name}">
            <div class="overlay"><p>${member.hover}</p></div>
          </div>
          <h4>${member.name}</h4>
          <small>${member.role}</small>
        `;
        carousel.appendChild(el);
      });

      const memberWidth = carousel.querySelector('.member').offsetWidth + 16; // card + gap
      let scrollPos = team.length * memberWidth; // iniziamo dal "secondo set"

      carousel.scrollLeft = scrollPos;

      // Funzione scroll loop
      function scrollCarousel(dir = 1) {
        scrollPos += memberWidth * dir;
        carousel.scrollTo({ left: scrollPos, behavior: 'smooth' });
      }

      nextBtn.addEventListener('click', () => scrollCarousel(1));
      prevBtn.addEventListener('click', () => scrollCarousel(-1));

      // Reset automatico per loop continuo
      carousel.addEventListener('scroll', () => {
        if(scrollPos >= 2 * team.length * memberWidth) {
          scrollPos = team.length * memberWidth;
          carousel.scrollLeft = scrollPos;
        } else if(scrollPos <= 0) {
          scrollPos = team.length * memberWidth;
          carousel.scrollLeft = scrollPos;
        }
      });

    })
    .catch(err => console.error("Errore caricamento team:", err));

});