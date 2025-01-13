import { RootState } from '@store/store'

export const selectBanner = (state: RootState) => state.global.banner
