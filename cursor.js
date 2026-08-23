// ============================================================
// CUSTOM CURSOR — dot + ring follow, magnetic CTAs, glow field
// Disabled automatically on touch devices / coarse pointers.
// ============================================================
(function () {
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!supportsHover || reduceMotion) return;

  document.body.classList.add('has-cursor');

  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  const glow = document.getElementById('cursorGlow');

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my, gx = mx, gy = my;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (dot) { dot.style.left = mx + 'px'; dot.style.top = my + 'px'; }
  });

  function raf() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    gx += (mx - gx) * 0.08;
    gy += (my - gy) * 0.08;
    if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
    if (glow) { glow.style.transform = `translate(${gx}px, ${gy}px)`; }
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  const interactiveSelector = 'a, button, input, textarea, .proj-card, [data-nav]';
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest(interactiveSelector);
    if (!target) return;
    dot && dot.classList.add('is-active');
    ring && ring.classList.add('is-active');
  });
  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest(interactiveSelector);
    if (!target) return;
    dot && dot.classList.remove('is-active');
    ring && ring.classList.remove('is-active');
  });

  // magnetic pull for CTAs
  const magnets = document.querySelectorAll('.magnetic');
  magnets.forEach((el) => {
    let bounds;
    el.addEventListener('mouseenter', () => { bounds = el.getBoundingClientRect(); });
    el.addEventListener('mousemove', (e) => {
      if (!bounds) bounds = el.getBoundingClientRect();
      const relX = e.clientX - bounds.left - bounds.width / 2;
      const relY = e.clientY - bounds.top - bounds.height / 2;
      el.style.transform = `translate(${relX * 0.28}px, ${relY * 0.35}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
})();
