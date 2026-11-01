import type { ReactNode } from 'react';

export interface CopyListItem {
  /** Unique among the list's items. */
  readonly id: string;
  readonly label: ReactNode;
  /** Shown in IBM Plex Mono, and copied. */
  readonly value: string;
  /** The text copied when it differs from the one shown: an IBAN without its spaces. */
  readonly copyValue?: string;
}

export interface CopyListTexts {
  readonly copy: string;
  readonly copied: string;
  readonly failed: string;
}
