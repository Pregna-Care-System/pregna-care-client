import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { refreshToken } from '~/services/userService'

const request = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL
})

// Add the access token to headers
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error) => {
    if (error.response) {
      try {
        const newAccessToken = await refreshToken()
        if (newAccessToken) {
          // Retry the original request with the new token
          error.config.headers['Authorization'] = `Bearer ${newAccessToken}`
          return axios.request(error.config)
        }
      } catch {
        // Remove tokens and redirect to login on failure
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const get = async <T>(path: string, options: AxiosRequestConfig = {}): Promise<T> => {
  const response = await request.get<T>(path, options)
  return response.data
}

export const post = async <T>(path: string, data: unknown, options: AxiosRequestConfig = {}): Promise<T> => {
  const response = await request.post<T>(path, data, options)
  return response.data
}

export default request
