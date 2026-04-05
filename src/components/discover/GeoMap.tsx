'use client'
import { useEffect, useRef } from 'react'
import { CalendarEvent } from '@/lib/types'

interface Props {
  events: CalendarEvent[]
  selectedEvent: CalendarEvent | null
  onSelectEvent: (event: CalendarEvent) => void
}

export default function GeoMap({ events, selectedEvent, onSelectEvent }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<unknown>(null)
  const markersRef = useRef<unknown[]>([])

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const initMap = async () => {
      const L = (await import('leaflet')).default
      // @ts-expect-error leaflet css import
      await import('leaflet/dist/leaflet.css')

      // Fix default icon paths
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current!, {
        center: [30, 10],
        zoom: 2,
        zoomControl: true,
      })

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19,
      }).addTo(map)

      mapInstanceRef.current = map

      events.forEach(event => {
        if (!event.coordinates) return
        const marker = L.marker([event.coordinates.lat, event.coordinates.lng])
          .addTo(map)
          .bindPopup(`<b>${event.title}</b><br/>${event.location}`)
        marker.on('click', () => onSelectEvent(event))
        markersRef.current.push(marker)
      })
    }

    initMap()
    return () => {
      if (mapInstanceRef.current) {
        ;(mapInstanceRef.current as { remove: () => void }).remove()
        mapInstanceRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  void selectedEvent

  return <div ref={mapRef} className="w-full h-full" />
}
