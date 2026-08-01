/* skills.js — animates skill progress bars and orbit rings (with counting percentage) on scroll into view */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var bars = document.querySelectorAll(".skill-bar");
    var rings = document.querySelectorAll(".orbit-ring");

    function fillBar(bar) {
      var level = bar.getAttribute("data-level") || "0";
      var track = bar.querySelector(".skill-track i");
      if (track) track.style.width = level + "%";
    }

    function growRing(ring) {
      var target = parseInt(ring.getAttribute("data-p") || "0", 10);
      var percentEl = ring.querySelector(".orbit-percent");
      var start = null;
      var duration = 1300;

      function frame(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.round(eased * target);
        ring.style.setProperty("--p", current);
        if (percentEl) percentEl.textContent = current + "%";
        if (progress < 1) {
          requestAnimationFrame(frame);
        }
      }
      requestAnimationFrame(frame);
    }

    if (!("IntersectionObserver" in window)) {
      bars.forEach(fillBar);
      rings.forEach(function (r) {
        var target = parseInt(r.getAttribute("data-p") || "0", 10);
        r.style.setProperty("--p", target);
        var p = r.querySelector(".orbit-percent");
        if (p) p.textContent = target + "%";
      });
      return;
    }

    var barObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            fillBar(entry.target);
            barObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    bars.forEach(function (b) { barObserver.observe(b); });

    var ringObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            growRing(entry.target);
            ringObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    rings.forEach(function (r) { ringObserver.observe(r); });
  });
})();
