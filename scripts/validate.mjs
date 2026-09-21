#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {inventory, compare} from './upstream.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const plugin=path.join(root,'plugins/pstack-openai');
const failures=[];
const check=(condition,message)=>{if(!condition)failures.push(message);};
const lock=JSON.parse(fs.readFileSync(path.join(root,'upstream.lock.json'),'utf8'));
check(compare(lock.files,inventory(path.join(root,'upstream/pstack'))).length===0,'Upstream snapshot differs from pinned hash inventory');
const manifest=JSON.parse(fs.readFileSync(path.join(plugin,'.codex-plugin/plugin.json'),'utf8'));
check(manifest.name==='pstack-openai'&&manifest.skills==='./skills/','Plugin name/skills path');
const market=JSON.parse(fs.readFileSync(path.join(root,'.agents/plugins/marketplace.json'),'utf8'));
check(market.plugins.some(p=>p.name===manifest.name&&p.source.path==='./plugins/pstack-openai'),'Marketplace must resolve plugin');
const originalSkills=Object.keys(lock.files).filter(p=>/^skills\/[^/]+\/SKILL\.md$/.test(p));
const actualSkills=fs.readdirSync(path.join(plugin,'skills')).filter(p=>fs.existsSync(path.join(plugin,'skills',p,'SKILL.md')));
check(originalSkills.length===actualSkills.length,'Main skill count changed');
for(const name of actualSkills){
 const file=path.join(plugin,'skills',name,'SKILL.md');const text=fs.readFileSync(file,'utf8');
 const front=text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
 check(!!front,`${name}: frontmatter missing`);
 check(new RegExp(`^name: ${name}$`,'m').test(front?.[1]||''),`${name}: name must equal slug`);
 check(/^description: .+/m.test(front?.[1]||''),`${name}: description missing`);
 check(!/^(mode|reminder|disable-model-invocation|paths|icon|color):/m.test(front?.[1]||''),`${name}: Cursor frontmatter remains`);
}
for(const file of Object.keys(lock.files)){
 if(/^(skills|agents|automations|docs|assets)\//.test(file)) check(fs.existsSync(path.join(plugin,file)),`Missing migrated counterpart ${file}`);
}
let links=0;
for(const relative of Object.keys(inventory(plugin)).filter(p=>p.endsWith('.md'))){
 const file=path.join(plugin,relative);
 const text=fs.readFileSync(file,'utf8').replace(/```[\s\S]*?```/g,'');
 for(const match of text.matchAll(/\[[^\]\n]+\]\(([^)\n]+)\)/g)){
  const link=match[1].replace(/^<|>$/g,'').split('#')[0];
  if(!link||/^[a-z][a-z0-9+.-]*:/i.test(link)||link.includes('<')||link.includes('$')||link.startsWith('/'))continue;
  links++;check(fs.existsSync(path.resolve(path.dirname(file),decodeURIComponent(link))),`${relative}: broken link ${link}`);
 }
}
const result={skills:actualSkills.length,playbooks:fs.readdirSync(path.join(plugin,'skills/poteto-mode/playbooks')).filter(p=>p.endsWith('.md')).length,upstream_files:Object.keys(lock.files).length,links_checked:links,failures};
console.log(JSON.stringify(result,null,2));if(failures.length)process.exitCode=1;
