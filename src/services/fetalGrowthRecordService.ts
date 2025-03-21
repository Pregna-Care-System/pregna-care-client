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

export const updateFetalGrowth = async (data: any) => {
  try {
    const res = await request.put<MODEL.PregnancyRecordResponse>('/FetalGrowthRecord', {
      apiCallerId: data.apiCallerId,
      fetalGrowthRecordId: data.fetalGrowthRecordId,
      name: data.name,
      unit: data.unit,
      description: data.description,
      week: data.week,
      value: data.value,
      note: data.note || ''
    })
    return res
  } catch (error: any) {
    if (error.response) {
      console.error('Response Error:', error.response.status, error.response.data)
    } else {
      console.error('Request Error:', error.message)
    }
    throw error
  }
}

export const getFetalGrowthRecords = async (pregnancyRecordId: string) => {
  const apiCallerId = 'PregnancyRecord'
  return request.get<MODEL.PregnancyRecordResponse[]>(`/${apiCallerId}/${pregnancyRecordId}/FetalGrowthRecord`)
}

export const getFetalGrowthAlert = async (pregnancyRecordId: string) => {
  return request.get(`/PregnancyRecord/${pregnancyRecordId}/GrowthAlert`)
}
