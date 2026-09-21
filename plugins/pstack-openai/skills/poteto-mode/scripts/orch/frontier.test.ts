import { describe, expect, it } from "bun:test";
import { discoverFrontier, orderFrontier, type ForgePr, type ForgeRunner } from "./frontier.ts";
const row=(number:number,head:string,base:string,state:ForgePr['state']='OPEN'):ForgePr=>({number,headRefName:head,baseRefName:base,headRefOid:String(number).repeat(40),state});
describe('GitHub base-branch frontier',()=>{
 it('orders a chain from a middle seed and uses remote SHAs',()=>{
  const result=orderFrontier([row(3,'c','b'),row(1,'a','main'),row(2,'b','a')],'b');
  expect(result.map(r=>r.pr)).toEqual([1,2,3]);expect(result[2].sha).toBe('3'.repeat(40));
 });
 it('rejects cycles, forks, absent seeds, duplicates and wrong pins',()=>{
  expect(()=>orderFrontier([row(1,'a','b'),row(2,'b','a')],'a')).toThrow('cycle');
  expect(()=>orderFrontier([row(1,'a','main'),row(2,'b','a'),row(3,'c','a')],'a')).toThrow('branching');
  expect(()=>orderFrontier([row(1,'a','main')],'absent')).toThrow('no PR');
  expect(()=>orderFrontier([row(1,'a','main'),row(2,'a','main')],'a')).toThrow('duplicate');
  expect(()=>orderFrontier([row(1,'a','main'),row(2,'b','a')],'',[2,1])).toThrow('order');
  expect(()=>orderFrontier([row(1,'a','main')],'',[1,2])).toThrow('missing');
  expect(()=>orderFrontier([row(1,'a','main')],'',[1,1])).toThrow('duplicates');
  expect(()=>orderFrontier([row(1,'a','main'),row(2,'b','main')],'',[1,2])).toThrow('disconnected');
 });
 it('retains merged and closed entries in a frozen queue after retarget',()=>{
  expect(orderFrontier([row(1,'a','main','MERGED'),row(2,'b','main','CLOSED'),row(3,'c','main')],'',[1,2,3]).map(r=>r.state)).toEqual(['MERGED','CLOSED','OPEN']);
 });
 it('reads an explicit list with gh view and no local branch assumption',()=>{
  const calls:string[][]=[];const runner:ForgeRunner=(cmd,args,repo)=>{calls.push([cmd,...args,repo]);return JSON.stringify(row(Number(args[2]),args[2]==='1'?'a':'b',args[2]==='1'?'main':'a'));};
  expect(discoverFrontier('C:/space repo',[1,2],runner).map(r=>r.pr)).toEqual([1,2]);
  expect(calls.every(c=>c[0]==='gh'&&c[1]==='pr'&&c[2]==='view')).toBe(true);
 });
 it('rejects malformed upstream data instead of inferring ready',()=>{
  expect(()=>discoverFrontier('.', [1],()=>'{"number":1}')).toThrow('invalid row');
 });
});
