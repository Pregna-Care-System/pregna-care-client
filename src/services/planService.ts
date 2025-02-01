import { MODEL } from '@/types/IModel'
import request from '@/utils/axiosClient'

export const getAllPlan = async () => {
  try {
    const res = await request.get<MODEL.PlanResponse>('/MembershipPlan/GetAllPlanWithFeature')

    if (res.data.success && Array.isArray(res.data.response)) {
      return res.data.response
    } else {
      return []
    }
  } catch (error) {
    console.error('Get All plan failed', error)
    return []
  }
}

export const createPlan = async (
  planName: string,
  price: number,
  duration: number,
  description: string,
  featuredIds: string[]
) => {
  try {
    const apiCallerId = 'createPlan'
    const res = await request.post<MODEL.PlanResponse>('/MembershipPlan/Create', {
      apiCallerId,
      planName,
      price,
      duration,
      description,
      featuredId: featuredIds
    })
    return res
  } catch (error) {
    console.log('Create failed', error)
    throw error
  }
}
