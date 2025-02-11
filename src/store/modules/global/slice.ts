import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { initialState } from './state'

const editorSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setLoginStatus(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload
    },
    setMembershipPlans(state, action: PayloadAction<any>) {
      state.membershipPlans = action.payload
    },
    setFeatures(state, action: PayloadAction<any>) {
      state.featureInfo = action.payload
    },
    setPregnancyRecord(state, action: PayloadAction<any>) {
      state.pregnancyRecord = action.payload
    }
    }
})

export const { setLoginStatus, setMembershipPlans, setFeatures, setPregnancyRecord } =
  editorSlice.actions

export default editorSlice.reducer
