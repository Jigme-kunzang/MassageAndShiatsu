/* Envoi du formulaire de contact vers Web3Forms.
   Le captcha est posé par le script client de Web3Forms
   (voir contact.astro) : il remplit un champ caché
   `h-captcha-response` une fois la case validée. C'est ce champ
   que l'on contrôle avant d'envoyer, et que Web3Forms revérifie
   de son côté. */

const form = document.getElementById("form");
const result = document.getElementById("result");

// la page de contact est la seule à porter ce formulaire
if (form && result) {
  const bouton = form.querySelector('input[type="submit"]');
  const libelleBouton = bouton ? bouton.value : "";

  /** Affiche un message dans la zone prévue sous le formulaire. */
  function message(texte, type) {
    result.textContent = texte;
    result.dataset.etat = type || "";
    result.style.display = "";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // --- contrôle du captcha ---
    const champCaptcha = form.querySelector('textarea[name="h-captcha-response"]');

    // le champ n'existe pas du tout : le widget n'a pas pu se charger
    // (bloqueur de publicité, coupure réseau…). Inutile de demander au
    // visiteur de cocher une case qu'il ne voit pas.
    if (!champCaptcha) {
      message(
        "La vérification anti-spam n'a pas pu se charger. Vérifiez votre connexion " +
          "ou votre bloqueur de publicité, puis rechargez la page. Vous pouvez aussi " +
          "m'écrire directement par téléphone ou par e-mail.",
        "erreur"
      );
      return;
    }

    // le widget est là mais la case n'est pas validée
    if (!champCaptcha.value) {
      message("Merci de valider la vérification anti-spam avant d'envoyer.", "erreur");
      return;
    }

    // --- envoi ---
    const donnees = JSON.stringify(Object.fromEntries(new FormData(form)));

    message("Envoi en cours…", "attente");
    if (bouton) {
      bouton.disabled = true;
      bouton.value = "Envoi…";
    }

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: donnees,
    })
      .then(async (reponse) => {
        const retour = await reponse.json().catch(() => ({}));

        if (reponse.ok) {
          message(
            retour.message || "Message envoyé, merci ! Je vous réponds au plus vite.",
            "succes"
          );
          form.reset();
          // le captcha se réarme : sans ça, un second envoi partirait
          // avec un jeton déjà consommé
          if (window.hcaptcha) window.hcaptcha.reset();
        } else {
          message(
            retour.message ||
              "L'envoi a échoué. Réessayez dans un instant, ou contactez-moi par téléphone.",
            "erreur"
          );
        }
      })
      .catch(() => {
        message(
          "L'envoi a échoué : connexion interrompue. Réessayez dans un instant, " +
            "ou contactez-moi par téléphone.",
          "erreur"
        );
      })
      .finally(() => {
        if (bouton) {
          bouton.disabled = false;
          bouton.value = libelleBouton;
        }
      });
  });
}
