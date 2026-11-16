import test from 'node:test';
import assert from 'node:assert/strict';
import { HOSTED_ORIGIN, checkHostedGuest, validateHostedCheck } from '../scripts/check-hosted-guest.mjs';

const hosting = { project_id: 'appgprj_6abf78ca27ec8191a502c42fe942a0e9' };
const repository = { repositoryId: 1459615658, projectId: 'madar-prd-office-001-v2' };
const response = (body, status = 200) => Response.json(body, { status, headers: { 'cache-control': 'private, no-store' } });
function mockTransport(override, calls = []) {
  return async (url, options) => {
    calls.push({ url, options });
    assert.equal(new URL(url).origin, HOSTED_ORIGIN);
    assert.equal(options.method, 'GET');
    assert.equal(options.credentials, 'omit');
    assert.equal(options.redirect, 'manual');
    assert(!Object.keys(options.headers).some(key => /^(cookie|authorization|oai-sites-authorization)$/i.test(key)));
    const route = new URL(url).pathname;
    const replacement = override?.(route, options);
    if (replacement) return replacement;
    if (['/', '/applications', '/network-lab'].includes(route)) return new Response('<html></html>', { headers: { 'content-type': 'text/html' } });
    if (route === '/api/account') return response({ user: null, isAdmin: false });
    if (route === '/api/madar') return response({ account: { user: null, isAdmin: false }, notes: [], review: null, courses: [{ id: 'office' }], lessons: [{}] });
    if (route === '/signin-with-chatgpt') return new Response(null, { status: 302, headers: { location: 'https://auth.example.invalid/synthetic-oauth', 'set-cookie': 'not-retained' } });
    return response({ error: 'sign_in_required' }, 401);
  };
}
test('requires explicit live intent and the exact site/repository; rejects extra input', () => {
  validateHostedCheck(['--run-live'], hosting, repository);
  for (const args of [[], ['--run-live', '--url', 'https://example.invalid'], ['--run-live', '--cookie', 'x']]) assert.throws(() => validateHostedCheck(args, hosting, repository));
  assert.throws(() => validateHostedCheck(['--run-live'], { project_id: 'another-site' }, repository));
  assert.throws(() => validateHostedCheck(['--run-live'], hosting, { ...repository, repositoryId: 1 }));
});
test('guest contract makes twelve bounded credential-free GETs and does not claim account isolation', async () => {
  const calls = [];
  const report = await checkHostedGuest(mockTransport(null, calls));
  assert.equal(report.status, 'passed');
  assert.equal(calls.length, 12);
  assert.equal(report.authenticatedAccounts, 'not-tested-no-dedicated-accounts');
  assert.equal(report.crossAccountIsolation, 'not-tested');
  assert(!JSON.stringify(report).includes('not-retained'));
  assert.equal(calls.filter(call => call.options.headers['oai-authenticated-user-id']).length, 1);
});
test('fails closed for private access, forged identity, cached responses and redirects', async () => {
  const overrides = [
    route => route === '/api/study-backup' ? response({ confidential: 'DO_NOT_LOG' }) : null,
    (route, options) => options.headers['oai-authenticated-user-id'] ? response({ user: 'DO_NOT_LOG' }) : null,
    route => route === '/api/progress' ? Response.json({ error: 'sign_in_required' }, { status: 401 }) : null,
    route => route === '/api/account' ? response({ user: { id: 'DO_NOT_LOG' }, isAdmin: false }) : null,
    route => route === '/api/progress' ? new Response(null, { status: 302, headers: { location: 'https://example.invalid/DO_NOT_LOG' } }) : null,
  ];
  for (const override of overrides) {
    const report = await checkHostedGuest(mockTransport(override));
    assert.equal(report.status, 'failed');
    assert(!JSON.stringify(report).includes('DO_NOT_LOG'));
    assert(report.checks.length < 12);
  }
});
