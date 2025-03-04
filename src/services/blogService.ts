import request from '@/utils/axiosClient'

export const getAllTag = async () => {
  const res = await request.get<MODEL.IResponseBase>('/Tag')
  return res.data
}
export const getAllBlogByUserId = async (userId: string) => {
  const res = await request.get<MODEL.IResponseBase>(`/Blog/User/${userId}`)
  return res.data
}
export const createBlog = async (
  userId: string,
  tagIds: [],
  pageTitle: string,
  heading: string,
  content: string,
  shortDescription: string,
  featuredImageUrl: string,
  isVisible: boolean
) => {
  try {
    const apiCallerId = 'createBlog'
    await request.post<MODEL.IResponseBase>('/Blog', {
      apiCallerId,
      userId,
      tagIds,
      pageTitle,
      heading,
      content,
      shortDescription,
      featuredImageUrl,
      isVisible
    })
  } catch (error) {
    console.log('Create failed', error)
    throw error
  }
}
export const deleteNotification = async (id: string) => {
  try {
    await request.delete<MODEL.IResponseBase>(`/Notification?id=${id}`)
    return true
  } catch (error) {
    console.error('Delete notification by id failed', error)
    return false
  }
}
export const updateNotification = async (id: string) => {
  try {
    await request.put<MODEL.IResponseBase>(`/Notification?id=${id}`)
    return true
  } catch (error: any) {
    if (error.response) {
      console.error('Response Error:', error.response.status, error.response.data)
    } else {
      console.error('Request Error:', error.message)
    }
    return false
  }
}
export const updateAllIsRead = async (ids: string[]) => {
  console.log('IDS', ids)
  await request.put<MODEL.IResponseBase>('/Notification/all', ids)
  return true
}
