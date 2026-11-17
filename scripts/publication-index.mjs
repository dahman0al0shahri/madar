import assert from 'node:assert/strict';
import { git, safeFile } from './repository-guard.mjs';

// Make the already-validated snapshot visible to checks that enumerate tracked
// files. Stage only the explicit manifest, never unrelated untracked files.
export function stagePublicationSnapshot(target, manifest) {
  const files = Object.keys(manifest);
  assert(files.length && files.includes('.githooks/pre-push'), 'Incomplete publication manifest');
  for (const file of files) safeFile(target, file);
  git(target, ['add', '--pathspec-from-file=-', '--pathspec-file-nul'], {
    input: files.join('\0') + '\0',
  });
  git(target, ['update-index', '--chmod=+x', '.githooks/pre-push']);
}
