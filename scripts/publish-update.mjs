// Explicit end-of-update automation. No background watcher, merge, release, or deployment.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { root, expected, git, assertCheckout, validateRemote, safeFile, githubClient, assertRepository, canResumePrepared } from './repository-guard.mjs';
import { assertPublicationBaseline } from './publication-baseline.mjs';
import { stagePublicationSnapshot } from './publication-index.mjs';

const digest = data => crypto.createHash('sha256').update(data).digest('hex');
function check(base) {
  const r = spawnSync(process.execPath, ['scripts/check-repository.mjs'], { cwd: base, stdio: 'inherit', timeout: 600000 });
  assert(r.status === 0, 'Repository checks failed; nothing will be pushed');
}
function clean(base) { assert.equal(git(base, ['status', '--porcelain', '--untracked-files=all']).trim(), '', 'Commit only the reviewed update first; checkout must be clean: ' + base); }
function writeJson(file, value) {
  fs.writeFileSync(file + '.tmp', JSON.stringify(value, null, 2) + '\n');
  fs.renameSync(file + '.tmp', file);
}
const bindingFile = path.join(root, '.madar-local.json');
const receiptFile = path.join(root, '.madar-publish-receipt.json');
let lockFile, lockFd;
try {
  assertCheckout(root);
  assert(fs.existsSync(bindingFile), 'Local binding missing; follow docs/GITHUB_WORKFLOW.md');
  const binding = JSON.parse(fs.readFileSync(bindingFile, 'utf8'));
  assert.equal(binding.projectId, expected.projectId, 'Binding project mismatch');
  assert.equal(fs.realpathSync(binding.sourceRoot), root, 'Wrong source checkout');
  const common = fs.realpathSync(git(root, ['rev-parse', '--path-format=absolute', '--git-common-dir']).trim());
  assert.equal(common, fs.realpathSync(binding.sourceGitDirectory), 'Wrong source Git history');
  const target = fs.realpathSync(binding.publicationRoot);
  assert.notEqual(target, root, 'Publication checkout must be separate');
  assert.equal(fs.realpathSync(git(target, ['rev-parse', '--show-toplevel']).trim()), target, 'Wrong publication root');
  assert.equal(fs.realpathSync(git(target, ['rev-parse', '--path-format=absolute', '--git-common-dir']).trim()), fs.realpathSync(binding.publicationGitDirectory), 'Wrong publication Git history');
  lockFile = path.join(fs.realpathSync(binding.publicationGitDirectory), 'madar-publish.lock');
  lockFd = fs.openSync(lockFile, 'wx');
  fs.writeFileSync(lockFd, JSON.stringify({ pid: process.pid, source: root, started: new Date().toISOString() }));
  validateRemote(git(target, ['remote', 'get-url', 'origin']).trim());
  validateRemote(git(target, ['remote', 'get-url', '--push', 'origin']).trim());
  const args = process.argv.slice(2);
  const option = key => args.includes(key) ? args[args.indexOf(key) + 1] : null;
  assert(args.every((v, i) => i % 2 ? true : ['--message', '--body-file'].includes(v)), 'Unknown arguments');
  const message = option('--message');
  const bodyPath = option('--body-file');
  assert(message && !message.startsWith('-') && bodyPath, 'Use --message "..." --body-file <reviewed PR description>');
  const body = fs.readFileSync(path.resolve(bodyPath), 'utf8');
  assert(body.trim().length >= 40, 'Provide a reviewable description, checks, and limits');
  clean(root); clean(target);
  const sourceCommit = git(root, ['rev-parse', 'HEAD']).trim();
  const api = githubClient(target);
  await assertRepository(api);
  const me = await api('/user');
  assert.equal(me.id, expected.ownerId, 'Wrong signed-in account');
  check(root);
  const listed = git(root, ['ls-files', '--stage', '-z']).split('\0').filter(Boolean);
  const manifest = {};
  for (const entry of listed) {
    const [meta, name] = entry.split('\t');
    assert(/^100(?:644|755) /.test(meta), 'Only regular tracked files are publishable');
    const file = safeFile(root, name);
    assert(fs.statSync(file).isFile(), 'Not a regular file: ' + name);
    const buffer = fs.readFileSync(file);
    assert(buffer.length < 50 * 1024 * 1024, 'File needs explicit large-file review: ' + name);
    // Limited screening, not a proof of absence of secrets or personal information.
    if (!buffer.includes(0)) {
      const text = buffer.toString('utf8');
      assert(!/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{50,}|sk-(?:proj|svcacct)-[A-Za-z0-9_-]{40,}|AKIA[0-9A-Z]{16}/.test(text), 'Possible credential in ' + name);
    }
    manifest[name] = digest(buffer);
  }
  const previous = fs.existsSync(receiptFile) ? JSON.parse(fs.readFileSync(receiptFile, 'utf8')) : null;
  if (previous) assert.equal(previous.repositoryId, expected.repositoryId, 'Receipt repository mismatch');
  git(target, ['fetch', 'origin']);
  const open = await api('/repos/' + expected.repository + '/pulls?state=open&per_page=100');
  let branch;
  if (previous) {
    const pending = open.find(pr => pr.head.ref === previous.branch && pr.head.repo?.id === expected.repositoryId);
    if (pending) {
      branch = previous.branch;
      git(target, ['switch', branch]);
      assert.equal(git(target, ['rev-parse', 'HEAD']).trim(), git(target, ['rev-parse', 'origin/' + branch]).trim(), 'Review branch changed remotely; reconcile before publishing');
    } else if (previous.status === 'prepared') {
      const remoteHead = git(target, ['ls-remote', expected.remote, 'refs/heads/' + previous.branch]).trim().split(/\s+/)[0];
      assert(canResumePrepared(previous, git(target, ['rev-parse', 'HEAD']).trim(), git(target, ['branch', '--show-current']).trim(), remoteHead), 'Interrupted publication needs manual reconciliation');
      branch = previous.branch;
    }
  }
  if (!branch) {
    assert(!open.some(pr => pr.head.ref.startsWith('updates/')), 'Another automated review branch is open; reconcile it first');
    branch = 'updates/' + new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, '').toLowerCase();
    git(target, ['switch', '-c', branch, 'origin/main']);
  }
  const targetFiles = git(target, ['ls-files', '-z']).split('\0').filter(Boolean);
  // Git's committed representation is stable across LF/CRLF checkouts. Legacy
  // receipts already record the commit needed for this comparison; raw manifest
  // hashes remain copy/concurrency evidence, not the publication conflict baseline.
  if (previous) assertPublicationBaseline(root, target, sourceCommit, previous.commit);
  for (const name of targetFiles) {
    safeFile(target, name);
    assert(Object.hasOwn(manifest, name), 'Deletion needs explicit review and reconciliation: ' + name);
    if (!previous) assert(name === 'README.md' && git(target, ['rev-parse', 'HEAD']).trim() === '9d8df83adefdf44087943a0f211f257998333fcf', 'Unrecognized bootstrap content');
  }
  for (const name of Object.keys(manifest)) {
    const dest = safeFile(target, name);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(safeFile(root, name), dest);
    assert.equal(digest(fs.readFileSync(dest)), manifest[name], 'Copy verification failed');
  }
  assertCheckout(target);
  // Detect a concurrent source write before recording or pushing the snapshot.
  for (const [name, hash] of Object.entries(manifest)) assert.equal(digest(fs.readFileSync(safeFile(root, name))), hash, 'Source changed during snapshot');
  clean(root);
  git(target, ['config', '--local', 'core.hooksPath', '.githooks']);
  // Checks enumerate the intended index, including new files. They must pass
  // before commit/push; a failure retains the staged snapshot for inspection.
  stagePublicationSnapshot(target, manifest);
  check(target);
  const changed = git(target, ['diff', '--cached', '--name-only']).trim();
  if (!changed && !open.some(item => item.head.ref === branch)) {
    if (previous?.status !== 'prepared') throw Object.assign(new Error('No source changes to publish; no PR, merge, or deployment performed.'), { noChanges: true });
  }
  if (changed) git(target, ['commit', '-m', message, '-m', 'Prepared by Codex. Local source commit: ' + sourceCommit]);
  const commit = git(target, ['rev-parse', 'HEAD']).trim();
  const receipt = { repositoryId: expected.repositoryId, sourceCommit, branch, commit, manifest, status: 'prepared', updatedAt: new Date().toISOString() };
  writeJson(receiptFile, receipt);
  await assertRepository(api);
  git(target, ['push', '--set-upstream', 'origin', 'HEAD:refs/heads/' + branch], { timeout: 600000 });
  const remote = git(target, ['ls-remote', expected.remote, 'refs/heads/' + branch]).trim().split(/\s+/)[0];
  assert.equal(remote, commit, 'Uploaded commit mismatch');
  let pr = open.find(item => item.head.ref === branch && item.head.repo?.id === expected.repositoryId);
  const prBody = body + '\n\nLocal source commit: `' + sourceCommit + '`\n\nPrepared by Codex. Merge into main requires owner review; no merge or deployment was performed.';
  if (pr) pr = await api('/repos/' + expected.repository + '/pulls/' + pr.number, 'PATCH', { body: prBody, title: message });
  else pr = await api('/repos/' + expected.repository + '/pulls', 'POST', { title: message, body: prBody, head: branch, base: 'main', draft: true });
  receipt.status = 'pushed-awaiting-checks-and-review'; receipt.pullRequest = pr.html_url;
  writeJson(receiptFile, receipt);
  console.log(JSON.stringify({ sourceCommit, branch, commit, pullRequest: pr.html_url, status: receipt.status }, null, 2));
} catch (error) {
  if (error.noChanges) console.log(error.message);
  else {
    console.error(error.message);
    console.error('Stopped. No automatic merge, reset, cleanup, or force push. Inspect any prepared checkout before retrying.');
    process.exitCode = 1;
  }
} finally {
  if (lockFd !== undefined) { fs.closeSync(lockFd); fs.unlinkSync(lockFile); }
}
