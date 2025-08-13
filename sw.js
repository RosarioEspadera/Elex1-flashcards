const CACHE_NAME = 'elex1-cache-v2';
const STATIC_ASSETS = [
  '/Elex1-flashcards/',
  '/Elex1-flashcards/index.html',
  '/Elex1-flashcards/solving.html',
  '/Elex1-flashcards/pdf.html',
  '/Elex1-flashcards/favicon.ico',
  '/Elex1-flashcards/manifest.json',
  '/Elex1-flashcards/styles-Electronics1/main.css',
  '/Elex1-flashcards/styles-Electronics1/solving.css',
  '/Elex1-flashcards/styles-Electronics1/pdf-viewer.css',
  '/Elex1-flashcards/scripts-Electronics1/main.js',
  '/Elex1-flashcards/scripts-Electronics1/solving.js',
  '/Elex1-flashcards/scripts-Electronics1/dataLoader.js',
  '/Elex1-flashcards/scripts-Electronics1/dataLoadersolving.js',
 '/Elex1-flashcards/data-Electronics1/amplifiers.json',
  '/Elex1-flashcards/data-Electronics1/biasing.json',
  '/Elex1-flashcards/data-Electronics1/bjts.json',
  '/Elex1-flashcards/data-Electronics1/dc-math.json',
  '/Elex1-flashcards/data-Electronics1/dc-ohms-law.json',
  '/Elex1-flashcards/data-Electronics1/diodes.json',
  '/Elex1-flashcards/data-Electronics1/electrical-properties.json',
  '/Elex1-flashcards/data-Electronics1/fets.json',
  '/Elex1-flashcards/data-Electronics1/power-supplies.json',
  '/Elex1-flashcards/data-Electronics1/resistance.json',
  '/Elex1-flashcards/data-Electronics1/safety.json',
  '/Elex1-flashcards/data-Electronics1/transistor.json',
  '/Elex1-flashcards/data-Electronics1/combinational.json',
  '/Elex1-flashcards/data-Electronics1/fundamentals.json',
  '/Elex1-flashcards/data-Electronics1/introsemiconductors.json',
  '/Elex1-flashcards/data-Electronics1/semiconductor-diodes.json',
  '/Elex1-flashcards/data-Electronics1/special-diodes-and-applications.json',
  // Electronics1solving topic JSON files
  '/Elex1-flashcards/data-Electronics1solving/semiconductor-diode.json',
  '/Elex1-flashcards/data-Electronics1solving/transistor.json',
  '/Elex1-flashcards/data-Electronics1solving/transistor-biasing.json',
  '/Elex1-flashcards/data-Electronics1solving/transistor-amplifiers.json',
  '/Elex1-flashcards/scripts-Electronics1/pdf-viewer.js'
];

// Modular detection for JSON decks
const isDeck = url =>
  url.includes('/data-Electronics1/') || url.includes('/data-Electronics1solving/');

// Install: cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  clients.claim();
});

// Fetch: smart strategies
self.addEventListener('fetch', event => {
  const { request } = event;

  // Network-first for version.json
  if (request.url.endsWith('version.json')) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  // Stale-while-revalidate for JSON decks
  if (isDeck(request.url)) {
  event.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(request).then(cached => {
        return fetch(request)
          .then(networkResponse => {
            if (networkResponse.ok) {
              cache.put(request, networkResponse.clone());
              return networkResponse;
            } else {
              throw new Error("Network response not ok");
            }
          })
          .catch(() => {
            if (cached) return cached;
            return new Response("Offline and deck not cached.", {
              status: 503,
              statusText: "Service Unavailable"
            });
          });
      })
    )
  );
  return;
}

  // Cache-first for everything else
  event.respondWith(
    caches.match(request).then(cached =>
      cached || fetch(request)
    )
  );
});
