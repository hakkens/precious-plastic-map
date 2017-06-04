import Data from './js/data'
import GoogleMap from './js/google-maps'
import App from './js/app'
import './sass/index.scss'


window.addEventListener('DOMContentLoaded', () => {
  const data = new Data()
  const map = new GoogleMap()
  new App({ data, map })
})
