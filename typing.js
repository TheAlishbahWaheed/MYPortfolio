// ============================================================
// SCRAMBLE TEXT — cycles through roles in the hero subhead with a
// matrix-style decrypt transition (random glyphs resolving left to
// right into the next word), instead of a plain backspace/retype.
// Falls back to a static first role under prefers-reduced-motion.
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

  const GLYPHS = '!<>-_\\/[]{}=+*^?#$%';
  let roleIndex = 0;
  let queue = [];
  let frame = 0;
  let frameRequest = null;

  function scrambleTo(newText) {
    const oldText = el.textContent || '';
    const length = Math.max(oldText.length, newText.length);
    queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 18);
      const end = start + 14 + Math.floor(Math.random() * 18);
      queue.push({ from, to, start, end, char: '' });
    }
    cancelAnimationFrame(frameRequest);
    frame = 0;
    update();
  }

  function update() {
    let output = '';
    let complete = 0;

    for (let i = 0; i < queue.length; i++) {
      const q = queue[i];
      if (frame >= q.end) {
        complete++;
        output += q.to;
      } else if (frame >= q.start) {
        if (!q.char || Math.random() < 0.3) {
          q.char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        output += `<span class="scramble-glyph">${q.char}</span>`;
      } else {
        output += q.from;
      }
    }

    el.innerHTML = output;

    if (complete === queue.length) {
      setTimeout(nextRole, 1900);
      return;
    }
    frame++;
    frameRequest = requestAnimationFrame(update);
  }

  function nextRole() {
    roleIndex = (roleIndex + 1) % roles.length;
    scrambleTo(roles[roleIndex]);
  }

  el.textContent = '';
  setTimeout(() => scrambleTo(roles[0]), 900);
})();
