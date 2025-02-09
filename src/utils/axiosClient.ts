import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios'

// Create an Axios instance
const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const get = async <T>(path: string, options: AxiosRequestConfig = {}): Promise<T> => {
  const response: AxiosResponse<T> = await request.get<T>(path, options)
  return response.data
}

export const post = async <T>(path: string, data: unknown, options: AxiosRequestConfig = {}): Promise<T> => {
  const response: AxiosResponse<T> = await request.post<T>(path, data, options)
  return response.data
}

// // Request interceptor to attach the access token
// request.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     const token = localStorage.getItem('accessToken')
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => Promise.reject(error)
// )

// request.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   async (error) => {
//     if (error.response?.status === 401 && !error.config._retry) {
//       error.config._retry = true
//       try {
//         const newAccessToken = await refreshToken() // Refresh the token
//         if (newAccessToken) {
//           localStorage.setItem('accessToken', newAccessToken) // Save the new token
//           error.config.headers['Authorization'] = `Bearer ${newAccessToken}`
//           return axios.request(error.config) // Retry the original request
//         }
//       } catch (refreshError) {
//         console.error('Token refresh failed:', refreshError)
//         localStorage.removeItem('accessToken')
//         localStorage.removeItem('refreshToken')
//         window.location.href = '/login'
//       }
//     }
//     return Promise.reject(error)
//   }
// )

export default request
