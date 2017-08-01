import mapStyleConfig from './map-style.json'
import generateMarkerContent from './map-popup'
import initSearch from './map-search'
import { getQueryVariable } from './utils'
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
  let userClicked = false;

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
  const lat = parseFloat(getQueryVariable('lat'));
  const lng = parseFloat(getQueryVariable('lng'));

  if (!lat || !lng) return null;

  return {
    lat: lat,
    lng: lng
  }
}