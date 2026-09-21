/* Chiffres clés de la page « à propos » : chaque chiffre défile
   du bas vers le haut, comme les rouleaux d'un compteur, jusqu'à
   se poser sur sa valeur.

   Principe : on remplace chaque caractère chiffré par un rouleau —
   une bande verticale portant 0,1,2…9 deux fois de suite puis les
   chiffres jusqu'à la valeur visée. La bande est ensuite remontée
   de la hauteur voulue ; les chiffres entrent donc par le bas et
   sortent par le haut.

   Le HTML contient déjà la valeur finale : sans JavaScript — ou en
   mouvement réduit — le bon chiffre s'affiche, simplement figé. */
(function () {
  var chiffres = document.querySelectorAll(".chiffres .nombre[data-cible]");
  if (!chiffres.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var format = new Intl.NumberFormat("fr-FR");
  var TOURS = 2;      // tours complets de 0 à 9 avant de se poser
  var DECALAGE = 0.1; // secondes de retard d'un rouleau au suivant

  function construire(el) {
    var cible = parseInt(el.dataset.cible, 10);
    if (isNaN(cible)) return null;

    var texte = format.format(cible);
    var bandes = [];
    el.textContent = "";

    for (var i = 0; i < texte.length; i++) {
      var car = texte[i];

      // séparateur de milliers : il ne défile pas
      if (car < "0" || car > "9") {
        var sep = document.createElement("span");
        sep.className = "separateur";
        sep.textContent = car;
        el.appendChild(sep);
        continue;
      }

      var vise = Number(car);
      var suite = "";
      for (var tour = 0; tour < TOURS; tour++) {
        for (var n = 0; n <= 9; n++) suite += "<span>" + n + "</span>";
      }
      for (var m = 0; m <= vise; m++) suite += "<span>" + m + "</span>";

      var rouleau = document.createElement("span");
      rouleau.className = "rouleau";
      var bande = document.createElement("span");
      bande.className = "bande";
      bande.innerHTML = suite;
      rouleau.appendChild(bande);
      el.appendChild(rouleau);

      bandes.push({ bande: bande, arret: TOURS * 10 + vise });
    }

    return bandes;
  }

  function lancer(el) {
    var bandes = construire(el);
    if (!bandes || !bandes.length) return;

    // un souffle avant de démarrer, sinon la transition est ignorée
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        bandes.forEach(function (r, rang) {
          r.bande.style.transitionDelay = rang * DECALAGE + "s";
          r.bande.style.transform = "translateY(-" + r.arret + "em)";
        });
      });
    });
  }

  var io = new IntersectionObserver(
    function (entrees) {
      entrees.forEach(function (e) {
        if (e.isIntersecting) {
          lancer(e.target);
          io.unobserve(e.target); // une seule fois
        }
      });
    },
    { threshold: 0.5 }
  );

  chiffres.forEach(function (el) {
    io.observe(el);
  });
})();
