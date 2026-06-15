self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('fetch', event => {
    const requestUrl = event.request.url;

    if (requestUrl.includes('/proxy-gateway/')) {
        const marker = '/proxy-gateway/';
        const markerIndex = requestUrl.indexOf(marker);
        const targetUrlStr = decodeURIComponent(requestUrl.substring(markerIndex + marker.length));

        // Create a basic GET request to handle search queries safely
        const fetchOptions = {
            method: 'GET',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        };

        event.respondWith(
            // Forces all queries cleanly through your unblocked improved-disco server tunnel
            fetch('https://improved-disco-7vj44qjv4777hx7w5-8080.app.github.dev/' + targetUrlStr, fetchOptions)
            .then(async response => {
                const contentType = response.headers.get('content-type') || '';
                const customHeaders = new Headers(response.headers);
                
                // Clear the framing security blockades instantly
                customHeaders.delete('X-Frame-Options');
                customHeaders.delete('Content-Security-Policy');
                customHeaders.delete('content-security-policy');

                if (contentType.includes('text/html')) {
                    let htmlContent = await response.text();
                    
                    // Forces sub-elements and search inputs to track natively within the proxy window
                    const assetBaseTag = `<base href="${targetUrlStr}" target="_self">`;
                    htmlContent = htmlContent.replace('<head>', `<head>${assetBaseTag}`);
                    
                    return new Response(htmlContent, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: customHeaders
                    });
                }

                return new Response(response.body, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: customHeaders
                });
            })
            .catch(err => {
                return new Response(`<h3>Proxy Gateway Exception</h3><p>${err.message}</p><p>Ensure your Codespace is active and Port 8080 is Public.</p>`, {
                    headers: { 'Content-Type': 'text/html' }
                });
            })
        );
    }
});
