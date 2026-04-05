import { create } from 'zustand'
import { CalendarEvent, NFTTicket, AttendeeProfile, DAOProposal, WalletState } from './types'
import { MOCK_EVENTS, MOCK_TICKETS, MOCK_PROFILE, MOCK_DAO_PROPOSALS } from './mock-data'

interface AppState {
  wallet: WalletState
  events: CalendarEvent[]
  tickets: NFTTicket[]
  profile: AttendeeProfile | null
  proposals: DAOProposal[]
  selectedEvent: CalendarEvent | null
  filterCategory: string
  searchQuery: string
  connectWallet: () => void
  disconnectWallet: () => void
  setSelectedEvent: (event: CalendarEvent | null) => void
  setFilterCategory: (category: string) => void
  setSearchQuery: (query: string) => void
  mintTicket: (eventId: string) => void
  voteOnProposal: (proposalId: string, vote: 'for' | 'against') => void
  addEvent: (event: CalendarEvent) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  wallet: {
    address: null,
    isConnected: false,
    balance: '0',
    network: 'Midnight Testnet',
  },
  events: MOCK_EVENTS,
  tickets: [],
  profile: null,
  proposals: MOCK_DAO_PROPOSALS,
  selectedEvent: null,
  filterCategory: 'All',
  searchQuery: '',

  connectWallet: () => set({
    wallet: {
      address: '0xDemoWallet...1234',
      isConnected: true,
      balance: '12.5 NIGHT',
      network: 'Midnight Testnet',
    },
    profile: MOCK_PROFILE,
    tickets: MOCK_TICKETS,
  }),

  disconnectWallet: () => set({
    wallet: { address: null, isConnected: false, balance: '0', network: 'Midnight Testnet' },
    profile: null,
    tickets: [],
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
    set(state => ({
      tickets: [...state.tickets, newTicket],
      events: state.events.map(e => e.id === eventId ? { ...e, registered: e.registered + 1 } : e),
    }))
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
}))
