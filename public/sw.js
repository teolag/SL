const cacheName = '1.1.5';

const cachedFiles = [
	'/',
	'manifest.json',
	'script.js',
	'style.css'
];

self.addEventListener('activate', e => {
	console.log("SW: Activate new service worker.", cacheName);

	e.waitUntil(
		caches.keys().then(keyList => {
			return Promise.all(keyList.map(key => {
				if(key !== cacheName) {
					return caches.delete(key);
				}
			}));
		})
	);
});


self.addEventListener('message', e => {
	if (e.data.action === 'skipWaiting') {
		self.skipWaiting();
	}
});

self.addEventListener('install', e => {
	console.log("SW: Installing service worker");
	e.waitUntil(
		caches.open(cacheName).then(cache => {
			return cache.addAll(cachedFiles).then(_ => {
				console.log("SW: Installation complete, files saved to cache", cachedFiles);
				//self.skipWaiting();
			});
		})
	);
});

self.addEventListener('fetch', e => {
	//console.log("SW: fetcha", e.request.url);
	e.respondWith(
		caches.match(e.request).then(response => {
			if(response) {
				console.log("SW: get from cache", response.url);
				return response;
			} else {
				console.log("SW: get from server", e.request.url);
				return fetch(e.request);
			}
		})
	);
});


self.addEventListener('push', e => {
	console.log("Push", e);
	e.waitUntil(
		self.registration.showNotification('ServiceWorker Cookbook', {
			body: 'Alea iacta est',
		})
	);
});