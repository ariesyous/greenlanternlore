const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

const html = fs.readFileSync(path.join(__dirname, '../timeline.html'), 'utf8');
const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).find(s => s.includes('data-reading-entry'));

function loadGuide(storage = {}) {
  const boxes = [];
  const controls = new Map();
  const entries = [...html.matchAll(/<article\b([^>]*\bdata-reading-entry[^>]*)>([\s\S]*?)<\/article>/g)].map(([, attributes, content]) => ({
    id: attributes.match(/\bid="([^"]+)"/)[1],
    dataset: { readingGroup: attributes.match(/data-reading-group="([^"]+)"/)[1], required: attributes.match(/data-required="([^"]+)"/)[1] },
    querySelector: selector => selector === 'h3' ? { textContent: content.match(/<h3>([\s\S]*?)<\/h3>/)[1].replace(/<[^>]+>/g, '') } : { appendChild() {} },
    classList: { toggle() {} }
  }));
  const document = {
    querySelectorAll: () => entries,
    getElementById: id => {
      if (!id) return null;
      if (!controls.has(id)) controls.set(id, {});
      return controls.get(id);
    },
    createElement: tag => {
      const element = { appendChild() {}, setAttribute() {}, addEventListener(name, fn) { this[name] = fn; } };
      if (tag === 'input') boxes.push(element);
      return element;
    },
    createTextNode: text => ({ textContent: text })
  };
  const saved = { value: storage.value || '{}' };
  vm.runInNewContext(script, {
    document,
    localStorage: {
      getItem() { if (storage.blocked) throw new Error('blocked'); return saved.value; },
      setItem(key, value) { if (storage.blocked) throw new Error('blocked'); saved.value = value; }
    },
    window: { location: { hash: '' }, addEventListener() {} }
  });
  return { entries, boxes, controls, saved };
}

test('reading checklist counts core, optional, and later routes separately and restores saved marks', () => {
  const guide = loadGuide({ value: JSON.stringify({ 'read-rebirth': true, 'read-recharge': true, 'read-morrison-gl': true, 'read-johns-era': true }) });
  assert.equal(guide.entries.length, 19);
  assert.ok(!guide.entries.some(e => ['read-johns-era', 'read-new52', 'read-current', 'emerald-twilight'].includes(e.id)), 'overviews and fictional history are not reading stops');
  assert.equal(guide.boxes.filter(box => box.checked).length, 3);
  assert.equal(guide.controls.get('reading-progress').max, 11);
  assert.equal(guide.controls.get('reading-progress').value, 1);
  assert.match(guide.controls.get('reading-progress-text').textContent, /Optional branches: 1 of 2\. Later paths: 1 of 6/);
  const rebirth = guide.boxes.find(box => box.id === 'check-read-rebirth');
  rebirth.checked = false;
  rebirth.change();
  assert.equal(guide.controls.get('reading-progress').value, 0);
  assert.equal(JSON.parse(guide.saved.value)['read-rebirth'], false);
});

for (const storage of [{ blocked: true }, { value: '{broken' }]) {
  test(`reading checklist remains usable with ${storage.blocked ? 'blocked' : 'corrupt'} storage`, () => {
    const guide = loadGuide(storage);
    guide.boxes[0].checked = true;
    guide.boxes[0].change();
    assert.equal(guide.controls.get('reading-progress').value, 1);
    if (storage.blocked) assert.match(guide.controls.get('reading-storage-note').textContent, /unavailable/);
  });
}
