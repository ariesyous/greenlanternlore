const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const siteUrl = 'https://ariesyous.github.io/greenlanternlore/';
const sections = ['assets', 'characters', 'corps', 'css', 'data', 'entities', 'eras', 'events', 'explained', 'glossary', 'guardians', 'js', 'moments', 'powers', 'screen', 'stories', 'villains', 'worlds'];
const publicFiles = new Set(fs.readdirSync(root).filter(file => /\.(html|xml|txt)$/.test(file)));
for (const section of sections) {
  for (const file of fs.readdirSync(path.join(root, section), { recursive: true })) {
    if (fs.statSync(path.join(root, section, file)).isFile()) publicFiles.add(`${section}/${file.replaceAll('\\', '/')}`);
  }
}
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const characters = JSON.parse(read('data/characters.json')).characters;
const characterIds = new Set(characters.map(c => c.id));
const pages = [...publicFiles].filter(file => file.endsWith('.html'));

test('public pages, character references, search, and sitemap have valid local destinations', () => {
  const errors = [];
  const idsByPage = new Map();
  for (const file of pages) {
    const ids = [...read(file).matchAll(/\bid=["']([^"']+)["']/g)].map(m => m[1]);
    assert.equal(ids.length, new Set(ids).size, `${file}: duplicate HTML IDs`);
    idsByPage.set(file, new Set(ids));
  }
  function check(raw, from) {
    if (/^(?:data:|mailto:|tel:)/i.test(raw)) return;
    const url = new URL(raw.replaceAll('&amp;', '&'), siteUrl + from);
    if (!url.href.startsWith(siteUrl)) return;
    let file = decodeURIComponent(url.pathname.slice(new URL(siteUrl).pathname.length)) || 'index.html';
    if (file.endsWith('/')) file += 'index.html';
    if (!publicFiles.has(file)) errors.push(`${from}: missing file ${raw}`);
    else if (url.hash && idsByPage.has(file) && !idsByPage.get(file).has(decodeURIComponent(url.hash.slice(1)))) errors.push(`${from}: missing anchor ${raw}`);
    if (file === 'character.html' && url.searchParams.has('id') && !characterIds.has(url.searchParams.get('id'))) errors.push(`${from}: unknown character ${raw}`);
  }
  for (const file of pages) {
    // Inspect static markup, retaining script src but excluding JS template strings.
    const html = read(file).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, match => match.split('>')[0] + '>');
    for (const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/g)) check(match[1], file);
  }
  for (const c of characters) {
    for (const ref of [c.corpsPage, c.portrait, c.homeworld_page, ...(c.keyStories || []).map(s => s.url), ...(c.appearsIn || []).map(s => `timeline.html#${s.id}`), ...(c.sourceLinks || []).map(s => s.url)].filter(Boolean)) check(ref, 'character.html');
  }
  const searchEntries = JSON.parse(read('data/search-index.json'));
  const searchUrls = new Set(searchEntries.map(entry => entry.u));
  for (const entry of searchEntries) check(entry.u, 'index.html');
  for (const c of characters) assert.ok(searchUrls.has(`characters/${c.id}.html`), `${c.id}: missing from search`);
  const sitemap = [...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  for (const url of sitemap) check(url, 'index.html');
  for (const file of pages.filter(file => !['404.html', 'character.html'].includes(file))) {
    assert.ok(sitemap.includes(siteUrl + (file === 'index.html' ? '' : file)), `${file}: missing sitemap entry`);
    assert.ok(searchUrls.has(file), `${file}: missing from search`);
  }
  assert.deepEqual(errors, []);
});

test('every character can render with a closed story-history section and safe preview', async () => {
  const source = read('js/character.js');
  const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
  assert.equal(characterIds.size, characters.length, 'duplicate character IDs');
  for (const c of characters) {
    for (const field of ['id', 'name', 'corps', 'corpsClass', 'corpsPage', 'tagline', 'bio', 'portrait', 'firstAppearance']) assert.ok(c[field], `${c.id}: missing ${field}`);
    const element = { innerHTML: '' };
    const metadata = {};
    const document = {
      getElementById: () => element,
      querySelector: selector => ({ setAttribute: (key, value) => { metadata[selector] = value; } })
    };
    await vm.runInNewContext(source, {
      document, URLSearchParams, location: { search: `?id=${c.id}` },
      fetch: async () => ({ ok: true, json: async () => ({ characters }) })
    });
    assert.equal(document.title, `${c.name} — Lantern Lore`);
    assert.equal(metadata['meta[name="description"]'], (c.summary || c.tagline).slice(0, 155));
    const history = element.innerHTML.match(/<details class="lore-spoilers">([\s\S]*?)<\/details>/);
    assert.ok(history, `${c.id}: history must start closed`);
    assert.ok(history[1].includes(escape(c.bio)), `${c.id}: biography missing from history`);
    assert.ok(!element.innerHTML.replace(history[0], '').includes(escape(c.bio)), `${c.id}: biography leaks outside history`);
    if (c.sourceNote) assert.ok(element.innerHTML.replace(history[0], '').includes(escape(c.sourceNote)), `${c.id}: reference scope must be visible before opening story history`);
    assert.ok(!element.innerHTML.includes('undefined'), `${c.id}: missing rendered value`);
  }
});
