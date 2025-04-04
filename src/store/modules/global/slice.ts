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
    },
    setFetalGrowthRecord(state, action: PayloadAction<any>) {
      state.fetalGrowthRecord = action.payload
    },
    setUserInfo(state, action: PayloadAction<any>) {
      state.userInfo = action.payload
    },
    setDataGrowthMetric(state, action: PayloadAction<any>) {
      state.growthMetrics = action.payload
    },
    setMemberInfo(state, action: PayloadAction<any>) {
      state.memberInfo = action.payload
    },
    setTransactionInfo(state, action: PayloadAction<any>) {
      state.transactionInfo = action.payload
    },
    setReminderInfo(state, action: PayloadAction<any>) {
      state.reminderInfo = action.payload
    },
    setReminderActiveInfo(state, action: PayloadAction<any>) {
      state.reminderInfo = action.payload
    },
    setReminderTypeInfo(state, action: PayloadAction<any>) {
      state.reminderTypeInfo = action.payload
    },
    setGrowthMetricsOfWeek(state, action: PayloadAction<any>) {
      state.growthMetricsOfWeek = action.payload
    },
    setStatistics(state, action: PayloadAction<any>) {
      state.statistics = action.payload
    },
    setNotifications(state, action: PayloadAction<any>) {
      state.notificationInfo = action.payload
    },
    setMotherInfo(state, action: PayloadAction<any>) {
      state.motherInfo = action.payload
    },
    setMostUsedPlan(state, action: PayloadAction<any>) {
      state.mostUsedPlan = action.payload
    },
    setTagsInfo(state, action: PayloadAction<any>) {
      state.tagInfo = action.payload
    },
    setBlogInfo(state, action: PayloadAction<any>) {
      state.blogInfo = action.payload
    },
    resetState(state) {
      // Keep isAuthenticated as false but reset everything else to initial values
      return {
        ...initialState,
        isAuthenticated: false,
        userInfo: {}
      }
    },
    setCurrentLoginUser(state, action: PayloadAction<any>) {
      state.currentLoginUser = action.payload
    }
  }
})

export const {
  setLoginStatus,
  setMembershipPlans,
  setFeatures,
  setPregnancyRecord,
  setFetalGrowthRecord,
  setUserInfo,
  setDataGrowthMetric,
  setMemberInfo,
  setTransactionInfo,
  setReminderInfo,
  setReminderTypeInfo,
  setReminderActiveInfo,
  setGrowthMetricsOfWeek,
  setStatistics,
  setNotifications,
  setMotherInfo,
  setMostUsedPlan,
  setTagsInfo,
  setBlogInfo,
  resetState,
  setCurrentLoginUser
} = editorSlice.actions

export default editorSlice.reducer
