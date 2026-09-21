import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {parseWorktrees,parseStatus,classify,audit} from './worktree-audit.mjs';
test('parses NUL worktree paths with spaces unicode and Windows separators',()=>{
 const paths=['C:\\Users\\名字\\space repo','/tmp/space repo/分支'];
 assert.deepEqual(parseWorktrees(paths.map(p=>`worktree ${p}\0HEAD abc\0branch refs/heads/topic\0\0`).join('')).map(r=>r.path),paths);
});
test('preserves untracked ignored and rename paths',()=>{
 assert.deepEqual(parseStatus('R  new name\0old name\0?? secret notes\0!! cache\0'),{tracked:['new name'],untracked:['secret notes'],ignored:['cache']});
});
test('no unknown-use, untracked, ignored, dirty or active worktree becomes a deletion candidate',()=>{
 const clean={primary:false,locked:false,prunable:false,status:{tracked:[],untracked:[],ignored:[]},merged:true,activeKnown:true,active:false};
 assert.equal(classify(clean),'candidate-clean-merged');
 assert.equal(classify({...clean,activeKnown:false}),'verify-usage');
 assert.equal(classify({...clean,active:true}),'hold-active');assert.equal(classify({...clean,openPr:true}),'hold-open-pr');
 assert.equal(classify({...clean,status:{...clean.status,untracked:['work.txt']}}),'hold-untracked');
 assert.equal(classify({...clean,status:{...clean.status,ignored:['cache']}}),'hold-ignored');
 assert.equal(classify({...clean,status:{...clean.status,tracked:['x']}}),'hold-wip');
 assert.equal(classify({...clean,merged:false}),'review-unmerged');
});
test('real git worktree audit is read-only and handles a space and Unicode path',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'pstack worktree 空格 '));
 const repo=path.join(root,'repo'),wt=path.join(root,'work tree 分支');fs.mkdirSync(repo);
 const run=(...args)=>execFileSync('git',['-C',repo,...args],{encoding:'utf8',stdio:'pipe'});
 try{
  run('init','--initial-branch=main');run('config','user.name','PStack Test');run('config','user.email','test@example.invalid');
  fs.writeFileSync(path.join(repo,'tracked.txt'),'baseline');run('add','tracked.txt');run('commit','-m','baseline');run('worktree','add','-b','topic',wt);
  fs.writeFileSync(path.join(wt,'untracked 保留.txt'),'user work');
  const before=run('worktree','list','--porcelain','-z');const report=audit({repo,base:'main',activePaths:[],measureSize:true});
  assert.equal(fs.realpathSync.native(report.rows[1].path),fs.realpathSync.native(wt));assert.equal(report.rows[1].bucket,'hold-untracked');assert.ok(report.rows[1].sizeBytes>0);assert.equal(report.rows[1].ageDays,0);assert.equal(report.rows[1].remote,'no-remote');assert.equal(report.prLookup,'not-requested');
  const alias=path.join(root,'active alias');fs.symlinkSync(wt,alias,process.platform==='win32'?'junction':'dir');
  assert.equal(audit({repo,base:'main',activePaths:[alias]}).rows[1].bucket,'hold-active');
  assert.equal(run('worktree','list','--porcelain','-z'),before);assert.equal(fs.readFileSync(path.join(wt,'untracked 保留.txt'),'utf8'),'user work');
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
