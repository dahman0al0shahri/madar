import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
process.chdir(root);
for (const args of [['scripts/repository-guard.mjs'], ['--test', 'tests/repository-guard.test.mjs', 'tests/publication-baseline.test.mjs']]) {
  const result = spawnSync(process.execPath, args, { cwd: root, stdio: 'inherit', timeout: 60000 });
  if (result.status !== 0) process.exit(1);
}
// Deliberately scoped to the maintained repository documentation.
const documents = [
  'README.md', 'CONTRIBUTING.md', 'SECURITY.md', 'docs/README.md',
  'docs/START_HERE.md', 'docs/DEVELOPMENT.md', 'docs/ARCHITECTURE.md',
  'docs/RIGHTS.md', 'docs/RELEASE_READINESS.md', 'docs/COURSE_INTEGRATION.md',
  'CHANGELOG.md', 'AGENTS.md', 'docs/MAINTENANCE.md', 'docs/templates/RELEASE_NOTES.md',
  'docs/GITHUB_WORKFLOW.md', 'docs/REPOSITORY_REPORT.md',
  'docs/STORY.md',
];
let links = 0;
const failures = [];
for (const file of documents) {
  const source = fs.readFileSync(file, 'utf8').replace(/```[\s\S]*?```/g, '');
  const refs = [
    ...[...source.matchAll(/\]\(([^)]+)\)/g)].map(m => m[1]),
    ...[...source.matchAll(/(?:src|href)="([^"]+)"/g)].map(m => m[1]),
  ];
  for (const ref of refs) {
    if (/^(?:[a-z]+:|#|\/\/)/i.test(ref)) continue;
    const target = path.resolve(path.dirname(file), decodeURIComponent(ref.split('#')[0]));
    links++;
    if (!fs.existsSync(target)) failures.push(file + ': missing local target ' + ref);
  }
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('PASS: ' + documents.length + ' documentation files; ' + links + ' local targets exist. External URLs and fragments are not checked.');
const tests = [
  'device-grounding.cjs', 'help-catalog-audit.cjs', 'help-placement.cjs',
  'lab-hardware.cjs', 'network-frame-lifecycle.cjs',
];
for (const test of tests) {
  console.log('\nRunning ' + test);
  const result = spawnSync(process.execPath, ['tests/' + test], {
    cwd: root, stdio: 'inherit', timeout: 120000,
  });
  if (result.error || result.status !== 0) {
    console.error(result.error?.message ?? ('Failed: ' + test));
    process.exit(1);
  }
}
console.log('\nPASS: repository documentation and all five existing test files.');
