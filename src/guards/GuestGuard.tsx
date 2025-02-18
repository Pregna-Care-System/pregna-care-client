import { selectIsAuthenticated } from '@/store/modules/global/selector'
import ROUTES from '@/utils/config/routes'
import { useContext } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

type GuestGuardProps = {
  children: React.ReactNode
}

const GuestGuard = ({ children }: GuestGuardProps) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)

  if (isAuthenticated) return <Navigate to={ROUTES.HOME} replace />

  return <>{children}</>
}

export default GuestGuard
