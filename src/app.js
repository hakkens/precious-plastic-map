import Data from './js/data'
import GoogleMap from './js/google-maps'
import App from './js/app'


window.addEventListener('DOMContentLoaded' , () => {
  const data = new Data()
  const map = new GoogleMap()
  const app = new App({ data, map })
})
