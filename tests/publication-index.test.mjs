import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { git } from '../scripts/repository-guard.mjs';
import { projectRoot, localStatePath } from '../scripts/local-state.mjs';
import { stagePublicationSnapshot } from '../scripts/publication-index.mjs';

test('publication index exposes new snapshot files to checks without staging unrelated files', () => {
  const runtime = localStatePath(projectRoot, '.sites-runtime');
  fs.mkdirSync(runtime, {recursive: true});
  const root = fs.mkdtempSync(path.join(runtime, 'publication-index-'));
  git(root, ['init', '--quiet']);
  fs.mkdirSync(path.join(root, '.githooks'));
  fs.writeFileSync(path.join(root, '.githooks/pre-push'), '#!/bin/sh\nexit 0\n');
  fs.writeFileSync(path.join(root, 'new source.js'), 'export const value = 1;\n');
  fs.writeFileSync(path.join(root, 'unrelated.txt'), 'Do not include\n');
  assert.equal(git(root, ['ls-files']).trim(), '');
  stagePublicationSnapshot(root, {'.githooks/pre-push': 'already-validated', 'new source.js': 'already-validated'});
  assert.deepEqual(git(root, ['ls-files', '-z']).split('\0').filter(Boolean), ['.githooks/pre-push', 'new source.js']);
  assert.match(git(root, ['ls-files', '--stage', '.githooks/pre-push']), /^100755 /);
  assert.equal(fs.readFileSync(path.join(root, 'unrelated.txt'), 'utf8'), 'Do not include\n');
  assert.throws(() => stagePublicationSnapshot(root, {}), /Incomplete publication manifest/);
  assert.throws(() => stagePublicationSnapshot(root, {'.githooks/pre-push': 'x', '../private.txt': 'x'}), /Path traversal/);
});
