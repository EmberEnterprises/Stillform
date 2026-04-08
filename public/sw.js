const CACHE = 'stillform-v4';

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
    event.respondWith(fetch(event.request));
    return;
  }

  // JS and CSS — always fetch fresh (Vite hashes these)
  if (url.match(/\.(js|css)(\?|$)/)) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Dev tools — pass through
  if (url.includes('__vite') || url.includes('hot-update') || url.includes('sockjs')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Everything else (HTML, images, fonts, icons): network first, cache for offline
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
