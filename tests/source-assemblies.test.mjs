import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import assembly from '../build/madar/source-assemblies.cjs';
import {projectRoot, localStatePath} from '../scripts/local-state.mjs';

function fixture() {
  const runtime = localStatePath(projectRoot, '.sites-runtime');
  fs.mkdirSync(runtime, {recursive: true});
  const root = fs.mkdtempSync(path.join(runtime, 'source-assembly-'));
  const put = (file, content) => { const dest=path.join(root,file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,content); };
  const parts = ['modules/source-parts/example/first.js.inc', 'modules/source-parts/example/second.js.inc'];
  return {root,put,parts};
}

test('source assembly preserves exact ordered bytes, Unicode and mixed line endings', () => {
  const {root,put,parts}=fixture();
  const a=Buffer.from('(()=>{\r\nconst message="مدار";'), b=Buffer.from('\nconsole.log(message);})();\r\n');
  put(parts[0],a);put(parts[1],b);
  const manifest=[{output:'public/example.js',parts}];
  assembly.assembleSources(root,manifest);
  assert.deepEqual(fs.readFileSync(path.join(root,manifest[0].output)),Buffer.concat([a,b]));
  assembly.assembleSources(root,manifest);
  assert.deepEqual(fs.readFileSync(path.join(root,manifest[0].output)),Buffer.concat([a,b]));
});

test('invalid later assembly never partially overwrites existing output', () => {
  const {root,put,parts}=fixture();
  put(parts[0],'replacement');put('public/existing.js','keep this');
  assert.throws(()=>assembly.assembleSources(root,[{output:'public/existing.js',parts:[parts[0]]},
    {output:'public/missing.js',parts:[parts[1]]}]),/ENOENT/);
  assert.equal(fs.readFileSync(path.join(root,'public/existing.js'),'utf8'),'keep this');
});

test('assembly rejects traversal, duplicate output and repeated parts', () => {
  const {root,put,parts}=fixture();put(parts[0],'x');
  assert.throws(()=>assembly.assembleSources(root,[{output:'../outside.js',parts:[parts[0]]}]),/Invalid assembly path/);
  assert.throws(()=>assembly.assembleSources(root,[{output:'x.js',parts:[parts[0],parts[0]]}]),/duplicate source parts/);
  assert.throws(()=>assembly.assembleSources(root,[{output:'x.js',parts:[parts[0]]},{output:'x.js',parts:[parts[0]]}]),/Duplicate assembly output/);
});
