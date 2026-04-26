/**
 * Formats a number as a currency string (USD).
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Formats a date string into a localized date string.
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A'
  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(dateString)
  const hasExplicitTimeZone = /Z$|[+-]\d{2}:\d{2}$/.test(dateString)
  const useUtc = isDateOnly || hasExplicitTimeZone

  const date = isDateOnly
    ? (() => {
        const [year, month, day] = dateString.split('-').map(Number)
        return new Date(Date.UTC(year, month - 1, day))
      })()
    : new Date(dateString)

  if (Number.isNaN(date.getTime())) return 'Invalid Date'

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(useUtc ? { timeZone: 'UTC' } : {}),
  })
}

/**
 * Capitalizes the first letter of a string and replaces underscores with spaces.
 */
export const formatStatus = (status: string): string => {
  if (!status) return ''
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())
}
