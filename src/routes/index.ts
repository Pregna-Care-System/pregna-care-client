//--Libraries
import { lazy } from 'react'
//--Utils
import ROUTES from '@utils/config/routes'
//--Layouts
import NoHeaderLayout from '@layouts/NoHeaderLayout'
import SideBarLayout from '@layouts/SideBarLayout'
//--Pages
import GuestHome from '@pages/Home/GuestHome'
import MainHome from '@pages/Home/MainHome'
import LoginPage from '@pages/Login'
import MainProfile from '@pages/Profile/MainProfile'
import Register from '@pages/Register'
import ConfirmEmail from '@pages/Register/ConfirmPage'
import EmailConfirmationSuccessPage from '@pages/Register/ConfirmSuccess'

// Lazy load components
const GuestHome = lazy(() => import('@pages/Home/GuestHome'))
const MainHome = lazy(() => import('@pages/Home/MainHome'))
const LoginPage = lazy(() => import('@pages/Login'))
const MainProfile = lazy(() => import('@pages/Profile/MainProfile'))
const Register = lazy(() => import('@pages/Register'))

//--Routes
//no need to login
const publicRoutes = [
  { path: ROUTES.LOGIN, component: LoginPage, layout: NoHeaderLayout },
  { path: ROUTES.GUEST_HOME, component: GuestHome },
  { path: ROUTES.REGISTER, component: Register, layout: NoHeaderLayout },
  { path: ROUTES.CONFIRM_EMAIL, component: ConfirmEmail, layout: NoHeaderLayout },
  { path: ROUTES.SUCCESS_CONFIRM, component: EmailConfirmationSuccessPage, layout: NoHeaderLayout }
]
// need to login to view
const privateRoutes = [
  { path: ROUTES.PROFILE, component: MainProfile, layout: SideBarLayout },
  { path: ROUTES.HOME, component: MainHome }
]
export { publicRoutes, privateRoutes }
