/**
 * Midnight Wallet Integration
 *
 * Integrates with the Midnight DApp Connector API and Lace wallet.
 * Follows the @midnight-ntwrk/dapp-connector-api specification.
 */

export interface MidnightWalletAPI {
  enable: () => Promise<EnabledWalletAPI>
  isEnabled: () => Promise<boolean>
  apiVersion: string
  name: string
  icon: string
}

export interface EnabledWalletAPI {
  getNetworkId: () => Promise<string>
  state: () => Promise<WalletAPIState>
  balanceAndProveTransaction: (
    tx: unknown,
    newCoins: unknown
  ) => Promise<unknown>
  submitTransaction: (tx: unknown) => Promise<string>
}

export interface WalletAPIState {
  coinPublicKey: string
  encryptionPublicKey: string
}

declare global {
  interface Window {
    midnight?: {
      mnLace?: MidnightWalletAPI
    }
  }
}

/**
 * Detects and connects to the Midnight Lace wallet extension.
 */
export async function connectMidnightWallet(): Promise<{
  address: string
  networkId: string
} | null> {
  if (typeof window === 'undefined') return null

  const wallet = window.midnight?.mnLace
  if (!wallet) {
    console.warn('Midnight Lace wallet not found. Please install the Lace browser extension.')
    return null
  }

  try {
    const api = await wallet.enable()
    const networkId = await api.getNetworkId()
    const state = await api.state()
    return {
      address: state.coinPublicKey,
      networkId,
    }
  } catch (err) {
    console.error('Failed to connect wallet:', err)
    return null
  }
}

/**
 * Checks if the Midnight wallet extension is available.
 */
export function isMidnightWalletAvailable(): boolean {
  return typeof window !== 'undefined' && Boolean(window.midnight?.mnLace)
}
