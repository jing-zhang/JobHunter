import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate, formatStatus } from '@/utils/format'

describe('Format Utilities', () => {
  describe('formatCurrency', () => {
    it('formats numbers correctly as USD', () => {
      expect(formatCurrency(120000)).toBe('$120,000')
      expect(formatCurrency(0)).toBe('$0')
    })
  })

  describe('formatDate', () => {
    it('formats date strings correctly', () => {
      expect(formatDate('2026-05-10')).toBe('May 10, 2026')
    })

    it('formats ISO datetime strings correctly', () => {
      expect(formatDate('2026-05-10T00:00:00.000Z')).toBe('May 10, 2026')
    })

    it('handles empty or invalid dates', () => {
      expect(formatDate('')).toBe('N/A')
      expect(formatDate('invalid')).toBe('Invalid Date')
    })
  })

  describe('formatStatus', () => {
    it('capitalizes and replaces underscores', () => {
      expect(formatStatus('applied')).toBe('Applied')
      expect(formatStatus('phone_screen')).toBe('Phone Screen')
      expect(formatStatus('offer_accepted')).toBe('Offer Accepted')
    })

    it('handles empty strings', () => {
      expect(formatStatus('')).toBe('')
    })
  })
})
