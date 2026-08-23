/* theme.js — light/dark mode toggle with persistence & system preference detection */
(function () {
  "use strict";

  var STORAGE_KEY = "aw-portfolio-theme";
  var root = document.documentElement;

  function getPreferredTheme() {
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    root.style.colorScheme = theme;
    var toggle = document.getElementById("themeToggle");
    if (toggle) {
      toggle.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
      toggle.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#06070B" : "#FAFAFC");
    try {
      window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: theme } }));
    } catch (e) {}
  }

  // Apply immediately to avoid flash of wrong theme
  applyTheme(getPreferredTheme());

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.getElementById("themeToggle");
    if (!toggle) return;

    toggle.addEventListener("click", function () {
      var current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      var next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    });
  });
})();
