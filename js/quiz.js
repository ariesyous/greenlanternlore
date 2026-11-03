/* Lantern Lore — "Which Corps Are You?" quiz. 100% client-side. */
(function () {
  "use strict";

  var CORPS = {
    red:    { name: "Red Lantern Corps",   emotion: "Rage",      page: "corps/red.html",
              blurb: "You run hot. Your rage is a weapon — point it at something that deserves it.",
              kindred: "Atrocitus", kindredId: "atrocitus" },
    orange: { name: "Orange Lantern Corps", emotion: "Avarice",  page: "corps/orange.html",
              blurb: "What's yours is yours — and what's theirs is also yours. Larfleeze would be proud. (Terrifying, but proud.)",
              kindred: "Larfleeze", kindredId: "larfleeze" },
    yellow: { name: "Sinestro Corps",      emotion: "Fear",      page: "corps/yellow.html",
              blurb: "You understand what others won't admit: fear gets results.",
              kindred: "Sinestro", kindredId: "sinestro" },
    green:  { name: "Green Lantern Corps", emotion: "Will",      page: "corps/green.html",
              blurb: "Willpower incarnate. The universe's most reliable light.",
              kindred: "Hal Jordan", kindredId: "hal-jordan" },
    blue:   { name: "Blue Lantern Corps",  emotion: "Hope",      page: "corps/blue.html",
              blurb: "Hopeful to your core. All will be well — especially with you around.",
              kindred: "Saint Walker", kindredId: "saint-walker" },
    indigo: { name: "Indigo Tribe",        emotion: "Compassion", page: "corps/indigo.html",
              blurb: "You feel everyone's pain. Nok — compassion be with you.",
              kindred: "Indigo-1", kindredId: "indigo-1" },
    violet: { name: "Star Sapphires",      emotion: "Love",      page: "corps/violet.html",
              blurb: "You love fiercely. Hearts long lost find refuge with you.",
              kindred: "Carol Ferris", kindredId: "carol-ferris" },
    black:  { name: "Black Lantern Corps", emotion: "Death",     page: "corps/black.html",
              blurb: "...you might want to talk to someone about that. (Or just: rise.)",
              kindred: "Black Hand", kindredId: "black-hand" },
    white:  { name: "White Lantern Corps", emotion: "Life",      page: "corps/white.html",
              blurb: "Life itself chose you. No pressure.",
              kindred: "Kyle Rayner", kindredId: "kyle-rayner" }
  };

  var QUESTIONS = [
    { q: "It's Friday night. Where are you?",
      a: [
        { t: "Leading the charge on a night out", c: ["green", "red"] },
        { t: "Home, reorganizing my collection", c: ["orange"] },
        { t: "Helping a friend move. Again.", c: ["blue", "indigo"] },
        { t: "Plotting. Always plotting.", c: ["yellow"] }
      ] },
    { q: "Pick a weapon:",
      a: [
        { t: "Whatever I can imagine", c: ["green"] },
        { t: "Fear itself", c: ["yellow"] },
        { t: "My fists. And my rage.", c: ["red"] },
        { t: "I don't fight. I fix.", c: ["blue", "indigo"] }
      ] },
    { q: "What drives you most?",
      a: [
        { t: "Proving I can", c: ["green"] },
        { t: "Having it all", c: ["orange"] },
        { t: "Being loved", c: ["violet"] },
        { t: "Peace and quiet", c: ["blue"] }
      ] },
    { q: "Your biggest flaw?",
      a: [
        { t: "I never back down", c: ["red", "green"] },
        { t: "I want too much", c: ["orange"] },
        { t: "I care too much", c: ["violet", "indigo"] },
        { t: "I scare people", c: ["yellow", "black"] }
      ] },
    { q: "Choose a motto:",
      a: [
        { t: "\u201CAll will be well\u201D", c: ["blue"] },
        { t: "\u201CWhat's mine is mine\u201D", c: ["orange"] },
        { t: "\u201CNo evil shall escape my sight\u201D", c: ["green"] },
        { t: "\u201CNok\u201D", c: ["indigo"] }
      ] },
    { q: "How do you handle enemies?",
      a: [
        { t: "Outthink them", c: ["green", "yellow"] },
        { t: "Outlast them", c: ["red"] },
        { t: "Convert them", c: ["indigo", "violet"] },
        { t: "Outlive them. Literally.", c: ["black", "white"] }
      ] },
    { q: "Your energy in a group project:",
      a: [
        { t: "The leader", c: ["green", "yellow"] },
        { t: "The wildcard", c: ["red", "orange"] },
        { t: "The heart", c: ["violet", "blue"] },
        { t: "The ghost — did everything, took no credit", c: ["indigo", "white"] }
      ] },
    { q: "Final question: what do you want most?",
      a: [
        { t: "Justice", c: ["green"] },
        { t: "Everything", c: ["orange"] },
        { t: "Peace", c: ["blue", "indigo"] },
        { t: "Forever", c: ["white", "black"] }
      ] },
    { q: "It's the end of the world. What's your move?",
      a: [
        { t: "Hold the line, no matter what", c: ["green"] },
        { t: "Make them afraid of me", c: ["yellow", "red"] },
        { t: "Save who I can, grieve the rest", c: ["blue", "indigo"] },
        { t: "Already dead. This is my moment.", c: ["black"] }
      ] },
    { q: "Pick a pet:",
      a: [
        { t: "A loyal dog", c: ["green", "blue"] },
        { t: "A cat. Obviously. Mine.", c: ["orange"] },
        { t: "Something with claws", c: ["red"] },
        { t: "I don't do pets. I do followers.", c: ["yellow"] }
      ] },
    { q: "What's your relationship with rules?",
      a: [
        { t: "Rules keep the peace", c: ["green", "blue"] },
        { t: "Rules are for the ruled", c: ["yellow"] },
        { t: "What rules?", c: ["red", "orange"] },
        { t: "I follow a higher law", c: ["indigo", "white"] }
      ] },
    { q: "What would your ring construct be?",
      a: [
        { t: "Something practical — a bridge, a shield", c: ["green", "blue"] },
        { t: "Something terrifying", c: ["yellow", "red"] },
        { t: "Something beautiful", c: ["violet", "indigo"] },
        { t: "Whatever I want. All of it.", c: ["orange"] }
      ] }
  ];

  var root = document.getElementById("quiz");
  if (!root) return;

  var scores, step;

  var answers = [];

  function reset() {
    scores = {};
    Object.keys(CORPS).forEach(function (k) { scores[k] = 0; });
    step = 0;
    answers = [];
    renderStart();
  }

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function renderStart() {
    root.innerHTML = "";
    root.appendChild(el("h2", "quiz-q", "Twelve questions. Nine possible destinies."));
    var p = el("p", null, "Answer honestly — the ring can tell when you're lying.");
    p.style.color = "var(--ink-dim)";
    root.appendChild(p);
    var btn = el("button", "quiz-begin", "Begin the sorting");
    btn.addEventListener("click", renderQuestion);
    root.appendChild(btn);
  }

  function renderQuestion() {
    var q = QUESTIONS[step];
    root.innerHTML = "";
    root.appendChild(el("p", "quiz-progress", "Question " + (step + 1) + " of " + QUESTIONS.length));
    root.appendChild(el("h2", "quiz-q", q.q));
    var list = el("div", "quiz-answers");
    q.a.forEach(function (ans) {
      var b = el("button", null, ans.t);
      b.addEventListener("click", function () {
        answers.push(ans.c.slice());
        ans.c.forEach(function (k) { scores[k] += 1; });
        step++;
        if (step < QUESTIONS.length) renderQuestion();
        else renderResult();
      });
      list.appendChild(b);
    });
    root.appendChild(list);
    if (step > 0) {
      var back = el("button", "quiz-back", "&larr; Back");
      back.addEventListener("click", function () {
        var last = answers.pop();
        if (last) last.forEach(function (k) { scores[k] -= 1; });
        step--;
        renderQuestion();
      });
      root.appendChild(back);
    }
  }

  function renderResult() {
    var winner = Object.keys(scores).sort(function (a, b) { return scores[b] - scores[a]; })[0];
    var c = CORPS[winner];
    root.innerHTML = "";
    root.className = "panel quiz-panel quiz-result corps-" + winner;
    root.appendChild(el("p", "eyebrow", "Your Corps"));
    root.appendChild(el("h2", null, c.name));
    root.appendChild(el("p", "quiz-emotion", c.emotion));
    root.appendChild(el("p", null, c.blurb));
    var kindred = el("p", "quiz-kindred", null);
    kindred.innerHTML = "You'd fight alongside <a href=\"character.html?id=" + c.kindredId + "\">" + c.kindred + "</a>.";
    root.appendChild(kindred);
    var actions = el("div", "quiz-actions");
    var go = el("a", "quiz-go", "Explore the " + c.name + " &rarr;");
    go.href = c.page;
    var again = el("button", "quiz-again", "Retake");
    again.addEventListener("click", function () {
      root.className = "panel quiz-panel";
      reset();
    });
    actions.appendChild(go);
    actions.appendChild(again);
    root.appendChild(actions);
  }

  reset();
})();
