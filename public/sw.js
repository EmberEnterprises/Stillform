// Stillform service worker — May 7, 2026 re-enabled.
//
// Replaces the previous kill-switch sw.js (which existed because earlier deploys
// were stranding users on stale asset manifests and producing blank-screen
// starts). The kill-switch worked but cost the offline fallback and the PWA
// install experience. The return-loop architecture in Stillform_Strategic_Roadmap.md
// names offline access as a real product requirement: nervous-system regulation
// shouldn't ask permission of network state.
//
// Cache strategy:
//
// 1. HTML files (`/`, `/index.html`, navigations) — NETWORK-FIRST. The HTML is
//    the manifest that points at hashed bundle filenames; if a deploy lands new
//    bundles, the user needs the new HTML to find them. Cache fallback only
//    when the network is genuinely unavailable.
//
// 2. Hashed bundles (`/assets/*` produced by Vite) — CACHE-FIRST. Vite hashes
//    every JS/CSS bundle filename. If `assets/main-abc123.js` is in cache, it
//    IS the correct version — the filename is its identity. New deploy →
//    new HTML → new bundle filename → cache miss → fetched from network.
//    No invalidation logic needed.
//
// 3. API calls (`/.netlify/functions/*`) — NETWORK-ONLY. Reframe API responses
//    are stateful and shouldn't be cached. Same for metrics-ingest, account
//    deletion, subscription-portal, etc.
//
// 4. Static assets (fonts, icons, images) — STALE-WHILE-REVALIDATE. Serve from
//    cache for speed, fetch fresh in background, update cache.
//
// Cache invalidation: CACHE_VERSION below. Bump only when there's an asset-format
// change that requires breaking old caches (rare — hashed bundles handle most
// upgrades automatically). On activate, any cache with the `stillform-` prefix
// that doesn't match current version is deleted.
//
// Transition from old kill-switch sw.js: browser detects byte change in this
// file on next index.html load, installs new SW, activates after old SW
// finishes its (no-op) fetch handling. Users get caching on the load after
// the upgrade detection — typically the second pageview after deploy.

const CACHE_VERSION = "stillform-v1-2026-05-07";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const ASSETS_CACHE = `${CACHE_VERSION}-assets`;
const PAGES_CACHE = `${CACHE_VERSION}-pages`;

// Pre-cache the entry points on install. Hashed bundles are fetched on first
// real request and cached then — pre-caching them would require knowing their
// hashed names at SW author time, which we don't.
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    try {
      const cache = await caches.open(PAGES_CACHE);
      await cache.addAll(PRECACHE_URLS);
    } catch {}
    // skipWaiting so the new SW activates as soon as the old one releases
    // control. Combined with clientsClaim in activate, the user gets the new
    // worker on the next pageview.
    self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    // Drop any old stillform-* caches that don't match current version. The
    // version-prefix scheme keeps this safe across multiple cache buckets
    // (static, assets, pages).
    try {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k.startsWith("stillform-") && !k.startsWith(CACHE_VERSION))
          .map((k) => caches.delete(k))
      );
    } catch {}
    // clientsClaim so existing tabs use this SW immediately, not on next reload.
    try { await self.clients.claim(); } catch {}
  })());
});

// Helper: timed network fetch that falls through to cache after a short timeout.
// Network-first should be fast on good networks, fall back fast on bad ones.
const networkFirst = async (request, cacheName, timeoutMs = 3000) => {
  const cache = await caches.open(cacheName);
  const networkPromise = fetch(request).then((response) => {
    // Only cache successful responses. 4xx/5xx pass through but don't poison cache.
    if (response && response.ok && response.status === 200) {
      // Clone before storing — response body is a stream and can only be read once.
      cache.put(request, response.clone()).catch(() => {});
    }
    return response;
  });

  // Race network against timeout; if timeout wins, try cache.
  try {
    const response = await Promise.race([
      networkPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error("network-timeout")), timeoutMs)),
    ]);
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    // Last-resort: keep waiting on the network promise. Better a slow response
    // than nothing.
    return networkPromise;
  }
};

const cacheFirst = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && response.ok && response.status === 200) {
      cache.put(request, response.clone()).catch(() => {});
    }
    return response;
  } catch (err) {
    // Genuine network failure on a cache-miss asset — propagate.
    throw err;
  }
};

const staleWhileRevalidate = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  // Kick off network update in background regardless of cache hit.
  const networkPromise = fetch(request).then((response) => {
    if (response && response.ok && response.status === 200) {
      cache.put(request, response.clone()).catch(() => {});
    }
    return response;
  }).catch(() => null);
  return cached || networkPromise;
};

self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Only handle GET. POST/PUT/DELETE pass through unchanged.
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Same-origin only — don't intercept third-party requests (analytics,
  // OpenAI API calls go directly from Netlify functions, fonts.googleapis.com).
  if (url.origin !== self.location.origin) return;

  // API endpoints are stateful — never cache. Let the browser handle them.
  if (url.pathname.startsWith("/.netlify/")) return;

  // Navigation requests (HTML pages) — network-first with cache fallback.
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, PAGES_CACHE));
    return;
  }

  // Vite-hashed bundles — cache-first because the filename is the version.
  if (url.pathname.startsWith("/assets/")) {
    event.respondWith(cacheFirst(request, ASSETS_CACHE));
    return;
  }

  // Everything else (icons, fonts in /public/, manifest.json, etc) —
  // stale-while-revalidate.
  event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
});

// Allow the app to nudge the SW to skip waiting (e.g. via a "Reload to update"
// button after a deploy). Currently unused — left here as a hook for the
// future "new version available" UX if Arlin wants to add one.
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
