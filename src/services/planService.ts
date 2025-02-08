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
export const getPlanByName = async (planName:string) => {
  try {
    const res = await request.get<MODEL.PlanResponse>(`/MembershipPlan/GetPlanByName?name=${planName}`)
    if (res.data.success) {
      return res.data.response
    }
  } catch (error) {
    console.error('Get plan by name failed', error)
  }
}
export const getPlanById = async (planId: string) => {
  try {
    const res = await request.get<MODEL.PlanResponse>(`/MembershipPlan/GetById?id=${planId}`)
    if (res.data.success) {
      return res.data.response
    }
  } catch (error) {
    console.error('Get plan by id failed', error)
  }
}
export const deletePlan = async (planId: string) => {
  try {
    const res = await request.delete<MODEL.PlanResponse>(`/MembershipPlan/Delete?id=${planId}`)
    if (res.data.success) {
      return res.data.response
    }
  } catch (error) {
    console.error('Delete plan by id failed', error)
  }
}
export const updatePlan = async (
  planId: string,
  planName: string,
  price: number,
  duration: number,
  description: string,
  featuredIds: string[]
) => {
  try {
    const apiCallerId = 'updatePlan'
    console.log('Send request', {
      planId,
      planName,
      price,
      duration,
      description,
      featuredIds
    })
    const res = await request.put<MODEL.PlanResponse>(`/MembershipPlan/Update?id=${planId}`, {
      apiCallerId,
      planName,
      price,
      duration,
      description,
      featuredId: featuredIds
    })
    console.log('API Response', res.data)
    if (res.data.success) {
      return res
    }
  } catch (error) {
    if (error.response) {
      console.error('Response Error:', error.response.status, error.response.data)
    } else {
      console.error('Request Error:', error.message)
    }
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
