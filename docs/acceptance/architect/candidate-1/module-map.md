# Module map

- `loading-cache.js` (future implementation): factory and two-method public interface; owns TTL validation, entry union, pending publication, settlement ownership and expiration. The sketch is `loading-cache.sketch.ts`; no runtime implementation is supplied.
- `loading-cache.test.js` (future deterministic tests): supplied fake clock and controlled loader; asserts operation counts and caller results. No test support exported from production module.
- `usage.md`: caller-first specification, written before types.
- `rationale.md`: design choice and rejected ownership alternative.

Dominant access paths remain within one module:

| Access | Structure and transition |
| --- | --- |
| Cold/expired read | Absent/expired Ready -> publish unique Pending -> invoke loader asynchronously |
| Concurrent same-key read | Map lookup -> return existing Pending.promise |
| Different-key read | Independent entry and promise, no global queue or lock |
| Fresh cached undefined | Ready discriminator establishes presence; return Ready.value |
| Successful completion | Identity guard -> Ready with completion clock sample -> settle original caller |
| Failure | Identity guard -> delete -> reject original caller; next read starts new work |
| Invalidation | Delete current entry; detached Pending continues only for existing callers |
| Old completion after replacement | Identity mismatch -> no map mutation, original caller still settles |

Red-flag screen: no shallow stage modules, no public state representation, no temporal pipeline, no pass-through facade. Two methods hide all loading/expiration/ownership policy. Each operation has constant expected map access; expired values are removed/replaced lazily when accessed or invalidated.
