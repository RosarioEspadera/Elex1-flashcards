importScripts('cache-list.json');

self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open('app-cache');
      let downloaded = 0;
      const total = filesToCache.length;

      for (const file of filesToCache) {
        try {
          const response = await fetch(file);
          await cache.put(file, response.clone());
          downloaded++;

          // Send progress to the client
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
