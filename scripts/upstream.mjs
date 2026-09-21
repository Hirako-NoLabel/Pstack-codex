#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
function canonicalTarget(target) {
  const absolute=path.resolve(target);
  if(fs.existsSync(absolute)) return fs.realpathSync(absolute);
  const parent=path.dirname(absolute);
  return parent===absolute?absolute:path.join(canonicalTarget(parent),path.basename(absolute));
}
function inside(parent, child) {
  const relative=path.relative(parent,child);
  return relative==='' || (!relative.startsWith('..'+path.sep)&&relative!=='..'&&!path.isAbsolute(relative));
}
function outputPath(value) {
  const target=canonicalTarget(value);
  if(inside(path.join(root,'upstream'),target))throw new Error('Destination must be outside the preserved upstream snapshot');
  return target;
}
export function inventory(dir, prefix = '') {
  const result = {};
  for (const item of fs.readdirSync(dir, {withFileTypes: true}).sort((a,b) => a.name.localeCompare(b.name))) {
    if (['.git', 'node_modules'].includes(item.name)) continue;
    const key = prefix + item.name, full = path.join(dir, item.name);
    if (item.isSymbolicLink()) throw new Error(`Unexpected symlink: ${full}`);
    if (item.isDirectory()) Object.assign(result, inventory(full, key + '/'));
    else result[key] = crypto.createHash('sha256').update(fs.readFileSync(full)).digest('hex');
  }
  return result;
}
export function compare(before, after) {
  return [...new Set([...Object.keys(before), ...Object.keys(after)])].sort().flatMap(file => {
    const kind = !(file in before) ? 'added' : !(file in after) ? 'removed' : before[file] !== after[file] ? 'changed' : null;
    return kind ? [{file, kind, before: before[file] ?? null, after: after[file] ?? null}] : [];
  });
}
export function main(args) {
  const [command, source, destination] = args;
  const lock = JSON.parse(fs.readFileSync(path.join(root, 'upstream.lock.json'), 'utf8'));
  if (command === 'check') {
    if (!source) throw new Error('Provide a downloaded cursor/plugins/pstack directory');
    return compare(lock.files, inventory(path.resolve(source)));
  }
  if (command === 'fetch') {
    if (!source) throw new Error('Provide a NEW checkout path outside the shipped snapshot');
    const checkout = outputPath(source);
    if (fs.existsSync(checkout)) throw new Error('Fetch destination must not exist');
    execFileSync('git', ['clone', '--config', 'core.autocrlf=false', '--depth', '1', '--filter=blob:none', '--sparse', 'https://github.com/cursor/plugins.git', checkout], {stdio:'inherit'});
    execFileSync('git', ['-C', checkout, 'sparse-checkout', 'set', 'pstack'], {stdio:'inherit'});
    return {checkout, sha: execFileSync('git', ['-C', checkout, 'rev-parse', 'HEAD'], {encoding:'utf8'}).trim(), changes: compare(lock.files, inventory(path.join(checkout, 'pstack')))};
  }
  if (command === 'stage') {
    if (!source || !destination) throw new Error('Usage: upstream.mjs stage NEW_PSTACK NEW_REVIEW_DIRECTORY');
    const target = outputPath(destination);
    const origin = fs.realpathSync(path.resolve(source));
    if (inside(origin,target)) throw new Error('Review directory must be outside the source snapshot');
    if (fs.existsSync(target)) throw new Error('Review directory must not exist');
    const changes = compare(lock.files, inventory(path.resolve(source)));
    fs.mkdirSync(target, {recursive:true});
    fs.cpSync(source, path.join(target, 'candidate'), {recursive:true, filter:p => !p.split(path.sep).some(v => ['.git', 'node_modules'].includes(v))});
    fs.writeFileSync(path.join(target, 'changes.json'), JSON.stringify(changes, null, 2) + '\n');
    return {target, changes, next: 'Review each change against its migrated counterpart; update matrix and tests before updating the lock. No automatic overwrite.'};
  }
  throw new Error('Commands: check PATH | fetch NEW_CHECKOUT | stage PATH NEW_REVIEW_DIRECTORY');
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try { console.log(JSON.stringify(main(process.argv.slice(2)), null, 2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
