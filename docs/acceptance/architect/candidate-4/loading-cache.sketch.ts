/** Design signatures and pseudocode only; intentionally not executable cache code. */
export interface CacheOptions<K, V> {
  readonly ttlMs: number;
  /** Pure, nonthrowing clock returning finite monotonic milliseconds. */
  readonly now: () => number;
  readonly load: (key: K) => V | PromiseLike<V>;
}

export interface LoadingCache<K, V> {
  /** Non-async implementation preserves exact pending-promise identity. */
  get(key: K): Promise<V>;
  /** Revokes the current entry; never cancels or rejects its callers. */
  invalidate(key: K): void;
}

// Private types, not exports. The discriminant permits cached undefined.
type Entry<V> = Pending<V> | Ready<V>;
type Pending<V> = {
  readonly kind: 'pending';
  readonly promise: Promise<V>;
};
type Ready<V> = {
  readonly kind: 'ready';
  readonly value: V;
  readonly completedAtMs: number;
};

export function createLoadingCache<K, V>(options: CacheOptions<K, V>): LoadingCache<K, V> {
  // TODO validate Number.isFinite(ttlMs) && ttlMs > 0, else throw RangeError.
  // TODO copy options into closure constants; own exactly one Map<K, Entry<V>>.
  // TODO return get/invalidate closures; callers never receive the map or entries.
  //
  // get(key):
  //   Read the one current entry.
  //   Pending -> return its exact promise; no clock call and no loader call.
  //   Ready with now() - completedAtMs < ttlMs -> Promise.resolve(value).
  //   Missing/expired -> create a unique Pending object and a native promise chain.
  //     First chain stage invokes load(key) in a microtask, assimilating thenables.
  //     Publish the fully formed Pending object in the map synchronously before
  //     returning its promise; microtasks cannot run before this publication.
  //     Final success handler: if map.get(key) === this Pending, replace it with
  //       Ready(value, completedAtMs = now()); then return value regardless.
  //     Final failure handler: if map.get(key) === this Pending, delete it;
  //       then throw the original reason regardless.
  //     The returned promise includes those settlement handlers, so failed work
  //       is removed before caller rejection observers can retry.
  //   Return this Pending.promise directly.
  //
  // invalidate(key): delete current map entry, regardless of its variant.
  //   Repetition is harmless. An old promise retains its original result path.
  //   Replacing an entry gives a different object identity, preventing ABA reuse.
  throw new Error('not implemented');
}
