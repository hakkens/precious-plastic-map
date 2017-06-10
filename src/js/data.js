import { FILTERS, HASHTAGS } from './const'

export default class Data {

  getLocations() {
    const endpoint = process.env.WP_URL + '/wp-json/pp_pins/v1/pins'
    return fetch(endpoint)
      .then(response => response.json())
      .then(response => response.map(mapValue))
  }
}

function mapValue(value) {
  const filterKeys = Object.keys(FILTERS)
  const hashtagKeys = Object.keys(HASHTAGS)

  const { lat, long, name, services, tags, status, description, url } = value
  const newObj = {
    lat: parseFloat(lat),
    lng: parseFloat(long),
    name,
    status,
    description,
    website: url,
    filters: services.map(index => filterKeys[index - 1]),
    hashtags: tags.map(index => hashtagKeys[index - 1])
  }
  return newObj
}
