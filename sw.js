const CACHE_NAME = 'elex1-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/solving.html',
  '/favicon.ico',
  '/manifest.json',
  '/styles-Electronics1/main.css',
  '/styles-Electronics1/solving.css',
  '/scripts-Electronics1/main.js',
  '/scripts-Electronics1/solving.js',
  '/scripts-Electronics1/dataLoader.js',
  '/scripts-Electronics1/dataLoadersolving.js',
  // Electronics1 topic JSON files
  '/data-Electronics1/amplifiers.json',
  '/data-Electronics1/biasing.json',
  '/data-Electronics1/bjts.json',
  '/data-Electronics1/dc-math.json',
  '/data-Electronics1/dc-ohms-law.json',
  '/data-Electronics1/diodes.json',
  '/data-Electronics1/electrical-properties.json',
  '/data-Electronics1/fets.json',
  '/data-Electronics1/power-supplies.json',
  '/data-Electronics1/resistance.json',
  '/data-Electronics1/safety.json',
  '/data-Electronics1/transistor.json',
  // Electronics1solving topic JSON files
  '/data-Electronics1solving/semiconductor-diode.json',
  '/data-Electronics1solving/transistor.json',
  '/data-Electronics1solving/transistor-biasing.json'
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