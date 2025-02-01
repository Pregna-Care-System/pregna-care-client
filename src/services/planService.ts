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
