const cacheName = 'kechicharron-shell-v1';
const shell = ['/styles.css', '/app.js', '/manifest.json', '/manifest-kitchen.json', '/manifest-reports.json', '/incono.jpg'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(shell)));
  self.skipWaiting();
});

self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || event.request.url.includes('/api/')) return;
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});