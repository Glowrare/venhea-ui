# Baseline preparation report

Prepared November 22, 2026 for the Aurora UI Kit GitHub recording sandbox.

## Result

The library is `@aurora-sandbox/ui-kit` version `1.2.0`, ESM-only, with React 19
peers, strict TypeScript, named component/type exports, and an explicit CSS
export. It is private and packable; no npm publishing is configured.

The workspace started empty, without a Git repository. Preparation initialized
`main` and recorded ordinary scaffolding, component, test, package-check, and
documentation commits without backdating or replacing existing history.
The final preparation commit is the local annotated `v1.2.0` baseline.

## Files created

| Area | Files |
| --- | --- |
| Public library | `src/index.ts`; `src/components/{Button,Badge,Input,Card,Modal}.tsx`; internal `classes.ts` |
| Design | `src/styles.css`, including shared tokens and reduced-motion support |
| Package/build | `package.json`, `package-lock.json`, `tsconfig.json`, `tsconfig.build.json`, `vite.config.ts`, `.nvmrc` |
| Tests | `vitest.config.ts`, `tests/setup.ts`, five component test files |
| Build/consumer checks | `scripts/copy-styles.mjs`, `scripts/verify-package.mjs` |
| Documentation | `README.md`, `CONTRIBUTING.md`, `docs/ARCHITECTURE.md`, `docs/BASELINE.md`, this report |
| Repository hygiene | `.gitignore`, `.gitattributes`, MIT `LICENSE` |

Ignored local outputs include the compiled `dist/` directory, `node_modules/`,
and `aurora-sandbox-ui-kit-1.2.0.tgz`.

## Validation results

Validation used **Node v26.13.0** and **npm 11.14.1**. An isolated runtime was
installed in a temporary directory; the machine's existing Node 22 installation
was left unchanged. Session-only npm settings used the system certificate store
and a writable temporary cache. TLS verification remained enabled, and no global
npm or Git settings were changed.

| Check | Result |
| --- | --- |
| Fresh `npm ci` from the committed lockfile | Passed; 106 packages installed, 0 audit vulnerabilities reported |
| `npm test` after clean installation | Passed: 5 test files, 24 tests |
| `npm run typecheck` | Passed with strict checking and no emitted files |
| `npm run build` | Passed: Vite ESM bundle, declarations, copied CSS |
| `npm run test:package` | Passed, including the real `npm pack`/`prepack` lifecycle |
| Archive installation | Passed in a temporary consumer using offline cached React 19 dependencies |
| Consumer runtime | All eight named exports loaded; Button server rendering and closed Modal rendering passed |
| Consumer CSS | Export resolved; tokens and reduced-motion rules present |
| Consumer TypeScript | Passed strict NodeNext resolution; all five prop types, refs, and expected invalid-prop errors checked |
| Whitespace check | `git diff --check` passed |

Interaction tests cover button keyboard activation and blocked loading/disabled
interaction; input label/help/error relationships, typing, unique IDs and refs;
badge text; card composition; and modal portal semantics, initial focus, Tab in
both directions, focus-escape prevention, Escape/close/backdrop dismissal,
focus restoration, updated callbacks, dynamic background inertness, and
StrictMode/unmount cleanup.

## Verified archive

File: `aurora-sandbox-ui-kit-1.2.0.tgz` — **8,932 bytes**, **12 files**.

SHA-256:

```text
94548131f8ebc8cade33de423144b24404ddcd1ee77e5d4be55c333bb501458b
```

Contents:

```text
LICENSE
README.md
dist/components/Badge.d.ts
dist/components/Button.d.ts
dist/components/Card.d.ts
dist/components/Input.d.ts
dist/components/Modal.d.ts
dist/components/classes.d.ts
dist/index.d.ts
dist/index.js
dist/styles.css
package.json
```

The JavaScript bundle is approximately 5.77 kB (2.02 kB gzip). React and React DOM
remain external. The internal class helper's declaration is included by the
declaration build but has no public export. Source, tests, lockfile, scripts,
reports, caches, and Git metadata are excluded from the package.

## Git baseline and remote handoff

The handoff checks require `main` to equal the commit resolved by `v1.2.0`, the
tag object to be annotated, an empty working-tree status, and an empty
`v1.2.0..main` log range. Retrieve the baseline commit with:

```sh
git rev-parse 'v1.2.0^{commit}'
```

No remote is configured, no push was performed, and no GitHub Release or asset
was created. [BASELINE.md](BASELINE.md) provides exact manual repository creation,
push, and historical Release commands. No feature or fix commits belong after
the tagged baseline until the recording begins.

## Outstanding limitations and recording boundary

- Use Node 26.13.0+ for development and the recording; the system default Node
  installation has not been upgraded.
- Accessibility behavior is covered in jsdom. Actual browser layout, touch
  interaction, and assistive-technology testing were not performed. This is a
  synthetic sandbox, not a production accessibility certification.
- Modal supports one open dialog at a time in the main document and requires
  modern browser support for `inert`. Nested/concurrent dialogs, shadow roots,
  iframe coordination, and custom initial focus are not provided.
- Distribution is ESM-only. Consumers import CSS explicitly and provide React
  and React DOM 19. No CommonJS entry point or browser demo is included.
- Remote repository creation and the historical GitHub Release remain manual,
  unperformed handoff steps. No branch protection, rulesets, secrets, or
  credentials were configured.
- Semantic-release, Changesets, Release Please, changelog/version automation,
  release workflows, tag automation, release publication, and asset attachment
  are absent. There is no CI workflow. All release engineering remains for the
  recorded task.
