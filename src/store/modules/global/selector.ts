import { RootState } from '@store/store'

export const selectServices = (state: RootState) => state.global.services
export const selectReasons = (state: RootState) => state.global.reason
export const selectMembershipPlans = (state: RootState) => state.global.membershipPlans
export const selectTestimonials = (state: RootState) => state.global.testimonials
