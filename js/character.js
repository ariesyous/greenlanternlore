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

  const esc = s => String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  root.innerHTML =
    '<article class="char-detail ' + esc(c.corpsClass) + '">' +
      '<img class="char-portrait" src="' + esc(c.portrait) + '" alt="' + esc(c.name) + '" />' +
      '<div class="char-body">' +
        '<p class="eyebrow">' + esc(c.corps) + '</p>' +
        '<h1>' + esc(c.name) + '</h1>' +
        '<p class="lede">' + esc(c.tagline) + '</p>' +
        '<p>' + esc(c.bio) + '</p>' +
        '<dl class="char-facts">' +
          '<div><dt>Corps</dt><dd><a href="' + esc(c.corpsPage) + '">' + esc(c.corps) + '</a></dd></div>' +
          '<div><dt>First appearance</dt><dd>' + esc(c.firstAppearance) + '</dd></div>' +
        '</dl>' +
        (c.appearsIn && c.appearsIn.length ?
          '<div class="char-stories"><h2>Key stories</h2><ul>' +
          c.appearsIn.map(s =>
            '<li><a href="timeline.html#' + esc(s.id) + '">' + esc(s.title) + '</a></li>'
          ).join('') +
          '</ul><p class="art-credit">Find these in reading order on the <a href="timeline.html#reading-order">timeline</a>.</p></div>'
        : '') +
        '<p><a href="characters.html" style="color:var(--green);font-weight:800">← Back to the roster</a></p>' +
      '</div>' +
    '</article>';
})();
