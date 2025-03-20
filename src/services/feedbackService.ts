import request from '@/utils/axiosClient'

export const getAllFeedBack = async () => {
  const res = await request.get('/FeedBack')
  return res
}

export const createFeedBack = async (userId: string, content: string, rating: number) => {
  try {
    await request.post<MODEL.IResponseBase>(`/FeedBack/${userId}`, {
      content,
      rating
    })
  } catch (error) {
    console.log('Create failed', error)
    throw error
  }
}
export const deleteFeedBack = async (id: string) => {
  try {
    await request.delete<MODEL.IResponseBase>(`/FeedBack/${id}`)
    return true
  } catch (error) {
    console.error('Delete feedback by id failed', error)
    return false
  }
}

export const getFeedBackById = async (id: string) => {
  try {
    const response = await request.get(`/FeedBack/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching feedback by ID:', error)
    throw error
  }
}
