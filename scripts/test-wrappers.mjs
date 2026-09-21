#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const options={};for(let i=2;i<process.argv.length;i+=2){if(!process.argv[i+1])throw new Error('Expected --codex PATH --pwsh PATH --bash PATH --work PATH');options[process.argv[i]]=process.argv[i+1];}
const codex=options['--codex']||'codex',pwsh=options['--pwsh']||'pwsh',bash=options['--bash']||(process.platform==='win32'?'C:/Program Files/Git/bin/bash.exe':'bash');
const work=path.resolve(options['--work']||path.join(root,'work','wrappers'));fs.mkdirSync(work,{recursive:true});
const runRoot=fs.mkdtempSync(path.join(work,'包装 smoke space '));
const evidence={schemaVersion:1,platform:process.platform,runRoot,codex,pwsh,bash,network:{gitProtocolAllowlist:'file',proxies:'http://127.0.0.1:9',remoteSources:'local filesystem only',claim:'No external source or model API requested; Git network protocols disabled and proxy-aware HTTP directed to a closed local port. Not a packet-capture claim.'},cases:[]};
const selection=options['--shell'];
if(selection&&!['powershell','git-bash'].includes(selection))throw new Error('--shell must be powershell or git-bash');
const previousPath=path.join(work,'wrapper-tests.json');
if(selection&&fs.existsSync(previousPath)){
 const previous=JSON.parse(fs.readFileSync(previousPath,'utf8'));
 const backup=path.join(work,'wrapper-tests-initial.json');if(!fs.existsSync(backup))fs.copyFileSync(previousPath,backup);
 evidence.cases=previous.cases.filter(c=>c.shell!==selection);evidence.preservedEarlierCases=evidence.cases.map(c=>c.shell);evidence.priorReport=backup;
}
const wrappers=['install.ps1','update.ps1','uninstall.ps1','install.sh','update.sh','uninstall.sh'];
const excluded=new Set(['node_modules','.git','upstream']);
function copy(source,target){fs.cpSync(source,target,{recursive:true,filter:p=>!path.relative(source,p).split(path.sep).some(part=>excluded.has(part))});}
function posix(p){return process.platform==='win32'?p.replaceAll('\\','/').replace(/^([A-Za-z]):/,(_,d)=>'/'+d.toLowerCase()):p;}
function runner(record,env){return (command,args,cwd)=>{
 const r=spawnSync(command,args,{cwd,env,encoding:'utf8',timeout:60000,maxBuffer:8*1024*1024});
 record.commands.push({command,args,cwd,exitCode:r.status,stdout:r.stdout??'',stderr:r.stderr??'',error:r.error?.message});
 if(r.error||r.status!==0)throw new Error(`${path.basename(command)} exited ${r.status}: ${(r.stderr||r.error?.message||'').slice(-1800)}`);
 return r.stdout;
};}
function expectedVersion(repo){return JSON.parse(fs.readFileSync(path.join(repo,'plugins/pstack-codex/.codex-plugin/plugin.json'),'utf8')).version;}
function installed(run,cwd,expected){
 const data=JSON.parse(run(codex,['plugin','list','--json'],cwd));
 const item=data.installed.find(x=>x.pluginId==='pstack-codex@personal'&&x.installed&&x.enabled);
 if(expected===null){assert.equal(item,undefined);return;}
 assert.ok(item,'plugin missing or disabled');assert.equal(item.version,expected);
}
for(const shell of (selection?[selection]:['powershell','git-bash'])){
 const dir=path.join(runRoot,shell),source=path.join(dir,'source 源'),clone=path.join(dir,'checkout 克隆'),home=path.join(dir,'codex home 隔离');
 fs.mkdirSync(source,{recursive:true});fs.mkdirSync(home,{recursive:true});
 const record={shell,source,clone,home,commands:[],stages:[]};evidence.cases.push(record);
 const env={...process.env,CODEX_HOME:home,GIT_CONFIG_GLOBAL:path.join(dir,'empty-gitconfig'),GIT_CONFIG_NOSYSTEM:'1',GIT_TERMINAL_PROMPT:'0',GIT_ALLOW_PROTOCOL:'file',HTTP_PROXY:'http://127.0.0.1:9',HTTPS_PROXY:'http://127.0.0.1:9',ALL_PROXY:'http://127.0.0.1:9',NO_PROXY:'',http_proxy:'http://127.0.0.1:9',https_proxy:'http://127.0.0.1:9',all_proxy:'http://127.0.0.1:9',no_proxy:'',PATH:path.dirname(codex)+path.delimiter+process.env.PATH};
 for(const key of ['OPENAI_API_KEY','CODEX_API_KEY','GITHUB_TOKEN','GH_TOKEN'])delete env[key];
 fs.writeFileSync(env.GIT_CONFIG_GLOBAL,'');const run=runner(record,env);
 const stage=(name,fn)=>{try{fn();record.stages.push({name,result:'PASS'});}catch(error){record.stages.push({name,result:'FAIL',error:error.stack});}};
 const wrap=name=>shell==='powershell'?run(pwsh,['-NoLogo','-NoProfile','-NonInteractive','-File',path.join(clone,`${name}.ps1`)],clone):run(bash,['--noprofile','--norc','-c','exec sh "$1"','pstack-wrapper',posix(path.join(clone,`${name}.sh`))],clone);
 stage('prepare-isolated-local-clone',()=>{
  copy(path.join(root,'plugins'),path.join(source,'plugins'));copy(path.join(root,'.agents'),path.join(source,'.agents'));
  for(const name of wrappers)fs.copyFileSync(path.join(root,name),path.join(source,name));
  if(fs.existsSync(path.join(root,'.gitattributes')))fs.copyFileSync(path.join(root,'.gitattributes'),path.join(source,'.gitattributes'));
  run('git',['init','--initial-branch=main'],source);run('git',['config','user.name','Wrapper Acceptance'],source);run('git',['config','user.email','acceptance@pstack.invalid'],source);run('git',['add','.'],source);run('git',['commit','-m','local fixture baseline'],source);
  run('git',['clone','--local',source,clone],dir);
  const remote=run('git',['remote','get-url','origin'],clone).trim();assert.equal(path.resolve(remote),source);
  record.baselineHead=run('git',['rev-parse','HEAD'],clone).trim();record.initialVersion=expectedVersion(clone);
 });
 if(!fs.existsSync(path.join(clone,'.git')))continue;
 stage('install',()=>{wrap('install');installed(run,clone,record.initialVersion);});
 stage('source-version-commit',()=>{
  const manifest=path.join(source,'plugins/pstack-codex/.codex-plugin/plugin.json');const value=JSON.parse(fs.readFileSync(manifest,'utf8'));const parts=value.version.split('.').map(Number);assert.ok(parts.length===3&&parts.every(Number.isSafeInteger));parts[2]++;value.version=parts.join('.');record.updatedVersion=value.version;
  fs.writeFileSync(manifest,JSON.stringify(value,null,2)+'\n');fs.writeFileSync(path.join(source,'plugins/pstack-codex/wrapper-acceptance.txt'),value.version+'\n');
  run('git',['add','plugins/pstack-codex/.codex-plugin/plugin.json','plugins/pstack-codex/wrapper-acceptance.txt'],source);run('git',['commit','-m','local version update'],source);record.updatedHead=run('git',['rev-parse','HEAD'],source).trim();
 });
 stage('update-fast-forward-and-installed-version',()=>{
  wrap('update');assert.equal(run('git',['rev-parse','HEAD'],clone).trim(),record.updatedHead);run('git',['merge-base','--is-ancestor',record.baselineHead,record.updatedHead],clone);installed(run,clone,record.updatedVersion);
  const cache=path.join(home,'plugins/cache/personal/pstack-codex',record.updatedVersion,'wrapper-acceptance.txt');assert.equal(fs.readFileSync(cache,'utf8').trim(),record.updatedVersion);
 });
 stage('uninstall',()=>{wrap('uninstall');installed(run,clone,null);});
 stage('reinstall',()=>{wrap('install');installed(run,clone,expectedVersion(clone));});
 stage('clone-remains-clean',()=>{assert.equal(run('git',['status','--porcelain'],clone).trim(),'');});
 record.result=record.stages.every(s=>s.result==='PASS')?'PASS':'FAIL';
}
evidence.result=evidence.cases.every(c=>c.result==='PASS')?'PASS':'FAIL';
fs.writeFileSync(path.join(work,'wrapper-tests.json'),JSON.stringify(evidence,null,2)+'\n');
const lines=['# Installation wrapper acceptance','',`Result: ${evidence.result}. Platform: ${process.platform}.`,'','Real PowerShell and Git Bash wrappers ran against disposable local Git sources, dedicated clones, and isolated CODEX_HOME directories containing spaces and Chinese characters. Source commits changed the plugin version before update. Git Bash on Windows demonstrates shell compatibility only, not a native Linux or macOS run.','',...evidence.cases.flatMap(c=>[`## ${c.shell}`,'',...c.stages.map(s=>`- ${s.name}: ${s.result}${s.error?' — '+s.error.split('\n')[0]:''}`),'']), 'All commands and raw outputs are in wrapper-tests.json. No wrapper or installed user configuration was edited. Git allows only the file protocol; API keys are removed from child environments, no model calls are made, and HTTP proxy variables point to a closed loopback port. No external source or model API was requested. This is not a packet-capture assertion.'];
fs.writeFileSync(path.join(work,'wrapper-tests.md'),lines.join('\n')+'\n');
console.log(JSON.stringify({result:evidence.result,report:path.join(work,'wrapper-tests.json'),cases:evidence.cases.map(c=>({shell:c.shell,result:c.result,stages:c.stages}))}));if(evidence.result!=='PASS')process.exitCode=1;
