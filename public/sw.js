// Stillform PWA Service Worker — network-only for now
// No caching until we have versioned asset strategy
const CACHE_VERSION = 'v2';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // Clear ALL old caches on activate
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Always go to network, never serve from cache
  // This prevents stale JS bundles from causing white screens
  event.respondWith(fetch(event.request));
});
