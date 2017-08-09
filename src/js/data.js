export default class Data {

  getLocations() {
    const endpoint = process.env.WP_URL + '/wp-json/map/v1/pins'
    return fetch(endpoint)
      .then(response => response.json())
  }
}
