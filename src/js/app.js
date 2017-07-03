import { FILTERS } from './const'
import _ from 'lodash'
import { getElement, openNewWindow } from './utils'

export default class App {

  constructor({ data, map }) {
    this.data = data
    this.map = map
    this.activeFilters = []
    this.locationData = []
  }

  async initApp() {
    const filters = Object.keys(FILTERS).map(filter => ({ key: filter, value: FILTERS[filter] }))
    this.activeFilters = filters.map(filter => filter.key).filter(filter => filter === 'WORKSPACE')
    this.createFilterElements(filters)
    this.locationData = await this.data.getLocations()
    getElement('add-pin').addEventListener('click', addPin)
    getElement('mob-add-pin').addEventListener('click', addPin)
    getElement('info').addEventListener('click', toggleInfoBox)
    getElement('drop-toggle').addEventListener('click', toggleFilterDrop)
    this.setData()
  }

  createFilterElements(filters) {
    const container = getElement('filters')

    container.innerHTML = filters.map(filter => {
      const key = filter.key.toLowerCase()
      const checked = (this.activeFilters.includes(filter.key)) ? 'checked' : ''
      return `
        <div class="checkbox">
          <input type="checkbox" id=${key} name="filter" class="panel__checkbox" value=${key} ${checked} />
          <label class="panel__checkbox-item" for=${key}></label>
          <span class="panel__checkbox-icon panel__checkbox-icon-${key}"></span>
          <p class="panel__checkbox-text">${filter.value}</p>
        </div>
      `
    }).join('')

    const inputs = [].slice.call(document.querySelectorAll('.panel__checkbox'))

    inputs.forEach(input => {
      input.addEventListener('click', e => {
        const filter = e.target.value.toUpperCase()
        this.activeFilters = _.xor(this.activeFilters, [filter])
        this.setData()
      })
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

function toggleInfoBox() {
  getElement('info-box').classList.toggle('info__box-visible')
}

function toggleFilterDrop() {
  getElement('panel').classList.toggle('panel__form-open')
}

function addPin() {
  openNewWindow(process.env.WP_ADD_PIN)
}