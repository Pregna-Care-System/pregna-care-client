declare namespace REDUX {
  export interface LoginActionPayload {
    email: string
    password: string
    route: string
    navigate: (path: string) => void
  }
}
