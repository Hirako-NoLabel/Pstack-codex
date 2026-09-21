export function createLoader(fetcher) {
  const pending = new Map();
  return key => {
    if (pending.has(key)) return pending.get(key);
    const result = fetcher(key);
    if (result == null || typeof result.then !== 'function') return result;
    const request = Promise.resolve(result).finally(() => pending.delete(key));
    pending.set(key, request);
    return request;
  };
}
