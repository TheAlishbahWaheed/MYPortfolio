/* projects.js — client-side filtering for the projects grid */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var filterBar = document.getElementById("projFilters");
    var grid = document.getElementById("projGrid");
    var emptyMsg = document.getElementById("projEmpty");
    if (!filterBar || !grid) return;

    var chips = filterBar.querySelectorAll(".pf-chip");
    var cards = grid.querySelectorAll(".proj-card");

    filterBar.addEventListener("click", function (e) {
      var chip = e.target.closest(".pf-chip");
      if (!chip) return;

      chips.forEach(function (c) { c.classList.remove("active"); });
      chip.classList.add("active");

      var filter = chip.getAttribute("data-filter");
      var visibleCount = 0;

      cards.forEach(function (card) {
        var tags = (card.getAttribute("data-tags") || "").split(" ");
        var show = filter === "all" || tags.indexOf(filter) !== -1;
        card.classList.toggle("filtered-out", !show);
        if (show) visibleCount++;
      });

      if (emptyMsg) emptyMsg.classList.toggle("show", visibleCount === 0);
    });
  });
})();
