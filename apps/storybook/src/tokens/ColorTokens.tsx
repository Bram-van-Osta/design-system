import { ColorRow } from './ColorRow.tsx';
import { ThemePanel } from './ThemePanel.tsx';
import { tokens } from './tokens.ts';

export function ColorTokens() {
  return (
    <ThemePanel theme="light">
      <div className="grid">
        {tokens.color.tokens.map((token) => (
          <ColorRow key={token.name} token={token} themes={tokens.color.themes} />
        ))}
      </div>
    </ThemePanel>
  );
}
