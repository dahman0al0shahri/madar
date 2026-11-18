import fs from 'node:fs';
import {documentLinker} from './atlas/document-links.mjs';
import { migrationTrials } from './atlas/schema-evidence.mjs';
import { dataAnchors } from './atlas/data-evidence.mjs';
import { makeLineNotes } from './atlas/line-notes.mjs';
import { runExperiments } from './atlas/experiments.mjs';
import { assetPurpose,linkResources } from './atlas/resource-links.mjs';
import { publishedLineHistory } from './atlas/history.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { gzipSync } from 'node:zlib';
import assert from 'node:assert/strict';
import { analyze, language, resolveImport } from './atlas/analyze.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const git = (...args) => execFileSync('git', args, {
  cwd: root,
  maxBuffer: 128 * 1024 * 1024
});
const requested=process.argv.slice(2);
assert(!requested.length || requested.length===2 && requested[0]==='--source-commit' && /^[0-9a-f]{40}$/.test(requested[1]),'Use --source-commit <full Git commit>');
const revision = git('rev-parse', requested[1] || 'HEAD').toString().trim();
const readerEnv={...process.env};
delete readerEnv.GIT_DIR; delete readerEnv.GIT_WORK_TREE; delete readerEnv.GIT_INDEX_FILE;
const readerGit=(...args)=>execFileSync('git',args,{cwd:root,env:readerEnv,encoding:'utf8'});
const readerSource=name=>readerGit('show','HEAD:'+name);
const listing = git('ls-tree', '-rlz', revision).toString().split('\0').filter(Boolean);
const files = {};
for (const record of listing) {
  const tab = record.indexOf('\t');
  const [mode, type, oid, size] = record.slice(0, tab).trim().split(/\s+/);
  const name = record.slice(tab + 1);
  files[name] = {
    oid,
    bytes: Number(size) || 0,
    text: type === 'blob' && mode !== '120000' && !/\.(?:png|jpe?g|webp|mp4|docx|pdf|pptx|xlsx|ttf|woff2?|ico|zip|gif)$/i.test(name)
  };
}
const paths = new Set(Object.keys(files));
const blobs = new Map();
// Request only candidate text objects. Media stay in Git and are indexed by path and object ID.
const ids = [...new Set(Object.values(files).filter(f => f.text).map(f => f.oid))];
const batch = execFileSync('git', ['cat-file', '--batch'], {
  cwd: root,
  input: ids.join('\n') + '\n',
  maxBuffer: 128 * 1024 * 1024
});
let cursor = 0;
for (const id of ids) {
  const end = batch.indexOf(10, cursor);
  const [actual, type, size] = batch.toString('ascii', cursor, end).split(' ');
  assert.equal(actual, id);
  assert.equal(type, 'blob');
  const data = batch.subarray(end + 1, end + 1 + Number(size));
  cursor = end + 2 + Number(size);
  try {
    if (!data.includes(0)) blobs.set(id, new TextDecoder('utf-8', {
      fatal: true,
      ignoreBOM: true
    }).decode(data));
  } catch {/* Non-UTF-8 files retain metadata. */}
}
const source = name => {
  const value = blobs.get(files[name]?.oid);
  assert.equal(typeof value, 'string', name);
  return value;
};
const map = JSON.parse(source('project-map.json'));
const guide = JSON.parse(source('docs/code-atlas/guide.json'));
const generated = new Set(map.generation.groups.flatMap(group => group.outputs));
const originalParts = new Map();
const summaries = {};
const duplicateKeys = [],
  parseNotes = [];
const payloads = {};
const coverage={};
const migrations=migrationTrials(paths,source);
const documentLinks=documentLinker(paths,source);
const importUses=[];
const exportsByFile=new Map();
let lineCount = 0,
  textCount = 0;
function digestAnalysis(name, result, content) {
  const f = files[name];
  exportsByFile.set(name,new Set(result.exportedNames||[]));
  const lineStarts=[0];
  for(let at=content.indexOf('\n');at!==-1;at=content.indexOf('\n',at+1))lineStarts.push(at+1);
  function number(at){
    let lo=0,hi=lineStarts.length;
    while(lo<hi){const mid=(lo+hi)>>1;if(lineStarts[mid]<=at)lo=mid+1;else hi=mid;}
    return lo;
  }
  for(const [offset,,operation,specifier] of result.operations){
    if(operation!=='import'||!specifier.endsWith('.json'))continue;
    const target=resolveImport(name,specifier,paths);
    if(target)(files[target].dataReads??=[]).push([name,number(offset),'import']);
  }
  if(/\.(?:mjs|cjs|js|ts)$/.test(name)){
    for(const match of content.matchAll(/\bread\(\s*['"]([^'"]+\.json)['"]\s*\)/g)){
      if(paths.has(match[1]))(files[match[1]].dataReads??=[]).push([name,number(match.index),'read']);
    }
  }
  const definitions=new Map(result.bindings.map(b=>[b[0],b[2]]));
  for(const [specifier,exportName,at] of result.namedImports||[]){
    const target=resolveImport(name,specifier,paths);
    if(target && definitions.has(at))importUses.push([target,exportName,name,[...new Set(definitions.get(at).map(number))]]);
  }
  f.deps = [...new Set(result.imports.map(spec => resolveImport(originalParts.get(name)?.output || name, spec, paths)).filter(Boolean))];
  f.symbols = [...new Set(result.symbols.map(s => s[2]))];
  const lines = content ? content.split('\n').length - Number(content.endsWith('\n')) : 0;
  f.lines = lines;
  textCount++;
  lineCount += lines;
  const key = f.oid + ':' + name + ':' + language(name) + (originalParts.has(name) ? ':part:' + name : '');
  f.payload = key;
  if (!Object.hasOwn(payloads, key)) {
    const part=originalParts.get(name);
    if(part)f.assemblyStart=[part.output,part.combined.slice(0,part.begin).split('\n').length];
    const fieldGuides=[];
    const notes=makeLineNotes(name,content,result,migrations.get(name),part,fieldGuides);
    f.fieldReaders=dataAnchors(name,files,source);
    f.documentLinks=documentLinks(name,content);
    assert.equal(notes.length,lines,name);
    for (const [category] of notes) coverage[category]=(coverage[category]||0)+1;
    payloads[key] = gzipSync(JSON.stringify({
      content,
      notes,
      symbols: result.symbols,
      ops: result.operations,
      bindings: result.bindings,
      branches: result.branches,
      fields: result.fields || [], fieldGuides
    })).toString('base64');
  }
  const lineAt = offset => content.slice(0, offset).split('\n').length;
  if (!generated.has(name) && !name.startsWith('vendor/')) {
    for (const [offset, label] of result.repeatedKeys) duplicateKeys.push([name, lineAt(offset), label]);
    for (const [offset, label] of result.diagnostics) parseNotes.push([name, lineAt(offset), label]);
  }
}
// Analyze parts in their assembled syntax context, including functions spanning a boundary.
for (const assembly of map.sourceAssemblies) {
  const combined = assembly.parts.map(source).join('');
  assert(combined === source(assembly.output), 'Assembly drift: ' + assembly.output);
  let cursor = 0;
  const boundaries = assembly.parts.map(part => {
    const start = cursor;
    cursor += source(part).length;
    return start;
  });
  const whole = analyze(assembly.output, combined, boundaries);
  let begin = 0;
  for (const part of assembly.parts) {
    const end = begin + source(part).length;
    const clip = rows => rows.filter(([a, b]) => a < end && b > begin).map(([a, b, ...rest]) => [Math.max(0, a - begin), Math.min(end, b) - begin, ...rest]);
    const points = rows => rows.filter(([a]) => a >= begin && a < end).map(([a, label]) => [a - begin, label]);
    const operations = clip(whole.operations);
    const bindings = whole.bindings.filter(([at]) => at >= begin && at < end).map(([at, label, uses]) => [at - begin, label, uses.filter(i => i >= begin && i < end).map(i => i - begin)]);
    originalParts.set(part, {
      output: assembly.output, combined, begin,
      scriptNotes:whole.scriptNotes.filter(([at])=>at>=begin && at<end).map(([at,kind,msg,origin,trial])=>[at-begin,kind,msg,Math.max(0,origin-begin),trial]),
      bindings,
      branches: clip(whole.branches),
      symbols: clip(whole.symbols),
      operations,
      imports: operations.filter(row => ['import', 'export'].includes(row[2])).map(row => row[3]),
      diagnostics: points(whole.diagnostics),
      repeatedKeys: points(whole.repeatedKeys)
    });
    begin = end;
  }
}
for (const [name, f] of Object.entries(files)) {
  f.role = generated.has(name) ? 'generated' : originalParts.has(name) ? 'part' : name.startsWith('vendor/') ? 'vendor' : name.startsWith('tests/') ? 'test' : name.startsWith('docs/') ? 'documentation' : 'source';
  f.text = blobs.has(f.oid);
  if (!f.text) {
    f.role = 'asset';
    f.purpose=assetPurpose(name);
    continue;
  }
  const content = source(name);
  digestAnalysis(name, originalParts.get(name) || analyze(name, content), content);
}
for (const feature of map.features) {
  const detail = guide[feature.id];
  assert(detail, feature.id);
  for (const step of detail.steps) {
    const [relation, file, marker] = step;
    const value = source(file);
    const at = marker == null ? 0 : value.indexOf(marker);
    assert(at >= 0, relation + ' → ' + file + ' : ' + marker);
    step[2] = value.slice(0, at).split('\n').length;
  }
}
for (const match of source('docs/HUB_CORE.md').matchAll(/^\| \[[^\]]+\]\(\.\.\/(public\/hub\/[^)]+)\) \| ([^|]+) \|/gm)) summaries[match[1]] = match[2].trim();
const duplicates = new Map();
for (const [name, f] of Object.entries(files)) {
  const group = duplicates.get(f.oid) || [];
  group.push(name);
  duplicates.set(f.oid, group);
}
const exactGroups = [...duplicates.values()].filter(group => group.length > 1);
for(const [target,symbol,caller,uses] of importUses){
  if(uses.length && exportsByFile.get(target)?.has(symbol))(files[target].consumers??=[]).push([symbol,caller,uses]);
}
linkResources(files,source);
const experiments=await runExperiments(source);
const subjects = await publishedLineHistory(root, revision, files);
const data = {
  revision,
  experiments,coverage,
  subjects,
  map,
  guide,
  files,
  summaries,
  payloads,
  exactGroups,
  duplicateKeys,
  parseNotes,
  stats: {
    files: paths.size,
    text: textCount,
    lines: lineCount
  }
};
const template = readerSource('docs/code-atlas/atlas.html');
function insert(html, marker, value) {
  assert.equal(html.split(marker).length, 2, marker);
  return html.replace(marker, () => value);
}
let html = insert(template, '/* ATLAS_STYLE */', readerSource('docs/code-atlas/atlas.css'));
html = insert(html, '<!-- ATLAS_DATA -->', '<script id="inventory" type="application/json">' + JSON.stringify(data).replaceAll('<', '\\u003c') + '</script>');
html = insert(html, '/* ATLAS_READER */', readerSource('docs/code-atlas/reader.js'));
const dest = path.join(root, 'out', 'code-atlas.html');
fs.mkdirSync(path.dirname(dest), {
  recursive: true
});
fs.writeFileSync(dest, html);
console.log(JSON.stringify({
  snapshot: revision,
  ...data.stats,
  features: map.features.length,
  assemblies: map.sourceAssemblies.length,
  duplicates: exactGroups.length,
  objectKeyCandidates: duplicateKeys.length,
  parseNotes: parseNotes.length,
  bytes: Buffer.byteLength(html),
  output: dest
}));
