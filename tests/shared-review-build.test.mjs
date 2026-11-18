import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import buildShared from '../build/madar/shared-assets.cjs';
import reviewBuilder from '../scripts/build-srwe.cjs';

const home = 'lib/madar-home.html';
const practice = 'modules/srwe-review/practice-base.js';
const read = file => fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const shell = '<html><head></head><body>synthetic hub</body></html>';

function buildSharedWith(overrides) {
  const writes = new Map();
  buildShared({ read: file => overrides.get(file) ?? read(file), write: (file, value) => writes.set(file, value) });
  return writes;
}

test('home copies preserve the ordered shared assets', () => {
  const writes = buildSharedWith(new Map([[home, shell]]));
  const result = writes.get(home);
  assert.equal(result, writes.get('public/index.html'));
  assert.deepEqual([...result.matchAll(/(?:src|href)="([^"]+)"/g)].map(match => match[1]),
    ['/madar100.css', '/madar100-orbit.css', '/madar100.js', '/madar100-orbit.js']);
});

for (const [file, marker] of [
  [home, '</head>'], [home, '</body>'],
  ['modules/network-background.html', 'function reflection(){'],
  [practice, 'function save(){let ok=true;'],
  [practice, ' try{const raw=localStorage.getItem(KEY);'],
  [practice, '\n function rowStatus'],
  ['modules/srwe-review/integration.js', 'm.note=e.target.value'],
]) {
  // For the save injection repeat its complete anchor so the duplicate is meaningful.
  const source = file === home ? shell : read(file);
  const anchor = marker.startsWith('function save') ? source.split('\n').find(line => line.includes(marker)).trim() : marker;
  for (const count of [0, 2]) {
    test(file + ' rejects ' + count + ' matches for ' + marker.trim(), () => {
      const input = source.replace(anchor, () => anchor.repeat(count));
      const overrides = new Map([[home, shell], [file, input]]);
      const build = file === practice || file.endsWith('integration.js')
        ? () => reviewBuilder.buildReviewScript(name => overrides.get(name) ?? read(name))
        : () => buildSharedWith(overrides);
      assert.throws(build, error => error.message.includes(file) && /expected/.test(error.message));
    });
  }
}

test('every current atlas tour links a named executable test and its command', () => {
  const map = JSON.parse(read('project-map.json'));
  const guide = JSON.parse(read('docs/code-atlas/guide.json'));
  for (const { id, integration } of map.features) {
    const steps = guide[id].steps.filter(step => step[4]);
    assert.ok(steps.length, id);
    for (const [, file, marker, scope, command] of steps) {
      assert.ok(integration.includes(file) && file.startsWith('tests/'), file);
      assert.ok(marker.startsWith("test('") && scope.length > 0, id);
      assert.equal(read(file).split(marker).length, 2, file + ' ' + marker);
      if (file.startsWith('tests/browser/')) {
        assert.match(command, /^npm run check:browser -- --(?:[a-z-]+|grep "[^"]+")$/);
        const [flag, ...filter] = command.split(' -- ')[1].split(' ');
        if (flag === '--grep') assert.ok(marker.includes(filter.join(' ').slice(1, -1)), marker);
        if (flag) assert.ok(read('scripts/check-browser.mjs').includes("'" + flag + "'"), flag);
      } else {
        assert.equal(command, 'node --test ' + file);
      }
    }
  }
});
