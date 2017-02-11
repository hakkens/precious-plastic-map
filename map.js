// Leaflet Map

// set the map tiles layer aspect
var tileLayer = new L.TileLayer(
	'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		'attribution':
		'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	});

// init the map params on map div
var map = new L.Map('map', {
	'center': [45.8, -5.8],
	'zoom': 3,
	'layers': [tileLayer]
});

// setup map options here

// locate module
var lc = L.control.locate({
	position: 'topleft',
	flyTo: true,
	drawCircle: false,
	drawMarker: false,
	locateOptions: {
		maxZoom: 12
	},
	strings: {
		title: "Locate Precious Plastic near me"
	}
}).addTo(map);
// on page load locate me
lc.start();
