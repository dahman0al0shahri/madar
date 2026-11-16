import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const expected = Object.freeze({ project: 'MADAR', projectId: 'madar-prd-office-001-v2',
  repository: 'dahman0al0shahri/madar', repositoryId: 1459615658, ownerId: 281097261,
  remote: 'https://github.com/dahman0al0shahri/madar.git', defaultBranch: 'main', visibility: 'private' });
export const root = fs.realpathSync(fileURLToPath(new URL('../', import.meta.url)));
export function git(cwd, args, options = {}) {
  const r = spawnSync('git', ['-C', cwd, ...args], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
    timeout: 120000, ...options });
  if (r.error || r.status !== 0) throw new Error('Git failed: ' + args[0] + ' (inspect locally; credentials are not logged)');
  return r.stdout;
}
export function validateIdentity(value) { assert.deepEqual(value, expected, 'MADAR identity mismatch'); }
export function validateRemote(url) { assert.equal(url, expected.remote, 'Unexpected repository destination'); }
export function validatePath(name) {
  assert(name && !name.includes('\\') && !name.includes('\0') && !name.startsWith('/') && !/^[A-Za-z]:/.test(name), 'Invalid relative path');
  const parts = name.split('/');
  assert(parts.every(p => p && p !== '.' && p !== '..'), 'Path traversal');
  assert(!parts.some(p => /^(?:\.git|node_modules|\.sites-runtime|\.codex|\.agents|\.wrangler|\.next|dist|outputs|work|coverage)$/i.test(p)), 'Local-only directory');
  assert(!parts.some(p => /^\.env(?:\.|$)/i.test(p)) && !/\.(?:pem|key|pfx|p12|sqlite3?|db|rmp|dmp|log)$/i.test(name), 'Sensitive/local file type');
}
export function safeFile(base, name) {
  validatePath(name);
  let current = base;
  for (const part of name.split('/')) {
    current = path.join(current, part);
    if (fs.existsSync(current)) assert(!fs.lstatSync(current).isSymbolicLink(), 'Links are not allowed: ' + name);
  }
  const relative = path.relative(fs.realpathSync(base), current);
  assert(relative && !relative.startsWith('..') && !path.isAbsolute(relative), 'Outside project');
  return current;
}
export function validatePush(remote, input) {
  validateRemote(remote);
  const lines = input.trim().split(/\r?\n/).filter(Boolean);
  assert(lines.length > 0, 'No push reference supplied');
  for (const line of lines) {
    const [localRef, localSha, remoteRef] = line.trim().split(/\s+/);
    assert(localRef && localSha && remoteRef, 'Invalid push reference');
    assert(/^refs\/heads\/updates\/[a-z0-9][a-z0-9/-]*$/.test(remoteRef), 'Only updates/* review branches may be pushed');
    assert(!/^0+$/.test(localSha), 'Branch deletion is not allowed');
  }
}
export function assertCheckout(base) {
  assert.equal(fs.realpathSync(git(base, ['rev-parse', '--show-toplevel']).trim()), fs.realpathSync(base), 'Not repository root');
  validateIdentity(JSON.parse(fs.readFileSync(path.join(base, '.madar-repository.json'), 'utf8')));
}
// Never print credentials. Obtain the existing Git credential only for github.com.
export function githubClient(base) {
  const env = { ...process.env, GIT_TERMINAL_PROMPT: '0', GCM_INTERACTIVE: 'never' };
  const result = spawnSync('git', ['-C', base, 'credential', 'fill'], {
    input: 'protocol=https\nhost=github.com\n\n', encoding: 'utf8', env, timeout: 30000 });
  assert(result.status === 0, 'GitHub authentication is unavailable; complete Git sign-in first');
  const token = result.stdout.split(/\r?\n/).find(s => s.startsWith('password='))?.slice(9);
  assert(token, 'No GitHub credential');
  return async function api(endpoint, method = 'GET', body) {
    assert(endpoint === '/user' || endpoint.startsWith('/repos/' + expected.repository + '/') || endpoint === '/repos/' + expected.repository, 'API destination mismatch');
    const response = await fetch('https://api.github.com' + endpoint, {
      method, redirect: 'error', signal: AbortSignal.timeout(30000),
      headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {}) });
    if (!response.ok) throw new Error('GitHub ' + method + ' failed: HTTP ' + response.status + ' at ' + endpoint);
    return response.status === 204 ? null : response.json();
  };
}
export async function assertRepository(api) {
  const repo = await api('/repos/' + expected.repository);
  assert.equal(repo.id, expected.repositoryId, 'Remote numeric repository ID changed');
  assert.equal(repo.owner.id, expected.ownerId, 'Repository owner changed');
  assert.equal(repo.full_name, expected.repository, 'Repository name changed');
  assert.equal(repo.private, true, 'MADAR must remain private');
  assert.equal(repo.default_branch, 'main', 'Unexpected default branch');
  return repo;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    assertCheckout(root);
    if (process.argv[2] === '--pre-push') {
      const input = fs.readFileSync(0, 'utf8');
      validatePush(process.argv[4], input);
      for (const line of input.trim().split(/\r?\n/)) {
        const [, localSha, , remoteSha] = line.trim().split(/\s+/);
        assert(remoteSha, 'Missing remote SHA');
        if (!/^0+$/.test(remoteSha)) git(root, ['merge-base', '--is-ancestor', remoteSha, localSha]);
      }
      await assertRepository(githubClient(root));
      console.log('PASS: MADAR destination and review-branch push guard');
    } else {
      if (process.env.GITHUB_REPOSITORY_ID) {
        assert.equal(process.env.GITHUB_REPOSITORY_ID, String(expected.repositoryId), 'Wrong CI repository ID');
        assert.equal(process.env.GITHUB_REPOSITORY, expected.repository, 'Wrong CI repository');
      }
      console.log('PASS: MADAR project identity');
    }
  } catch (e) { console.error(e.message); process.exitCode = 1; }
}
