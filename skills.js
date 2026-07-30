/* skills.js — animates skill progress bars and orbit rings on scroll into view */
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
      ring.style.transition = "background 1.1s cubic-bezier(.22,1,.36,1)";
    }

    if (!("IntersectionObserver" in window)) {
      bars.forEach(fillBar);
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
