'use client'
import { CalendarEvent } from '@/lib/types'
import { formatDateRange, getCapacityColor } from '@/lib/utils'
import { MapPin, Users, CheckCircle, Calendar } from 'lucide-react'
import Link from 'next/link'

interface Props { event: CalendarEvent }

export function EventCard({ event }: Props) {
  const pct = Math.round((event.registered / event.capacity) * 100)

  return (
    <Link href={`/events/${event.id}`}
      className="card-glass rounded-xl overflow-hidden hover:border-midnight-500 transition-all group block">
      <div className="h-36 bg-gradient-to-br from-midnight-800 to-midnight-950 relative overflow-hidden">
        {event.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity" />
        )}
        <div className="absolute top-2 right-2 flex gap-1">
          {event.isVerified && (
            <span className="flex items-center gap-1 bg-black/60 text-green-400 text-xs px-2 py-1 rounded-full">
              <CheckCircle className="w-3 h-3" /> Verified
            </span>
          )}
          {event.daoApproved && (
            <span className="bg-midnight-600/80 text-midnight-300 text-xs px-2 py-1 rounded-full">DAO ✓</span>
          )}
        </div>
        <div className="absolute bottom-2 left-2">
          <span className="bg-midnight-700/80 text-midnight-300 text-xs px-2 py-1 rounded-full">{event.category}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-200 line-clamp-1 mb-1">{event.title}</h3>
        <p className="text-xs text-slate-500 flex items-center gap-1 mb-1">
          <Calendar className="w-3 h-3" />
          {formatDateRange(event.startDate, event.endDate)}
        </p>
        <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
          <MapPin className="w-3 h-3" /> {event.location}
        </p>
        <div className="flex items-center justify-between text-xs">
          <span className={`flex items-center gap-1 ${getCapacityColor(event.registered, event.capacity)}`}>
            <Users className="w-3 h-3" />
            {event.registered}/{event.capacity}
          </span>
          <span className="text-midnight-400 font-medium">{event.ticketPrice}</span>
        </div>
        <div className="mt-2 h-1 bg-midnight-900 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-midnight-500 to-neon-blue rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </Link>
  )
}
