import request from '@/utils/axiosClient'

export const getAllContact = async () => {
  return await request.get<MODEL.FeatureResponse>('/Contact')
}

export const createContact = async (fullName: string, email: string, message: string) => {
  try {
    const apiCallerId = 'create Contact'
    await request.post<MODEL.IResponseBase>('/Contact', {
        apiCallerId,
        fullName,
        email,
        message
    })
  } catch (error) {
    console.log('Create failed', error)
    throw error
  }
}

export const deleteContact = async (email: string) => {
  try {
    await request.delete<MODEL.IResponseBase>(`/Contact?email=${email}`)
  } catch (error) {
    console.log('Delete failed', error)
    throw error
  }
}