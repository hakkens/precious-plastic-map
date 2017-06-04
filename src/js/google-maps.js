import './../../lib/markerclusterer'
import m1 from '../img/m1.png'
import m2 from '../img/m2.png'
import m3 from '../img/m3.png'
import m4 from '../img/m4.png'
import m5 from '../img/m5.png'

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
