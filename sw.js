// Very tiny offline cache for GitHub Pages
const CACHE_NAME = "geocalc-v7-cache-v1";
const ASSETS = ["./", "./index.html", "./sw.js", "./manifest.webmanifest"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map(k => (k === CACHE_NAME ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  // network-first for html (better updates), cache-first for others
  if (e.request.mode === "navigate" || url.pathname.endsWith("index.html")) {
    e.respondWith(
      fetch(e.request).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((c)=>c.put("./index.html", copy));
        return res;
      }).catch(() => caches.match("./index.html"))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then((cached) => cached || fetch(e.request))
    );
  }
});
