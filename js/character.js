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
        '<p class="first-app"><strong>First appearance:</strong> ' + esc(c.firstAppearance) + '</p>' +
        '<p><a href="characters.html" style="color:var(--green);font-weight:800">← Back to the roster</a></p>' +
      '</div>' +
    '</article>';
})();
