import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { projectRoot, localStatePath } from './local-state.mjs';

export const HOSTED_ORIGIN = 'https://madar-word-lab.d7d7y7.chatgpt.site';
const PROJECT_ID = 'appgprj_6abf78ca27ec8191a502c42fe942a0e9';
const requireCondition = (condition, message) => { if (!condition) throw new Error(message); };

async function readBody(response) {
  const reader = response.body?.getReader();
  requireCondition(reader, 'Missing response body.');
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      requireCondition(size <= 4 * 1024 * 1024, 'Response exceeds the check limit.');
      chunks.push(value);
    }
  } finally { await reader.cancel(); }
  return Buffer.concat(chunks).toString('utf8');
}
async function json(response) {
  requireCondition(response.headers.get('content-type')?.includes('application/json'), 'Expected JSON.');
  const text = await readBody(response);
  try { return JSON.parse(text); } catch { throw new Error('Invalid JSON response.'); }
}
function privateResponse(response) {
  const cache = response.headers.get('cache-control') || '';
  requireCondition(/\bprivate\b/i.test(cache) && /\bno-store\b/i.test(cache), 'Private response must not be cached.');
}

// The injected transport is used only by offline contract tests. Live execution
// is opt-in below: one fixed origin, GET only, no cookies, tokens or redirects.
export async function checkHostedGuest(fetchImpl = fetch) {
  const report = { scope: 'hosted-anonymous-read-only', origin: HOSTED_ORIGIN,
    startedAt: new Date().toISOString(), status: 'running', checks: [],
    authenticatedAccounts: 'not-tested-no-dedicated-accounts',
    crossAccountIsolation: 'not-tested', hostedRecovery: 'not-tested' };
  const probe = 'madar-readonly-probe-' + randomUUID();
  async function check(name, route, inspect, headers = {}) {
    const entry = { name, route: route.replaceAll(probe, '<synthetic-probe>'), status: null, passed: false };
    report.checks.push(entry);
    let response;
    try {
      response = await fetchImpl(HOSTED_ORIGIN + route, { method: 'GET', credentials: 'omit', redirect: 'manual',
        headers: { accept: 'application/json, text/html', ...headers }, signal: AbortSignal.timeout(20_000) });
      entry.status = response.status;
      await inspect(response);
      entry.passed = true;
    } catch { throw new Error(name + ' failed; response bodies and headers are intentionally omitted.'); }
    finally { if (response?.body && !response.bodyUsed) await response.body.cancel(); }
  }
  try {
    for (const route of ['/', '/applications', '/network-lab']) {
      await check('public page ' + route, route, async response => {
        requireCondition(response.status === 200, 'Expected a public page.');
        requireCondition(response.headers.get('content-type')?.includes('text/html'), 'Expected HTML.');
        requireCondition(/<html/i.test(await readBody(response)), 'Missing HTML document.');
      });
    }
    await check('anonymous account', '/api/account', async response => {
      requireCondition(response.status === 200, 'Account endpoint unavailable.');
      privateResponse(response);
      const data = await json(response);
      requireCondition(data.user === null && data.isAdmin === false, 'Expected guest identity.');
    });
    await check('anonymous course catalog', '/api/madar', async response => {
      requireCondition(response.status === 200, 'Catalog unavailable.');
      const data = await json(response);
      requireCondition(data.account?.user === null && data.account?.isAdmin === false, 'Expected guest catalog.');
      requireCondition(Array.isArray(data.notes) && data.notes.length === 0 && data.review === null, 'Guest catalog must not contain learner records.');
      requireCondition(Array.isArray(data.courses) && data.courses.some(course => course.id === 'office') && Array.isArray(data.lessons) && data.lessons.length > 0, 'Missing public course content.');
    });
    const rejected = async response => {
      requireCondition(response.status === 401, 'Guest must be rejected.');
      privateResponse(response);
      const data = await json(response);
      requireCondition(data.error === 'sign_in_required', 'Expected sign-in rejection.');
    };
    for (const route of ['/api/progress', '/api/study-backup', '/api/notes?lesson=v01&owner=' + probe,
      '/api/worksheet?lesson=v01&owner=' + probe, '/api/madar/state?kind=profile&owner=' + probe]) {
      await check('private data rejects guest', route, rejected);
    }
    // Use a nonexistent synthetic ID only. Do not spoof a real learner or call
    // /api/account here: that endpoint registers authenticated users on GET.
    await check('gateway rejects client-supplied identity', '/api/progress', rejected, {
      'oai-authenticated-user-id': probe, 'oai-authenticated-user-email': 'readonly-probe@example.invalid',
    });
    await check('sign-in entry redirects', '/signin-with-chatgpt?return_to=%2Faccount', response => {
      requireCondition([302, 303, 307].includes(response.status), 'Sign-in did not redirect.');
      const location = response.headers.get('location');
      requireCondition(location && new URL(location, HOSTED_ORIGIN).protocol === 'https:', 'Missing HTTPS sign-in destination.');
      // Do not follow OAuth, retain Set-Cookie, or treat this as successful login.
    });
    report.status = 'passed';
  } catch (error) {
    report.status = 'failed';
    report.error = error.message;
  }
  report.finishedAt = new Date().toISOString();
  return report;
}

export function validateHostedCheck(args, hosting, repository) {
  requireCondition(args.length === 1 && args[0] === '--run-live', 'Explicit --run-live is required. No URL, cookie, token or other arguments are accepted.');
  requireCondition(hosting.project_id === PROJECT_ID && repository.repositoryId === 1459615658 && repository.projectId === 'madar-prd-office-001-v2', 'Wrong MADAR site or repository identity.');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  validateHostedCheck(process.argv.slice(2), JSON.parse(fs.readFileSync(path.join(projectRoot, '.openai/hosting.json'), 'utf8')),
    JSON.parse(fs.readFileSync(path.join(projectRoot, '.madar-repository.json'), 'utf8')));
  const runtime = localStatePath(projectRoot, '.sites-runtime');
  fs.mkdirSync(runtime, { recursive: true });
  const directory = fs.mkdtempSync(path.join(runtime, 'hosted-guest-check-'));
  const report = await checkHostedGuest();
  fs.writeFileSync(path.join(directory, 'result.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  console.log('Local evidence: ' + path.relative(projectRoot, directory));
  if (report.status !== 'passed') process.exitCode = 1;
}
