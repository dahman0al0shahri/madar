import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { localStatePath } from '../scripts/local-state.mjs';

test('local storage stays inside its checkout and rejects files and links', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'madar-state-path-'));
  try {
    assert.equal(localStatePath(root, '.wrangler/state'), path.join(fs.realpathSync(root), '.wrangler/state'));
    assert.throws(() => localStatePath(root, '..'), /inside/);
    assert.throws(() => localStatePath(root, '.'), /inside/);
    assert.throws(() => localStatePath(root, path.resolve(root, '..', 'outside')), /inside/);
    fs.writeFileSync(path.join(root, 'file'), 'not a directory');
    assert.throws(() => localStatePath(root, 'file/child'), /links or files/);
    fs.mkdirSync(path.join(root, 'real'));
    fs.symlinkSync(path.join(root, 'real'), path.join(root, 'link'), process.platform === 'win32' ? 'junction' : 'dir');
    assert.throws(() => localStatePath(root, 'link/child'), /links or files/);
  } finally {
    assert.equal(path.dirname(fs.realpathSync(root)), fs.realpathSync(os.tmpdir()));
    assert(path.basename(root).startsWith('madar-state-path-'));
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('local database command rejects arguments including --remote before running Wrangler', () => {
  const result = spawnSync(process.execPath, [fileURLToPath(new URL('../scripts/local-database.mjs', import.meta.url)), '--remote'], { encoding: 'utf8' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /takes no arguments/);
});
