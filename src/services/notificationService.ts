import request from '@/utils/axiosClient'

export const getAllNotificationByUserId = async (userId: string) => {
  const res = await request.get<MODEL.IResponseBase>(`/Notification/${userId}`)
  return res.data
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
  await request.put<MODEL.IResponseBase>('/Notification/all', ids)
  return true
}
