/* Lantern Lore — small interactive touches. No frameworks, no backend. */
(function () {
  "use strict";

  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Footer year
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Subtle tilt on spectrum bands for pointer devices (pure delight, no deps)
  var bands = document.querySelectorAll(".band");
  bands.forEach(function (band) {
    band.addEventListener("pointermove", function (e) {
      var r = band.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      band.style.transform = "perspective(400px) rotateY(" + (x * 10).toFixed(1) + "deg)";
    });
    band.addEventListener("pointerleave", function () {
      band.style.transform = "";
    });
  });

  // Random Lantern — jump to a random character page
  (function () {
    var btn = document.getElementById("random-lantern");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var cards = document.querySelectorAll("a.character-card");
      if (!cards.length) return;
      var pick = cards[Math.floor(Math.random() * cards.length)];
      window.location.href = pick.getAttribute("href");
    });
  })();

})();
