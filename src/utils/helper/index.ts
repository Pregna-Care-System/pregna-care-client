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
