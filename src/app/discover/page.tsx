'use client'
import { useAppStore } from '@/lib/store'
import { CalendarEvent } from '@/lib/types'
import { useState } from 'react'
import { MapPin, Search, Calendar } from 'lucide-react'
import { formatDateRange } from '@/lib/utils'
import dynamic from 'next/dynamic'

const GeoMap = dynamic(() => import('@/components/discover/GeoMap'), { ssr: false })

export default function DiscoverPage() {
  const { events } = useAppStore()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<CalendarEvent | null>(null)

  const geoEvents = events.filter(e => e.coordinates)
  const filtered = geoEvents.filter(e =>
    !search || e.location.toLowerCase().includes(search.toLowerCase()) ||
    e.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Geo Discover</h1>
        <p className="text-slate-500 mt-1">Find events near you on the interactive map</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input type="text" placeholder="Search by city or country..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-midnight-900 border border-midnight-700 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-midnight-500" />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 card-glass rounded-2xl overflow-hidden" style={{ height: '480px' }}>
          <GeoMap events={filtered} selectedEvent={selected} onSelectEvent={setSelected} />
        </div>

        <div className="space-y-3 overflow-y-auto max-h-[480px] pr-1">
          <p className="text-sm text-slate-500">{filtered.length} events on map</p>
          {filtered.map(event => (
            <button key={event.id} onClick={() => setSelected(event)}
              className={`w-full text-left card-glass rounded-xl p-4 transition-all ${selected?.id === event.id ? 'border-midnight-500' : 'hover:border-midnight-700'}`}>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-slate-300 text-sm">{event.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{event.location}</p>
                  <p className="text-xs text-midnight-400 mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDateRange(event.startDate, event.endDate)}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
