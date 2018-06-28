let cacheName = 'cache1';

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
        caches.open(cacheName).then(function(cache) {
            console.log("[ServiceWorker] Caching cacheFiles");
            return cache.addAll(filesToCache);
        })
    )
})
self.addEventListener('activate', function(e) {
    console.log("[ServiceWorker] Activated")

    e.waitUntil(
        caches.keys().then(function(cacheNames){
            return Promise.all(cacheNames.map(function(thisCacheName) {
                if (thisCacheName !== cacheName) {
                    console.log("[ServiceWorker] Removing Cached Files from ", thisCacheName);
                    return caches.delete(thisCacheName);
                }
            }));
        
        })
    );
});

self.addEventListener('fetch', function (event) {
    console.log('[ServiceWorker] Fetch', e.request.url);
    
    event.respondWith(
      caches.match(event.request)
      .then(function (resp) {
        return resp || fetch(event.request)
      .then(function (response) {
        return caches.open('cache1').then(function (cache) {
          cache.put(event.request, response.clone());
          console.log('[ServiceWorker] New Data Cached', e.request.url);
          return response;
          });
        });
      })

      .catch(function(err) {
        console.log('[ServiceWorker] Error Fetching & Caching New Data', err);
        })

    );
});


/*self.addEventListener('fetch', function(e) {
	console.log('[ServiceWorker] Fetch', e.request.url);

	// e.respondWidth Responds to the fetch event
	e.respondWith(

		// Check in cache for the request being made
		caches.match(e.request)


			.then(function(response) {

				// If the request is in the cache
				if ( response ) {
					console.log("[ServiceWorker] Found in Cache", e.request.url, response);
					// Return the cached version
					return response;
				}

				// If the request is NOT in the cache, fetch and cache

				var requestClone = e.request.clone();
				return fetch(requestClone)
					.then(function(response) {

						if ( !response ) {
							console.log("[ServiceWorker] No response from fetch ")
							return response;
						}

						var responseClone = response.clone();

						//  Open the cache
						caches.open(cacheName).then(function(cache) {

							// Put the fetched response in the cache
							cache.put(e.request, responseClone);
							console.log('[ServiceWorker] New Data Cached', e.request.url);

							// Return the response
							return response;
			
				        }); // end caches.open

					})
					.catch(function(err) {
						console.log('[ServiceWorker] Error Fetching & Caching New Data', err);
					});


			}) // end caches.match(e.request)
	); // end e.respondWith
});
*/