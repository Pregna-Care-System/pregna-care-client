// define the Route
const ROUTES = {
  GUEST_HOME: '/',
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  CONFIRM_EMAIL: '/confirm-email',
  FORGOT_PASSWORD: '/forgot-password',
  RESEND_PASSWORD: '/resend-password',
  SUCCESS_CONFIRM: '/email-success-confirm',
  PROFILE: '/profile',
  CONTACT: '/contact',
  BLOG: '/blog',
  BLOG_DETAILS: '/blog-details',
  COMMUNITY: '/community',
  COMMUNITY_DETAILS: '/community-details',
  SERVICES: '/services',
  NUTRITION_AND_FITNESS: '/nutrition-and-fitness',
  MEMBESHIP_PLANS: '/membership-plans',
  DETAIL_PLAN: '/detail-plan',
  CHECKOUT: '/checkout',
  VNPAY: '/checkout/result',
  SCHEDULE: '/schedule',
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    TRANSACTION: '/admin/transaction',
    MEMBER: '/admin/member',
    MEMBERSHIP_PLAN: '/admin/membership-plans',
    GROWTHMETRICS: '/admin/growth-metrics'
  },
  MEMBER: {
    DASHBOARD: '/member',
    TRACKING: '/member/tracking',
    FETALGROWTHCHART: '/member/fetal-growth-chart'
  },
  NOT_FOUND: '*'
}
export default ROUTES
