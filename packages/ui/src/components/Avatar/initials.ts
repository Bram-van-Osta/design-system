// The initials of a name: the first letter of its first two words, "Jeanne Martin" gives "JM".
const INITIALS_LENGTH = 2;

export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter((word) => word !== '')
    .slice(0, INITIALS_LENGTH)
    .map((word) => (Array.from(word)[0] ?? '').toLocaleUpperCase())
    .join('');
}
