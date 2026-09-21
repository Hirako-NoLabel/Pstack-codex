/** DESIGN SKETCH ONLY: every executable body intentionally unimplemented. */
export interface LoadingCache<K, V> {
  /** Always a promise. Same pending operation means same Promise instance. */
  get(key: K): Promise<V>;
  /** Idempotently revoke current entry ownership, without cancelling callers. */
  invalidate(key: K): void;
}
export interface LoadingCacheOptions<K, V> {
  readonly ttl: number;
  /** Finite, monotonic, nonthrowing; same units as ttl. */
  readonly now: () => number;
  /** Sync return/throw and asynchronous fulfillment/rejection are normalized. */
  readonly loader: (key: K) => V | PromiseLike<V>;
}

declare const ttlBrand: unique symbol;
type PositiveFiniteTtl = number & { readonly [ttlBrand]: true };

/** Pending object identity is the revocable authority to publish or delete. */
type Pending<V> = Readonly<{ kind: 'pending'; promise: Promise<V> }>;
type Ready<V> = Readonly<{ kind: 'ready'; value: V; completedAt: number }>;
type Entry<V> = Pending<V> | Ready<V>;

function validateTtl(value: number): PositiveFiniteTtl {
  // TODO At construction, reject unless Number.isFinite(value) && value > 0.
  throw new Error('not implemented');
}

export function createLoadingCache<K, V>(
  options: LoadingCacheOptions<K, V>,
): LoadingCache<K, V> {
  // TODO Validate ttl once; capture loader and clock, rather than mutable options.
  // TODO Own exactly one Map<K, Entry<V>> in this factory closure.
  // TODO get(key):
  //   If current entry is pending, return its promise immediately.
  //   If ready and now() - completedAt < ttl, return Promise.resolve(value).
  //   Otherwise create a deferred promise plus fresh Pending record.
  //   Publish that Pending record before scheduling loader invocation in a microtask.
  //   A reentrant get therefore sees this pending promise; self-await is out of scope.
  //   Normalize loader return/throw using Promise resolution semantics.
  //   On fulfillment, if map.get(key) === this Pending, replace it with
  //     Ready(value, completedAt = now()), then resolve the original deferred.
  //   On rejection, if map.get(key) === this Pending, delete it,
  //     then reject the original deferred.
  //   Never throw loader failures directly from get; never cache failures.
  //   Settlement callbacks must consume their internal promise rejections;
  //     do not leave an ignored rejecting cleanup/finally promise.
  // TODO invalidate(key): delete the map entry; do not settle/cancel its promise.
  // TODO Return only get and invalidate; keep map and entries private.
  throw new Error('not implemented');
}
