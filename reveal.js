/* reveal.js — scroll-triggered reveals + animated counters using IntersectionObserver */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var revealEls = document.querySelectorAll(".reveal-up");
    var counters = document.querySelectorAll(".stat-num[data-count]");
    var animatedCounters = new WeakSet();

    function animateCounter(el) {
      if (animatedCounters.has(el)) return;
      animatedCounters.add(el);
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var duration = 1200;
      var startTime = null;

      function step(ts) {
        if (!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.round(eased * target);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target;
        }
      }
      requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("in-view"); });
      counters.forEach(animateCounter);
      return;
    }

    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });

    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) { counterObserver.observe(el); });
  });
})();
