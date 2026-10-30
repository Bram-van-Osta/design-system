import { createContext } from 'react';
import type { Messages } from './messages.ts';

export const MessagesContext = createContext<Messages | null>(null);
