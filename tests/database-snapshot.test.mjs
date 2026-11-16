import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { databaseSnapshot } from './helpers/database-snapshot.mjs';

test('recovery comparison detects lost/changed records and schema, independent of row order', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'madar-recovery-control-'));
  const directories = ['original', 'restored'].map(name => path.join(root, name));
  const databases = [];
  try {
    for (const [index, directory] of directories.entries()) {
      fs.mkdirSync(directory);
      const db = new DatabaseSync(path.join(directory, 'control.sqlite'));
      databases.push(db);
      db.exec('CREATE TABLE madar_states (owner TEXT, snapshot TEXT, revision INTEGER, bytes BLOB)');
      const insert = db.prepare('INSERT INTO madar_states VALUES (?,?,?,?)');
      for (const owner of index ? ['b', 'a'] : ['a', 'b']) insert.run(owner, 'ملاحظة\n"quoted"', 9007199254740993n, new Uint8Array([0, 10, 255]));
    }
    const original = databaseSnapshot(directories[0]);
    assert.deepEqual(databaseSnapshot(directories[1]), original);
    databases[1].exec("UPDATE madar_states SET snapshot='changed' WHERE owner='a'");
    assert.notDeepEqual(databaseSnapshot(directories[1]), original, 'Must detect changed content with unchanged row count.');
    databases[1].exec("DELETE FROM madar_states WHERE owner='b'");
    assert.notDeepEqual(databaseSnapshot(directories[1]), original, 'Must detect missing records.');
    databases[1].exec('ALTER TABLE madar_states ADD COLUMN extra TEXT');
    assert.notDeepEqual(databaseSnapshot(directories[1]).schema, original.schema);
    assert.deepEqual(databaseSnapshot(directories[0]), original, 'Inspection must not mutate source.');
  } finally {
    for (const db of databases) db.close();
    fs.rmSync(root, { recursive: true, force: true });
  }
});
