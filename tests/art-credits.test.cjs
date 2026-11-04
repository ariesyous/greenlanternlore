const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const manifest = JSON.parse(read('data/art-credits.json'));
const characters = JSON.parse(read('data/characters.json')).characters;
const sourcesHtml = read('sources.html');
const catalogueIds = [...sourcesHtml.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]);
const statuses = ['verified_credit', 'source_matched', 'unresolved'];
const anchorFor = asset => 'art-' + asset.replace(/^assets\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/-$/, '');
const escapeHtml = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

function nonempty(value, message) {
  assert.equal(typeof value, 'string', message);
  assert.ok(value.trim(), message);
}

function httpUrl(value, message) {
  nonempty(value, message);
  const url = new URL(value);
  assert.ok(['http:', 'https:'].includes(url.protocol), message);
  assert.ok(url.hostname, message);
}

function imageSources(html) {
  return [...html.matchAll(/<img\b[^>]*>/gi)].flatMap(([tag]) => {
    const match = tag.match(/\ssrc=["']([^"']+)["']/i);
    return match ? [match[1].replaceAll('&amp;', '&')] : [];
  });
}

test('all 179 local artwork files have unique inventory records and matching hashes', () => {
  const actualFiles = fs.readdirSync(path.join(root, 'assets'), { recursive: true })
    .filter(file => /\.(?:avif|bmp|gif|ico|jpe?g|png|svg|webp)$/i.test(file))
    .filter(file => fs.statSync(path.join(root, 'assets', file)).isFile())
    .map(file => 'assets/' + file.replaceAll('\\', '/')).sort();
  assert.equal(actualFiles.length, 179, 'the reviewed artwork inventory must cover 179 files');
  assert.ok(Array.isArray(manifest.assets), 'assets must be an array');
  const inventoryPaths = manifest.assets.map(record => record.asset);
  assert.equal(new Set(inventoryPaths).size, inventoryPaths.length, 'duplicate asset records');
  assert.deepEqual([...inventoryPaths].sort(), actualFiles, 'inventory must match the actual assets, without missing or stale records');
  for (const record of manifest.assets) {
    assert.match(record.asset, /^assets\//, record.asset);
    assert.ok(!record.asset.includes('\\') && !record.asset.split('/').includes('..'), `${record.asset}: use a safe, normalized path`);
    const hash = crypto.createHash('sha256').update(fs.readFileSync(path.join(root, record.asset))).digest('hex');
    assert.equal(record.sha256, hash, `${record.asset}: artwork changed without updating the reviewed hash`);
  }
});

test('attribution status counts and supporting evidence agree with the records', () => {
  const counts = { total: manifest.assets.length, verified_credit: 0, source_matched: 0, unresolved: 0 };
  for (const record of manifest.assets) {
    const label = record.asset;
    assert.ok(statuses.includes(record.status), `${label}: unknown status ${record.status}`);
    counts[record.status]++;
    assert.ok(Array.isArray(record.remainingGaps), `${label}: remainingGaps must be an array, including when empty`);
    for (const gap of record.remainingGaps) nonempty(gap, `${label}: empty gap`);
    assert.ok(Array.isArray(record.credits), `${label}: credits must be an array`);
    for (const credit of record.credits) {
      nonempty(credit.name, `${label}: contributor must have a name`);
      nonempty(credit.role, `${label}: contributor must have a specific role`);
    }
    assert.ok(Array.isArray(record.sources), `${label}: sources must be an array`);
    for (const source of record.sources) httpUrl(source, `${label}: source must be an absolute HTTP(S) URL`);
    if (record.imageSource !== null && record.imageSource !== undefined) {
      httpUrl(record.imageSource, `${label}: imageSource must be an absolute HTTP(S) URL`);
    }
    if (record.status !== 'unresolved') {
      nonempty(record.work, `${label}: identified artwork needs a work`);
      nonempty(record.evidence, `${label}: identified artwork needs evidence`);
      assert.ok(record.sources.length, `${label}: identified artwork needs source links`);
    }
    if (record.status === 'verified_credit') {
      assert.ok(record.credits.length, `${label}: verified credit needs a named contributor and role`);
    }
  }
  assert.deepEqual(manifest.counts, counts, 'published totals must be computed from actual record statuses');
});

test('every asset has exactly one source-catalogue anchor', () => {
  const expected = manifest.assets.map(record => anchorFor(record.asset));
  assert.equal(new Set(expected).size, expected.length, 'asset paths produce colliding catalogue anchors');
  for (const anchor of expected) {
    assert.equal(catalogueIds.filter(id => id === anchor).length, 1, `${anchor}: expected exactly one catalogue entry`);
  }
});

test('every profile supplies readable artwork credit and the matching catalogue link', () => {
  const inventory = new Set(manifest.assets.map(record => record.asset));
  for (const character of characters) {
    assert.ok(inventory.has(character.portrait), `${character.id}: portrait must be inventoried even when withheld`);
    nonempty(character.artCredit, `${character.id}: missing artwork credit text`);
    nonempty(character.artCreditHref, `${character.id}: missing artwork credit link`);
    const link = new URL(character.artCreditHref, 'https://example.test/greenlanternlore/character.html');
    assert.equal(link.origin, 'https://example.test', `${character.id}: credit should link to this site's catalogue`);
    assert.equal(link.pathname, '/greenlanternlore/sources.html', `${character.id}: credit must link to sources.html`);
    assert.equal(link.hash, '#' + anchorFor(character.portrait), `${character.id}: credit links to the wrong asset`);
    assert.ok(catalogueIds.includes(link.hash.slice(1)), `${character.id}: missing catalogue destination`);
    if (character.portraitWithheld !== undefined) assert.equal(typeof character.portraitWithheld, 'boolean', `${character.id}: portraitWithheld must be a boolean`);
  }
  const ganthet = characters.find(character => character.id === 'ganthet');
  assert.equal(ganthet?.portraitWithheld, false, 'the verified Ganthet replacement should be available');
  const ganthetArt = manifest.assets.find(record => record.asset === ganthet.portrait);
  assert.match(ganthetArt.work, /^Ganthet /);
  assert.equal(ganthetArt.status, 'verified_credit');
  assert.notEqual(ganthetArt.sha256, ganthetArt.previousArtwork.sha256, 'the mislabeled Highfather file must not return');
  assert.ok(imageSources(read('characters.html')).includes(ganthet.portrait), 'Ganthet must be restored on the roster');
  assert.equal(characters.find(character => character.id === 'ash')?.portraitWithheld, true, 'the confirmed Parallax image must not appear as Ash');
});

test('profile rendering shows attribution and omits withheld artwork from profile and roster images', async () => {
  const source = read('js/character.js');
  const rosterImages = imageSources(read('characters.html'));
  for (const character of characters) {
    const element = { innerHTML: '' };
    await vm.runInNewContext(source, {
      document: { getElementById: () => element, querySelector: () => ({ setAttribute() {} }) },
      URLSearchParams,
      location: { search: `?id=${character.id}` },
      fetch: async () => ({ ok: true, json: async () => ({ characters }) })
    });
    assert.ok(character.artCredit && element.innerHTML.includes(escapeHtml(character.artCredit)), `${character.id}: artwork credit not rendered`);
    assert.ok(character.artCreditHref && element.innerHTML.includes(`href="${escapeHtml(character.artCreditHref)}"`), `${character.id}: catalogue link not rendered`);
    const renderedImages = imageSources(element.innerHTML);
    if (character.portraitWithheld) {
      assert.ok(!renderedImages.includes(character.portrait), `${character.id}: withheld portrait rendered on the profile`);
      assert.ok(!rosterImages.includes(character.portrait), `${character.id}: withheld portrait rendered on the roster`);
    } else {
      assert.ok(renderedImages.includes(character.portrait), `${character.id}: available profile portrait missing`);
    }
  }
});
