import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import buildSimulator from '../build/madar/network-simulator.cjs';

const network = 'modules/network-tabs-preview/network-labs.html';
const model = 'modules/madar-hub/os-curriculum-model.js';
const read = file => fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8');

// The intermediate is built by the generation check. Here we vary its contents
// in memory and capture both final writes without running another generator.
function buildWith(overrides, writes) {
  buildSimulator({ site: '.', path, execFileSync() {}, read: file => overrides.get(file) ?? read(file),
    write: (file, content) => writes.set(file, content) });
}

const cases = [
  [network, 'window.openai', 'persistence host', 7],
  [network, 'encode(JSON.stringify(payload)).length>15800', 'encoded payload limit', 1],
  [network, 'root.getLabsState=()=>', 'backup flush hook', 1],
  [model, '/*OS_CURRICULUM_DATA*/[]', 'OS curriculum slot', 1],
];
for (const [file, marker, label, expected] of cases) {
  for (const delta of [-1, 1]) {
    test(`${label}: report a ${delta < 0 ? 'missing' : 'duplicate'} match before writing outputs`, () => {
      const original = read(file);
      const changed = delta < 0 ? original.replace(marker, '') : original + '\n' + marker;
      const writes = new Map();
      assert.throws(() => buildWith(new Map([[file, changed]]), writes), {
        message: `${file}: ${label} expected ${expected} occurrence(s) of "${marker}", found ${expected + delta}`,
      });
      assert.equal(writes.size, 0);
    });
  }
}

test('OS curriculum is inserted verbatim, including replacement-like characters', () => {
  const curriculum = JSON.stringify([{ title: "$& $$ $' $`" }]);
  const writes = new Map();
  buildWith(new Map([['lib/os-simulator-curriculum.json', curriculum]]), writes);
  assert.ok(writes.get('public/os-practice-model.js').includes('catalog=' + curriculum + ';'));
  assert.ok(writes.get('lib/network-simulator.html').includes('encode(JSON.stringify(payload)).length>700000'));
});
