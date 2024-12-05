const CACHE_NAME = 'bubble-game-v1';
const assetsToCache = [
  '/',
  '/index.html',
  '/style1.css',
  '/script.js',
  '/player.png',
  '/imgA.png',
  '/bubble-song.MP3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(assetsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
