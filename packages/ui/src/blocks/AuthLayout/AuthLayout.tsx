import type { ReactNode } from 'react';
import { Kicker, KickerTone } from '../../components/Kicker/Kicker.tsx';
import { Tulip } from '../../components/Logo/Tulip.tsx';
import { hasContent } from '../../utils/has-content.ts';
import { BrandBar } from '../shared/BrandBar.tsx';

// The large tulip of the panel, as round 7 draws it.
const PANEL_TULIP_SIZE = 132;

export interface AuthLayoutProps {
  /** What the app holds, in one sentence: the panel's, on a phone the band's above the form. */
  readonly statement: ReactNode;
  /** The line above the statement, in the panel: who the app is for. */
  readonly statementKicker: ReactNode;
  /** Beside the logo: the app's role, such as "operator". */
  readonly role?: ReactNode;
  /**
   * The language switch: on a computer, at the top right of the panel, across from the large tulip;
   * on a phone, at the end of the top bar.
   */
  readonly headerEnd?: ReactNode;
  /** The authentication block. */
  readonly children: ReactNode;
}

/**
 * The frame of the authentication blocks: on a computer, the block in a column at a short form's
 * width, beside a grey panel with the large tulip and the statement; on a phone, the statement in a
 * grey band above the block.
 *
 * The panel comes first in the DOM and last on screen, so that on a computer the keyboard reaches
 * its language switch, on the top row, before the form.
 */
export function AuthLayout({
  statement,
  statementKicker,
  role,
  headerEnd,
  children,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-bg lg:flex-row-reverse">
      <aside className="hidden flex-1 flex-col justify-between gap-space-7 bg-surface p-space-9 lg:flex">
        <div className="flex items-start justify-between gap-space-4">
          <Tulip size={PANEL_TULIP_SIZE} className="block shrink-0" />
          {headerEnd}
        </div>
        <div className="flex max-w-reading-width flex-col gap-space-5">
          <Kicker tone={KickerTone.muted}>{statementKicker}</Kicker>
          <p className="text-balance font-display text-heading-xl text-ink">{statement}</p>
        </div>
      </aside>
      <div className="flex flex-1 flex-col lg:flex-none lg:px-space-9 lg:py-space-6">
        <header className="flex flex-col gap-space-5 bg-surface px-space-4 pt-space-4 pb-space-6 lg:bg-transparent lg:p-0">
          <BrandBar
            role={role}
            end={hasContent(headerEnd) && <div className="flex lg:hidden">{headerEnd}</div>}
          />
          <p className="text-balance font-display text-heading-xs text-ink lg:hidden">
            {statement}
          </p>
        </header>
        <main className="flex flex-1 flex-col px-space-4 pt-space-6 pb-space-7 lg:w-form-width lg:justify-center lg:px-0 lg:py-space-7">
          {children}
        </main>
      </div>
    </div>
  );
}
