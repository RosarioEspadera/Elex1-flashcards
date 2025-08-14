const dbPromise = idb.openDB('elex-db', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('assets')) {
      db.createObjectStore('assets');
    }
  }
});
