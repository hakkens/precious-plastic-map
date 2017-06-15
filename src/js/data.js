import { FILTERS, HASHTAGS, STATUS } from './const'

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
  const statusKeys = Object.keys(STATUS)

  const { lat, long, name, services, tags, status, description, url } = value
  const newObj = {
    lat: parseFloat(lat),
    lng: parseFloat(long),
    name,
    status: STATUS[statusKeys[parseInt(status)]],
    description,
    website: url,
    contact: 'https://davehakkens.nl/community/members/davehakkens/',
    filters: services.map(index => filterKeys[index - 1]),
    hashtags: tags.map(index => hashtagKeys[index - 1]),
    imgs: [
      'https://davehakkens.nl/wp-content/uploads/2017/06/shop-1500x955.jpg',
      'https://davehakkens.nl/wp-content/uploads/2017/03/badge-1500x1500.jpg',
      'https://davehakkens.nl/wp-content/uploads/2016/12/Design-of-the-year-exhibiton.jpg'
    ]
  }
  return newObj
}
