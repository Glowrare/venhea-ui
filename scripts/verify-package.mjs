import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const manifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
const require = createRequire(import.meta.url);
const npmCli = process.env.npm_execpath;
assert(npmCli, 'Run this check through npm run test:package.');

function npm(args, cwd = root) {
  return execFileSync(process.execPath, [npmCli, ...args], {
    cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'],
  });
}

// Use the real pack lifecycle, including prepack, rather than inspecting dist alone.
const packOutput = npm(['pack', '--json']);
// npm can forward prepack's build output before the final JSON array.
const jsonStart = packOutput.lastIndexOf('\n[');
const [packed] = JSON.parse(jsonStart < 0 ? packOutput : packOutput.slice(jsonStart + 1));
assert.equal(packed.name, 'venhea-ui');
assert.equal(packed.version, manifest.version);
assert.equal(packed.filename, `venhea-ui-${manifest.version}.tgz`);
const files = packed.files.map(({ path }) => path).sort();
for (const expected of ['dist/index.js', 'dist/index.d.ts', 'dist/styles.css', 'package.json', 'README.md', 'LICENSE']) {
  assert(files.includes(expected), `Missing package file: ${expected}`);
}
for (const path of files) {
  assert(
    ['package.json', 'README.md', 'LICENSE'].includes(path)
      || /^dist\/(?:index\.js|styles\.css|(?:index|components\/[A-Za-z]+)\.d\.ts)$/.test(path),
    `Unexpected package file: ${path}`,
  );
}

const archive = join(root, packed.filename);
const consumer = await mkdtemp(join(tmpdir(), 'venhea-ui-consumer-'));
try {
  await writeFile(join(consumer, 'package.json'), JSON.stringify({ private: true, type: 'module' }));
  // Reuse exactly the React/type versions already installed by npm ci, offline.
  const dependencies = ['react', 'react-dom', '@types/react', '@types/react-dom'].map((name) => {
    const { version } = require(`${name}/package.json`);
    return `${name}@${version}`;
  });
  npm(['install', '--prefer-offline', '--ignore-scripts', '--no-audit', '--no-fund', archive, ...dependencies], consumer);

  const installedManifest = JSON.parse(await readFile(join(consumer, 'node_modules/venhea-ui/package.json'), 'utf8'));
  assert.equal(installedManifest.name, manifest.name);
  assert.equal(installedManifest.version, manifest.version);
  assert.equal(installedManifest.private, true);
  assert.equal(installedManifest.type, 'module');
  assert.equal(installedManifest.peerDependencies.react, '^19.0.0');
  assert.equal(installedManifest.peerDependencies['react-dom'], '^19.0.0');

  await writeFile(join(consumer, 'smoke.mjs'), `
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as kit from 'venhea-ui';
assert.deepEqual(Object.keys(kit).sort(), ['Badge', 'Button', 'Card', 'CardBody', 'CardFooter', 'CardHeader', 'Input', 'Modal'].sort());
const html = renderToStaticMarkup(createElement(kit.Button, { variant: 'secondary' }, 'Packed component'));
assert.match(html, /Packed component/);
assert.match(html, /type="button"/);
assert.equal(renderToStaticMarkup(createElement(kit.Modal, { open: false, onClose() {}, title: 'Closed' }, 'Hidden')), '');
const css = await readFile(new URL(import.meta.resolve('venhea-ui/styles.css')), 'utf8');
assert.match(css, /--venhea-primary:/);
assert.match(css, /prefers-reduced-motion/);
console.log('Packed ESM imports, server rendering, and CSS export passed.');
`);
  execFileSync(process.execPath, ['smoke.mjs'], { cwd: consumer, stdio: 'inherit' });

  await writeFile(join(consumer, 'consumer.tsx'), `
import { createRef } from 'react';
import { Badge, Button, Card, CardBody, CardFooter, CardHeader, Input, Modal } from 'venhea-ui';
import type { BadgeProps, ButtonProps, CardProps, InputProps, ModalProps } from 'venhea-ui';
const button: ButtonProps = { variant: 'primary', size: 'sm', ref: createRef<HTMLButtonElement>() };
const badge: BadgeProps = { variant: 'success' };
const input: InputProps = { label: 'Demo title', description: 'Synthetic content', ref: createRef<HTMLInputElement>() };
const card: CardProps = { 'aria-label': 'Demo card' };
const modal: ModalProps = { open: false, title: 'Demo dialog', onClose() {}, children: 'Content' };
export const example = <Card {...card}><CardHeader><Badge {...badge}>Ready</Badge></CardHeader><CardBody><Input {...input} /></CardBody><CardFooter><Button {...button}>Save</Button></CardFooter><Modal {...modal} /></Card>;
// @ts-expect-error Unsupported variants must remain rejected by the published types.
export const invalidButton = <Button variant="unknown">Invalid</Button>;
// @ts-expect-error An accessible input label is required.
export const unlabeledInput = <Input />;
`);
  execFileSync(process.execPath, [require.resolve('typescript/bin/tsc'),
    '--noEmit', '--strict', '--exactOptionalPropertyTypes', '--module', 'NodeNext',
    '--moduleResolution', 'NodeNext', '--target', 'ES2022', '--jsx', 'react-jsx', 'consumer.tsx',
  ], { cwd: consumer, stdio: 'inherit' });
  console.log('Packed TypeScript declarations passed with NodeNext module resolution.');
  console.log(JSON.stringify({
    node: process.version, archive: packed.filename, files,
    bytes: packed.size,
    sha256: createHash('sha256').update(await readFile(archive)).digest('hex'),
  }, null, 2));
} finally {
  // Delete only the fresh, named temporary consumer created by this check.
  assert.equal(dirname(consumer), resolve(tmpdir()));
  assert(basename(consumer).startsWith('venhea-ui-consumer-'));
  await rm(consumer, { recursive: true, force: true });
}
