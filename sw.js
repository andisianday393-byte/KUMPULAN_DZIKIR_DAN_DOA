const STATIC_CACHE = "dzikir-static-v2";

const ASSETS = [
    "./",
    "./index.html",

    "./css/index.css",
    "./css/index-drawer.css",
    "./css/search-index.css",

    "./js/index-drawer.js",
    "./js/search.js",

    "./json/manifest.json",

    "./assets/icon-192.png",
    "./assets/icon-512.png",

    "./audio/adzan.mp3",

    "./fontawesome/css/all.min.css",
    "./fontawesome/webfonts/fa-solid-900.woff2",
    "./fontawesome/webfonts/fa-regular-400.woff2",
    "./fontawesome/webfonts/fa-brands-400.woff2"
];

// Install
self.addEventListener("install", event => {

    self.skipWaiting();

    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => cache.addAll(ASSETS))
    );

});

// Activate
self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys => {

            return Promise.all(

                keys
                    .filter(key => key !== STATIC_CACHE)
                    .map(key => caches.delete(key))

            );

        }).then(() => self.clients.claim())

    );

});

// Fetch
self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") return;

    // Halaman HTML selalu mencoba dari internet terlebih dahulu
    if (
        event.request.mode === "navigate" ||
        event.request.destination === "document"
    ) {

        event.respondWith(

            fetch(event.request)
                .then(response => {

                    const copy = response.clone();

                    caches.open(STATIC_CACHE)
                        .then(cache => cache.put(event.request, copy));

                    return response;

                })
                .catch(() => caches.match("./index.html"))

        );

        return;

    }

    // Cache First untuk file statis
    event.respondWith(

        caches.match(event.request).then(cacheResponse => {

            if (cacheResponse) {
                return cacheResponse;
            }

            return fetch(event.request).then(networkResponse => {

                if (
                    networkResponse &&
                    networkResponse.status === 200 &&
                    networkResponse.type === "basic"
                ) {

                    const copy = networkResponse.clone();

                    caches.open(STATIC_CACHE)
                        .then(cache => cache.put(event.request, copy));

                }

                return networkResponse;

            });

        })

    );

});
