self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('fetch', event => {
    // Intercept navigation requests running through the dynamic gateway loop
    if (event.request.url.includes('/proxy-gateway/')) {
        const marker = '/proxy-gateway/';
        const markerIndex = event.request.url.indexOf(marker);
        const targetUrlStr = decodeURIComponent(event.request.url.substring(markerIndex + marker.length));

        event.respondWith(
            // Fetches data transparently behind the scenes via a clean JSON wrapper endpoint
            fetch(`https://allorigins.win{encodeURIComponent(targetUrlStr)}`)
            .then(response => {
                // Clone headers to safely modify the payload
                const customHeaders = new Headers(response.headers);
                
                // Blast past iframe integration blocks instantly
                customHeaders.delete('X-Frame-Options');
                customHeaders.delete('Content-Security-Policy');
                customHeaders.delete('content-security-policy');
                
                // Return clean, unblocked webpage structural elements directly to frame layout
                return new Response(response.body, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: customHeaders
                });
            })
            .catch(err => {
                return new Response(`<h3>Connection Refused</h3><p>${err.message}</p>`, {
                    headers: { 'Content-Type': 'text/html' }
                });
            })
        );
    }
});
