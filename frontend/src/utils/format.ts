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
  // Use slashes to avoid timezone shifts in some environments
  const date = new Date(dateString.replace(/-/g, '\/'))
  if (isNaN(date.getTime())) return 'Invalid Date'
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
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
