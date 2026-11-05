import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { type ReactNode, useRef } from 'react';
import { useControllableValue } from '../../utils/use-controllable-value.ts';
import { useOpenTabInView } from './use-open-tab-in-view.ts';

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

// A row wider than its box scrolls in it, never the page. The box reaches past the row by the
// focus ring's 4 px, by a padding its negative margin takes back, so the ring is never cut.
const SCROLLER_CLASSES = '-m-space-1 overflow-x-auto p-space-1';
// The rule under the whole row, however far it scrolls, is drawn before the tabs, so the open
// tab's underline covers it.
const LIST_CLASSES =
  'relative flex w-max min-w-full gap-space-5 before:absolute before:inset-x-0 before:bottom-0 before:border-b-hair before:border-line';
const TAB_CLASSES =
  'relative inline-flex min-h-target-min cursor-pointer items-center whitespace-nowrap border-b-select border-transparent px-space-1 text-body-s font-medium text-ink-muted hover:not-data-active:bg-surface hover:not-data-active:text-ink data-active:border-delft data-active:font-semibold data-active:text-ink';
const PANEL_CLASSES = 'pt-space-4';

function stringValueHandler(onValueChange: (value: string) => void) {
  return (value: unknown) => {
    if (typeof value === 'string') {
      onValueChange(value);
    }
  };
}

/**
 * A few panels behind a row of tabs, underlined at their width on a rule, one open: the arrow keys
 * move between the tabs and open them, Home and End too. Each label stays on one line; a row wider
 * than its box, on a phone, scrolls sideways in it and keeps the open tab in view.
 */
export function Tabs({ label, tabs, value, defaultValue, onValueChange, className }: TabsProps) {
  const [openValue, setOpenValue] = useControllableValue(value, defaultValue ?? tabs[0]?.value);
  const scrollerRef = useRef<HTMLDivElement>(null);
  useOpenTabInView(
    scrollerRef,
    tabs.findIndex((tab) => tab.value === openValue),
  );
  return (
    <BaseTabs.Root
      value={openValue}
      onValueChange={stringValueHandler((nextValue) => {
        setOpenValue(nextValue);
        onValueChange?.(nextValue);
      })}
      className={className}
    >
      <div ref={scrollerRef} className={SCROLLER_CLASSES}>
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
      </div>
      {tabs.map((tab) => (
        <BaseTabs.Panel key={tab.value} value={tab.value} keepMounted className={PANEL_CLASSES}>
          {tab.panel}
        </BaseTabs.Panel>
      ))}
    </BaseTabs.Root>
  );
}
