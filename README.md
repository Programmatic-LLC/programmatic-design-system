# programmatic-design-system

DestinationHub design system: atoms, components, layouts, templates, brand assets, and design tokens shared across Programmatic applications.

## Installation

Install directly from GitHub via a tag reference (no package registry):

```bash
npm install github:Programmatic-LLC/programmatic-design-system#v1.0.0
```

The package builds itself on install via the `prepare` script (`src/` → `dist/`).

## Usage

```tsx
import { Button, Modal, EntityCard } from 'programmatic-design-system';
```

Deep imports mirror the source layout:

```tsx
import { Reveal } from 'programmatic-design-system/components/Reveal';
import { useFocusTrap } from 'programmatic-design-system/hooks/useFocusTrap';
```

### Tailwind CSS v4

Components are styled with Tailwind utility classes. Consumers must tell Tailwind to scan the package so those classes are generated. Add to your Tailwind CSS entry:

```css
@source "../node_modules/programmatic-design-system/dist";
```

### Design tokens

Every component resolves its colors, radii, and typography through `--ds-*` CSS variables defined in `dist/styles/tokens.css`. The root barrel imports it as a side effect and the package declares `"sideEffects": true` so bundlers preserve that import.

Some build pipelines still drop side-effect CSS from `node_modules` packages (Next 15 webpack does unless the package is listed in `transpilePackages`). Import the tokens explicitly in your app's CSS entry to be safe:

```css
@import "../node_modules/programmatic-design-system/dist/styles/tokens.css";
```

If the tokens are missing you will see it immediately: transparent modals and dropdowns, unstyled inputs, and colorless buttons, because every `var(--ds-*)` reference resolves to nothing. When debugging, check the built CSS for token *definitions* (`--ds-brand-600:`), not just usages (`var(--ds-brand-600)`).

### Link component injection

`EntityCard` renders internal navigation through a configurable link component (default: `<a>`). Framework routers are injected once at the application root:

```tsx
import Link from 'next/link';
import { DsLinkProvider } from 'programmatic-design-system';

<DsLinkProvider component={Link}>{children}</DsLinkProvider>
```

## Scripts

| Script | Purpose |
|---|---|
| `npm run build` | Compile `src/` to `dist/` and copy stylesheets |
| `npm test` | Run the Vitest suite |
| `npm run test:coverage` | Run tests with coverage thresholds |
| `npm run lint` | ESLint |
| `npm run storybook` | Storybook dev server on port 6006 |
| `npm run build-storybook` | Static Storybook build |

## Releasing

1. Merge changes to `main`.
2. Bump `version` in `package.json`.
3. Tag: `git tag vX.Y.Z && git push origin vX.Y.Z`.
4. Update consumers' dependency refs to the new tag.
