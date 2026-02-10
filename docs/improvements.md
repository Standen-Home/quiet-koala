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

### Audio / stability
- **Default hysteresis**: consider lowering the default hysteresis from `0.08` to something smaller (e.g. `0.04`) now that **Zone delay** exists.
  - Goal: keep the app responsive without flicker.

---

## Shipped

- **Install CTA + Quick Start overlay**
  - Install badge only appears when install prompt is available.
  - Quick Start auto-shows on first run (unless dismissed / installed).
  - "Don’t show again" option.

- **Zone delay (time-based debounce)**
  - Must remain in a new zone for a configurable duration before switching (default 60s).
  - **Reset on red**: switching to Red is immediate (ignores delay), clears pending transition.
  - Settings panel opens on first run, then stays available under Settings.

- **Hysteresis slider**
  - Adjustable hysteresis to reduce flicker near thresholds.

- **Character packs system**
  - Characters load from `characters/index.json`.

- **Teacher lock settings (PIN)**
  - Prevents students from changing calibration/settings.

- **Offline caching**
  - Service worker caches assets for offline use after first load.
