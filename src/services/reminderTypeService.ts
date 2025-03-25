import request from '@/utils/axiosClient'

export const getAllReminderType = async () => {
  try {
    const response = await request.get<MODEL.IResponseBase>('/ReminderType')
    return response.data
  } catch (error) {
    console.error('Error fetching reminders:', error)
    throw error
  }
}

export const deleteReminderType = async (id: string) => {
  try {
    await request.delete<MODEL.IResponseBase>(`ReminderType/${id}`)
  } catch (error) {
    console.error('Delete reminder type by id failed', error)
  }
}
export const updateReminderType = async (id: string, typeName: string, description: string) => {
  try {
    const apiCallerId = 'updateReminder'
    await request.put<MODEL.PlanResponse>(`/ReminderType/${id}`, {
      apiCallerId,
      typeName,
      description
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      console.error('Response Error:', error.response.status, error.response.data)
    } else {
      console.error('Request Error:', error.message)
    }
  }
}
export const createReminderType = async (typeName: string, description: string) => {
  try {
    const apiCallerId = 'createReminderType'
    await request.post<MODEL.IResponseBase>(`/ReminderType`, {
      apiCallerId,
      typeName,
      description
    })
  } catch (error) {
    console.log('Create failed', error)
    throw error
  }
}
