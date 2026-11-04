// Regenerate the static credit catalogue and per-page/profile credits after editing the manifest.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const write = (file, value) => fs.writeFileSync(path.join(root, file), value);
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const anchor = asset => 'art-' + asset.replace(/^assets\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/-$/, '');
const title = asset => path.basename(asset, path.extname(asset)).replace(/^(cover|story|moment|era|corps|interact)-/, '').replaceAll('-', ' ').replace(/\b[a-z]/g, s => s.toUpperCase());
const manifest = JSON.parse(read('data/art-credits.json'));
const byAsset = new Map(manifest.assets.map(record => [record.asset, record]));
const labels = {verified_credit: 'Credited', source_matched: 'Source matched · artist roles pending', unresolved: 'Attribution unresolved'};
const recordLabel = record => record.display === 'withheld' ? 'Image withheld · subject mismatch' : labels[record.status];
const credit = record => record.credits.length ? record.credits.map(c => `${c.name} (${c.role})`).join('; ') : 'Artist credit unconfirmed';
const caption = record => `${record.display === 'withheld' ? 'Image withheld: ' + record.displayReason + ' ' : ''}${record.work ? record.work + '. ' : ''}${credit(record)}.`;
const sections = ['corps','entities','eras','events','explained','glossary','guardians','moments','powers','screen','stories','villains','worlds'];
const pages = fs.readdirSync(root).filter(f => f.endsWith('.html'));
for (const section of sections) for (const file of fs.readdirSync(path.join(root, section))) if (file.endsWith('.html')) pages.push(section + '/' + file);
const usedBy = new Map(manifest.assets.map(a => [a.asset, new Set()]));
for (const file of pages.filter(f => f !== 'sources.html')) {
  let html = read(file).replace(/\s*<!-- ART CREDITS START -->[\s\S]*?<!-- ART CREDITS END -->\s*/g, '\n');
  const refs = new Set();
  for (const match of html.matchAll(/(?:<img\b[^>]*?\bsrc|data-art-asset)="([^"]+)"/g)) {
    const asset = path.posix.normalize(path.posix.join(path.posix.dirname(file), match[1]));
    if (byAsset.has(asset)) { refs.add(asset); usedBy.get(asset).add(file); }
  }
  for (const match of html.matchAll(/<meta\b[^>]*content="https:\/\/ariesyous\.github\.io\/greenlanternlore\/(assets\/[^"?#]+)"/g)) {
    if (!byAsset.has(match[1])) continue;
    usedBy.get(match[1]).add(file);
    // The standard social card is credited in the site catalogue; page-specific sharing art belongs here too.
    if (match[1] !== 'assets/og-preview.jpg') refs.add(match[1]);
  }
  if (refs.size) {
    const prefix = file.includes('/') ? '../' : '';
    const list = [...refs].map(asset => {
      const record = byAsset.get(asset);
      return `          <li><a href="${prefix}sources.html#${anchor(asset)}">${escape(title(asset))}</a> — ${escape(caption(record))}</li>`;
    }).join('\n');
    html = html.replace(/\s*<\/main>/, `\n  <!-- ART CREDITS START -->\n    <details class="art-page-credits" id="page-art-credits">\n      <summary>Artwork credits (${refs.size} ${refs.size === 1 ? 'image' : 'images'})</summary>\n      <p>Credits refer to the illustrations shown here. Open a record for sources, adaptations and unresolved details. Some artwork and source pages contain story spoilers.</p>\n      <ul>\n${list}\n      </ul>\n    </details>\n    <!-- ART CREDITS END -->\n  </main>`);
  }
  write(file, html);
}
const roster = JSON.parse(read('data/characters.json'));
for (const character of roster.characters) {
  const record = byAsset.get(character.portrait);
  if (!record) throw new Error('Missing portrait record: ' + character.id);
  character.artCredit = caption(record);
  character.artCreditHref = 'sources.html#' + anchor(record.asset);
  character.portraitWithheld = record.display === 'withheld';
  usedBy.get(record.asset).add('character.html?id=' + character.id);
}
write('data/characters.json', JSON.stringify(roster, null, 2) + '\n');
// The catalogue itself also uses the standard social card.
for (const file of pages) if (read(file).includes('/assets/og-preview.jpg')) usedBy.get('assets/og-preview.jpg').add(file);
for (const record of manifest.assets) record.usedBy = [...usedBy.get(record.asset)].sort();
manifest.counts = {total: manifest.assets.length, verified_credit: 0, source_matched: 0, unresolved: 0};
for (const record of manifest.assets) manifest.counts[record.status]++;
write('data/art-credits.json', JSON.stringify(manifest, null, 2) + '\n');
const counts = manifest.counts;
const groups = [...new Set(manifest.assets.map(a => a.category))];
const groupNames = {'homepage-corps':'Corps illustrations', site:'Site graphics', covers:'Story and event artwork', characters:'Character portraits', screen:'Screen adaptations'};
const domainLabel = url => {
  const host = new URL(url).hostname.replace(/^www\./, '');
  return host === 'dc.com' || host === 'dcuniverseinfinite.com' ? 'DC publisher reference' : host === 'dcuguide.com' ? 'DCU Guide issue index' : host === 'comics.org' ? 'Grand Comics Database record' : host === 'philchoart.com' ? 'Phil Cho’s original post' : host;
};
const catalogue = groups.map(group => {
  const entries = manifest.assets.filter(a => a.category === group).map(a => `          <details class="art-record" id="${anchor(a.asset)}">\n            <summary>${escape(title(a.asset))} <span class="art-status">${recordLabel(a)}</span></summary>\n            <p><strong>${escape(a.work || 'Original artwork not yet identified')}</strong></p>\n            <p>${escape(credit(a))}.</p>\n            ${a.display === 'withheld' ? `<p><strong>Withheld from character pages:</strong> ${escape(a.displayReason)}</p>` : ''}\n            ${a.captionContext ? `<p>${escape(a.captionContext)}</p>` : ''}\n            <p>${escape(a.evidence || 'No source evidence has been established.')}</p>\n            ${a.sources.length ? `<ul>${a.sources.map((url,i) => `<li><a href="${escape(url)}">${escape(domainLabel(url))}${a.sources.filter(s => domainLabel(s) === domainLabel(url)).length > 1 ? ' — reference ' + (i+1) : ''}</a></li>`).join('')}</ul>` : '<p>No corroborating source located yet.</p>'}\n            ${a.remainingGaps.length ? `<p><strong>Still to establish:</strong></p><ul>${a.remainingGaps.map(g => `<li>${escape(g)}</li>`).join('')}</ul>` : ''}\n            <p class="source-note"><a href="${a.asset}">View the archived image (may contain spoilers)</a> · Reviewed ${escape(a.reviewed)}.${a.usedBy.length ? ` Referenced on ${a.usedBy.length} ${a.usedBy.length === 1 ? 'page' : 'pages'}.` : ' Retained for the audit record.'}</p>\n          </details>`).join('\n');
  return `        <section class="art-category" id="art-group-${group}"><h3>${escape(groupNames[group] || group[0].toUpperCase()+group.slice(1))}</h3>\n${entries}\n        </section>`;
}).join('\n');
const block = `      <article class="panel" id="art-credits" style="border-left-color:var(--blue)">\n        <h2>Artwork credits &amp; provenance</h2>\n        <p>Every local illustration has a record below. <strong>${counts.verified_credit} of ${counts.total} files have supported named artist credits</strong>; <strong>${counts.source_matched} ${counts.source_matched === 1 ? "has" : "have"} an identified source with artist roles still pending</strong>; <strong>${counts.unresolved} remain unresolved</strong>. Reviewed November 4, 2026. Counts are image files, including repeated crops and resolutions, rather than distinct works.</p>\n        <p>“Credited” means the pictured artwork and the named role are supported by a publisher, an original creator post, a printed artwork credit, or an identified issue catalogue. It does not mean every inker, colorist, edition or download source is known. Each record states its evidence and gaps. Character creators and story writers are not automatically the artists of the image beside them.</p>\n        <p>Fan art, comic covers, interior panels and adaptation images are kept distinct. Wallpaper sites and unsigned reposts are research leads, not artist credits. Identified wrong-character portraits are withheld until a suitable replacement is found.</p>\n        <p>Browse by category. Records and their linked images can contain story spoilers.</p>\n        <nav class="art-category-links" aria-label="Artwork categories">${groups.map(g => `<a href="#art-group-${g}">${escape(groupNames[g] || g[0].toUpperCase()+g.slice(1))}</a>`).join(' · ')}</nav>\n${catalogue}\n        <p class="source-note">The <a href="data/art-credits.json">complete provenance manifest</a> also records file hashes and usage. Attribution does not grant a license or imply publisher endorsement. For a correction or removal request, <a href="https://github.com/ariesyous/greenlanternlore/issues">open an issue</a> naming the image and its original source, if known.</p>\n      </article>`;
let sources = read('sources.html').replace(/      <article class="panel" id="art-credits"[\s\S]*?<\/article>/, block);
if (!sources.includes('src="js/art-credits.js"')) sources = sources.replace('<script src="js/search.js" defer></script>', '<script src="js/search.js" defer></script>\n  <script src="js/art-credits.js" defer></script>');
write('sources.html', sources.replace(/[ \t]+(?=\r?$)/gm, ''));
console.log(`Updated ${pages.length} pages and ${roster.characters.length} profiles. Artwork: ${JSON.stringify(counts)}`);
