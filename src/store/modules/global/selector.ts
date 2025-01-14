import { RootState } from '@store/store'

export const selectMembershipPlans = (state: RootState) => state.global.membershipPlans
