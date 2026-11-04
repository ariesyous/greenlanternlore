const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { spawnSync } = require('node:child_process');
const { test } = require('node:test');

const root = path.resolve(__dirname, '..');
const siteUrl = 'https://ariesyous.github.io/greenlanternlore/';
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const characters = JSON.parse(read('data/characters.json')).characters;
const profilePath = character => `characters/${character.id}.html`;
const escapeHtml = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const decodeHtml = value => value.replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&');

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/g)].map(([, key, , value]) => [key.toLowerCase(), decodeHtml(value)]));
}

function meta(html, key) {
  const tags = [...html.matchAll(/<meta\b[^>]*>/gi)].map(([tag]) => attributes(tag));
  const matching = tags.filter(tag => tag.name === key || tag.property === key);
  assert.equal(matching.length, 1, `expected exactly one ${key} meta tag`);
  return matching[0].content;
}

test('every character has readable static content, credits, and a closed spoiler disclosure', () => {
  assert.equal(new Set(characters.map(c => c.id)).size, characters.length, 'character IDs must be unique');
  const files = fs.readdirSync(path.join(root, 'characters')).filter(file => file.endsWith('.html'));
  assert.deepEqual(files.sort(), characters.map(c => `${c.id}.html`).sort(), 'static profiles must exactly cover the roster');

  for (const c of characters) {
    const html = read(profilePath(c));
    const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1];
    assert.ok(body, `${c.id}: missing body`);
    assert.ok(body.includes(`<h1>${escapeHtml(c.name)}</h1>`), `${c.id}: identity must be in initial HTML`);
    for (const field of ['tagline', 'summary', 'firstAppearance', 'artCredit', 'sourceNote', 'reviewed', 'continuity']) {
      if (c[field]) assert.ok(body.includes(escapeHtml(c[field])), `${c.id}: missing ${field}`);
    }

    const history = [...body.matchAll(/<details\b([^>]*)>([\s\S]*?)<\/details>/gi)]
      .find(match => match[2].includes(escapeHtml(c.bio)));
    assert.ok(history, `${c.id}: biography must be inside a disclosure`);
    assert.ok(!/\bopen(?:\s|=|$)/i.test(history[1]), `${c.id}: biography must start closed`);
    assert.match(history[2], /<summary\b[^>]*>[\s\S]*?spoiler[\s\S]*?<\/summary>/i, `${c.id}: disclosure needs a spoiler label`);
    assert.ok(!html.replace(history[0], '').includes(escapeHtml(c.bio)), `${c.id}: biography leaks outside disclosure`);
    for (const source of c.sourceLinks || []) {
      assert.ok(body.includes(escapeHtml(source.url)), `${c.id}: missing reference URL ${source.url}`);
      assert.ok(body.includes(escapeHtml(source.title)), `${c.id}: missing reference label`);
    }
    assert.ok(body.includes(escapeHtml(`../${c.artCreditHref}`)), `${c.id}: artwork source link missing`);
    assert.ok(!/<script\b[^>]*\bsrc=["'][^"']*\/character\.js["']/i.test(html), `${c.id}: static content must not depend on legacy renderer`);
    assert.ok(!/fetch\s*\([^)]*characters\.json/i.test(html), `${c.id}: static content must not fetch profile JSON`);
    assert.ok(!body.includes('Loading…'), `${c.id}: loading placeholder shipped`);
  }
});

test('static profiles have unique identity metadata and canonical sharing URLs', () => {
  const titles = new Set();
  const descriptions = new Set();
  for (const c of characters) {
    const html = read(profilePath(c));
    const title = decodeHtml(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '');
    assert.ok(title.includes(c.name), `${c.id}: title must identify the character`);
    assert.ok(!titles.has(title), `${c.id}: duplicate title`);
    titles.add(title);
    const description = meta(html, 'description');
    assert.ok(description && description.length > 30, `${c.id}: description needs a useful preview`);
    assert.ok(!descriptions.has(description), `${c.id}: duplicate description`);
    descriptions.add(description);
    assert.ok(!description.includes(c.bio), `${c.id}: biography must not become the search preview`);
    assert.equal(meta(html, 'og:title'), title, `${c.id}: inconsistent Open Graph title`);
    assert.equal(meta(html, 'twitter:title'), title, `${c.id}: inconsistent Twitter title`);
    assert.equal(meta(html, 'og:description'), description, `${c.id}: inconsistent Open Graph description`);
    assert.equal(meta(html, 'twitter:description'), description, `${c.id}: inconsistent Twitter description`);
    const canonicals = [...html.matchAll(/<link\b[^>]*>/gi)].map(([tag]) => attributes(tag)).filter(tag => tag.rel === 'canonical');
    assert.equal(canonicals.length, 1, `${c.id}: one canonical required`);
    assert.equal(canonicals[0].href, siteUrl + profilePath(c), `${c.id}: wrong canonical URL`);
    assert.equal(meta(html, 'og:url'), canonicals[0].href, `${c.id}: wrong sharing URL`);
    const image = meta(html, 'og:image');
    assert.equal(meta(html, 'twitter:image'), image, `${c.id}: inconsistent sharing image`);
    assert.ok(image.startsWith(siteUrl + 'assets/'), `${c.id}: sharing image must be an absolute asset URL`);
    assert.ok(fs.existsSync(path.join(root, image.slice(siteUrl.length))), `${c.id}: missing sharing image`);
  }
});

test('nested static profiles preserve working links and assets', () => {
  for (const c of characters) {
    const file = profilePath(c);
    const html = read(file);
    for (const [, raw] of html.matchAll(/(?:href|src)=["']([^"']+)["']/g)) {
      const ref = decodeHtml(raw);
      if (/^(?:data:|mailto:|tel:|https?:)/i.test(ref)) continue;
      assert.ok(ref.startsWith('../') || ref.startsWith('#'), `${file}: incorrect nested relative URL ${ref}`);
      const target = new URL(ref, siteUrl + file);
      assert.ok(target.href.startsWith(siteUrl), `${file}: URL escapes project path ${ref}`);
      let localFile = decodeURIComponent(target.pathname.slice(new URL(siteUrl).pathname.length)) || 'index.html';
      if (localFile.endsWith('/')) localFile += 'index.html';
      assert.ok(fs.existsSync(path.join(root, localFile)), `${file}: missing local destination ${ref}`);
      assert.ok(!localFile.endsWith('character.html'), `${file}: link still uses the legacy profile route`);
    }
    if (!c.portraitWithheld) assert.ok(html.includes(escapeHtml(`../${c.portrait}`)), `${c.id}: portrait missing`);
  }
});

test('withheld portraits stay absent while the profile and credit remain available', () => {
  const { renderCharacter } = require('../js/character.js');
  const fixture = { ...characters[0], portraitWithheld: true, portrait: 'assets/characters/withheld-test.jpg' };
  const html = renderCharacter(fixture);
  assert.ok(html.includes(escapeHtml(fixture.name)), 'withholding artwork must preserve the identity');
  assert.ok(html.includes(escapeHtml(fixture.artCredit)), 'withholding artwork must preserve its credit note');
  assert.match(html, /Portrait unavailable/i, 'withheld portrait needs an accessible placeholder');
  assert.ok(!html.includes(fixture.portrait), 'withheld artwork must not be requested');
});

test('sitemap and search each discover every static profile without legacy duplicates', () => {
  const sitemapUrls = [...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, value]) => decodeHtml(value));
  const entries = JSON.parse(read('data/search-index.json'));
  for (const c of characters) {
    const route = profilePath(c);
    assert.equal(sitemapUrls.filter(url => url === siteUrl + route).length, 1, `${c.id}: sitemap coverage`);
    const matching = entries.filter(entry => entry.u === route);
    assert.equal(matching.length, 1, `${c.id}: search coverage`);
    assert.ok(matching[0].t.includes(c.name), `${c.id}: search result identity`);
  }
  assert.ok(!entries.some(entry => /^character\.html(?:\?|$)/.test(entry.u)), 'search must favor canonical static profiles');
  assert.ok(!sitemapUrls.some(url => /\/character\.html(?:\?|$)/.test(url)), 'sitemap must exclude legacy profile endpoints');
});

async function legacyPage(search, fetchImpl) {
  const element = { innerHTML: '' };
  const redirects = [];
  const document = { getElementById: () => element, querySelector: () => ({ setAttribute() {} }) };
  const location = { search, href: siteUrl + 'character.html' + search, replace: value => redirects.push(value) };
  const completion = vm.runInNewContext(read('js/character.js'), {
    document, location, URL, URLSearchParams,
    fetch: fetchImpl || (async () => ({ ok: true, json: async () => ({ characters }) }))
  });
  await completion;
  await new Promise(resolve => setImmediate(resolve));
  return { document, element, redirects };
}

test('legacy profile URLs redirect only to a validated character', async () => {
  for (const c of characters) {
    const result = await legacyPage(`?id=${encodeURIComponent(c.id)}`);
    assert.equal(result.redirects.length, 1, `${c.id}: missing canonical redirect`);
    assert.equal(new URL(result.redirects[0], siteUrl + 'character.html').href, siteUrl + profilePath(c), `${c.id}: wrong redirect`);
  }
  for (const search of ['', '?id=', '?id=unknown-lantern', '?id=..%2Findex', '?id=https%3A%2F%2Fexample.com', '?id=%3Cscript%3E']) {
    const result = await legacyPage(search);
    assert.deepEqual(result.redirects, [], `${search}: malformed or unknown ID must not redirect`);
    assert.match(result.element.innerHTML, /unknown|not found|no character/i, `${search}: friendly missing-profile state required`);
    assert.ok(result.element.innerHTML.includes('characters.html'), `${search}: recovery link required`);
  }
  const failure = await legacyPage('?id=hal-jordan', async () => { throw new Error('network unavailable'); });
  assert.deepEqual(failure.redirects, [], 'failed validation must not redirect');
  assert.match(failure.element.innerHTML, /could not be loaded|unavailable|unknown|not found|no character/i, 'failed validation needs a readable fallback');
});

test('generated character pages and discovery files are up to date', () => {
  const files = [...characters.map(profilePath), 'sitemap.xml', 'data/search-index.json'];
  const before = files.map(file => ({ file, contents: read(file), modified: fs.statSync(path.join(root, file)).mtimeMs }));
  const result = spawnSync(process.execPath, ['scripts/build-character-pages.cjs', '--check'], { cwd: root, encoding: 'utf8', timeout: 15000 });
  assert.equal(result.error, undefined, result.error?.message);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  for (const snapshot of before) {
    assert.equal(read(snapshot.file), snapshot.contents, `${snapshot.file}: --check must not change content`);
    assert.equal(fs.statSync(path.join(root, snapshot.file)).mtimeMs, snapshot.modified, `${snapshot.file}: --check must not rewrite files`);
  }
});
