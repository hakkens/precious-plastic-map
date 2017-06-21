// Dependencies
var $ = require('jquery');
global.jQuery = $;
//require('bxslider');
require('slider-pro');
require('leaflet');
require('leaflet.markercluster');
require('leaflet.locatecontrol');
require('leaflet-control-geocoder');
require('leaflet-search');

var daveSite = '../';
var hashtags = [];
var services = [];
var currentFormInt = 0;
var formInteractionsData = {};
var sessionNonce = null;
var afterLogIn = null;
var coordinates = [];
var newMarkerShown = false;
var markers = [];

var markerCluster = L.markerClusterGroup();

$("#interaction_form #btnLogIn").click(function(){
  data = {
    'log':		$("#interaction_form #user").val(),
    'pwd':		$("#interaction_form #password").val(),
    'rememberme':	$("#interaction_form #remember").val(),
    'wp-submit':	'Log+In',
    'redirect_to':	'nonce/'
  }
  if(data.log.length<2 || data.pwd.length<2){
    $("#interaction_form #result").html("Please input valid data");
    return;
  }
  $.ajax({
    url: daveSite+'wp-login.php',
    dataType: 'json',
    method: 'post',
    data: data,
    success:function(json,a ,b){
      sessionNonce = json.nonce;
      $("#interaction_form").fadeOut();
      $("#interaction_form #result").html("");
      if(afterLogIn != undefined){
        afterLogIn();
      }
    },
    error:function(jqXHR, textStatus, errorThrown){
      $("#interaction_form #result").html("Could not log in...");
      console.log(textStatus);
    }
  });
})
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
        source: services,
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
        placeholder: 'Website, facebook, twitter, etc...',
      },
      {
        var: 'tags',
        type: 'catalog',
        simple: true,
        source: hashtags,
        question: 'Have you built any Precious Plastic machine?',
      },
      {
        var: 'photos',
        type: 'photos',
        max: 3,
        question: 'Finally, upload images of your workshop, creations or experiments',
      },
    ]
  }
}

function dropMarker(latlng){
  var marker = L.marker(latlng, {icon: ppIconAdd, draggable: true, zIndexOffset: 10000}).addTo(map);
  newMarkerShown = true;

  marker.on('dragend', function(event){
    var marker = event.target;
    var position = marker.getLatLng();
    map.panTo(new L.LatLng(position.lat, position.lng));
    marker.openPopup();
  });

  marker.bindPopup(function (evt) {
    var marker = evt._popup._source;
    var position = marker.getLatLng();
    var addB = $('<button/>', {class: 'btn btn-primary addB', text: 'Add'});
    addB.click(function(){
      loadForm();
      coordinates = [position.lat, position.lng];
      map.removeLayer(marker);
      newMarkerShown = false;
    })
    var cancelB = $('<button/>', {class: 'btn btn-primary cancelB', text: 'Cancel'});
    cancelB.click(function(){
      map.removeLayer(marker);
      newMarkerShown = false;
    })

    var popup = document.createElement('div');
    popup.className= 'popupData';
    var title = $('<h3>', {class: 'name', text: "Add Pin"});
    var coords = $('<div>', {class: 'coords', html: "Lat: " + position.lat + "</br>Lng: " + position.lng});
    $(popup).append(title);
    $(popup).append(coords);
    $(popup).append(addB);
    $(popup).append(cancelB);

    return popup;
  }, popupOptions);
  marker.openPopup();
}

function loadLogIn(action, after){
  $("#interaction_form").fadeIn();
  if(after != undefined){
    afterLogIn = after;
  }
}

function loadForm(action){
  switch(action){
    case 'next':
      var name = formInteractions.new_pin.pages[currentFormInt].var;
      var type = formInteractions.new_pin.pages[currentFormInt].type;
      switch(type){
        case 'bool':
          formInteractionsData[name] =  $('input[name='+name+']:checked').val();
        break;
        case 'catalog':
          formInteractionsData[name] =  pinSelectedCategories;
        break;
        case 'photos':
          var photos = [];
          imgs = $('#interaction_form .photos').find(".imgUpload img");
          for(var i=0; i<imgs.length; i++){
            var src = $(imgs[i]).prop('src');
            if(src.indexOf('images/upload.png') == -1){
              photos.push(src);
            }
          }
          formInteractionsData[name] =  photos;
        break;
        case 'coord':
          formInteractionsData.lat = coordinates[0];
          formInteractionsData.long = coordinates[1];
        default:
          formInteractionsData[name] = $('#'+name).val();
        break;
      }
      currentFormInt += 1;
      if(currentFormInt >= formInteractions.new_pin.pages.length){
        sendForm();
      }
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
        loadForm('next');
      });
      controls.append(sendB);
      $("#interaction_form").fadeIn();
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
/* //Disable geocoding, we have latlng allready
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
//TODO: Fix
        var latlng = L.LatLng(position.lat, position.lng);
        dropMarker(e.data.html().split(','));
      });
*/
      input.append(temp);
      var temp = $('<div>', {id: 'coord_options'});
      input.append(temp);
      break;
    case 'catalog':
      pinSelectedCategories = [];
      var input = $('<div>', {class: 'catalog'});
      var simple = page.simple;
      for(var i=0; i<page.source.length; i++){
        var el = page.source[i];
        if(typeof el === 'undefined'){
          continue;
        }
        var butt = $('<button/>', {class: 'btn', html: simple?el:el.name, value: i});
        butt.click(function(e){
          var butt = $(e.target);
          if(butt.hasClass('selected')){
            butt.removeClass('selected')
            var index = pinSelectedCategories.indexOf(butt.val());
            if(index > -1){
              pinSelectedCategories.splice(index, 1);
            }
          }else{
            butt.addClass('selected');
            pinSelectedCategories.push(butt.val());
          }
        });
        if(simple){
          input.append(butt);
        }else{
          var icon = $('<i>', {'class': 'fa ' + el.logo});
          butt.html(' '+butt.html());
          butt.prepend(icon);
          var cont = $('<div>', {class: 'cont'});
          var desc = $('<div>', {class: 'desc', html: el.description});
          cont.append(butt);
          cont.append(desc);
          input.append(cont);
        }
      }
      break;
    case 'bool':
      var input = $('<div>', {class: 'bool'});
      var labelT = $('<label>', {html:page.valTrue});
      var temp = $('<input>', {type:'radio', name: page.var, id: page.var, value:1});
      labelT.prepend(temp);
      input.append(labelT);
      labelT = $('<label>', {html:page.valFalse});
      temp = $('<input>', {type:'radio', name: page.var, id: page.var, value:0});
      labelT.prepend(temp);
      input.append(labelT);
      break;
    case 'photos':
      pinSelectedCategories = [];
      var input = $('<div>', {class: 'photos'});
      for(var i=0; i<page.max; i++){
        var labelT = $('<label/>', {for:'photo_'+i, class: 'imgUpload', html: '<img src="images/upload.png"></img>'});
        var file = $('<input/>', {type:'file', name:'photo_'+i, id:'photo_'+i});
        //addStatus ¿?
        //addEventListener('change', handleFileSelect, false);
        file.change(function(e){
          var id		= e.target.id;
          var target		= $("label[for='"+id+"'] img");
          var files		= e.target.files;
          var maxSize		= 104857600;


/*    if(!multiple){                              //Si no es multiple limpiamos posible estado previo
      var prevBar = $('progress_bar_'+id);
      if(prevBar) prevBar.dispose();
      var padre = $('previews_'+id);
      padre.empty();
      if(binariosMap[id]!=null && binariosMap[id]['lector']!=null){     //Solo se puede tener un lector para binarios únicos
        if(binariosMap[id]['lector'].readyState == 1)binariosMap[id]['lector'].abort();         //si esta cargando abortamos
        binariosMap[id]['lector'] == null;
      }
    }
*/
      var file = files[0];
//TODO: manejar multiples
//    for (var i = 0, archivo; archivo = files[i]; i++) {

/*      var barra         = new Element('div.progress_bar', {id: 'progress_bar_'+id});
      var progress      = new Element('div.percent', {html:''});
      var estado        = new Element('div.status');
      barra.grab(progress, 'bottom');
      barra.grab(estado, 'bottom');
      $('previews_'+id).grab(barra, 'before');
*/
      try{
        if(!file.type.match('image.*')){
          console.log('Only image');
          return;
        }
        if(file.size>maxSize){
//          barra.addClass('loading');
//          estado.setProperty('html', 'El archivo excede el tama&ntilde;o m&aacute;ximo permitido.');
          console.log('El archivo excede el tama&ntilde;o m&aacute;ximo permitido.');
          return;
        }
      }catch(err){
//        barra.addClass('loading');
        console.log('Archivo no encontrado!');
//        estado.textContent = 'Archivo no encontrado!';
        return;
      }
      var reader        = new FileReader();

/*
      if($(id).hasClass('mapeo_binario_multiple')){
        if(binariosMap[id] == null){    //Si es el primero inicializamos
          binariosMap[id] = new Array();
        }
        var binarioMap = {
                           'barra'      : barra,
                           'progress'   : progress,
                           'estado'     : estado,
                           'nombre'     : archivo.name,
                           'lector'     : reader
                         };
        binariosMap[id].push(binarioMap);
      }else{
        binariosMap[id] = {
                            'barra'             : barra,
                            'progress'          : progress,
                            'estado'            : estado,
                            'nombre'            : archivo.name,
                            'lector'            : reader
                          };

      }

      reader.onerror = (function errorHandler(barra, progress, estado, reader){
        return function(evt){
          barra.addClass('loading');
          progress.textContent = '';
          switch(evt.target.error.code) {
            case evt.target.error.NOT_FOUND_ERR:
              estado.textContent = 'Archivo no encontrado!';
              break;
            case evt.target.error.NOT_READABLE_ERR:
              estado.textContent = 'No se pudo leer el archivo';
              break;
            case evt.target.error.ABORT_ERR:
              break; // noop
            default:
              estado.textContent = 'Error al leer el archivo';
          }
        }
        //TODO: Eliminar el reader
        reader = null;
      })(barra, progress, estado, reader);
      reader.onprogress = (function updateProgress(progress){
        return function (evt){
          if (evt.lengthComputable) {
            var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
            // Increase the progress bar length.
            if (percentLoaded < 100) {
              progress.style.width = percentLoaded + '%';
              progress.textContent = percentLoaded + '%';
            }
          }
        }
      })(progress);
//TODO: probar abort
      reader.onabort = (function(progress, estado){
        return function(e) {
          progress.style.width = '0%';
          progress.textContent = '';
          estado.textContent = 'Carga de archivo cancelada';
          //TODO: limpiar variables ¿?
        }
      })(progress, estado);
      reader.onloadstart = (function(estado, barra){
        return function(e) {
          estado.textContent = '';
          barra.addClass('loading');
        }
      })(estado, barra);

*/

      reader.onload = (function(id, file, target) {
        return function(e) {
         // Ensure that the progress bar displays 100% at the end.
//          progress.style.width = '100%';
//          progress.textContent = '100%';
          //TODO: Eliminar el reader
//          reader = null;
//          binariosMap[id].lector = null;
          var padre = $('previews_'+id);
          var nombre;
//            nombre = binariosMap[id].nombre;
//            binariosMap[id] = { 'nombre': nombre, 'datos': e.target.result};

          $(target).prop('src', e.target.result);
//          var container   = new Element('div.file_preview');
//          var texto       = new Element('div.texto', {html:nombre});
//          var closer      = new Element('div.closer',{onclick: 'removPreview(this);'});
//          container.grab(closer, 'bottom');
//          container.grab(texto, 'bottom');
//          container.grab(preview, 'bottom');
//          padre.grab(container, 'bottom');

//          var barra = progress.getParent();
//          new Fx.Tween(barra,{duration: 'long'}).start('opacity', 0).chain(function(){barra.destroy();});
        }
      })(id, file, target);

      // Read in the image file.
      reader.readAsDataURL(file);
//    reader.readAsBinaryString(file);
/*
      //Limpiar variables temporales
      barra     = null;
      progress  = null;
      estado    = null;
      archivo   = null;
      reader    = null;
    }
*/
/*
          var file = $(e.target);
          if(file.hasClass('selected')){
            file.removeClass('selected')
            var index = pinSelectedCategories.indexOf(butt.val());
            if(index > -1){
              pinSelectedCategories.splice(index, 1);
            }
          }else{
            butt.addClass('selected');
            pinSelectedCategories.push(butt.val());
          }
*/
        });
        labelT.append(file);
        input.append(labelT);
      }
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
  if(sessionNonce != null){
    newMarker();
  }else{
    loadLogIn('', newMarker);
  }
});

function newMarker(){
  if(newMarkerShown)return;
  var latlng = map.getCenter();
  dropMarker(latlng);
}
function getTaxonomies(){
  $.ajax({
    url: daveSite+'wp-json/pp_pins/v1/services',
    dataType: 'json',
    success:function(json){
      var layers = $("#layers ul.layer-checkboxes");
      services.length = 0;
      for(var i=0; i<json.length; i++){
        services[json[i].id] = {
          logo: json[i].logo,
          name: json[i].name,
          description: json[i].description
        }
        layers.append('<li><label><input type="checkbox" name="services" value="'+ json[i].id +'" checked="checked"><i class="fa '+ json[i].logo +'"></i> '+ json[i].name +'</label></li>');
      }
      layers.find(":checkbox").change(function(){
        for(var i=0; i<markers.length; i++){
          if(markers[i].services.indexOf(parseInt(this.value))!=-1){
            if(this.checked){
              markerCluster.addLayer(markers[i].marker);
            }else{
              markerCluster.removeLayer(markers[i].marker);
            }
          }
        }
      });
    },
    error:function(jqXHR, textStatus, errorThrown){
      console.log(textStatus);
    }
  });
  $.ajax({
    url: daveSite+'wp-json/pp_pins/v1/tags',
    dataType: 'json',
    success:function(json){
      hashtags.length = 0; 
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
    hashtags: pin.tags,
    images: pin.images
  }
  return marker_data;
}
function addPin(data){
  $.ajax({
    url: daveSite+'wp-json/pp_pins/v1/pins',
    dataType: 'json',
    method: 'post',
    data: data,
//    data: {lat: 19.543, long: -48.532, name: 'Test Web GUI', services: [1,2], tags: [1,3], description: 'GUI: Tut aute nisi eiusmod ad velit elit culff', status: '1', url: 'http://google.com', photos:data.photos},
    beforeSend: function ( xhr ) {
        xhr.setRequestHeader( 'X-WP-Nonce', sessionNonce );
    },
    success:function(json){
      var marker = createMarker(parseDBMarker(json), true);
      var markerData = {marker: marker, services: json.services, tags: json.tags};
      markers.push(markerData);
    },
    error:function(jqXHR, textStatus, errorThrown){
      console.log(jqXHR.responseText);
//      console.log(jqXHR);
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

map.addLayer(markerCluster);

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
  iconSize:  [32, 32],
  popupAnchor:  [0, -16]
});
var ppIconAdd = L.icon({
  iconUrl: 'images/icon_add.png',
  iconSize:  [40, 40],
  popupAnchor:  [0, -20]
});

var popupOptions = {
  'className' : 'custom',
  'closeButton' : false,
  'maxWidth' : "auto"
}

function getPins(){
  $.ajax({
    url: daveSite+'wp-json/pp_pins/v1/pins',
    dataType: 'json',
    success:function(json){
      for(var i=0; i<json.length; i++){
        var marker = createMarker(parseDBMarker(json[i]));
        var markerData = {marker: marker, services: json[i].services, tags: json[i].tags};
        markers.push(markerData);
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
    var text = document.createTextNode(" " + services[el].name);
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

function createMarker(data, centerTo ) {
  var marker = L.marker(data.latlng, {icon: ppIcon});// .addTo(map);
  markerCluster.addLayer(marker);
  marker.bindPopup(function (evt) {
    var popup = document.createElement('div');

    var slider = $('<div>', { class: 'slider-pro'});
    var slides = $('<div>', { class: 'sp-slides'});
    var photos = data.images.split('#');

    if(photos.length>0 && photos[0]!=""){
      for(var i=0; i<photos.length; i++){
        if(photos[i]=="")continue;
        var urls = photos[i].split('>');
        var slide = $('<div>', {class: 'sp-slide', html: '<img class="sp-image" src="images/blank.gif" data-src="' + urls[0] + '" data-small="' + urls[1] +'"/>'});
        slides.append(slide);
      }
      slider.append(slides);
      $(popup).append(slider);
    }

    var info = $('<div>', {class: 'popupData'});
    var title = $('<h3>', {class: 'name', text: data.name});
    var paragraph = $('<p>', {class: 'paragraph', text: data.paragraph});
    var contact = "<a href='#' class='btn btn-primary'>CONTACT</a>"
    var details = "<div class='details'> <div><span>" + (data.status!="0" ? "Open for visit" : "Not ready to make new friends") + "</span> <br> <a href='" + data.url + "'>" + data.url + "</a></div> " + contact + " </div>"
    var list = createLayerList(data.layers);
    var hashtags = createHashtagList(data.hashtags, "#");

    $(info).append(title);
    $(info).append(paragraph);
    $(info).append(list);
    $(info).append(details);
    $(info).append(hashtags);

    $(popup).append(info);
    if(centerTo){
      console.log('New');
      var unverified = $('<div>', {class: 'unverified', html: 'Awaiting verification'});
      $(info).append(unverified);
    }

    return popup;

  }, popupOptions);
  marker.on('popupopen', function (popup) {
      $('.slider-pro').sliderPro({
      width: 300,
      height: 130,
      fullScreen:  true,
      arrows: true,
      buttons: false,
      waitForLayers: true,
      fade: true,
      autoplay: true,
      slideDistance: 0,
      autoScaleLayers: false,
      smallSize: 300
    });
  });
  if(centerTo){
    marker.openPopup();
    map.flyTo(data.latlng, 15);
  }
  return marker;
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
  },
  onLocationError: function(error){
    console.log(error);
  }
}).addTo(map);
// on page load locate me
lc.start();

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
