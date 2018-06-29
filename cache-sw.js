let restaurantCache = 'cache1';

let filesToCache = [
    './index.html',
    './restaurant.html',
    './css/styles.css',
    './data/restaurants.json',
    './img/1.jpg',
    './img/2.jpg',
    './img/3.jpg',
    './img/4.jpg',
    './img/5.jpg',
    './img/6.jpg',
    './img/7.jpg',
    './img/8.jpg',
    './img/9.jpg',
    './img/10.jpg',
    './js/dbhelper.js',
    './js/main.js',
    './js/restaurant_info.js',
    'https://fonts.googleapis.com/css?family=Roboto'
];

self.addEventListener('install', function(e) {
    console.log("[ServiceWorker] Installed")

    e.waitUntil(
        caches.open(restaurantCache).then(function(cache) {
            console.log("[ServiceWorker] Caching cacheFiles");
            return cache.addAll(filesToCache);
        })
        .catch(function(err) {
            console.log('[ServiceWorker] falied open the Cach ', err);
        })
    )
});

self.addEventListener('activate', function(e) {
    console.log("[ServiceWorker] Activated")

    e.waitUntil(
        caches.keys().then(function(cacheNames){
            return Promise.all(cacheNames.filter(function(cacheName) {
                /*if (cacheName !== restaurantCache) {
                    console.log("[ServiceWorker] Removing Cached Files from ", cacheName);
                    return caches.delete(cacheName);
                }*/
                return cacheName.startsWith('restaurant-') && cacheName != restaurantCache;})
                .map(function(cacheName){
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    console.log('[ServiceWorker] Fetch', event.request.url);
    
    event.respondWith(
      caches.match(event.request)
      .then(function (resp) {
        return resp || fetch(event.request)
      .then(function (response) {
        return caches.open('cache1').then(function (cache) {
          cache.put(event.request, response.clone());
          console.log('[ServiceWorker] New Data Cached', event.request.url);
          return response;
          });
        });
      })

      .catch(function(err) {
        console.log('[ServiceWorker] Error Fetching & Caching New Data', err);
        })

    );
});