import { login } from '@/services/userService'
import { call, put, takeLatest } from 'redux-saga/effects'
import { setLoginStatus } from './slice'
import { message } from 'antd'
import { PayloadAction } from '@reduxjs/toolkit'

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

export function* watchEditorGlobalSaga() {
  yield takeLatest('USER_LOGIN', userLogin)
}
