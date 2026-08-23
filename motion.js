// ============================================================
// MOTION — GSAP-driven depth layer for the portfolio.
//
// Everything here is additive to the existing IntersectionObserver-based
// reveal/nav/tilt system: it never removes functionality, and it bails
// out cleanly (leaving the original, already-solid experience intact) if
// GSAP failed to load or the visitor prefers reduced motion.
//
// Covers: hero line-by-line text reveal, scroll-triggered split-word
// heading reveals, background/canvas parallax, an ambient mouse-reactive
// depth layer, a scroll-scrubbed experience-timeline fill, and eased
// anchor scrolling for nav/CTA links.
// ============================================================
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';
  if (!hasGSAP || reduceMotion) return;

  if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  if (window.ScrollToPlugin) gsap.registerPlugin(ScrollToPlugin);

  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- 1. HERO — line-by-line text reveal ---------- */
  function heroReveal() {
    const lines = document.querySelectorAll('.hero h1 .line > span');
    if (!lines.length) return;
    gsap.set(lines, { yPercent: 115, opacity: 0 });
    gsap.to(lines, {
      yPercent: 0, opacity: 1, duration: 1.1, ease: 'power4.out', stagger: 0.12, delay: 0.15
    });
  }
  // Run right after the loader clears so it isn't wasted behind it; if the
  // loader has already gone (e.g. very fast load, or removed), run now.
  if (document.getElementById('loader')) {
    window.addEventListener('portfolio:loaded', heroReveal, { once: true });
    // Safety net in case the loader is removed/hidden without the event
    // ever firing for some reason.
    setTimeout(heroReveal, 3000);
  } else {
    heroReveal();
  }

  /* ---------- 2. SECTION HEADINGS — split-word scroll reveal ---------- */
  function splitWords(el) {
    function walk(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        if (!node.textContent.trim()) return;
        const frag = document.createDocumentFragment();
        const parts = node.textContent.split(/(\s+)/);
        parts.forEach((part) => {
          if (part === '') return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          const mask = document.createElement('span');
          mask.className = 'word-mask';
          const inner = document.createElement('span');
          inner.className = 'word-inn';
          inner.textContent = part;
          mask.appendChild(inner);
          frag.appendChild(mask);
        });
        node.replaceWith(frag);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(walk);
      }
    }
    Array.from(el.childNodes).forEach(walk);
    return el.querySelectorAll('.word-inn');
  }

  const headings = document.querySelectorAll('h2.section-head, .section-head > h2');
  headings.forEach((h2) => {
    const words = splitWords(h2);
    if (!words.length) return;
    gsap.set(words, { yPercent: 100, opacity: 0 });
    ScrollTrigger.create({
      trigger: h2,
      start: 'top 88%',
      once: true,
      onEnter: () => gsap.to(words, { yPercent: 0, opacity: 1, duration: 0.85, ease: 'power4.out', stagger: 0.028 })
    });
  });

  /* ---------- 3. PARALLAX — background depth layers ---------- */
  const grid = document.getElementById('bgGrid');
  const glow = document.getElementById('bgGlow');
  const neural = document.getElementById('neuralCanvas');

  if (grid) {
    gsap.to(grid, {
      yPercent: 14, ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.7 }
    });
  }
  if (glow) {
    gsap.to(glow, {
      yPercent: -10, ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.7 }
    });
  }
  if (neural) {
    gsap.to(neural, {
      yPercent: 22, scale: 1.06, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
    });
  }

  /* ---------- 4. AMBIENT BLOBS — slow mouse-follow + scroll drift ---------- */
  const blobA = document.getElementById('blobA');
  const blobB = document.getElementById('blobB');
  if (blobA && blobB) {
    gsap.set([blobA, blobB], { xPercent: -50, yPercent: -50 });
    gsap.to(blobA, {
      left: '78%', top: '62%', ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1.2 }
    });
    gsap.to(blobB, {
      left: '18%', top: '38%', ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1.2 }
    });

    if (supportsHover) {
      const setAX = gsap.quickTo(blobA, 'x', { duration: 1.4, ease: 'power2.out' });
      const setAY = gsap.quickTo(blobA, 'y', { duration: 1.4, ease: 'power2.out' });
      const setBX = gsap.quickTo(blobB, 'x', { duration: 1.8, ease: 'power2.out' });
      const setBY = gsap.quickTo(blobB, 'y', { duration: 1.8, ease: 'power2.out' });
      window.addEventListener('mousemove', (e) => {
        const nx = (e.clientX / window.innerWidth - 0.5);
        const ny = (e.clientY / window.innerHeight - 0.5);
        setAX(nx * 60); setAY(ny * 60);
        setBX(nx * -50); setBY(ny * -50);
      });
    }
  }

  /* ---------- 5. EXPERIENCE TIMELINE — scroll-scrubbed fill ---------- */
  const tlFill = document.getElementById('tlProgressFill');
  const timeline = document.querySelector('.timeline');
  if (tlFill && timeline) {
    gsap.set(tlFill, { scaleY: 0, transformOrigin: 'top center' });
    gsap.to(tlFill, {
      scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: timeline, start: 'top 75%', end: 'bottom 75%', scrub: 0.6 }
    });
  }

  /* ---------- 6. EASED ANCHOR SCROLLING ---------- */
  if (window.ScrollToPlugin) {
    const navH = 86; // matches CSS scroll-padding-top (nav height + margin)
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        // Re-read at click time, not bind time: a couple of these anchors
        // (the project-modal links) start as "#" placeholders and get a
        // real URL swapped in later by projects.js.
        const id = a.getAttribute('href');
        if (!id || !id.startsWith('#') || id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        gsap.to(window, {
          duration: 1.05, ease: 'power3.inOut',
          scrollTo: { y: target, offsetY: navH },
          onComplete: () => { history.pushState(null, '', id); }
        });
      });
    });
  }
})();
