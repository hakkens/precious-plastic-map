// Dependencies
var $ = require('jquery');
//require('bxslider');
require('leaflet');
require('leaflet.locatecontrol');
require('leaflet-control-geocoder');
require('leaflet-search');

var daveSite = 'http://172.17.0.2/';
//var daveSite = 'http://187.217.174.169/ppWP/';
var hashtags = [];
var services = [];
var currentFormInt = 0;
$("#interaction_form .close").click(function(){
  $("#interaction_form").fadeOut();
})
var formInteractions={
  new_pin: {
    title: 'ADD YOUR PIN DETAILS',
    subtitle: '',
    pages:[
      {
        var: 'address',
        type: 'coord',
        question: 'Type your pin address, so we can locate it on the map.',
        placeholder: 'Your address',
      },
      {
        var: 'name',
        question: 'Name of the pin',
        placeholder: 'Precious Plastic',
      },
      {
        var: 'description',
        type: 'comment',
        question: 'Description(200 char max)',
        placeholder: 'Tell people about you, your space or what you do there',
      },
      {
        var: 'services',
        type: 'catalog',
        question: 'How are you involved with Precious Plastic?',
      },
      {
        var: 'status',
        type: 'bool',
        question: 'Are you open for visits?',
        valTrue:'Yes, of course!',
        valFalse:'No, I am shy :)',
      },
      {
        var: 'url',
        question: 'Somewhere else on the web?',
        placeholder: 'Tell people about you, your space or what you do there',
      },
      {
        var: 'tags',
        question: 'Have you built any Precious Plastic machine?',
      },
      {
        var: 'fotos',
        question: 'Finally, upload images of your workshop, creations or experiments',
      },
    ]
  }
}

function dropMarker(latlng){
  var marker = L.marker(latlng, {icon: ppIcon, draggable: true}).addTo(map);

  marker.on('dragend', function(event){
    var marker = event.target;
    var position = marker.getLatLng();
    marker.setLatLng(new L.LatLng(position.lat, position.lng),{draggable:'true'});
    map.panTo(new L.LatLng(position.lat, position.lng))
  });

  $("#interaction_form").fadeOut();
  map.flyTo(latlng, 15);
/*
  marker.bindPopup(function (evt) {
  var list = createLayerList(data.layers);
  var contact = "<a href='#' class='btn btn-primary'>CONTACT</a>"
  var details = "<div class='details'> <div><span>" + data.status + "</span> <br> <a href='" + data.url + "'>" + data.url + "</a></div> " + contact + " </div>"
  var hashtags = createHashtagList(data.hashtags, "#");
  return L.Util.template("<h3 class='name'>{name}</h3><p class='paragraph'>{paragraph}</p>" + list.outerHTML + details + hashtags.outerHTML, data);
  }, popupOptions);
*/
  
}

function loadLogIn(action){
}

var formInteractionsData = {};

function loadForm(action){
  switch(action){
    case 'next':
      //TODO: save var
      var name = formInteractions.new_pin.pages[currentFormInt].var;
      formInteractionsData[name] = $('#'+name).val();

      if(formInteractions.new_pin.pages[currentFormInt].type == 'coord'){
        var coordinates = $('#coordinates').html().split(',');
        formInteractionsData.lat = coordinates[0];
        formInteractionsData.long = coordinates[1];
      }
      currentFormInt += 1;
      
    break;
    case 'prev':
      currentFormInt -= 1;
    break;
    default:
      currentFormInt = 0;
      formInteractionsData = {};
      $("#interaction_form .title").html(formInteractions.new_pin.title);
      $("#interaction_form .subtitle").html(formInteractions.new_pin.subtitle);
      var controls = $("#interaction_form .controls");
      controls.empty();

      if(formInteractions.new_pin.pages.length>1){
        var pagger = $('<div>', {class: 'pagger'});
        controls.append(pagger);
        var prevB = $('<button/>', {class: 'btn btn-sign-prev prevB', text: 'Prev', style: 'display:none'});
        prevB.click(function(){
          loadForm('prev');
        });
        controls.append(prevB);
        var nextB = $('<button/>', {class: 'btn btn-sign-next nextB', text: 'Next'});
        nextB.click(function(){
          loadForm('next');
        });
        controls.append(nextB);
      }
      var sendB = $('<button/>', {class: 'btn btn-primary sendB', text: 'Create Pin', style: 'display:none'});
      sendB.click(function(){
        sendForm();
      });
      controls.append(sendB);
    break;
  }
  var form = $("#interaction_form .form");
  var page = formInteractions.new_pin.pages[currentFormInt];
  var now = currentFormInt+1;
  form.empty();
  var label = $('<label>', {for: page.var, text: page.question});
  form.append(label);

  switch(page.type){
    case 'coord':
      var input = $('<div>', {class: 'coord'});
      var temp = $('<input>', {type:'text', name: page.var, id: page.var, placeholder: page.placeholder});
      input.append(temp);
      temp.on('input', function(){
        $.ajax({
          url: 'http://photon.komoot.de/api/?',
          dataType: 'json',
          data: {q: $(this).val(), limit: 5},
          success:function(json, options){
            var options = $('#coord_options');
            options.empty();
            var i;
            for(i=0; i<json.features.length; i++){
              var item = $('<li>', {text: json.features[i].properties.name});
              item.click(json.features[i].geometry.coordinates, function(e){
                var coordinates = $('#coordinates');
                coordinates.html(e.data[1]+","+e.data[0]);
                console.log(e.data);
              });
              options.append(item);
            }
            if(i>0){
              options.slideDown();
            }else{
              options.slideUp();
            }
          },
          error:function(jqXHR, textStatus, errorThrown){
            console.log(textStatus);
          }
        });
      });
      var temp = $('<div>', {id: 'coordinates'});
      temp.click(temp, function(e){
        dropMarker(e.data.html().split(','));
      });
      input.append(temp);
      var temp = $('<div>', {id: 'coord_options'});
      input.append(temp);
      break;
    case 'catalog':
      var input = $('<input>', {type:'text', name: page.var, id: page.var, placeholder: page.placeholder});
      break;
    case 'bool':
      var input = $('<div>', {class: 'bool'});
      var labelT = $('<label>', {html:page.valFalse});
      var temp = $('<input>', {type:'radio', name: page.var, id: page.var, value:'True'});
      labelT.prepend(temp);
      input.append(labelT);
      labelT = $('<label>', {html:page.valTrue});
      temp = $('<input>', {type:'radio', name: page.var, id: page.var, value:'False'});
      labelT.prepend(temp);
      input.append(labelT);

      break;
    default:
      var input = $('<input>', {type:'text', name: page.var, id: page.var, placeholder: page.placeholder});
      break;
  }
  form.append(input);

  if(formInteractions.new_pin.pages.length>1){
    label.prepend('<span class="number">'+ now +'.</span>');
    $('#interaction_form .pagger').html(now +'/'+(formInteractions.new_pin.pages.length));
  }
  if(currentFormInt < formInteractions.new_pin.pages.length-1){
    if(currentFormInt>0){
      $('#interaction_form .prevB').show();
    }else{
      $('#interaction_form .prevB').hide();
    }
  }else{
    $('#interaction_form .prevB').hide();
    $('#interaction_form .nextB').hide();
    $('#interaction_form .sendB').show();
  }
}

function sendForm(){
  addPin(formInteractionsData);
  $("#interaction_form").fadeOut();
}

$("#add_pin").click(function(){
//  if(logdedIn){
  loadForm();
//  }
  $("#interaction_form").fadeIn();
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
function addPin(data){
  $.ajax({
    url: daveSite+'wp-json/pp_pins/v1/pins',
    dataType: 'json',
    method: 'post',
    data: data,
//    data: {lat: 19.543, long: -48.532, name: 'Test Web GUI', description: 'GUI: Tut aute nisi eiusmod ad velit elit culff', status: 'testing', url: ''},
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
	drawMarker: true,
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
//	defaultMarkGeocode: false
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
loadForm();
$("#interaction_form").fadeIn();
