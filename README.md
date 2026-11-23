# Venhea UI

A small TypeScript and React component library with accessible defaults and a
quiet teal visual design built on shared design tokens.
The package is **`venhea-ui` version `1.2.0`**.

This private package can be distributed as a `.tgz` file without
publishing to npm.

## Setup and validation

Use Node **26.13.0 or newer** and npm. `.nvmrc` selects 26.13.0.
React and React DOM 19 are peer dependencies.

```sh
npm ci
npm test
npm run typecheck
npm run build
npm run test:package
```

`npm test` runs once; `npm run test:watch` watches component tests.
`npm run test:package` builds and packs the library, installs the archive into a
temporary consumer, checks runtime imports and CSS resolution, and compiles a
TypeScript consumer using NodeNext resolution. It uses the npm cache populated
by `npm ci` for the temporary consumer and removes that consumer afterward.

On Windows PowerShell, use `npm.cmd` if the execution policy blocks `npm.ps1`.
If your environment uses an organization certificate authority, Node supports
`NODE_OPTIONS=--use-system-ca`; keep certificate verification enabled. An npm
cache outside a restricted workspace may need a writable location configured
through the session's `npm_config_cache` environment variable.

## Local development and component showcase

After `npm ci`, start the Vite showcase:

```sh
npm run dev
```

Open **http://127.0.0.1:5173/** in your browser. The server listens on loopback
only; stop it with Ctrl+C. If port 5173 is busy, use `npm run dev -- --port 5174`
and open the URL Vite prints.

The responsive showcase displays all five components with their existing styles
and tokens. Try Button variants, sizes, disabled and loading states; all Badge
variants; editable, invalid, disabled and read-only Inputs; composed Cards; and
a Modal that updates the example workspace name. Explore with Tab and Shift+Tab,
and close the dialog with Escape, Cancel, its close button, or the backdrop.
Examples use local React state, reset on reload, and do not send data anywhere.

Edit `showcase/` for the page and `src/` for the components. Vite reloads the page
as files change. `npm run test:watch` runs component tests during development.
The showcase is included in strict typechecking, but its separate Vite config
does not change `npm run build`, which builds the library only. Showcase code
is not a public export and is excluded from declarations and the npm archive.

## Install the local package

In this repository:

```sh
npm pack
```

In a React 19 application, install the resulting archive using its actual path:

```sh
npm install /path/to/venhea-ui-1.2.0.tgz
```

Import styles once in the application's entry point. JavaScript imports do not
inject styles. All component and prop-type exports are named; there is no
default export or CommonJS entry point.

```tsx
import 'venhea-ui/styles.css';
import { Button, Badge, Input } from 'venhea-ui';
import type { ButtonProps } from 'venhea-ui';

const saveButton: ButtonProps = { variant: 'primary', size: 'md' };

export function DraftFields() {
  return (
    <div>
      <Badge variant="info">Draft</Badge>
      <Input
        label="Workspace name"
        name="workspace"
        description="Use a synthetic workspace name."
        defaultValue="Venhea demo"
      />
      <Button {...saveButton}>Save draft</Button>
    </div>
  );
}
```

## Components

### Button

Variants: `primary` (default), `secondary`, `danger`. Sizes: `sm`, `md` (default),
`lg`. Native button props and refs are supported. Buttons default to
`type="button"`; opt into form submission with `type="submit"`.
Set `fullWidth` to make a button full its available container width.

```tsx
<Button variant="secondary" size="sm">Cancel</Button>
<Button variant="danger" size="lg" disabled>Delete demo</Button>
<Button loading>Saving draft</Button>
<Button fullWidth>Save changes</Button>
```

Loading disables interaction, exposes `aria-busy`, and keeps the supplied text
as the accessible name. Supply text, or `aria-label` for an icon-only button.

### Badge

Variants: `neutral` (default), `info`, `success`, `warning`, `danger`. Badges are
plain spans with native props and refs. Always include meaningful text so status
is conveyed independently of color. Add a live region in the application if a
changing status needs an announcement.

```tsx
<Badge variant="success">Checks passed</Badge>
<Badge variant="warning">Review pending</Badge>
```

### Input

`label` is required. `description` and `error` are optional text. Native input
props and refs are supported, including controlled and uncontrolled values.
Generated IDs are stable and unique; an explicit `id` is also supported.
External `aria-describedby` references are merged with help and error IDs.

```tsx
<Input
  id="demo-email"
  label="Demo email"
  type="email"
  description="Use an example.test address."
  error="Enter a valid demo email address."
  defaultValue="sample"
/>
```

An error sets `aria-invalid` and adds error text to the accessible description.
Validation timing and announcing new errors belong to the consuming form.

### Card

`Card`, `CardHeader`, `CardBody`, and `CardFooter` are composable divs accepting
native div props and refs. Choose headings and landmarks appropriate to the page.

```tsx
import { Card, CardHeader, CardBody, CardFooter, Button } from 'venhea-ui';

<Card aria-labelledby="workspace-title">
  <CardHeader><h2 id="workspace-title">Demo workspace</h2></CardHeader>
  <CardBody><p>A synthetic workspace for trying components.</p></CardBody>
  <CardFooter><Button>Open workspace</Button></CardFooter>
</Card>
```

### Modal

`open`, `onClose`, `title`, and `children` are required. `description` and
`className` are optional. The parent owns the open state and must update it when
`onClose` runs. The dialog is portaled into `document.body`.

```tsx
import { useState } from 'react';
import { Button, Input, Modal } from 'venhea-ui';

export function EditWorkspace() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Edit workspace</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Edit workspace"
        description="Changes affect this demo only."
      >
        <Input label="Workspace name" defaultValue="Venhea demo" />
        <Button onClick={() => setOpen(false)}>Save changes</Button>
      </Modal>
    </>
  );
}
```

The close button receives initial focus. Tab stays inside the dialog; Escape,
the close button, and clicking the backdrop request dismissal. Background
elements become inert, body scrolling is locked, and cleanup restores previous
values and the previously focused element when it still exists.

Use **one open modal at a time**. Nested or concurrent modals, dialogs inside
shadow roots or iframes, and custom initial-focus targets are outside this small
library's scope. The implementation targets modern browsers supporting `inert`.
Server rendering omits the dialog. Verify actual browser and screen-reader
behavior before using these components in a production product.

## Design tokens

Styles use the `venhea-` class prefix and `--venhea-*` CSS variables. Override
tokens after importing the stylesheet, keeping accessible contrast and visible
focus indicators:

```css
:root {
  --venhea-primary: #234f68;
  --venhea-primary-hover: #193b4e;
  --venhea-radius: 0.75rem;
  --venhea-font: ui-sans-serif, system-ui, sans-serif;
}
```

There is no global element reset. Loading animation respects reduced-motion
preferences. The smallest button size is intended for compact layouts; choose
medium or large controls when larger touch targets are needed.

## Build and package contents

`npm run build` recreates `dist/`, bundles ESM with Vite, emits declarations with
TypeScript, and copies the shared CSS. React, React DOM, and their subpaths remain
external. `prepack` builds before `npm pack`; it does not change the version.

| Archive path | Purpose |
| --- | --- |
| `dist/index.js` | Named ESM component exports |
| `dist/index.d.ts` | Public component and prop-type exports |
| `dist/components/*.d.ts` | Component declarations and their internal type dependencies |
| `dist/styles.css` | Explicit stylesheet export and design tokens |
| `package.json` | Version, export map, peer dependencies, private-package guard |
| `README.md`, `LICENSE` | Consumer documentation and MIT license |

Source, showcase, tests, scripts, lockfile, architecture documentation, Git metadata,
and caches are excluded from the archive.
`dist/`, `node_modules/`, and `.tgz` files are ignored by Git. Rebuild after
cloning; compiled files and the archive remain available locally after validation.
`private: true` prevents npm publication while allowing `npm pack` and local
archive installation. A future contributor can attach versioned archives to
GitHub Releases without publishing to npm.

See [CONTRIBUTING.md](CONTRIBUTING.md) and [the architecture overview](docs/ARCHITECTURE.md).

## License

MIT. The library contains no customer data, credentials, external imagery, or
third-party brand assets. Development dependencies retain their own licenses.
