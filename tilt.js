/* tilt.js — subtle 3D tilt hover effect for cards, disabled on touch devices */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var isTouch = window.matchMedia && window.matchMedia("(hover: none), (pointer: coarse)").matches;
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || reduceMotion) return;

    var cards = document.querySelectorAll(".proj-card");
    var MAX_TILT = 6;

    cards.forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        var rotateX = (-y * MAX_TILT).toFixed(2);
        var rotateY = (x * MAX_TILT).toFixed(2);
        card.style.transform = "perspective(700px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) translateY(-4px)";

        var glow = card.querySelector(".proj-card-glow");
        if (glow) {
          glow.style.opacity = "0.28";
          glow.style.top = (e.clientY - rect.top - 110) + "px";
          glow.style.left = (e.clientX - rect.left - 110) + "px";
          glow.style.right = "auto";
        }
      });

      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
        var glow = card.querySelector(".proj-card-glow");
        if (glow) glow.style.opacity = "";
      });
    });
  });
})();
