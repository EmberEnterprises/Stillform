// Service worker kill-switch:
// We intentionally retire SW caching to prevent stale-asset startup failures
// (white screens) after rapid deploys.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    try {
      await self.registration.unregister();
    } catch {}
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    } catch {}
    try {
      const clientList = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      await Promise.all(clientList.map((client) => client.navigate(client.url)));
    } catch {}
    try {
      await self.clients.claim();
    } catch {}
  })());
});

self.addEventListener("fetch", () => {
  // No-op by design while SW is being retired.
});
