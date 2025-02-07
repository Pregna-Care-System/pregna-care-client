import { RootState } from '@store/store'

export const selectIsAuthenticated = (state: RootState) => state.global.isAuthenticated
export const selectServices = (state: RootState) => state.global.services
export const selectReasons = (state: RootState) => state.global.reason
export const selectMembershipPlans = (state: RootState) => state.global.membershipPlans
export const selectTestimonials = (state: RootState) => state.global.testimonials
export const selectMotherInfo = (state: RootState) => state.global.motherInfo
export const selectTransactionInfo = (state: RootState) => state.global.transactionInfo
export const selectMemberAdminInfo = (state: RootState) => state.global.memberAdminInfo
export const selectMembershipPlansAdminInfo = (state: RootState) => state.global.membershipPlansAdminInfo
export const selectFeatureInfoInfo = (state: RootState) => state.global.featureInfo
export const selectBabyInfo = (state: RootState) => state.global.babyInfo

