import routes from '@/utils/config/routes'
import NoHeaderLayout from '@layouts/NoHeaderLayout'
import SideBarLayout from '@layouts/SideBarLayout'
import GuestHome from '@pages/Home/GuestHome'
import MainHome from '@pages/Home/MainHome'
import LoginPage from '@pages/Login'
import MainProfile from '@pages/Profile/MainProfile'
import Register from '@pages/Register'
//no need to login
const publicRoutes = [
  { path: routes.login, component: LoginPage, layout: NoHeaderLayout },
  { path: routes.guest_home, component: GuestHome },
  { path: routes.register, component: Register, layout: NoHeaderLayout }
]
// need to login to view
const privateRoutes = [
  { path: routes.profile, component: MainProfile, layout: SideBarLayout },
  { path: routes.home, component: MainHome }
]
export { publicRoutes, privateRoutes }
