const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

const source = fs.readFileSync(path.join(__dirname, '../js/search.js'), 'utf8');
const entries = [
  { k: 'green lantern', t: 'Green Lantern', s: 'Willpower', u: 'corps/green.html' },
  { k: 'green lantern hal jordan', t: 'Hal Jordan', s: 'Sector 2814', u: 'character.html?id=hal-jordan' }
];

async function loadSearch(pageUrl, scriptUrl) {
  const inputListeners = {};
  const formListeners = {};
  const input = {
    value: 'green',
    addEventListener: (name, handler) => { inputListeners[name] = handler; },
    blur() {}
  };
  let hits = [];
  let markup = '';
  const box = {
    hidden: true,
    set innerHTML(value) {
      markup = value;
      hits = [...value.matchAll(/class="search-hit" href="([^"]+)"/g)].map((match) => ({
        getAttribute: () => match[1],
        classList: { add() {}, remove() {} },
        setAttribute() {}, removeAttribute() {}, scrollIntoView() {}
      }));
    },
    get innerHTML() { return markup; },
    querySelectorAll: () => hits,
    querySelector: () => hits[0] || null
  };
  const form = {
    querySelector: (selector) => selector === 'input' ? input : box,
    addEventListener: (name, handler) => { formListeners[name] = handler; },
    contains: () => true
  };
  const location = { href: pageUrl, pathname: new URL(pageUrl).pathname };
  let requestedUrl;
  vm.runInNewContext(source, {
    URL,
    window: { location },
    document: {
      currentScript: { src: scriptUrl },
      querySelector: () => form,
      addEventListener() {}
    },
    fetch: async (url) => {
      requestedUrl = url;
      return { json: async () => entries };
    },
    setTimeout,
    clearTimeout
  });
  await new Promise(setImmediate);
  inputListeners.focus();
  return { requestedUrl, box, inputListeners, formListeners, location };
}

for (const root of ['https://ariesyous.github.io/greenlanternlore/', 'https://lantern.example/']) {
  for (const page of ['index.html', 'corps/green.html', 'worlds/oa.html', 'stories/rebirth.html', 'entities/ion.html', 'glossary/power-ring.html']) {
    test(`search resolves the index and result links from ${root}${page}`, async () => {
      const search = await loadSearch(root + page, root + 'js/search.js');
      assert.equal(search.requestedUrl, root + 'data/search-index.json');
      assert.equal(search.box.hidden, false);
      assert.ok(search.box.innerHTML.includes(`href="${root}corps/green.html"`));
      assert.ok(search.box.innerHTML.includes(`href="${root}character.html?id=hal-jordan"`));
    });
  }
}

test('Enter follows the keyboard-selected result without submitting to the first result', async () => {
  const root = 'https://ariesyous.github.io/greenlanternlore/';
  const search = await loadSearch(root + 'worlds/oa.html', root + 'js/search.js');
  search.inputListeners.keydown({ key: 'ArrowDown', preventDefault() {} });
  search.inputListeners.keydown({ key: 'ArrowDown', preventDefault() {} });
  let defaultPrevented = false;
  search.inputListeners.keydown({ key: 'Enter', preventDefault() { defaultPrevented = true; } });
  assert.equal(defaultPrevented, true);
  assert.equal(search.location.href, root + 'character.html?id=hal-jordan');
});

test('submitting without a keyboard selection follows the first result', async () => {
  const root = 'https://ariesyous.github.io/greenlanternlore/';
  const search = await loadSearch(root + 'index.html', root + 'js/search.js');
  let defaultPrevented = false;
  search.formListeners.submit({ preventDefault() { defaultPrevented = true; } });
  assert.equal(defaultPrevented, true);
  assert.equal(search.location.href, root + 'corps/green.html');
});
