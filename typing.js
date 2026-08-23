// ============================================================
// TYPEWRITER — cycles through roles in the hero subhead
// ============================================================
(function () {
  const el = document.getElementById('typedRole');
  if (!el) return;

  const roles = [
    'AI-powered tools',
    'machine learning models',
    'Flask web applications',
    'clean, working software'
  ];

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    el.textContent = roles[0];
    return;
  }

  let roleIndex = 0;
  let charIndex = roles[0].length;
  let deleting = false;

  function step() {
    const current = roles[roleIndex];

    if (!deleting) {
      charIndex++;
      if (charIndex > current.length) {
        deleting = true;
        setTimeout(step, 1500);
        return;
      }
    } else {
      charIndex--;
      if (charIndex < 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        charIndex = 0;
        el.textContent = '';
        setTimeout(step, 260);
        return;
      }
    }

    el.textContent = current.slice(0, charIndex);
    setTimeout(step, deleting ? 32 : 58);
  }

  el.textContent = '';
  charIndex = 0;
  setTimeout(step, 900);
})();
