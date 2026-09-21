import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {append} from './log.mjs';
test('append preserves prior rows, single cells, and inert spreadsheet formulas',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'pstack log '));const file=path.join(dir,'nested','decisions.tsv');
 try{append(file,['frame','=bad()','why\nnext','@link','PASS'],new Date('2026-01-01T00:00:00Z'));append(file,['verify','fixed','good','file','PASS'],new Date('2026-01-02T00:00:00Z'));
 assert.equal(fs.readFileSync(file,'utf8'),"ts\tphase\tdecision\twhy\tevidence\tresult\n2026-01-01T00:00:00.000Z\tframe\t'=bad()\twhy next\t'@link\tPASS\n2026-01-02T00:00:00.000Z\tverify\tfixed\tgood\tfile\tPASS\n");
 fs.writeFileSync(file+'.lock','other');assert.throws(()=>append(file,['a','b','c','d','e']),/locked/);assert.equal(fs.readFileSync(file+'.lock','utf8'),'other');
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
