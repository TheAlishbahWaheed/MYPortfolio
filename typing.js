/* typing.js — typewriter effect cycling through roles in the hero */
(function () {
  "use strict";

  var PHRASES = [
    "intelligent software.",
    "AI-powered tools.",
    "clean, purposeful code.",
    "web experiences that work."
  ];

  document.addEventListener("DOMContentLoaded", function () {
    var el = document.getElementById("typewriter");
    if (!el) return;

    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      el.textContent = PHRASES[0];
      return;
    }

    var phraseIndex = 0;
    var charIndex = 0;
    var deleting = false;
    var TYPE_SPEED = 55;
    var DELETE_SPEED = 30;
    var HOLD_TIME = 1600;

    function tick() {
      var current = PHRASES[phraseIndex];

      if (!deleting) {
        charIndex++;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, HOLD_TIME);
          return;
        }
        setTimeout(tick, TYPE_SPEED);
      } else {
        charIndex--;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % PHRASES.length;
          setTimeout(tick, 350);
          return;
        }
        setTimeout(tick, DELETE_SPEED);
      }
    }

    tick();
  });
})();
