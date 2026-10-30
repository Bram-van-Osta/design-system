# Code rules

The rules that every change follows and every review checks, tests included. `CLAUDE.md` loads this document in every session.

They are the factory's (`docs/rules.md` in `Bram-van-Osta/Factory`), kept to what a design system needs: no API, no database, no business code here.

1. [Language and texts](#1-language-and-texts)
2. [TypeScript](#2-typescript)
3. [Naming](#3-naming)
4. [Structure and clean code](#4-structure-and-clean-code)
5. [Tokens](#5-tokens)
6. [Components](#6-components)
7. [Tests](#7-tests)
8. [Dependencies](#8-dependencies)
9. [Versions and releases](#9-versions-and-releases)

## 1. Language and texts

- **English, everywhere in the repository**: the code, the identifiers, the comments, the docs, the token usages, the stories, the changesets, the commits, the PRs.
- **The texts a component shows** come in French and English, both complete, from the package's translations (`messages.fr.json` and `messages.en.json`), and the app can replace them. French appears only there. The commit hook refuses an accented character in a `.ts` or `.tsx` file.
- **No hardcoded visible text** in a component: a translation key, or a prop.
- **A test checks that every key exists in both languages.**
- **The French copy** follows the identity: the formal « vous », short sentences, the imperative in instructions, French typography (a non-breaking space before `?`, `!`, `:` and `;`, « » quotes). **The English copy**: American English, straight quotes.
- **Neutral examples** in the stories: `example.com`, Jeanne Martin, the Boulangerie du Port. Never real data.
- **Comments** are as rare as possible, kept for a constraint the code cannot show. Never a paraphrase.

## 2. TypeScript

- `strict` and `noUncheckedIndexedAccess`: an indexed access can be `undefined`, and that case is handled.
- **Never `any`, `@ts-ignore`, an `as` cast or a `!` assertion.** Only `as const` and `satisfies` are allowed. Typing is fixed at the source, with a type guard or a Zod schema. Biome refuses them.
- **Erasable syntax only**: no `enum`, no `namespace`. An "enum" is an `as const` object and its type.
- `import type` for types, and the `.ts` or `.tsx` extension in relative imports.
- `const` by default, `readonly` on properties and props.

## 3. Naming

- Files in kebab-case (`tokens-css.ts`), except a React component, in PascalCase (`Button.tsx`).
- Types and components in PascalCase, variables and functions in camelCase, constants in UPPER_SNAKE_CASE.
- Tokens in kebab-case, named by their role, never by their value (`ink-muted`, not `gray-60`).
- Props: `is`, `has`, `can`, `should` for booleans; `on…` for the actions the app passes.
- Explicit names, without abbreviations.

## 4. Structure and clean code

- Functions of about thirty lines at most, two levels of indentation at most, early return.
- More than two parameters: a named object.
- No nested ternary: a named function, a lookup table or a component.
- No magic number or string: a token, or a named constant.
- **Search before creating**: a component, a helper or a token that already does half the work.
- Factor out from the second occurrence. Follow the repository's dominant pattern.
- **The boy scout rule**: in the files touched, fix along the way a duplicate, dead code, a superfluous comment or a misleading name, and say so in the PR.
- **No stub, TODO or placeholder code.**
- **The format** is Biome's: width 100, single quotes, semicolons, trailing commas, 2-space indentation.

## 5. Tokens

- **`packages/tokens/src/tokens.json` is the only source.** It keeps the artifact's shape and values; a change made here goes back to the artifact, and the reverse.
- **The generated files** (`dist/tokens.css`, `dist/tailwind.css`, `dist/tokens.json`) are never edited: change the source or the generator.
- **A new color is a token first**, with its role and its usage note, in both themes. A usage note says where the token goes and, for a text color, its contrast on its grounds.
- **One namespace**: colors, spacing, radii, sizes and borders become `--name`, so a name is used once across them. Type styles become `--text-name`.
- **In Tailwind**, each utility reads its token's variable, and Tailwind's palette, type scale, radii and shadows are removed. A utility the theme does not offer is a missing token, not an arbitrary value.
- **Every token can be overridden** by a product, by redefining its variable. Nothing reads a token's value at build time where a variable would do.

## 6. Components

- **On Base UI's primitives**, styled with Tailwind on the tokens. No shadcn.
- **No business logic**: no translation library, no data access, no router, no network. An action is a prop (`onSubmit`), its state too (`isPending`), and a link the app's (`{ href }` or `{ render }`). Biome holds the package to React, Base UI and Phosphor, and refuses `fetch` and the other network globals.
- **One component per file**, in `packages/ui/src/components/<Name>/`, with its stories next to it. A block, a screen assembled from the components (`SignIn`), lives in `packages/ui/src/blocks/<Name>/`. The package's entry exports them.
- **The logic in hooks**, not in the JSX.
- **The identity** (the artifact's brand book):
  - colors through the tokens, never in hexadecimal;
  - Delft blue to act, vermilion for attention, rarely, never on a button;
  - square corners, no shadow;
  - targets of 44 px at least, the primary button 56 px;
  - a reading column of 720 px at most.
- **The keyboard**: everything can be reached with the keyboard, with a visible focus (`focus`, 2 px, offset by 2 px).
- **The states**: loading, empty, error, disabled. An unavailable action is hidden, except the commands of a form or a dialog, which stay displayed and disabled.
- **Icons**: Phosphor only, and never an emoji.
- **Stories**: every state, in light and dark, on a small screen, with the accessibility checks passing.

## 7. Tests

- **Unit tests** (`*.test.ts`) live next to the code and run with Vitest, without a server.
- **Tests follow the code rules**: constants, "enums", no cast.
- **The generators** are tested on their output, and the Tailwind theme through Tailwind's own compiler.
- **The components** are tested through their stories: interactions and accessibility checks.
- **Never a skipped test.** A fix comes with its regression test.

## 8. Dependencies

- **Start from the latest stable version, published at least two weeks ago.** Before adding a dependency, check its latest version (`npm view <package> time`) and read its release notes.
- **Exact versions**, without `^` (`savePrefix: ''`). A tool shared by several packages goes through the catalog of `pnpm-workspace.yaml`.
- **Peer dependencies are ranges** (`react`, `react-dom`, `@base-ui/react`): the app chooses its version within them.
- **An install script only runs if it is listed** in `allowBuilds`.
- **Renovate** keeps the dependency dashboard. Every lag has its written reason.

## 9. Versions and releases

- **Semantic versioning.** A removed or renamed token, component or prop is breaking: a major, or a minor while the version is `0.x`.
- **A change to a published package comes with its changeset**, versioned in the same pull request: `pnpm changeset`, then `pnpm changeset version` (`.changeset/README.md`).
- **One English sentence per changeset**, for whoever upgrades: what changes for them.
- **Merging publishes**: the Release workflow publishes the new versions to GitHub Packages, with their tags and GitHub releases. Never a publication by hand.
- **The packages depend on each other at the exact version** (`workspace:*`): a new version of the tokens brings a new version of the components.
