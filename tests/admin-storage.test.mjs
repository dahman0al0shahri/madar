import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import test from 'node:test';
import { ADMIN_EMAIL } from '../lib/activity.mjs';
import { stateRequest } from '../lib/madar-state.mjs';

test('administrator configuration persists only authorized current revisions', async t => {
  const sqlite = new DatabaseSync(':memory:');
  t.after(() => sqlite.close());
  const migrations = new URL('../drizzle/', import.meta.url);
  for (const file of readdirSync(migrations).filter(name => name.endsWith('.sql')).sort()) {
    sqlite.exec(readFileSync(new URL(file, migrations), 'utf8'));
  }
  // Adapt the D1 calls used by the handler to this single in-memory SQLite connection.
  const db = { prepare(sql) {
    const statement = sqlite.prepare(sql);
    const query = (...args) => ({
      first: () => statement.get(...args) ?? null,
      all: () => ({ results: statement.all(...args) }),
      run: () => ({ meta: statement.run(...args) })
    });
    return { ...query(), bind: query };
  } };
  const url = 'http://localhost/api/admin/madar';
  const admin = { userId: 'fixture-admin', email: ADMIN_EMAIL };
  const member = { userId: 'fixture-member', email: 'member@example.test' };
  const get = user => stateRequest(new Request(url), db, user, true);
  const put = (user, body) => stateRequest(new Request(url, { method: 'PUT',
    headers: { origin: 'http://localhost', 'content-type': 'application/json' }, body: JSON.stringify(body)
  }), db, user, true);
  const { snapshot, revision } = await (await get(admin)).json();
  snapshot.access.network = 'restricted';
  const body = { snapshot, revision, requestId: crypto.randomUUID() };
  assert.equal((await put(null, body)).status, 401);
  assert.equal((await put(member, body)).status, 403);
  assert.equal((await put(admin, body)).status, 200);
  assert.equal((await (await put(admin, body)).json()).revision, revision + 1);
  assert.equal((await put(admin, { ...body, requestId: crypto.randomUUID() })).status, 409);
  const saved = await (await get(admin)).json();
  assert.deepEqual(saved.snapshot, snapshot);
  assert.equal(saved.revision, revision + 1);
});
