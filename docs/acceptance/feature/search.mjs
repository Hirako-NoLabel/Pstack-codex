export function search(items, query, options = {}) {
  if (options.caseSensitive === false) {
    const literal = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(literal, 'iu');
    return items.filter(x => pattern.test(x));
  }
  return items.filter(x => x.includes(query));
}
