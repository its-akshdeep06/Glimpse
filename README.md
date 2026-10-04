# Glimpse

Glimpse is a browser-based QR code studio for creating, styling, and exporting QR codes.

## Features

- Create QR codes for URLs, plain text, email, phone numbers, and Wi-Fi networks.
- Customize colors, gradients, module shapes, margins, error correction, export size, and center logos.
- Apply presets, undo and redo edits, and export PNG or SVG files.
- Save recent projects, favorites, downloads, and drafts in this browser.

QR generation and exports run locally in the browser. Projects and image files are stored in IndexedDB; theme and download preferences use local storage. The public favicon is `public/favicon.svg`.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Development

```sh
npm install
npm run dev
```

Vite prints the local development URL when the server is ready.

## Checks

```sh
npm run lint
npm run typecheck
npm run build
```

## Production Preview

```sh
npm run build
npm run preview
```

The production output is written to `dist/`. The deployment includes the landing page and the client-side `/app` workspace route.
