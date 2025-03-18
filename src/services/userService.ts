import * as request from '@/utils/axiosClient'
import ROUTES from '@/utils/config/routes'

export const registerAccount = async (
  fullName: string,
  email: string,
  password: string
): Promise<MODEL.IResponseBase> => {
  try {
    const roleName = 'Guest'
    const apiCallerId = 'Register'

    const res = await request.post<MODEL.IResponseBase>('/Register', {
      apiCallerId,
      fullName,
      email,
      password,
      roleName
    })
    return res
  } catch (error: any) {
    console.error('Registration failed:', error)
    throw new Error(error.message || 'Registration failed')
  }
}

export const login = async (email: string, password: string) => {
  try {
    const apiCallerId = 'Login'
    const res = await request.post<MODEL.IResponseBase>(`/Login`, {
      email: email,
      password: password,
      apiCallerId
    })

    if (res.success) {
      const token = res.response as MODEL.TokenResponse
      localStorage.setItem('accessToken', token.accessToken)
      localStorage.setItem('refreshToken', token.refreshToken)
      return res
    } else {
      const confirmEmailError = res.detailErrorList?.find((error: any) => error.messageId === 'E00003')
      if (confirmEmailError) {
        throw { message: 'Your email is not confirmed.', redirect: '/confirm-email' }
      } else {
        throw new Error('Login failed. Please check your email and password.')
      }
    }
  } catch (error) {
    console.error('Login failed:', error)
    throw error
  }
}
export const loginWithGG = async (email: string) => {
  try {
    const apiCallerId = 'LoginGG'
    const res = await request.post<MODEL.IResponseBase>(`/Login/Google`, {
      email: email,
      password: '',
      apiCallerId
    })

    if (res.success) {
      const token = res.response as MODEL.TokenResponse
      localStorage.setItem('accessToken', token.accessToken)
      localStorage.setItem('refreshToken', token.refreshToken)
      return res
    } else {
      const confirmEmailError = res.detailErrorList?.find((error: any) => error.messageId === 'E00003')
      if (confirmEmailError) {
        throw { message: 'Your email is not confirmed.', redirect: '/confirm-email' }
      } else {
        throw new Error('Login failed. Please check your email and password.')
      }
    }
  } catch (error) {
    console.error('Login failed:', error)
    throw error
  }
}

export const updateAccount = async (
  userId: string,
  fullName: string,
  phoneNumber: string,
  address: string,
  gender: string,
  dateOfBirth: Date,
  imageUrl: string
) => {
  try {
    const apiCallerId = 'UpdateAccount'
    const res = await request.put<MODEL.IResponseBase>(`/Account/${userId}`, {
      apiCallerId,
      fullName,
      phoneNumber,
      gender,
      address,
      dateOfBirth,
      imageUrl
    })
    console.log('RES', res)
    if (res.success) {
      return res
    } else {
      throw new Error(res.message || 'Update account failed')
    }
  } catch (error: any) {
    if (error.response) {
      console.error('Response Error:', error.response.status, error.response.data)
    } else {
      console.error('Request Error:', error.message)
    }
  }
}

export const logout = (): void => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  window.location.href = ROUTES.LOGIN
}

export const forgotPassword = async (email: string) => {
  try {
    const res = await request.post<MODEL.ForgotPasswordResponse>(`/Password/ForgotPassword`, {
      email
    })
    if (res.success) {
      return res
    } else {
      throw new Error(res.message || 'Resend password failed')
    }
  } catch (error: any) {
    if (error.response) {
      console.error('Response Error:', error.response.status, error.response.data)
    } else {
      console.error('Request Error:', error.message)
    }
  }
}

export const paymentVNPAY = async (userId: string, membershipPlanId: string) => {
  const apiCallerId = 'Payment'
  return await request.post<MODEL.IResponseBase>(`/${apiCallerId}`, {
    userId: userId,
    membershipPlanId: membershipPlanId,
    apiCallerId
  })
}

export const userMembershipPlan = async (data: any) => {
  const apiCallerId = 'UserMembershipPlan'
  return await request.post<MODEL.IResponseBase>(`/${apiCallerId}`, data)
}

export const getMotherInfo = async (userId: string) => {
  return await request.get<MODEL.IResponseBase>(`/User/${userId}/MotherInfo`)
}

export const createMotherInfo = async (data: any) => {
  const apiCallerId = 'MotherInfo'
  return await request.post<MODEL.IResponseBase>(`/${apiCallerId}`, data)
}

export const updateMotherInfo = async (data: any) => {
  const apiCallerId = 'MotherInfo'
  return await request.put<MODEL.IResponseBase>(`/${apiCallerId}/${data.motherInfoId}`, {
    motherName: data.motherName,
    bloodType: data.bloodType,
    healhStatus: data.healhStatus,
    notes: data.notes,
    motherDateOfBirth: data.motherDateOfBirth
  })
}
export const getMemberInforWithPlanDetail = async (id: string) => {
  const res = await request.get<MODEL.IResponseBase>(`/Account/${id}`)
  return res
}
