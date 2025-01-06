import routes from '~/config/routes'
import NoHeaderLayout from '~/layouts/noHeaderLayout'
import SideBarLayout from '~/layouts/sideBarLayout'
import GuestHome from '~/pages/home/GuestHome'
import MainHome from '~/pages/home/MainHome'
import LoginPage from '~/pages/login'
import MainProfile from '~/pages/profile/MainProfile'
import Register from '~/pages/register'
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
