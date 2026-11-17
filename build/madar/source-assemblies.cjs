const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// Ordered source parts retain the existing classic-script closures, CSS cascade
// and integration anchors. Parts are build inputs, never separately loaded code.
function checkedPath(root, relative) {
  assert(typeof relative === 'string' && relative && !relative.includes('\\') &&
    !relative.includes(':') && relative.split('/').every(p => p && p !== '.' && p !== '..'),
  'Invalid assembly path: ' + relative);
  let current = root;
  for (const segment of relative.split('/')) {
    current = path.join(current, segment);
    let stat;
    try { stat = fs.lstatSync(current); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    assert(!stat?.isSymbolicLink(), 'Assembly path is a link: ' + relative);
  }
  return current;
}

function assembleSources(root, assemblies) {
  assert(Array.isArray(assemblies) && assemblies.length, 'Source assemblies must be a nonempty list');
  const outputs = new Set();
  const allParts = new Set();
  // Validate/read the entire manifest before writing: a bad final entry must not
  // leave earlier outputs rebuilt from a partly valid configuration.
  const prepared = assemblies.map(({output, parts}) => {
    const destination = checkedPath(root, output);
    assert(!outputs.has(output), 'Duplicate assembly output: ' + output);
    outputs.add(output);
    assert(Array.isArray(parts) && parts.length && new Set(parts).size === parts.length,
      'Missing or duplicate source parts: ' + output);
    const buffers = parts.map(part => {
      assert(part.startsWith('modules/source-parts/'), 'Source part outside its maintained directory: ' + part);
      const file = checkedPath(root, part);
      assert(fs.lstatSync(file).isFile(), 'Source part is not a regular file: ' + part);
      allParts.add(part);
      return fs.readFileSync(file);
    });
    return {destination, content: Buffer.concat(buffers)};
  });
  for (const output of outputs) assert(!allParts.has(output), 'Assembly output cannot be an input: ' + output);
  for (const {destination, content} of prepared) {
    fs.mkdirSync(path.dirname(destination), {recursive: true});
    fs.writeFileSync(destination, content);
  }
  return prepared.length;
}

module.exports = function buildSourceAssemblies({site}) {
  const map = JSON.parse(fs.readFileSync(path.join(site, 'project-map.json'), 'utf8'));
  return assembleSources(site, map.sourceAssemblies);
};
module.exports.assembleSources = assembleSources;
