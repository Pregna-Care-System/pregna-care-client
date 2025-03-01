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
export const selectBabyInfo = (state: RootState) => state.global.babyInfo
export const selectGrowthMetrics = (state: RootState) => state.global.growthMetrics
export const selectPregnancyRecord = (state: RootState) => state.global.pregnancyRecord
export const selectFetalGrowthRecord = (state: RootState) => state.global.fetalGrowthRecord
export const selectUserInfo = (state: RootState) => state.global.userInfo
