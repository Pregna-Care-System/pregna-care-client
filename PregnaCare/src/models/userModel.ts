export interface User {
  id: string
  email: string
  password: string
  username?: string
  roles?: string[]
  createdAt?: string
  updatedAt?: string
}
