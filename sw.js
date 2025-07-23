// Service Worker Version
const VERSION = '1.0.0';
const CACHE_NAME = `portfolio-cache-${VERSION}`;

// Cache configuration
const CACHES = {
  static: `static-assets-${VERSION}`,
  dynamic: `dynamic-assets-${VERSION}`,
  fonts: 'fonts-cache-v1',  // This doesn't change as frequently
  images: 'images-cache-v1'  // This doesn't change as frequently
};

// Static assets that rarely change
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/script.js',
  '/styles.css',
  '/offline.html' // Fallback page
];

// Assets that won't change (CDN resources, external fonts, etc)
const IMMUTABLE_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2'
];

// Security check for fetch requests
function isValidRequest(request) {
  // Only allow GET requests
  if (request.method !== 'GET') {
    return false;
  }
  
  // Only allow https:// URLs, except for localhost during development
  const url = new URL(request.url);
  if (!(url.protocol === 'https:' || url.hostname === 'localhost')) {
    return false;
  }
  
  return true;
}

// Create offline fallback page if it doesn't exist
async function createOfflinePage() {
  const cache = await caches.open(CACHES.static);
  
  // Check if offline page exists
  const offlinePage = await cache.match('/offline.html');
  
  if (!offlinePage) {
    // Create a simple offline page
    const offlineHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Offline - Ashutosh Singh</title>
          <style>
              body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  line-height: 1.6;
                  color: #fff;
                  background-color: #121212;
                  text-align: center;
                  padding: 20px;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  height: 100vh;
                  margin: 0;
              }
              h1 {
                  color: #6d8eff;
                  font-size: 2rem;
              }
              p {
                  max-width: 600px;
                  margin: 20px auto;
              }
              .icon {
                  font-size: 4rem;
                  margin-bottom: 20px;
              }
              .retry-btn {
                  background-color: #6d8eff;
                  color: white;
                  border: none;
                  padding: 10px 20px;
                  border-radius: 4px;
                  cursor: pointer;
                  font-size: 1rem;
                  margin-top: 20px;
              }
          </style>
      </head>
      <body>
          <div class="icon">📡</div>
          <h1>You're currently offline</h1>
          <p>You appear to be offline. Please check your internet connection and try again. Some features of Ashutosh Singh's portfolio may not be available while you're offline.</p>
          <button class="retry-btn" onclick="window.location.reload()">Try Again</button>
      </body>
      </html>
    `;
    
    const offlineResponse = new Response(offlineHtml, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
    
    await cache.put('/offline.html', offlineResponse);
  }
}

// Install event - cache critical assets
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      // Skip waiting for immediate activation
      self.skipWaiting(),
      
      // Cache static assets
      caches.open(CACHES.static).then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      
      // Cache immutable assets
      caches.open(CACHES.fonts).then(cache => {
        console.log('Caching immutable assets');
        return cache.addAll(IMMUTABLE_ASSETS);
      }),
      
      // Create offline page
      createOfflinePage()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      // Take control of all clients immediately
      self.clients.claim(),
      
      // Delete old cache versions
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (
              cacheName.startsWith('portfolio-cache-') && cacheName !== CACHE_NAME ||
              cacheName.startsWith('static-assets-') && cacheName !== CACHES.static ||
              cacheName.startsWith('dynamic-assets-') && cacheName !== CACHES.dynamic
            ) {
              console.log('Deleting outdated cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

// Network-first strategy with cache fallback
async function networkFirstStrategy(request) {
  try {
    // Always try network first
    const networkResponse = await fetch(request);
    
    // If successful, clone and cache
    if (networkResponse && networkResponse.ok) {
      const cache = await caches.open(CACHES.dynamic);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // If network fails, try cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If both network and cache fail for HTML, show offline page
    if (request.headers.get('Accept')?.includes('text/html')) {
      return caches.match('/offline.html');
    }
    
    // Otherwise just propagate the error
    throw error;
  }
}

// Cache-first strategy with network fallback
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // If not in cache, fetch from network
    const networkResponse = await fetch(request);
    
    // Cache the response for next time if valid
    if (networkResponse && networkResponse.ok && networkResponse.type === 'basic') {
      const cache = await caches.open(CACHES.dynamic);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // For images, can use a fallback placeholder
    if (request.destination === 'image') {
      return new Response(
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23eee"/%3E%3Cpath d="M20 50 L80 50 M50 20 L50 80" stroke="%23bbb" stroke-width="2"/%3E%3C/svg%3E',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    
    throw error;
  }
}

// Stale-while-revalidate for fonts and API responses
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  // Return cached response immediately if available
  if (cachedResponse) {
    // Update the cache in the background
    fetch(request).then(networkResponse => {
      if (networkResponse && networkResponse.ok) {
        caches.open(cacheName).then(cache => {
          cache.put(request, networkResponse);
        });
      }
    }).catch(() => {
      // Silently fail network update
    });
    
    return cachedResponse;
  }
  
  // If not in cache, fetch from network
  const networkResponse = await fetch(request);
  
  // Cache the response for next time
  if (networkResponse && networkResponse.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// Fetch event - handle requests based on resource type
self.addEventListener('fetch', event => {
  const request = event.request;
  
  // Validate request for security
  if (!isValidRequest(request)) {
    return;
  }
  
  // Choose caching strategy based on resource type
  if (request.mode === 'navigate' || request.destination === 'document') {
    // Use network-first for HTML documents (always get the latest)
    event.respondWith(networkFirstStrategy(request));
  }
  else if (request.url.endsWith('.css') || request.url.endsWith('.js')) {
    // Network-first for CSS/JS to ensure freshness
    event.respondWith(networkFirstStrategy(request));
  }
  else if (request.url.includes('fonts') || request.url.includes('webfonts')) {
    // Stale-while-revalidate for fonts
    event.respondWith(staleWhileRevalidateStrategy(request, CACHES.fonts));
  }
  else if (request.destination === 'image') {
    // Cache-first for images
    event.respondWith(cacheFirstStrategy(request));
  }
  else if (request.url.includes('api.github.com')) {
    // Stale-while-revalidate for GitHub API calls
    event.respondWith(staleWhileRevalidateStrategy(request, CACHES.dynamic));
  }
  else {
    // Default cache-first for everything else
    event.respondWith(cacheFirstStrategy(request));
  }
}); 