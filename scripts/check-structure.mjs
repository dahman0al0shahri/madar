import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

export function validateProjectMap(map, files) {
  assert.equal(map.schemaVersion, 1, 'Unsupported project map version');
  const tracked = new Set(files);
  const reference = value => {
    assert.equal(typeof value, 'string', 'A file reference must be a string');
    assert(value && !value.includes('\\') && !value.startsWith('/') &&
      !value.includes(':') && value.split('/').every(p => p && p !== '.' && p !== '..'),
    'Invalid project-relative path: ' + value);
    assert(tracked.has(value), 'Untracked or missing map reference: ' + value);
  };
  for (const file of files) {
    if (file.includes('/')) assert(Object.hasOwn(map.areas, file.split('/')[0]),
      'Document this top-level area in project-map.json: ' + file.split('/')[0]);
  }
  for (const [area, purpose] of Object.entries(map.areas)) {
    assert(!area.includes('/') && typeof purpose === 'string' && purpose.trim(), 'Invalid area description');
    assert(files.some(f => f.startsWith(area + '/')), 'Map area has no tracked files: ' + area);
  }
  const ids = new Set();
  for (const feature of map.features) {
    assert(feature.id && !ids.has(feature.id), 'Duplicate or missing feature ID');
    ids.add(feature.id);
    assert(feature.title?.trim(), 'Missing feature title');
    [feature.entry, ...feature.sources, ...feature.integration].forEach(reference);
  }
  reference(map.generation.entry);
  map.generation.generators.forEach(reference);
  const outputs = new Set();
  for (const group of map.generation.groups) {
    assert(map.generation.generators.includes(group.stage), 'Undeclared generation stage');
    group.sources.forEach(reference);
    assert(group.outputs.length, 'Generation group must have outputs');
    for (const output of group.outputs) {
      reference(output);
      assert(!outputs.has(output), 'Duplicate generated output: ' + output);
      outputs.add(output);
    }
  }
  if (map.sourceAssemblies) {
    const assembled = new Set(), usedParts = new Set();
    for (const assembly of map.sourceAssemblies) {
      reference(assembly.output);
      assert(!assembled.has(assembly.output), 'Duplicate source assembly');
      assembled.add(assembly.output);
      assert(assembly.purpose?.trim(), 'Assembly must explain its responsibility');
      assert(assembly.parts.length && new Set(assembly.parts).size === assembly.parts.length, 'Missing or duplicate source parts');
      for (const part of assembly.parts) {
        reference(part);
        assert(part.startsWith('modules/source-parts/'), 'Source parts must live in modules/source-parts');
        usedParts.add(part);
      }
    }
    const stage = map.generation.groups.find(g => g.stage === 'build/madar/source-assemblies.cjs');
    assert(stage, 'Missing source assembly generation stage');
    assert.deepEqual([...assembled].sort(), [...stage.outputs].sort(), 'Assembly output inventory differs from generation inventory');
    assert(stage.sources.includes('project-map.json'), 'Assembly stage must declare its source manifest');
    for (const part of usedParts) assert(!assembled.has(part), 'Source assembly cycle');
    for (const file of files.filter(f => f.startsWith('modules/source-parts/') && f.endsWith('.inc'))) {
      assert(usedParts.has(file), 'Orphan source part: ' + file);
    }
  }
  return { features: ids.size, outputs: outputs.size, areas: Object.keys(map.areas).length };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const files = execFileSync('git', ['ls-files', '-z'], {cwd: root, encoding: 'utf8'}).split('\0').filter(Boolean);
  for (const file of files) assert(fs.existsSync(path.join(root, file)), 'Tracked file missing: ' + file);
  const result = validateProjectMap(JSON.parse(fs.readFileSync(path.join(root, 'project-map.json'), 'utf8')), files);
  console.log(`PASS: ${result.areas} source areas, ${result.features} feature entry points and ${result.outputs} generated outputs. This is navigation validation, not a dependency or security audit.`);
}
