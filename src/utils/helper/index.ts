import dayjs from 'dayjs'

export const formatNumber = (num: any) => {
  const formattedNum = new Intl.NumberFormat('en-US').format(num)
  return formattedNum.length === 1 ? `0${formattedNum}` : formattedNum
}

export const generateRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

export const getInitials = (name: string) => {
  if (!name) return ''

  const words = name.trim().split(/\s+/)
  if (words.length === 1) return words[0][0].toUpperCase()

  return words
    .slice(-2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)

  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()

  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}

/**
 * Format date to display format
 * @param date Date string
 * @returns Formatted date string
 */
export const formatDate = (date: string): string => {
  return dayjs(date).format('DD/MM/YYYY HH:mm')
}

/**
 * Parse recommendation string into structured data
 * @param recommendation Recommendation string with line breaks
 * @returns Array of structured recommendation items
 */
export const parseRecommendation = (recommendation: string) => {
  const lines = recommendation.split('\n')
  return lines.map((line, index) => {
    const [key, value] = line.split(':').map((item) => item.trim())
    return { key, value, id: index }
  })
}

/**
 * Get color based on severity level
 * @param severity Severity string
 * @returns Color code
 */
export const getSeverityColor = (severity: string): string => {
  switch (severity.toLowerCase()) {
    case 'critical':
      return '#ff4d4f'
    case 'warning':
      return '#faad14'
    case 'info':
      return '#1890ff'
    default:
      return '#1890ff'
  }
}

/**
 * Get status color for appointments
 * @param status Status string
 * @returns Color code
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'confirmed':
      return 'success'
    case 'pending':
      return 'warning'
    case 'cancelled':
      return 'error'
    default:
      return 'default'
  }
}

/**
 * Get status text in Vietnamese
 * @param status Status string
 * @returns Vietnamese status text
 */
export const getStatusText = (status: string): string => {
  switch (status) {
    case 'confirmed':
      return 'Đã xác nhận'
    case 'pending':
      return 'Chờ xác nhận'
    case 'cancelled':
      return 'Đã hủy'
    default:
      return status
  }
}

/**
 * Formats a percentage value to the xx.xx% format
 * @param {number} value - The percentage value to format
 * @returns {string} - The formatted percentage string in xx.xx% format
 */
export const formatPercentage = (value) => {
  // Convert to number if it's a string
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Check if the value is a valid number
  if (isNaN(numValue)) {
    return 'Invalid input';
  }
  
  // Format to 2 decimal places and add % symbol
  return numValue.toFixed(2) + '%';
}