/* loader.js — polished loading screen with progress fill */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var loader = document.getElementById("loader");
    var fill = document.getElementById("loaderFill");
    if (!loader || !fill) return;

    var progress = 0;
    var interval = setInterval(function () {
      progress += Math.random() * 18 + 6;
      if (progress > 92) progress = 92;
      fill.style.width = progress + "%";
    }, 140);

    function finish() {
      clearInterval(interval);
      fill.style.width = "100%";
      setTimeout(function () {
        loader.classList.add("loader-hide");
        document.body.style.overflow = "";
      }, 380);
    }

    document.body.style.overflow = "hidden";

    if (document.readyState === "complete") {
      setTimeout(finish, 500);
    } else {
      window.addEventListener("load", function () {
        setTimeout(finish, 500);
      });
      // Safety net: never block the site for more than ~4s
      setTimeout(finish, 4000);
    }
  });
})();
