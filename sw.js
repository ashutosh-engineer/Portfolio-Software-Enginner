// Service Worker Version
const CACHE_VERSION = '1.0.0';
const CACHE_NAME = `portfolio-cache-${CACHE_VERSION}`;

// Resources that won't be cache-busted (assets that don't change often)
const IMMUTABLE_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'
];

// Assets to be cache-busted on each deployment
const VERSIONED_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js'
];

// Install event - cache critical assets
self.addEventListener('install', event => {
  // Skip waiting to ensure the new service worker activates immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cache immutable assets normally
      cache.addAll(IMMUTABLE_ASSETS);
      
      // Fetch and cache versioned assets with cache-busting
      const versionedRequests = VERSIONED_ASSETS.map(url => {
        return fetch(`${url}?v=${CACHE_VERSION}`).then(response => {
          if (!response.ok) {
            throw new Error(`Failed to fetch ${url}`);
          }
          return cache.put(url, response);
        }).catch(error => {
          console.error('Caching failed for:', url, error);
        });
      });
      
      return Promise.all(versionedRequests);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('portfolio-cache-') && cacheName !== CACHE_NAME;
        }).map(cacheName => {
          console.log('Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      // Take control of all clients
      return clients.claim();
    })
  );
});

// Fetch event - handle requests
self.addEventListener('fetch', event => {
  // Special handling for CSS files
  if (event.request.url.includes('.css')) {
    event.respondWith(
      fetch(event.request).then(response => {
        // If online, update the cache
        const clonedResponse = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, clonedResponse);
        });
        return response;
      }).catch(() => {
        // If offline, try to return from cache
        return caches.match(event.request);
      })
    );
    return;
  }
  
  // Standard cache-first strategy for other resources
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Return cached response if available
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Otherwise try fetching from network
      return fetch(event.request).then(response => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        // Clone the response as it can only be consumed once
        const responseToCache = response.clone();
        
        // Add to cache
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        
        return response;
      });
    })
  );
}); 