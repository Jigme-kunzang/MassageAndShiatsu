const section = document.querySelector(".feature-cards");

/* Sur petit écran, le carrousel horizontal n'a pas de sens : les
   cartes deviennent une simple pile (voir index.css). */
if (!section || window.matchMedia("(max-width: 900px)").matches) {
  // rien à animer
} else {

  const cards = [...section.querySelectorAll(".card")];

  const startW = [49, 49, 49, 49, 39];   // largeurs de DÉPART (vw)
  const endW   = [15, 15, 15, 15, 40];   // largeurs d'ARRIVÉE — la somme DOIT faire 100

  const NARROW = 30;   // seuil (vw) sous lequel on bascule sur le texte court

  // fige la largeur du contenu = largeur de départ, pour qu'il se fasse rogner
  cards.forEach((card, i) => {
    card.style.width = `${startW[i]}vw`;
    card.style.setProperty("--card-w", `${startW[i]}vw`);
    card.querySelector(".inner").style.width = `${startW[i]}vw`;
  });

  // les cartes qui changent vraiment de largeur, dans l'ordre
  const movers = startW.map((_, i) => i).filter(i => startW[i] !== endW[i]);
  const steps  = movers.length;          // = 5 maintenant

  // durée de scroll proportionnelle au nombre d'étapes
  const REVEAL = () => window.innerHeight * steps * 2;
  function setHeight() { section.style.height = `${window.innerHeight + REVEAL()}px`; }

  const clamp = v => Math.min(Math.max(v, 0), 1);
  const ease  = t => 1 - Math.pow(1 - t, 3);
  const sub   = (p, a, b) => clamp((p - a) / (b - a));

  function onScroll() {
    const scrollable = section.offsetHeight - window.innerHeight;
    const p = clamp((window.scrollY - section.offsetTop) / scrollable);

    movers.forEach((i, k) => {
      const local = ease(sub(p, k / steps, (k + 1) / steps));
      const w = startW[i] + (endW[i] - startW[i]) * local;

      cards[i].style.width = `${w}vw`;
      // largeur visible courante, exposée au CSS : le titre s'y contraint
      // et se replie au lieu d'être rogné par le bord de la carte
      cards[i].style.setProperty("--card-w", `${w}vw`);
      // basé sur la largeur réelle, pas sur l'avancement
      cards[i].classList.toggle("is-narrow", w < NARROW);
    });
  }

  /* Position du texte : le plus bas possible, titres alignés sur toutes
     les cartes, sans que le bloc le plus haut soit rogné par le bas.
     On mesure chaque carte dans son pire cas — la largeur la plus
     étroite de chaque état (long / court), là où le texte se replie le
     plus — et on cale le haut commun sur le bloc le plus haut. */
  function placeText() {
    let maxH = 0;
    const measure = (card, w, narrow) => {
      card.classList.toggle("is-narrow", narrow);
      card.style.setProperty("--card-w", `${w}vw`);
      // dernier bloc du texte ; offsetTop/Height ignorent le translateY
      // de l'animation d'apparition
      const last = card.querySelector(".body")?.lastElementChild;
      if (last) maxH = Math.max(maxH, last.offsetTop + last.offsetHeight);
    };
    cards.forEach((card, i) => {
      const minW = Math.min(startW[i], endW[i]);
      measure(card, Math.max(minW, NARROW), false);
      if (minW < NARROW) measure(card, minW, true);
      card.style.setProperty("--card-w", `${startW[i]}vw`);
    });
    section.style.setProperty("--body-h", `${Math.ceil(maxH) + 4}px`);
    onScroll();   // remet largeurs et états réels
  }

  const layout = () => { setHeight(); placeText(); };
  window.addEventListener("load",   layout);
  document.fonts?.ready.then(layout);   // la police change la hauteur du texte
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", layout);
}