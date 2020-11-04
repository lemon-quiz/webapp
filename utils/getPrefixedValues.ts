export default function getPrefixedValues(query: any, prefix?: string): any {
  if (!prefix) {
    return query;
  }

  const regexp = new RegExp(`^(${prefix}_)(.*)$`);

  return Object.keys(query).reduce((prev: any, current: string) => {
    const match = regexp.exec(current)
    if (match && match.length === 3) {
      const key: string = match[2];
      prev[key] = query[current];
    }

    return prev;
  }, {});
}
