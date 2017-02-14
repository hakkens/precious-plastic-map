// Leaflet Map

// set the map tiles layer aspect
var tileLayer = new L.TileLayer(
	'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		'attribution':
		'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}
);

// init the map params on map div
var map = new L.Map('map', {
	'center': [45.8, -5.8],
	'zoom': 3,
	'layers': [tileLayer]
});

// setup map options here

var ppIcon = L.icon({
  iconUrl: 'images/icon.png',
  popupAnchor:  [25, 0] // point from which the popup should open relative to the iconAnchor
});

var popupOptions = {
  'className' : 'custom',
  'closeButton' : false
}

var marker_data = {
  latlng: [52.3707599, 4.889869200000021],
  name: "BOPE",
  paragraph: "Lorem ipsum Elit in nisi ut ut aute nisi eiusmod ad velit elit culpa pariatur enim dolor officia consectetur officia eu sint commodo deserunt culpa minim adipisicing laborum.",
  layers: [
    {
      icon: "fa-wrench",
      text: "Workshop"
    },
    {
      icon: "fa-cog",
      text: "Machine Builder"
    },
    {
      icon: "fa-shopping-basket",
      text: "Shop"
    }
  ],
  status: "Open for visit",
  url: "http://www.bope.th",
  hashtags: ["Shredder", "Injection", "Extrusion", "Compression"]
}

function createLayerList(layers) {
  var list = document.createElement("ul");
  list.setAttribute('class', 'layer-list');
  layers.forEach( function(el, index) {
    var li = document.createElement("li");
    var icon = document.createElement("i");
    icon.setAttribute("class", "fa " + el.icon);
    var text = document.createTextNode(` ${el.text}`);
    li.appendChild(icon);
    li.appendChild(text);
    list.appendChild(li);
  });
  return list;
}

function createHashtagList(hashtags, url){
  var list = document.createElement("ul");
  list.setAttribute('class', 'list-inline');
  hashtags.forEach( function(el, index) {
    var li = document.createElement("li");
    var ht = document.createElement("a");
    ht.setAttribute('class', 'hashtag');
    ht.setAttribute('href', url);
    var text = document.createTextNode(`#${el}`);
    ht.appendChild(text);
    li.appendChild(ht);
    list.appendChild(li);
  });
  return list;
}

function createMarker(data) {
  var marker = L.marker(data.latlng, {icon: ppIcon}).addTo(map);
  marker.bindPopup(function (evt) {
  var list = createLayerList(data.layers);
  var contact = "<a href='#' class='btn btn-primary'>CONTACT</a>"
  var details = "<div class='details'> <div><span>" + data.status + "</span> <br> <a href='" + data.url + "'>" + data.url + "</a></div> " + contact + " </div>"
  var hashtags = createHashtagList(data.hashtags, "#");
  return L.Util.template("<h3 class='name'>{name}</h3><p class='paragraph'>{paragraph}</p>" + list.outerHTML + details + hashtags.outerHTML, data);
  }, popupOptions);
}

createMarker(marker_data);

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

// geocoder
var geocoder = L.Control.geocoder({
	defaultMarkGeocode: false
})
.on('markgeocode', function(e) {
	var bbox = e.geocode.bbox;
	var poly = L.polygon([
		bbox.getSouthEast(),
		bbox.getNorthEast(),
		bbox.getNorthWest(),
		bbox.getSouthWest()
	])
.addTo(map);
	map.fitBounds(poly.getBounds());
})
.addTo(map);
