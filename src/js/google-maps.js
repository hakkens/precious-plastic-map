import { FILTERS } from './const'
import mapStyleConfig from './map-style.json'
import './../../lib/markerclusterer'
import markerIcon from '../img/marker.png'
import m1 from '../img/m1.png'
import m2 from '../img/m2.png'
import m3 from '../img/m3.png'
import m4 from '../img/m4.png'
import m5 from '../img/m5.png'

export default class GoogleMap {

  constructor() {
    this.markers = []
  }

  render(domElement) {
    const defaultLocation = { lat: 52.373, lng: 4.8925 }
    this.map = new google.maps.Map(domElement, {
      center: defaultLocation,
      zoom: 4,
      minZoom: 3,
      mapTypeControlOptions: {
        mapTypeIds: ['styled_map', 'satellite']
      }
    })

    const styledMap = new google.maps.StyledMapType(mapStyleConfig, { name: 'Map' })

    this.map.mapTypes.set('styled_map', styledMap)
    this.map.setMapTypeId('styled_map')

    this.infoWindow = new google.maps.InfoWindow()
    checkForGeoLocation(this.map)

    this.markerCluster = new MarkerClusterer(this.map, this.markers, { imagePaths: [m1, m2, m3, m4, m5] })
  }

  setData(data) {
    this.markerCluster.clearMarkers()
    this.markers = data.map(marker => getMarkerFromData(marker, this.markerClicked()))
    this.markerCluster.addMarkers(this.markers)
  }

  markerClicked() {
    return (marker, data) => {
      this.infoWindow.setContent(generateMarkerContent(data))
      this.infoWindow.open(this.map, marker)
    }
  }
}

function getMarkerFromData(data, clickHandler) {
  const marker = new google.maps.Marker({
    position: {
      lat: data.lat,
      lng: data.lng
    },
    icon: markerIcon
  })

  marker.addListener('click', () => { clickHandler(marker, data) })
  return marker
}

function checkForGeoLocation(map) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }

      map.panTo(pos)
    }, () => {})
  }
}

function generateMarkerContent(data) {
  return `
    <div class="popup">
      <h2 class="popup__header">${data.name}</h2>
      <p class="popup__description">${data.description}</p>
      <ul class="popup__filters">
        ${data.filters.map(filter => `<li class="popup__filter">${FILTERS[filter]}</li>`).join('')}
      </ul>
      <p class="popup__status">${data.status}</p>
      <a href="${data.website}" class="popup__website">${data.website}</a>
      <ul class="popup__tags">
        ${data.hashtags.map(tag => `<li class="popup__tag">#${tag}</li>`).join('')}
      </ul>
    </div>
  `
}

