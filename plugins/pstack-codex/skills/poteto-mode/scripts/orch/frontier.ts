import { execFileSync } from "node:child_process";

export interface ForgePr {
  readonly number: number;
  readonly headRefName: string;
  readonly baseRefName: string;
  readonly headRefOid: string;
  readonly state: "OPEN" | "MERGED" | "CLOSED";
}
export interface FrontierRow {
  readonly pr: number;
  readonly branches: string;
  readonly sha: string;
  readonly state: ForgePr["state"];
}
export type ForgeRunner = (command: string, args: readonly string[], repo: string) => string;
const run: ForgeRunner = (command, args, repo) => execFileSync(command, [...args], {
  cwd: repo, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"],
});
function parseRows(value: unknown): ForgePr[] {
  if (!Array.isArray(value)) throw new Error("GitHub PR response must be an array");
  return value.map(row => {
    if (!row || !Number.isSafeInteger(row.number) || row.number < 1 ||
      typeof row.headRefName !== "string" || !row.headRefName ||
      typeof row.baseRefName !== "string" || !row.baseRefName ||
      typeof row.headRefOid !== "string" || !/^[0-9a-f]{40,64}$/i.test(row.headRefOid) ||
      !["OPEN", "MERGED", "CLOSED"].includes(row.state)) throw new Error("GitHub PR response has an invalid row");
    return row as ForgePr;
  });
}
export function orderFrontier(rows: readonly ForgePr[], seedBranch: string, pin?: readonly number[]): readonly FrontierRow[] {
  if (new Set(rows.map(r => r.number)).size !== rows.length) throw new Error("duplicate PR numbers");
  let selected: readonly ForgePr[];
  if (pin) {
    if (!pin.length || new Set(pin).size !== pin.length) throw new Error("--prs must be nonempty and contain no duplicates");
    selected = pin.map(pr => {
      const row = rows.find(r => r.number === pr);
      if (!row) throw new Error(`frontier pin missing PR ${pr}`);
      return row;
    });
    const positions = new Map(selected.map((r,i)=>[r.headRefName,i]));
    if (positions.size !== selected.length) throw new Error("ambiguous duplicate head branches");
    for (let i=0;i<selected.length;i++) {
      const row=selected[i]; const parent=positions.get(row.baseRefName);
      if (parent !== undefined && parent >= i) throw new Error("frontier pin order differs or contains a cycle");
      // A merged parent may have been automatically retargeted to trunk. An open
      // predecessor must still be the direct base, or this is not a linear stack.
      const previousOpen = selected.slice(0,i).filter(r=>r.state==='OPEN').at(-1);
      if (row.state==='OPEN' && previousOpen && row.baseRefName!==previousOpen.headRefName)
        throw new Error("frontier pin is disconnected or branching");
    }
  } else {
    const open=rows.filter(r=>r.state==='OPEN');
    if (new Set(open.map(r=>r.headRefName)).size!==open.length) throw new Error("ambiguous duplicate head branches");
    const byHead = new Map(open.map(r=>[r.headRefName,r]));
    const seed=byHead.get(seedBranch);
    if (!seed) throw new Error("no PR for current branch; pass an explicit --prs bottom-to-top list");
    const visited=new Set<number>(); let root=seed;
    while (byHead.has(root.baseRefName)) {
      if (visited.has(root.number)) throw new Error("cycle in GitHub base chain");
      visited.add(root.number); root=byHead.get(root.baseRefName)!;
    }
    const ordered: ForgePr[]=[]; visited.clear(); let current: ForgePr | undefined=root;
    while(current) {
      if (visited.has(current.number)) throw new Error("cycle in GitHub base chain");
      visited.add(current.number); ordered.push(current);
      const children=open.filter(r=>r.baseRefName===current!.headRefName);
      if(children.length>1) throw new Error("ambiguous branching stack; pass a single linear --prs list");
      current=children[0];
    }
    selected=ordered;
  }
  return selected.map(r=>({pr:r.number,branches:r.headRefName,sha:r.headRefOid,state:r.state}));
}
export function discoverFrontier(repo: string, pin?: readonly number[], runner: ForgeRunner=run): readonly FrontierRow[] {
  const fields="number,headRefName,baseRefName,headRefOid,state";
  const rows = pin ? pin.flatMap(pr=>parseRows([JSON.parse(runner("gh",["pr","view",String(pr),"--json",fields],repo))]))
    : parseRows(JSON.parse(runner("gh",["pr","list","--state","open","--limit","1000","--json",fields],repo)));
  if (!pin && rows.length>=1000) throw new Error("PR discovery limit reached; provide an explicit --prs list");
  return orderFrontier(rows,pin ? "" : runner("git",["branch","--show-current"],repo).trim(),pin);
}
