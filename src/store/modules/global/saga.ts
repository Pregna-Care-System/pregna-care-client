import { call, put, takeLatest } from 'redux-saga/effects'
import { setLoginStatus, setMembershipPlans, setFeatures, setPregnancyRecord } from './slice'
import { message } from 'antd'
import { PayloadAction } from '@reduxjs/toolkit'
//-----Services-----
import { createPlan, deletePlan, getAllPlan, updatePlan } from '@/services/planService'
import { getAllFeature } from '@/services/featureService'
import { createPregnancyRecord, getAllPregnancyRecord } from '@/services/pregnancyRecordService'
import { login, paymentVNPAY, userMembershipPlan } from '@/services/userService'
import { getAllPlan } from '@/services/planService'
import { createGrowthMetric } from '@/services/adminService'

//-----User-----
export function* userLogin(action: PayloadAction<REDUX.LoginActionPayload>): Generator<any, void, any> {
  try {
    const response = yield call(login, action.payload.email, action.payload.password)
    if (response.success && response.response !== null) {
      const token = response.response as MODEL.TokenResponse
      message.success('Login successful')
      localStorage.setItem('accessToken', token.accessToken)
      localStorage.setItem('refreshToken', token.refreshToken)
      yield put(setLoginStatus(true))
      action.payload.navigate(action.payload.route)
    }
  } catch (error: any) {
    if (error.redirect) {
      message.warning(error.message)
    } else {
      message.error(error.message || 'An unexpected error occurred')
    }
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

//----------Pregnancy record-----------
export function* createPregnancyRecord(action: PayloadAction<any>): Generator<any, void, any> {
  try {
    const response = yield call(createPregnancyRecord, action.payload.data)
    if (response.success) {
      message.success('Pregnancy record created successfully')
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
//----------Create Membership Plan-----------
export function* createMembershipPlan(action: PayloadAction<any>): Generator<any, void, any> {
  try {
    const response = yield call(
      createPlan,
      action.payload.planName,
      action.payload.price,
      action.payload.duration,
      action.payload.description,
      action.payload.featuredIds
    )
    if (response.data.success) {
      message.success('Create plan created successfully')
      yield put(setMembershipPlans(response.data.response))
    }
  } catch (error: any) {
    message.error('An unexpected error occurred try again later!')
    console.error('Fetch error:', error)
    throw error
  }
}
//----------Update Membership Plan-----------
export function* updateMembershipPlan(action: PayloadAction<any>): Generator<any, void, any> {
  try {
    const response = yield call(
      updatePlan,
      action.payload.planId,
      action.payload.planName,
      action.payload.price,
      action.payload.duration,
      action.payload.description,
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
//-------------------Delete Membership Plan-------------------
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

//----------Create PregnancyRecord-----------
export function* createBabyPregnancyRecord(action: PayloadAction<any>): Generator<any, void, any> {
  try {
    const response = yield call(
      createPregnancyRecord,
      action.payload.userId,
      action.payload.motherName,
      action.payload.motherDateOfBirth,
      action.payload.bloodType,
      action.payload.healthStatus,
      action.payload.notes,
      action.payload.babyName,
      action.payload.pregnancyStartDate,
      action.payload.expectedDueDate,
      action.payload.babyGender,
      action.payload.imageUrl
    )
    if (response.data.success) {
      message.success('Create pregnancyRecord successfully')
      yield put(setPregnancyRecord(response.data.response))
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
    }
  } catch (error: any) {
    message.error('An unexpected error occurred try again later!')
    console.error('Fetch error:', error)
    throw error
  }
}
//----------Pregnancy Record information-----------
export function* getAllPregnancyRecords(action: PayloadAction<{ userId: string }>): Generator<any, void, any> {
  try {
    const response = yield call(getAllPregnancyRecord, action.payload.userId)
    yield put(setPregnancyRecord(response))
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
  yield takeLatest('PAYMENT_VNPAY', paymentVNPAYMethod)
  yield takeLatest('USER_MEMBERSHIP_PLAN', addUserMembershipPlan)
  yield takeLatest('CREATE_GROWTH_METRIC', addFieldGrowthMetric)
}
