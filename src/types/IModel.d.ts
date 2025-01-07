declare namespace MODEL {
  export interface LoginResponse {
    accessToken: string
    refreshToken: string
    user: {
      id: string
      email: string
      username: string
    }
  }

  export interface RegisterResponse {
    user: {
      id: string
      email: string
      username: string
    }
    message: string
  }

  export interface VerifyEmailResponse {
    message: string
  }

  export interface User {
    id: string
    email: string
    password: string
    username?: string
    roles?: string[]
    createdAt?: string
    updatedAt?: string
  }
}
