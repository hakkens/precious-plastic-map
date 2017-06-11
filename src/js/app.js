import { FILTERS } from './const'
import _ from 'lodash'
import { getElement, createElement, openNewWindow } from './utils'

export default class App {

  constructor({ data, map }) {
    this.data = data
    this.map = map
    this.activeFilters = []
    this.locationData = []
  }

  async initApp() {
    const filters = Object.keys(FILTERS).map(filter => ({ key: filter, value: FILTERS[filter] }))
    this.createFilterElements(filters)
    this.activeFilters = filters.map(filter => filter.key)
    this.locationData = await this.data.getLocations()
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

  setData() {
    const { locationData, activeFilters } = this
    const filtered = applyFilters(locationData, activeFilters)
    this.map.setData(filtered)
  }
}

function applyFilters(locationData, activeFilters) {
  return locationData.filter(location => {
    return !_.isEmpty(_.intersection(location.filters, activeFilters))
  })
}
