/* particles.js — soft pastel "constellation" canvas: an ambient nod to neural networks,
   drawn with the same palette as the rest of the page. Subtle drift + gentle mouse parallax. */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var canvas = document.getElementById("constellation");
    if (!canvas) return;

    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var ctx = canvas.getContext("2d");
    var hero = canvas.closest(".hero");
    var W, H, DPR;
    var nodes = [];
    var pointer = { x: null, y: null };
    var rafId = null;

    var PALETTE = ["#C9BFEA", "#B7D8E8", "#F3CDD6", "#F6D9BC", "#B9CFB2"];

    function isDark() {
      return document.documentElement.getAttribute("data-theme") === "dark";
    }

    function resize() {
      var rect = hero.getBoundingClientRect();
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      buildNodes();
    }

    function buildNodes() {
      var count = Math.round((W * H) / 26000);
      count = Math.max(18, Math.min(count, 60));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          r: Math.random() * 1.6 + 1.2,
          color: PALETTE[i % PALETTE.length]
        });
      }
    }

    function step() {
      ctx.clearRect(0, 0, W, H);
      var linkDist = 150;
      var lineAlpha = isDark() ? 0.14 : 0.10;

      // Update positions
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;

        // gentle pointer attraction
        if (pointer.x !== null) {
          var dx = pointer.x - n.x;
          var dy = pointer.y - n.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180 && dist > 0.001) {
            n.x += dx * 0.0025;
            n.y += dy * 0.0025;
          }
        }
      }

      // Draw links
      for (var a = 0; a < nodes.length; a++) {
        for (var b = a + 1; b < nodes.length; b++) {
          var na = nodes[a], nb = nodes[b];
          var ddx = na.x - nb.x, ddy = na.y - nb.y;
          var d = Math.sqrt(ddx * ddx + ddy * ddy);
          if (d < linkDist) {
            ctx.strokeStyle = "rgba(150,130,190," + (lineAlpha * (1 - d / linkDist)) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(na.x, na.y);
            ctx.lineTo(nb.x, nb.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (var j = 0; j < nodes.length; j++) {
        var node = nodes[j];
        ctx.beginPath();
        ctx.fillStyle = node.color;
        ctx.globalAlpha = isDark() ? 0.55 : 0.65;
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      rafId = requestAnimationFrame(step);
    }

    resize();
    window.addEventListener("resize", resize);

    hero.addEventListener("mousemove", function (e) {
      var rect = hero.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    });
    hero.addEventListener("mouseleave", function () {
      pointer.x = null;
      pointer.y = null;
    });

    if (reduceMotion) {
      // Render a single static frame instead of a continuous animation loop
      step();
      cancelAnimationFrame(rafId);
    } else {
      step();
    }
  });
})();
