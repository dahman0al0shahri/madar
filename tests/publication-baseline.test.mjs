import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { git } from '../scripts/repository-guard.mjs';
import { assertPublicationBaseline } from '../scripts/publication-baseline.mjs';

function fixture(t, sourceCRLF = false) {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'madar-baseline-'));
  t.after(() => {
    assert.equal(path.dirname(path.resolve(temp)), path.resolve(os.tmpdir()));
    assert(path.basename(temp).startsWith('madar-baseline-'));
    fs.rmSync(temp, { recursive: true, force: true });
  });
  const source = path.join(temp, 'source'), publication = path.join(temp, 'publication');
  fs.mkdirSync(source);
  git(source, ['init', '--initial-branch=main']);
  function configure(base, crlf) {
    for (const [key, value] of Object.entries({ 'user.name': 'MADAR test', 'user.email': 'test@example.invalid',
      'commit.gpgsign': 'false', 'core.autocrlf': String(crlf), 'core.eol': crlf ? 'crlf' : 'lf',
      'core.safecrlf': 'false', 'core.filemode': 'false', 'core.hooksPath': path.join(temp, 'no-hooks') })) git(base, ['config', '--local', key, value]);
  }
  configure(source, sourceCRLF);
  const write = (base, name, content) => fs.writeFileSync(path.join(base, name), content);
  const commit = base => {
    git(base, ['add', '--', '.gitattributes', 'lesson.txt', 'asset.bin']);
    git(base, ['commit', '-m', 'Fixture snapshot']);
    return git(base, ['rev-parse', 'HEAD']).trim();
  };
  write(source, '.gitattributes', '*.txt text\n*.bin -text\n');
  write(source, 'lesson.txt', sourceCRLF ? 'first\r\nsecond\r\n' : 'first\nsecond\n');
  write(source, 'asset.bin', Buffer.from([0, 1, 13, 10, 255]));
  const baseline = commit(source);
  git(temp, ['clone', '--no-checkout', source, publication]);
  configure(publication, !sourceCRLF);
  git(publication, ['checkout', 'main']);
  const compare = (previous = baseline) => assertPublicationBaseline(source, publication, git(source, ['rev-parse', 'HEAD']).trim(), previous);
  return { source, publication, baseline, write, commit, compare };
}

for (const sourceCRLF of [false, true]) test(`accepts a source update across ${sourceCRLF ? 'CRLF to LF' : 'LF to CRLF'} checkout conversion`, t => {
  const f = fixture(t, sourceCRLF);
  // Reproduce the old raw-hash mismatch using actual Git checkouts, not mock text.
  assert.notDeepEqual(fs.readFileSync(path.join(f.source, 'lesson.txt')), fs.readFileSync(path.join(f.publication, 'lesson.txt')));
  f.write(f.source, 'lesson.txt', sourceCRLF ? 'new lesson\r\n' : 'new lesson\n');
  f.commit(f.source);
  f.compare();
  // A later clean checkout still compares against the immutable prior commit.
  git(f.publication, ['checkout-index', '--force', '--all']);
  f.compare();
  // Complete one publication and compare the next update after re-checkout.
  fs.copyFileSync(path.join(f.source, 'lesson.txt'), path.join(f.publication, 'lesson.txt'));
  const nextBaseline = f.commit(f.publication);
  // Remove only this owned fixture file so Git cannot skip an up-to-date path.
  fs.unlinkSync(path.join(f.publication, 'lesson.txt'));
  git(f.publication, ['checkout-index', '--force', '--all', '--index']);
  assert.notDeepEqual(fs.readFileSync(path.join(f.source, 'lesson.txt')), fs.readFileSync(path.join(f.publication, 'lesson.txt')));
  f.write(f.source, 'lesson.txt', 'second update\n'); f.commit(f.source);
  f.compare(nextBaseline);
});

test('rejects divergent publication text even when only whitespace changes', t => {
  const f = fixture(t);
  f.write(f.publication, 'lesson.txt', 'first \nsecond\n'); f.commit(f.publication);
  assert.throws(() => f.compare(), /Publication-side change/);
});

test('rejects changed binary bytes, including CRLF to LF inside a binary', t => {
  const f = fixture(t);
  f.write(f.publication, 'asset.bin', Buffer.from([0, 1, 10, 255])); f.commit(f.publication);
  assert.throws(() => f.compare(), /Publication-side change/);
});

test('rejects divergent committed executable mode', t => {
  const f = fixture(t);
  git(f.publication, ['update-index', '--chmod=+x', 'lesson.txt']);
  git(f.publication, ['commit', '-m', 'Mode change']);
  assert.throws(() => f.compare(), /Publication-side change/);
});

test('accepts publication content already reconciled with the source', t => {
  const f = fixture(t);
  for (const base of [f.source, f.publication]) { f.write(base, 'lesson.txt', 'same new content\n'); f.commit(base); }
  f.compare();
});

test('rejects uncommitted publication and source edits', t => {
  const f = fixture(t);
  f.write(f.publication, 'lesson.txt', 'unsaved publication change\n');
  assert.throws(() => f.compare(), /clean checkouts/);
  git(f.publication, ['checkout-index', '--force', '--all']);
  f.write(f.source, 'lesson.txt', 'unsaved source change\n');
  assert.throws(() => f.compare(), /clean checkouts/);
});

test('rejects source deletion and publication-side deletion without reconciliation', t => {
  const f = fixture(t);
  git(f.publication, ['rm', '--', 'lesson.txt']); git(f.publication, ['commit', '-m', 'Delete on publication']);
  assert.throws(() => f.compare(), /Publication-side deletion/);
  // A separate fixture exercises the opposite direction without resetting history.
  const other = fixture(t);
  git(other.source, ['rm', '--', 'lesson.txt']); git(other.source, ['commit', '-m', 'Delete on source']);
  assert.throws(() => other.compare(), /Deletion needs explicit review/);
});

test('rejects an invalid or unavailable receipt baseline instead of ignoring conflicts', t => {
  const f = fixture(t);
  assert.throws(() => f.compare('--all'), /Invalid publication baseline/);
  assert.throws(() => f.compare('0'.repeat(40)), /Git failed/);
});
