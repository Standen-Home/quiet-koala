# Quiet Koala

A classroom noise buddy: when the room is quiet, a character comes out. When it gets loud, it hides.

This is a **browser-first** build designed for **Chromebooks** and classroom display screens.

## What’s in here
- `index.html` — the full app (UI + audio + animation)
- `manifest.webmanifest` — PWA manifest (installable)
- `service-worker.js` — offline cache (works after first load)
- `icons/` — app icons (placeholder for now)

## Easiest way for teachers to run it (recommended)
**Teachers should not need to run a server.** The intended plan is:
- Host Quiet Koala as a normal website on **HTTPS** (school domain, Netlify/Vercel, etc.)
- Teachers open a URL (e.g. `https://quietkoala.school.nz`) and optionally **Install** it as a PWA

This still works with all recent changes (zone delay, bubbles, overlay button, etc.) because everything is browser-based and settings are stored locally.

## Run locally (for development / testing)
Microphone access usually requires a **secure context**:
- ✅ `https://…` (best)
- ✅ `http://localhost:PORT` (local dev)
- ⚠️ `file://…` often blocks mic access

## Chromebook / Google Workspace deployment
See: **docs/schools-it-checklist.md**

### Option A: Local server (Chromebook / laptop)
If you have Node:
```bash
npx http-server -p 8000
# then open
# http://localhost:8000/
```

If you have Python:
```bash
python3 -m http.server 8000
# then open
# http://localhost:8000/
```

## Use in the classroom
1. Open the site (preferably the installed PWA) in **Chrome or Edge**
2. Click **Start / Allow Microphone**
3. Click **Calibrate QUIET (10s)** (get your target “quiet working” level)
4. Click **Calibrate TOO LOUD (5s)** (have students talk at your “too loud” level)
5. Pick a character (from the pack dropdown)
6. Optional:
   - Adjust Settings (zone delay, smoothing, sensitivity, etc.)
   - Click **Lock settings** (teacher PIN) so students can’t change thresholds
   - **Overlay mode**: in Settings, click **Start overlay** to open a floating Picture-in-Picture window (useful on Mac/Windows)

Settings are stored per-device using `localStorage`.
A “quiet streak” appears after 10 seconds continuously in the green zone.

## Next steps (product roadmap)
### ✅ Icons
`icons/icon-192.png` and `icons/icon-512.png` are now real PNGs (generated). Replace with branded artwork when ready.

### ✅ Character packs (SVG)
Characters now live under `characters/` and are loaded dynamically via `characters/index.json`.
This lets you ship/sell themed packs later.

### ✅ Settings lock
Teacher “Lock settings” is implemented with an optional PIN so students can’t recalibrate mid-lesson.

### 4) Better audio model
Right now we use RMS amplitude + smoothing.
Improvements:
- optional A-weighting / band-pass for “human voice”
- better automatic calibration
- per-zone hysteresis (prevents flicker)

### 5) Distribution
Recommended primary product:
- **PWA (installable website)** for Chromebooks + tablets + laptops.

Optional secondary product:
- Desktop wrappers (Electron/Tauri) for schools that want an installer (Windows/Mac).

## Licensing / business
This repo currently has **no license set**. Before selling, decide:
- proprietary (recommended for a paid product), or
- open core / commercial license, etc.

---
Built with Web Audio API + HTML/CSS/JS (no framework).
