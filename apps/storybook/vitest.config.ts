import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig, type TestProjectInlineConfiguration } from 'vitest/config';

const DESKTOP = { width: 1280, height: 800 };
const PHONE = { width: 375, height: 812 };

interface Run {
  readonly name: string;
  readonly globals: Readonly<Record<string, string>>;
  readonly viewport: Readonly<{ width: number; height: number }>;
}

// Every story is a test in Chromium: its play function, then the accessibility checks (axe). Each
// run pins the theme, the language of the components' texts and the screen.
const RUNS: readonly Run[] = [
  { name: 'light', globals: { theme: 'light', locale: 'en' }, viewport: DESKTOP },
  { name: 'dark', globals: { theme: 'dark', locale: 'fr' }, viewport: DESKTOP },
  { name: 'phone', globals: { theme: 'light', locale: 'fr' }, viewport: PHONE },
];

function project({ name, globals, viewport }: Run): TestProjectInlineConfiguration {
  return {
    extends: true,
    plugins: [storybookTest({ configDir: '.storybook', initialGlobals: globals })],
    test: {
      name,
      browser: {
        enabled: true,
        headless: true,
        provider: playwright(),
        instances: [{ browser: 'chromium', viewport }],
      },
    },
  };
}

export default defineConfig({
  // Every dependency of the stories is bundled before the run: one found during it reloads the
  // tests, which then fail at random.
  optimizeDeps: {
    entries: ['../../packages/ui/src/**/*.stories.tsx'],
  },
  test: {
    projects: RUNS.map(project),
  },
});
