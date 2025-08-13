importScripts('cache-list.js');

self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open('app-cache');
      let downloaded = 0;
      const total = self.filesToCache.length;

      for (const file of self.filesToCache) {
        try {
          const response = await fetch(file);
          await cache.put(file, response.clone());
          downloaded++;

          const clients = await self.clients.matchAll();
          clients.forEach(client => {
            client.postMessage({
              type: 'download-progress',
              downloaded,
              total
            });
          });
        } catch (err) {
          console.warn(`❌ Failed to cache ${file}`, err);
        }
      }
    })()
  );
});
