import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {snapshot, checkpoint} from '../plugins/pstack-openai/scripts/context.mjs';
import {inventory, compare} from '../scripts/upstream.mjs';

test('checkpoint survives a fresh read and exposes stale commit claims with Chinese and spaced paths', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pstack 中文 space '));
  t.after(() => fs.rmSync(dir, {recursive:true, force:true}));
  const git = (...args) => execFileSync('git', ['-C', dir, ...args], {encoding:'utf8'});
  git('init', '-q'); git('config','user.name','Fixture'); git('config','user.email','fixture@example.invalid');
  fs.writeFileSync(path.join(dir,'AGENTS.md'),'Keep investigation read-only.');
  git('add','.'); git('commit','-qm','baseline');
  const input = {goal:'修复重复请求', phase:'red', decisions:['one owner'], evidence:['failing regression'], blockers:[], next_action:'implement coalescing'};
  checkpoint(dir, input);
  assert.equal(snapshot(dir).state.goal, input.goal);
  assert.equal(snapshot(dir).state_matches_head,true);
  fs.writeFileSync(path.join(dir,'feature.txt'),'changed'); git('add','feature.txt'); git('commit','-qm','change');
  assert.equal(snapshot(dir).state_matches_head,false);
  fs.writeFileSync(path.join(dir,'.pstack/state.json'),'{broken');
  assert.match(snapshot(dir).state_error,/Invalid checkpoint/);
  checkpoint(dir,input);
  assert.equal(snapshot(dir).state.goal,input.goal);
  assert.throws(() => checkpoint(dir,{goal:'missing fields'}),/Missing phase/);
});
test('upstream comparison reports additions, deletions and modifications', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(),'pstack-upstream-'));
  t.after(() => fs.rmSync(dir,{recursive:true,force:true}));
  fs.writeFileSync(path.join(dir,'a'),'old'); fs.writeFileSync(path.join(dir,'b'),'same');
  const before=inventory(dir);
  fs.writeFileSync(path.join(dir,'a'),'new'); fs.unlinkSync(path.join(dir,'b')); fs.writeFileSync(path.join(dir,'c'),'added');
  assert.deepEqual(compare(before,inventory(dir)).map(x => [x.file,x.kind]),[['a','changed'],['b','removed'],['c','added']]);
});
