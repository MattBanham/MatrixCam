# Matrix Cam (Standalone App)

This repo contains a minimal Matrix Cam app with:
- Web app (React + Vite)
- Desktop wrapper (Electron)

## Project Structure

- `src/components/matrix-cam/MatrixCam.tsx` - main Matrix Cam component
- `src/components/matrix-cam/WebcamSelector.jsx` - webcam device picker
- `src/components/matrix-cam/MatrixCam.css` - Matrix Cam UI styles
- `src/fonts/DATDOT-REGULAR.TTF` - bundled DatDot font
- `src/App.tsx` - app shell
- `electron/main.cjs` - Electron main process
- `electron/preload.cjs` - Electron preload bridge (minimal)

## Fonts

- `DatDot` is included and works out of the box.
- `Matrix Code NFI` is **not** included due to licensing.

If you want the original Matrix Code look, download/install it yourself:
- [Matrix Code NFI (DaFont)](https://www.dafont.com/matrix-code-nfi.font)

## Requirements

- Node.js 20+
- npm 10+

## Install

```bash
npm install
```

## Run (Web)

```bash
npm run dev
```

Open the Vite URL (`http://localhost:4173`).

## Run (Desktop / Electron)

### Dev mode (hot reload)

```bash
npm run electron:dev
```

### Local packaged renderer in Electron

```bash
npm run electron
```

This builds the Vite app, then opens Electron against `dist/`.

## Build (Web)

```bash
npm run build
npm run preview
```

## Notes

- Camera permission is required in browser and in Electron.
- The desktop wrapper auto-approves camera/mic media permission requests for this app window.
- External links open in your default browser.


## Preset Persistence

In Electron mode, custom presets are saved to a disk folder named `custom_presets` under Electron user data:
- macOS: `~/Library/Application Support/matrix-cam-standalone/custom_presets`

Each saved preset captures:
- current Matrix Cam settings
- Electron window size at save time (`settings.windowSize` and `meta.windowBounds`)
- timestamp (`meta.savedAt`)

In plain browser mode (`npm run dev`), presets still use `localStorage`.
