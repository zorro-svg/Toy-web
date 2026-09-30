/* =====================================
   TOY HAVEN SERVICE WORKER (PWA)
   Network first, falls back to the cache
   so the site still opens when offline.
===================================== */

const CACHE_NAME = "toy-haven-v1";

const FILES_TO_CACHE = [
    "./",
    "index.html",
    "products.html",
    "cart.html",
    "checkout.html",
    "wishlist.html",
    "support.html",
    "style.css",
    "script.js",
    "manifest.json",
    "favicon.svg",
    "icons/icon-192.png",
    "icons/icon-512.png",
    "icons/icon-maskable-512.png"
];


/* Save all files when the service worker is installed */
self.addEventListener("install", event => {

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))
    );

    self.skipWaiting();

});


/* Remove old caches when a new version activates */
self.addEventListener("activate", event => {

    event.waitUntil(
        caches.keys()
            .then(names => Promise.all(
                names
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            ))
            .then(() => self.clients.claim())
    );

});


/* Try the network first, use the cache if offline */
self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") return;

    event.respondWith(

        fetch(event.request)
            .then(response => {

                if (response.ok && event.request.url.startsWith(self.location.origin)) {

                    const copy = response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => cache.put(event.request, copy));

                }

                return response;

            })
            .catch(() =>
                caches.match(event.request, { ignoreSearch: true })
                    .then(cached => cached || caches.match("index.html"))
            )

    );

});