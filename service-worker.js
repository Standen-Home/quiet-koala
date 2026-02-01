// Quiet Koala service worker (offline-first)
// NOTE: microphone access requires a secure context (https) or localhost.

const CACHE_NAME = 'quiet-koala-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './service-worker.js',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))));
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  // Cache-first for same-origin GET requests.
  if (req.method !== 'GET') return;

  event.respondWith(
    (async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      const res = await fetch(req);
      // Cache successful same-origin responses.
      try {
        const url = new URL(req.url);
        if (url.origin === self.location.origin && res.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, res.clone());
        }
      } catch (_) {}
      return res;
    })()
  );
});
