import { FILTERS } from './const'

export default class Data {

  getLocations() {
    const endpoint = process.env.WP_URL + '/wp-json/map/v1/pins'
    return fetch(endpoint)
      .then(response => response.json())
      .then(locations => {
        return locations.map(location => {
          const filter = Object.keys(FILTERS).reduce((accum, filter) => {
            return accum === '' && location.filters.includes(filter) ? filter : accum
          }, '')
          delete location.filters
          location.filter = filter
          return location
        })
      })
  }
}
