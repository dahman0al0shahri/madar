import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { refreshedGuide, synchronize } from '../scripts/maintenance-guidance.mjs';

const start = '<!-- BEGIN generated maintenance reference -->';
const end = '<!-- END generated maintenance reference -->';
const original = ['قرار المالك', start, 'old', end, 'manual  ', ''].join('\r\n');
const map = { features: [{ id: 'home', entry: 'app/route.ts' }], sourceAssemblies: [], generation: {groups: []} };

test('refresh preserves manual bytes, is repeatable, and rejects ambiguous sections', () => {
  const result = refreshedGuide(original, {check: 'node check'}, map);
  assert(result.startsWith('قرار المالك\r\n' + start + '\r\n'));
  assert(result.endsWith(end + '\r\nmanual  \r\n'));
  assert.equal(refreshedGuide(result, {check: 'node check'}, map), result);
  for (const invalid of [original.replace(start, ''), original + end, [end, start].join('\n')])
    assert.throws(() => refreshedGuide(invalid, {}, map), /marker/i);
});

test('commits use staged commands and preserve partial edits', t => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'madar-guidance-'));
  t.after(() => fs.rmSync(cwd, { recursive: true, force: true }));
  const git = (...args) => execFileSync('git', args, {cwd, encoding:'utf8'});
  const write = (name, data) => fs.writeFileSync(path.join(cwd, name), data);
  const scripts = names => write('package.json', JSON.stringify({scripts:Object.fromEntries(names.map(name => [name, 'example']))}));
  git('init', '--quiet');
  git('config', '--local', 'core.autocrlf', 'false');
  write('project-map.json', JSON.stringify(map));
  write('AGENTS.md', original);
  scripts(['check:one']);
  git('add', '--', 'package.json', 'project-map.json', 'AGENTS.md');
  assert.throws(() => synchronize('--check', cwd), /stale/);
  scripts(['check:two']);
  assert.equal(synchronize('--staged', cwd), true);
  assert.match(git('show', ':AGENTS.md'), /check:one/);
  assert.doesNotMatch(git('show', ':AGENTS.md'), /check:two/);
  assert.equal(synchronize('--staged', cwd), false);
  const staged = git('show', ':AGENTS.md');
  git('add', '--', 'package.json');
  write('AGENTS.md', 'my partial edit\r\n' + staged);
  assert.throws(() => synchronize('--staged', cwd), /unstaged edits/);
  assert.equal(git('show', ':AGENTS.md'), staged);
  assert.equal(fs.readFileSync(path.join(cwd, 'AGENTS.md'), 'utf8'), 'my partial edit\r\n' + staged);
  assert.equal(synchronize('--write', cwd), true);
  assert.equal(synchronize('--check', cwd), false);
  assert.equal(git('show', ':AGENTS.md'), staged);
});
