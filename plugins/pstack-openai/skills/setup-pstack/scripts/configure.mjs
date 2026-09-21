import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

export const roleNames = ['feature','refactoring','bug_fix','perf_issue','hillclimb','judgment_and_prose','hardest_tasks','how_explorer','how_explainer','why_investigators','why_synthesizer','reflect_tooling','reflect_judgment','swarm_workers'];
export const panelNames = ['arena_runners','arena_cross_judge_pool','architect_runners','interrogate_reviewers'];
const inherited=()=>({model:'inherit-parent'});
export function defaults(){return {version:1,budget:'unlimited',roles:Object.fromEntries(roleNames.map(n=>[n,inherited()])),panels:Object.fromEntries(panelNames.map(n=>[n,Array.from({length:4},inherited)]))};}
export function validate(config,available={}) {
 if(config.version!==1) throw new Error('Unsupported configuration version');
 if(!['unlimited','large','medium','small'].includes(config.budget)) throw new Error('Unknown budget');
 for(const name of roleNames) if(!config.roles?.[name]) throw new Error(`Missing role ${name}`);
 for(const name of panelNames) if(!Array.isArray(config.panels?.[name])||!config.panels[name].length) throw new Error(`Empty or missing panel ${name}`);
 const entries=[...Object.values(config.roles),...Object.values(config.panels).flat()];
 for(const entry of entries){
  if(!entry||typeof entry.model!=='string') throw new Error('Every route needs a model');
  if(['inherit-parent','auto'].includes(entry.model)) {if(entry.reasoning_effort!==undefined) throw new Error('Inherited routing must inherit effort');continue;}
  if(!Object.hasOwn(available,entry.model)||!Array.isArray(available[entry.model])) throw new Error(`Model not advertised: ${entry.model}`);
  if(entry.reasoning_effort!==undefined&&!available[entry.model].includes(entry.reasoning_effort)) throw new Error(`Effort not advertised for ${entry.model}`);
 }
 return config;
}
export function applyBudget(config,budget,available={}){
 const out=structuredClone(config);out.budget=budget;
 const target={large:'xhigh',medium:'high',small:'medium'}[budget];
 if(budget!=='unlimited'&&!target) throw new Error('Unknown budget');
 const ladder=['none','minimal','low','medium','high','xhigh','max','ultra'];
 if(target) for(const e of [...Object.values(out.roles),...Object.values(out.panels).flat()]){
  if(['inherit-parent','auto'].includes(e.model))continue;
  const choices=available[e.model]?.filter(x=>ladder.includes(x)&&ladder.indexOf(x)<=ladder.indexOf(target));
  if(!choices?.length) throw new Error(`No supported effort at or below ${target} for ${e.model}`);
  e.reasoning_effort=choices.sort((a,b)=>ladder.indexOf(b)-ladder.indexOf(a))[0];
 }
 return validate(out,available);
}
export function save(repo,config,available={}){
 validate(config,available);
 const dir=path.resolve(repo,'.pstack');fs.mkdirSync(dir,{recursive:true});
 const target=path.join(dir,'config.json'),temp=path.join(dir,`.config-${process.pid}.tmp`);
 try{fs.writeFileSync(temp,JSON.stringify(config,null,2)+'\n',{flag:'wx'});fs.renameSync(temp,target);}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
 return target;
}
export function main(argv){
 const options={};for(let i=0;i<argv.length;i+=2){if(!['--repo','--input','--available','--budget'].includes(argv[i])||!argv[i+1])throw new Error('Usage: configure.mjs --repo PATH [--input JSON] [--available JSON] [--budget unlimited|large|medium|small]');options[argv[i]]=argv[i+1];}
 if(!options['--repo'])throw new Error('--repo is required');
 const p=path.resolve(options['--repo'],'.pstack/config.json');
 const config=options['--input']?JSON.parse(fs.readFileSync(options['--input'],'utf8')):fs.existsSync(p)?JSON.parse(fs.readFileSync(p,'utf8')):defaults();
 const available=options['--available']?JSON.parse(fs.readFileSync(options['--available'],'utf8')):{};
 const chosen=options['--budget']?applyBudget(config,options['--budget'],available):validate(config,available);
 console.log(save(options['--repo'],chosen,available));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){try{main(process.argv.slice(2));}catch(e){console.error(e.message);process.exitCode=1;}}
