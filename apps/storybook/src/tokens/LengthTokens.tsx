import type { CSSProperties } from 'react';
import { ThemePanel } from './ThemePanel.tsx';
import { tokens } from './tokens.ts';

const FAMILIES = {
  spacing: tokens.spacing.tokens,
  size: tokens.size.tokens,
  radius: tokens.radius.tokens,
  border: tokens.border.tokens,
} as const;

type LengthFamily = keyof typeof FAMILIES;

type Preview = {
  readonly className: string;
  readonly style: (variable: string) => CSSProperties;
};

// A bar as long as a spacing or a size, a tile with the radius or the top border.
const PREVIEWS: Record<LengthFamily, Preview> = {
  spacing: { className: 'h-space-2 bg-delft', style: (variable) => ({ width: variable }) },
  size: {
    className: 'h-space-2 max-w-full bg-delft-pale',
    style: (variable) => ({ width: variable }),
  },
  radius: {
    className: 'size-space-7 border-hair border-ink bg-surface',
    style: (variable) => ({ borderRadius: variable }),
  },
  border: {
    className: 'size-space-7 border-ink bg-surface',
    style: (variable) => ({ borderTopWidth: variable }),
  },
};

type LengthTokensProps = {
  readonly family: LengthFamily;
};

export function LengthTokens({ family }: LengthTokensProps) {
  const preview = PREVIEWS[family];
  return (
    <ThemePanel theme="light">
      <div className="grid">
        {FAMILIES[family].map((token) => (
          <div
            key={token.name}
            className="grid grid-cols-[minmax(0,16rem)_minmax(0,1fr)] items-center gap-space-4 border-line border-t py-space-3"
          >
            <div className="grid gap-space-1">
              <p className="font-mono text-meta">
                --{token.name}: {token.value}
              </p>
              <p className="text-small text-ink-muted">{token.usage}</p>
            </div>
            <div className={preview.className} style={preview.style(`var(--${token.name})`)} />
          </div>
        ))}
      </div>
    </ThemePanel>
  );
}
