import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { selectIsAuthLoading, selectUserInfo } from '@/store/modules/global/selector'
import ROUTES from '@/utils/config/routes'
import Loading from '@/components/Loading'

type AuthGuardProps = {
  children: React.ReactNode
}

const AdminGuard = ({ children }: AuthGuardProps) => {
  const user = useSelector(selectUserInfo)
  const isLoading = useSelector(selectIsAuthLoading)

  if (isLoading) {
    return <Loading />
  }

  if (!user || user.role !== 'Admin') {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return <>{children}</>
}

export default AdminGuard
