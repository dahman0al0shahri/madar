import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { expected, validateIdentity, validateRemote, validatePath, validatePush, safeFile, canResumePrepared } from '../scripts/repository-guard.mjs';
test('resumes interrupted upload/PR creation only at the recorded branch and SHA', () => {
  const receipt = { status: 'prepared', branch: 'updates/example', commit: 'abc' };
  assert(canResumePrepared(receipt, 'abc', 'updates/example', ''));
  assert(canResumePrepared(receipt, 'abc', 'updates/example', 'abc'));
  assert(!canResumePrepared(receipt, 'abc', 'updates/example', 'changed'));
  assert(!canResumePrepared(receipt, 'changed', 'updates/example', ''));
  assert(!canResumePrepared(receipt, 'abc', 'main', ''));
  assert(!canResumePrepared({ ...receipt, status: 'pushed-awaiting-checks-and-review' }, 'abc', 'updates/example', 'abc'));
});
test('accepts exact project and repository identity', () => validateIdentity({ ...expected }));
test('rejects another project and recreated repository', () => {
  assert.throws(() => validateIdentity({ ...expected, project: 'OTHER' }));
  assert.throws(() => validateIdentity({ ...expected, repositoryId: 123 }));
});
test('rejects wrong, credential-bearing, and lookalike remotes', () => {
  for (const v of ['https://github.com/other/madar.git', 'https://github.com.evil/madar.git',
    'https://token@github.com/dahman0al0shahri/madar.git', expected.remote + '/']) assert.throws(() => validateRemote(v));
});
test('rejects traversal, metadata, private state, and credentials', () => {
  for (const v of ['../a', '/a', 'C:/a', 'a\\b', '.git/config', 'a/../b', '.env', '.env.local', 'x/key.pem',
    'x/data.sqlite', 'node_modules/a', '.sites-runtime/a', 'a//b']) assert.throws(() => validatePath(v), v);
  validatePath('app/api/madar/state/route.ts');
});
test('allows review branch and blocks main, tags, and deletion', () => {
  validatePush(expected.remote, 'refs/heads/task abc refs/heads/updates/example def');
  for (const v of ['refs/heads/task abc refs/heads/main def', 'refs/tags/v1 abc refs/tags/v1 def',
    '(delete) 000000 refs/heads/updates/example abc']) assert.throws(() => validatePush(expected.remote, v));
});
test('allows an up-to-date push with no refs only for the expected destination', () => {
  validatePush(expected.remote, '');
  validatePush(expected.remote, '\n');
  assert.throws(() => validatePush('https://github.com/other/madar.git', ''));
});
test('blocks linked directories and accepts contained files', () => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'madar-guard-'));
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'madar-outside-'));
  try {
    fs.symlinkSync(outside, path.join(base, 'link'), process.platform === 'win32' ? 'junction' : 'dir');
    assert.throws(() => safeFile(base, 'link/file.txt'));
    fs.symlinkSync(path.join(outside, 'missing'), path.join(base, 'dangling'), process.platform === 'win32' ? 'junction' : 'dir');
    assert.throws(() => safeFile(base, 'dangling/file.txt'));
    assert.equal(safeFile(base, 'valid.txt'), path.join(base, 'valid.txt'));
  } finally {
    for (const target of [base, outside]) {
      assert.equal(path.dirname(path.resolve(target)), path.resolve(os.tmpdir()), 'Cleanup must stay inside the test temp directory');
      fs.rmSync(target, { recursive: true, force: true });
    }
  }
});
