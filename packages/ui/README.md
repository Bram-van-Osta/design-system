# @bram-van-osta/ui

The Bram van Osta React components, on Base UI's primitives, styled with Tailwind 4 on [`@bram-van-osta/tokens`](../tokens). Each one is documented, in every state, light and dark, in the [Storybook](https://bram-van-osta.github.io/design-system/).

| Group | Components |
|---|---|
| Actions | `Button` (primary, secondary, quiet), `IconButton`, `Link` |
| Forms | `Field`, `TextInput`, `PasswordInput`, `Checkbox`, `RadioGroup`, `Select` |
| Layout | `Stack`, `Container` (the 720 px reading column) |
| Identity | `Heading`, `Text`, `Kicker`, `Logo` |
| Feedback | `Dialog`, `Toast` (`ToastProvider` and `useToast`), `Skeleton`, `EmptyState`, `Badge` |

## Using

React 19 and `@base-ui/react` 1.9 are peer dependencies. The app resolves modules as a bundler does (`"moduleResolution": "bundler"`): Phosphor's type declarations need it.

In the app's stylesheet, after Tailwind:

```css
@import 'tailwindcss';
@import '@bram-van-osta/ui/styles.css';
```

It brings the tokens as the theme, the fonts, the keyboard focus (the `focus` token, 2 px, offset by 2 px, on every focusable element), and the components' classes for the app's build to generate.

Around the app, the language of the components' texts, then the toasts:

```tsx
import { ToastProvider, UiProvider } from '@bram-van-osta/ui';

<UiProvider locale={account.language}>
  <ToastProvider>
    <App />
  </ToastProvider>
</UiProvider>;
```

## Texts

The few texts the components show themselves (a field's "(optional)", "Show the password", "Cancel", "Loading…") come in French and English, from `src/i18n/messages.fr.json` and `messages.en.json`. The app replaces any of them, in the reader's language, through `UiProvider`'s `messages`:

```tsx
<UiProvider locale="fr" messages={{ 'dialog.cancel': 'Revenir' }}>
```

Every other text is a prop, given by the app from its own translations.

## Rules the components keep

- Delft blue acts: the primary button, a selected choice. Vermilion draws attention, rarely, and never on a button.
- Square corners, no shadow. Targets of 44 px at least, the primary button and the fields 56 px.
- An error is written in words, in ink, under its field.
- Every component works with the keyboard alone, with a visible focus; the Storybook tests check it, with the accessibility checks, in light, in dark and on a phone.
