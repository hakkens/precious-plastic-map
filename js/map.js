// Dependencies
var $ = require('jquery');
require('leaflet');
require('leaflet.locatecontrol');
require('leaflet-control-geocoder');
require('leaflet-search');

var daveSite = 'http://172.17.0.2/';
var daveSite = 'http://187.217.174.169/ppWP/';
var hashtags = [];
var services = [];
var currentFormInt = 0;
$("#interaction_form .close").click(function(){
  $("#interaction_form").fadeOut();
});
var form_interactions={
  login: {
    title: 'Good to See Youu Here AMIGO!',
    subtitle: 'Log in to your Dave Hakken\'s account to create a pin.',
  },
  new_pin: {
    title: 'ADD YOUR PIN DETAILS',
    subtitle: '',
    pages:[
      {
        question: 'Type your pin address, so we can locate it on the map.',
        placeholder: 'Your address'
      },
      {
        question: 'Name of the pin',
        placeholder: 'Precious Plastic'
      },
      {
        question: 'Description(200 char max)',
        placeholder: 'Precious Plastic'
      },
    ]
  }
}

console.log(form_interactions);

function loadForm(){
  currentFormInt = 0;
}

$("#add_pin").click(function(){
  $("#interaction_form").fadeIn();
//  addPin();
});

function getTaxonomies(){
  $.ajax({
    url: daveSite+'wp-json/pp_pins/v1/services',
    dataType: 'json',
    success:function(json){
      var layers = $("#layers ul.layer-checkboxes");
      services = [];
      for(var i=0; i<json.length; i++){
        services[json[i].id] = {
          logo: json[i].logo,
          description: json[i].description
        }
        layers.append('<li><label><input type="checkbox" name="services" value="'+ json[i].id +'" checked="checked"><i class="fa '+ json[i].logo +'"></i> '+ json[i].description +'</label></li>');
      }
    },
    error:function(jqXHR, textStatus, errorThrown){
      console.log(textStatus);
    }
  });
  $.ajax({
    url: daveSite+'wp-json/pp_pins/v1/tags',
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

function parseDBMarker(pin){
  var marker_data = {
    latlng: [pin.lat, pin.long],
    name: pin.name,
    paragraph: pin.description,
    layers: pin.services,
    status: pin.status,
    url: pin.url,
    hashtags: pin.tags
  }
  return marker_data;
}
function addPin(){
  $.ajax({
    url: daveSite+'wp-json/pp_pins/v1/pins',
    dataType: 'json',
    method: 'post',
    data: {lat: 19.543, long: -48.532, name: 'Test Web GUI', description: 'GUI: Tut aute nisi eiusmod ad velit elit culff', status: 'testing',url: ''},
    success:function(json){
      createMarker(parseDBMarker(json));
    },
    error:function(jqXHR, textStatus, errorThrown){
      console.log(textStatus);
    }
  });
}

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
    url: daveSite+'wp-json/pp_pins/v1/pins',
    dataType: 'json',
    success:function(json){
      for(var i=0; i<json.length; i++){
        createMarker(parseDBMarker(json[i]));
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
    icon.setAttribute("class", "fa " + services[el].logo);
    var text = document.createTextNode(" " + services[el].description);
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
//lc.start();

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
