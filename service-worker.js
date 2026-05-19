const CACHE_NAME = 'zerobyte-admin-v1';
const OFFLINE_URL = '/admin/offline.html';

const urlsToCache = [
  '/admin/index.html',
  '/admin/dashboard.html',
  '/admin/notifications.html',
  '/admin/offline.html',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(fetch(event.request));
    return;
  }
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        if (event.request.url.includes('.html')) {
          return caches.match(OFFLINE_URL);
        }
        return new Response('Offline');
      });
    })
  );
});