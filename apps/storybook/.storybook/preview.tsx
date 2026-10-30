import type { Decorator, Preview } from '@storybook/react-vite';
import { type ReactNode, useLayoutEffect } from 'react';
// The provider of the sources the stories render, not of the built package: one React context.
import { Locale } from '../../../packages/ui/src/i18n/messages.ts';
import { UiProvider } from '../../../packages/ui/src/i18n/UiProvider.tsx';
import './preview.css';

const Theme = {
  light: 'light',
  dark: 'dark',
} as const;
type Theme = (typeof Theme)[keyof typeof Theme];

interface ThemedProps {
  readonly theme: Theme;
  readonly children: ReactNode;
}

// The theme goes on <html> too, for what a component renders in a portal (a dialog, a toast).
function Themed({ theme, children }: ThemedProps) {
  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    return () => document.documentElement.removeAttribute('data-theme');
  }, [theme]);
  return (
    <div data-theme={theme} className="bg-bg p-space-5 font-sans text-body text-ink">
      {children}
    </div>
  );
}

const withTheme: Decorator = (Story, { globals }) => (
  <Themed theme={globals.theme === Theme.dark ? Theme.dark : Theme.light}>
    <Story />
  </Themed>
);

const withLocale: Decorator = (Story, { globals }) => (
  <UiProvider locale={globals.locale === Locale.fr ? Locale.fr : Locale.en}>
    <Story />
  </UiProvider>
);

const preview: Preview = {
  tags: ['autodocs'],
  decorators: [withTheme, withLocale],
  globalTypes: {
    theme: {
      description: 'The theme of the stories',
      toolbar: {
        title: 'Theme',
        icon: 'contrast',
        items: [
          { value: Theme.light, title: 'Light' },
          { value: Theme.dark, title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
    locale: {
      description: 'The language of the texts the components show',
      toolbar: {
        title: 'Language',
        icon: 'globe',
        items: [
          { value: Locale.en, title: 'English' },
          { value: Locale.fr, title: 'French' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: Theme.light,
    locale: Locale.en,
  },
  parameters: {
    layout: 'fullscreen',
    a11y: {
      test: 'error',
      // The whole page, for what a component renders in a portal.
      context: 'body',
    },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Foundations',
          'Actions',
          'Forms',
          'Layout',
          'Identity',
          'Feedback',
        ],
      },
    },
  },
};

export default preview;
