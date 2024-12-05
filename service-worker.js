const CACHE_NAME = 'bubble-game-v2'; 
const assetsToCache = [
    '/',
    '/index.html',
    '/game.html',
    '/leaderboard.html',
    '/a-propos.html',
    '/style.css',
    '/style1.css',
    '/script.js',
    '/player.png',
    '/enemy.png',
    '/background.png',
    '/bomb.png',
    '/star.png',
    '/horloge_up.png',
    '/minibombe.png',
    '/spritesheet.png',
    '/imgA.png',
    '/bubbleSong.mp3',
    '/menu-song.mp3',
    '/bubbleSong2.mp3',
    '/js/nipplejs.min.js',
    '/js/sweetalert2.all.min.js',
    '/manifest.json', 
    '/service-worker.js' 
];

self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installation en cours...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Mise en cache des ressources :', assetsToCache);
                return cache.addAll(assetsToCache);
            })
            .then(() => self.skipWaiting()) 
            .catch(err => console.error('[Service Worker] Erreur lors de la mise en cache :', err))

    );
});

self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activation en cours...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => {
                    return cacheName.startsWith('bubble-game-') && cacheName !== CACHE_NAME;
                }).map(cacheName => {
                    return caches.delete(cacheName);
                })
            );
        })
        .then(() => self.clients.claim()) 
    );

});



self.addEventListener('fetch', (event) => {
    console.log('[Service Worker] Récupération de la ressource :', event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    console.log('[Service Worker] Ressource servie depuis le cache :', event.request.url);
                    return cachedResponse;
                }

                console.log('[Service Worker] Ressource récupérée du réseau :', event.request.url);

                return fetch(event.request)
                    .then(networkResponse => {
                         
                        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                             return caches.open(CACHE_NAME)
                                 .then(cache => {
                                     cache.put(event.request, networkResponse.clone()); 
                                     return networkResponse;
                                 });
                         } else {
                              
                             return networkResponse;
                         }
                    });

            })
            .catch(err => console.error('[Service Worker] Erreur lors de la récupération :', err))
    );
});
