import Data from './js/data'
import GoogleMap from './js/google-maps'
import App from './js/app'
import './sass/index.scss'

window.init = () => {
  const mapElement = document.getElementById('map')

  const data = new Data()
  const map = new GoogleMap()
  map.render(mapElement)
  new App({ data, map })
}
