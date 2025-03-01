//Libaries
import React from 'react'
//Utils
import ROUTES from '@utils/config/routes'
//Guard
import GuestGuard from '@/guards/GuestGuard'
import AuthGuard from '@/guards/AuthGuard'
import AdminGuard from '@/guards/AdminGuard'
import MemberGuard from '@/guards/MemberGuard'
//Layout
import MainLayout from '@/layouts/MainLayout'
import AdminLayout from '@/layouts/AdminLayout'
import MemberLayout from '@/layouts/MemberLayout'
import Loading from '@/components/Loading'
import NoHeaderLayout from '@/layouts/NoHeaderLayout'
import NotificationPage from '@/pages/Notification'
import MommyServicesPage from '@/pages/Service'
import BabyShopApp from '@/pages/Service/BabyShop/index '
//Pages
const HomePage = React.lazy(() => import('@pages/Home'))
const ConfirmEmail = React.lazy(() => import('@pages/Register/ConfirmPage'))
const EmailConfirmationSuccessPage = React.lazy(() => import('@pages/Register/ConfirmSuccess'))
const ProfilePage = React.lazy(() => import('@pages/Profile/MainProfile'))
const PaymentStatusPage = React.lazy(() => import('@pages/PaymentStatus'))
const CheckoutPage = React.lazy(() => import('@pages/Checkout'))
const BlogPage = React.lazy(() => import('@pages/Blog'))
const babyNamePage = React.lazy(() => import('@/pages/Service/BabyName'))
const BlogDetailsPage = React.lazy(() => import('@pages/Blog/BlogDetails'))
const CommunityDetailsPage = React.lazy(() => import('@/pages/Community/Details'))
const PlanDetailPage = React.lazy(() => import('@pages/MembershipPlans/components/PlanDetail'))
const ResendPasswordPage = React.lazy(() => import('@/pages/Login/ForgotPassword/ResendPassword'))
const MemberShipPlanPage = React.lazy(() => import('@pages/MembershipPlans'))
const ForgotPasswordPage = React.lazy(() => import('@/pages/Login/ForgotPassword'))
const NotFound = React.lazy(() => import('@/pages/NotFound'))
const LoginPage = React.lazy(() => import('@/pages/Login'))
const CommunityPage = React.lazy(() => import('@/pages/Community'))
const Register = React.lazy(() => import('@pages/Register'))
const Schedule = React.lazy(() => import('@pages/Schedule'))
const Contact = React.lazy(() => import('@pages/Contact'))
const NutritionFitnessPage = React.lazy(() => import('@pages/NutritionAndFitness/index'))
//Pages-Admin
const AdminDashboard = React.lazy(() => import('@/pages/Admin/Dashboard'))
const TransactionPage = React.lazy(() => import('@/pages/Admin/Transaction'))
const MemberPage = React.lazy(() => import('@/pages/Admin/Member'))
const MemberShipPlanAdminPage = React.lazy(() => import('@/pages/Admin/MembershipPlan'))
const GrowthMetrics = React.lazy(() => import('@/pages/Admin/GrowthMetrics'))
//Pages-Member
const Dashboard = React.lazy(() => import('@/pages/Member/Dashboard'))
const FetalGrowthChart = React.lazy(() => import('@/pages/Member/FetalGrowthChart'))
const FetalGrowthChartDetail = React.lazy(() => import('@/pages/Member/FetalGrowthChartDetail'))

const publicRoutes = [
  { path: ROUTES.LOGIN, component: LoginPage, layout: NoHeaderLayout },
  { path: ROUTES.GUEST_HOME, component: HomePage },
  { path: ROUTES.BLOG, component: BlogPage },
  { path: ROUTES.BABY_NAME, component: babyNamePage },
  { path: ROUTES.BABY_SHOP, component: BabyShopApp },
  { path: ROUTES.BLOG_DETAILS, component: BlogDetailsPage },
  { path: ROUTES.COMMUNITY, component: CommunityPage },
  { path: ROUTES.COMMUNITY_DETAILS, component: CommunityDetailsPage },
  { path: ROUTES.REGISTER, component: Register, layout: NoHeaderLayout },
  { path: ROUTES.CONFIRM_EMAIL, component: ConfirmEmail, layout: NoHeaderLayout },
  { path: ROUTES.RESEND_PASSWORD, component: ResendPasswordPage, layout: NoHeaderLayout },
  { path: ROUTES.FORGOT_PASSWORD, component: ForgotPasswordPage, layout: NoHeaderLayout },
  { path: ROUTES.SUCCESS_CONFIRM, component: EmailConfirmationSuccessPage, layout: NoHeaderLayout },
  { path: ROUTES.CHECKOUT, component: CheckoutPage },
  { path: ROUTES.MEMBESHIP_PLANS, component: MemberShipPlanPage },
  { path: ROUTES.DETAIL_PLAN, component: PlanDetailPage },
  { path: ROUTES.SCHEDULE, component: Schedule },
  { path: ROUTES.PAYMENTSTATUS, component: PaymentStatusPage },
  { path: ROUTES.CONTACT, component: Contact },
  { path: ROUTES.NUTRITION_AND_FITNESS, component: NutritionFitnessPage },
  { path: ROUTES.SERVICES, component: MommyServicesPage }
]

const privateRoutes = [
  { path: ROUTES.PROFILE, component: ProfilePage },
  { path: ROUTES.NOTIFICATION, component: NotificationPage }
]

const adminRoutes = [
  { path: ROUTES.ADMIN.DASHBOARD, component: AdminDashboard, layout: AdminLayout },
  { path: ROUTES.ADMIN.TRANSACTION, component: TransactionPage, layout: AdminLayout },
  { path: ROUTES.ADMIN.MEMBER, component: MemberPage, layout: AdminLayout },
  { path: ROUTES.ADMIN.MEMBERSHIP_PLAN, component: MemberShipPlanAdminPage, layout: AdminLayout },
  { path: ROUTES.ADMIN.GROWTHMETRICS, component: GrowthMetrics, layout: AdminLayout }
]

const memberRoutes = [
  { path: ROUTES.MEMBER.DASHBOARD, component: Dashboard, layout: MemberLayout },
  { path: ROUTES.MEMBER.FETALGROWTHCHART, component: FetalGrowthChart, layout: MemberLayout },
  { path: ROUTES.MEMBER.FETALGROWTHCHART_DETAIL, component: FetalGrowthChartDetail, layout: MemberLayout }
]

export { publicRoutes, adminRoutes, memberRoutes, privateRoutes }

// export const router = createBrowserRouter([
//   //Public Routes and Protected Routes
//   {
//     path: ROUTES.HOME,
//     element: (
//       <Suspense fallback={<Loading />}>
//         <MainLayout />
//       </Suspense>
//     ),
//     children: [
//       //Public Routes
//       { index: true, element: <HomePage /> },
//       {
//         path: ROUTES.MEMBESHIP_PLANS,
//         element: <MemberShipPlanPage />
//       },
//       {
//         path: ROUTES.DETAIL_PLAN,
//         element: <PlanDetailPage />
//       },
//       {
//         path: ROUTES.BLOG,
//         element: <BlogPage />
//       },
//       {
//         path: ROUTES.BLOG_DETAILS,
//         element: <BlogDetailsPage />
//       },
//       {
//         path: ROUTES.COMMUNITY,
//         element: <CommunityPage />
//       },
//       {
//         path: ROUTES.COMMUNITY_DETAILS,
//         element: <CommunityDetailsPage />
//       },
//       {
//         path: ROUTES.FORGOT_PASSWORD,
//         element: <ForgotPasswordPage />
//       },
//       {
//         path: ROUTES.RESEND_PASSWORD,
//         element: <ResendPasswordPage />
//       },
//       {
//         path: ROUTES.CONFIRM_EMAIL,
//         element: <ConfirmEmail />
//       },
//       {
//         path: ROUTES.SUCCESS_CONFIRM,
//         element: <EmailConfirmationSuccessPage />
//       },
//       {
//         path: ROUTES.CONTACT,
//         element: <Contact />
//       },
//       //Private Routes
//       {
//         path: ROUTES.PROFILE,
//         element: (
//           <AuthGuard>
//             <ProfilePage />
//           </AuthGuard>
//         )
//       },
//       {
//         path: ROUTES.CHECKOUT,
//         element: (
//           <AuthGuard>
//             <CheckoutPage />
//           </AuthGuard>
//         )
//       },
//       {
//         path: ROUTES.PAYMENTSTATUS,
//         element: (
//           <AuthGuard>
//             <PaymentStatusPage />
//           </AuthGuard>
//         )
//       },
//       {
//         path: ROUTES.SCHEDULE,
//         element: (
//           <AuthGuard>
//             <Schedule />
//           </AuthGuard>
//         )
//       }
//     ]
//   },
//   {
//     path: ROUTES.CONFIRM_EMAIL,
//     element: (
//       <Suspense fallback={<Loading />}>
//         <NoHeaderLayout>
//           <ConfirmEmail />
//         </NoHeaderLayout>
//       </Suspense>
//     )
//   },
//   {
//     path: ROUTES.SUCCESS_CONFIRM,
//     element: (
//       <Suspense fallback={<Loading />}>
//         <NoHeaderLayout>
//           <EmailConfirmationSuccessPage />
//         </NoHeaderLayout>
//       </Suspense>
//     )
//   },
//   {
//     path: ROUTES.RESEND_PASSWORD,
//     element: (
//       <Suspense fallback={<Loading />}>
//         <NoHeaderLayout>
//           <ResendPasswordPage />
//         </NoHeaderLayout>
//       </Suspense>
//     )
//   },
//   //Admin Routes
//   {
//     path: ROUTES.ADMIN.DASHBOARD,
//     element: (
//       <AuthGuard>
//         <AdminGuard>
//           <AdminLayout />
//         </AdminGuard>
//       </AuthGuard>
//     ),
//     children: [
//       {
//         index: true,
//         element: <AdminDashboard />
//       },
//       {
//         path: ROUTES.ADMIN.TRANSACTION,
//         element: <TransactionPage />
//       },
//       {
//         path: ROUTES.ADMIN.MEMBER,
//         element: <MemberPage />
//       },
//       {
//         path: ROUTES.ADMIN.MEMBERSHIP_PLAN,
//         element: <MemberShipPlanAdminPage />
//       },
//       {
//         path: ROUTES.ADMIN.GROWTHMETRICS,
//         element: <GrowthMetrics />
//       }
//     ]
//   },
//   //Member Routes
//   {
//     path: ROUTES.MEMBER.DASHBOARD,
//     element: (
//       <AuthGuard>
//         <MemberGuard>
//           <MemberLayout />
//         </MemberGuard>
//       </AuthGuard>
//     ),
//     children: [
//       {
//         index: true,
//         element: <Dashboard />
//       },
//       {
//         path: ROUTES.MEMBER.TRACKING,
//         element: <Tracking />
//       },
//       {
//         path: ROUTES.MEMBER.FETALGROWTHCHART,
//         element: <FetalGrowthChart />
//       },
//       {
//         path: ROUTES.MEMBER.FETALGROWTHCHART_DETAIL,
//         element: <FetalGrowthChartDetail />
//       }
//     ]
//   },
//   {
//     path: ROUTES.LOGIN,
//     element: (
//       <GuestGuard>
//         <LoginPage />
//       </GuestGuard>
//     )
//   },
//   {
//     path: ROUTES.REGISTER,
//     element: (
//       <GuestGuard>
//         <Register />
//       </GuestGuard>
//     )
//   },
//   {
//     path: '*',
//     element: <NotFound />
//   }
// ])
