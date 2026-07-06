document.querySelectorAll('[data-gr-carousel]').forEach((root) => {
    const track = root.querySelector('.gr-track');
    const slides = root.querySelectorAll('.gr-slide');
    const dots = root.querySelectorAll('.gr-dot');
    const prev = root.querySelector('.gr-prev');
    const next = root.querySelector('.gr-next');
    const count = slides.length;
    if (count <= 1) return;

    let index = 0;
    let timer;
    const DELAY = 5000; // temps entre deux avis (ms)

    function go(i) {
      index = (i + count) % count;               // boucle : -1 -> dernier, +1 après dernier -> 0
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, k) => d.classList.toggle('is-active', k === index));
    }

    function start() { timer = setInterval(() => go(index + 1), DELAY); }
    function stop()  { clearInterval(timer); }
    function reset() { stop(); start(); }        // relance le minuteur après une action manuelle

    next.addEventListener('click', () => { go(index + 1); reset(); });
    prev.addEventListener('click', () => { go(index - 1); reset(); });
    dots.forEach((d, k) => d.addEventListener('click', () => { go(k); reset(); }));

    root.addEventListener('mouseenter', stop);   // pause au survol
    root.addEventListener('mouseleave', start);

    go(0);
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) start();
});