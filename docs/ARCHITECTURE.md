# Architecture

Venhea UI is a single ESM package with no production runtime dependencies
other than its React 19 and React DOM 19 peers.

- `src/index.ts` defines the public exports. Components expose named prop types;
  internal class-name and focus helpers are not public package exports.
- Components render native elements. Button, Badge, Input, and the Card family
  forward native props and React 19 refs. Input owns stable IDs and connects its
  visible label, help, and error text to the native input.
- Modal owns only browser interaction effects; its parent owns visibility. A
  body portal separates the dialog from inert application content. An effect
  manages focus containment, keyboard handling, background inertness, and body
  overflow. Cleanup reverses effects and restores focus. Only one open modal is
  supported; there is no global modal stack.
- `src/styles.css` defines shared tokens and scoped component classes. Consumers
  explicitly import the exported stylesheet and may override tokens.
- `showcase/` is a local React app served by its own Vite configuration through
  `npm run dev`. It imports library source and shared CSS, uses only browser
  state, and is typechecked alongside the library. It is excluded from public
  exports, emitted declarations, and the package's distribution allowlist.
- Vite bundles JavaScript while externalizing React and React DOM. TypeScript
  emits declarations separately, and a small Node script copies CSS. Relative
  declaration imports use `.js` extensions to support NodeNext consumers.
- Vitest uses jsdom with React Testing Library and user-event for component
  behavior. The package smoke check uses the actual tarball in an isolated,
  temporary React consumer and checks both runtime and TypeScript resolution.

The archive is controlled by the package's `files` allowlist. Generated output
is ignored by Git. No publishing, release, tag, changelog, or version automation
is part of this architecture.
