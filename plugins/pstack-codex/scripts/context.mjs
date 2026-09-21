#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';

function git(repo, args) {
  return execFileSync('git', ['-C', repo, ...args], {encoding: 'utf8', maxBuffer: 4 * 1024 * 1024}).trim();
}
function projectRoot(repo) { return fs.realpathSync(git(path.resolve(repo), ['rev-parse', '--show-toplevel'])); }
function readOptional(file) { return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null; }
function statePath(repo, create = false) {
  const dir = path.join(repo, '.pstack');
  if (fs.existsSync(dir) && fs.lstatSync(dir).isSymbolicLink()) throw new Error('Refusing linked state directory');
  if (create) fs.mkdirSync(dir, {recursive: true});
  const file = path.join(dir, 'state.json');
  if (fs.existsSync(file) && fs.lstatSync(file).isSymbolicLink()) throw new Error('Refusing linked state file');
  return file;
}
export function validateState(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Checkpoint must be an object');
  for (const key of ['goal', 'phase', 'next_action']) {
    if (typeof value[key] !== 'string' || !value[key].trim()) throw new Error(`Missing ${key}`);
  }
  for (const key of ['decisions', 'evidence', 'blockers']) {
    if (!Array.isArray(value[key]) || value[key].some(v => typeof v !== 'string')) throw new Error(`${key} must be a string array`);
  }
  return Object.fromEntries(['goal', 'phase', 'next_action', 'decisions', 'evidence', 'blockers'].map(k => [k, value[k]]));
}
export function snapshot(repo, readState = true) {
  const root = projectRoot(repo);
  let head = null;
  try { head = git(root, ['rev-parse', 'HEAD']); } catch {}
  const raw = readState ? readOptional(statePath(root)) : null;
  let state = null, state_error = null;
  try { state = raw === null ? null : JSON.parse(raw); }
  catch (error) { state_error = `Invalid checkpoint JSON: ${error.message}`; }
  return {
    schema_version: 1, root, head, branch: head ? git(root, ['rev-parse', '--abbrev-ref', 'HEAD']) : git(root, ['symbolic-ref', '--short', 'HEAD']),
    status: git(root, ['status', '--short']),
    recent_commits: head ? git(root, ['log', '-15', '--format=%h %s']) : '',
    instructions: readOptional(path.join(root, 'AGENTS.md')),
    handoff: readOptional(path.join(root, 'HANDOFF.md')),
    state, state_error, state_matches_head: state ? state.head === head : null,
    history_coverage: 'Repository only. Native task history must be queried separately when available and in scope.'
  };
}
export function checkpoint(repo, input) {
  const data = validateState(input);
  const current = snapshot(repo, false);
  const file = statePath(current.root, true);
  const result = {...data, schema_version: 1, head: current.head, branch: current.branch, updated_at: new Date().toISOString()};
  const temp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(result, null, 2) + '\n', {flag: 'wx'});
  fs.renameSync(temp, file);
  return result;
}
export function main(argv) {
  const [command, ...rest] = argv;
  const options = {};
  for (let i = 0; i < rest.length; i += 2) {
    if (!['--repo', '--input'].includes(rest[i]) || !rest[i + 1]) throw new Error('Usage: context.mjs snapshot|recall|checkpoint --repo PATH [--input JSON_FILE]');
    options[rest[i].slice(2)] = rest[i + 1];
  }
  if (!options.repo) throw new Error('--repo is required');
  if (command === 'checkpoint') {
    if (!options.input) throw new Error('--input is required');
    return checkpoint(options.repo, JSON.parse(fs.readFileSync(options.input, 'utf8')));
  }
  if (command === 'snapshot' || command === 'recall') return snapshot(options.repo);
  throw new Error('Unknown context command');
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try { console.log(JSON.stringify(main(process.argv.slice(2)), null, 2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
