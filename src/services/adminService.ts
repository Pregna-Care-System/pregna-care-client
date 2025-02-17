import request from '@/utils/axiosClient'

export const createGrowthMetric = async (data: any) => {
  const apiCallerId = 'GrowthMetric'
  return await request.post<MODEL.IResponseBase>(`${apiCallerId}`, { ...data, apiCallerId })
}

export const getAllGrowthMetrics = async () => {
  const apiCallerId = 'GrowthMetric'
  return await request.get<MODEL.IResponseBase>(`${apiCallerId}`)
}
export const getAllMember = async () => {
  const res = await request.get<MODEL.IResponseBase>('/Account')
  return res
}
export const getAllUserMembershipPlan = async () => {
  const res = await request.get<MODEL.IResponseBase>('/UserMembershipPlan')
  return res
}
