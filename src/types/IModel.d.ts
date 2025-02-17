declare namespace MODEL {
  export interface IResponseBase<P = any> {
    response: P
    messageId: string
    message: string
    success: boolean
    detailErrorList: DetailError[]
  }
  export interface TokenResponse {
    accessToken: string
    refreshToken: string
  }
  export interface LoginResponse {
    response: TokenResponse | null
    messageId: string
    message: string
    success: boolean
    detailErrorList: DetailError[] | null | null
  }
  export interface ForgotPasswordResponse {
    response: unknown | null
    messageId: string
    message: string
    success: boolean
    detailErrorList: DetailError[] | null | null
  }
  export interface DetailError {
    messageId: string
    message: string
    fieldName?: string
    value?: string
  }
  export interface LoginFormValues {
    email: string
    password: string
  }
  export interface RegisterResponse {
    response: unknown | null
    messageId: string
    message: string
    success: boolean
    detailErrorList: unknown | null
  }
  export interface RegisterFormValues {
    fullName: string
    email: string
    password: string
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

  export interface Event {
    title: string
    date: dayjs.Dayjs | null
    timeStart: dayjs.Dayjs | null
    timeEnd: dayjs.Dayjs | null
    description: string
  }

  export interface PlanResponse {
    response: [
      {
        planName: string
        price: number
        duration: number
        description: string
        createdAt: string
        imageUrl: string
        features: { featureName: string }[]
      }
    ]
    messageId: string
    message: string
    success: boolean
    detailErrorList: unknown | null
  }
  export interface PlanValues {
    planName: string
    price: number
    duration: number
    description: string
    imageUrl: string
    features: string[]
  }
  export interface FeatureResponse {
    response: [
      {
        name: string
        description: string
      }
    ]
    messageId: string
    message: string
    success: boolean
    detailErrorList: unknown | null
  }
  export interface PregnancyRecordResponse {
    response: [
      {
        motherName: string
        motherDateOfBirth: Date
        bloodType: string
        healhStatus: string
        notes: string
        babyName: string
        pregnancyStartDate: Date
        expectedDueDate: Date
        babyGender: string
        imageUrl: string
      }
    ]
    messageId: string
    message: string
    success: boolean
    detailErrorList: unknown | null
  }
  export interface MotherInformationResponse {
    response: [
      {
        motherName: string
        motherDateOfBirth: Date
        bloodType: string
        healhStatus: string
        notes: string
        createdAt: Date
        updatedAt: Date
      }
    ]
    messageId: string
    message: string
    success: boolean
    detailErrorList: unknown | null
  }
}
