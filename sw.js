const CACHE_NAME = 'elex1-cache-v2';
const CURRENT_VERSION = 'v2';

const STATIC_ASSETS = [
  '/Elex1-flashcards/',
  '/Elex1-flashcards/index.html',
  '/Elex1-flashcards/solving.html',
  '/Elex1-flashcards/pdf.html',
  '/Elex1-flashcards/guide.html',
  '/Elex1-flashcards/favicon.ico',
  '/Elex1-flashcards/manifest.json',
  '/Elex1-flashcards/styles-Electronics1/main.css',
  '/Elex1-flashcards/styles-Electronics1/solving.css',
  '/Elex1-flashcards/styles-Electronics1/pdf-viewer.css',
  '/Elex1-flashcards/scripts-Electronics1/main.js',
  '/Elex1-flashcards/scripts-Electronics1/solving.js',
  '/Elex1-flashcards/scripts-Electronics1/dataLoader.js',
  '/Elex1-flashcards/scripts-Electronics1/dataLoadersolving.js',
  '/Elex1-flashcards/scripts-Electronics1/pdf-viewer.js',
  '/Elex1-flashcards/scripts-Electronics1/app.js',
  ...[
    'amplifiers','biasing','bjts','dc-math','dc-ohms-law','diodes','electrical-properties',
    'fets','power-supplies','resistance','safety','transistor','combinational',
    'fundamentals','introsemiconductors','semiconductor-diodes','special-diodes-and-applications'
  ].map(name => `/Elex1-flashcards/data-Electronics1/${name}.json`),
  ...[
    'semiconductor-diode','transistor','transistor-biasing','transistor-amplifiers'
  ].map(name => `/Elex1-flashcards/data-Electronics1solving/${name}.json`)
];

// Matchers
const isDeck = url =>
  url.includes('/data-Electronics1/') || url.includes('/data-Electronics1solving/');
const isImage = url =>
  url.includes('/images-Electronics1solving/') ||
  url.includes('/images-transistor-biasing/') ||
  url.includes('/images-transistor-amplifiers/') ||
  url.includes('/images-semiconductor-diode/') ||
  url.includes('/images-transistor/');

// 🌱 Install: Cache static assets + manifest-based images
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)),
      fetch('/Elex1-flashcards/imageManifest.json')
        .then(res => res.json())
        .then(({ images }) => {
          const allPaths = Object.entries(images).flatMap(([folder, files]) =>
            files.map(name => `/Elex1-flashcards/images-${folder}/${name}`)
          );
          return caches.open(CACHE_NAME).then(cache => cache.addAll(allPaths));
        })
        .catch(() => console.warn('Image manifest not available during install.'))
    ])
  );
  self.skipWaiting();
});

// 🧹 Activate: Clean old caches and claim clients
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

// 🚦 Fetch: Smart strategies
self.addEventListener('fetch', event => {
  const { request } = event;

  // 🌐 Network-first for version.json
  if (request.url.endsWith('version.json')) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  // 🔄 Stale-while-revalidate for JSON decks
  if (isDeck(request.url)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(request).then(cached =>
          fetch(request)
            .then(networkResponse => {
              if (networkResponse.ok) {
                cache.put(request, networkResponse.clone());
                return networkResponse;
              }
              throw new Error("Network response not ok");
            })
            .catch(() => cached || new Response("Offline and deck not cached.", {
              status: 503,
              statusText: "Service Unavailable"
            }))
        )
      )
    );
    return;
  }

  // 🖼️ Cache-on-demand for images
  if (isImage(request.url)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(request).then(cached =>
          fetch(request)
            .then(networkResponse => {
              if (networkResponse.ok) {
                cache.put(request, networkResponse.clone());
                return networkResponse;
              }
              throw new Error("Network response not ok");
            })
            .catch(() => cached || new Response("Offline and image not cached.", {
              status: 503,
              statusText: "Service Unavailable"
            }))
        )
      )
    );
    return;
  }

  // 📦 Cache-first for everything else
  event.respondWith(
    caches.match(request).then(cached =>
      cached || fetch(request)
    )
  );
});
