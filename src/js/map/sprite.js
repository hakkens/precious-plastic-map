import L from 'leaflet'
import { FILTER_ICONS } from '../const'
import m1 from '../../img/m1.png'
import m2 from '../../img/m2.png'
import m3 from '../../img/m3.png'
import m4 from '../../img/m4.png'
import m5 from '../../img/m5.png'

const CLUSTER_ICONS = [
  { iconUrl: m1, iconSize: [56, 55], iconAnchor: [27, 26] },
  { iconUrl: m2, iconSize: [56, 55], iconAnchor: [27, 26] },
  { iconUrl: m3, iconSize: [66, 65], iconAnchor: [33, 32] },
  { iconUrl: m4, iconSize: [78, 77], iconAnchor: [39, 38] },
  { iconUrl: m5, iconSize: [90, 89], iconAnchor: [45, 44] }
]

export const getClusterIcon = count => {
  const size = Math.floor(Math.log10(count))
  const { iconUrl, iconSize, iconAnchor } = CLUSTER_ICONS[size]
  return L.divIcon({
    html: `<img src="${iconUrl}" /><span>${count}</span>`,
    className: `marker-cluster marker-cluster-${size}`,
    iconSize,
    iconAnchor
  })
}


export const getMarker = data => {
  return L.marker(
    new L.LatLng(data.lat, data.lng),
    {
      icon: L.icon({
        iconUrl: FILTER_ICONS[data.filter],
        iconSize: [75, 75],
        iconAnchor: [32, 32],
        popupAnchor: [7, -19]
      })
    }
  )
}
