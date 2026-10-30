const PLACEHOLDER = /\{(\w+)\}/g;

/** Fills the `{name}` placeholders of a message with their values; an unknown one stays as is. */
export function interpolate(
  message: string,
  values: Readonly<Record<string, string | number>>,
): string {
  return message.replace(PLACEHOLDER, (placeholder, name: string) => {
    const value = values[name];
    return value === undefined ? placeholder : String(value);
  });
}

export function placeholdersOf(message: string): readonly string[] {
  return [...message.matchAll(PLACEHOLDER)].map(([, name]) => name ?? '').sort();
}
