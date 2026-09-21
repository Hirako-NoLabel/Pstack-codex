import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
export function clean(value){const text=String(value).replace(/[\t\n\r]/g,' ');return /^[=+@-]/.test(text)?"'"+text:text;}
export function append(file,fields,now=new Date()){
 if(fields.length!==5)throw new Error('Expected phase, decision, why, evidence, result');
 fs.mkdirSync(path.dirname(path.resolve(file)),{recursive:true});
 const lock=file+'.lock';let fd;
 try{fd=fs.openSync(lock,'wx');}catch(e){if(e.code==='EEXIST')throw new Error(`Log is locked: ${lock}. Check its owner before retrying; never remove an active lock.`);throw e;}
 try{fs.writeFileSync(fd,String(process.pid));if(!fs.existsSync(file)||fs.statSync(file).size===0)fs.appendFileSync(file,'ts\tphase\tdecision\twhy\tevidence\tresult\n');
 fs.appendFileSync(file,[now.toISOString(),...fields.map(clean)].join('\t')+'\n');
 }finally{fs.closeSync(fd);fs.unlinkSync(lock);}
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){try{const [file,...fields]=process.argv.slice(2);if(!file)throw new Error('Usage: log.mjs FILE PHASE DECISION WHY EVIDENCE RESULT');append(file,fields);}catch(e){console.error(e.message);process.exitCode=1;}}
