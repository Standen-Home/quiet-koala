const { app, BrowserWindow, ipcMain, globalShortcut, shell, protocol, net } = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const appRoot = path.resolve(__dirname, '..');
const protocolScheme = 'quiet-koala';

let overlayWindow;
let settingsWindow;
let clickThrough = false;

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'quiet-koala',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
      stream: true
    }
  }
]);

function appUrl(file = 'index.html', query = {}){
  const url = new URL(`${protocolScheme}://app/${file}`);
  for (const [key, value] of Object.entries(query)) url.searchParams.set(key, value);
  return url.toString();
}

function resolveAppPath(requestUrl){
  const url = new URL(requestUrl);
  let requestedPath = decodeURIComponent(url.pathname || '/');
  if (requestedPath === '/' || requestedPath.endsWith('/')) requestedPath += 'index.html';
  requestedPath = requestedPath.replace(/^\/+/, '');

  const filePath = path.normalize(path.join(appRoot, requestedPath));
  const relative = path.relative(appRoot, filePath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Blocked path outside app root: ${requestedPath}`);
  }
  return filePath;
}

function registerAppProtocol(){
  protocol.handle('quiet-koala', async (request) => {
    try {
      const filePath = resolveAppPath(request.url);
      return net.fetch(pathToFileURL(filePath).toString());
    } catch (error) {
      console.error('[quiet-koala-protocol]', error);
      return new Response('Not found', { status: 404 });
    }
  });
}

function createOverlayWindow(){
  overlayWindow = new BrowserWindow({
    width: 360,
    height: 360,
    minWidth: 180,
    minHeight: 180,
    x: 40,
    y: 80,
    frame: false,
    transparent: true,
    resizable: true,
    movable: true,
    hasShadow: false,
    alwaysOnTop: true,
    skipTaskbar: false,
    backgroundColor: '#00000000',
    title: 'Quiet Koala Overlay',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  overlayWindow.setAlwaysOnTop(true, 'screen-saver');
  overlayWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  overlayWindow.loadURL(appUrl('index.html', { overlay: '1' }));

  overlayWindow.webContents.on('did-fail-load', (_event, code, description, url) => {
    console.error('[quiet-koala-overlay-load-failed]', code, description, url);
  });

  overlayWindow.on('closed', () => { overlayWindow = null; });
}

function createSettingsWindow(){
  settingsWindow = new BrowserWindow({
    width: 1180,
    height: 780,
    minWidth: 900,
    minHeight: 620,
    title: 'Quiet Koala Settings',
    backgroundColor: '#0b1020',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  settingsWindow.loadURL(appUrl('index.html', { desktop: '1' }));
  settingsWindow.webContents.on('did-fail-load', (_event, code, description, url) => {
    console.error('[quiet-koala-settings-load-failed]', code, description, url);
  });
  settingsWindow.on('closed', () => { settingsWindow = null; });
}

function setOverlayClickThrough(value){
  clickThrough = !!value;
  if (!overlayWindow) return;
  overlayWindow.setIgnoreMouseEvents(clickThrough, { forward: true });
  overlayWindow.webContents.send('quiet-koala:click-through-changed', clickThrough);
}

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

app.whenReady().then(() => {
  registerAppProtocol();

  // Allow microphone from the bundled secure custom-protocol app.
  app.on('web-contents-created', (_event, contents) => {
    contents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url);
      return { action: 'deny' };
    });

    contents.session.setPermissionRequestHandler((_webContents, permission, callback) => {
      callback(permission === 'media' || permission === 'microphone');
    });
  });

  createOverlayWindow();
  createSettingsWindow();

  globalShortcut.register('CommandOrControl+Shift+X', () => {
    setOverlayClickThrough(!clickThrough);
  });
  globalShortcut.register('CommandOrControl+Shift+S', () => {
    if (settingsWindow) settingsWindow.show();
    else createSettingsWindow();
  });

  app.on('activate', () => {
    if (!overlayWindow) createOverlayWindow();
    if (!settingsWindow) createSettingsWindow();
  });
});

ipcMain.handle('quiet-koala:set-click-through', (_event, value) => {
  setOverlayClickThrough(value);
  return clickThrough;
});

ipcMain.handle('quiet-koala:get-click-through', () => clickThrough);

ipcMain.handle('quiet-koala:show-settings', () => {
  if (settingsWindow) settingsWindow.show();
  else createSettingsWindow();
  return true;
});

ipcMain.on('quiet-koala:live-state', (_event, snapshot) => {
  if (overlayWindow && !overlayWindow.isDestroyed()) {
    overlayWindow.webContents.send('quiet-koala:live-state', snapshot);
  }
});

ipcMain.on('quiet-koala:state-changed', (_event, keys = []) => {
  const payload = Array.isArray(keys) ? keys : [];
  for (const win of [overlayWindow, settingsWindow]) {
    if (win && !win.isDestroyed()) {
      win.webContents.send('quiet-koala:state-changed', payload);
    }
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
