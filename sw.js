self.addEventListener('install', e => {
  e.waitUntil(caches.open('rasta-v1').then(c => c.addAll([
    './', './index.html', './manifest.webmanifest'
  ])));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== 'rasta-v1').map(k => caches.delete(k)))
  ));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
