/** Turn a component name and prop values into readable JSX for the playground's code view. */
const quote = (s: string) => (s.includes('"') ? `{${JSON.stringify(s)}}` : `"${s}"`);

export function toJsx(name: string, props: Record<string, unknown>, children?: unknown): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null || value === '') continue;
    if (value === true) parts.push(key);
    else if (value === false) parts.push(`${key}={false}`);
    else if (typeof value === 'string') parts.push(`${key}=${quote(value)}`);
    else if (typeof value === 'number') parts.push(`${key}={${value}}`);
    else if (typeof value === 'function') parts.push(`${key}={${key.startsWith('on') ? `(…) => {}` : key}}`);
    else parts.push(`${key}={${key}}`);
  }
  const open = parts.length > 2 || parts.join(' ').length > 50 ? `<${name}\n  ${parts.join('\n  ')}\n` : `<${name}${parts.length ? ' ' + parts.join(' ') : ''}`;
  const text = typeof children === 'string' || typeof children === 'number' ? String(children) : children ? '…' : '';
  return text ? `${open}>${open.endsWith('\n') ? '\n  ' + text + '\n' : text}</${name}>` : `${open}${open.endsWith('\n') ? '' : ' '}/>`;
}
