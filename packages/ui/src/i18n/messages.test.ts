import { describe, expect, it } from 'vitest';
import { Locale, MESSAGE_KEYS, MESSAGES } from './messages.ts';

describe('MESSAGES', () => {
  it.each(Object.values(Locale))('should hold exactly the message keys in %s', (locale) => {
    expect(Object.keys(MESSAGES[locale]).sort()).toEqual([...MESSAGE_KEYS].sort());
  });

  it.each(Object.values(Locale))('should hold no empty text in %s', (locale) => {
    for (const text of Object.values(MESSAGES[locale])) {
      expect(text.trim()).not.toBe('');
    }
  });
});
