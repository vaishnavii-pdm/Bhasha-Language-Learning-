/*
 * Bhasha service worker: makes the app installable and usable offline.
 * - The app files are saved on first visit.
 * - Same-origin files: network first (so updates arrive), falling back to the saved copy when
 *   offline or when the network is slow (3 seconds).
 * - Google Fonts: saved as they are used, so the scripts look right offline.
 * - Everything else (such as the online translator) is never touched.
 * Bump VERSION when you rename or remove files, so old caches are cleaned up.
 */
'use strict';
const VERSION = 'bhasha-v1.1.0';
const FONTS = 'bhasha-fonts';
const SHELL = [
  './', 'index.html', 'manifest.webmanifest',
  'css/styles.css',
  'js/data.js', 'js/quiz.js', 'js/features.js', 'js/translate.js', 'js/app.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png', 'icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('bhasha-') && k !== VERSION && k !== FONTS).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function networkFirst(request, timeoutMs) {
  return new Promise((resolve) => {
    let settled = false;
    const fallback = () => caches.match(request, { ignoreSearch: true }).then((hit) => hit || (request.mode === 'navigate' ? caches.match('index.html') : null));
    const timer = setTimeout(() => {
      fallback().then((hit) => { if (hit && !settled) { settled = true; resolve(hit); } });
    }, timeoutMs);
    fetch(request).then((res) => {
      clearTimeout(timer);
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put(request, copy));
      }
      if (!settled) { settled = true; resolve(res); }
    }).catch(() => {
      clearTimeout(timer);
      fallback().then((hit) => { if (!settled) { settled = true; resolve(hit || Response.error()); } });
    });
  });
}

function staleWhileRevalidate(request) {
  return caches.open(FONTS).then((cache) => cache.match(request).then((hit) => {
    const fresh = fetch(request).then((res) => { if (res && (res.ok || res.type === 'opaque')) cache.put(request, res.clone()); return res; }).catch(() => hit);
    return hit || fresh;
  }));
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    event.respondWith(networkFirst(req, 3000));
  } else if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(staleWhileRevalidate(req));
  }
});
