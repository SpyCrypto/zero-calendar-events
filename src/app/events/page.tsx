'use client'
import { useAppStore } from '@/lib/store'
import { EventCard } from '@/components/events/EventCard'
import { Search, Filter } from 'lucide-react'
import Link from 'next/link'
import { Plus } from 'lucide-react'

const CATEGORIES = ['All', 'Conference', 'Workshop', 'Hackathon', 'Forum', 'Exhibition']

export default function EventsPage() {
  const { events, filterCategory, searchQuery, setFilterCategory, setSearchQuery, wallet } = useAppStore()

  const filtered = events.filter(e => {
    const matchCat = filterCategory === 'All' || e.category === filterCategory
    const matchSearch = !searchQuery || e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchCat && matchSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">On-chain Events</h1>
          <p className="text-slate-500 mt-1">Immutable event listings verified on Midnight Network</p>
        </div>
        {wallet.isConnected && (
          <Link href="/events/create"
            className="flex items-center gap-2 px-4 py-2 bg-midnight-600 hover:bg-midnight-500 rounded-lg text-white font-medium transition-colors">
            <Plus className="w-4 h-4" /> Create Event
          </Link>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search events, locations, tags..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-midnight-900 border border-midnight-700 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-midnight-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterCategory === cat
                  ? 'bg-midnight-600 text-white'
                  : 'bg-midnight-900 text-slate-500 hover:text-slate-300 border border-midnight-800'
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="text-sm text-slate-500">
        {filtered.length} event{filtered.length !== 1 ? 's' : ''} found
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-600">
          <Filter className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No events match your search</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(event => <EventCard key={event.id} event={event} />)}
        </div>
      )}
    </div>
  )
}
