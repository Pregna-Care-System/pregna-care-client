declare namespace REDUX {
  export interface LoginActionPayload {
    email: string
    password: string
    navigate: (path: string) => void
  }
}
