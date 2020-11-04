export default function getValue(object: any, path: string): any {
  return path.replace(/\[/g, '.')
    .replace(/\]/g, '')
    .split('.')
    .reduce((o, k) => (o || {})[k], object);
}
