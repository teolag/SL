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