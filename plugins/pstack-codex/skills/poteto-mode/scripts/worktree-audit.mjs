#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const git=(repo,args)=>execFileSync('git',['-C',repo,...args],{encoding:'utf8',stdio:['ignore','pipe','pipe']});
export function parseWorktrees(raw){
 const result=[];let row=null;
 for(const token of raw.split('\0')){
  if(token.startsWith('worktree ')){if(row)result.push(row);row={path:token.slice(9),head:'',branch:'',locked:false,prunable:false};}
  else if(row&&token.startsWith('HEAD '))row.head=token.slice(5);
  else if(row&&token.startsWith('branch '))row.branch=token.slice(7);
  else if(row&&(token==='locked'||token.startsWith('locked ')))row.locked=true;
  else if(row&&(token==='prunable'||token.startsWith('prunable ')))row.prunable=true;
 }
 if(row)result.push(row);return result;
}
export function parseStatus(raw){
 const result={tracked:[],untracked:[],ignored:[]};const tokens=raw.split('\0');
 for(let i=0;i<tokens.length;i++){
  const token=tokens[i];if(!token)continue;
  if(token.length<3)throw new Error('malformed git status record');
  const code=token.slice(0,2),filename=token.slice(3);
  if(code==='??')result.untracked.push(filename);
  else if(code==='!!')result.ignored.push(filename);
  else {result.tracked.push(filename);if(/[RC]/.test(code))i++;}
 }
 return result;
}
export function classify({primary,locked,prunable,status,merged,activeKnown,active,openPr=false}){
 if(primary)return 'hold-primary';if(locked)return 'hold-locked';if(prunable)return 'review-missing';
 if(active)return 'hold-active';if(openPr)return 'hold-open-pr';if(status.tracked.length)return 'hold-wip';
 if(status.untracked.length)return 'hold-untracked';if(status.ignored.length)return 'hold-ignored';
 if(!activeKnown)return 'verify-usage';if(!merged)return 'review-unmerged';return 'candidate-clean-merged';
}
export function directorySize(directory){
 let bytes=0;for(const item of fs.readdirSync(directory,{withFileTypes:true})){
  const child=path.join(directory,item.name);if(item.isSymbolicLink())continue;
  if(item.isDirectory())bytes+=directorySize(child);else if(item.isFile())bytes+=fs.statSync(child).size;
 }return bytes;
}
export function audit({repo,base,activePaths,measureSize=false,withPrs=false},runner=git){
 const worktrees=parseWorktrees(runner(repo,['worktree','list','--porcelain','-z']));
 if(!worktrees.length)throw new Error('no worktrees returned');
 let reference=base;
 if(!reference){try{reference=runner(repo,['symbolic-ref','--quiet','refs/remotes/origin/HEAD']).trim();}catch{throw new Error('default remote base unknown; pass --base <verified-ref>');}}
 runner(repo,['rev-parse','--verify',`${reference}^{commit}`]);
 const normalize=value=>{const normalized=path.resolve(value);return process.platform==='win32'?normalized.toLowerCase():normalized;};
 const activeSet=activePaths===undefined?null:new Set(activePaths.map(normalize));
 let prs=[],prLookup=withPrs?'available':'not-requested';
 if(withPrs){try{prs=JSON.parse(execFileSync('gh',['pr','list','--state','all','--author','@me','--limit','1000','--json','number,state,headRefName,headRefOid'],{cwd:repo,encoding:'utf8',stdio:['ignore','pipe','pipe']}));if(!Array.isArray(prs))throw new Error('invalid PR list');if(prs.length===1000)prLookup='possibly-truncated';}catch{prLookup='unavailable';}}

 return {schemaVersion:1,repo:path.resolve(repo),base:reference,readOnly:true,prLookup,usageEvidence:activeSet===null?'unknown':'explicit-active-path-list',rows:worktrees.map((wt,index)=>{
  try{
   const status=parseStatus(runner(wt.path,['status','--porcelain=v1','-z','--untracked-files=all','--ignored']));
   let merged=false;try{runner(repo,['merge-base','--is-ancestor',wt.head,reference]);merged=true;}catch{}
   const active=activeSet?.has(normalize(wt.path))??false;
   let ageDays=null,remote='unknown';
   try{const epoch=Number(runner(wt.path,['log','-1','--format=%ct','HEAD']).trim());if(Number.isFinite(epoch))ageDays=Math.max(0,Math.floor((Date.now()/1000-epoch)/86400));}catch{}
   const branch=wt.branch.replace(/^refs\/heads\//,'');
   if(!branch)remote='detached';else try{const remoteHead=runner(wt.path,['rev-parse','--verify',`refs/remotes/origin/${branch}`]).trim();remote=remoteHead===wt.head?'pushed':`ahead:${runner(wt.path,['rev-list','--count',`refs/remotes/origin/${branch}..HEAD`]).trim()}`;}catch{remote='no-remote';}
   let sizeBytes=null,sizeError=null;if(measureSize){try{sizeBytes=directorySize(wt.path);}catch(error){sizeError=error.message;}}
   const matchingPrs=prs.filter(pr=>pr.headRefName===branch);
   const openPr=matchingPrs.some(pr=>pr.state==='OPEN');
   if(matchingPrs.some(pr=>pr.state==='MERGED'&&pr.headRefOid===wt.head))merged=true;

   return {...wt,status,merged,active,ageDays,remote,sizeBytes,sizeError,prs:matchingPrs,bucket:classify({...wt,primary:index===0,status,merged,activeKnown:activeSet!==null,active,openPr})};
  }catch(error){return {...wt,bucket:'hold-unreadable',error:error.message};}
 })};
}
export function main(argv){
 let repo='.',base,activePaths,measureSize=false,withPrs=false;
 for(let i=0;i<argv.length;i++){
  const arg=argv[i];if(arg==='--size'){measureSize=true;continue;}if(arg==='--with-prs'){withPrs=true;continue;}if(i===0&&!arg.startsWith('--')){repo=arg;continue;}if(arg==='--help'){console.log('node worktree-audit.mjs [--repo PATH] --base REF [--active-file JSON] [--size] [--with-prs]\nRead-only. JSON is an explicit list of active worktree paths; absent usage evidence never yields a cleanup candidate. No deletion or git fetch occurs. Optional --with-prs performs a read-only GitHub query; optional --size measures disk bytes without following symlinks.');return;}
  if(!['--repo','--base','--active-file'].includes(arg)||!argv[i+1])throw new Error(`invalid option ${arg}`);
  const value=argv[++i];if(arg==='--repo')repo=value;else if(arg==='--base')base=value;else {activePaths=JSON.parse(fs.readFileSync(value,'utf8'));if(!Array.isArray(activePaths)||activePaths.some(p=>typeof p!=='string'))throw new Error('active-file must be a JSON string array');}
 }
 console.log(JSON.stringify(audit({repo,base,activePaths,measureSize,withPrs}),null,2));
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){try{main(process.argv.slice(2));}catch(error){console.error(error.message);process.exitCode=1;}}
