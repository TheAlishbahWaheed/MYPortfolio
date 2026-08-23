// ============================================================
// MAIN — scroll progress bar, back-to-top, footer year
// ============================================================
(function () {
  const scrollFill = document.getElementById('scrollFill');
  const backToTop = document.getElementById('backToTop');
  const yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? (scrolled / max) * 100 : 0;
      if (scrollFill) scrollFill.style.width = pct + '%';
      if (backToTop) backToTop.classList.toggle('is-visible', scrolled > 600);
      ticking = false;
    });
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
