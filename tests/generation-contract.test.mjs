import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { execFileSync, spawnSync } from 'node:child_process';
import { projectRoot, localStatePath } from '../scripts/local-state.mjs';

test('generation gate detects stale output and undeclared writes without changing source', () => {
  const runtime = localStatePath(projectRoot, '.sites-runtime');
  fs.mkdirSync(runtime, {recursive: true});
  const root = fs.mkdtempSync(path.join(runtime, 'generation-fixture-'));
  const put = (file, text) => {
    const target = path.join(root, file);
    fs.mkdirSync(path.dirname(target), {recursive: true});
    fs.writeFileSync(target, text);
  };
  for (const file of ['check-generation.mjs', 'check-structure.mjs', 'local-state.mjs']) {
    put('scripts/' + file, fs.readFileSync(path.join(projectRoot, 'scripts', file)));
  }
  put('package.json', '{"type":"module"}\n');
  put('.gitignore', '.sites-runtime/\n');
  const builder = "require('node:fs').writeFileSync('public/generated.js','/* original */\\n');\n";
  put('scripts/build.cjs', builder);
  put('public/generated.js', '/* original */\n');
  put('project-map.json', JSON.stringify({schemaVersion: 1, areas: {scripts: 'Build and checks', public: 'Output'},
    features: [{id: 'demo', title: 'Synthetic fixture', entry: 'scripts/build.cjs', sources: [], integration: []}],
    generation: {entry: 'scripts/build.cjs', generators: ['scripts/build.cjs'],
      groups: [{stage: 'scripts/build.cjs', sources: ['scripts/build.cjs'], outputs: ['public/generated.js']}]}}));
  execFileSync('git', ['init', '--quiet'], {cwd: root, windowsHide: true});
  execFileSync('git', ['add', '--', '.gitignore', 'package.json', 'project-map.json', 'scripts', 'public'],
    {cwd: root, windowsHide: true, stdio: 'pipe'});
  const run = () => spawnSync(process.execPath, ['scripts/check-generation.mjs'], {
    cwd: root, encoding: 'utf8', timeout: 30000, windowsHide: true,
  });
  let result = run();
  assert.equal(result.status, 0, result.stderr);
  put('public/generated.js', '/* stale */\n');
  result = run();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Stale generated file/);
  assert.equal(fs.readFileSync(path.join(root, 'public/generated.js'), 'utf8'), '/* stale */\n');
  put('public/generated.js', '/* original */\n');
  put('scripts/build.cjs', builder + "require('node:fs').writeFileSync('public/undeclared.js','extra');\n");
  result = run();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /writes differ from project-map/);
  assert(!fs.existsSync(path.join(root, 'public/undeclared.js')), 'Generation must stay in the isolated copy');
});
