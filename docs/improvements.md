# Improvements / backlog

This document tracks requested improvements for **Quiet Koala** (the classroom noise buddy PWA).

Principles
- Prefer **small, shippable** changes.
- Keep classroom deployments in mind (Chromebooks, projectors, locked settings).
- New features should be **local-only by default** (saved in `localStorage`) unless explicitly needed.

---

## Requested / next up

### Engagement / classroom flow
- **Green-zone encouragement bubbles**: once the character is fully out and the room is in **Green**, show occasional randomized speech bubbles (e.g. “Great job!”, “Keep it up!”, “Show me how far you’ve gotten!”).
  - Teacher options:
    - Use defaults
    - Defaults + custom
    - Custom only
  - Add a "Test bubble" button.
  - Add cooldown (e.g. 45–90s with jitter) so it doesn’t spam.
  - Save custom lines in `localStorage`.

### Audio / stability (testing + tuning)
- Keep tuning defaults based on classroom testing (zone delay, hysteresis, thresholds).

---

## Shipped

- **Install UX (PWA)**
  - Install badge only appears when install prompt is available.
  - Added iOS install help ("Add to Home Screen") when install prompt isn’t available.

- **Quick Start overlay**
  - Auto-shows on first run (unless dismissed / installed).
  - "Don’t show again" option.

- **Settings panel (first-run hint)**
  - Settings panel opens on first run (per device), then stays available under Settings.

- **Zone delay (time-based debounce)**
  - Must remain in a new zone for a configurable duration before switching (default 60s).
  - **Reset on red**: switching to Red is immediate (ignores delay), clears pending transition.

- **Hysteresis + thresholds**
  - Hysteresis slider to reduce flicker near thresholds.
  - **Default hysteresis set to `0.04`**.
  - Threshold derivation tweaks (green/red spans derived from calibrated range fractions).

- **Quiet streak reward**
  - Toggleable quiet streak reward meter.

- **Character packs**
  - Characters load from `characters/index.json`.
  - **Teacher: Manage packs** UI to override character packs via JSON (local-only).

- **Teacher lock settings (PIN)**
  - Prevents students from changing calibration/settings.

- **Offline caching**
  - Service worker caches assets for offline use after first load.

- **School IT deployment docs**
  - Chromebook / Google Workspace checklist: `docs/schools-it-checklist.md`
