// Copy previously reviewed local Claude Three.js skills to the Codex-native path.
// No network, no shell commands, no overwrites; safe to run repeatedly.
import { readdirSync, existsSync, cpSync, mkdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, '.claude', 'skills');
const destination = join(root, '.agents', 'skills');
const approved = [
  'threejs-game-director',
  'threejs-gameplay-systems',
  'threejs-aaa-graphics-builder',
  'threejs-game-ui-designer',
  'threejs-qa-release',
  'threejs-debug-profiler',
  'threejs-animation',
  'threejs-camera',
  'threejs-lighting',
  'threejs-loaders',
  'threejs-materials',
  'threejs-performance',
  'threejs-physics',
  'frontend-design',
  'webapp-testing'
];
const dryRun = process.argv.includes('--dry-run');
const unknown = process.argv.filter(arg => arg.startsWith('--') && arg !== '--dry-run');
if (unknown.length) {
  console.error('Unknown argument(s):', unknown.join(', '));
  process.exit(2);
}
if (!existsSync(source)) {
  console.error('No existing .claude/skills directory found; no changes made.');
  process.exit(1);
}
if (!dryRun) mkdirSync(destination, { recursive: true });
const present = new Set(readdirSync(source));
let copied = 0, skipped = 0;
for (const name of approved) {
  const from = join(source, name), to = join(destination, name);
  if (!present.has(name) || !existsSync(join(from, 'SKILL.md'))) {
    console.log('MISSING', name); continue;
  }
  if (existsSync(to)) {
    skipped++; console.log('SKIP (already exists)', name); continue;
  }
  if (dryRun) {
    console.log('WOULD COPY', name); continue;
  }
  cpSync(from, to, { recursive: true, errorOnExist: true, force: false });
  copied++; console.log('COPIED', name);
}
console.log(JSON.stringify({ dryRun, copied, skipped, destination }));
