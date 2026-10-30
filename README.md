# Bram van Osta design system

The identity of Bram van Osta as code: its tokens and its React components, for every product that carries it.

| Package | What it holds |
|---|---|
| [`@bram-van-osta/tokens`](packages/tokens) | The tokens, without React: CSS variables in light and dark, a Tailwind 4 theme, the fonts and the JSON |
| [`@bram-van-osta/ui`](packages/ui) | The React components, on Base UI, styled with Tailwind on the tokens |

The documentation is the Storybook: https://bram-van-osta.github.io/design-system/.

## Installing

The packages are published to GitHub Packages, which asks for a token even for a public package: a GitHub token with `read:packages`.

In the project, the scope's registry, in `.npmrc`:

```ini
@bram-van-osta:registry=https://npm.pkg.github.com
```

On a computer, the token in the user's `~/.npmrc` (pnpm reads no credentials from a project's `.npmrc`), taken from the environment:

```ini
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

```bash
export NODE_AUTH_TOKEN=$(gh auth token)
```

In GitHub Actions, the job's `packages: read` permission, and `actions/setup-node` with `registry-url: https://npm.pkg.github.com`, the install step receiving `NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}`.

## Using

In a Tailwind 4 app:

```css
@import 'tailwindcss';
@import '@bram-van-osta/ui/styles.css';
```

The tokens become the theme (`bg-delft`, `font-display text-heading-xl`, `p-space-5`), and Tailwind's own palette, type scale, radii and shadows are removed.

Without Tailwind:

```css
@import '@bram-van-osta/tokens/fonts.css';
@import '@bram-van-osta/tokens/tokens.css';
```

Light by default, dark when the system asks for it; `data-theme="light"` or `data-theme="dark"` forces a theme, on `<html>` or on any element. A product overrides a token by redefining its variable after the import.

## Developing

```bash
pnpm install
pnpm typecheck && pnpm lint && pnpm test && pnpm build
pnpm storybook        # on port 6006
```

A change to a published package comes with its changeset (`.changeset/README.md`); merging it publishes the new versions. The rules are in [`docs/rules.md`](docs/rules.md).
