// Replace only unique, explicitly delimited composition slots. Never match executable code.
function fillHubSlots(source, values) {
  const declared = [...source.matchAll(/\/\* hub:([a-z-]+):start \*\//g)].map(match => match[1]);
  const expected = Object.keys(values);
  if (declared.length !== expected.length || declared.some(name => !expected.includes(name))) {
    throw Error('Hub slot inventory differs from supplied adapters');
  }
  for (const [name, value] of Object.entries(values)) {
    const start = '/* hub:' + name + ':start */', end = '/* hub:' + name + ':end */';
    if (source.split(start).length !== 2 || source.split(end).length !== 2) throw Error('Expected one hub slot: ' + name);
    const from = source.indexOf(start), to = source.indexOf(end);
    if (to < from) throw Error('Reversed hub slot: ' + name);
    source = source.slice(0, from) + value + source.slice(to + end.length);
  }
  if (/\/\* hub:[a-z-]+:(?:start|end) \*\//.test(source)) throw Error('Unresolved hub slot');
  return source;
}
module.exports = { fillHubSlots };
