self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('fetch', event => {
    // Catch every frame network request routed through the proxy-gateway path
    if (event.request.url.includes('/proxy-gateway/')) {
    const requestUrl = event.request.url;

    // Catch every request, search query, or form submission routed through the gateway hook
    if (requestUrl.includes('/proxy-gateway/')) {
const marker = '/proxy-gateway/';
        const markerIndex = event.request.url.indexOf(marker);
        const targetUrlStr = decodeURIComponent(event.request.url.substring(markerIndex + marker.length));
        const markerIndex = requestUrl.indexOf(marker);
        const targetUrlStr = decodeURIComponent(requestUrl.substring(markerIndex + marker.length));

        // Clones the incoming request data so search parameters are preserved
        const requestClone = event.request.clone();

event.respondWith(
            // Fetches data transparently using your exact active cloud domain layout
            fetch('https://improved-disco-7vj44qjv4777hx7w5-8080.app.github.dev/' + targetUrlStr)
            .then(response => {
            // Forwards everything (including search queries) safely to your active Codespace port
            fetch('https://improved-disco-7vj44qjv4777hx7w5-8080.app.github.dev/' + targetUrlStr, {
                method: requestClone.method,
                headers: requestClone.headers,
                // Keeps body details intact if you are executing a search form submission
                body: requestClone.method !== 'GET' && requestClone.method !== 'HEAD' ? requestClone.body : null
            })
            .then(async response => {
                const contentType = response.headers.get('content-type') || '';
const customHeaders = new Headers(response.headers);

                // CRITICAL STEP: Erase the headers that trigger the "Refused to connect" blocks
                // Clear the framing security blocks
customHeaders.delete('X-Frame-Options');
customHeaders.delete('Content-Security-Policy');
customHeaders.delete('content-security-policy');
                

                // If the response is HTML code, rewrite search paths dynamically
                if (contentType.includes('text/html')) {
                    let htmlContent = await response.text();
                    
                    // Forces all form actions and asset layouts to pull cleanly from the correct location
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
                return new Response(`<h3>Connection Failed</h3><p>${err.message}</p><p>Ensure your Codespace is running and port 8080 is Public.</p>`, {
                return new Response(`<h3>Search Execution Error</h3><p>${err.message}</p>`, {
headers: { 'Content-Type': 'text/html' }
});
})
);
}
});
