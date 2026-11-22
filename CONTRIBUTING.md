# Contributing to Aurora UI Kit

Contributions to `aurora-ui-kit` are welcome, including bug reports,
accessibility improvements, documentation, and component enhancements. For a
substantial API or behavior change, open an issue first to discuss the design.
Small fixes and documentation improvements can go directly to a pull request.

## Install and set up

Use **Node 26.13.0 or newer** and npm. The repository's `.nvmrc` selects Node
26.13.0. React and React DOM 19 are installed as development dependencies and
are peer dependencies of the library.

Fork the repository on GitHub, then clone your fork. Replace `YOUR_USERNAME`
with your GitHub account:

```sh
git clone https://github.com/YOUR_USERNAME/aurora-ui-kit.git
cd aurora-ui-kit
npm ci
```

Use the committed `package-lock.json` for reproducible installs. If you change
dependencies, update it with npm and include it in your pull request. Do not
introduce another package manager's lockfile. On Windows PowerShell, use
`npm.cmd` if your execution policy blocks `npm.ps1`.

## Local development

Components live in `src/components/`, public exports in `src/index.ts`, and
shared tokens and styles in `src/styles.css`. Tests live in `tests/`. Read the
[architecture overview](docs/ARCHITECTURE.md) before making structural changes.

Run component tests in watch mode while making changes:

```sh
npm run test:watch
```

Preserve native element props and refs, accessible names and descriptions,
keyboard interaction, visible focus, and reduced-motion support. Add regression
tests for behavior changes. Keep examples free of personal data and credentials.
For visual changes, check the components in a React 19 application and include
keyboard and assistive-technology checks where relevant.

## Test, typecheck, and build

Run these checks before requesting review:

```sh
npm test
npm run typecheck
npm run build
npm run test:package
```

| Command | Purpose |
| --- | --- |
| `npm test` | Run the Vitest and React Testing Library component tests once |
| `npm run typecheck` | Check source, tests, and configuration with strict TypeScript |
| `npm run build` | Produce ESM JavaScript, TypeScript declarations, and CSS in `dist/` |
| `npm run test:package` | Build and pack the library, then verify installation, exports, CSS, and types in a temporary consumer |

The package check uses the npm cache populated by `npm ci` to install its
temporary consumer offline. Keep the same cache available for both commands.
Component tests use jsdom; they do not replace browser or screen-reader testing.

To try the package in a separate application, run `npm pack` and install the
resulting archive there. At version 1.2.0, the filename is
`aurora-ui-kit-1.2.0.tgz`. Import `aurora-ui-kit/styles.css` once in that
application's entry point; see the [README](README.md) for usage examples.
The package has `private: true`; use the local archive rather than npm publishing.

Do not commit generated `dist/`, `node_modules/`, package archives, coverage
output, or local environment files.

## Commit messages

Use Conventional Commits with a concise imperative summary:

```text
type(scope): summary
```

The scope is optional and identifies the affected component or area. Use
`feat` for a new capability, `fix` for a bug correction, and `docs` for a
documentation change. `test` and `chore` are appropriate for tests and routine
maintenance. For example:

```text
feat(button): add an outline variant
fix(input): preserve external description references
docs: explain the aurora-ui-kit stylesheet import
```

For an incompatible public API change, add `!` before the colon and describe
the impact and migration in a `BREAKING CHANGE:` footer. A hypothetical variant
rename would look like this:

```text
feat(button)!: rename the primary variant to solid

BREAKING CHANGE: Replace variant="primary" with variant="solid".
```

## Branches and pull requests

1. Start from an up-to-date `main` branch. In a fork, use GitHub's **Sync fork**
   action, then update your local checkout:

   ```sh
   git switch main
   git pull --ff-only origin main
   git switch -c feat/button-outline
   ```

   Choose a descriptive branch name such as `feat/button-outline`,
   `fix/input-description`, or `docs/contributing`.

2. Keep the change focused, update relevant tests and documentation, and run
   the checks above. Review your diff before committing.
3. Commit with a Conventional Commit message, then push your branch:

   ```sh
   git push -u origin feat/button-outline
   ```

4. Open a pull request from your branch to the project's `main` branch. Explain
   the problem, the proposed behavior, and any compatibility impact. Link a
   related issue when applicable and include the commands you ran and their
   results. Add screenshots for visual changes and describe accessibility
   checks for interaction changes.
5. Respond to review feedback on the same branch and rerun affected checks after
   updates. Maintainers review and merge accepted changes into `main`.
