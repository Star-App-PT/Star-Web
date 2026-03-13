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

export default function useUserLocation() {
  const [city, setCity] = useState(DEFAULT_CITY)
  const [supported, setSupported] = useState(true)
  const [loading, setLoading] = useState(true)
  const [userCityName, setUserCityName] = useState(null)

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
        setLoading(false)
      },
      () => {
        setLoading(false)
      },
      { timeout: 5000, maximumAge: 300000 }
    )
  }, [])

  return { city, supported, loading, userCityName, setCity, setSupported, setUserCityName }
}
