/** Sketch only. No executable cache implementation is included. */
export interface LoadingCache<K, V> {
  /** Same key shares the exact pending promise; successful undefined is a hit. */
  get(key: K): Promise<V>;
  /** Detach current state; prior callers retain their own eventual outcome. */
  invalidate(key: K): void;
}
export interface LoadingCacheOptions<K, V> {
  readonly ttlMs: number;
  /** Finite, monotonic milliseconds supplied by the caller. */
  readonly clock: () => number;
  readonly loader: (key: K) => V | PromiseLike<V>;
}

// Private only. An entry object's identity is also its installation authority.
type Entry<V> = Pending<V> | Ready<V>;
interface Pending<V> {
  readonly kind: 'pending';
  readonly promise: Promise<V>;
}
interface Ready<V> {
  readonly kind: 'ready';
  readonly value: V;
  readonly completedAt: number;
}
// Single owner: closure-private Map<K, Entry<V>>, plus validated TTL and callbacks.

export function createLoadingCache<K, V>(
  options: LoadingCacheOptions<K, V>,
): LoadingCache<K, V> {
  // TODO boundary: throw RangeError synchronously unless ttlMs is finite and > 0.
  // TODO capture options once; caller mutation must not change cache policy.
  // TODO return get and invalidate closures over one private entries map.
  // GET pseudocode:
  // - pending -> return its promise directly (get itself must not be async).
  // - ready and clock() - completedAt < ttlMs -> Promise.resolve(value).
  // - absent or expired -> prepare one deferred loader promise and Pending token.
  //   Store Pending before the deferred loader runs. Return the promise whose
  //   success/failure handlers perform the transitions below, not a second promise.
  // SUCCESS(value):
  // - sample completedAt = clock() before the authority check; then if entries.get(key)
  //   === captured Pending, replace with Ready(value, completedAt).
  // - always return value to this operation's callers, even if detached.
  // FAILURE(error):
  // - if entries.get(key) === captured Pending, delete key.
  // - always reject this operation's callers with the original error.
  // INVALIDATE(key): delete key, including any pending entry; repeat is a no-op.
  // No await occurs between current-token comparison and replacement/deletion.
  throw new Error('not implemented');
}

