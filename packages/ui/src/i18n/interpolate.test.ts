import { describe, expect, it } from 'vitest';
import { interpolate, placeholdersOf } from './interpolate.ts';

describe('interpolate', () => {
  it('should fill every placeholder with its value', () => {
    expect(
      interpolate('At least {count} characters for {email}', { count: 12, email: 'a@b.fr' }),
    ).toBe('At least 12 characters for a@b.fr');
  });

  it('should leave a placeholder without a value as it is', () => {
    expect(interpolate('For {email}', {})).toBe('For {email}');
  });
});

describe('placeholdersOf', () => {
  it('should list the placeholders of a message, sorted', () => {
    expect(placeholdersOf('{email}, {count} and {email}')).toEqual(['count', 'email', 'email']);
  });

  it('should list nothing for a message without placeholders', () => {
    expect(placeholdersOf('Sign in')).toEqual([]);
  });
});
