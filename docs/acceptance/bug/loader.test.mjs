import test from 'node:test';
import assert from 'node:assert/strict';
import {createLoader} from './loader.mjs';

function deferred(){let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};}

test('overlapping same-key requests share one fetch and result',async()=>{
 const gate=deferred();const calls=[];
 const load=createLoader(key=>{calls.push(key);return gate.promise;});
 const first=load('alpha'),second=load('alpha');
 await Promise.resolve();
 assert.deepEqual(calls,['alpha']);
 gate.resolve({value:'shared'});
 const values=await Promise.all([first,second]);
 assert.deepEqual(values,[{value:'shared'},{value:'shared'}]);
 assert.equal(values[0],values[1]);
});

test('different keys remain independent while requests overlap',async()=>{
 const gates={alpha:deferred(),beta:deferred()};const calls=[];
 const load=createLoader(key=>{calls.push(key);return gates[key].promise;});
 const alpha=load('alpha'),beta=load('beta');
 await Promise.resolve();assert.deepEqual(calls,['alpha','beta']);
 gates.beta.resolve('beta-value');assert.equal(await beta,'beta-value');
 gates.alpha.resolve('alpha-value');assert.equal(await alpha,'alpha-value');
});

test('settled success does not become a permanent cache',async()=>{
 let count=0;const load=createLoader(async key=>`${key}-${++count}`);
 assert.equal(await load('alpha'),'alpha-1');assert.equal(await load('alpha'),'alpha-2');
});

test('overlapping rejection is shared and the next request retries',async()=>{
 const gate=deferred();let count=0;
 const load=createLoader(()=>++count===1?gate.promise:Promise.resolve('recovered'));
 const first=load('alpha'),second=load('alpha');
 const outcomes=Promise.allSettled([first,second]);
 await Promise.resolve();gate.reject(new Error('offline'));
 const results=await outcomes;
 assert.deepEqual(results.map(x=>x.status),['rejected','rejected']);
 assert.deepEqual(results.map(x=>x.reason.message),['offline','offline']);
 assert.equal(count,1);assert.equal(await load('alpha'),'recovered');assert.equal(count,2);
});

test('synchronous fetcher failure is rejected and can be retried',async()=>{
 let count=0;const load=createLoader(()=>{if(++count===1)throw new Error('sync failure');return 'recovered';});
 await assert.rejects(async()=>load('alpha'),{message:'sync failure'});
 assert.equal(await load('alpha'),'recovered');
});
