export default class Data {

  getLocations() {
    return fetch('https://raw.githubusercontent.com/nzchicken/precious-plastic-map/data/data.json')
      .then(response => response.json())
  }
}
