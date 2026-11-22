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

Use these examples as commit-message guidance. Keep npm publication disabled
for this private sandbox package.
