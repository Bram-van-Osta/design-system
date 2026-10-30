import { use } from 'react';
import type { Messages } from './messages.ts';
import { MessagesContext } from './messages-context.ts';

export function useMessages(): Messages {
  const messages = use(MessagesContext);
  if (messages === null) {
    throw new Error('A component that shows a text must be rendered inside a UiProvider.');
  }
  return messages;
}
