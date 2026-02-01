# Quiet Koala

A classroom noise buddy: when the room is quiet, a character comes out. When it gets loud, it hides.

This is a **browser-first** build designed for **Chromebooks** and classroom display screens.

## What’s in here
- `index.html` — the full app (UI + audio + animation)
- `manifest.webmanifest` — PWA manifest (installable)
- `service-worker.js` — offline cache (works after first load)
- `icons/` — app icons (placeholder for now)

## Run locally (recommended for mic permissions)
Microphone access usually requires a **secure context**:
- ✅ `https://…` (best)
- ✅ `http://localhost:PORT` (local dev)
- ⚠️ `file://…` often blocks mic access

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
1. Click **Start / Allow Microphone**
2. Click **Calibrate QUIET (10s)** (get your target “quiet working” level)
3. Click **Calibrate TOO LOUD (5s)** (have students talk at your “too loud” level)
4. Optionally adjust:
   - **Smoothing** (how quickly it reacts to changes)
   - **Sensitivity** (for different mic positions/rooms)
5. Pick a character (Koala/Cat/Monster)

Settings are stored per-device using `localStorage`.

## Next steps (product roadmap)
### 1) Replace placeholder icons
Current `icons/icon-192.png` and `icons/icon-512.png` are placeholders.
- Replace them with real 192×192 and 512×512 PNGs.

### 2) Character packs (SVG)
Move characters into a folder like `characters/<pack>/<name>.svg` and load them dynamically.
This will let you ship/sell themed character packs later.

### 3) Settings lock
Add an optional teacher PIN (or “lock settings”) so students can’t recalibrate mid-lesson.

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
