import { addDays } from 'date-fns'

// Mock data for fetal growth
export const mockFetalGrowthData: IFetalGrowth.FetalGrowthData = {
  gestationalAge: 20,
  estimatedWeight: 1200,
  headCircumference: 26.5,
  abdominalCircumference: 23.8,
  femurLength: 5.2,
  dueDate: '2023-12-15',
  motherName: 'Alice Johnson',
  growthData: [
    {
      week: 20,
      weight: 300,
      standardWeight: 320,
      hc: 18,
      standardHC: 17.5,
      ac: 16,
      standardAC: 15.7,
      fl: 3,
      standardFL: 3.1
    },
    {
      week: 24,
      weight: 600,
      standardWeight: 630,
      hc: 22,
      standardHC: 21.8,
      ac: 20,
      standardAC: 19.8,
      fl: 4,
      standardFL: 4.2
    },
    {
      week: 28,
      weight: 1200,
      standardWeight: 1250,
      hc: 26.5,
      standardHC: 26.7,
      ac: 23.8,
      standardAC: 24.2,
      fl: 5.2,
      standardFL: 5.4
    }
  ]
}

// Mock data for fetal alerts
export const mockFetalAlerts: IFetalGrowth.FetalAlert[] = [
  {
    id: '36f2b65f-45c7-4bcb-8f78-1e41773592cc',
    fetalGrowthRecordId: 'd483023c-8ca1-4f89-8cf5-8557ba64bc3b',
    week: 40,
    alertDate: '2025-02-15T23:13:22.57',
    alertFor: 'Fetal',
    issue:
      'The provided measurement value (0.1 Kg) is significantly lower than the expected range for fetal weight at 40 weeks of pregnancy.',
    severity: 'Critical',
    recommendation:
      'Severity: HIGH\nExpected Range in Week 40: 2.5 - 3.5\nRecommendation: This significant deviation from the expected range warrants immediate medical attention.',
    isResolved: false
  },
  {
    id: '46f2b65f-45c7-4bcb-8f78-1e41773592cd',
    fetalGrowthRecordId: 'e483023c-8ca1-4f89-8cf5-8557ba64bc3c',
    week: 38,
    alertDate: '2025-02-14T23:13:22.57',
    alertFor: 'Fetal',
    issue: 'Slight deviation from expected fetal weight range detected.',
    severity: 'Warning',
    recommendation:
      'Severity: MEDIUM\nExpected Range in Week 38: 2.3 - 3.3\nRecommendation: Schedule a follow-up appointment for monitoring.',
    isResolved: true
  }
]

// Mock data for appointments
export const mockAppointments: IFetalGrowth.Appointment[] = [
  {
    id: 1,
    title: 'Khám tổng quát',
    date: new Date(),
    time: '09:00',
    doctor: 'Dr. Nguyen Van A',
    department: 'Khoa Nội',
    status: 'confirmed',
    patientName: 'Nguyen Van X',
    room: 'P.201'
  },
  {
    id: 2,
    title: 'Tái khám',
    date: addDays(new Date(), 2),
    time: '14:30',
    doctor: 'Dr. Tran Thi B',
    department: 'Khoa Tim mạch',
    status: 'pending',
    patientName: 'Tran Thi Y',
    room: 'P.305'
  },
  {
    id: 3,
    title: 'Khám định kỳ',
    date: addDays(new Date(), 5),
    time: '10:15',
    doctor: 'Dr. Le Van C',
    department: 'Khoa Nội tiết',
    status: 'confirmed',
    patientName: 'Le Van Z',
    room: 'P.103'
  }
]

// Mock data for weight estimation
export const mockWeightEstimation: IFetalGrowth.ChartDataPoint[] = [
  { x: '20', y: 300, min: 250, max: 350 },
  { x: '21', y: 320, min: 270, max: 370 },
  { x: '22', y: 340, min: 290, max: 390 }
]

// Mock data for chart weeks
export const chartWeeks = Array.from({ length: 33 }, (_, i) => i + 8)

// Mock data for amniotic fluid
export const mockAmnioticData = {
  data: chartWeeks.map((week) => ({
    x: week,
    y: 13 + Math.sin(week / 3) * 2
  })),
  min: chartWeeks.map(() => 8),
  max: chartWeeks.map(() => 18)
}

// Mock data for heart rate
export const mockHeartRateData = {
  data: chartWeeks.map((week) => ({
    x: week,
    y: Math.round(140 + Math.sin(week / 2) * 10)
  })),
  min: chartWeeks.map(() => 120),
  max: chartWeeks.map(() => 160)
}
