/* nav.js — navbar scroll state, mobile menu, scrollspy, back-to-top, scroll progress */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var nav = document.getElementById("siteNav");
    var burger = document.getElementById("navBurger");
    var navLinks = document.getElementById("navLinks");
    var scrim = document.getElementById("navScrim");
    var toTop = document.getElementById("toTop");
    var scrollFill = document.getElementById("scrollFill");
    var yearEl = document.getElementById("year");

    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Mobile menu toggle
    function closeMenu() {
      burger.classList.remove("open");
      navLinks.classList.remove("open");
      scrim.classList.remove("show");
      burger.setAttribute("aria-expanded", "false");
    }
    function openMenu() {
      burger.classList.add("open");
      navLinks.classList.add("open");
      scrim.classList.add("show");
      burger.setAttribute("aria-expanded", "true");
    }
    if (burger) {
      burger.addEventListener("click", function () {
        var isOpen = navLinks.classList.contains("open");
        isOpen ? closeMenu() : openMenu();
      });
    }
    if (scrim) scrim.addEventListener("click", closeMenu);
    document.querySelectorAll('.nav-links a[data-nav]').forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });

    // Scroll-driven UI: navbar bg, progress bar, back-to-top, scrollspy
    var sections = document.querySelectorAll("main section[id]");
    var navAnchors = document.querySelectorAll('.nav-links a[data-nav]');

    function onScroll() {
      var y = window.scrollY || window.pageYOffset;

      // Navbar background
      if (nav) nav.classList.toggle("scrolled", y > 40);

      // Back to top button
      if (toTop) toTop.classList.toggle("show", y > 600);

      // Scroll progress bar
      if (scrollFill) {
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var pct = docHeight > 0 ? (y / docHeight) * 100 : 0;
        scrollFill.style.width = pct + "%";
      }

      // Scrollspy
      var current = "";
      sections.forEach(function (sec) {
        var rect = sec.getBoundingClientRect();
        if (rect.top <= 140 && rect.bottom >= 140) {
          current = sec.id;
        }
      });
      navAnchors.forEach(function (a) {
        var href = a.getAttribute("href").replace("#", "");
        a.classList.toggle("active", href === current);
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (toTop) {
      toTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  });
})();
