import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const files=[];
function collect(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
 if(['node_modules','.git','upstream','work'].includes(entry.name))continue;
 const p=path.join(dir,entry.name);
 if(entry.isDirectory())collect(p);else if(entry.name.endsWith('.test.mjs'))files.push(p);
}}
collect(path.join(root,'tests'));collect(path.join(root,'plugins'));
collect(path.join(root,'docs','acceptance'));
const r=spawnSync(process.execPath,['--test',...files],{cwd:root,stdio:'inherit'});
if(r.error)throw r.error;process.exitCode=r.status??1;
