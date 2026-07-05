self.addEventListener("fetch", event => {

    const url = new URL(event.request.url);

    // Never cache Apps Script requests
    if (url.hostname === "script.google.com") {
        event.respondWith(fetch(event.request));
        return;
    }

    event.respondWith(
        caches.match(event.request).then(cached => {

            if (cached) {
                return cached;
            }

            return fetch(event.request).then(response => {

                const copy = response.clone();

                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, copy);
                });

                return response;

            });

        })
    );

});
