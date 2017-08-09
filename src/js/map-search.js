import { getElement } from './utils'

export default function initSearch(map) {
  const input = getElement('search')
  const searchBox = new google.maps.places.SearchBox(input)
  let searchMarkers = []

  map.addListener('bounds_changed', () => {
    searchBox.setBounds(map.getBounds())
  })

  getElement('close-search').addEventListener('click', () => {
    input.value = ''
    resetSearchMarkers(searchMarkers)
    searchMarkers = []
    map.setZoom(5)
  })

  searchBox.addListener('places_changed', () => {
    const places = searchBox.getPlaces()
    if (places.length === 0) return

    resetSearchMarkers(searchMarkers)
    searchMarkers = []

    const bounds = new google.maps.LatLngBounds()
    places.forEach(place => {
      if (!place.geometry) return

      createSearchMarker(place, searchMarkers, map)

      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport)
      } else {
        bounds.extend(place.geometry.location)
      }
    })
    map.fitBounds(bounds)
  })
}

function resetSearchMarkers(markers) {
  markers.forEach(marker => marker.setMap(null))
}

function createSearchMarker(place, searchMarkers, map) {
  const icon = {
    url: place.icon,
    size: new google.maps.Size(71, 71),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17, 34),
    scaledSize: new google.maps.Size(25, 25)
  }

  searchMarkers.push(new google.maps.Marker({
    map: map,
    icon: icon,
    title: place.name,
    position: place.geometry.location
  }))
}
