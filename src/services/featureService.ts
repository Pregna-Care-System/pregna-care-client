import request from '@/utils/axiosClient'

export const getAllFeature = async () => {
  return await request.get<MODEL.FeatureResponse>('/Feature/GetAll')
}
export const getAllFeatureByUserId = async (userId: string) => {
  return await request.get<MODEL.FeatureResponse>(`/Feature?userId=${userId}`)
}
