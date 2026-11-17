const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

// Preserve input bytes and existing replacement semantics. Do not normalize
// template whitespace here: course HTML and JavaScript depend on it.
module.exports = function createBuildContext(site) {
  return {
    site,
    path,
    execFileSync,
    read: file => fs.readFileSync(path.join(site, file), 'utf8'),
    write: (file, content) => fs.writeFileSync(path.join(site, file), content),
    replace(source, anchor, replacement) {
      if (!source.includes(anchor)) {
        throw new Error('Missing integration anchor: ' + anchor.slice(0, 100));
      }
      return source.replace(anchor, () => replacement);
    },
  };
};
