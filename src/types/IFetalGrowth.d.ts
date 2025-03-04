// Common types used across the application
declare namespace IFetalGrowth {
  export interface GrowthData {
    week: number
    weight: number
    standardWeight: number
    hc: number
    standardHC: number
    ac: number
    standardAC: number
    fl: number
    standardFL: number
    [key: string]: number
  }

  export interface FetalGrowthData {
    gestationalAge: number
    estimatedWeight: number
    headCircumference: number
    abdominalCircumference: number
    femurLength: number
    dueDate: string
    motherName: string
    growthData: GrowthData[]
  }

  export interface FetalAlert {
    id: string
    fetalGrowthRecordId: string
    week: number
    alertDate: string
    alertFor: string
    issue: string
    severity: string
    recommendation: string
    isResolved: boolean
  }

  export interface PregnancyInfo {
    babyName: string
    gestationalAgeResponse: {
      weeks: number
      days: number
      estimatedDueDate?: string
    }
    [key: string]: any
  }

  export interface Appointment {
    id: number
    title: string
    date: Date
    time: string
    doctor: string
    department: string
    status: 'confirmed' | 'pending' | 'cancelled'
    patientName: string
    room: string
  }

  export interface ChartDataPoint {
    x: string | number
    y: number
    min?: number
    max?: number
  }
}
