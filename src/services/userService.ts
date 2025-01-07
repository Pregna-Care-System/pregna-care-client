import * as request from '@/utils/axiosClient'

export const login = async (email: string, password: string): Promise<MODEL.LoginResponse> => {
  try {
    const res = await request.post<MODEL.LoginResponse>(`/authentication`, {
      username: email,
      password: password
    })
    return res
  } catch (error) {
    console.error('Login failed:', error)
    throw error
  }
}

export const logout = (): void => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}

export const register = async (userName: string, email: string, password: string): Promise<MODEL.RegisterResponse> => {
  try {
    const res = await request.post<MODEL.RegisterResponse>(`/account/signup`, {
      username: userName,
      email: email,
      password: password
    })
    return res
  } catch (error) {
    console.error('Registration failed:', error)
    throw error
  }
}

export const verifyEmail = async (token: string): Promise<MODEL.VerifyEmailResponse> => {
  try {
    const res = await request.get<MODEL.VerifyEmailResponse>(`/account/verify`, {
      params: { token }
    })
    return res
  } catch (error) {
    console.error('Email verification failed:', error)
    throw error
  }
}

export const refreshToken = async (): Promise<string> => {
  try {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      throw new Error('No refresh token found')
    }

    const res = await request.post<{ accessToken: string }>(`/authentication/refresh`, {
      refreshToken: refreshToken
    })
    return res.accessToken
  } catch (error) {
    console.error('Refresh token failed:', error)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    throw error
  }
}
