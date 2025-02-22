import request from '@/utils/axiosClient'

export const createFetalGrowth = async (
  userId: string,
  pregnancyRecordId: string,
  name: string,
  unit: string,
  description: string,
  week: number,
  value: number,
  note: string
) => {
  try {
    const apiCallerId = 'createFetalGrowth'
    const res = await request.post<MODEL.PregnancyRecordResponse>('/FetalGrowthRecord', {
      apiCallerId,
      userId,
      pregnancyRecordId,
      name,
      unit,
      description,
      week,
      value,
      note
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
