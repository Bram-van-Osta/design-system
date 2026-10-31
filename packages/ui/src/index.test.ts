/// <reference types="vite/client" />
import { describe, expect, it } from 'vitest';
import * as entry from './index.ts';

// A component or a block documented by its stories is public: the package's entry exports it.
const STORIES = Object.keys(import.meta.glob('./{components,blocks}/*/*.stories.tsx'));
const SOURCES = new Set(Object.keys(import.meta.glob('./{components,blocks}/*/*.tsx')));

function documentedNames(): readonly string[] {
  return STORIES.map((story) => story.replace(/\.stories\.tsx$/, '.tsx'))
    .filter((source) => SOURCES.has(source))
    .map((source) => source.slice(source.lastIndexOf('/') + 1, -'.tsx'.length))
    .sort();
}

describe('the package entry', () => {
  it('should find the documented components and blocks', () => {
    expect(documentedNames()).toEqual(
      expect.arrayContaining(['Button', 'SignIn', 'SetPassword', 'VerifyEmail']),
    );
  });

  it.each(documentedNames())('should export %s', (name) => {
    expect(Object.keys(entry)).toContain(name);
  });
});
