import { useState, useEffect } from 'react'
import { SUPPORTED_CITIES, DEFAULT_CITY } from '../data/workers'

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function findNearestCity(lat, lng) {
  let closest = DEFAULT_CITY
  let minDist = Infinity
  for (const [city, coords] of Object.entries(SUPPORTED_CITIES)) {
    const d = haversine(lat, lng, coords.lat, coords.lng)
    if (d < minDist) {
      minDist = d
      closest = city
    }
  }
  return { city: closest, distance: minDist }
}

const MAX_DISTANCE_KM = 80

const PORTUGUESE_CITIES = [
  { city: 'Porto', lat: 41.1579, lng: -8.6291, desc: 'Northern Portugal' },
  { city: 'Lisbon', lat: 38.7223, lng: -9.1393, desc: 'Capital Region' },
  { city: 'Faro', lat: 37.0194, lng: -7.9322, desc: 'Algarve' },
  { city: 'Braga', lat: 41.5518, lng: -8.4229, desc: 'Minho' },
  { city: 'Coimbra', lat: 40.2033, lng: -8.4103, desc: 'Central Portugal' },
  { city: 'Aveiro', lat: 40.6405, lng: -8.6538, desc: 'Beira Litoral' },
  { city: 'Guimarães', lat: 41.4425, lng: -8.2918, desc: 'Minho' },
  { city: 'Vila Nova de Gaia', lat: 41.1239, lng: -8.6118, desc: 'Northern Portugal' },
  { city: 'Matosinhos', lat: 41.1844, lng: -8.6897, desc: 'Northern Portugal' },
  { city: 'Setúbal', lat: 38.5244, lng: -8.8882, desc: 'Setúbal Peninsula' },
  { city: 'Funchal', lat: 32.6669, lng: -16.9241, desc: 'Madeira' },
  { city: 'Viseu', lat: 40.6610, lng: -7.9097, desc: 'Dão-Lafões' },
  { city: 'Leiria', lat: 39.7437, lng: -8.8071, desc: 'Central Portugal' },
  { city: 'Évora', lat: 38.5710, lng: -7.9090, desc: 'Alentejo' },
  { city: 'Viana do Castelo', lat: 41.6918, lng: -8.8344, desc: 'Alto Minho' },
  { city: 'Cascais', lat: 38.6979, lng: -9.4215, desc: 'Lisbon Coast' },
  { city: 'Sintra', lat: 38.7980, lng: -9.3880, desc: 'Lisbon Region' },
  { city: 'Almada', lat: 38.6790, lng: -9.1565, desc: 'South Bank' },
  { city: 'Gondomar', lat: 41.1500, lng: -8.5333, desc: 'Northern Portugal' },
  { city: 'Portimão', lat: 37.1367, lng: -8.5378, desc: 'Algarve' },
]

const DEFAULT_SUGGESTIONS = [
  { city: 'Porto', desc: 'Northern Portugal' },
  { city: 'Lisbon', desc: 'Capital Region' },
  { city: 'Faro', desc: 'Algarve' },
]

async function fetchNearbyCities(lat, lng) {
  const byDistance = PORTUGUESE_CITIES
    .map((c) => ({ ...c, dist: haversine(lat, lng, c.lat, c.lng) }))
    .sort((a, b) => a.dist - b.dist)

  const nearby = byDistance.slice(0, 5).map(({ city, desc }) => ({ city, desc }))

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`
    )
    const data = await res.json()
    const detected =
      data.address?.city || data.address?.town || data.address?.village

    if (detected && !nearby.find((c) => c.city === detected)) {
      const region =
        data.address?.state_district || data.address?.state || data.address?.country || ''
      nearby.unshift({ city: detected, desc: region })
      nearby.splice(5)
    }
  } catch {
    // Nominatim failed — local distance list is still fine
  }

  return nearby
}

export default function useUserLocation() {
  const [city, setCity] = useState(DEFAULT_CITY)
  const [supported, setSupported] = useState(true)
  const [loading, setLoading] = useState(true)
  const [userCityName, setUserCityName] = useState(null)
  const [nearbyCities, setNearbyCities] = useState(DEFAULT_SUGGESTIONS)

  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        const { city: nearest, distance } = findNearestCity(latitude, longitude)

        if (distance <= MAX_DISTANCE_KM) {
          setCity(nearest)
          setSupported(true)
          setUserCityName(nearest)
        } else {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`
            )
            const data = await res.json()
            const detectedCity =
              data.address?.city || data.address?.town || data.address?.village || 'your area'
            setUserCityName(detectedCity)
          } catch {
            setUserCityName('your area')
          }
          setCity(nearest)
          setSupported(false)
        }

        const nearby = await fetchNearbyCities(latitude, longitude)
        setNearbyCities(nearby)

        setLoading(false)
      },
      () => {
        setLoading(false)
      },
      { timeout: 5000, maximumAge: 300000 }
    )
  }, [])

  return { city, supported, loading, userCityName, nearbyCities, setCity, setSupported, setUserCityName }
}
