import request from '@/utils/axiosClient'

export const getAllPlan = async () => {
  return await request.get<MODEL.PlanResponse>('/MembershipPlan/GetAllPlanWithFeature')
}
export const getMostUsedPlan = async () => {
  return await request.get<MODEL.PlanResponse>('/MembershipPlan/MostUsed')
}
export const getPlanByName = async (planName: string) => {
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
      return res.data
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
  imageUrl: string,
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
      imageUrl,
      featuredIds
    })
    const res = await request.put<MODEL.PlanResponse>(`/MembershipPlan/Update?id=${planId}`, {
      apiCallerId,
      planName,
      price,
      duration,
      description,
      imageUrl,
      featuredId: featuredIds
    })
    console.log('API Response', res.data)
    if (res.data.success) {
      return res
    }
  } catch (error: any) {
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
  imageUrl: string,
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
      imageUrl,
      featuredId: featuredIds
    })
    console.log('API Response', res.data)
    if (res.data.success) {
      return res
    }
  } catch (error) {
    console.log('Create failed', error)
    throw error
  }
}

export const upgradeFreePlan = async (userId: string) => {
  try {
    await request.put<MODEL.PlanResponse>(`/MembershipPlan/${userId}`)
  } catch (error: any) {
    if (error.response) {
      console.error('Response Error:', error.response.status, error.response.data)
    } else {
      console.error('Request Error:', error.message)
    }
  }
}
export const hasFreePlan = async (userId: string) => {
  const res = await request.get<MODEL.PlanResponse>(`/MembershipPlan/Has-free-plan/${userId}`)
  return res
}
