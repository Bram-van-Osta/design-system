import { createContext } from 'react';
import type { Locale } from './messages.ts';

export const LocaleContext = createContext<Locale | null>(null);
