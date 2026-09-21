/** Isolated architecture acceptance fixture, not part of the installed plugin.
 * now must be finite, monotonic and nonthrowing; TTL is in the same units.
 */
export function createLoadingCache({ttlMs, now, load}) {
  if (!Number.isFinite(ttlMs) || ttlMs <= 0) throw new RangeError('TTL must be positive and finite');
  const cells = new Map();
  return {
    get(key) {
      const current = cells.get(key)?.state;
      if (current?.kind === 'pending') return current.promise;
      if (current?.kind === 'ready' && now() - current.completedAt < ttlMs) return Promise.resolve(current.value);
      // Publish before invoking arbitrary loader code; completion owns only this cell.
      const cell = {};
      const promise = Promise.resolve().then(() => load(key)).then(value => {
        cell.state = {kind: 'ready', value, completedAt: now()};
        return value;
      }, error => {
        if (cells.get(key) === cell) cells.delete(key);
        throw error;
      });
      cell.state = {kind: 'pending', promise};
      cells.set(key, cell);
      return promise;
    },
    invalidate(key) { cells.delete(key); },
  };
}
