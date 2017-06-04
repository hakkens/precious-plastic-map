import './../../lib/markerclusterer'
import '../img/m1.png'
import '../img/m2.png'
import '../img/m3.png'
import '../img/m4.png'
import '../img/m5.png'

export default class GoogleMap {

  constructor() {

  }

  render(domElement) {
    const nullIsland = { lat: 0, lng: 0 }
    this.map = new google.maps.Map(domElement, {
      center: nullIsland,
      zoom: 2,
    })

    checkForGeoLocation(this.map)
  }

  setData(data) {
    const markers = data.map((marker) => getMarkerFromData(marker))
    setDisplayMarkers(this.map, markers, { imagePath: 'img/m' })
  }

  setFilters(filters) {
    // chagnes active markers to the filters
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

function setDisplayMarkers(map, markers, opts) {
  new MarkerClusterer(map, markers, opts)
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
