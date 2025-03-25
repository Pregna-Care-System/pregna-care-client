import request from '@/utils/axiosClient'

export const getAllBabyProduct = async () => {
  try {
    const response = await request.get<MODEL.IResponseBase>('/Shopping/baby-products')
    return response.data
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}
export const getAllMilkProduct = async () => {
  try {
    const response = await request.get<MODEL.IResponseBase>('/Shopping/milk-products')
    return response.data
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}