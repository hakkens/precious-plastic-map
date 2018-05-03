import L from 'leaflet'
import clusters from './cluster'
import generateMarkerContent from './map-popup'
import { getQueryVariable } from '../utils'
import { getMarker } from './sprite'
import Search from './search'

export default class LeafletMap {

  constructor() {
    this.markers = []
    this.markerClusters = clusters
  }

  render(domElement, searchElement) {
    const defaultLocation = [52.373, 4.8925]
    const urlParamLocation = getUrlParamLocation()
    const scrollWheelZoom = !(getQueryVariable('scrollzoom') === 'false')

    this.map = L.map(domElement, {
      scrollWheelZoom,
      center: urlParamLocation || defaultLocation,
      zoom: urlParamLocation ? 13 : 3
    })

    this.search = new Search(this.map)
    this.search.init(searchElement)

    const osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    const osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    const osm = new L.TileLayer(osmUrl, { minZoom: 3, maxZoom: 18, attribution: osmAttrib })
    osm.addTo(this.map)

    if (!urlParamLocation) checkForGeoLocation(this.map)
  }

  setData(data) {
    const markerMap = new Map()
    data.map(d => {
      if (!markerMap.has(d.filter)) markerMap.set(d.filter, [])
      const markers = markerMap.get(d.filter)
      const marker = getMarker(d)
      marker.bindPopup(L.popup({ minWidth: 299, maxWidth: 299, className: 'marker-popup' }).setContent(generateMarkerContent(d)))
      markerMap.set(d.filter, markers.concat([marker]))
    })

    for (const key of markerMap.keys()) {
      this.markerClusters[key].addLayers(markerMap.get(key))
    }
  }

  setFilters(filters) {
    for (const key of Object.keys(this.markerClusters)) {
      if (filters.includes(key)) this.markerClusters[key].addTo(this.map)
      else this.markerClusters[key].remove()
    }
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
