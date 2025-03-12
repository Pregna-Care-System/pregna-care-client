import request from '@/utils/axiosClient'

export const createPregnancyRecord = async (
  motherInfoId: string,
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
      motherInfoId,
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

export const updatePregnancyRecord = async (data: any) => {
  const res = await request.put<MODEL.PregnancyRecordResponse>(`/PregnancyRecord/${data.pregnancyRecordId}`, {
    babyName: data.babyName,
    pregnancyStartDate: data.pregnancyStartDate,
    expectedDueDate: data.expectedDueDate,
    babyGender: data.babyGender
  })
  return res.data
}

export const getAllPregnancyRecord = async (userId: string) => {
  const res = await request.get<MODEL.PregnancyRecordResponse>(`/User/${userId}/PregnancyRecord`)
  return res.data
}

export const getPregnancyRecordById = async (pregnancyRecordId: string) => {
  const res = await request.get<MODEL.PregnancyRecordResponse>(`PregnancyRecord/${pregnancyRecordId}`)
  return res.data
}

export const fetalGrowthStats = async (pregnancyRecordId: string) => {
  const res = await request.get(`PregnancyRecord/${pregnancyRecordId}/FetalGrowthStats`)
  return res.data
}
