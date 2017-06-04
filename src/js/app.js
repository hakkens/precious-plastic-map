import { FILTERS } from './const'
import _ from 'lodash'
import { getElement, createElement } from './utils'

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

    const filters = buildFilters(this.locations)
    this.createFilterElements(filters)

    this.activeFilters = filters.map(filter => filter.key)
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
