import type { TypeStyle } from './schema.ts';

export type Variable = readonly [name: string, value: string];

// A text style named as Tailwind names it, its size then its companions (text-body--line-height),
// so that the Tailwind theme maps each variable to the key of the same name.
export function textStyleVariables(style: TypeStyle): Variable[] {
  const name = `text-${style.name}`;
  const variables: Variable[] = [
    [name, style.fontSize],
    [`${name}--line-height`, String(style.lineHeight)],
    [`${name}--font-weight`, String(style.fontWeight)],
  ];
  if (style.letterSpacing !== undefined) {
    variables.push([`${name}--letter-spacing`, style.letterSpacing]);
  }
  return variables;
}
