import { lazy } from 'react'
import ROUTES from '@utils/config/routes'
import NoHeaderLayout from '@layouts/NoHeaderLayout'
import AdminSidebar from '@layouts/SideBarLayout/AdminSidebar'
import ConfirmEmail from '@pages/Register/ConfirmPage'
import EmailConfirmationSuccessPage from '@pages/Register/ConfirmSuccess'
import VNPayPage from '@pages/VNPay'
import AdminDashboard from '@pages/Admin'
import CheckoutPage from '@pages/Checkout'
import PlanDetail from '@pages/MembershipPlans/components/PlanDetail'
import MemberShipPlanPage from '@/pages/MembershipPlans'
import Dashboard from '@/pages/Member/Dashboard'
import Member from '@/pages/Member'
// import Profile from "@/pages/Member/Profile"

// Lazy load components
const GuestHome = lazy(() => import('@pages/Home/GuestHome'))
const MainHome = lazy(() => import('@pages/Home/MainHome'))
const LoginPage = lazy(() => import('@pages/Login'))
const MainProfile = lazy(() => import('@pages/Profile/MainProfile'))
const Register = lazy(() => import('@pages/Register'))

const publicRoutes = [
  { path: ROUTES.LOGIN, component: LoginPage, layout: NoHeaderLayout },
  { path: ROUTES.GUEST_HOME, component: GuestHome },
  { path: ROUTES.REGISTER, component: Register, layout: NoHeaderLayout },
  { path: ROUTES.CONFIRM_EMAIL, component: ConfirmEmail, layout: NoHeaderLayout },
  { path: ROUTES.SUCCESS_CONFIRM, component: EmailConfirmationSuccessPage, layout: NoHeaderLayout },
  { path: ROUTES.CHECKOUT, component: CheckoutPage },
  { path: ROUTES.MEMBESHIP_PLANS, component: MemberShipPlanPage },
  { path: ROUTES.DETAIL_PLAN + '/:planName', component: PlanDetail },
  { path: ROUTES.VNPAY, component: VNPayPage },
  {
    path: ROUTES.MEMBER_DASHBOARD,
    component: Member,
    layout: NoHeaderLayout,
    children: [
      { path: '', component: Dashboard }
      // { path: "profile", component: Profile },
      // Add more nested routes for the member dashboard here
    ]
  }
]

const privateRoutes = [
  { path: ROUTES.PROFILE, component: MainProfile, layout: AdminSidebar },
  { path: ROUTES.HOME, component: MainHome },
  { path: ROUTES.ADMIN_DASHBOARD, component: AdminDashboard, layout: NoHeaderLayout }
  // {
  //   path: ROUTES.MEMBER_DASHBOARD,
  //   component: Member,
  //   layout: NoHeaderLayout,
  //   children: [
  //     { path: '', component: Dashboard }
  //     // { path: "profile", component: Profile },
  //     // Add more nested routes for the member dashboard here
  //   ]
  // }
]

export { publicRoutes, privateRoutes }
