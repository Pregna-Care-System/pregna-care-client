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
  YOUR_BLOG:'/your-blog',
  PROFILE: '/profile',
  CONTACT: '/contact',
  BLOG: '/blog',
  BLOG_DETAILS: '/blog-details',
  COMMUNITY: '/community',
  COMMUNITY_DETAILS: '/community-details',
  SERVICES: '/services',
  NUTRITION_AND_FITNESS: '/nutrition-and-fitness',
  BABY_NAME: '/baby-name',
  BABY_SHOP: '/baby-shop',
  MEMBESHIP_PLANS: '/membership-plans',
  DETAIL_PLAN: '/membership-plans/:planName',
  CHECKOUT: '/checkout',
  NOTIFICATION: '/notification',
  PAYMENTSTATUS: '/checkout/result',
  SCHEDULE: '/schedule',
  ADMIN: {
    DASHBOARD: '/admin',
    TRANSACTION: '/admin/transaction',
    MEMBER: '/admin/member',
    MEMBERSHIP_PLAN: '/admin/membership-plans',
    GROWTHMETRICS: '/admin/growth-metrics'
  },
  MEMBER: {
    DASHBOARD: '/member',
    TRACKING: '/member/tracking',
    FETALGROWTHCHART: '/member/fetal-growth-chart',
    FETALGROWTHCHART_DETAIL: '/member/fetal-growth-chart/:pregnancyRecordId'
  },
  NOT_FOUND: '*'
}
export default ROUTES
