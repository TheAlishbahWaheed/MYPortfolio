// ============================================================
// REVEAL — staggered scroll reveals + animated stat counters
// ============================================================
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = Array.from(document.querySelectorAll('[data-reveal]'));

  if (reduceMotion) {
    items.forEach((el) => el.classList.add('is-visible'));
  } else {
    // stagger items that share the same section
    const bySection = new Map();
    items.forEach((el) => {
      const section = el.closest('section') || document.body;
      if (!bySection.has(section)) bySection.set(section, []);
      bySection.get(section).push(el);
    });
    bySection.forEach((els) => {
      els.forEach((el, i) => { el.style.transitionDelay = Math.min(i, 6) * 70 + 'ms'; });
    });

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    items.forEach((el) => io.observe(el));
  }

  // ---- animated counters ----
  const counters = Array.from(document.querySelectorAll('[data-count]'));
  function animateCount(el) {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const isYear = el.hasAttribute('data-nosep');
    const dur = 1400;
    const start = performance.now();
    function frame(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(target * eased);
      el.textContent = isYear ? String(val) : String(val);
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = String(target);
    }
    requestAnimationFrame(frame);
  }

  if (counters.length) {
    const cio = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reduceMotion ? (entry.target.textContent = entry.target.getAttribute('data-count')) : animateCount(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((el) => cio.observe(el));
  }
})();
