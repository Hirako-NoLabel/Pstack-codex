import test from 'node:test';
import assert from 'node:assert/strict';
import {freezeSource, preflight, replyEnvelope, trustedVerdict, claimOnce, ticketGate,
  handoffOutcome, draftGate, workerRoute} from '../scripts/protocol.mjs';

const source=freezeSource({source_channel_id:'C1',message_ts:'100.001',thread_ts:''},'C1');
const parent={channel:'C1',ts:'100.001',exists:true,deleted:false,accessible:true};
const message={user:'U1',channel:'C1',thread_ts:'100.001',ts:'101.001',text:'Confirmed\n[benny:bug]'};

test('normalization freezes one source root and rejects ambiguous input',()=>{
  assert.deepEqual(source,{channel:'C1',thread_ts:'100.001'});
  assert.throws(()=>{source.thread_ts='101.001';},TypeError);
  assert.throws(()=>freezeSource({source_channel_id:'C2',message_ts:'100.001'},'C1'));
  assert.throws(()=>freezeSource({source_channel_id:'C1',ts:'100.001'},'C1'));
  assert.throws(()=>freezeSource({source_channel_id:'C1',message_ts:'100.001',thread_ts:null},'C1'));
  assert.equal(freezeSource({source_channel_id:'C1',message_ts:'101.001',thread_ts:'100.001'},'C1').thread_ts,'100.001');
});

test('every reply requires exact existing accessible parent and nonempty thread',()=>{
  assert.equal(preflight(source,parent),true);
  assert.deepEqual(replyEnvelope(source,parent,'verdict'),{channel:'C1',thread_ts:'100.001',text:'verdict'});
  for(const mutation of [{deleted:true},{exists:false},{accessible:false},{ts:'101.001'},{channel:'C2'}])
    assert.throws(()=>replyEnvelope(source,{...parent,...mutation},'verdict'));
  assert.throws(()=>replyEnvelope({channel:'C1',thread_ts:''},parent,'verdict'));
});

test('only one marker from the trusted author in the original thread is accepted',()=>{
  assert.deepEqual(trustedVerdict(source,message,'U1'),{kind:'bug',proceed:true,tracker:null});
  assert.equal(trustedVerdict(source,{...message,text:'[benny:other]'},'U1').proceed,false);
  assert.equal(trustedVerdict(source,{...message,text:'[benny:performance] tracker=https://tracker.example/1'},'U1').tracker,'https://tracker.example/1');
  for(const mutation of [{user:'U2'},{thread_ts:'102.001'},{channel:'C2'},{ts:'100.001'},
    {text:'[benny:bug]\n[benny:other]'},{text:'[benny:bug] [benny:bug]'},
    {text:'quote [benny:bug] quoted'},{text:'[benny:bug] tracker=javascript:alert(1)'},
    {text:'[benny:bug] tracker=https://tracker.example/1 extra'}])
    assert.equal(trustedVerdict(source,{...message,...mutation},'U1'),null);
});

test('replayed report is claimed once per workflow and original thread',()=>{
  const store=new Set();
  assert.equal(claimOnce(store,source,'triage'),true);
  assert.equal(claimOnce(store,source,'triage'),false);
  assert.equal(claimOnce(store,source,'reproduce'),true);
  assert.equal(claimOnce(store,freezeSource({source_channel_id:'C1',message_ts:'102.001'},'C1'),'triage'),true);
});

test('ticket creation fails closed and a failed handoff requires compensation',()=>{
  const input={sourceValid:true,sourcePermalink:'https://slack.example/thread',targetResolved:true,
    compensationAvailable:true,category:'bug',clearlyBroken:true,stillLive:true,duplicate:'none'};
  assert.equal(ticketGate(input),true);
  for(const mutation of [{sourceValid:false},{compensationAvailable:false},{duplicate:'possible'},
    {duplicate:'confident'},{category:'feature'},{stillLive:false},{sourcePermalink:''},
    {sourcePermalink:'not a url'},{sourcePermalink:'/thread/1'},{sourcePermalink:'http://slack.example/thread'},
    {sourcePermalink:'https://user:secret@slack.example/thread'},{sourcePermalink:'https://slack.example/thread extra'},
    {sourcePermalink:'https:slack.example/thread'},{sourcePermalink:'https:\\slack.example/thread'}])
    assert.equal(ticketGate({...input,...mutation}),false);
  assert.deepEqual(handoffOutcome({createdIssue:'issue-1',replyVerified:false}),{action:'compensate-and-verify',issue:'issue-1',success:false});
  assert.equal(handoffOutcome({createdIssue:'issue-1',replyVerified:false,compensationVerified:true}).action,'compensated');
  assert.equal(handoffOutcome({replyVerified:false}).action,'stop-no-root-retry');
  assert.equal(handoffOutcome({createdIssue:'issue-1',replyVerified:true}).success,true);
});

test('no proof means no draft and an existing fix never permits a competing draft',()=>{
  const proof={baselineReproductions:2,patchedSuccesses:2,realUI:true,independentAttempts:true,
    mediaConfirmed:true,beforeCapture:true,afterCapture:true,stateCrossCheck:true,rootCauseConfirmed:true,
    withinBudget:true,rejectionWindowClosed:true,focusedTestsPassed:true,blastRadiusPassed:true,
    requiredChecksPassed:true,diffReviewed:true,existingFix:false,humanOwnsFix:false,regressionRemaining:false};
  assert.equal(draftGate(proof),true);
  assert.equal(draftGate(),false);
  for(const mutation of [{baselineReproductions:1},{patchedSuccesses:1},{realUI:false},{mediaConfirmed:false},
    {beforeCapture:false},{existingFix:true},{humanOwnsFix:true},{regressionRemaining:true},{requiredChecksPassed:false}])
    assert.equal(draftGate({...proof,...mutation}),false);
});

test('uncertain tool or credential isolation always falls back to coordinator',()=>{
  assert.equal(workerRoute({wantsCode:true,toolsExcludeSlackWrites:true,credentialsExcludeSlack:true}),'isolated-code-worker');
  assert.equal(workerRoute({wantsCode:false,toolsExcludeSlackWrites:true,credentialsExcludeSlack:true}),'isolated-read-only-worker');
  for(const settings of [{},{toolsExcludeSlackWrites:true},{credentialsExcludeSlack:true},
    {toolsExcludeSlackWrites:true,credentialsExcludeSlack:false}])
    assert.equal(workerRoute({...settings,wantsCode:true}),'coordinator');
});
