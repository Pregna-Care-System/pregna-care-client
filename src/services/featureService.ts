import request from '@/utils/axiosClient'

export const getAllFeature = async () => {
  return await request.get<MODEL.FeatureResponse>('/Feature/GetAll')
}
