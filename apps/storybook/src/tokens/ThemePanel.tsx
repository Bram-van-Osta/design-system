import type { ReactNode } from 'react';

type ThemePanelProps = {
  readonly theme: string;
  readonly children: ReactNode;
};

// A part of the page held in one theme, whatever the system's: its own background and ink.
export function ThemePanel({ theme, children }: ThemePanelProps) {
  return (
    <div data-theme={theme} className="bg-bg p-space-4 font-sans text-body text-ink">
      {children}
    </div>
  );
}
