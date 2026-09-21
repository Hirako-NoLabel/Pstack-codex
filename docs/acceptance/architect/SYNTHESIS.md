# Arena synthesis decision

Parent selected candidate 3 after reading every package. The independent cross-judge independently reported candidate 3 as its recommended base before seeing the parent's assessment; its final scored response is retained separately.

Base: candidate 3 operation-owned cell registry. A successful old operation can mutate only its own detached cell, so it cannot publish itself back into the cache. Failure cleanup still needs an identity guard. The public API remains createLoadingCache({ttlMs, now, load}) -> {get, invalidate}.

Grafts: candidate 2's explicit capture of construction options, non-async get preserving promise identity, and returned settlement chain are adopted. Candidate 4 reinforces publication before invoking user code and expiry at equality. Candidate 1's completion-time subtraction is retained, already present in candidate 3. No bulk copying of another ownership model.

Rejected: registry replacement on both success and failure (candidates 1/2/4) adds another stale-write boundary without required caller benefit; manual deferred resolve/reject plumbing (candidate 1) is unnecessary for the chosen promise chain. Split maps/generation counters and caller-managed cells remain rejected for extra coordinated state or caller burden.

Red flags: no shallow coordinating interface, leaked storage types, lifecycle-stage module split or pass-through facade. The judge identified a callback-placement defect in candidate 1 under its broader written clock contract; the parent accepts this correction to its initial viability assessment and rejects candidate 1 as a fallback unless revised. Candidate 3 wins on structural isolation; original candidate files remain unchanged. Clock is supplied, finite, monotonic and nonthrowing; arbitrary hostile clock behavior is not added to fixture scope.

Runners: 4, in waves 3+1 under host capacity. Dropouts: 0. Model family: inherited same model, not diverse. Isolation: separate candidate directories, not worktrees. Greenfield grounding skip is explicit. No human checkpoint was requested. Verification and implementation deviations are recorded in REPORT.md after execution.
