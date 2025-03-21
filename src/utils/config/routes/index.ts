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
  FAQ: '/faq',
  BLOG: '/blog',
  BLOG_DETAILS: '/blog-details',
  COMMUNITY: '/community',
  COMMUNITY_DETAILS: '/community/:id',
  SERVICES: '/services',
  BABY_NAME: '/baby-name',
  BABY_SHOP: '/baby-shop',
  MEMBESHIP_PLANS: '/membership-plans',
  DETAIL_PLAN: '/membership-plans/:planName',
  CHECKOUT: '/checkout',
  NOTIFICATION: '/notification',
  PAYMENTSTATUS: '/checkout/result',
  ADMIN: {
    DASHBOARD: '/admin',
    TRANSACTION: '/admin/transaction',
    MEMBER: '/admin/member',
    MEMBERSHIP_PLAN: '/admin/membership-plans',
    GROWTHMETRICS: '/admin/growth-metrics',
    FEATURE: '/admin/feature',
    FAQ: '/admin/faq',
    FEEDBACK: '/admin/feedback',
    CONTACT: '/admin/contact',
    REMINDER_TYPE:'/admin/reminder-type',
    BLOG: '/admin/blog'
  },
  MEMBER: {
    DASHBOARD: '/member',
    TRACKING: '/member/tracking',
    FETALGROWTHCHART: '/member/fetal-growth-chart',
    FETALGROWTHCHART_DETAIL: '/member/fetal-growth-chart/:pregnancyRecordId',
    SCHEDULE: '/schedule',
    YOUR_BLOG: '/your-blog'
  },
  NOT_FOUND: '*'
}
export default ROUTES
