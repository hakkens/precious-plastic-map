import { FILTERS } from './const'
import _ from 'lodash'
import { getElement, createElement } from './utils'
import Fuse from 'fuse.js'

export default class App {

  constructor({ data, map }) {
    this.data = data
    this.map = map
    this.activeFilters = []
    this.locations = []
  }

  async initApp() {
    this.locations = await this.data.getLocations()
    this.map.setData(this.locations)

    this.createSearch(this.locations)

    const filters = buildFilters(this.locations)
    this.createFilterElements(filters)

    this.activeFilters = filters.map(filter => filter.key)

    document.getElementById('add-pin').addEventListener('click', () => this.map.addPin())
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

      inputEl.addEventListener('click', () => this.toggleFilter(filter.key))
      labelEl.appendChild(inputEl)
      labelEl.appendChild(textEl)
      container.appendChild(labelEl)
    })
  }

  toggleFilter(filterKey) {
    this.activeFilters = _.xor(this.activeFilters, [filterKey])

    const filteredLocations = this.locations.filter(location => {
      return !_.isEmpty(_.intersection(location.filters, this.activeFilters))
    })
    this.map.setData(filteredLocations)
  }

  createSearch(locations) {
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
    const fuse = new Fuse(locations, options)

    getElement('search').addEventListener('input', _.debounce(event => {
      const query = event.target.value
      if (query.length > 1) {
        this.runSearch(event.target.value, fuse)
      }
      if (query.length === 0) {
        this.map.setData(locations)
      }
    }, 300))

    getElement('close-search').addEventListener('click', () => {
      getElement('search').value = ''
      this.map.setData(locations)
    })
  }

  runSearch(query, fuse) {
    const results = fuse.search(query)
    const foundLocations = _.map(results, 'item')
    this.map.setData(foundLocations)
  }
}

function buildFilters(locations) {
  return _
    .chain(locations)
    .map('filters')
    .flatten()
    .uniq()
    .map(name => ({
      key: name,
      value: FILTERS[name]
    }))
    .value()
}
