const CACHE_NAME = 'elex1-cache-v1';
const urlsToCache = [
  '/Elex1-flashcards/',
  '/Elex1-flashcards/index.html',
  '/Elex1-flashcards/solving.html',
  '/Elex1-flashcards/favicon.ico',
  '/Elex1-flashcards/manifest.json',
  '/Elex1-flashcards/styles-Electronics1/main.css',
  '/Elex1-flashcards/styles-Electronics1/solving.css',
  '/Elex1-flashcards/scripts-Electronics1/main.js',
  '/Elex1-flashcards/scripts-Electronics1/solving.js',
  '/Elex1-flashcards/scripts-Electronics1/dataLoader.js',
  '/Elex1-flashcards/scripts-Electronics1/dataLoadersolving.js',
  // Electronics1 topic JSON files
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
  // Electronics1solving topic JSON files
  '/Elex1-flashcards/data-Electronics1solving/semiconductor-diode.json',
  '/Elex1-flashcards/data-Electronics1solving/transistor.json',
  '/Elex1-flashcards/data-Electronics1solving/transistor-biasing.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});