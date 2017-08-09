import mapStyleConfig from './map-style.json'
import generateMarkerContent from './map-popup'
import initSearch from './map-search'
import { getQueryVariable } from './utils'
import markerIcon from '../img/marker.png'

export default class GoogleMap {

  constructor() {
    this.markers = []
  }

  render(domElement) {
    const defaultLocation = { lat: 52.373, lng: 4.8925 }
    const urlParamLocation = getUrlParamLocation()

    this.map = new google.maps.Map(domElement, {
      center: urlParamLocation || defaultLocation,
      zoom: urlParamLocation ? 13 : 3,
      minZoom: 3,
      mapTypeControlOptions: {
        mapTypeIds: ['styled_map', 'satellite']
      }
    })

    const styledMap = new google.maps.StyledMapType(mapStyleConfig, { name: 'Map' })
    this.map.mapTypes.set('styled_map', styledMap)
    this.map.setMapTypeId('styled_map')

    if (!urlParamLocation) checkForGeoLocation(this.map)
    initSearch(this.map)

    this.infoWindow = new google.maps.InfoWindow()

    google.maps.event.addListener(this.map, 'click', event => this.infoWindow.close())
  }

  setData(data) {
    this.setMapOnMarkers(null)
    this.markers = data.map(marker => getMarkerFromData(marker, this.markerClicked()))
    this.setMapOnMarkers(this.map)
  }

  markerClicked() {
    return (marker, data) => {
      this.infoWindow.setContent(generateMarkerContent(data))
      this.infoWindow.open(this.map, marker)
    }
  }

  setMapOnMarkers(mapToSet) {
    this.markers.forEach(marker => marker.setMap(mapToSet))
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
  let userClicked = false

  document.addEventListener('click', () => {
    userClicked = true
  })

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      if (!userClicked) map.panTo(pos)
    })
  }
}

function getUrlParamLocation() {
  const lat = getQueryVariable('lat')
  const lng = getQueryVariable('lng')

  if (lat === false || lng === false) return null

  return {
    lat: parseFloat(lat),
    lng: parseFloat(lng)
  }
}

