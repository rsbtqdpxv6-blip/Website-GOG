self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('fetch', event => {
    if (event.request.url.includes('/proxy-gateway/')) {
        const marker = '/proxy-gateway/';
        const markerIndex = event.request.url.indexOf(marker);
        const targetUrlStr = decodeURIComponent(event.request.url.substring(markerIndex + marker.length));

        event.respondWith(
            // 🚀 YOUR LIVE LINK PINNED DIRECTLY BELOW (Ensure the trailing slash remains intact)
            fetch(`https://github.dev{targetUrlStr}`)
            .then(response => {
                const customHeaders = new Headers(response.headers);
                
                // Keeps unblocking rules active to drop iframe security walls
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
                return new Response(`<h3>Proxy Gateway Connection Error</h3><p>${err.message}</p>`, {
                    headers: { 'Content-Type': 'text/html' }
                });
            })
        );
    }
});
