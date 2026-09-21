import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const upstream=path.join(root,'upstream/pstack');
const rows=[];
const partialSkills=new Set(['architect','arena','automate-me','create-verification-skill','interrogate','maintain-verification-skill','recall','reflect','swarm','why']);
const nativeSkills=new Set(['bro','tdd','technical-writing','typescript-best-practices','unslop']);
const sampled=new Set(['poteto-mode','tdd','how','architect','arena','interrogate','recall','reflect','bug-fix','feature','investigation']);
const skillNotes={
 'make-bot-ui':'Native Cursor/Grok routine wake and secret card have no verified OpenAI equivalent. Complete UI/server flow retained for an explicitly configured external endpoint; native wake remains D.',
 'recall':'Use scoped native history when exposed, otherwise Git + AGENTS + handoff + checkpoint. Complete chat-history access cannot be guaranteed.',
 'reflect':'Preserve three review lenses and approval before rule changes. Acceptance ran three parallel native reviewers plus separate synthesizer using exact templates and a labelled digest; same model, no durable edits applied.',
 'automate-me':'Preserve evidence-mining/interview/incremental personal-mode flow. Restricted history reduces mining coverage; no full personalization acceptance run.',
 'architect':'Preserve usage-first independent designs and synthesis. Four independent same-model candidates, separate judge, parent synthesis and implemented fixture with 11 passing checks; model-family diversity and conditional scrap remain untested.',
 'arena':'Preserve same brief, isolated candidates, hidden rubric, base/graft and cross-judge. Four independent same-model directory-isolated candidates, private rubric, separate judge, base/graft and 11 passing synthesized-fixture checks executed; cross-model diversity and cloud isolation remain conditional.',
 'interrogate':'Native independent role reviewers and lead adjudication; acceptance used independent same-model reviewers, not upstream multi-family panel.',
 'swarm':'Native bounded workers preserve coverage and report dropped workers. No fake cloud Task environment or unlimited nesting.',
 'why':'Discover actual connectors for seven source categories. Missing services explicitly reported; no claim that unavailable sources were searched.',
 'create-verification-skill':'Preserve launch/doctor/drive/evidence/cleanup and feature maps. Actual target control/recording tool required.',
 'maintain-verification-skill':'Retain source wave and one live pass, editing only verify skill. All-features UI pass depends on target app tools.',
 'setup-pstack':'PStack-owned project JSON with validated model + separate effort, inheritance defaults, panel length and budget preserved. No fabricated Codex rule schema.',
 'show-me-your-work':'Portable Node append-only TSV with formula escaping and exclusive lock; Bash wrapper. Cross-family trail review conditional.',
 'poteto-mode':'All 23 routes and principles retained, sticky conversation instruction, native role dispatch and checkpoints. Read-only investigation preserved; host limits explicit.'
};
const partialBooks=new Set(['autonomous-run','autopilot-full','autopilot-stack','babysit','eval','hillclimb','orchestrate','runtime-forensics','session-pickup','shipping','trace-forensics','visual-parity','worktree-cleanup']);
function description(file){const s=fs.readFileSync(file,'utf8');const m=s.match(/^description:\s*(.*)$/m);return (m?.[1]||'Preserve the named upstream workflow and its evidence gates.').replace(/^['"]|['"]$/g,'').replaceAll('|','/');}
function add(kind,name,source,classification,purpose,note){
 const validation=sampled.has(name)?'Sampled runtime acceptance; limitations in VERIFICATION.md':name==='setup-pstack'||name==='show-me-your-work'||name==='multi-phase-plan'||name==='worktree-cleanup'||name==='orchestrate'||name==='babysit'?'Helper/runtime fixtures pass; full workflow untested':'Audited and packaged; full workflow untested';
 rows.push({id:`${kind}:${name}`,kind,name,source,classification,purpose,cursor:kind==='playbook'?'Cursor mode dispatch + Task/model/control/loop where referenced':kind==='agent'?'Cursor named subagent registration':kind==='automation'?'Dormant Cursor automation operational skill':'Cursor skill instructions and host-specific tools where referenced',codex:classification==='D'?'No native wake equivalent; external endpoint partial':classification==='A'?'Native skill instruction + existing tools':classification==='B'?'Native skills/agents/Git/terminal + portable helper':'Conditional native tools with explicit coverage gaps',work:'Documented skill-capable host; this workflow not live-tested',migration:note,validation});
}
for(const name of fs.readdirSync(path.join(upstream,'skills')).sort()){
 const source=`skills/${name}/SKILL.md`;
 const classification=name==='make-bot-ui'?'D':name.startsWith('principle-')||nativeSkills.has(name)?'A':partialSkills.has(name)?'C':'B';
 add('skill',name,source,classification,description(path.join(upstream,source)),skillNotes[name]||'Engineering body and references retained; convert invocation/metadata and actual tool boundaries only. User scope and host authorization take precedence.');
}
for(const file of fs.readdirSync(path.join(upstream,'skills/poteto-mode/playbooks')).sort()){
 const name=file.slice(0,-3),source=`skills/poteto-mode/playbooks/${file}`;
 const content=fs.readFileSync(path.join(upstream,source),'utf8');
 add('playbook',name,source,partialBooks.has(name)?'C':name==='investigation'?'A':'B',content.split(/\r?\n/).find(s=>s.startsWith('**'))?.replaceAll('**','')||name,
 partialBooks.has(name)?'Full steps retained. Host-specific runtime/control/cloud/scheduler/forge evidence is conditional; no equivalent service invented. See compatibility table.':'Retain ordered steps, skipped-step reasons, same-surface verification and output contract; use actual role/tools and authorized publication.');
}
for(const name of ['poteto-agent','comment-sicko'])add('agent',name,`agents/${name}.md`,'B','Preserve the upstream named engineering/reviewer role.','Portable role prompt plus opt-in local Codex TOML template; plugin Markdown agents are not falsely auto-registered.');
for(const name of ['setup-benny','triage-issue-reports','reproduce-and-fix-issues'])add('automation',name,`automations/benny/skills/${name}/SKILL.md`,'C',description(path.join(upstream,`automations/benny/skills/${name}/SKILL.md`)),'Dormant operational pack. Preserve trusted marker, immutable thread, dedupe/compensation, evidence twice and draft-only gates. Pure protocol tests pass; live integrations and event trigger untested.');
const counts=Object.fromEntries(['A','B','C','D'].map(c=>[c,rows.filter(r=>r.classification===c).length]));
const untested=rows.filter(r=>!sampled.has(r.name)).length;
fs.writeFileSync(path.join(root,'migration-catalog.json'),JSON.stringify({counting_unit:'75 named upstream entries: 47 skills + 23 playbooks + 2 agents + 3 dormant automation skills; cross-cutting mechanisms are not double counted.',counts,total:rows.length,sampled_runtime_entries:rows.length-untested,no_sampled_workflow_run:untested,rows},null,2)+'\n');
const cell=s=>s.replaceAll('|','/').replaceAll('\n',' ');
let md=`# Migration matrix\n\nPinned upstream: 0.15.2 at \`6ed0f7a9504f577d7529064103cecce9be7dfc5e\`. Counting unit is a named entry: **47 main skills + 23 playbooks + 2 agents + 3 dormant Benny skills = ${rows.length}**. This avoids counting each principle twice or treating every script file as a new feature. All **158 upstream files** are retained and hashed. Detailed internal behavior audits are in docs/audit; cross-cutting mechanisms are in COMPATIBILITY.md.\n\nA = native equivalent design, B = replacement implementation, C = partial compatibility, D = native behavior currently lacks a verified equivalent. These classifications are architectural assessments, **not certification of complete behavioral parity**. A row can be A and still untested. All ChatGPT Work entries remain live-untested.\n\n| Metric | Count |\n|---|---:|\n| Named source entries | ${rows.length} |\n| A native equivalent design | ${counts.A} |\n| B replacement implementation | ${counts.B} |\n| C partial compatibility | ${counts.C} |\n| D native equivalent unavailable | ${counts.D} |\n| Entries with sampled agent workflow execution | ${rows.length-untested} |\n| No sampled full workflow execution | ${untested} |\n| Certified complete 1:1 parity across all target hosts | 0 |\n\nHelper tests and skill discovery are reported separately and do not make an unexecuted workflow verified. Sampled architecture/reflection/review runs have disclosed panel limitations.\n\n| Source feature | Cursor implementation | Purpose | Codex equivalent | ChatGPT Work equivalent | Migration | Class | Verification |\n|---|---|---|---|---|---|---|---|\n`;
for(const r of rows)md+=`| [${r.kind}: ${r.name}](upstream/pstack/${r.source}) | ${cell(r.cursor)} | ${cell(r.purpose)} | ${cell(r.codex)} | ${cell(r.work)} | ${cell(r.migration)} | ${r.classification} | ${r.validation} |\n`;
md+='\n## Every non-complete or unverified capability\n\nNo omitted D rows. The C/D entries are listed individually below; A/B entries without full execution remain listed as untested in the table above.\n\n';
for(const r of rows.filter(r=>['C','D'].includes(r.classification)))md+=`- **${r.kind}: ${r.name} (${r.classification})** — ${r.migration}\n`;
fs.writeFileSync(path.join(root,'MIGRATION_MATRIX.md'),md);
console.log(JSON.stringify({total:rows.length,counts,sampled:rows.length-untested,untested}));
