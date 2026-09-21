# Behavioral checks derived before candidate selection

1. Two simultaneous callers for the same key trigger one loader call and receive the same value.
2. Other keys can complete while one key is pending.
3. TTL starts at successful completion, including a slow pending load; cached value remains valid just before expiry and refreshes at expiry.
4. Rejected load is shared by current waiters but retried on the next request.
5. Invalidation of a pending load starts a new load; resolving the newer load then the old load must preserve the newer cached value.
6. Old rejected load after invalidation must not remove a newer pending/cache entry.
7. Undefined values cache normally.
8. Construction rejects zero, negative, NaN and infinite TTL.
9. Synchronous loader throws become rejected get promises, with retry possible.
10. Reentrant loader invocation must see the already-published pending computation instead of starting duplicate work; self-await cycles are out of scope.

Use manually controlled promises and a numeric fake clock, no sleeps or wall-clock performance assumptions.
