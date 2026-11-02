/* Lantern Lore — site-wide search. 100% client-side. */
(function () {
  "use strict";

  var prefix = window.location.pathname.indexOf("/corps/") !== -1 ? "../" : "";
  var indexUrl = prefix + "data/search-index.json";

  var form = document.querySelector(".site-search");
  if (!form) return;
  var input = form.querySelector("input");
  var box = form.querySelector(".search-results");
  var entries = null;

  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function hide() { box.hidden = true; box.innerHTML = ""; }

  function show(q) {
    if (!entries || q.length < 2) { hide(); return; }
    var ql = q.toLowerCase();
    var hits = entries.filter(function (e) { return e.k.indexOf(ql) !== -1; }).slice(0, 8);
    if (!hits.length) {
      box.innerHTML = '<p class="search-empty">No lanterns found. Try "rage", "hope", or a name.</p>';
    } else {
      box.innerHTML = hits.map(function (e) {
        var type = 'Page';
        var u = e.u;
        if (u.indexOf('character.html') !== -1) type = 'Character';
        else if (u.indexOf('worlds/') !== -1) type = u === 'worlds/index.html' ? 'Section' : 'World';
        else if (u.indexOf('stories/') !== -1) type = 'Story';
        else if (u.indexOf('moments/') !== -1) type = 'Moment';
        else if (u.indexOf('events/') !== -1) type = u === 'events.html' ? 'Section' : 'Event';
        else if (u.indexOf('entities/') !== -1) type = 'Entity';
        else if (u.indexOf('corps/') !== -1) type = 'Corps';
        else if (u.indexOf('screen/') !== -1) type = 'Screen';
        else if (u.indexOf('eras/') !== -1) type = 'Era';
        else if (u === 'glossary.html' || u === 'powers.html' || u === 'constructs.html' || u === 'quotes.html' || u === 'creators.html' || u === 'quiz.html' || u === 'timeline.html' || u === 'spectrum.html' || u === 'characters.html' || u === 'index.html') type = 'Section';
        return '<a class="search-hit" href="' + prefix + esc(e.u) + '">' +
          '<strong>' + esc(e.t) + '</strong><em class="search-type">' + type + '</em><span>' + esc(e.s) + '</span></a>';
      }).join("");
    }
    box.hidden = false;
  }

  fetch(indexUrl).then(function (r) { return r.json(); }).then(function (data) {
    entries = data;
  }).catch(function () { /* search stays quiet if the index can't load */ });

  var t = null;
  input.addEventListener("input", function () {
    clearTimeout(t);
    t = setTimeout(function () { show(input.value.trim()); }, 120);
  });
  input.addEventListener("focus", function () { show(input.value.trim()); });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { hide(); input.blur(); }
  });
  document.addEventListener("click", function (e) {
    if (!form.contains(e.target)) hide();
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var first = box.querySelector(".search-hit");
    if (first) window.location.href = first.getAttribute("href");
  });
})();
