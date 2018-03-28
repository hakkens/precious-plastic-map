import { getElement } from '../utils'
import autoComplete from 'js-autocomplete'
import { getSearchMarker } from './sprite'

export default class Search {

  constructor(map) {
    this.map = map
    this.center = map.getCenter()
    map.on('moveend', () => {
      this.center = map.getCenter()
    })
    this.search = this.search.bind(this)
  }

  init(elem) {
    this.elem = elem
    // eslint-disable-next-line
    new autoComplete({
      cache: false,
      selector: elem,
      source: this.search,
      delay: 300,
      renderItem: (item, search) => {
        search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
        const re = new RegExp('(' + search.split(' ').join('|') + ')', 'gi')
        return `<div class="autocomplete-suggestion"
                     data-lat="${item.lat}"
                     data-lng="${item.lng}"
                     data-bb="${item.boundingbox.join(',')}"
                     data-name="${item.name}">

                     ${item.name.replace(re, '<b>$1</b>')}
                </div>`
      },
      onSelect: (e, term, item) => {
        this.clearMarker()
        const lat = item.getAttribute('data-lat')
        const lng = item.getAttribute('data-lng')
        this.addMarker({ lat, lng })
        this.elem.value = item.getAttribute('data-name')

        const bb = item.getAttribute('data-bb').split(',')
        this.map.fitBounds([[bb[1], bb[0]], [bb[3], bb[2]]], { animate: true, duration: 1.5 })
      }
    })

    getElement('close-search').addEventListener('click', () => {
      elem.value = ''
      this.clearMarker()
      this.map.setZoom(5)
    })
  }

  search(term, response) {
    fetch(`https://geocoder.tilehosting.com/q/=${term}.js?key=bNVEpgp9GlG5znLAWAY5`)
      .then(res => res.json())
      .then(res => {
        const options = res.results.map(option => {
          return {
            name: option.display_name,
            boundingbox: option.boundingbox,
            lat: option.lat,
            lng: option.lon,
            rank: option.rank
          }
        })
        response(options ? options : ['No results found'])
      })
  }

  clearMarker() {
    if (this.marker) this.map.removeLayer(this.marker)
  }

  addMarker({ lat, lng }) {
    this.marker = getSearchMarker({ lat, lng })
    this.map.addLayer(this.marker)
  }
}
