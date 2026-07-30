/* main.js — small final touches that don't warrant their own file */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    // "Location" contact line opens a maps search instead of a dead link
    var locationLink = document.querySelector('[data-location]');
    if (locationLink) {
      locationLink.addEventListener("click", function (e) {
        e.preventDefault();
        window.open("https://www.google.com/maps/search/?api=1&query=Lahore,Pakistan", "_blank", "noopener");
      });
    }

    // Smooth-scroll fallback for browsers that ignore CSS scroll-behavior
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var id = link.getAttribute("href");
        if (id.length <= 1) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var navHeight = document.getElementById("siteNav") ? document.getElementById("siteNav").offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.pageYOffset - navHeight + 1;
        window.scrollTo({ top: top, behavior: "smooth" });
      });
    });
  });
})();
