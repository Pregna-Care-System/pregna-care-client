import { Children, lazy } from 'react'
import ROUTES from '@utils/config/routes'
import NoHeaderLayout from '@layouts/NoHeaderLayout'
import ConfirmEmail from '@pages/Register/ConfirmPage'
import EmailConfirmationSuccessPage from '@pages/Register/ConfirmSuccess'
import VNPayPage from '@pages/VNPay'
import AdminDashboard from '@/pages/Admin/Dashboard'
import CheckoutPage from '@pages/Checkout'
import PlanDetail from '@pages/MembershipPlans/components/PlanDetail'
import MemberShipPlanPage from '@/pages/MembershipPlans'
import Dashboard from '@/pages/Member/Dashboard'
import TransactionPage from '@/pages/Admin/Transaction'
import MemberPage from '@/pages/Admin/Member'
import MemberShipPlanAdminPage from '@/pages/Admin/MembershipPlan'
import Tracking from '@/pages/Member/Tracking'
import ResendPassword from '@/pages/Login/ForgotPassword/ResendPassword'
import ForgotPassword from '@/pages/Login/ForgotPassword'
import FetalGrowthChart from '@/pages/Member/FetalGrowthChart'
import MemberLayout from '@/layouts/MemberLayout'
import AdminLayout from '@/layouts/AdminLayout'
// import Profile from "@/pages/Member/Profile"

// Lazy load components
const GuestHome = lazy(() => import('@pages/Home/GuestHome'))
const MainHome = lazy(() => import('@pages/Home/MainHome'))
const LoginPage = lazy(() => import('@pages/Login'))
const MainProfile = lazy(() => import('@pages/Profile/MainProfile'))
const Register = lazy(() => import('@pages/Register'))
const SchedulePage = lazy(() => import('@/pages/Schedule'))

const publicRoutes = [
  { path: ROUTES.LOGIN, component: LoginPage, layout: NoHeaderLayout },
  { path: ROUTES.GUEST_HOME, component: GuestHome },
  { path: ROUTES.REGISTER, component: Register, layout: NoHeaderLayout },
  { path: ROUTES.CONFIRM_EMAIL, component: ConfirmEmail, layout: NoHeaderLayout },
  { path: ROUTES.RESEND_PASSWORD, component: ResendPassword, layout: NoHeaderLayout },
  { path: ROUTES.FORGOT_PASSWORD, component: ForgotPassword, layout: NoHeaderLayout },
  { path: ROUTES.SUCCESS_CONFIRM, component: EmailConfirmationSuccessPage, layout: NoHeaderLayout },
  { path: ROUTES.CHECKOUT, component: CheckoutPage },
  { path: ROUTES.MEMBESHIP_PLANS, component: MemberShipPlanPage },
  { path: `${ROUTES.DETAIL_PLAN}/:planName`, component: PlanDetail },
  { path: ROUTES.SCHEDULE, component: SchedulePage },
  { path: ROUTES.VNPAY, component: VNPayPage },
  //--- Member routes
  { path: ROUTES.MEMBER_DASHBOARD, component: Dashboard, layout: MemberLayout },
  { path: ROUTES.MEMBER_FETALGROWTHCHART, component: FetalGrowthChart, layout: MemberLayout },
  { path: ROUTES.MEMBER_TRACKING, component: Tracking, layout: MemberLayout },
  //--- Admin routes
  { path: ROUTES.ADMIN_DASHBOARD, component: AdminDashboard, layout: AdminLayout },
  { path: ROUTES.ADMIN_TRANSACTION, component: TransactionPage, layout: AdminLayout },
  { path: ROUTES.ADMIN_MEMBER, component: MemberPage, layout: AdminLayout },
  { path: ROUTES.ADMIN_MEMBERSHIP_PLAN, component: MemberShipPlanAdminPage, layout: AdminLayout }
]

const adminRoutes = [
  { path: ROUTES.PROFILE, component: MainProfile }
  // { path: ROUTES.ADMIN_DASHBOARD, component: AdminDashboard, layout: NoHeaderLayout }
]

const memberRoutes = [{ path: ROUTES.PROFILE, component: MainProfile }]

export { publicRoutes, adminRoutes, memberRoutes }
