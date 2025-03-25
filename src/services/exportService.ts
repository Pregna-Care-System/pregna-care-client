import request from '@/utils/axiosClient'

export const getAdminReport = async () => {
  try {
    const response = await request.get('/Report', {
      responseType: 'blob',
      headers: {
        Accept: 'application/pdf'
      }
    })
    return response
  } catch (error) {
    console.error('Failed to fetch report.', error)
    throw error
  }
}
