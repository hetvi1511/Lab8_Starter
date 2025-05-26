// sw.js - This file needs to be in the root of the directory to work,
//         so do not move it next to the other scripts

const CACHE_NAME = 'lab-8-starter';

// Installs the service worker. Feed it some initial URLs to cache
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      // B6. TODO - Add all of the URLs from RECIPE_URLs here so that they are
      //            added to the cache when the ServiceWorker is installed
      return cache.addAll(['/','/index.html','/assets/scripts/main.js', '/assets/scripts/RecipeCard.js', '/assets/styles/main.css','recipes/1_50-thanksgiving-side-dishes.json', 
        'recipes/2_roasting-turkey-breast-with-stuffing.json', 'recipes/3_moms-cornbread-stuffing.json', 'recipes/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json', 
        'recipes/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json', 'recipes/6_one-pot-thanksgiving-dinner.json', '/assets/images/0-star.svg',
      '/assets/images/1-star.svg', '/assets/images/2-star.svg', '/assets/images/3-star.svg', '/assets/images/4-star.svg', '/assets/images/5-star.svg']);
    })
  );
});

// Activates the service worker
self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

// Intercept fetch requests and cache them
self.addEventListener('fetch', function (event) {
  // We added some known URLs to the cache above, but tracking down every
  // subsequent network request URL and adding it manually would be very taxing.
  // We will be adding all of the resources not specified in the intiial cache
  // list to the cache as they come in.
  /*******************************/
  // This article from Google will help with this portion. Before asking ANY
  // questions about this section, read this article.
  // NOTE: In the article's code REPLACE fetch(event.request.url) with
  //       fetch(event.request)
  // https://developer.chrome.com/docs/workbox/caching-strategies-overview/
  /*******************************/
  // B7. TODO - Respond to the event by opening the cache using the name we gave
  //            above (CACHE_NAME)
  // B8. TODO - If the request is in the cache, return with the cached version.
  //            Otherwise fetch the resource, add it to the cache, and return
  //            network response.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
      .then(resp => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, resp.clone());
          return resp;
        });
      })
      .catch(() => caches.match('/index.html'))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(networkResp => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResp.clone());
          return networkResp;
        });
      });
    })
  );
});