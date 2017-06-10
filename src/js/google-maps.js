import { FILTERS, HASHTAGS } from './const'
import { createElement } from './utils'
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
    this.newPin = null
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

    checkForGeoLocation(this.map)

    this.infoWindow = new google.maps.InfoWindow()

    this.savePinInfoWindow = new google.maps.InfoWindow()
    this.savePinInfoWindow.setContent(generateSavePinInfoWindow(this.savePin(), this.removePin()))

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

  addPin() {
    if (this.newPin) {
      this.map.panTo(this.newPin.getPosition())
      this.showAddPinInfo()(this.newPin)
      return
    }

    this.newPin = getNewPinMarker(this.map, this.showAddPinInfo())
    this.showAddPinInfo()(this.newPin)
  }

  savePin() {
    return () => {
      const urlKeys = {
        lat: {
          key: 'entry.1563030055',
          value: this.newPin.getPosition().lat()
        },
        lng: {
          key: 'entry.1806137749',
          value: this.newPin.getPosition().lng()
        }
      }

      const params = Object.keys(urlKeys).map(param => urlKeys[param].key + '=' + encodeURIComponent(urlKeys[param].value))

      const url = 'https://docs.google.com/forms/d/e/1FAIpQLScx24LA8KrQA9XnPJ8FQokKMl5EnhDEs35xbcKqxbcvGaXt-Q/viewform?usp=pp_url&' +
        params.join('&')

      const survey = window.open(url, '_blank')
      survey.focus()
      this.newPin.setMap(null)
      this.newPin = null
    }
  }

  removePin() {
    return () => {
      if (!this.newPin) return
      this.newPin.setMap(null)
      this.newPin = null
    }
  }

  showAddPinInfo() {
    return marker => {
      const content = this.savePinInfoWindow.getContent()
      content.getElementsByClassName('popup__lat')[0].innerHTML = 'Lat: ' + marker.getPosition().lat()
      content.getElementsByClassName('popup__lng')[0].innerHTML = 'Lng: ' + marker.getPosition().lng()
      this.savePinInfoWindow.open(this.map, marker)
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

function getNewPinMarker(map, clickHandler) {
  const marker = new google.maps.Marker({
    position: map.getCenter(),
    draggable: true,
    animation: google.maps.Animation.DROP
  })
  marker.addListener('click', () => { clickHandler(marker) })
  marker.addListener('dragend', () => { clickHandler(marker) })
  marker.setMap(map)
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
        ${data.hashtags.map(tag => `<li class="popup__tag">#${HASHTAGS[tag]}</li>`).join('')}
      </ul>
    </div>
  `
}

function generateSavePinInfoWindow(savePinHandler, cancelPinHandler) {
  //export function createElement({ tag, cls, type, name, value, checked }) {
  const wrapper = createElement({
    tag: 'div',
    cls: 'pipup--addpin'
  })

  wrapper.innerHTML = `
      <h2 class="popup__header">Add Pin</h2>
      <p class="popup__lat" id="addpin-lat"></p>
      <p class="popup__lng" id="addpin-lng"></p>
  `

  const savePinButton = createElement({
    tag: 'button',
    cls: 'btn btn-primary'
  })
  savePinButton.innerHTML = 'Save'
  savePinButton.addEventListener('click', () => { savePinHandler() })
  wrapper.appendChild(savePinButton)

  const cancelPinButton = createElement({
    tag: 'button',
    cls: 'btn'
  })
  cancelPinButton.innerHTML = 'Cancel'
  cancelPinButton.addEventListener('click', () => { cancelPinHandler() })
  wrapper.appendChild(cancelPinButton)

  return wrapper
}
