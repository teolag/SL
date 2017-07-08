/*
medborgarplatsen: 9191,
alvikSödra: 3626,
minneberg: 3630,
råcksta: 9104,
tcentralen: 9001
*/



fetch("/api/departures/9104")
	.then(res => res.json())
	.then(data => {
		const list = document.querySelector(".departures--råcksta");
		list.innerHTML = data.ResponseData.Metros
			.filter(dep => dep.JourneyDirection == 2)
			.map(dep => printDeparture(dep))
			.join("");
	});

fetch("/api/departures/9191")
	.then(res => res.json())
	.then(data => {
		const list = document.querySelector(".departures--medborgarplatsen");
		list.innerHTML = data.ResponseData.Metros
			.filter(dep => dep.JourneyDirection == 1)
			.map(dep => printDeparture(dep))
			.join("");
	});

function printDeparture(d) {
	return `<div>
		<span class="line-number">${d.LineNumber}</span>
		<span class="destination">${d.Destination}</span>
		<span>${d.DisplayTime}</span>
	</div>`;
}







// Service Worker stuff
if ('serviceWorker' in navigator) {
	console.log("register service worker");
	navigator.serviceWorker.register('/sw.js')
		.then(function(registration) {
			console.log(`service worker registered`);

			// no service worker active, first visit
			if (!navigator.serviceWorker.controller) {
				console.log("first visit");
				//return;
			}

			if (registration.waiting) {
				console.log("new worker ready");
				updateReady(registration.waiting);
				return;
			}

			if (registration.installing) {
				console.log("new worker installing");
				trackInstalling(registration.installing);
				return;
			}

			registration.addEventListener('updatefound', function(e) {
				console.log("new worker found, track installation", e);
				trackInstalling(registration.installing);
			});
		})
		.catch(function(err) {
			console.log("Service worker registration failed : ", err);
		})
	;

	var refreshing;
	navigator.serviceWorker.addEventListener('controllerchange', function() {
		if (refreshing) return;
		console.log("Refresh page!");
		//window.location.reload();
		refreshing = true;
	});

	var trackInstalling = function(worker) {
		var indexController = this;
		worker.addEventListener('statechange', function() {
			console.log("STATE CHANGE", worker.state);
			if (worker.state == 'installed') {
				updateReady(worker);
			}
		});
	};

	var updateReady = function(worker) {
		console.log("Update ready!");
		worker.postMessage({action: 'skipWaiting'});
	};

	navigator.serviceWorker.onmessage = function(e) {
		console.log("Message form SW:", e.data);
	}
}