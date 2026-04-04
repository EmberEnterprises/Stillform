const CACHE = 'stillform-v2-apr4';
const PRECACHE = ['/'];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(PRECACHE))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Skip caching for API calls
  if (event.request.url.includes('/api/') || event.request.url.includes('netlify/functions')) {
    return;
  }
  // Network first, cache fallback (offline only)
  event.respondWith(
    fetch(event.request).then(response => {
      // Update cache with fresh response
      const clone = response.clone();
      caches.open(CACHE).then(cache => cache.put(event.request, clone));
      return response;
    }).catch(() => caches.match(event.request))
  );
});
