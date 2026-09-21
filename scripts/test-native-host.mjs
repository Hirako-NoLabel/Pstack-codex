#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {spawn, execFileSync} from 'node:child_process';
import readline from 'node:readline';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const codex=process.argv[2] || 'codex';
const parent=path.resolve(process.argv[3] || path.join(root,'work','native-host'));
// Optional fourth argument selects a GitHub source for post-publication checks.
const githubSource=process.argv[4];
if(githubSource && !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(githubSource))throw new Error('GitHub source must be owner/repository');
const source=githubSource || root;
fs.mkdirSync(parent,{recursive:true});
const home=fs.mkdtempSync(path.join(parent,'fresh home 中文 '));
const env={...process.env,CODEX_HOME:home};
const evidence=[];
const run=(args) => {
  const output=execFileSync(codex,args,{cwd:root,env,encoding:'utf8',timeout:60000});
  evidence.push({args,output}); return output;
};
async function discover() {
  const child=spawn(codex,['app-server','--stdio'],{cwd:root,env,stdio:['pipe','pipe','pipe']});
  let id=0; const pending=new Map(); let stderr='';
  child.stderr.on('data',c=>stderr+=c);
  const lines=readline.createInterface({input:child.stdout});
  lines.on('line',line=>{let v;try{v=JSON.parse(line);}catch{return;}const p=pending.get(v.id);if(p){pending.delete(v.id);v.error?p.reject(new Error(JSON.stringify(v.error))):p.resolve(v.result);}});
  const call=(method,params) => new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});child.stdin.write(JSON.stringify({id:n,method,params})+'\n');});
  const timer=setTimeout(()=>{for(const p of pending.values())p.reject(new Error('app-server timeout '+stderr.slice(-1000)));child.kill();},45000);
  try {
    await call('initialize',{clientInfo:{name:'pstack-verification',version:'0.1.0'},capabilities:{experimentalApi:true}});
    child.stdin.write(JSON.stringify({method:'initialized'})+'\n');
    const result=await call('skills/list',{cwds:[root],forceReload:true});
    const entry=result.data.find(v=>path.resolve(v.cwd)===root) || result.data[0];
    const skills=entry.skills.filter(v=>v.pluginId?.startsWith('pstack-openai@') || v.path.includes('pstack-openai'));
    evidence.push({discovery:skills.map(v=>({name:v.name,enabled:v.enabled,pluginId:v.pluginId})),errors:entry.errors});
    return skills;
  } finally {clearTimeout(timer);lines.close();child.kill();}
}
try {
  run(['--version']);
  run(['plugin','marketplace','add',source,...(githubSource?['--ref','main']:[]),'--json']);
  run(['plugin','add','pstack-openai@personal','--json']);
  run(['plugin','list','--json']);
  const expected=fs.readdirSync(path.join(root,'plugins/pstack-openai/skills')).filter(n=>fs.existsSync(path.join(root,'plugins/pstack-openai/skills',n,'SKILL.md'))).sort();
  assert.deepEqual((await discover()).filter(v=>v.enabled).map(v=>v.name.replace(/^pstack-openai:/,'')).sort(),expected);
  if(githubSource)run(['plugin','marketplace','upgrade','personal','--json']);
  else run(['plugin','marketplace','add',root,'--json']);
  run(['plugin','add','pstack-openai@personal','--json']);
  run(['plugin','remove','pstack-openai@personal','--json']);
  assert.equal((await discover()).filter(v=>v.enabled).length,0);
  run(['plugin','add','pstack-openai@personal','--json']);
  assert.equal((await discover()).filter(v=>v.enabled).length,expected.length);
  evidence.push({result:'PASS',skill_count:expected.length,source,scope:githubSource
    ? 'Fresh CODEX_HOME, real GitHub marketplace fetch/refresh and skills/list lifecycle. Refresh without a source change does not prove a version-changing update; no model workflow execution.'
    : 'Fresh CODEX_HOME, real CLI and skills/list; local-source reload, not remote GitHub fetch or model workflow execution.'});
} catch(error) {evidence.push({result:'FAIL',error:error.stack});process.exitCode=1;}
finally {
  const report=path.join(parent,'native-host.json');
  fs.writeFileSync(report,JSON.stringify(evidence,null,2)+'\n');
  console.log(JSON.stringify({home,report,result:evidence.at(-1)}));
}
