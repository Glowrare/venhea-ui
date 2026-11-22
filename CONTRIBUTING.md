# Contributing to Aurora UI Kit

Use Node 26.13.0+ and the committed npm lockfile. Start with `npm ci`; do not
replace the lockfile with another package manager's format.

Before a change is ready for review:

```sh
npm test
npm run typecheck
npm run build
npm run test:package
```

Add tests for changed interaction and accessibility behavior. Preserve native
element props, refs, visible focus, accessible names, and the explicit stylesheet
export. Keep sample content synthetic. Do not commit generated `dist/`, archives,
credentials, or customer data.

## Commit messages

Use a conventional-commit subject describing the user-visible change or concrete
maintenance work. For example:

```text
feat(button): add a quiet variant
fix(input): preserve external description references
test(modal): cover focus restoration when closing
docs: clarify archive installation
chore: refresh development dependencies
```

For an incompatible API change, explain the impact and migration in the commit
body and use a breaking-change marker:

```text
feat(button)!: rename the compact size

BREAKING CHANGE: use size="sm" instead of size="compact".
```

These examples are guidance only. There are no commit hooks, commit analyzer,
automatic version changes, or release jobs in the baseline.

## Recording boundary

The preparation baseline is version 1.2.0 on `main`, tagged `v1.2.0`. Keep that
baseline intact until the recording. Create the test feature branch and PR
during recording. Do not move the baseline tag or add unreleased feature/fix
commits to the prepared `main` branch.

The future recording owns release tooling, workflow permissions, changelog and
version policy, GitHub Release creation, and asset attachment. Do not prebuild
that work as part of sandbox preparation. npm publication is out of scope.
