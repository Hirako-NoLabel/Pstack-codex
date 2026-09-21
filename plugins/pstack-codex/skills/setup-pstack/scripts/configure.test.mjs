import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {defaults,validate,applyBudget,save} from './configure.mjs';
test('fresh install and reconfiguration preserve independent panel entries and saved roles',()=>{
 const repo=fs.mkdtempSync(path.join(os.tmpdir(),'pstack config '));
 try{const config=defaults();config.roles.feature={model:'test-model',reasoning_effort:'max'};
 const available={'test-model':['low','medium','high','max']};
 const chosen=applyBudget(config,'large',available);assert.equal(chosen.roles.feature.reasoning_effort,'high');
 const file=save(repo,chosen,available);save(repo,chosen,available);const actual=JSON.parse(fs.readFileSync(file));
 assert.deepEqual(actual.roles.feature,{model:'test-model',reasoning_effort:'high'});assert.equal(actual.panels.arena_runners.length,4);assert.deepEqual(actual.roles.bug_fix,{model:'inherit-parent'});
 }finally{fs.rmSync(repo,{recursive:true,force:true});}
});
test('unavailable model or effort and malformed panels are rejected',()=>{
 let c=defaults();c.roles.feature={model:'invented'};assert.throws(()=>validate(c),/not advertised/);
 c=defaults();c.roles.feature={model:'test-model',reasoning_effort:'max'};assert.throws(()=>validate(c,{'test-model':['high']}),/Effort/);
 c=defaults();c.panels.interrogate_reviewers=[];assert.throws(()=>validate(c),/panel/);
 c=defaults();c.roles.feature.reasoning_effort='high';assert.throws(()=>validate(c),/inherit effort/);
});
