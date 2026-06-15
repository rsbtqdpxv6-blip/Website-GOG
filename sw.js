self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('fetch', event => {
    // Catch every frame network request routed through the proxy-gateway path
    if (event.request.url.includes('/proxy-gateway/')) {
        const marker = '/proxy-gateway/';
        const markerIndex = event.request.url.indexOf(marker);
        const targetUrlStr = decodeURIComponent(event.request.url.substring(markerIndex + marker.length));

        event.respondWith(
            // Fetches data transparently using your exact active cloud domain layout
            fetch('https://improved-disco-7vj44qjv4777hx7w5-8080.app.github.dev/' + targetUrlStr)
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
                return new Response(`<h3>Connection Failed</h3><p>${err.message}</p><p>Ensure your Codespace is running and port 8080 is Public.</p>`, {
                    headers: { 'Content-Type': 'text/html' }
                });
            })
        );
    }
});
