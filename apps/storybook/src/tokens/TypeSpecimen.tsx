import type { CSSProperties } from 'react';
import type { TypeStyle } from './tokens.ts';

type TypeSpecimenProps = {
  readonly family: string;
  readonly style: TypeStyle;
};

// The sample is drawn with the style's own variables, as a product would get it.
export function TypeSpecimen({ family, style }: TypeSpecimenProps) {
  const variable = `--text-${style.name}`;
  const letterSpacing = 'letterSpacing' in style ? style.letterSpacing : undefined;
  const sampleStyle: CSSProperties = {
    fontFamily: `var(--font-${family})`,
    fontSize: `var(${variable})`,
    lineHeight: `var(${variable}--line-height)`,
    fontWeight: `var(${variable}--font-weight)`,
    letterSpacing: letterSpacing === undefined ? undefined : `var(${variable}--letter-spacing)`,
  };
  const specification = [
    `text-${style.name}`,
    `${style.fontSize} / ${style.lineHeight}`,
    String(style.fontWeight),
    letterSpacing,
  ].filter((part) => part !== undefined);
  return (
    <div className="grid gap-space-1 border-line border-t pt-space-3">
      <p style={sampleStyle}>{style.sample}</p>
      <p className="font-mono text-meta text-ink-muted">{specification.join(' · ')}</p>
      <p className="text-small text-ink-muted">{style.usage}</p>
    </div>
  );
}
