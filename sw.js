// Service Worker for BCA Exam Prep
// Cache-first strategy: pre-caches all guides on install, serves them offline.
// Bump CACHE_VERSION whenever you change any HTML/CSS/JS to invalidate old cache.

const CACHE_VERSION = 'bca-prep';
const PRECACHE_URLS = [
  './',
  './index.html',
  './dbms-study-guide.html',
  './wc-study-guide.html',
  './loc-study-guide.html',
  './r-datascience-study-guide.html',
  './ctrc-study-guide.html',
  './probstats-study-guide.html',
  './iks-study-guide.html',
  './manifest.json',
  './icon-192.svg',
  './icon-512.svg'
];

// Install: pre-cache all guides
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch: cache-first, fall back to network, fall back to cached index.html
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request)
        .then(response => {
          // Only cache successful same-origin responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const clone = response.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => {
          // Offline + not in cache → fall back to homepage for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
    })
  );
});
