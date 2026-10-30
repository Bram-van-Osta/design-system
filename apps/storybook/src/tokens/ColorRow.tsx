import { ThemePanel } from './ThemePanel.tsx';
import type { ColorTheme, ColorToken } from './tokens.ts';

type ColorRowProps = {
  readonly token: ColorToken;
  readonly themes: readonly ColorTheme[];
};

export function ColorRow({ token, themes }: ColorRowProps) {
  const themeNames = new Map(themes.map((theme) => [theme.id, theme.name]));
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_repeat(2,minmax(0,11rem))] items-start gap-space-4 border-line border-t py-space-4">
      <div className="grid gap-space-1">
        <p className="font-mono text-meta">--{token.name}</p>
        <p className="text-small text-ink-muted">{token.usage}</p>
      </div>
      {Object.entries(token.value).map(([theme, value]) => (
        <ThemePanel key={theme} theme={theme}>
          <div
            className="h-space-7 border-hair border-line"
            style={{ backgroundColor: `var(--${token.name})` }}
          />
          <p className="mt-space-2 font-mono text-meta">
            {themeNames.get(theme)} · {value}
          </p>
        </ThemePanel>
      ))}
    </div>
  );
}
