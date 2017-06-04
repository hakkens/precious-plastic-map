import preciousStyle from './map-style.json'
import './../../lib/markerclusterer'
import m1 from '../img/m1.png'
import m2 from '../img/m2.png'
import m3 from '../img/m3.png'
import m4 from '../img/m4.png'
import m5 from '../img/m5.png'

export default class GoogleMap {

  constructor() {
    this.data = []
    this.filters = []
  }

  render(domElement) {
    const defaultLocation = { lat: 52.373, lng: 4.8925 }
    this.map = new google.maps.Map(domElement, {
      center: defaultLocation,
      zoom: 4,
      minZoom: 3,
      mapTypeControlOptions: {
        mapTypeIds: ['styled_map', 'satellite'],
      },
    })

    const styledMap = new google.maps.StyledMapType(preciousStyle, { name: 'Map' })

    this.map.mapTypes.set('styled_map', styledMap)
    this.map.setMapTypeId('styled_map')

    checkForGeoLocation(this.map)
  }

  setMarkers(data) {
    this.data = data
    const markers = this.data.map((marker) => getMarkerFromData(marker))
    setDisplayMarkers(this.map, markers)
  }
}

function getMarkerFromData(data) {
  return new google.maps.Marker({
    position: {
      lat: data.lat,
      lng: data.lng,
    },
    label: data.name,
  })
}

function setDisplayMarkers(map, markers) {
  new MarkerClusterer(map, markers, {
    imagePaths: [m1, m2, m3, m4, m5],
  })
}

function checkForGeoLocation(map) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }

      map.panTo(pos)
    }, () => {})
  }
}
