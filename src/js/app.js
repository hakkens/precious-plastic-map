import { FILTERS } from './const'
import _ from 'lodash'
import { getElement, createElement, openNewWindow } from './utils'
import Fuse from 'fuse.js'

export default class App {

  constructor({ data, map }) {
    this.data = data
    this.map = map
    this.activeFilters = []
    this.query = ''
    this.locationData = []
    this.fuse = {}
  }

  async initApp() {
    const filters = Object.keys(FILTERS).map(filter => ({ key: filter, value: FILTERS[filter] }))
    this.createFilterElements(filters)
    this.activeFilters = filters.map(filter => filter.key)
    this.locationData = await this.data.getLocations()
    this.createSearch()
    getElement('add-pin').addEventListener('click', () => openNewWindow(process.env.WP_ADD_PIN))
    this.setData()
  }

  createFilterElements(filters) {
    const container = getElement('filters')

    filters.forEach(filter => {
      const labelEl = createElement({
        tag: 'label',
        cls: 'panel__checkbox-item'
      })
      const inputEl = createElement({
        tag: 'input',
        cls: 'panel__checkbox',
        type: 'checkbox',
        name: 'filter',
        checked: 'true',
        value: filter.key
      })
      const textEl = document.createTextNode(filter.value)

      inputEl.addEventListener('click', () => {
        this.activeFilters = _.xor(this.activeFilters, [filter.key])
        this.setData()
      })
      labelEl.appendChild(inputEl)
      labelEl.appendChild(textEl)
      container.appendChild(labelEl)
    })
  }

  createSearch() {
    const options = {
      shouldSort: true,
      includeMatches: true,
      threshold: 0.2,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 2,
      keys: [
        'name',
        'address',
        'description',
        'hashtags'
      ]
    }
    this.fuse = new Fuse(this.locationData, options)

    getElement('search').addEventListener('input', _.debounce(event => {
      this.query = event.target.value
      this.setData()
    }, 300))

    getElement('close-search').addEventListener('click', () => {
      getElement('search').value = ''
      this.query = ''
      this.setData()
    })
  }

  setData() {
    const { locationData, query, activeFilters } = this

    const searched = (query.length > 1)
      ? _.map(this.fuse.search(query), 'item')
      : locationData

    const filtered = applyFilters(locationData, activeFilters)

    const updatedLocations = _.intersection(searched, filtered)
    this.map.setData(updatedLocations)
  }
}

function applyFilters(locationData, activeFilters) {
  return locationData.filter(location => {
    return !_.isEmpty(_.intersection(location.filters, activeFilters))
  })
}
