const CACHE_NAME = 'shadeseat-v3';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Force the waiting service worker to become the active service worker
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Return the cached version if found, otherwise fetch from network
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim(); // Force all clients to use the new service worker immediately
});
