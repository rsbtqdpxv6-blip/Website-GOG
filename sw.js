self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('fetch', event => {
    // Catch every frame network request routed through the proxy-gateway path
    if (event.request.url.includes('/proxy-gateway/')) {
        const marker = '/proxy-gateway/';
        const markerIndex = event.request.url.indexOf(marker);
        const targetUrlStr = decodeURIComponent(event.request.url.substring(markerIndex + marker.length));

        event.respondWith(
            // Fetches data transparently behind the scenes via AllOrigins raw endpoint
            fetch(`https://allorigins.win{encodeURIComponent(targetUrlStr)}`)
            .then(response => {
                const customHeaders = new Headers(response.headers);
                
                // CRITICAL STEP: Erase the headers that trigger the "Refused to connect" blocks
                customHeaders.delete('X-Frame-Options');
                customHeaders.delete('Content-Security-Policy');
                customHeaders.delete('content-security-policy');
                
                return new Response(response.body, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: customHeaders
                });
            })
            .catch(err => {
                return new Response(`<h3>Connection Failed</h3><p>${err.message}</p>`, {
                    headers: { 'Content-Type': 'text/html' }
                });
            })
        );
    }
});
