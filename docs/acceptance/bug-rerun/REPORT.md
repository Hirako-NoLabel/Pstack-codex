# Bug Fix workflow acceptance rerun

Core Bug Fix sequence is verified on the local CLI fixture. A retained Swarm leaf timing limitation is recorded below. This is a bounded workflow acceptance run, not a production change.

## Behavior and evidence

Concurrent same-key requests previously called the fetcher twice. The lead reproduced duplicate alpha calls and different outcomes for overlapping rejection. The baseline has no pending-request state. The delegated fix keeps a Map of pending work per loader instance and deletes each entry when its promise settles.

The fixture now passes eight checks. These cover shared success, independent keys, fresh fetches after success, shared rejection with retry, synchronous failure recovery, immediate invocation and synchronous return, synchronous throw, and separate instances. Native CLI execution is the fixture's actual runtime. No UI, remote service, or other host compatibility is claimed.

## Phase execution

1. Complete. The lead reproduced the defect through the terminal. Original red receipt has five tests, three passes, and two failures. Extra baseline contract tests were committed before implementation. The second red receipt has eight tests, six passes, and two failures.
2. Complete within scope. Native how and why investigators ran in parallel and returned actual findings. The lead used passing independent-key and sequential checks to rule out key routing and permanent-cache hypotheses. The duplicate-call observation confirmed absent pending sharing. A separate native why synthesizer spot-checked provenance and the lead receipts. Historical intent remains unknown.
3. Complete. The lead named the per-instance key-to-promise Map before code. A native coding worker read full mode and applicable principle leaves, edited only loader.mjs, and returned eight passing tests. The lead inspected the actual diff. Architect skip: all state and behavior stay within original createLoader, with no changed public signature, caller, helper module, or cross-function coordination. Interrogate skip: there was no contested design.
4. Complete. The lead reran the original terminal checks after implementation. receipts/green.json records status 0 and the output reports eight passes.
5. Complete. The committed sequence is phase list, failing regression tests, extra baseline contract tests, and then implementation. See evidence/history.txt and evidence/baseline-to-fix.diff.
6. Local portion complete. PR-BODY.md is prepared. Publication skip: no publication was requested and the task explicitly forbids network and remote PR operations. Forge resolution, remote creation, and Babysit are not executed.

## Commit sequence

- 917ac4ab0ca4ad7ccc14bd27979c2d214433c528 records verbatim Bug Fix steps before investigation or reproduction.
- a3ddc76a89cee3f97a85c611d4d869a9c95886a5 commits the first failing regression tests and red receipt.
- e9b1de45a323f06866b36519877acdb14b434a42 commits additional synchronous and instance contracts with a second red receipt.
- dafea6bc835b638f1c16b0818b0e2524cb8b59ba implements the fix after both red commits.

## Skills actually used

Poteto-mode routed and coordinated the Bug Fix playbook. How executed as a native read-only explainer. Why executed as a native local-history investigator and a separate synthesizer, with external categories excluded by scope. Swarm executed the two-lane coverage fan-out and aggregation, with the timing limitation below. TDD executed red-before-fix-before-green. Technical-writing and unslop shaped commits and this local review body. Show-me-your-work produced decisions.tsv. No-comments is tracked in the actual returned reviewer artifact. Opening a PR executed its local preparation only.

Principle Fix Root Causes required runtime reproduction before the Map choice. Model the Domain and Foundational Thinking selected one per-instance pending registry. Laziness Protocol kept the change within createLoader. Test Behavior, Not Implementation kept literal value and outcome assertions. Sequence Verifiable Units placed failing tests before implementation. Prove It Works required the lead's own runtime run. Build the Lever retained run-receipt.mjs as the rerunnable output-and-status recorder. Each named principle leaf was read in full.

Architect, interrogate, reflect, remote publication, and Babysit were not executed. Runtime and role references were read as instructions, not counted as independently executed skills. No separate control-cli leaf exists in this package, so the runtime's terminal mapping was used.

## Limits and deviations

The four generic Swarm subphase names were appended after the initial fan-out. The primary Bug Fix verbatim phase list was committed before all task-specific investigation. This remains a leaf-process timing limitation, not retroactively repaired evidence.

The initial file-copy command repeated a relative fixture path from inside the fixture directory and failed without edits. The corrected command ran before the actual red repro. The why investigator reported initial broad filename metadata discovery under work, then restricted all evidence to the permitted ancestry.

All native workers inherit the parent model. No cross-model diversity is claimed. Their independent tasks are actual native agents, not sequential lead passes. Remote source categories were excluded by local-only scope, not asserted unavailable. The trail audit uses the visible task evidence digest and returned worker results, not an exported complete transcript.

Only after the fix and verification did the lead compare the earlier fixed fixture. That earlier implementation defers fetcher invocation and converts synchronous returns and throws into promises. This rerun preserves those baseline contracts. The earlier fixture and its report remain untouched.

Exact Promise identity, reentrant behavior, and arbitrary thenable contracts are not established by this fixture. No production-wide claim follows from eight local checks.

## Attention

Independent reviewer evidence is recorded in evidence/independent-review.md. The returned verdict must be read with the exact target commit and the scope limits above.

## Failing repro output verbatim

```text
✖ overlapping same-key requests share one fetch and result (2.2925ms)
✔ different keys remain independent while requests overlap (1.118ms)
✔ settled success does not become a permanent cache (0.1675ms)
✖ overlapping rejection is shared and the next request retries (0.4339ms)
✔ synchronous fetcher failure is rejected and can be retried (0.5981ms)
✔ fetcher runs immediately and synchronous values stay synchronous (0.1695ms)
✔ synchronous throws remain synchronous and retry works (0.2161ms)
✔ separate loader instances do not share pending work (0.1847ms)
ℹ tests 8
ℹ suites 0
ℹ pass 6
ℹ fail 2
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 89.2775

✖ failing tests:

test at loader.test.mjs:7:1
✖ overlapping same-key requests share one fetch and result (2.2925ms)
  AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:
  + actual - expected
  
    [
      'alpha',
  +   'alpha'
    ]
  
      at TestContext.<anonymous> (file:///C:/Users/17416/Documents/Codex/2026-09-22/goal-referenced-pasted-text-files-pasted-2/work/acceptance/bug-rerun/loader.test.mjs:12:9)
      at async Test.run (node:internal/test_runner/test:1113:7)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:358:3) {
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: [ 'alpha', 'alpha' ],
    expected: [ 'alpha' ],
    operator: 'deepStrictEqual',
    diff: 'simple'
  }

test at loader.test.mjs:33:1
✖ overlapping rejection is shared and the next request retries (0.4339ms)
  AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:
  + actual - expected
  
    [
      'rejected',
  +   'fulfilled'
  -   'rejected'
    ]
  
      at TestContext.<anonymous> (file:///C:/Users/17416/Documents/Codex/2026-09-22/goal-referenced-pasted-text-files-pasted-2/work/acceptance/bug-rerun/loader.test.mjs:40:9)
      at async Test.run (node:internal/test_runner/test:1113:7)
      at async Test.processPendingSubtests (node:internal/test_runner/test:788:7) {
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: [ 'rejected', 'fulfilled' ],
    expected: [ 'rejected', 'rejected' ],
    operator: 'deepStrictEqual',
    diff: 'simple'
  }

RECORDED_EXIT=1
```

## Passing repro output verbatim

```text
✔ overlapping same-key requests share one fetch and result (1.5987ms)
✔ different keys remain independent while requests overlap (0.8823ms)
✔ settled success does not become a permanent cache (0.1867ms)
✔ overlapping rejection is shared and the next request retries (0.3252ms)
✔ synchronous fetcher failure is rejected and can be retried (0.5879ms)
✔ fetcher runs immediately and synchronous values stay synchronous (0.1494ms)
✔ synchronous throws remain synchronous and retry works (0.1836ms)
✔ separate loader instances do not share pending work (0.181ms)
ℹ tests 8
ℹ suites 0
ℹ pass 8
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 87.275

RECORDED_EXIT=0
```


## Final independent verdict

Code PASS at dafea6bc835b638f1c16b0818b0e2524cb8b59ba. The native reviewer independently ran all eight checks and verified commit order. Trail ISSUES remains for late generic Swarm phases and incomplete exported transcript coverage. Canonical log omissions were appended after review. The final evidence commit archives the report and receipts. See evidence/independent-review.md for actual returned findings and adjudication.

## Attention

reviewed by inherited parent model. Exact model ID was not independently exposed.

The Swarm phase timing limit remains. Historical native worker activity is digest-supported. This result is scoped code acceptance and verified core Bug Fix sequence with disclosed process limits, not perfect all-leaf compliance.

