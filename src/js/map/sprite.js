import L from 'leaflet'
import { FILTER_ICONS } from '../const'
import w1 from '../../img/w1.png'
import w2 from '../../img/w2.png'
import w3 from '../../img/w3.png'
import m1 from '../../img/m1.png'
import m2 from '../../img/m2.png'
import m3 from '../../img/m3.png'
import s1 from '../../img/s1.png'
import s2 from '../../img/s2.png'
import s3 from '../../img/s3.png'
import searchMarker from '../../img/searchMarker.png'

const CLUSTER_ICONS = {
  WORKSHOP: [
    { iconUrl: w1, iconSize: [56, 55], iconAnchor: [27, 26] },
    { iconUrl: w2, iconSize: [56, 55], iconAnchor: [27, 26] },
    { iconUrl: w3, iconSize: [66, 65], iconAnchor: [33, 32] }
  ],
  MACHINE: [
    { iconUrl: m1, iconSize: [56, 55], iconAnchor: [27, 26] },
    { iconUrl: m2, iconSize: [56, 55], iconAnchor: [27, 26] },
    { iconUrl: m3, iconSize: [66, 65], iconAnchor: [33, 32] }
  ],
  STARTED: [
    { iconUrl: s1, iconSize: [56, 55], iconAnchor: [27, 26] },
    { iconUrl: s2, iconSize: [56, 55], iconAnchor: [27, 26] },
    { iconUrl: s3, iconSize: [66, 65], iconAnchor: [33, 32] }
  ]
}

export const getClusterIcon = (count, filter) => {
  const base = Math.floor(Math.log10(count))
  const size = base > 3 ? 3 : base
  const { iconUrl, iconSize, iconAnchor } = CLUSTER_ICONS[filter][size]
  return L.divIcon({
    html: `<img src="${iconUrl}" /><span class="cluster-count">${count}</span>`,
    className: `marker-cluster marker-cluster-${base}`,
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

export const getSearchMarker = data => {
  return L.marker(
    new L.LatLng(data.lat, data.lng),
    {
      icon: L.icon({
        iconUrl: searchMarker,
        iconSize: [50, 42],
        iconAnchor: [12.5, 40]
      })
    }
  )
}
