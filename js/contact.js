document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const emailLinks = document.querySelectorAll(".contact-list a[data-email]");
  const sendToField = document.getElementById("sendto");

  // Click su email -> aggiorna campo sendto
  emailLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      sendToField.value = link.dataset.email;
      sendToField.scrollIntoView({behavior:"smooth", block:"center"});
      sendToField.focus();
    });
  });

  // Invio form con EmailJS
  form.addEventListener("submit", e => {
    e.preventDefault();
    emailjs.sendForm('TUO_SERVICE_ID','TUO_TEMPLATE_ID', form)
      .then(() => {
        alert("Messaggio inviato correttamente!");
        form.reset();
        sendToField.value = "coordinator@evadere.eu"; // resetto il default
      }, (err) => {
        console.error(err);
        alert("Si è verificato un errore. Riprova.");
      });
  });
});
