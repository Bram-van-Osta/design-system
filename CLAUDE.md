# CLAUDE.md — design system

## Context

The Bram van Osta design system: the identity as code, for every product that carries it, the factory's portal first. A public repository, published to GitHub Packages. It holds no business code: no data access, no authentication, no routing.

pnpm and Turborepo monorepo:
- `packages/tokens`: `@bram-van-osta/tokens`, the tokens without React. `src/tokens.json` is the source; the build generates the CSS variables, the Tailwind 4 theme and the JSON;
- `packages/ui`: `@bram-van-osta/ui`, the React components on Base UI, styled with Tailwind on the tokens;
- `apps/storybook`: the living documentation, deployed to GitHub Pages: https://bram-van-osta.github.io/design-system/.

The design board is the artifact [Bram van Osta](https://claude.ai/artifact/7kj2Fo2kHaNALMfrZdX7Pe), read with the Artifact tool: its tokens, its components and its brand book are the reference. Where this repository and the artifact differ, the artifact prevails. The factory's identity summary is `docs/identity/bram-van-osta.md` in `Bram-van-Osta/Factory`.

## Language

Everything in the repository is in English: code, identifiers, comments, docs, changesets, commits, PRs. The texts a component shows come in French and English, through the package's translations (`docs/rules.md`, section 1).

## Workflow

Changes come from a ticket of a product (FX-n for the factory), with its goal and its manual validations.

1. A branch `type/fx-n-short-subject` from an up-to-date `main`. Never a direct push to `main`.
2. Implement according to `docs/rules.md`, then `pnpm typecheck && pnpm lint && pnpm test && pnpm build`.
3. A change to a published package comes with its changeset, versioned in the same pull request (`.changeset/README.md`).
4. Try what can be tried without starting a server, then commit. During the alpha (until the factory's MVP is online), the manual validations (👤) do not block: the ticket's "Delivered" section says which ones were checked, and Bram runs them all in one test pass.
5. Push, open the PR, and squash-merge it once the CI is green. Merging publishes the new versions and the Storybook. From the factory's first production release on, committing before the manual validations, pushing and merging need Bram's explicit approval.

**Never start a server**: not `pnpm storybook`, not through the preview panel. To see the Storybook, ask Bram to start it and attach to its address, or read the online one.

## Commands

```bash
pnpm install          # dependencies, and the git hooks (lefthook)
pnpm typecheck        # TypeScript 7, strict
pnpm lint             # Biome
pnpm test             # Vitest
pnpm build            # the packages, then the Storybook
pnpm format           # Biome, safe fixes applied
pnpm changeset        # describe a change to a published package
pnpm storybook        # Bram only: the Storybook on port 6006
```

## Commits and PRs

- Format: `type(scope): FX-12 description in English`, on one line, under 100 characters, no body. commitlint refuses any other format.
- **Types**: feat, fix, refactor, test, chore, ci, docs. **Scopes**: tokens, ui, storybook, ci, docs; none for the workspace tooling (`chore: …`).
- **One commit = one step.** No WIP commit, and no "fix lint" afterwards.
- **No attribution** and no mention of Claude or of an agent, in commits as in PRs.
- **PRs are squash-merged**: their title becomes the commit on `main` and names every scope touched. A factual description: what changes, how to test, the versions it publishes.
- Never `--force` (`--force-with-lease` only, on your own branch), never an auto-merge.

## Code rules

@docs/rules.md

## What Claude must never do

- Commit if `pnpm typecheck`, `pnpm lint`, `pnpm test` or `pnpm build` fails.
- Edit a generated file (`dist/`, a `CHANGELOG.md`) by hand, or publish a package by hand.
- Write a stub, a TODO or placeholder code.
- Use an `any`, an `as` cast or a `!` assertion to unblock a type, or a `console.log`.
- Write a color in hexadecimal outside `tokens.json`, or a business rule in a component.
- Use icons other than Phosphor, or shadcn.
- Push directly to `main`, use `--force`, or enable an auto-merge.
- After the factory's first production release: commit before Bram's manual validation (👤), push or merge without Bram's explicit approval.
- Mention Claude or add an attribution in a commit, a PR or a document.
- Start a server, by command or through the preview panel.
