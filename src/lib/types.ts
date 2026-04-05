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
