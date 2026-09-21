/** Design sketch only; no functioning cache implementation. */
export interface LoadingCache<K, V> {
  /** Always returns a promise; same pending key returns the same promise. */
  get(key: K): Promise<V>;
  /** Disconnects current ownership; does not cancel or alter existing callers. */
  invalidate(key: K): void;
}
export interface CacheOptions<K, V> {
  readonly ttlMs: number;
  /** Finite, nondecreasing, nonthrowing time in milliseconds. */
  readonly now: () => number;
  /** May return undefined, a thenable, or throw synchronously. */
  readonly load: (key: K) => V | PromiseLike<V>;
}
declare const positiveTtl: unique symbol;
type PositiveTtl = number & { readonly [positiveTtl]: true };
type CellState<V> =
  | { readonly kind: 'pending'; readonly promise: Promise<V> }
  | { readonly kind: 'ready'; readonly value: V; readonly completedAt: number };
interface Cell<V> { state: CellState<V> }

/** Private state owned by the closure returned by createLoadingCache. */
interface CacheState<K, V> {
  readonly cells: Map<K, Cell<V>>;
  readonly ttl: PositiveTtl;
  readonly now: () => number;
  readonly load: (key: K) => V | PromiseLike<V>;
}

/** Reject non-number, non-finite, zero and negative TTL synchronously. */
export function createLoadingCache<K, V>(options: CacheOptions<K, V>): LoadingCache<K, V> {
  // TODO: validate options.ttlMs once; build one private map and return get/invalidate.
  // TODO get: observe cells.get(key).
  //   pending -> return its exact promise (get must not be an async wrapper).
  //   ready and now() - completedAt < ttl -> return Promise.resolve(value).
  //   absent/expired -> create a promise chain deferring load(key) to a microtask;
  //     create pending cell referencing that promise; publish cells.set(key, cell).
  // TODO success handler: sample completion time; set only THIS cell's state to
  //   ready, then return value. Never cells.set from any completion callback.
  // TODO failure handler: if cells.get(key) === cell, delete key; rethrow error.
  // TODO invalidate: cells.delete(key). Detached cells still settle original promises.
  // JS run-to-completion ensures the microtask cannot run before publication.
  throw new Error('not implemented');
}
