import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import { spawn, spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
import { projectRoot, localStatePath } from './local-state.mjs';
import { readExecutionProfile } from './execution-profile.mjs';

const record = process.argv.length === 3 && process.argv[2] === '--record-baselines';
const lessonNote = process.argv.length === 3 && process.argv[2] === '--lesson-note';
const networkSave = process.argv.length === 3 && process.argv[2] === '--network-save';
const grep = process.argv.length === 4 && process.argv[2] === '--grep' && process.argv[3];
const reviewSave = process.argv.length === 3 && process.argv[2] === '--review-save';
assert(process.argv.length === 2 || record || lessonNote || networkSave || reviewSave || grep, 'Use --grep <test title> or one of --lesson-note, --network-save, --review-save or --record-baselines.');
assert(readExecutionProfile() === 'portable', 'Browser checks require the portable profile.');
if (record) assert(process.platform === 'linux', 'Record reference images in the documented Linux CI environment.');
const runtime = localStatePath(projectRoot, '.sites-runtime');
fs.mkdirSync(runtime, { recursive: true });
const runRoot = fs.mkdtempSync(path.join(runtime, 'browser-check-'));
const artifacts = path.join(runRoot, 'artifacts');
fs.mkdirSync(artifacts);
const env = { ...process.env, CI: 'true', WRANGLER_SEND_METRICS: 'false', CLOUDFLARE_CF_FETCH_ENABLED: 'false', MADAR_LOCAL_STATE_PATH: path.join(runRoot, 'state'),
  MADAR_BROWSER_ARTIFACTS: artifacts, MADAR_RECORD_BASELINES: record ? '1' : '0' };
const preload = ['--import', pathToFileURL(path.join(projectRoot, 'scripts/sites-env.mjs')).href];
const children = [];
function launch(args, name) {
  const log = path.join(runRoot, name + '.log');
  const fd = fs.openSync(log, 'w');
  const child = spawn(process.execPath, [...preload, ...args], { cwd: projectRoot, env,
    windowsHide: true, detached: process.platform !== 'win32', stdio: ['ignore', fd, fd] });
  fs.closeSync(fd);
  child.on('error', error => { child.launchError = error; });
  children.push(child);
  return { child, log };
}
function stop(child) {
  if (!child.pid || child.exitCode !== null || child.signalCode !== null) return;
  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' });
  } else {
    try { process.kill(-child.pid, 'SIGTERM'); } catch (error) { if (error.code !== 'ESRCH') throw error; }
  }
}
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => {
  for (const child of children.toReversed()) stop(child);
  process.exit(1);
});
async function complete(processInfo, timeout) {
  const { child, log } = processInfo;
  const end = Date.now() + timeout;
  while (child.exitCode === null && child.signalCode === null && !child.launchError) {
    if (Date.now() > end) throw Error('Timed out: ' + path.basename(log));
    await delay(200);
  }
  if (child.launchError) throw child.launchError;
  console.log(fs.readFileSync(log, 'utf8').slice(-5000));
  assert.equal(child.exitCode, 0, 'Failed: ' + path.basename(log));
}
try {
  await complete(launch(['scripts/local-database.mjs'], 'migrations'), 180_000);
  const listener = net.createServer();
  await new Promise((resolve, reject) => { listener.once('error', reject); listener.listen(0, '127.0.0.1', resolve); });
  const port = listener.address().port;
  await new Promise(resolve => listener.close(resolve));
  env.MADAR_BROWSER_URL = `http://127.0.0.1:${port}`;
  const server = launch(['scripts/run-framework.mjs', 'dev', '--hostname', '127.0.0.1', '--port', String(port)], 'server');
  let ready = false;
  const end = Date.now() + 180_000;
  while (Date.now() < end) {
    if (server.child.launchError) throw server.child.launchError;
    assert.equal(server.child.exitCode, null, 'Server exited: ' + fs.readFileSync(server.log, 'utf8').slice(-4000));
    try { ready = (await fetch(env.MADAR_BROWSER_URL + '/api/account', { signal: AbortSignal.timeout(5000) })).ok; } catch {}
    if (ready) break;
    await delay(500);
  }
  assert(ready, 'Isolated browser server did not start.');
  await complete(launch(['node_modules/@playwright/test/cli.js', 'test', '--config', 'playwright.config.mjs',
    ...(grep ? ['--grep', grep] : []),
    ...(reviewSave ? ['review-save.spec.mjs'] : []),
    ...(networkSave ? ['network-save.spec.mjs'] : []),
    ...(lessonNote ? ['--grep', 'course navigation and saved lesson note survive a fresh browser session'] : [])], 'playwright'), 600_000);
  fs.writeFileSync(path.join(artifacts, 'result.json'), JSON.stringify({ status: 'passed', scope: grep ? 'grep: ' + grep : reviewSave ? 'review-save' : networkSave ? 'network-save' : lessonNote ? 'lesson-note' : 'full', recordBaselines: record,
    platform: process.platform, node: process.version, isolatedSyntheticStorage: true }, null, 2));
} finally {
  for (const child of children.reverse()) stop(child);
  console.log('Browser evidence: ' + path.relative(projectRoot, artifacts));
}
