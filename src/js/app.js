import { FILTERS } from './const'
import _ from 'lodash'
import { getElement, createElement } from './utils'

export default class App {

  constructor({ data, map }) {
    this.data = data
    this.map = map
  }

  async initApp() {
    const locations = await this.data.getLocations()
    this.map.setData(locations)

    const filterEls = this.createFilters(locations)
    this.activateFilters(filterEls, locations)
  }

  createFilters(locations) {
    const filterNames = _
      .chain(locations)
      .map('filters')
      .flatten()
      .uniq()
      .map(name => ({ key: name, value: FILTERS[name] }))
      .value()

    const container = getElement('filters')
    return filterNames.map(filter => {
      const labelEl = createElement({ tag: 'label', cls: 'panel__checkbox-item' })
      const inputEl = createElement({
        tag: 'input',
        cls: 'panel__checkbox',
        type: 'checkbox',
        name: 'filter',
        checked: 'true',
        value: filter.key
      })
      const textEl = document.createTextNode(filter.value)

      labelEl.appendChild(inputEl)
      labelEl.appendChild(textEl)
      container.appendChild(labelEl)

      return inputEl
    })
  }

  activateFilters(filterEls, locations) {
    filterEls.forEach(el => {
      el.addEventListener('click', () => {
        const selectedFilters = _
          .chain(filterEls)
          .filter(el => el.checked)
          .map('value')
          .value()

        const filteredLocations = locations.filter(location => {
          return !_.isEmpty(_.intersection(location.filters, selectedFilters))
        })

        this.map.setData(filteredLocations)
      })
    })
  }
}
