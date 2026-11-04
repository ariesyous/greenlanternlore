/* Lantern Lore — character detail page. Renders one character from data/characters.json via ?id=. */
(async () => {
  const root = document.getElementById('character-detail');
  const id = new URLSearchParams(location.search).get('id');

  const fail = () => {
    document.title = 'Unknown Lantern — Lantern Lore';
    root.innerHTML = '<h2>Unknown lantern</h2>' +
      '<p class="section-lede">No character found with that id.</p>' +
      '<p><a href="characters.html" style="color:var(--green);font-weight:800">← Back to the roster</a></p>';
  };

  if (!id) { fail(); return; }

  let data;
  try {
    const res = await fetch('data/characters.json');
    if (!res.ok) throw new Error('fetch failed');
    data = await res.json();
  } catch (e) {
    fail();
    return;
  }

  const c = (data.characters || []).find(x => x.id === id);
  if (!c) { fail(); return; }

  document.title = c.name + ' — Lantern Lore';
  const preview = c.summary || c.tagline;
  // Per-character meta description for sharing/tab previews
  let md = document.querySelector('meta[name="description"]');
  if (md && preview) md.setAttribute('content', preview.slice(0, 155));
  let ogt = document.querySelector('meta[property="og:title"]');
  if (ogt) ogt.setAttribute('content', c.name + ' — Lantern Lore');
  let ogd = document.querySelector('meta[property="og:description"]');
  if (ogd && preview) ogd.setAttribute('content', preview.slice(0, 155));

  const esc = s => String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  root.innerHTML =
    '<article class="char-detail ' + esc(c.corpsClass) + '">' +
      '<figure class="char-artwork">' +
        (c.portraitWithheld ? '<div class="char-portrait portrait-placeholder" role="img" aria-label="Portrait unavailable for ' + esc(c.name) + '"><span aria-hidden="true">' + esc(c.name.split(/\s+/).map(s => s[0]).slice(0, 2).join('')) + '</span></div>' : '<img class="char-portrait" src="' + esc(c.portrait) + '" alt="' + esc(c.name) + '" />') +
        '<figcaption class="art-credit">' + esc(c.artCredit) + ' <a href="' + esc(c.artCreditHref) + '">Artwork source &amp; details</a>.</figcaption>' +
      '</figure>' +
      '<div class="char-body">' +
        '<p class="eyebrow">' + esc(c.corps) + '</p>' +
        '<h1>' + esc(c.name) + '</h1>' +
        '<p class="lede">' + esc(c.tagline) + '</p>' +
        (c.summary ? '<p>' + esc(c.summary) + '</p>' : '') +
        (c.continuity ? '<p class="source-note"><strong>Continuity:</strong> ' + esc(c.continuity) + '</p>' : '') +
        '<dl class="char-facts">' +
          '<div><dt>' + esc(c.affiliationLabel || 'Affiliation') + '</dt><dd><a href="' + esc(c.corpsPage) + '">' + esc(c.corps) + '</a></dd></div>' +
          '<div><dt>First appearance</dt><dd>' + esc(c.firstAppearance) + '</dd></div>' +
        '</dl>' +
        '<details class="lore-spoilers"><summary>Story history — ' + esc(c.historySpoilers || 'spoilers for the stories listed below') + '</summary>' +
          '<p>' + esc(c.bio) + '</p>' +
          (c.signature ? '<p class="char-signature"><strong>Signature:</strong> ' + esc(c.signature) + '</p>' : '') +
        '</details>' +
        (c.keyStories && c.keyStories.length ?
          '<div class="char-stories"><h2>Key Stories</h2><ul>' +
          c.keyStories.map(s =>
            '<li><a href="' + esc(s.url) + '"><strong>' + esc(s.title) + '</strong></a><br /><span class="story-issues">' + esc(s.issues) + '</span></li>'
          ).join('') +
          '</ul></div>'
        : '') +
        (c.appearsIn && c.appearsIn.length ?
          '<div class="char-stories"><h2>' + (c.keyStories && c.keyStories.length ? 'Reading order' : 'Key stories') + '</h2><ul>' +
          c.appearsIn.map(s =>
            '<li><a href="timeline.html#' + esc(s.id) + '">' + esc(s.title) + '</a></li>'
          ).join('') +
          '</ul><p class="art-credit">Find these in reading order on the <a href="timeline.html#reading-order">timeline</a>.</p></div>'
        : '') +
        (c.sourceLinks && c.sourceLinks.length ?
          '<section class="char-stories"><h2>Sources &amp; further reading</h2><ul>' +
          c.sourceLinks.map(s => '<li><a href="' + esc(s.url) + '">' + esc(s.title) + '</a></li>').join('') +
          '</ul></section>'
        : '') +
        (c.sourceNote ? '<p class="source-note"><strong>Reference scope:</strong> ' + esc(c.sourceNote) + '</p>' : '') +
        (c.reviewed ? '<p class="source-note">Profile reviewed ' + esc(c.reviewed) + '.</p>' : '') +
        '<p><a href="characters.html" style="color:var(--green);font-weight:800">← Back to the roster</a></p>' +
      '</div>' +
    '</article>';
})();
