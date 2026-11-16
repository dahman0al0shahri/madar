import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import { pathToFileURL } from 'node:url';
import { randomUUID, createHash } from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { projectRoot, localStatePath } from './local-state.mjs';
import { readExecutionProfile } from './execution-profile.mjs';
import { databaseSnapshot } from '../tests/helpers/database-snapshot.mjs';

// Only local processes started by this check are stopped. No existing server,
// learner database, hosted account, or deployment is used.
if (process.argv.length !== 2) throw new Error('This check takes no arguments.');
if (readExecutionProfile() !== 'portable') throw new Error('Application checks require the portable profile.');
const runtime = localStatePath(projectRoot, '.sites-runtime');
fs.mkdirSync(runtime, { recursive: true });
const runRoot = fs.mkdtempSync(path.join(runtime, 'application-check-'));
// Wrangler's pinned local export resolves .wrangler/state relative to its
// config; unlike execute/migrations, export has no --persist-to option.
const statePath = path.join(runRoot, '.wrangler', 'state');
const env = { ...process.env, CI: 'true', MADAR_LOCAL_STATE_PATH: statePath };
const preload = ['--import', pathToFileURL(path.join(projectRoot, 'scripts/sites-env.mjs')).href];
const checks = [];
const tracked = spawnSync('git', ['ls-files', '-z'], { cwd: projectRoot, encoding: 'utf8' });
assert.equal(tracked.status, 0, 'Run this check in a Git checkout.');
const files = tracked.stdout.split('\0').filter(Boolean);
function hashes() {
  return new Map(files.map(file => {
    const bytes = fs.readFileSync(path.join(projectRoot, file));
    // Normalize text checkout EOLs, but do not alter escaped strings or binaries.
    const content = /\.(?:html|css|[cm]?js|json|tsx?|md|ya?ml)$/.test(file)
      ? bytes.toString('utf8').replace(/\r\n/g, '\n') : bytes;
    return [file, createHash('sha256').update(content).digest('hex')];
  }));
}
let sequence = 0;
function pass(name) { checks.push(name); console.log('PASS: ' + name); }

function stop(child) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  if (process.platform === 'win32') {
    const result = spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { windowsHide: true, encoding: 'utf8' });
    if (result.status !== 0 && child.exitCode === null) child.kill();
  } else {
    try { process.kill(-child.pid, 'SIGTERM'); } catch (error) { if (error.code !== 'ESRCH') throw error; }
  }
}
function launch(args, label, storage = statePath) {
  const log = path.join(runRoot, `${++sequence}-${label}.log`);
  const descriptor = fs.openSync(log, 'w');
  const child = spawn(process.execPath, [...preload, ...args], { cwd: projectRoot, env: { ...env, MADAR_LOCAL_STATE_PATH: storage },
    windowsHide: true, detached: process.platform !== 'win32', stdio: ['ignore', descriptor, descriptor] });
  fs.closeSync(descriptor);
  child.on('error', error => { child.launchError = error; });
  return { child, log };
}
function tail(log) { return fs.readFileSync(log, 'utf8').slice(-6000); }
async function run(args, label, timeout = 360_000) {
  const { child, log } = launch(args, label);
  const end = Date.now() + timeout;
  try {
    while (child.exitCode === null && child.signalCode === null && !child.launchError) {
      if (Date.now() >= end) throw new Error(label + ' timed out');
      await delay(200);
    }
    if (child.launchError) throw child.launchError;
    assert.equal(child.exitCode, 0, label + '\n' + tail(log));
  } finally { stop(child); }
}
async function unusedPort() {
  const server = net.createServer();
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  const { port } = server.address();
  await new Promise(resolve => server.close(resolve));
  return port;
}
async function withServer(mode, action, storage = statePath) {
  const port = await unusedPort();
  const origin = `http://127.0.0.1:${port}`;
  const args = mode === 'dev'
    ? ['scripts/run-framework.mjs', 'dev', '--hostname', '127.0.0.1', '--port', String(port)]
    : ['node_modules/wrangler/bin/wrangler.js', 'dev', '--config', 'dist/server/wrangler.json',
      '--local', '--persist-to', storage, '--ip', '127.0.0.1', '--port', String(port), '--inspector-port', '0'];
  const { child, log } = launch(args, mode, storage);
  const request = (route, options = {}) => fetch(origin + route, { redirect: 'manual', ...options, signal: AbortSignal.timeout(25_000) });
  try {
    const end = Date.now() + 180_000;
    let ready = false;
    while (Date.now() < end) {
      if (child.launchError) throw child.launchError;
      if (child.exitCode !== null || child.signalCode !== null) throw new Error(mode + ' exited\n' + tail(log));
      try { if ((await request('/api/account')).status === 200) { ready = true; break; } } catch {}
      await delay(500);
    }
    assert(ready, mode + ' did not start\n' + tail(log));
    await action(request, origin);
  } catch (error) {
    console.error(mode + ' server log:\n' + tail(log));
    throw error;
  } finally {
    stop(child);
    const end = Date.now() + 15_000;
    while (child.exitCode === null && child.signalCode === null && !child.launchError && Date.now() < end) await delay(100);
    assert(child.exitCode !== null || child.signalCode !== null || child.launchError, 'Owned server did not stop.');
  }
}
async function publicChecks(request, mode) {
  for (const route of ['/', '/applications', '/network-lab']) {
    const response = await request(route);
    assert.equal(response.status, 200, mode + ' ' + route);
    assert.match(response.headers.get('content-type'), /text\/html/);
    assert.match(await response.text(), /<html/i);
  }
  const catalog = await request('/api/madar');
  assert.equal(catalog.status, 200);
  const data = await catalog.json();
  assert.deepEqual(data.courses.map(c => c.id).sort(), ['network', 'office', 'os1']);
  assert(data.lessons.length > 0);
  assert.equal(data.account.user, null);
  assert.equal((await request('/api/progress')).status, 401);
  pass(mode + ': home, applications, lab, three-course catalog, guest access');
}
let snapshot;
let userId;
let exported;
const wordState = { version: 2, bookmarks: ['v01'], mistakes: [], history: [], active: null };
const noteText = 'Synthetic recovery note — ملاحظة تجريبية، ليست نشاط طالب.\nSecond line: "quoted", \'single\', <text>.';
const withoutExportTime = ({ exportedAt, ...data }) => {
  assert(Number.isFinite(Date.parse(exportedAt)), 'Backup must have an export timestamp.');
  return data;
};
async function signedIn(request) {
  const response = await request('/signin-with-chatgpt?return_to=%2F');
  assert.equal(response.status, 302);
  const cookie = response.headers.get('set-cookie')?.split(';')[0];
  assert(cookie);
  const account = await (await request('/api/account', { headers: { cookie } })).json();
  assert.equal(account.user?.id, 'local_seedy');
  assert.equal(account.accountDirectoryAvailable, true);
  assert.equal(account.isAdmin, false);
  return { cookie, id: account.user.id };
}
try {
  const before = hashes();
  await run(['scripts/run-framework.mjs', 'build'], 'build');
  assert(fs.existsSync(path.join(projectRoot, 'dist/server/wrangler.json')));
  const after = hashes();
  const changed = files.filter(file => before.get(file) !== after.get(file));
  assert.deepEqual(changed, [], 'Build changed tracked content; update the generator/output together.');
  pass('full application build');
  pass('build preserves all tracked content, including the applications interface');
  await run(['scripts/local-database.mjs'], 'migrate');
  pass('all SQL migrations on an empty local database');
  await withServer('dev', async (request, origin) => {
    await publicChecks(request, 'dev');
    const forged = await (await request('/api/account', { headers: {
      'oai-authenticated-user-id': 'forged-user', 'oai-authenticated-user-email': 'forged@example.test',
    } })).json();
    assert.equal(forged.user, null);
    const { cookie, id } = await signedIn(request);
    userId = id;
    const route = '/api/madar/state?kind=profile&owner=' + encodeURIComponent(id);
    const headers = { cookie, origin, 'content-type': 'application/json' };
    const initial = await (await request(route, { headers })).json();
    assert.equal(initial.revision, 0);
    snapshot = { version: 1, visits: {}, notes: { smoke: 'Synthetic local check; not learner activity.' } };
    const body = JSON.stringify({ revision: 0, requestId: randomUUID(), snapshot });
    assert.equal((await request(route, { method: 'PUT', headers, body })).status, 200);
    const saved = await (await request(route, { headers })).json();
    assert.equal(saved.revision, 1);
    assert.deepEqual(saved.snapshot, snapshot);
    assert.equal((await request(route, { method: 'PUT', headers,
      body: JSON.stringify({ revision: 0, requestId: randomUUID(), snapshot }) })).status, 409);
    assert.equal((await request(route.replace(encodeURIComponent(id), 'another-test-user'), { headers })).status, 409);
    assert.equal((await request(route, { method: 'PUT', headers: { ...headers, origin: 'https://example.test' }, body })).status, 403);
    assert.equal((await request('/api/study-backup')).status, 401);
    assert.equal((await request('/api/notes?lesson=v01&owner=' + id, { method: 'PUT', headers,
      body: JSON.stringify({ text: noteText, revision: 0 }) })).status, 200);
    assert.equal((await request('/api/progress', { method: 'PUT', headers,
      body: JSON.stringify({ state: wordState, revision: 0 }) })).status, 200);
    const backupResponse = await request('/api/study-backup', { headers: { cookie } });
    assert.equal(backupResponse.status, 200);
    assert.match(backupResponse.headers.get('cache-control'), /private.*no-store/);
    exported = withoutExportTime(await backupResponse.json());
    assert.equal(exported.schema, 1);
    assert.equal(exported.owner, id);
    assert.deepEqual(Object.keys(exported.courses).sort(), ['Access', 'Excel', 'Word']);
    assert.deepEqual(exported.courses.Word, { revision: 1, state: wordState });
    assert.equal(exported.notes.find(row => row.lesson === 'v01')?.note, noteText);
    assert.deepEqual(exported.madar.find(row => row.kind === 'profile')?.snapshot, snapshot);
    assert(Array.isArray(exported.worksheets));
    pass('signed-in JSON backup contains the saved profile and Unicode note; guests are rejected');
    const logout = await request('/signout-with-chatgpt');
    assert.equal(logout.status, 302);
    assert.match(logout.headers.get('set-cookie'), /Max-Age=0/);
    assert.equal((await request(route)).status, 401);
    pass('local test sign-in, forged-header rejection, save/read, stale revision, owner/origin guards, sign-out');
  });
  await run(['scripts/local-database.mjs'], 'migrate-again');
  await withServer('dev', async request => {
    const { cookie, id } = await signedIn(request);
    assert.equal(id, userId);
    const result = await (await request('/api/madar/state?kind=profile&owner=' + encodeURIComponent(id), { headers: { cookie } })).json();
    assert.equal(result.revision, 1);
    assert.deepEqual(result.snapshot, snapshot);
    pass('server restart and repeated migration preserve the synthetic record');
  });
  await withServer('built', request => publicChecks(request, 'built'));
  // All original servers are stopped. Export only this run's synthetic DB and
  // import into a brand-new path, without preapplying schema or replacing data.
  const original = databaseSnapshot(statePath);
  const restorePath = path.join(runRoot, 'restored-state');
  assert(!fs.existsSync(restorePath), 'Recovery target must be new.');
  const sql = path.join(runRoot, 'synthetic-backup.sql');
  const databaseConfig = path.join(runRoot, 'recovery-database.json');
  fs.copyFileSync(path.join(runtime, 'local-database.json'), databaseConfig);
  const wrangler = 'node_modules/wrangler/bin/wrangler.js';
  await run([wrangler, 'd1', 'export', 'DB', '--local', '--config', databaseConfig,
    '--output', sql], 'export-synthetic-db');
  assert(fs.statSync(sql).size > 0, 'SQL export must not be empty.');
  await run([wrangler, 'd1', 'execute', 'DB', '--local', '--config', databaseConfig,
    '--persist-to', restorePath, '--file', sql], 'restore-synthetic-db');
  const restored = databaseSnapshot(restorePath);
  assert.deepEqual(restored, original, 'Restored schema or records differ from the original database.');
  assert.deepEqual(databaseSnapshot(statePath), original, 'Export/restore changed the original database.');
  pass('SQL recovery preserves ' + Object.keys(original.rows).length + ' tables and ' +
    Object.values(original.rows).reduce((total, rows) => total + rows.length, 0) + ' rows, schema and integrity');
  await withServer('dev', async request => {
    const { cookie, id } = await signedIn(request);
    assert.equal(id, userId);
    const response = await request('/api/study-backup', { headers: { cookie } });
    assert.equal(response.status, 200);
    assert.deepEqual(withoutExportTime(await response.json()), exported);
    pass('restored application serves an identical user backup, excluding only export time');
  }, restorePath);
  assert.deepEqual(databaseSnapshot(statePath), original, 'Restored server touched the original database.');
  fs.writeFileSync(path.join(runRoot, 'result.json'), JSON.stringify({ status: 'passed', node: process.version, platform: process.platform, checks }, null, 2));
  console.log('Evidence (local synthetic data only): ' + path.relative(projectRoot, runRoot));
} catch (error) {
  fs.writeFileSync(path.join(runRoot, 'result.json'), JSON.stringify({ status: 'failed', checks, error: error.message }, null, 2));
  throw error;
}
