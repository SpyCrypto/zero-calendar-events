import { create } from 'zustand'
import { AttendeeBreakdown, CalendarEvent, NFTTicket, AttendeeProfile, DAOProposal, WalletState, EventRSVP, RSVPStatus, AttendeeRole } from './types'
import { MOCK_EVENTS, MOCK_TICKETS, MOCK_PROFILE, MOCK_DAO_PROPOSALS } from './mock-data'

/** Maps an AttendeeRole to its corresponding AttendeeBreakdown key */
const ROLE_TO_BREAKDOWN_KEY: Record<AttendeeRole, keyof AttendeeBreakdown> = {
  builder:    'builders',
  investor:   'investors',
  lawyer:     'lawyers',
  speaker:    'speakers',
  researcher: 'researchers',
  designer:   'designers',
  organizer:  'organizers',
  other:      'interested',
}

/** Increments the appropriate breakdown counter for a given role */
function incrementBreakdown(breakdown: AttendeeBreakdown, role: AttendeeRole): AttendeeBreakdown {
  const key = ROLE_TO_BREAKDOWN_KEY[role]
  return { ...breakdown, [key]: breakdown[key] + 1 }
}

interface AppState {
  wallet: WalletState
  events: CalendarEvent[]
  tickets: NFTTicket[]
  profile: AttendeeProfile | null
  proposals: DAOProposal[]
  rsvps: EventRSVP[]
  selectedEvent: CalendarEvent | null
  filterCategory: string
  searchQuery: string
  connectWallet: () => void
  disconnectWallet: () => void
  setSelectedEvent: (event: CalendarEvent | null) => void
  setFilterCategory: (category: string) => void
  setSearchQuery: (query: string) => void
  mintTicket: (eventId: string) => void
  rsvpEvent: (eventId: string, status: RSVPStatus) => void
  getRSVP: (eventId: string) => EventRSVP | undefined
  voteOnProposal: (proposalId: string, vote: 'for' | 'against') => void
  addEvent: (event: CalendarEvent) => void
  updateProfileRole: (role: AttendeeRole) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  wallet: {
    address: null,
    isConnected: false,
    balance: '0',
    network: 'Midnight Preview',
  },
  events: MOCK_EVENTS,
  tickets: [],
  profile: null,
  proposals: MOCK_DAO_PROPOSALS,
  rsvps: [],
  selectedEvent: null,
  filterCategory: 'All',
  searchQuery: '',

  connectWallet: () => set({
    wallet: {
      address: '0xDemoWallet...1234',
      isConnected: true,
      balance: '12.5 NIGHT',
      network: 'Midnight Preview',
    },
    profile: MOCK_PROFILE,
    tickets: MOCK_TICKETS,
  }),

  disconnectWallet: () => set({
    wallet: { address: null, isConnected: false, balance: '0', network: 'Midnight Preview' },
    profile: null,
    tickets: [],
    rsvps: [],
  }),

  setSelectedEvent: (event) => set({ selectedEvent: event }),
  setFilterCategory: (category) => set({ filterCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  mintTicket: (eventId) => {
    const event = get().events.find(e => e.id === eventId)
    if (!event || !get().wallet.isConnected) return
    const newTicket: NFTTicket = {
      id: `ticket-${Date.now()}`,
      tokenId: `#${Math.floor(Math.random() * 9000) + 1000}`,
      eventId,
      eventTitle: event.title,
      ownerAddress: get().wallet.address!,
      mintedAt: new Date().toISOString(),
      metadata: {
        image: event.imageUrl || '',
        attributes: [
          { trait_type: 'Event', value: event.title },
          { trait_type: 'Type', value: 'General Admission' },
          { trait_type: 'Location', value: event.location },
        ]
      },
      txHash: `0x${Math.random().toString(16).slice(2)}`,
      isValid: true,
    }
    const role: AttendeeRole = get().profile?.role ?? 'other'
    set(state => ({
      tickets: [...state.tickets, newTicket],
      events: state.events.map(e => {
        if (e.id !== eventId) return e
        return { ...e, registered: e.registered + 1, whoIsGoing: incrementBreakdown(e.whoIsGoing, role) }
      }),
    }))
  },

  rsvpEvent: (eventId, status) => {
    const { wallet, profile } = get()
    if (!wallet.isConnected || !wallet.address) return
    const existing = get().rsvps.find(r => r.eventId === eventId && r.attendeeAddress === wallet.address)
    const role: AttendeeRole = profile?.role ?? 'other'
    const newRSVP: EventRSVP = {
      eventId,
      attendeeAddress: wallet.address,
      status,
      role,
      txHash: `0x${Math.random().toString(16).slice(2).padEnd(64, '0')}`,
      timestamp: new Date().toISOString(),
    }
    set(state => {
      const updatedRSVPs = existing
        ? state.rsvps.map(r => r.eventId === eventId && r.attendeeAddress === wallet.address ? newRSVP : r)
        : [...state.rsvps, newRSVP]

      // Update whoIsGoing when this is the first RSVP for this attendee
      const updatedEvents = state.events.map(e => {
        if (e.id !== eventId || existing) return e
        const updatedBreakdown = status === 'attending'
          ? incrementBreakdown(e.whoIsGoing, role)
          : { ...e.whoIsGoing, interested: e.whoIsGoing.interested + 1 }
        return { ...e, whoIsGoing: updatedBreakdown }
      })

      return { rsvps: updatedRSVPs, events: updatedEvents }
    })
  },

  getRSVP: (eventId) => {
    const address = get().wallet.address
    return get().rsvps.find(r => r.eventId === eventId && r.attendeeAddress === address)
  },

  voteOnProposal: (proposalId, vote) => {
    set(state => ({
      proposals: state.proposals.map(p =>
        p.id === proposalId
          ? {
              ...p,
              votesFor: vote === 'for' ? p.votesFor + 1 : p.votesFor,
              votesAgainst: vote === 'against' ? p.votesAgainst + 1 : p.votesAgainst,
              hasVoted: true,
            }
          : p
      )
    }))
  },

  addEvent: (event) => set(state => ({ events: [...state.events, event] })),

  updateProfileRole: (role) => {
    set(state => ({
      profile: state.profile ? { ...state.profile, role } : state.profile,
    }))
  },
}))
