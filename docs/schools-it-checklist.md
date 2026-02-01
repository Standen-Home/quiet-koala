# School IT setup checklist (Chromebooks / Google Workspace)

Quiet Koala is an installable web app (PWA) that uses the **microphone** to measure classroom noise. In managed Chromebook environments, microphone access is often blocked by policy unless explicitly allowed.

> **Key rule:** Microphone capture via `getUserMedia()` requires a **secure context**.
> - ✅ `https://…` (production)
> - ✅ `http://localhost` (development only)
> - ⚠️ `file://…` often blocks mic access

---

## 1) Microphone permission (critical)

### What must be true
- App must be served over **HTTPS**.
- Mic access is controlled by **Chrome content settings**.

### What School IT should configure (recommended)
In **Google Admin Console** (wording varies by tenant/version):
- **Devices → Chrome → Settings → Users & browsers** (or the relevant OU)
  - **Site settings / Content settings → Microphone**
    - Default: *Ask* or *Block* (district preference)
    - Add an **exception**:
      - Microphone = **Allow** for: `https://YOUR_DOMAIN/*`

If you use **Managed Guest Sessions** or **Kiosk**, set the same mic allow exception under:
- **Managed guest session settings**
- **Kiosk settings** (if used)

### Gotchas
- If mic capture is inside an iframe, the iframe must include: `allow="microphone"`.
- Avoid redirects that change origin (e.g., `app.` → `www.`). The mic exception must match the **final origin**.
- If you add speech-to-text, WebSockets, or streaming later, school filters may require additional domain allowlists.

---

## 2) PWA install / pinning (ChromeOS)

### Recommended rollout (lowest friction)
- **Force-install the PWA** for a pilot OU so teachers/students don’t need to click “Install”.
- Optionally **pin** it to the shelf/taskbar for visibility.

Admin-side concepts (search terms)
- “Force-installed web apps / Web app install force list”
- “Pin to shelf”

---

## 3) Kiosk mode considerations (plan for, don’t lead with it)

Kiosk adds constraints. Recommend a normal signed-in pilot first.

Modes you may encounter:
- **Normal signed-in student session (best for pilots)**
- **Managed Guest Session** (shared carts)
- **Single-app Kiosk / Web Kiosk**

Notes:
- Kiosk flows often suppress interactive prompts—plan to **pre-allow mic** via policy.
- Authentication that uses popups/multi-tab flows can be painful in kiosk; consider kiosk-friendly login if needed.

---

## 4) Suggested pilot checklist (copy/paste)

### Before pilot
1. Identify the pilot OU (users + devices).
2. Confirm devices have working microphones and mic isn’t hardware-disabled.

### Network / filtering
3. Allowlist:
   - `https://YOUR_DOMAIN/*`
   - Any auth/SSO domains
   - Any API/CDN domains
   - (If applicable) STT/media endpoints and WebSocket domains

### ChromeOS policy
4. Web app deployment:
   - Force-install the PWA to the pilot OU (recommended), or provide install instructions if not force-installed.
   - (Optional) Pin the app to the shelf/taskbar.
5. Microphone permission:
   - Add site exception: **Microphone = Allow** for `https://YOUR_DOMAIN/*`
   - Repeat for:
     - Users & browsers (signed-in)
     - Managed Guest Session (if used)
     - Kiosk (if used)

### Validation
6. On a managed Chromebook in the pilot OU:
   - Launch the PWA
   - Start the app (grant mic)
   - Confirm Chrome shows mic-in-use indicator
   - Confirm the app responds to classroom volume changes

### If kiosk is requested
7. Decide kiosk type (Managed Guest Session vs single-app kiosk).
8. Verify login method works without popups/multi-tab (or enable required popups/redirects).
9. Confirm mic exception applies in kiosk context (no interactive prompt required).
