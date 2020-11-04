export function getCurrentValue(query: any, param: string, prefix?: string): any {
  if (prefix && !query[prefix]) {
    query[prefix] = {};
  }

  return prefix ? query[`${prefix}_${param}`] : query[param];
}
