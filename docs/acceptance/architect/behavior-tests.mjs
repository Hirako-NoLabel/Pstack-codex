import test from 'node:test';
import assert from 'node:assert/strict';
const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};};
const tick=()=>new Promise(resolve=>queueMicrotask(resolve));
// Adapter contract: make({load,ttlMs,now}) returns {get(key),invalidate(key)}.
export function verifyCache(make){
 test('same key coalesces; other key progresses independently',async()=>{
  const slow=deferred();let calls=0;
  const c=make({ttlMs:10,now:()=>0,load:k=>{calls++;return k==='a'?slow.promise:2;}});
  const a=c.get('a'),b=c.get('a');assert.equal(a,b);assert.equal(await c.get('b'),2);assert.equal(calls,2);
  slow.resolve(1);assert.deepEqual(await Promise.all([a,b]),[1,1]);
 });
 test('TTL starts on completion and expires at boundary',async()=>{
  let time=0,calls=0;const pending=deferred();const c=make({ttlMs:10,now:()=>time,load:()=>++calls===1?pending.promise:2});
  const p=c.get('a');await tick();time=100;pending.resolve(1);assert.equal(await p,1);
  time=109;assert.equal(await c.get('a'),1);time=110;assert.equal(await c.get('a'),2);assert.equal(calls,2);
 });
 test('rejection is shared then retried',async()=>{
  const d=deferred();let calls=0;const c=make({ttlMs:10,now:()=>0,load:()=>++calls===1?d.promise:3});
  const p=c.get('a'),q=c.get('a');const results=Promise.allSettled([p,q]);await tick();d.reject(new Error('failed'));
  assert.deepEqual((await results).map(r=>r.status),['rejected','rejected']);assert.equal(await c.get('a'),3);assert.equal(calls,2);
 });
 for(const staleReject of [false,true])test(`invalidation prevents stale ${staleReject?'rejection':'success'} from replacing fresh value`,async()=>{
  const old=deferred(),fresh=deferred();let calls=0;const c=make({ttlMs:10,now:()=>0,load:()=>++calls===1?old.promise:fresh.promise});
  const p=c.get('a');const observed=Promise.allSettled([p]);await tick();c.invalidate('a');const q=c.get('a');await tick();assert.equal(calls,2);
  fresh.resolve('fresh');assert.equal(await q,'fresh');if(staleReject)old.reject(new Error('old'));else old.resolve('old');
  const [r]=await observed;assert.equal(r.status,staleReject?'rejected':'fulfilled');if(!staleReject)assert.equal(r.value,'old');
  assert.equal(await c.get('a'),'fresh');assert.equal(calls,2);
 });
 for(const staleReject of [false,true])test(`stale ${staleReject?'rejection':'success'} cannot replace a newer pending entry`,async()=>{
  const old=deferred(),fresh=deferred();let calls=0;const c=make({ttlMs:10,now:()=>0,load:()=>++calls===1?old.promise:fresh.promise});
  const p=c.get('a');const observed=Promise.allSettled([p]);await tick();c.invalidate('a');const q=c.get('a');await tick();if(staleReject)old.reject(new Error('old'));else old.resolve('old');await observed;
  const joined=c.get('a');await tick();assert.equal(calls,2);fresh.resolve('fresh');assert.deepEqual(await Promise.all([q,joined]),['fresh','fresh']);
 });
 test('undefined is a cached value',async()=>{let calls=0;const c=make({ttlMs:10,now:()=>0,load:()=>{calls++;return undefined;}});assert.equal(await c.get('a'),undefined);assert.equal(await c.get('a'),undefined);assert.equal(calls,1);});
 test('invalid TTL is rejected',()=>{for(const ttlMs of [0,-1,NaN,Infinity])assert.throws(()=>make({ttlMs,now:()=>0,load:()=>1}),RangeError);});
 test('synchronous loader failure rejects and retries',async()=>{let calls=0;const c=make({ttlMs:10,now:()=>0,load:()=>{if(++calls===1)throw new Error('sync');return 1;}});let p;assert.doesNotThrow(()=>{p=c.get('a');});await assert.rejects(p,/sync/);assert.equal(await c.get('a'),1);});
 test('pending ownership is published before reentrant loader invocation',async()=>{
  let c,joined,calls=0;c=make({ttlMs:10,now:()=>0,load:()=>{calls++;if(calls===1)joined=c.get('a');return 7;}});
  assert.equal(await c.get('a'),7);assert.equal(await joined,7);assert.equal(calls,1);
 });
}
