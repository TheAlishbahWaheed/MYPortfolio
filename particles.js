// ============================================================
// CANVAS VISUALS
// 1) Hero neural-network field — nodes drift, connect when close,
//    and gently follow the cursor.
// 2) AI panel visualization — a small layered network with a
//    pulse signal travelling from input to output.
// ============================================================
(function heroNeuralNetwork() {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w, h, dpr;
  let nodes = [];
  let mouse = { x: -9999, y: -9999 };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.offsetWidth;
    h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(70, Math.max(28, Math.floor((w * h) / 22000)));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 1.6 + 0.8
    }));
  }

  function step() {
    ctx.clearRect(0, 0, w, h);
    const maxDist = 140;

    nodes.forEach((n) => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;

      const dx = mouse.x - n.x, dy = mouse.y - n.y;
      const d = Math.hypot(dx, dy);
      if (d < 160) {
        n.x -= dx * 0.0018;
        n.y -= dy * 0.0018;
      }
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.35;
          ctx.strokeStyle = `rgba(139,107,255,${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    nodes.forEach((n) => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(43,226,226,0.75)';
      ctx.fill();
    });

    if (!reduceMotion) requestAnimationFrame(step);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  resize();
  if (reduceMotion) { step(); } else { requestAnimationFrame(step); }
})();

(function aiPipelinePanel() {
  const canvas = document.getElementById('aiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w, h, dpr;
  const layers = [2, 4, 5, 4, 1]; // input -> hidden -> output node counts
  let layout = [];
  let pulse = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.offsetWidth;
    h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const padX = w * 0.12, padY = h * 0.14;
    layout = layers.map((count, li) => {
      const x = padX + (li / (layers.length - 1)) * (w - padX * 2);
      return Array.from({ length: count }, (_, ni) => {
        const y = count === 1 ? h / 2 : padY + (ni / (count - 1)) * (h - padY * 2);
        return { x, y };
      });
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // edges
    for (let li = 0; li < layout.length - 1; li++) {
      layout[li].forEach((a) => {
        layout[li + 1].forEach((b) => {
          ctx.strokeStyle = 'rgba(139,107,255,0.14)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        });
      });
    }

    // traveling pulse along the whole path
    const totalSegs = layout.length - 1;
    const segFloat = pulse * totalSegs;
    const segIndex = Math.min(Math.floor(segFloat), totalSegs - 1);
    const segT = segFloat - segIndex;
    const fromLayer = layout[segIndex];
    const toLayer = layout[segIndex + 1];
    if (fromLayer && toLayer) {
      const a = fromLayer[Math.floor(fromLayer.length / 2)];
      const b = toLayer[Math.floor(toLayer.length / 2)];
      const px = a.x + (b.x - a.x) * segT;
      const py = a.y + (b.y - a.y) * segT;
      const grad = ctx.createRadialGradient(px, py, 0, px, py, 16);
      grad.addColorStop(0, 'rgba(43,226,226,0.9)');
      grad.addColorStop(1, 'rgba(43,226,226,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, 16, 0, Math.PI * 2);
      ctx.fill();
    }

    // nodes
    layout.forEach((layer, li) => {
      layer.forEach((n) => {
        const isActive = li === segIndex || li === segIndex + 1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, isActive ? 5 : 4, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? '#2BE2E2' : 'rgba(237,239,247,0.55)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(n.x, n.y, isActive ? 9 : 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(43,226,226,0.35)';
        ctx.lineWidth = 1;
        if (isActive) ctx.stroke();
      });
    });

    pulse += 0.0055;
    if (pulse > 1) pulse = 0;

    if (!reduceMotion) requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  if (reduceMotion) { pulse = 0.5; draw(); } else { requestAnimationFrame(draw); }
})();
