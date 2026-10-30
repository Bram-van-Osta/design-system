import { ThemePanel } from './ThemePanel.tsx';
import { TypeSpecimen } from './TypeSpecimen.tsx';
import { tokens } from './tokens.ts';

const FAMILIES = new Map(Object.entries(tokens.type.families));

export function TypeStyles() {
  return (
    <ThemePanel theme="light">
      <div className="grid gap-space-7">
        {tokens.type.groups.map((group) => (
          <section key={group.name} className="grid gap-space-4">
            <div className="grid gap-space-1">
              <h3 className="font-display text-heading-xs">{group.name}</h3>
              <p className="text-small text-ink-muted">{group.note}</p>
              <p className="font-mono text-meta text-ink-muted">
                --font-{group.family}: {FAMILIES.get(group.family)}
              </p>
            </div>
            {group.styles.map((style) => (
              <TypeSpecimen key={style.name} family={group.family} style={style} />
            ))}
          </section>
        ))}
      </div>
    </ThemePanel>
  );
}
