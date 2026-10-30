# Changesets

A change to a published package comes with its changeset, in the same pull request:

1. `pnpm changeset`: the packages, the bump (patch, minor or major) and one English sentence for the changelog;
2. `pnpm changeset version`: the changesets become the new versions and their `CHANGELOG.md`. A package that depends on a bumped one is bumped too.

Merging the pull request publishes the new versions to GitHub Packages, with their tags and their GitHub releases (the Release workflow).
