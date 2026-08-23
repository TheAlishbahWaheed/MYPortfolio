// ============================================================
// TILT — physics-based 3D hover tilt + glow position for cards
// Uses GSAP quickTo (buttery interpolation, elastic release) when
// available; falls back to the original direct-style version so the
// site still works if the GSAP CDN is ever blocked.
// ============================================================
(function () {
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!supportsHover || reduceMotion) return;

  const cards = document.querySelectorAll('.proj-card, .cert-card, .skill-card, .ach-card, .ai-pipeline-step');
  const hasGSAP = typeof window.gsap !== 'undefined';

  cards.forEach((card) => {
    let bounds;

    if (hasGSAP) {
      gsap.set(card, { transformPerspective: 900, transformStyle: 'preserve-3d' });
      const setX = gsap.quickTo(card, 'rotateY', { duration: 0.55, ease: 'power3.out' });
      const setY = gsap.quickTo(card, 'rotateX', { duration: 0.55, ease: 'power3.out' });
      const setLift = gsap.quickTo(card, 'y', { duration: 0.55, ease: 'power3.out' });

      card.addEventListener('mouseenter', () => {
        bounds = card.getBoundingClientRect();
        setLift(-6);
      });
      card.addEventListener('mousemove', (e) => {
        if (!bounds) bounds = card.getBoundingClientRect();
        const px = (e.clientX - bounds.left) / bounds.width;
        const py = (e.clientY - bounds.top) / bounds.height;
        setY((py - 0.5) * -7);
        setX((px - 0.5) * 7);
        card.style.setProperty('--mx', (px * 100) + '%');
        card.style.setProperty('--my', (py * 100) + '%');
      });
      card.addEventListener('mouseleave', () => {
        // slight elastic overshoot back to rest — reads as "premium", not gimmicky
        gsap.to(card, { rotateX: 0, rotateY: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.6)' });
      });
    } else {
      card.addEventListener('mouseenter', () => { bounds = card.getBoundingClientRect(); });
      card.addEventListener('mousemove', (e) => {
        if (!bounds) bounds = card.getBoundingClientRect();
        const px = (e.clientX - bounds.left) / bounds.width;
        const py = (e.clientY - bounds.top) / bounds.height;
        const rx = (py - 0.5) * -6;
        const ry = (px - 0.5) * 6;
        card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
        card.style.setProperty('--mx', (px * 100) + '%');
        card.style.setProperty('--my', (py * 100) + '%');
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    }
  });
})();
