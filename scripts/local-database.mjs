import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { projectRoot, localStatePath } from './local-state.mjs';
import { readExecutionProfile } from './execution-profile.mjs';

if (process.argv.length !== 2) throw new Error('This command takes no arguments and only initializes local storage.');
if (readExecutionProfile() !== 'portable') throw new Error('Local database setup requires the portable execution profile.');
const state = localStatePath();
const runtime = localStatePath(projectRoot, '.sites-runtime');
fs.mkdirSync(runtime, { recursive: true });
const config = path.join(runtime, 'local-database.json');
try {
  const entry = fs.lstatSync(config);
  if (entry.isSymbolicLink() || !entry.isFile()) throw new Error('Local database configuration must be a regular file, not a link.');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
fs.writeFileSync(config, JSON.stringify({
  name: 'madar-local-database', compatibility_date: '2026-05-15',
  d1_databases: [{ binding: 'DB', database_name: 'site-creator-d1',
    database_id: '00000000-0000-4000-8000-000000000000',
    migrations_dir: path.join(projectRoot, 'drizzle') }],
}, null, 2));
const result = spawnSync(process.execPath, ['--import', pathToFileURL(path.join(projectRoot, 'scripts/sites-env.mjs')).href,
  path.join(projectRoot, 'node_modules/wrangler/bin/wrangler.js'),
  'd1', 'migrations', 'apply', 'DB', '--local', '--config', config, '--persist-to', state],
{ cwd: projectRoot, stdio: 'inherit', timeout: 120_000 });
if (result.error) throw result.error;
process.exit(result.status ?? 1);
