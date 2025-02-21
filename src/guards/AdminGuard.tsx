import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { selectUserInfo } from '@/store/modules/global/selector'
import ROUTES from '@/utils/config/routes'

type AuthGuardProps = {
  children: React.ReactNode
}

const AdminGuard = ({ children }: AuthGuardProps) => {
  const user = useSelector(selectUserInfo)

  if (user.role !== 'Admin') {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return <>{children}</>
}

export default AdminGuard
