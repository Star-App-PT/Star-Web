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

const DEFAULT_SUGGESTIONS = [
  { city: 'Porto', desc: 'Northern Portugal' },
  { city: 'Lisbon', desc: 'Capital Region' },
  { city: 'Faro', desc: 'Algarve' },
]

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
        const { latitude: lat, longitude: lng } = pos.coords
        const { city: nearest, distance } = findNearestCity(lat, lng)

        setCity(nearest)
        setSupported(distance <= MAX_DISTANCE_KM)

        const suggestions = []
        const seen = new Set()

        // Nominatim: reverse geocode for the user's exact city + region
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`
          )
          const data = await res.json()
          const detected =
            data.address?.city || data.address?.town || data.address?.village
          const region =
            data.address?.state || data.address?.county || data.address?.country || ''

          if (detected) {
            seen.add(detected.toLowerCase())
            suggestions.push({ city: detected, desc: region })
            setUserCityName(detected)
          } else {
            setUserCityName(distance <= MAX_DISTANCE_KM ? nearest : 'your area')
          }
        } catch {
          setUserCityName(distance <= MAX_DISTANCE_KM ? nearest : 'your area')
        }

        // Overpass: find real cities and towns within 60km
        try {
          const query = `[out:json][timeout:10];node["place"~"city|town"](around:60000,${lat},${lng});out body 12;`
          const res = await fetch(
            `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
          )
          const data = await res.json()

          const nearby = (data.elements || [])
            .filter((el) => el.tags?.name)
            .map((el) => ({
              name: el.tags['name:en'] || el.tags.name,
              dist: haversine(lat, lng, el.lat, el.lon),
            }))
            .sort((a, b) => a.dist - b.dist)

          for (const n of nearby) {
            if (!seen.has(n.name.toLowerCase())) {
              seen.add(n.name.toLowerCase())
              suggestions.push({
                city: n.name,
                desc: n.dist < 1 ? 'Nearby' : `${Math.round(n.dist)} km away`,
              })
            }
          }
        } catch {
          // Overpass failed — we still have the Nominatim result
        }

        if (suggestions.length > 0) {
          setNearbyCities(suggestions.slice(0, 5))
        }

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
