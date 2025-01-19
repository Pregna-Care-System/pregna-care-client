//--Libraries
import { lazy } from 'react'
//--Utils
import ROUTES from '@utils/config/routes'
//--Layouts
import NoHeaderLayout from '@layouts/NoHeaderLayout'
import AdminSidebar from '@layouts/SideBarLayout/AdminSidebar'
//--Pages
import ConfirmEmail from '@pages/Register/ConfirmPage'
import EmailConfirmationSuccessPage from '@pages/Register/ConfirmSuccess'
import PlanUpgrade from '@pages/MembershipPlans'
import VNPayPage from '@pages/VNPay'
import AdminDashboard from '@pages/Admin'
import CheckoutPage from '@pages/Checkout'

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
  { path: ROUTES.SUCCESS_CONFIRM, component: EmailConfirmationSuccessPage, layout: NoHeaderLayout },
  { path: ROUTES.MEMBESHIP_PLANS, component: PlanUpgrade },
  { path: ROUTES.CHECKOUT, component: CheckoutPage },
  { path: ROUTES.VNPAY, component: VNPayPage }
]

// need to login to view
const privateRoutes = [
  { path: ROUTES.PROFILE, component: MainProfile, layout: AdminSidebar },
  { path: ROUTES.HOME, component: MainHome },
  { path: ROUTES.ADMIN_DASHBOARD, component: AdminDashboard, layout: NoHeaderLayout }
]
export { publicRoutes, privateRoutes }
