import L from 'leaflet'
import 'leaflet.markercluster'
import { getClusterIcon } from './sprite'

const clusters = {
  WORKSHOP: L.markerClusterGroup({
    maxClusterRadius: 10,
    iconCreateFunction: cluster => {
      const count = cluster.getChildCount()
      return getClusterIcon(count, 'WORKSHOP')
    }
  }),
  MACHINE: L.markerClusterGroup({
    maxClusterRadius: 40,
    iconCreateFunction: cluster => {
      const count = cluster.getChildCount()
      return getClusterIcon(count, 'MACHINE')
    }
  }),
  STARTED: L.markerClusterGroup({
    maxClusterRadius: 40,
    iconCreateFunction: cluster => {
      const count = cluster.getChildCount()
      return getClusterIcon(count, 'STARTED')
    }
  })
}

export default clusters
