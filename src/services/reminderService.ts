import request from '@/utils/axiosClient'

export const getAllReminder = async () => {
  try {
    const response = await request.get<MODEL.IResponseBase>('/Reminder')
    console.log('Response from API:', response.data.response)
    return response.data
  } catch (error) {
    console.error('Error fetching reminders:', error)
    throw error
  }
}

export const deleteReminder = async (id: string) => {
  try {
    await request.delete<MODEL.IResponseBase>(`Reminder/${id}`)
  } catch (error) {
    console.error('Delete reminder by id failed', error)
  }
}
export const updateReminder = async (
  id: string,
  reminderTypeId: string,
  title: string,
  description: string,
  reminderDate: Date,
  startTime: string,
  endTime: string,
  status: string
) => {
  try {
    const apiCallerId = 'updateReminder'
    await request.put<MODEL.PlanResponse>(`/Reminder/${id}`, {
      apiCallerId,
      reminderTypeId,
      title,
      description,
      reminderDate,
      startTime,
      endTime,
      status
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
export const createReminder = async (
  reminderTypeId: string,
  title: string,
  description: string,
  reminderDate: Date,
  startTime: string,
  endTime: string,
  status: string
) => {
  try {
    const apiCallerId = 'createReminder'
    await request.post<MODEL.IResponseBase>('/Reminder', {
      apiCallerId,
      reminderTypeId,
      title,
      description,
      reminderDate,
      startTime,
      endTime,
      status
    })
  } catch (error) {
    console.log('Create failed', error)
    throw error
  }
}
export const getAllReminderType = async () => {
  try {
    const response = await request.get<MODEL.IResponseBase>('/ReminderType')
    return response.data
  } catch (error) {
    console.error('Error fetching reminders:', error)
    throw error
  }
}