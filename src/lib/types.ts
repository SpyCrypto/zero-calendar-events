export type AttendeeRole = 'builder' | 'investor' | 'lawyer' | 'speaker' | 'organizer' | 'researcher' | 'designer' | 'other'

/** Per-event attendance counts broken down by attendee role */
export interface AttendeeBreakdown {
  builders: number
  investors: number
  lawyers: number
  speakers: number
  organizers: number
  researchers: number
  designers: number
  interested: number
}

export interface CalendarEvent {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  location: string
  coordinates?: { lat: number; lng: number }
  organizer: string
  organizerAddress: string
  category: string
  tags: string[]
  capacity: number
  registered: number
  ticketPrice: string
  onChainTxHash?: string
  isVerified: boolean
  imageUrl?: string
  daoApproved: boolean
  daoVotesFor: number
  daoVotesAgainst: number
  /** Breakdown of confirmed attendees by role — the "who's going" signal */
  whoIsGoing: AttendeeBreakdown
}

export interface NFTTicket {
  id: string
  tokenId: string
  eventId: string
  eventTitle: string
  ownerAddress: string
  mintedAt: string
  seatNumber?: string
  qrCode?: string
  metadata: {
    image: string
    attributes: Array<{ trait_type: string; value: string }>
  }
  txHash: string
  isValid: boolean
}

export interface AttendeeProfile {
  address: string
  displayName: string
  bio: string
  avatar?: string
  /** Self-declared role, shown in "Who's Going" breakdowns */
  role: AttendeeRole
  joinedAt: string
  eventsAttended: number
  eventsOrganized: number
  skills: string[]
  social: {
    twitter?: string
    github?: string
    farcaster?: string
  }
  badges: Badge[]
  connections: string[]
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: string
}

export interface NetworkNode {
  id: string
  address: string
  displayName: string
  avatar?: string
  eventsInCommon: number
}

export interface NetworkEdge {
  source: string
  target: string
  weight: number
  sharedEvents: string[]
}

export interface DAOProposal {
  id: string
  eventId: string
  eventTitle: string
  proposerAddress: string
  description: string
  votesFor: number
  votesAgainst: number
  status: 'active' | 'passed' | 'rejected' | 'pending'
  createdAt: string
  expiresAt: string
  hasVoted?: boolean
}

export interface WalletState {
  address: string | null
  isConnected: boolean
  balance: string
  network: string
}

export type RSVPStatus = 'attending' | 'interested'

/** An on-chain RSVP record linking a wallet address to an event */
export interface EventRSVP {
  eventId: string
  attendeeAddress: string
  status: RSVPStatus
  role: AttendeeRole
  txHash: string
  timestamp: string
}
