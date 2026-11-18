import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const begin = '<!-- BEGIN generated maintenance reference -->';
const end = '<!-- END generated maintenance reference -->';
const guide = 'AGENTS.md';
const root = fileURLToPath(new URL('../', import.meta.url));

function code(value) {
  assert(typeof value === 'string' && /^[a-zA-Z0-9_./:[\]-]+$/.test(value), 'Unexpected command name or map path');
  return '\x60' + value + '\x60';
}

export function refreshedGuide(text, scripts, map) {
  const lines = text.split(/(?<=\n)/);
  const marker = token => {
    const matches = lines.flatMap((line, index) => line.replace(/\r?\n$/, '') === token ? [index] : []);
    assert.equal(matches.length, 1, 'Expected one marker: ' + token);
    return matches[0];
  };
  const start = marker(begin);
  const stop = marker(end);
  assert(start < stop, 'Maintenance reference markers are reversed');
  const newline = lines[start].endsWith('\r\n') ? '\r\n' : '\n';
  const commands = Object.keys(scripts).filter(name => /^(?:check(?:$|:)|atlas:|maintenance:|install:ci$|generate$)/.test(name)).sort();
  const rows = [
    '### Current maintenance reference', '',
    'Refresh this section with `npm run maintenance:sync`. Repository checks verify it against `package.json` and `project-map.json`.', '',
    'Run these scripts with `npm run <name>`:', '',
    ...commands.map(name => '- ' + code(name)), '',
    '| Feature | Start reading here |', '| --- | --- |',
    ...map.features.map(feature => '| ' + code(feature.id) + ' | ' + code(feature.entry) + ' |'), '',
    'The generator has ' + map.sourceAssemblies.length + ' source assemblies and ' +
      map.generation.groups.reduce((sum, group) => sum + group.outputs.length, 0) + ' declared outputs.', ''
  ];
  return lines.slice(0, start + 1).join('') + rows.join(newline) + lines.slice(stop).join('');
}

export function synchronize(mode, cwd = root) {
  assert(['--check', '--write', '--staged'].includes(mode), 'Expected --check, --write or --staged');
  const git = args => execFileSync('git', args, { cwd, encoding: 'utf8' });
  const local = name => {
    const filename = path.join(cwd, name);
    assert(fs.lstatSync(filename).isFile(), 'Expected a regular file: ' + name);
    return filename;
  };
  const read = name => mode === '--staged' ? git(['show', ':' + name]) : fs.readFileSync(local(name), 'utf8');
  const current = read(guide);
  const scripts = JSON.parse(read('package.json')).scripts;
  const map = JSON.parse(read('project-map.json'));
  const updated = refreshedGuide(current, scripts, map);
  if (current === updated) return false;
  assert(mode !== '--check', 'AGENTS.md is stale. Run npm run maintenance:sync and review the change.');
  let output = updated;
  if (mode === '--staged') {
    const indexEntry = git(['ls-files', '--stage', '--', guide]).trim();
    assert(/^100644 [a-f0-9]+ 0\tAGENTS\.md$/.test(indexEntry), 'Expected one regular staged AGENTS.md');
    const working = fs.readFileSync(local(guide), 'utf8');
    assert.equal(working.replace(/\r\n/g, '\n') === current.replace(/\r\n/g, '\n'), true,
      'AGENTS.md has unstaged edits. Run npm run maintenance:sync and stage the intended changes yourself.');
    output = refreshedGuide(working, scripts, map);
  }
  fs.writeFileSync(local(guide), output);
  if (mode === '--staged') git(['add', '--', guide]);
  return true;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    assert(process.argv.length <= 3, 'Too many maintenance arguments');
    console.log(synchronize(process.argv[2] ?? '--check') ? 'Updated the maintenance reference in AGENTS.md.' : 'AGENTS.md maintenance reference is current.');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
