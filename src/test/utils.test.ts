import { describe, it, expect } from 'vitest'
import { shortenAddress, formatDate, cn } from '@/lib/utils'

describe('shortenAddress', () => {
  it('shortens a long address', () => {
    expect(shortenAddress('0x742d35Cc6634C0532925a3b8D4C9B4C9b4C9b4C9')).toBe('0x742d...b4C9')
  })
  it('returns empty string for empty input', () => {
    expect(shortenAddress('')).toBe('')
  })
})

describe('formatDate', () => {
  it('formats a date string', () => {
    const result = formatDate('2025-05-15T09:00:00Z')
    expect(result).toContain('2025')
    expect(result).toContain('May')
  })
})

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })
  it('handles conditional classes', () => {
    expect(cn('a', false && 'b', 'c')).toBe('a c')
  })
})
