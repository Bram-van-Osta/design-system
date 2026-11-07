import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { classNames } from '../../utils/class-names.ts';
import type { StatProps } from './Stat.tsx';
import { StatParts, StatSemantics } from './StatParts.tsx';
import { STAT_TILE_CLASSES, STAT_TONE_CLASSES } from './stat-classes.ts';
import { StatLayout } from './stat-layout.ts';
import { StatTone } from './stat-tone.ts';

// A target of 44 px even on a phone, where the tile is one line; under the pointer, the surface,
// or a titled tile's label underlined, the tile having no frame for the surface to fill.
const LINK_CLASSES: Readonly<Record<StatLayout, string>> = {
  labelFirst: 'min-h-target-min cursor-pointer hover:bg-surface',
  figureFirst: 'min-h-target-min cursor-pointer hover:bg-surface',
  titled: 'group/stat min-h-target-min cursor-pointer',
};

export interface StatLinkProps
  extends Omit<useRender.ComponentProps<'a'>, 'className' | 'children'>,
    StatProps {}

/**
 * A Stat as a link, for a tile that filters a list: its label, its figure and its note make its
 * name. `render` takes the router's link, `render={<RouterLink to="/projects?state=proposal" />}`,
 * or a `<button type="button" />` for a filter the page keeps.
 */
export function StatLink({
  render,
  label,
  value,
  note,
  tone = StatTone.plain,
  layout = StatLayout.labelFirst,
  mark,
  className,
  ...props
}: StatLinkProps) {
  return useRender({
    defaultTagName: 'a',
    render,
    props: mergeProps<'a'>(
      {
        className: classNames(
          STAT_TILE_CLASSES[layout],
          STAT_TONE_CLASSES[layout][tone],
          LINK_CLASSES[layout],
          className,
        ),
        children: (
          <StatParts
            label={label}
            value={value}
            note={note}
            mark={mark}
            tone={tone}
            layout={layout}
            semantics={StatSemantics.inline}
          />
        ),
      },
      props,
    ),
  });
}
