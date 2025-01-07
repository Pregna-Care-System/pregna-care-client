import { useEffect, useState } from 'react'

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    setIsAuthenticated(!!token)
  }, [])
  return { isAuthenticated }
}
