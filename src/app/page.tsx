'use client'
import { EventCard } from '@/components/events/EventCard'
import { useAppStore } from '@/lib/store'
import Link from 'next/link'
import { Calendar, MapPin, Ticket, Users, Vote, Zap } from 'lucide-react'

const features = [
  { icon: Calendar, label: 'On-chain Listings', href: '/events', color: 'text-midnight-400', description: 'Immutable event records on Midnight' },
  { icon: Ticket, label: 'NFT Tickets', href: '/tickets', color: 'text-neon-blue', description: 'Mint and hold event tickets as NFTs' },
  { icon: Users, label: 'Attendee Profiles', href: '/profile', color: 'text-neon-purple', description: 'Wallet-linked identity and history' },
  { icon: Zap, label: 'Networking Graph', href: '/network', color: 'text-yellow-400', description: 'See who else is attending' },
  { icon: Vote, label: 'DAO Curation', href: '/dao', color: 'text-green-400', description: 'Community-curated event listings' },
  { icon: MapPin, label: 'Geo Discover', href: '/discover', color: 'text-red-400', description: 'Find events near you on the map' },
]

export default function Home() {
  const { events } = useAppStore()
  const upcomingEvents = events.filter(e => new Date(e.startDate) > new Date()).slice(0, 3)

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center py-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-midnight-900/60 border border-midnight-700 text-midnight-300 text-sm mb-6">
          <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
          Live on Midnight Testnet
        </div>
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-midnight-300 via-neon-blue to-neon-purple bg-clip-text text-transparent mb-4">
          Zero Calendar Events
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
          Privacy-preserving event discovery powered by Midnight blockchain.
          NFT tickets, on-chain listings, DAO curation — all in one place.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/events" className="px-6 py-3 rounded-lg bg-midnight-600 hover:bg-midnight-500 text-white font-semibold transition-colors">
            Browse Events
          </Link>
          <Link href="/discover" className="px-6 py-3 rounded-lg border border-midnight-600 hover:border-midnight-400 text-slate-300 font-semibold transition-colors">
            Geo Discover
          </Link>
        </div>
      </section>

      {/* Features grid */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-6">Platform Features</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {features.map(f => (
            <Link key={f.href} href={f.href}
              className="card-glass rounded-xl p-5 hover:border-midnight-500 transition-all group">
              <f.icon className={`w-8 h-8 ${f.color} mb-3 group-hover:scale-110 transition-transform`} />
              <h3 className="font-semibold text-slate-200 mb-1">{f.label}</h3>
              <p className="text-sm text-slate-500">{f.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Upcoming events preview */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-200">Upcoming Events</h2>
          <Link href="/events" className="text-midnight-400 hover:text-midnight-300 text-sm font-medium">
            View all →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {upcomingEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </div>
  )
}
