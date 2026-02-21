const { app, BrowserWindow, shell, session, ipcMain } = require('electron');
const path = require('path');
const fs = require('node:fs/promises');

const isDev = Boolean(process.env.VITE_DEV_SERVER_URL);
const appIconPath = path.join(__dirname, '..', 'public', 'matrix-cam-icon.png');

function getPresetDir() {
  return path.join(app.getPath('userData'), 'custom_presets');
}

function sanitizePresetFilename(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_ ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'preset';
}

async function ensurePresetDir() {
  await fs.mkdir(getPresetDir(), { recursive: true });
}

async function listPresetFiles() {
  await ensurePresetDir();
  const entries = await fs.readdir(getPresetDir(), { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => path.join(getPresetDir(), entry.name));
}

async function loadStoredPresets() {
  const files = await listPresetFiles();
  const presets = [];

  for (const file of files) {
    try {
      const raw = await fs.readFile(file, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && parsed.name && parsed.settings) {
        presets.push(parsed);
      }
    } catch (error) {
      // Skip malformed preset files instead of failing all loads.
      console.warn('Skipping unreadable preset file:', file, error.message);
    }
  }

  presets.sort((a, b) => {
    const aTime = a?.meta?.savedAt ? Date.parse(a.meta.savedAt) : 0;
    const bTime = b?.meta?.savedAt ? Date.parse(b.meta.savedAt) : 0;
    return bTime - aTime;
  });

  return presets;
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 750,
    minWidth: 360,
    minHeight: 390,
    backgroundColor: '#000000',
    autoHideMenuBar: true,
    title: 'Matrix Cam',
    icon: appIconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  if (isDev) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }
}

app.whenReady().then(() => {
  if (process.platform === 'darwin' && app.dock) {
    app.dock.setIcon(appIconPath);
  }

  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'media' || permission === 'camera' || permission === 'microphone') {
      callback(true);
      return;
    }
    callback(false);
  });

  ipcMain.handle('matrix-cam-presets:list', async () => {
    return loadStoredPresets();
  });


  ipcMain.handle('matrix-cam-window:resize', async (event, size) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win) {
      throw new Error('No active window');
    }

    const width = Number(size?.width);
    const height = Number(size?.height);
    if (!Number.isFinite(width) || !Number.isFinite(height)) {
      throw new Error('Invalid window size');
    }

    const [minWidth, minHeight] = win.getMinimumSize();
    const nextWidth = Math.max(minWidth || 0, Math.round(width));
    const nextHeight = Math.max(minHeight || 0, Math.round(height));

    if (win.isMaximized()) {
      win.unmaximize();
    }

    win.setSize(nextWidth, nextHeight, true);
    return win.getBounds();
  });

  ipcMain.handle('matrix-cam-presets:save', async (event, preset) => {
    if (!preset || typeof preset.name !== 'string' || !preset.settings) {
      throw new Error('Invalid preset payload');
    }

    const win = BrowserWindow.fromWebContents(event.sender);
    const bounds = win ? win.getBounds() : null;
    const savedAt = new Date().toISOString();

    const payload = {
      ...preset,
      settings: {
        ...preset.settings,
        windowSize: bounds ? { width: bounds.width, height: bounds.height } : null,
      },
      meta: {
        ...(preset.meta || {}),
        savedAt,
        windowBounds: bounds,
      },
    };

    const filename = `${sanitizePresetFilename(preset.name)}.json`;
    await ensurePresetDir();
    await fs.writeFile(path.join(getPresetDir(), filename), `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

    return payload;
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
