// ============================================================
// SMOOTH SCROLL — Lenis-powered kinetic/inertial scrolling.
//
// Purely additive: Lenis drives the page's native scrollTop with easing,
// so every existing scroll listener (main.js progress bar, nav.js active
// section, motion.js ScrollTrigger parallax) keeps working unchanged —
// they just ride a smoother scroll position. Bails out cleanly on
// reduced-motion or if the CDN didn't load, leaving native scroll intact.
// Disabled on touch/coarse pointers so mobile keeps its natural feel.
// ============================================================
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const hasLenis = typeof window.Lenis !== 'undefined';
  if (!hasLenis || reduceMotion || isTouch) return;

  const lenis = new Lenis({
    duration: 1.05,
    easing: (t) => 1 - Math.pow(1 - t, 4),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
  });

  // Keep GSAP's ScrollTrigger-driven parallax/reveals in sync with Lenis'
  // eased scroll position instead of the raw native one.
  if (window.ScrollTrigger) {
    lenis.on('scroll', ScrollTrigger.update);
  }

  // Drive Lenis off GSAP's own ticker so both stay on one rAF loop, and
  // disable GSAP's lag smoothing (it fights with Lenis' own easing).
  if (window.gsap) {
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  } else {
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }

  // Let GSAP's eased anchor-scroll (motion.js) hand off to Lenis instead of
  // fighting it — Lenis exposes its own scrollTo for anchor links.
  if (window.ScrollToPlugin) {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (!id || !id.startsWith('#') || id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -86, duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 3) });
        history.pushState(null, '', id);
      }, { capture: true });
    });
  }

  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      lenis.scrollTo(0, { duration: 1.2 });
    }, { capture: true });
  }

  window.__lenis = lenis;
})();
