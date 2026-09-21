import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {main} from '../scripts/upstream.mjs';
test('upstream staging rejects recursive destination before touching source',t=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'pstack-stage-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
 fs.writeFileSync(path.join(dir,'README.md'),'candidate');
 assert.throws(()=>main(['stage',dir,path.join(dir,'nested')]),/outside/);
 assert.deepEqual(fs.readdirSync(dir),['README.md']);
});
