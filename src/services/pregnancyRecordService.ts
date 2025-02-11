import request from '@/utils/axiosClient'

export const createPregnancyRecord = async (
  userId: string,
  motherName: string,
  motherDateOfBirth: Date,
  bloodType: string,
  healhStatus: string,
  notes: string,
  babyName: string,
  pregnancyStartDate: Date,
  expectedDueDate: Date,
  babyGender: string,
  imageUrl: string
) => {
  try {
    const apiCallerId = 'createPregnancy'
    const res = await request.post<MODEL.PregnancyRecordResponse>('/PregnancyRecord', {
      apiCallerId,
      userId,
      motherName,
      motherDateOfBirth,
      bloodType,
      healhStatus,
      notes,
      babyName,
      pregnancyStartDate,
      expectedDueDate,
      babyGender,
      imageUrl
    })
    return res
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      console.error('Response Error:', error.response.status, error.response.data)
    } else {
      console.error('Request Error:', error.message)
    }
  }
}
export const getAllPregnancyRecord = async (userId: string) => {
  const rest = await request.get<MODEL.PregnancyRecordResponse>(`/User/${userId}/PregnancyRecord`)
  return rest.data
}