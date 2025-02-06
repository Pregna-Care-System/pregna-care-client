import * as request from '@/utils/axiosClient'

export const registerAccount = async (
  fullName: string,
  email: string,
  password: string
): Promise<MODEL.RegisterResponse> => {
  try {
    const roleName = 'Guest'
    const apiCallerId = 'Register'

    const res = await request.post<MODEL.RegisterResponse>('/Register', {
      apiCallerId,
      fullName,
      email,
      password,
      roleName
    })

    if (res.success) {
      return res
    } else {
      throw new Error(res.message || 'Registration failed')
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.data?.detailErrorList?.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const passwordError = error.response.data.detailErrorList.find((detail: any) => detail.fieldName === 'Password')
      if (passwordError) {
        throw new Error(passwordError.message)
      }
    }
    console.error('Registration failed:', error)
    throw new Error(error.message || 'Registration failed')
  }
}

export const login = async (email: string, password: string) => {
  try {
    const apiCallerId = 'Login'
    const res = await request.post<MODEL.LoginResponse>(`/Login`, {
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export const logout = (): void => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  window.location.reload()
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
  } catch (error) {
    if(error.response){
      console.error('Response Error:', error.response.status, error.response.data)
    }else{
      console.error('Request Error:', error.message)
    }
  }
}

// export const refreshToken = async (): Promise<string> => {
//   try {
//     const refreshToken = localStorage.getItem('refreshToken')
//     if (!refreshToken) {
//       throw new Error('No refresh token found')
//     }

//     const res = await request.post<{ accessToken: string }>(`/authentication/refresh`, {
//       refreshToken: refreshToken
//     })
//     return res.accessToken
//   } catch (error) {
//     console.error('Refresh token failed:', error)
//     localStorage.removeItem('accessToken')
//     localStorage.removeItem('refreshToken')
//     throw error
//   }
// }
