import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const rule='Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.';
const valid=`# Widget plan
A bounded widget change.
## How to read this
One box is one unit of work and names the evidence. Check a box only when its evidence exists.
The program runs playbooks/autopilot-stack.md.
${rule}
## Program checklist
### Arm the program
- [ ] Save the recorded goal and read the installed workflow. Set a 30-minute audit with a status message when required by the user.
### Spawn owners
- [ ] Assign one bounded owner.
### PR mechanics
- [ ] Prepare the authorized PR.
### Verdict and merge
- [ ] Verify the head.
### Boot recipe
- [ ] Run the actual CLI.
## Add widget (P1)
**Depends on.** None.
**Files.**
- [ ] Edit widget.ts.
**Build.**
- [ ] Implement widget.
**You see.**
- [ ] CLI returns widget.
**Verify, unit.** ${rule}
- [ ] Run node --test.
**Verify, live.** ${rule} Ten independent scenario lanes at the PR head.
${Array.from({length:10},(_,i)=>`- [ ] Lane ${i+1}. Exercise case ${i+1}. Save \`case-${i+1}.png\`. Pass when widget returns correctly.`).join('\n')}
**Verify, perf.** ${rule}
- [ ] Metric. Latency.
- [ ] Probe. Time trunk and head.
- [ ] Baseline. Record trunk first.
- [ ] Rule. Fail above 100 ms.
**Review gate.** None. P1 changes no interaction.
**Merge.**
- [ ] Hold for authorization.
## Close the program
- [ ] Report evidence.
## Appendix A. Prototype evidence
Existing widget conventions settle the shape.
`;
function check(content){const temp=fs.mkdtempSync(path.join(os.tmpdir(),'pstack-plan-'));try{const p=path.join(temp,'plan.md');fs.writeFileSync(p,content);return spawnSync(process.execPath,[path.join(dir,'check-plan.mjs'),p],{encoding:'utf8'});}finally{fs.rmSync(temp,{recursive:true,force:true});}}
test('complete plan passes without any fixed model name',()=>{const r=check(valid);assert.equal(r.status,0,r.stdout+r.stderr);assert.match(r.stdout,/1 PR sections, 0 problems/);});
test('missing live evidence or lanes fail the plan gate',()=>{assert.equal(check(valid.replace('Save `case-1.png`. ','')).status,1);assert.equal(check(valid.replace(/- \[ \] Lane 10[^\n]+\n/,'')).status,1);});
test('missing perf baseline and false review gate fail',()=>{assert.equal(check(valid.replace('- [ ] Baseline. Record trunk first.\n','')).status,1);assert.equal(check(valid.replace('**Review gate.** None. P1 changes no interaction.','**Review gate.** Operator review required.')).status,1);});
