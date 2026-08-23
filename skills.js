// ============================================================
// SKILLS — animate proficiency bars into view once, on scroll
// ============================================================
(function () {
  const bars = document.querySelectorAll('.skill-bar i[data-width]');
  if (!bars.length) return;

  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const w = el.getAttribute('data-width');
          requestAnimationFrame(() => { el.style.width = w + '%'; });
          obs.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );
  bars.forEach((el) => io.observe(el));
})();
