import assert from 'node:assert/strict';
import { git, validatePath } from './repository-guard.mjs';

function committedFiles(base, commit) {
  // Receipts supply immutable commit IDs, never options or arbitrary revisions.
  assert(/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(commit), 'Invalid publication baseline commit');
  git(base, ['cat-file', '-e', commit + '^{commit}']);
  const entries = new Map();
  for (const record of git(base, ['ls-tree', '-r', '-z', '--full-tree', commit]).split('\0').filter(Boolean)) {
    const separator = record.indexOf('\t');
    const metadata = record.slice(0, separator);
    const name = record.slice(separator + 1);
    assert(separator > 0 && /^100(?:644|755) blob [a-f0-9]+$/.test(metadata), 'Only regular committed files are publishable');
    validatePath(name);
    entries.set(name, metadata); // Compare mode and Git blob ID, including binary files.
  }
  return entries;
}

export function assertPublicationBaseline(sourceRoot, publicationRoot, sourceCommit, previousCommit) {
  // A clean checkout is essential: tree equality must never hide an uncommitted edit.
  for (const base of [sourceRoot, publicationRoot]) {
    assert.equal(git(base, ['status', '--porcelain', '--untracked-files=all']).trim(), '', 'Publication comparison requires clean checkouts');
  }
  assert.equal(git(sourceRoot, ['rev-parse', 'HEAD']).trim(), sourceCommit, 'Source commit changed during publication');
  const source = committedFiles(sourceRoot, sourceCommit);
  const previous = committedFiles(publicationRoot, previousCommit);
  const current = committedFiles(publicationRoot, git(publicationRoot, ['rev-parse', 'HEAD']).trim());
  for (const [name, entry] of current) {
    assert(source.has(name), 'Deletion needs explicit review and reconciliation: ' + name);
    assert(entry === previous.get(name) || entry === source.get(name), 'Publication-side change would be overwritten: ' + name);
  }
  for (const name of previous.keys()) {
    assert(current.has(name) || !source.has(name), 'Publication-side deletion would be overwritten: ' + name);
  }
}
