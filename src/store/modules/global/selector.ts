import { RootState } from '@store/store'

export const selectIsAuthenticated = (state: RootState) => state.global.isAuthenticated
export const selectServices = (state: RootState) => state.global.services
export const selectReasons = (state: RootState) => state.global.reason
export const selectMembershipPlans = (state: RootState) => state.global.membershipPlans
export const selectTestimonials = (state: RootState) => state.global.testimonials
export const selectMotherInfo = (state: RootState) => state.global.motherInfo
export const selectTransactionInfo = (state: RootState) => state.global.transactionInfo
export const selectMemberInfo = (state: RootState) => state.global.memberInfo
export const selectMembershipPlansAdminInfo = (state: RootState) => state.global.membershipPlansAdminInfo
export const selectFeatureInfoInfo = (state: RootState) => state.global.featureInfo
export const selectGrowthMetrics = (state: RootState) => state.global.growthMetrics
export const selectPregnancyRecord = (state: RootState) => state.global.pregnancyRecord
export const selectFetalGrowthRecord = (state: RootState) => state.global.fetalGrowthRecord
export const selectUserInfo = (state: RootState) => state.global.userInfo
export const selectReminderInfo = (state: RootState) => state.global.reminderInfo
export const selectReminderTypeInfo = (state: RootState) => state.global.reminderTypeInfo
export const selectReminderActiveInfo = (state: RootState) => state.global.reminderActiveInfo
export const selectGrowthMetricsOfWeek = (state: RootState) => state.global.growthMetricsOfWeek
export const selectStatistics = (state: RootState) => state.global.statistics
export const selectNotifications = (state: RootState) => state.global.notificationInfo
