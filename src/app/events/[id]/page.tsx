'use client'
import { useAppStore } from '@/lib/store'
import { formatDateRange, shortenAddress } from '@/lib/utils'
import { MapPin, Calendar, Users, CheckCircle, Hash, Tag, ArrowLeft, Ticket } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const { events, wallet, mintTicket, tickets } = useAppStore()
  const event = events.find(e => e.id === params.id)
  if (!event) return notFound()

  const hasTicket = tickets.some(t => t.eventId === event.id)
  const pct = Math.round((event.registered / event.capacity) * 100)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/events" className="flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Events
      </Link>

      <div className="card-glass rounded-2xl overflow-hidden">
        <div className="h-56 relative">
          {event.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover opacity-60" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-midnight-700 to-midnight-950" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-midnight-950 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex gap-2 mb-2 flex-wrap">
              <span className="bg-midnight-600/80 text-midnight-300 text-xs px-2 py-1 rounded-full">{event.category}</span>
              {event.isVerified && <span className="flex items-center gap-1 bg-black/60 text-green-400 text-xs px-2 py-1 rounded-full"><CheckCircle className="w-3 h-3" /> On-chain Verified</span>}
              {event.daoApproved && <span className="bg-midnight-600/80 text-midnight-300 text-xs px-2 py-1 rounded-full">DAO Approved ✓</span>}
            </div>
            <h1 className="text-3xl font-bold text-white">{event.title}</h1>
          </div>
        </div>

        <div className="p-6 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <p className="text-slate-400 leading-relaxed">{event.description}</p>
            <div className="flex flex-wrap gap-2">
              {event.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 text-xs bg-midnight-800 text-midnight-300 px-2 py-1 rounded-full">
                  <Tag className="w-3 h-3" /> {tag}
                </span>
              ))}
            </div>
            {event.onChainTxHash && (
              <div className="flex items-center gap-2 text-sm text-slate-500 bg-midnight-900 rounded-lg px-3 py-2">
                <Hash className="w-4 h-4 text-midnight-400" />
                <span className="font-mono text-xs truncate">Tx: {event.onChainTxHash}</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="card-glass rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Calendar className="w-4 h-4 text-midnight-400" />
                {formatDateRange(event.startDate, event.endDate)}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <MapPin className="w-4 h-4 text-red-400" />
                {event.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Users className="w-4 h-4 text-neon-blue" />
                {event.registered} / {event.capacity} registered
              </div>
              <div className="h-2 bg-midnight-900 rounded-full">
                <div className="h-full bg-gradient-to-r from-midnight-500 to-neon-blue rounded-full" style={{ width: `${pct}%` }} />
              </div>
              <div className="text-xs text-slate-600">Organizer: {shortenAddress(event.organizerAddress)}</div>
            </div>

            <div className="card-glass rounded-xl p-4">
              <div className="text-lg font-bold text-slate-200 mb-3">{event.ticketPrice === 'Free' ? 'Free Entry' : event.ticketPrice}</div>
              {wallet.isConnected ? (
                hasTicket ? (
                  <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                    <Ticket className="w-4 h-4" /> You have a ticket!
                  </div>
                ) : (
                  <button onClick={() => mintTicket(event.id)}
                    className="w-full py-2.5 bg-midnight-600 hover:bg-midnight-500 rounded-lg font-semibold text-white transition-colors">
                    Mint NFT Ticket
                  </button>
                )
              ) : (
                <p className="text-sm text-slate-500">Connect wallet to register</p>
              )}
            </div>

            <div className="card-glass rounded-xl p-4">
              <div className="text-sm font-semibold text-slate-300 mb-2">DAO Votes</div>
              <div className="flex gap-2 text-sm">
                <span className="text-green-400">✓ {event.daoVotesFor} for</span>
                <span className="text-red-400">✗ {event.daoVotesAgainst} against</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
