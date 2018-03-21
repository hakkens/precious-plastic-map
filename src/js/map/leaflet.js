import L from 'leaflet'
import 'leaflet.markercluster'
import generateMarkerContent from './map-popup'
import { getQueryVariable } from '../utils'
import { getClusterIcon, getMarker } from './sprite'

export default class LeafletMap {

  constructor() {
    this.markers = []
    this.markerCluster = L.markerClusterGroup({
      maxClusterRadius: 40,
      iconCreateFunction: cluster => {
        const count = cluster.getChildCount()
        return getClusterIcon(count)
      }
    })
  }

  render(domElement) {
    const defaultLocation = [52.373, 4.8925]
    const urlParamLocation = getUrlParamLocation()

    this.map = L.map(domElement).setView(
      urlParamLocation || defaultLocation,
      urlParamLocation ? 13 : 3
    )

    const osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    const osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    const osm = new L.TileLayer(osmUrl, { minZoom: 3, maxZoom: 18, attribution: osmAttrib })
    osm.addTo(this.map)

    this.map.addLayer(this.markerCluster)

    if (!urlParamLocation) checkForGeoLocation(this.map)
  }

  setData(data) {
    this.markerCluster.removeLayers(this.markers)
    this.markers = data.map(d => {
      const marker = getMarker(d)
      marker.bindPopup(L.popup({ minWidth: 299, maxWidth: 299, className: 'marker-popup' }).setContent(generateMarkerContent(d)))
      return marker
    })
    this.markerCluster.addLayers(this.markers)
  }
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
      if (!userClicked) {
        map.panTo(pos)
        map.setZoom(6)
      }
    })
  }
}

function getUrlParamLocation() {
  const lat = getQueryVariable('lat')
  const lng = getQueryVariable('lng')

  if (lat === false || lng === false) return null

  return [
    parseFloat(lat),
    parseFloat(lng)
  ]
}
