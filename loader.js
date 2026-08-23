// ============================================================
// LOADER — simulated progress fill, then reveal the page
// ============================================================
(function () {
  const loader = document.getElementById('loader');
  const fill = document.getElementById('loaderFill');
  if (!loader || !fill) return;

  let pct = 0;
  const tick = () => {
    pct += Math.random() * 18 + 6;
    if (pct >= 100) {
      pct = 100;
      fill.style.width = pct + '%';
      finish();
      return;
    }
    fill.style.width = pct + '%';
    setTimeout(tick, 90 + Math.random() * 90);
  };

  function finish() {
    setTimeout(() => {
      loader.classList.add('is-hidden');
      document.body.classList.add('is-loaded');
      loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    }, 220);
  }

  // don't block on slow assets — cap total loader time
  setTimeout(tick, 120);
  window.addEventListener('load', () => {
    if (pct < 60) { pct = 60; }
  });
})();
