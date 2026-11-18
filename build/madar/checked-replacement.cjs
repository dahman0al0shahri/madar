function replaceExpected(text, file, label, anchor, replacement, expected = 1) {
  const parts = text.split(anchor);
  const found = parts.length - 1;
  if (found !== expected) {
    throw new Error(`${file}: ${label} expected ${expected} occurrence(s) of "${anchor}", found ${found}`);
  }
  return parts.join(replacement);
}

module.exports = replaceExpected;
