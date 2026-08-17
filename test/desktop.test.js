const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

function read(relative){
  return fs.readFileSync(path.join(root, relative), 'utf8');
}

test('desktop package points at Electron wrapper', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.main, 'desktop/main.cjs');
  assert.match(pkg.scripts.desktop, /electron --no-sandbox \./);
  assert.match(pkg.devDependencies.electron, /^\^37\./);
});

test('Electron wrapper creates a transparent always-on-top overlay and settings window', () => {
  const main = read('desktop/main.cjs');
  assert.match(main, /transparent:\s*true/);
  assert.match(main, /alwaysOnTop:\s*true/);
  assert.match(main, /frame:\s*false/);
  assert.match(main, /setAlwaysOnTop\(true, 'screen-saver'\)/);
  assert.match(main, /loadURL\(appUrl\('index\.html', \{ overlay: '1' \}\)\)/);
  assert.match(main, /loadURL\(appUrl\('index\.html', \{ desktop: '1' \}\)\)/);
  assert.match(main, /setIgnoreMouseEvents\(clickThrough, \{ forward: true \}\)/);
});

test('Electron wrapper serves assets from a secure custom protocol, not file://', () => {
  const main = read('desktop/main.cjs');
  assert.match(main, /protocol\.registerSchemesAsPrivileged/);
  assert.match(main, /scheme:\s*'quiet-koala'/);
  assert.match(main, /secure:\s*true/);
  assert.match(main, /supportFetchAPI:\s*true/);
  assert.match(main, /protocol\.handle\('quiet-koala'/);
  assert.match(main, /pathToFileURL/);
  assert.doesNotMatch(main, /loadFile\(indexPath/);
});

test('web app has overlay-only transparent UI mode and desktop controls', () => {
  const html = read('index.html');
  assert.match(html, /QUIET_KOALA_OVERLAY_MODE/);
  assert.match(html, /body\.overlay-mode\{[\s\S]*background:transparent !important/);
  assert.match(html, /body\.overlay-mode header,[\s\S]*body\.overlay-mode \.controls,[\s\S]*display:none !important/);
  assert.match(html, /id="desktopOverlayRow"/);
  assert.match(html, /btnDesktopClickThrough/);
  assert.match(html, /window\.addEventListener\('storage'/);
});

test('desktop overlay mirrors live state from the settings window', () => {
  const main = read('desktop/main.cjs');
  const preload = read('desktop/preload.cjs');
  const html = read('index.html');

  assert.match(main, /quiet-koala:live-state/);
  assert.match(main, /overlayWindow\.webContents\.send\('quiet-koala:live-state'/);
  assert.match(preload, /sendLiveState/);
  assert.match(preload, /onLiveState/);
  assert.match(html, /sendDesktopLiveState/);
  assert.match(html, /applyMirroredLiveState/);
  assert.match(html, /window\.quietKoalaDesktop\?\.onLiveState/);
  assert.doesNotMatch(html, /if\(window\.QUIET_KOALA_OVERLAY_MODE\)\{[\s\S]{0,220}start\(\)/);
});

test('browser audio and overlay loops avoid avoidable long-session memory churn', () => {
  const html = read('index.html');

  assert.match(html, /let audioSampleBuffer = null/);
  assert.match(html, /audioSampleBuffer = new Float32Array\(analyser\.fftSize\)/);
  assert.doesNotMatch(html, /function computeRms\(\)\{[\s\S]{0,180}const buf = new Float32Array/);

  assert.match(html, /let pipCanvasStream = null/);
  assert.match(html, /captureStream\(10\)/);
  assert.match(html, /pipCanvasStream\.getTracks\(\)\) track\.stop\(\)/);

  assert.match(html, /let lastDesktopLiveStateSentAt = 0/);
  assert.match(html, /now - lastDesktopLiveStateSentAt\) < 100/);
});
