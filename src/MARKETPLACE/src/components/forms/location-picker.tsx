"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useTranslations } from "next-intl"
import { MapPin, Navigation, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CITIES } from "@/MARKETPLACE/src/data/cities"

interface Props {
  latitude?: number | null
  longitude?: number | null
  city?: string
  onChange: (lat: number, lng: number, city?: string) => void
  locale: string
}

export function LocationPicker({ latitude, longitude, city, onChange, locale }: Props) {
  const t = useTranslations("marketplace")
  const isArabic = locale === "ar"
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [selectedCity, setSelectedCity] = useState(city || "")
  const [lat, setLat] = useState(latitude || 33.5731)
  const [lng, setLng] = useState(longitude || -7.5898)
  const [searchQuery, setSearchQuery] = useState("")
  const [showMap, setShowMap] = useState(false)
  const [leafletLoaded, setLeafletLoaded] = useState(false)

  const filteredCities = CITIES.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 10)

  const handleCitySelect = (cityName: string, cityLat: number, cityLng: number) => {
    setSelectedCity(cityName)
    setLat(cityLat)
    setLng(cityLng)
    onChange(cityLat, cityLng, cityName)
    setSearchQuery("")
  }

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLat = position.coords.latitude
          const newLng = position.coords.longitude
          setLat(newLat)
          setLng(newLng)
          onChange(newLat, newLng)
        },
        (error) => {
          console.error("Error getting location:", error)
        }
      )
    }
  }

  const initMap = useCallback(async () => {
    if (!mapRef.current || mapInstanceRef.current) return

    try {
      const L = (await import("leaflet")).default
      await import("leaflet/dist/leaflet.css")

      const map = L.map(mapRef.current).setView([lat, lng], 12)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      }).addTo(map)

      const marker = L.marker([lat, lng], { draggable: true }).addTo(map)

      marker.on("dragend", (e: any) => {
        const pos = e.target.getLatLng()
        setLat(pos.lat)
        setLng(pos.lng)
        onChange(pos.lat, pos.lng)
      })

      map.on("click", (e: any) => {
        const { lat: newLat, lng: newLng } = e.latlng
        setLat(newLat)
        setLng(newLng)
        marker.setLatLng([newLat, newLng])
        onChange(newLat, newLng)
      })

      mapInstanceRef.current = { map, marker }
      setLeafletLoaded(true)
    } catch (err) {
      console.error("Failed to load Leaflet:", err)
    }
  }, [lat, lng, onChange])

  useEffect(() => {
    if (showMap) {
      initMap()
    }
    return () => {
      if (mapInstanceRef.current?.map) {
        mapInstanceRef.current.map.remove()
        mapInstanceRef.current = null
      }
    }
  }, [showMap, initMap])

  useEffect(() => {
    if (mapInstanceRef.current?.marker) {
      mapInstanceRef.current.marker.setLatLng([lat, lng])
      mapInstanceRef.current.map.setView([lat, lng])
    }
  }, [lat, lng])

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        <MapPin className="w-4 h-4 inline mr-1" />
        {isArabic ? "الموقع" : "Localisation"}
      </label>

      <div className="relative">
        <input
          type="text"
          value={searchQuery || selectedCity}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setSelectedCity("")
          }}
          placeholder={isArabic ? "ابحث عن مدينة..." : "Rechercher une ville..."}
          className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        {(searchQuery || selectedCity) && (
          <button
            onClick={() => {
              setSearchQuery("")
              setSelectedCity("")
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {searchQuery && filteredCities.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredCities.map((c) => (
            <button
              key={c.name}
              onClick={() => handleCitySelect(c.name, c.lat, c.lng)}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>{c.name}</span>
              {c.region && (
                <span className="text-xs text-gray-500 ml-auto">{c.region}</span>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleGetCurrentLocation}
          className="gap-2"
        >
          <Navigation className="w-4 h-4" />
          {isArabic ? "موقعي الحالي" : "Ma position"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowMap(!showMap)}
          className="gap-2"
        >
          <MapPin className="w-4 h-4" />
          {showMap ? (isArabic ? "إخفاء الخريطة" : "Masquer la carte") : (isArabic ? "عرض على الخريطة" : "Voir sur la carte")}
        </Button>
      </div>

      {showMap && (
        <div className="relative">
          <div ref={mapRef} className="w-full h-64 rounded-xl border border-gray-200 dark:border-gray-800" />
          <div className="absolute bottom-2 left-2 bg-white dark:bg-gray-900 px-2 py-1 rounded text-xs text-gray-600 dark:text-gray-400 z-[1000]">
            {lat.toFixed(4)}, {lng.toFixed(4)}
          </div>
        </div>
      )}

      <input type="hidden" name="latitude" value={lat} />
      <input type="hidden" name="longitude" value={lng} />
    </div>
  )
}