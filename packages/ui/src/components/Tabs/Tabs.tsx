import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import type { ReactNode } from 'react';

export interface TabsItem {
  /** Unique among the tabs. */
  readonly value: string;
  readonly label: ReactNode;
  /** A number after the label, muted: "Messages · 1". None when it is not given. */
  readonly count?: number;
  /** What the tab opens. A hidden panel stays mounted, so what the reader typed in it is kept. */
  readonly panel: ReactNode;
}

export interface TabsProps {
  /** The tab list's name, read by screen readers, such as what the panels show. */
  readonly label: string;
  readonly tabs: readonly TabsItem[];
  readonly value?: string;
  /** The tab open at first; the first tab's when none is given. */
  readonly defaultValue?: string;
  readonly onValueChange?: (value: string) => void;
  readonly className?: string;
}

// The rule under the whole row is drawn before the tabs, so the open tab's underline covers it.
const LIST_CLASSES =
  'relative flex gap-space-5 before:absolute before:inset-x-0 before:bottom-0 before:border-b-hair before:border-line';
const TAB_CLASSES =
  'relative inline-flex min-h-target-min cursor-pointer items-center border-b-select border-transparent px-space-1 text-body-s font-medium text-ink-muted hover:not-data-active:bg-surface hover:not-data-active:text-ink data-active:border-delft data-active:font-semibold data-active:text-ink';
const PANEL_CLASSES = 'pt-space-4';

function stringValueHandler(onValueChange: ((value: string) => void) | undefined) {
  return (value: unknown) => {
    if (typeof value === 'string') {
      onValueChange?.(value);
    }
  };
}

/**
 * A few panels behind a row of tabs, underlined at their width on a rule, one open: the arrow keys
 * move between the tabs and open them, Home and End too.
 */
export function Tabs({ label, tabs, value, defaultValue, onValueChange, className }: TabsProps) {
  return (
    <BaseTabs.Root
      value={value}
      defaultValue={defaultValue ?? tabs[0]?.value}
      onValueChange={stringValueHandler(onValueChange)}
      className={className}
    >
      <BaseTabs.List aria-label={label} activateOnFocus className={LIST_CLASSES}>
        {tabs.map((tab) => (
          <BaseTabs.Tab key={tab.value} value={tab.value} className={TAB_CLASSES}>
            <span>
              {tab.label}
              {tab.count !== undefined && (
                <>
                  {' '}
                  <span className="text-ink-muted">· {tab.count}</span>
                </>
              )}
            </span>
          </BaseTabs.Tab>
        ))}
      </BaseTabs.List>
      {tabs.map((tab) => (
        <BaseTabs.Panel key={tab.value} value={tab.value} keepMounted className={PANEL_CLASSES}>
          {tab.panel}
        </BaseTabs.Panel>
      ))}
    </BaseTabs.Root>
  );
}
