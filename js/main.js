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

  // Reading checklist — "mark as read" on the timeline, persisted in localStorage
  (function () {
    var items = document.querySelectorAll("#reading-order .timeline-item");
    if (!items.length) return;
    var KEY = "lanternLore.readingProgress.v1";
    var saved = {};
    try { saved = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { saved = {}; }

    var bar = document.getElementById("reading-progress");
    var fill = document.getElementById("reading-progress-fill");
    var text = document.getElementById("reading-progress-text");

    function slug(s) {
      return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    }
    function update() {
      var done = 0;
      items.forEach(function (it) {
        if (it.classList.contains("is-read")) done++;
      });
      if (bar) {
        bar.hidden = false;
        var pct = items.length ? Math.round((done / items.length) * 100) : 0;
        if (fill) fill.style.width = pct + "%";
        if (text) text.textContent = done === items.length
          ? "Saga complete — in brightest day, well read."
          : done + " of " + items.length + " read (" + pct + "%)";
      }
      try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) {}
    }

    items.forEach(function (it) {
      var h3 = it.querySelector("h3");
      if (!h3) return;
      var id = slug(h3.textContent);
      var label = document.createElement("label");
      label.className = "read-check";
      var box = document.createElement("input");
      box.type = "checkbox";
      box.setAttribute("aria-label", "Mark as read: " + h3.textContent.trim());
      var mark = document.createElement("span");
      mark.className = "read-check-box";
      mark.setAttribute("aria-hidden", "true");
      var word = document.createElement("span");
      word.className = "read-check-word";
      word.textContent = "Read";
      label.appendChild(box);
      label.appendChild(mark);
      label.appendChild(word);
      h3.appendChild(label);
      if (saved[id]) {
        box.checked = true;
        it.classList.add("is-read");
      }
      box.addEventListener("change", function () {
        it.classList.toggle("is-read", box.checked);
        if (box.checked) saved[id] = true; else delete saved[id];
        update();
      });
    });
    update();
  })();


  // Random Lantern — jump to a random character page
  (function () {
    var btn = document.getElementById("random-lantern");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var cards = document.querySelectorAll("a.character-card[href*=\"character.html?id=\"]");
      if (!cards.length) return;
      var pick = cards[Math.floor(Math.random() * cards.length)];
      window.location.href = pick.getAttribute("href");
    });
  })();

})();
