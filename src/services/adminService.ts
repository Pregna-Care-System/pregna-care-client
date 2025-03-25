import request from '@/utils/axiosClient'

export const createGrowthMetric = async (data: any) => {
  const apiCallerId = 'GrowthMetric'
  return await request.post<MODEL.IResponseBase>(`${apiCallerId}`, { ...data, apiCallerId })
}

export const getAllGrowthMetrics = async () => {
  const apiCallerId = 'GrowthMetric'
  return await request.get<MODEL.IResponseBase>(`${apiCallerId}`)
}

export const getAllGrowthMetricsOfWeek = async (week: number) => {
  const apiCallerId = 'GrowthMetric'
  return await request.get<MODEL.IResponseBase>(`${apiCallerId}?week=${week}`)
}

export const getAllMember = async (filterType?: string, name?: string) => {
  const params: Record<string, string> = {}

  if (filterType) params.filterType = filterType
  if (name) params.name = name

  const res = await request.get<MODEL.IResponseBase>('/Account', { params })
  return res
}

export const getAllUserMembershipPlan = async () => {
  const res = await request.get<MODEL.IResponseBase>('/UserMembershipPlan')
  return res
}

//Feature
export const createFeature = async (data: any) => {
  return await request.post<MODEL.IResponseBase>(`/Feature/Create`, data)
}

export const deleteFeature = async (featureId: string) => {
  return await request.delete<MODEL.IResponseBase>(`/Feature/Delete?id=${featureId}`)
}

export const getFeatureById = async (featureId: string) => {
  return await request.get<MODEL.IResponseBase>(`/Feature/GetById?id=${featureId}`)
}

export const updateFeature = async (data: any, id: string) => {
  return await request.put<MODEL.IResponseBase>(`/Feature/Update?id=${id}`, data)
}

//FAQ
