const section = document.querySelector(".feature-cards");
const cards   = [...section.querySelectorAll(".card")];

const startW = [49, 49, 49, 49];   // largeurs de DÉPART (vw)
const endW   = [17, 17, 17, 49];   // largeurs d'ARRIVÉE (vw) -> panorama

// fige la largeur du contenu = largeur de départ, pour qu'il se fasse rogner
cards.forEach((card, i) => {
    card.querySelector(".inner").style.width = `${startW[i]}vw`;
});

const REVEAL = () => window.innerHeight * 3;   // distance de scroll dédiée à l'anim
function setHeight() { section.style.height = `${window.innerHeight + REVEAL()}px`; }

const clamp = v => Math.min(Math.max(v, 0), 1);
const ease  = t => 1 - Math.pow(1 - t, 3);

function subProgress(p, start, end) {
    return clamp((p - start) / (end - start));
}

// les cartes qui changent vraiment de largeur, dans l'ordre
const movers = startW
    .map((_, i) => i)
    .filter(i => startW[i] !== endW[i]);

const steps = movers.length;               // = 3

function onScroll() {
    const scrollable = section.offsetHeight - window.innerHeight;
    const p = clamp((window.scrollY - section.offsetTop) / scrollable);

    movers.forEach((cardIndex, k) => {
    const start = k / steps;
    const end   = (k + 1) / steps;
    const local = ease(subProgress(p, start, end));

    cards[cardIndex].style.width =
        `${startW[cardIndex] + (endW[cardIndex] - startW[cardIndex]) * local}vw`;

    cards[cardIndex].classList.toggle("is-narrow", local > 0.5);   // <-- ici, dans la boucle
});
}

window.addEventListener("load",   () => { setHeight(); onScroll(); });
window.addEventListener("scroll",  onScroll, { passive: true });
window.addEventListener("resize",  () => { setHeight(); onScroll(); });