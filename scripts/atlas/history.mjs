import { execFile, execFileSync } from 'node:child_process';
import { promisify } from 'node:util';
const git = promisify(execFile);
const publicRoot = '9d8df83adefdf44087943a0f211f257998333fcf';

// Only export commit subjects from the publication history. The source checkout
// has a separate history which is deliberately excluded, even for local builds.
export async function publishedLineHistory(root, revision, files) {
  try {
    const origin = execFileSync('git', ['remote', 'get-url', 'origin'], {
      cwd: root,
      stdio: ['ignore', 'pipe', 'ignore']
    }).toString().trim();
    if (!/^(?:https:\/\/github\.com\/|git@github\.com:)dahman0al0shahri\/madar(?:\.git)?\/?$/i.test(origin)) return null;
    execFileSync('git', ['merge-base', '--is-ancestor', publicRoot, revision], {
      cwd: root,
      stdio: 'ignore'
    });
  } catch {
    return null;
  }
  const subjects = {};
  const queue = Object.entries(files).filter(([, f]) => f.text && f.lines).values();
  async function worker() {
    for (const [name, entry] of queue) {
      const {
        stdout
      } = await git('git', ['blame', '--incremental', revision, '--', name], {
        cwd: root,
        maxBuffer: 64 * 1024 * 1024
      });
      const blocks = [];
      let sha;
      for (const row of stdout.split('\n')) {
        const header = /^([0-9a-f]{40}) \d+ (\d+) (\d+)$/.exec(row);
        if (header) {
          sha = header[1];
          blocks.push([Number(header[2]), Number(header[3]), sha]);
        } else if (row.startsWith('summary ')) subjects[sha] = row.slice(8);
      }
      entry.history = blocks.sort((a, b) => a[0] - b[0]);
    }
  }
  await Promise.all(Array.from({
    length: 4
  }, worker));
  return subjects;
}
