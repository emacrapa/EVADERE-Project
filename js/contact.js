document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("contact-form");
  const emailLinks = document.querySelectorAll(".contact-list a[data-email]");
  const sendToField = document.getElementById("sendto");

  // Click sulla lista → inserisce automaticamente la mail
  emailLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      sendToField.value = link.dataset.email;
      sendToField.focus();
    });
  });

  // Invio → apre client email
  form.addEventListener("submit", e => {
    e.preventDefault();

    const to = encodeURIComponent(form.sendto.value.trim());
    const subject = encodeURIComponent(form.subject.value.trim());
    const message = encodeURIComponent(form.message.value.trim());

    // SOLO il messaggio nel corpo email
    const mailtoLink = `mailto:${to}?subject=${subject}&body=${message}`;

    window.location.href = mailtoLink;
  });

});
