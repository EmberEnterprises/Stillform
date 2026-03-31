// Self-destruct: unregister this service worker and clear all caches
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => {
  self.clients.claim();
  self.registration.unregister();
  caches.keys().then(names => names.forEach(name => caches.delete(name)));
});
