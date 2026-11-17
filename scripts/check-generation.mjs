import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { projectRoot, localStatePath } from './local-state.mjs';
import { validateProjectMap } from './check-structure.mjs';

// No dependency installation, database, network or running preview is needed.
// Generate in an isolated source copy; never rewrite the developer's checkout.
assert.equal(process.argv.length, 2, 'This check takes no arguments.');
const files = execFileSync('git', ['ls-files', '-z'], {cwd: projectRoot, encoding: 'utf8'}).split('\0').filter(Boolean);
const map = JSON.parse(fs.readFileSync(path.join(projectRoot, 'project-map.json'), 'utf8'));
validateProjectMap(map, files);
const outputs = map.generation.groups.flatMap(group => group.outputs).sort();
const runtime = localStatePath(projectRoot, '.sites-runtime');
fs.mkdirSync(runtime, {recursive: true});
const runRoot = fs.mkdtempSync(path.join(runtime, 'generation-check-'));
const source = path.join(runRoot, 'source');
const inputs = files.filter(file => file === 'project-map.json' ||
  (/^(?:modules|lib|public|scripts|build)\//.test(file) && /\.(?:html|css|[cm]?js|json|inc)$/.test(file)));
for (const file of inputs) {
  const origin = path.join(projectRoot, file);
  assert(fs.lstatSync(origin).isFile(), 'Only regular source files are copied: ' + file);
  const target = path.join(source, file);
  fs.mkdirSync(path.dirname(target), {recursive: true});
  fs.copyFileSync(origin, target);
}
// Inherited by the nested simulator process. Audit even unchanged writes, so a
// new output cannot bypass the generated-file inventory simply by being equal.
const audit = path.join(runRoot, 'audit.cjs');
const auditLog = path.join(runRoot, 'writes.jsonl');
fs.writeFileSync(audit, `const fs=require('node:fs'),path=require('node:path');
const write=fs.writeFileSync;
fs.writeFileSync=function(file,...args){
  if(typeof file!=='string')throw Error('Generation requires named files');
  const absolute=path.resolve(file),relative=path.relative(process.env.MADAR_GENERATION_ROOT,absolute);
  if(relative==='..'||relative.startsWith('..'+path.sep)||path.isAbsolute(relative))throw Error('Generator write outside isolated source');
  write(process.env.MADAR_GENERATION_LOG,JSON.stringify(relative.split(path.sep).join('/'))+'\\n',{flag:'a'});
  return write.call(this,file,...args);
};\n`);
const digest = file => createHash('sha256').update(fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n')).digest('hex');
function generate() {
  execFileSync(process.execPath, [map.generation.entry], {
    cwd: source, encoding: 'utf8', timeout: 120_000, maxBuffer: 2 * 1024 * 1024, windowsHide: true,
    env: {...process.env, NODE_OPTIONS: `--require ${JSON.stringify(audit)}`,
      MADAR_GENERATION_ROOT: source, MADAR_GENERATION_LOG: auditLog},
  });
  const written = [...new Set(fs.readFileSync(auditLog, 'utf8').trim().split('\n').map(line => JSON.parse(line)))].sort();
  assert.deepEqual(written, outputs, 'Generator writes differ from project-map.json; review and update the inventory');
  return Object.fromEntries(outputs.map(file => [file, digest(path.join(source, file))]));
}
const first = generate();
for (const file of outputs) {
  assert.equal(first[file], digest(path.join(projectRoot, file)),
    `Stale generated file: ${file}. Run npm run generate, review the diff, then rerun the check.`);
}
const second = generate();
assert.deepEqual(second, first, 'Generating twice must produce identical output');
fs.writeFileSync(path.join(runRoot, 'result.json'), JSON.stringify({status: 'passed', outputs: first, repeatedGeneration: true,
  comparison: 'SHA-256 after CRLF-to-LF normalization only', isolatedSource: true}, null, 2) + '\n');
console.log(`PASS: ${outputs.length} registered outputs match the checkout and remain stable on repeat generation.`);
console.log('Generation evidence: ' + path.relative(projectRoot, runRoot));
