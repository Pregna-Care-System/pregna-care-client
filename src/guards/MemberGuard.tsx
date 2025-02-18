import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { selectUserInfo } from '@/store/modules/global/selector'
import ROUTES from '@/utils/config/routes'

type MemberGuardProps = {
  children: React.ReactNode
}

const MemberGuard = ({ children }: MemberGuardProps) => {
  const user = useSelector(selectUserInfo)

  if (user.role !== 'Member') return <Navigate to={ROUTES.HOME} replace />

  return <>{children}</>
}

export default MemberGuard
