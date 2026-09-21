export function createLoader(fetcher) {
  const pending = new Map();
  return key => {
    if (!pending.has(key)) {
      const request = Promise.resolve()
        .then(() => fetcher(key))
        .finally(() => pending.delete(key));
      pending.set(key, request);
    }
    return pending.get(key);
  };
}
