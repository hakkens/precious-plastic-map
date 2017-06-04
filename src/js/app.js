import { FILTERS } from './const'
import _ from 'lodash'
import { getElement, createElement } from './utils'

export default class App {

  constructor({ data, map }) {
    // on map, call render
    // on data, call getLocations
    // => on map, call set data
    data.getLocations()
      .then(locations => this.createFilters(locations))
  }

  createFilters(locations) {
    const filterNames = _
      .chain(locations)
      .map('filters')
      .flatten()
      .uniq()
      .map(name => FILTERS[name])
      .value()

    const container = getElement('filters')
    filterNames.forEach(filter => {
      const labelEl = createElement({ tag: 'label', cls: 'panel__checkbox-item' })
      const inputEl = createElement({ tag: 'input', cls: 'panel__checkbox', type: 'checkbox', name: filter, value: filter })
      const textEl = document.createTextNode(filter)

      labelEl.appendChild(inputEl)
      labelEl.appendChild(textEl)
      container.appendChild(labelEl)
    })
  }
}
