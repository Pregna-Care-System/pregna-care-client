import { MODEL } from '@/types/IModel'
import request from '@/utils/axiosClient'

export const getAllFeature = async () => {
  try {
    const res = await request.get<MODEL.FeatureResponse>('/Feature/GetAll')
    return res.data.response
  } catch (error) {
    console.log('Failed to get feature', error)
    throw error
  }
}