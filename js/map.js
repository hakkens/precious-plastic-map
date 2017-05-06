// Dependencies
var $ = require('jquery');
require('leaflet');
require('leaflet.locatecontrol');
require('leaflet-control-geocoder');
require('leaflet-search');

var daveSite = 'http://172.17.0.2/';
var hashtags = [];
var services = [];
function getTaxonomies(){
  $.ajax({
    url: daveSite+'wp-json/wp/v2/ppmap_pin_service',
    dataType: 'json',
    success:function(json){
      var layers = $("#layers ul.layer-checkboxes");
      services = []; 
      for(var i=0; i<json.length; i++){
        layers.append('<li><label><input type="checkbox" name="'+ json[i].slug +'" value="'+ json[i].id +'" checked="checked">'+ json[i].name +'</label></li>');
        services[json[i].id] = {
          icon: json[i].slug,
          text: json[i].name
        }
      }
    },
    error:function(jqXHR, textStatus, errorThrown){
      console.log(textStatus);
    }
  });
  $.ajax({
    url: daveSite+'wp-json/wp/v2/ppmap_pin_tag',
    dataType: 'json',
    success:function(json){
      hashtags = []; 
      for(var i=0; i<json.length; i++){
        hashtags[json[i].id] = json[i].name;
      }
    },
    error:function(jqXHR, textStatus, errorThrown){
      console.log(textStatus);
    }
  });
}
getTaxonomies();

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

map.addControl( new L.Control.Search({
  url: 'http://nominatim.openstreetmap.org/search?format=json&q={s}',
  container: 'findbar',
  jsonpParam: 'json_callback',
  propertyName: 'display_name',
  propertyLoc: ['lat','lon'],
  marker: L.circleMarker([0,0],{radius:30}),
  collapsed: false,
  initial: false,
  minLength: 2
}));

// setup map options here

var ppIcon = L.icon({
  iconUrl: 'images/icon.png',
  popupAnchor:  [25, 0] // point from which the popup should open relative to the iconAnchor
});

var popupOptions = {
  'className' : 'custom',
  'closeButton' : false
}

function getPins(){
  $.ajax({
    url: daveSite+'wp-json/wp/v2/map_pins/',
    dataType: 'json',
    success:function(json){
      for(var i=0; i<json.length; i++){
        var pin = json[i];
        var marker_data = {
          latlng: [pin.meta.ppmap_lat, pin.meta.ppmap_lng],
          name: pin.title.rendered,
          paragraph: pin.content.rendered.replace(/<(?:.|\n)*?>/gm, ''),
          layers: pin.ppmap_pin_service,
          status: pin.meta.ppmap_status,
          url: pin.meta.ppmap_url,
          hashtags: pin.ppmap_pin_tag
        }
        createMarker(marker_data);
      }
    },
    error:function(jqXHR, textStatus, errorThrown){
      console.log(textStatus);
    }
  });
}
getPins();

function createLayerList(layers) {
  var list = document.createElement("ul");
  list.setAttribute('class', 'layer-list');
  layers.forEach( function(el, index) {
    var li = document.createElement("li");
    var icon = document.createElement("i");
    icon.setAttribute("class", "fa " + services[el].icon);
    var text = document.createTextNode(" " + services[el].text);
    li.appendChild(icon);
    li.appendChild(text);
    list.appendChild(li);
  });
  return list;
}

function createHashtagList(tags, url){
  var list = document.createElement("ul");
  list.setAttribute('class', 'list-inline');
  tags.forEach( function(el, index) {
    var li = document.createElement("li");
    var ht = document.createElement("a");
    ht.setAttribute('class', 'hashtag');
    ht.setAttribute('href', url);
    var text = document.createTextNode('#' + hashtags[el]);
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

// locate module
var lc = L.control.locate({
	position: 'topleft',
	flyTo: true,
	drawCircle: false,
	drawMarker: false,
	locateOptions: {
		maxZoom: 12.
	},
	strings: {
		title: "Locate Precious Plastic near me"
	}
}).addTo(map);
// on page load locate me
lc.start();

// geocoder
// var geocoder = L.Control.geocoder({
// 	defaultMarkGeocode: false
// })
// .on('markgeocode', function(e) {
// 	var bbox = e.geocode.bbox;
// 	var poly = L.polygon([
// 		bbox.getSouthEast(),
// 		bbox.getNorthEast(),
// 		bbox.getNorthWest(),
// 		bbox.getSouthWest()
// 	])
// .addTo(map);
// 	map.fitBounds(poly.getBounds());
// })
// .addTo(map);
