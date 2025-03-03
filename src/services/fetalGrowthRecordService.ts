import request from '@/utils/axiosClient'

export const createFetalGrowth = async (data: any) => {
  try {
    const apiCallerId = 'createFetalGrowth'
    const res = await request.post<MODEL.PregnancyRecordResponse>('/FetalGrowthRecord', {
      ...data,
      apiCallerId
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

export const getFetalGrowthRecords = async (pregnancyRecordId: string) => {
  const apiCallerId = 'PregnancyRecord'
  return request.get<MODEL.PregnancyRecordResponse[]>(`/${apiCallerId}/${pregnancyRecordId}/FetalGrowthRecord`)
}
