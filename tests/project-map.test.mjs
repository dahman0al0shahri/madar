import assert from 'node:assert/strict';
import test from 'node:test';
import { validateProjectMap } from '../scripts/check-structure.mjs';

function fixture() {
  return {schemaVersion: 1, areas: {app: 'Routes', scripts: 'Commands', public: 'Assets'},
    features: [{id: 'home', title: 'Home', entry: 'app/route.ts', sources: ['app/route.ts'], integration: ['scripts/build.cjs']}],
    generation: {entry: 'scripts/build.cjs', generators: ['scripts/build.cjs'],
      groups: [{stage: 'scripts/build.cjs', sources: ['app/route.ts'], outputs: ['public/home.html']}]}};
}
const files = ['app/route.ts', 'scripts/build.cjs', 'public/home.html'];
test('accepts a complete navigation map', () => assert.deepEqual(validateProjectMap(fixture(), files), {features: 1, outputs: 1, areas: 3}));
test('rejects a renamed entry point that leaves documentation stale', () => {
  assert.throws(() => validateProjectMap(fixture(), ['app/new-route.ts', ...files.slice(1)]), /missing map reference/);
});
test('rejects an undocumented new top-level area', () => {
  assert.throws(() => validateProjectMap(fixture(), [...files, 'new-area/file.js']), /Document this top-level area/);
});
test('rejects duplicate output ownership', () => {
  const map = fixture(); map.generation.groups.push(structuredClone(map.generation.groups[0]));
  assert.throws(() => validateProjectMap(map, files), /Duplicate generated output/);
});
test('rejects references outside the repository', () => {
  for (const bad of ['../private.json', '/tmp/private.json', 'C:/private.json', 'app\\route.ts']) {
    const map = fixture(); map.features[0].entry = bad;
    assert.throws(() => validateProjectMap(map, files), /Invalid project-relative path/);
  }
});
