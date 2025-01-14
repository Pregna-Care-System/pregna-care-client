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
    console.error('Registration failed:', error)
    throw new Error(error.message || 'Registration failed')
  }
}

// export const login = async (email: string, password: string): Promise<MODEL.LoginResponse> => {
//   try {
//     const res = await request.post<MODEL.LoginResponse>(`/authentication`, {
//       username: email,
//       password: password
//     })
//     return res
//   } catch (error) {
//     console.error('Login failed:', error)
//     throw error
//   }
// }

// export const logout = (): void => {
//   localStorage.removeItem('accessToken')
//   localStorage.removeItem('refreshToken')
// }

// export const verifyEmail = async (token: string): Promise<MODEL.VerifyEmailResponse> => {
//   try {
//     const res = await request.get<MODEL.VerifyEmailResponse>(`/register`, {
//       params: { token }
//     })
//     return res
//   } catch (error) {
//     console.error('Email verification failed:', error)
//     throw error
//   }
// }

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
