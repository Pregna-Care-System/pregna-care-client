import ROUTES from '@/utils/config/routes'
import NoHeaderLayout from '@layouts/NoHeaderLayout'
import SideBarLayout from '@layouts/SideBarLayout'
import GuestHome from '@pages/Home/GuestHome'
import MainHome from '@pages/Home/MainHome'
import LoginPage from '@pages/Login'
import MainProfile from '@pages/Profile/MainProfile'
import Register from '@pages/Register'
//no need to login
const publicRoutes = [
  { path: ROUTES.LOGIN, component: LoginPage, layout: NoHeaderLayout },
  { path: ROUTES.GUEST_HOME, component: GuestHome },
  { path: ROUTES.REGISTER, component: Register, layout: NoHeaderLayout }
]
// need to login to view
const privateRoutes = [
  { path: ROUTES.PROFILE, component: MainProfile, layout: SideBarLayout },
  { path: ROUTES.HOME, component: MainHome }
]
export { publicRoutes, privateRoutes }
