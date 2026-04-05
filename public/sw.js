const CACHE = 'stillform-v3';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = event.request.url;

  // NEVER intercept API calls
  if (url.includes('netlify/functions') || url.includes('/api/')) {
    return;
  }

  // NEVER cache JS or CSS bundles — Vite hashes these, let the browser handle it
  if (url.match(/\.(js|css)(\?|$)/)) {
    return;
  }

  // NEVER cache hot module replacement or dev tools
  if (url.includes('__vite') || url.includes('hot-update') || url.includes('sockjs')) {
    return;
  }

  // For everything else (HTML, images, fonts, icons): network first, cache for offline only
  event.respondWith(
    fetch(event.request).then(response => {
      if (response.ok && event.request.method === 'GET') {
        const clone = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, clone));
      }
      return response;
    }).catch(() => caches.match(event.request))
  );
});
