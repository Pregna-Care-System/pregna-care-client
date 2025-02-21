import { call, delay, put, takeLatest } from 'redux-saga/effects'
import {
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
  setAuthLoading
} from './slice'
import { message } from 'antd'
import { PayloadAction } from '@reduxjs/toolkit'
//-----Services-----
import { createPlan, deletePlan, getAllPlan, updatePlan } from '@/services/planService'
import { getAllFeature } from '@/services/featureService'
import { createPregnancyRecord, getAllPregnancyRecord } from '@/services/pregnancyRecordService'
import { createFetalGrowth, getFetalGrowthRecords } from '@/services/fetalGrowthRecordService'
import { login, paymentVNPAY, updateAccount, userMembershipPlan } from '@/services/userService'
import {
  createGrowthMetric,
  getAllGrowthMetrics,
  getAllGrowthMetricsOfWeek,
  getAllMember,
  getAllUserMembershipPlan
} from '@/services/adminService'
import { jwtDecode } from 'jwt-decode'
import {
  createReminder,
  deleteReminder,
  getAllReminder,
  getAllReminderActive,
  getAllReminderType,
  updateReminder
} from '@/services/reminderService'
import ROUTES from '@/utils/config/routes'

//-----User-----
export function* userLogin(action: PayloadAction<REDUX.LoginActionPayload>): Generator<any, void, any> {
  try {
    yield put(setAuthLoading(true))
    const response = yield call(login, action.payload.email, action.payload.password)
    if (response.success && response.response !== null) {
      const token = response.response as MODEL.TokenResponse
      message.success('Login successful')
      localStorage.setItem('accessToken', token.accessToken)
      localStorage.setItem('refreshToken', token.refreshToken)
      const decodedToken = jwtDecode(token.accessToken)
      localStorage.setItem('userInfo', JSON.stringify(decodedToken))
      yield put(setLoginStatus(true))
      yield put(setUserInfo(decodedToken))

      // Add a small delay to ensure Redux state is updated
      yield new Promise((resolve) => setTimeout(resolve, 1000))

      if (decodedToken.role === 'Admin') {
        yield call(action.payload.navigate, ROUTES.ADMIN.DASHBOARD)
      } else {
        yield call(action.payload.navigate, ROUTES.HOME)
      }
    }
  } catch (error: any) {
    if (error.redirect) {
      message.warning(error.message)
    } else {
      message.error(error.message || 'An unexpected error occurred')
    }
  } finally {
    yield put(setAuthLoading(false))
  }
}
//----------Update User information-----------
export function* updateUserInformation(action: PayloadAction<any>): Generator<any, void, any> {
  try {
    const response = yield call(
      updateAccount,
      action.payload.userId,
      action.payload.fullName,
      action.payload.phoneNumber,
      action.payload.address,
      action.payload.gender,
      action.payload.dateOfBirth,
      action.payload.imageUrl
    )
    console.log('Response:', response)
    if (response.success) {
      message.success('Account updated successfully')
    } else {
      message.error('Failed to update the account')
    }
  } catch (error) {
    message.error('An unexpected error occurred while updating the account.')
    console.error('Error in updateAccount saga:', error)
  }
}
//----------Payment-----------
export function* paymentVNPAYMethod(action: PayloadAction<any>): Generator<any, void, any> {
  const { userId, membershipPlanId } = action.payload
  try {
    const res = yield call(paymentVNPAY, userId, membershipPlanId)
    if (res.success) {
      localStorage.setItem('membershipPlanId', membershipPlanId)
      window.location.href = res.url
    }
  } catch (error: any) {
    message.error('An unexpected error occurred try again later!')
    console.error('Fetch error:', error)
    throw error
  }
}

export function* addUserMembershipPlan(action: PayloadAction<any>): Generator<any, void, any> {
  try {
    const response = yield call(userMembershipPlan, action.payload)
    if (response.success) {
      message.success('Membership plan created successfully')
    }
  } catch (error: any) {
    message.error('An unexpected error occurred try again later!')
    console.error('Fetch error:', error)
    throw error
  }
}

//----------Membership plan-----------
export function* getAllMembershipPlans(): Generator<any, void, any> {
  try {
    const response = yield call(getAllPlan)
    if (response.data.success) {
      yield put(setMembershipPlans(response.data.response))
    }
  } catch (error: any) {
    message.error('An unexpected error occurred try again later!')
    console.error('Fetch error:', error)
    throw error
  }
}

export function* createMembershipPlan(action: PayloadAction<any>): Generator<any, void, any> {
  try {
    const response = yield call(
      createPlan,
      action.payload.planName,
      action.payload.price,
      action.payload.duration,
      action.payload.description,
      action.payload.imageUrl,
      action.payload.featuredIds
    )
    if (response.data) {
      message.success('Create plan created successfully')
      yield put(setMembershipPlans(response.data))
    }
  } catch (error: any) {
    message.error('An unexpected error occurred try again later!')
    console.error('Fetch error:', error)
    throw error
  }
}

export function* updateMembershipPlan(action: PayloadAction<any>): Generator<any, void, any> {
  try {
    const response = yield call(
      updatePlan,
      action.payload.planId,
      action.payload.planName,
      action.payload.price,
      action.payload.duration,
      action.payload.description,
      action.payload.imageUrl,
      action.payload.featuredIds
    )
    if (response.data.success) {
      message.success('Plan updated successfully')
      yield put(setMembershipPlans(response.data.response))
    } else {
      message.error('Failed to update the plan')
    }
  } catch (error) {
    message.error('An unexpected error occurred while updating the plan.')
    console.error('Error in updateMembershipPlan saga:', error)
  }
}

export function* deleteMembershipPlan(action: PayloadAction<any>): Generator<any, void, any> {
  try {
    const response = yield call(deletePlan, action.payload.planId)
    if (response.success) {
      message.success('Plan deleted successfully')
      yield put({ type: 'GET_ALL_MEMBERSHIP_PLANS' })
    } else {
      message.error('Failed to delete the plan')
    }
  } catch (error) {
    message.error('An unexpected error occurred while deleting the plan.')
    console.error('Error in deleteMembershipPlan saga:', error)
  }
}

//------------Feature-----------
export function* getFeatures(): Generator<any, void, any> {
  try {
    const response = yield call(getAllFeature)
    if (response.data.success) {
      yield put(setFeatures(response.data.response))
    }
  } catch (error: any) {
    message.error('An unexpected error occurred try again later!')
    console.error('Fetch error:', error)
    throw error
  }
}

//----------Pregnancy Record information-----------
export function* createBabyPregnancyRecord(action: PayloadAction<any>): Generator<any, void, any> {
  try {
    const response = yield call(
      createPregnancyRecord,
      action.payload.userId,
      action.payload.motherName,
      action.payload.motherDateOfBirth,
      action.payload.bloodType,
      action.payload.healhStatus,
      action.payload.notes,
      action.payload.babyName,
      action.payload.pregnancyStartDate,
      action.payload.expectedDueDate,
      action.payload.babyGender,
      action.payload.imageUrl
    )
    if (response) {
      message.success('Create pregnancyRecord successfully')
      yield put(setPregnancyRecord(response))
      yield put({ type: 'GET_ALL_PREGNANCY_RECORD', payload: { userId: action.payload.userId } })
    }
  } catch (error: any) {
    message.error('An unexpected error occurred try again later!')
    console.error('Fetch error:', error)
    throw error
  }
}

export function* getAllPregnancyRecords(action: PayloadAction<{ userId: string }>): Generator<any, void, any> {
  try {
    const res = yield call(getAllPregnancyRecord, action.payload.userId)
    if (res.success) {
      yield put(setPregnancyRecord(res.response))
    }
  } catch (error: any) {
    message.error('An unexpected error occurred try again later!')
    console.error('Fetch error:', error)
    throw error
  }
}

//----------Create fetal growth record-----------
export function* createFetalGrowthRecord(action: PayloadAction<any>): Generator<any, void, any> {
  try {
    const response = yield call(
      createFetalGrowth,
      action.payload.userId,
      action.payload.pregnancyRecordId,
      action.payload.name,
      action.payload.unit,
      action.payload.description,
      action.payload.week,
      action.payload.value,
      action.payload.note
    )
    if (response) {
      message.success('Create fetal growth record successfully')
      yield put(setFetalGrowthRecord(response))
    }
  } catch (error: any) {
    message.error('An unexpected error occurred try again later!')
    console.error('Fetch error:', error)
    throw error
  }
}

export function* getFetalGrowthRecordsSaga(action: PayloadAction<any>): Generator<any, void, any> {
  try {
    const res = yield call(getFetalGrowthRecords, action.payload)
    if (res.success) {
      yield put(setFetalGrowthRecord(res.response))
    }
  } catch (error: any) {
    message.error('An unexpected error occurred try again later!')
    console.error('Fetch error:', error)
    throw error
  }
}

//-----GrowthMetric-----
export function* addFieldGrowthMetric(action: PayloadAction<any>): Generator<any, void, any> {
  try {
    const response = yield call(createGrowthMetric, action.payload)
    if (response.success) {
      message.success('Growth metric created successfully')
      yield getAllGrowthMetrics()
    }
  } catch (error: any) {
    message.error('An unexpected error occurred try again later!')
    console.error('Fetch error:', error)
    throw error
  }
}

export function* getDataGrowthMetric(): Generator<any, void, any> {
  try {
    const res = yield call(getAllGrowthMetrics)
    if (res.data.success) {
      yield put(setDataGrowthMetric(res.data.response))
    }
  } catch (error: any) {
    message.error('An unexpected error occurred try again later!')
    console.error('Fetch error:', error)
    throw error
  }
}

export function* getAllGrowthMetricsOfWeekSaga(action: PayloadAction<any>): Generator<any, void, any> {
  try {
    const res = yield call(getAllGrowthMetricsOfWeek, action.payload.week)
    if (res.data.success) {
      yield put(setGrowthMetricsOfWeek(res.data.response))
    }
  } catch (error: any) {
    message.error('An unexpected error occurred try again later!')
    console.error('Fetch error:', error)
    throw error
  }
}

//----------Member information-----------
export function* getAllMemberAdmin(): Generator<any, void, any> {
  try {
    const response = yield call(getAllMember)
    console.log('Response', response.data.response)
    if (response.data.response) {
      yield put(setMemberInfo(response.data.response))
    }
  } catch (error: any) {
    message.error('An unexpected error occurred try again later!')
    console.error('Fetch error:', error)
    throw error
  }
}
//----------User Transaction information-----------
export function* getAllUserTransactionAdmin(): Generator<any, void, any> {
  try {
    const response = yield call(getAllUserMembershipPlan)
    console.log('Response', response.data.response)
    if (response.data.response) {
      yield put(setTransactionInfo(response.data.response))
    }
  } catch (error: any) {
    message.error('An unexpected error occurred try again later!')
    console.error('Fetch error:', error)
    throw error
  }
}
//----------Reminder information-----------
export function* getAllReminderSaga(): Generator<any, void, any> {
  try {
    const response = yield call(getAllReminder)
    console.log('Response for call api', response)
    if (response.response) {
      yield put(setReminderInfo(response.response))
    }
  } catch (error: any) {
    message.error('An unexpected error occurred try again later!')
    console.error('Fetch error:', error)
    throw error
  }
}
//----------Reminder active information-----------
export function* getAllReminderActiveSaga(): Generator<any, void, any> {
  try {
    const response = yield call(getAllReminderActive)
    console.log('Response for call api', response)
    if (response.response) {
      yield put(setReminderActiveInfo(response.response))
    }
  } catch (error: any) {
    message.error('An unexpected error occurred try again later!')
    console.error('Fetch error:', error)
    throw error
  }
}
//----------Create reminder-----------
export function* createReminderSaga(action: PayloadAction<any>): Generator<any, void, any> {
  try {
    yield call(
      createReminder,
      action.payload.reminderTypeId,
      action.payload.title,
      action.payload.description,
      action.payload.reminderDate,
      action.payload.startTime,
      action.payload.endTime,
      action.payload.status
    )
    message.success('Create reminder successfully')
    yield put({ type: 'GET_ALL_REMINDER_INFORMATION' })
  } catch (error: any) {
    message.error('An unexpected error occurred try again later!')
    console.error('Fetch error:', error)
    throw error
  }
}
//----------Update REMINDER-----------
export function* updateReminderSaga(action: PayloadAction<any>): Generator<any, void, any> {
  try {
    yield call(
      updateReminder,
      action.payload.id,
      action.payload.reminderTypeId,
      action.payload.title,
      action.payload.description,
      action.payload.reminderDate,
      action.payload.startTime,
      action.payload.endTime,
      action.payload.status
    )
    message.success('Reminder updated successfully')
    yield put({ type: 'GET_ALL_REMINDER_INFORMATION' })
  } catch (error) {
    message.error('An unexpected error occurred while updating the reminder.')
    console.error('Error in updateReminder saga:', error)
  }
}
//-------------------Delete Reminder-------------------
export function* deleteReminderSaga(action: PayloadAction<any>): Generator<any, void, any> {
  console.log('DELETE_REMINDER action payload:', action.payload)
  try {
    yield call(deleteReminder, action.payload)

    message.success('Reminder deleted successfully')
    yield put({ type: 'GET_ALL_REMINDER_INFORMATION' })
  } catch (error) {
    message.error('An unexpected error occurred while deleting the reminder.')
    console.error('Error in deleteReminder saga:', error)
  }
}
//----------Reminder type information-----------
export function* getAllReminderTypeSaga(): Generator<any, void, any> {
  try {
    const response = yield call(getAllReminderType)
    if (response.response) {
      yield put(setReminderTypeInfo(response.response))
    }
  } catch (error: any) {
    message.error('An unexpected error occurred try again later!')
    console.error('Fetch error:', error)
    throw error
  }
}
export function* watchEditorGlobalSaga() {
  yield takeLatest('USER_LOGIN', userLogin)
  yield takeLatest('GET_ALL_FEATURES', getFeatures)
  yield takeLatest('CREATE_PREGNANCY_RECORD', createBabyPregnancyRecord)
  yield takeLatest('GET_ALL_PREGNANCY_RECORD', getAllPregnancyRecords)
  yield takeLatest('GET_ALL_MEMBERSHIP_PLANS', getAllMembershipPlans)
  yield takeLatest('CREATE_MEMBERSHIP_PLANS', createMembershipPlan)
  yield takeLatest('UPDATE_MEMBERSHIP_PLANS', updateMembershipPlan)
  yield takeLatest('DELETE_MEMBERSHIP_PLANS', deleteMembershipPlan)
  yield takeLatest('CREATE_FETAL_GROWTH_RECORD', createFetalGrowthRecord)
  yield takeLatest('PAYMENT_VNPAY', paymentVNPAYMethod)
  yield takeLatest('USER_MEMBERSHIP_PLAN', addUserMembershipPlan)
  yield takeLatest('CREATE_GROWTH_METRIC', addFieldGrowthMetric)
  yield takeLatest('GET_ALL_GROWTH_METRICS', getDataGrowthMetric)
  yield takeLatest('GET_FETAL_GROWTH_RECORDS', getFetalGrowthRecordsSaga)
  yield takeLatest('GET_ALL_MEMBERS', getAllMemberAdmin)
  yield takeLatest('GET_ALL_USER_MEMBERSHIP_PLANS', getAllUserTransactionAdmin)
  yield takeLatest('UPDATE_USER_INFORMATION', updateUserInformation)
  yield takeLatest('GET_ALL_REMINDER_INFORMATION', getAllReminderSaga)
  yield takeLatest('GET_ALL_REMINDER_ACTIVE_INFORMATION', getAllReminderActiveSaga)
  yield takeLatest('GET_ALL_REMINDER_TYPE_INFORMATION', getAllReminderTypeSaga)
  yield takeLatest('CREATE_REMINDER', createReminderSaga)
  yield takeLatest('UPDATE_REMINDER', updateReminderSaga)
  yield takeLatest('DELETE_REMINDER', deleteReminderSaga)
  yield takeLatest('GET_ALL_GROWTH_METRICS_OF_WEEK', getAllGrowthMetricsOfWeekSaga)
}
