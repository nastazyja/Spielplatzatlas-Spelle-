const CACHE_NAME = "spielplatzatlas-v5";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./images/icon-192.png",
  "./images/icon-512.png"
];

// INSTALL
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// ACTIVATE
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener("fetch", (event) => {
  // index.html immer frisch laden
  if (
    event.request.mode === "navigate" ||
    event.request.url.endsWith("/index.html")
  ) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put("./index.html", copy);
          });
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  // Alle anderen Dateien: Cache zuerst
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});