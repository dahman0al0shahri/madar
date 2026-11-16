import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const projectRoot = fs.realpathSync(fileURLToPath(new URL('../', import.meta.url)));

// Test runs can isolate storage without touching a developer's local database.
export function localStatePath(root = projectRoot, value = process.env.MADAR_LOCAL_STATE_PATH || '.wrangler/state') {
  const base = fs.realpathSync(root);
  const target = path.resolve(base, value);
  const relative = path.relative(base, target);
  if (!relative || relative === '..' || relative.startsWith('..' + path.sep) || path.isAbsolute(relative)) {
    throw new Error('Local state must be a directory inside this checkout.');
  }
  let current = base;
  for (const part of relative.split(path.sep)) {
    current = path.join(current, part);
    try {
      const entry = fs.lstatSync(current);
      if (entry.isSymbolicLink() || !entry.isDirectory()) throw new Error('Local state must not traverse links or files.');
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  return target;
}
