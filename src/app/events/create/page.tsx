'use client'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { CalendarEvent } from '@/lib/types'
import { useState } from 'react'
import { ArrowLeft, Plus } from 'lucide-react'
import Link from 'next/link'

export default function CreateEventPage() {
  const router = useRouter()
  const { wallet, addEvent } = useAppStore()
  const [form, setForm] = useState({
    title: '', description: '', startDate: '', endDate: '',
    location: '', category: 'Conference', ticketPrice: '', capacity: '100', tags: '',
  })

  if (!wallet.isConnected) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <p className="text-slate-500 text-lg">Connect your wallet to create an event.</p>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newEvent: CalendarEvent = {
      id: `evt-${Date.now()}`,
      title: form.title,
      description: form.description,
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
      location: form.location,
      organizer: 'You',
      organizerAddress: wallet.address!,
      category: form.category,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      capacity: parseInt(form.capacity),
      registered: 0,
      ticketPrice: form.ticketPrice || 'Free',
      isVerified: false,
      daoApproved: false,
      daoVotesFor: 0,
      daoVotesAgainst: 0,
      onChainTxHash: `0x${Math.random().toString(16).slice(2)}`,
      whoIsGoing: { builders: 0, investors: 0, lawyers: 0, speakers: 0, organizers: 1, researchers: 0, designers: 0, interested: 0 },
    }
    addEvent(newEvent)
    router.push('/events')
  }

  const field = (label: string, key: keyof typeof form, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-slate-400 mb-1">{label}</label>
      {key === 'description' ? (
        <textarea rows={3} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          className="w-full px-3 py-2 bg-midnight-900 border border-midnight-700 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-midnight-500 resize-none"
          placeholder={placeholder} required />
      ) : (
        <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          className="w-full px-3 py-2 bg-midnight-900 border border-midnight-700 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-midnight-500"
          placeholder={placeholder} required={key !== 'ticketPrice'} />
      )}
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/events" className="flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Events
      </Link>
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Create Event</h1>
        <p className="text-slate-500 mt-1">Your event will be published to Midnight Preview Network and submitted to the DAO for curation</p>
      </div>
      <form onSubmit={handleSubmit} className="card-glass rounded-2xl p-6 space-y-4">
        {field('Event Title', 'title', 'text', 'ZK Summit 2025...')}
        {field('Description', 'description', 'text', 'Tell attendees what to expect...')}
        <div className="grid grid-cols-2 gap-4">
          {field('Start Date & Time', 'startDate', 'datetime-local')}
          {field('End Date & Time', 'endDate', 'datetime-local')}
        </div>
        {field('Location', 'location', 'text', 'Berlin, Germany')}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full px-3 py-2 bg-midnight-900 border border-midnight-700 rounded-lg text-slate-200 focus:outline-none focus:border-midnight-500">
              {['Conference', 'Workshop', 'Hackathon', 'Forum', 'Exhibition'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          {field('Capacity', 'capacity', 'number', '100')}
        </div>
        {field('Ticket Price (leave empty for free)', 'ticketPrice', 'text', '0.05 NIGHT')}
        {field('Tags (comma separated)', 'tags', 'text', 'ZK, Privacy, Web3')}
        <button type="submit"
          className="w-full flex items-center justify-center gap-2 py-3 bg-midnight-600 hover:bg-midnight-500 rounded-lg font-semibold text-white transition-colors">
          <Plus className="w-4 h-4" /> Submit to Blockchain
        </button>
      </form>
    </div>
  )
}
