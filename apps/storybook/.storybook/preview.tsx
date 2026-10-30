import type { Decorator, Preview } from '@storybook/react-vite';
import { type ReactNode, useLayoutEffect } from 'react';
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

const preview: Preview = {
  tags: ['autodocs'],
  decorators: [withTheme],
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
  },
  initialGlobals: {
    theme: Theme.light,
  },
  parameters: {
    layout: 'fullscreen',
    a11y: {
      test: 'error',
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
