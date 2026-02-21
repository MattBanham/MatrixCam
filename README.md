# Matrix Cam (Standalone App)

This is a minimal standalone React + Vite app for the Matrix Cam component.

## Project Structure

- `src/components/matrix-cam/MatrixCam.tsx` - main Matrix Cam component
- `src/components/matrix-cam/WebcamSelector.jsx` - webcam device picker
- `src/components/matrix-cam/MatrixCam.css` - Matrix Cam UI styles
- `src/fonts/DATDOT-REGULAR.TTF` - open font included in this repo for the DatDot option
- `src/App.tsx` - app shell that renders Matrix Cam
- `src/main.tsx` - app entrypoint

## Fonts

- `DatDot` is included and available out of the box.
- `Matrix Code NFI` is **not** included in this public repo due to licensing.

To use the intended Matrix Code look, you must download/install it yourself:

- [Matrix Code NFI (DaFont)](https://www.dafont.com/matrix-code-nfi.font)

Without Matrix Code, the app still runs and you can use DatDot/Monospace/Wingdings.

## Run Locally

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Notes

- Browser webcam permissions are required.
- If you embed this in another host app later, you can call:

```js
window.matrixCamCleanup?.();
```

before route changes to force stream cleanup.
