import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

// Read-only inspection of the disposable D1 database, independent of its SQL
// export. Include application schema, every row, and migration/sequence records.
export function databaseSnapshot(statePath) {
  const candidates = [];
  function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      assert(!entry.isSymbolicLink(), 'Synthetic database path must not contain links.');
      if (entry.isDirectory()) visit(file);
      else if (entry.isFile() && entry.name.endsWith('.sqlite')) candidates.push(file);
    }
  }
  visit(statePath);
  const matches = [];
  for (const file of candidates) {
    const db = new DatabaseSync(file, { readOnly: true });
    try {
      if (!db.prepare("SELECT 1 FROM sqlite_schema WHERE type='table' AND name='madar_states'").get()) continue;
      assert.deepEqual(db.prepare('PRAGMA integrity_check').all().map(row => row.integrity_check), ['ok']);
      assert.equal(db.prepare('PRAGMA foreign_key_check').all().length, 0);
      const schema = db.prepare("SELECT type,name,tbl_name,sql FROM sqlite_schema WHERE name NOT GLOB 'sqlite_*' AND name NOT GLOB '_cf_*' ORDER BY type,name").all();
      const tables = schema.filter(row => row.type === 'table').map(row => row.name);
      if (db.prepare("SELECT 1 FROM sqlite_schema WHERE name='sqlite_sequence'").get()) tables.push('sqlite_sequence');
      const rows = Object.fromEntries(tables.sort().map(name => {
        const query = db.prepare('SELECT * FROM "' + name.replaceAll('"', '""') + '"');
        query.setReadBigInts(true);
        const encoded = query.all().map(row => JSON.stringify(row, (_, value) =>
          typeof value === 'bigint' ? { integer: String(value) } : value instanceof Uint8Array ? { blob: Buffer.from(value).toString('hex') } : value)).sort();
        return [name, encoded];
      }));
      matches.push({ schema: JSON.parse(JSON.stringify(schema)), rows });
    } finally { db.close(); }
  }
  assert.equal(matches.length, 1, 'Expected exactly one disposable MADAR database.');
  return matches[0];
}
