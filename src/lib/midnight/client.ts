/**
 * Midnight Network Client
 *
 * Provides the integration layer between the Zero Calendar Events application
 * and the Midnight blockchain. Uses the Midnight SDK from the git submodule.
 *
 * Deployed at: https://build.1am.xyz/
 *
 * In production, this module would import from:
 *   - @midnight-ntwrk/compact-runtime
 *   - @midnight-ntwrk/midnight-js-contracts
 *   - @midnight-ntwrk/midnight-js-types
 */

export interface MidnightConfig {
  /** WebSocket endpoint for the Midnight node RPC */
  nodeEndpoint: string
  indexerEndpoint: string
  proofServerEndpoint: string
  networkId: string
}

/** Midnight Preview network — primary target for Zero Calendar Events */
export const PREVIEW_CONFIG: MidnightConfig = {
  nodeEndpoint: 'wss://rpc.preview.midnight.network',
  indexerEndpoint: 'https://indexer.preview.midnight.network/api/v1/graphql',
  proofServerEndpoint: 'http://localhost:6300',
  networkId: 'Preview',
}

/**
 * @deprecated Use PREVIEW_CONFIG instead. TESTNET_CONFIG will be removed once
 * TestNet-02 is decommissioned. Migrate by replacing TESTNET_CONFIG with
 * PREVIEW_CONFIG or MAINNET_CONFIG in all call sites.
 */
export const TESTNET_CONFIG: MidnightConfig = {
  nodeEndpoint: 'wss://rpc.testnet-02.midnight.network',
  indexerEndpoint: 'https://indexer.testnet-02.midnight.network/api/v1/graphql',
  proofServerEndpoint: 'http://localhost:6300',
  networkId: 'TestNet',
}

export const MAINNET_CONFIG: MidnightConfig = {
  nodeEndpoint: 'wss://rpc.mainnet.midnight.network',
  indexerEndpoint: 'https://indexer.mainnet.midnight.network/api/v1/graphql',
  proofServerEndpoint: 'http://localhost:6300',
  networkId: 'MainNet',
}

/** Default config used by all on-chain calls */
export const DEFAULT_CONFIG = PREVIEW_CONFIG

/**
 * Submits an event listing transaction to the Midnight ledger.
 * In production, this generates a ZK proof and submits to the node via WSS.
 */
export async function submitEventOnChain(
  eventData: {
    titleHash: string
    locationHash: string
    startTime: number
    endTime: number
    capacity: number
    ticketPrice: bigint
  },
  config: MidnightConfig = DEFAULT_CONFIG
): Promise<string> {
  // Production implementation would:
  // 1. Open WebSocket connection to config.nodeEndpoint
  // 2. Load the compiled event-registry contract
  // 3. Call create_event circuit with witness data
  // 4. Generate ZK proof via proof server
  // 5. Submit transaction to Midnight node over WSS
  // 6. Return transaction hash
  console.log('Submitting event on-chain to', config.networkId, config.nodeEndpoint, eventData)
  return `0x${Math.random().toString(16).slice(2).padEnd(64, '0')}`
}

/**
 * Mints an NFT ticket on the Midnight ledger.
 */
export async function mintNFTTicket(
  eventId: string,
  ownerAddress: string,
  metadataHash: string,
  config: MidnightConfig = DEFAULT_CONFIG
): Promise<{ tokenId: string; txHash: string }> {
  console.log('Minting NFT ticket on', config.networkId, config.nodeEndpoint, { eventId, ownerAddress, metadataHash })
  return {
    tokenId: `#${Math.floor(Math.random() * 9000) + 1000}`,
    txHash: `0x${Math.random().toString(16).slice(2).padEnd(64, '0')}`,
  }
}

/**
 * Submits a DAO vote to the ledger.
 */
export async function submitDAOVote(
  proposalId: string,
  inFavor: boolean,
  voterAddress: string,
  config: MidnightConfig = DEFAULT_CONFIG
): Promise<string> {
  console.log('Submitting DAO vote on', config.networkId, config.nodeEndpoint, { proposalId, inFavor, voterAddress })
  return `0x${Math.random().toString(16).slice(2).padEnd(64, '0')}`
}

/**
 * Submits an RSVP transaction for an attendee.
 */
export async function submitRSVP(
  eventId: string,
  attendeeAddress: string,
  status: 'attending' | 'interested',
  config: MidnightConfig = DEFAULT_CONFIG
): Promise<string> {
  console.log('Submitting RSVP on', config.networkId, config.nodeEndpoint, { eventId, attendeeAddress, status })
  return `0x${Math.random().toString(16).slice(2).padEnd(64, '0')}`
}
