import request from '@/utils/axiosClient'

export const getAllFAQCategories = async () => {
  return await request.get<MODEL.FeatureResponse>('/FAQCategory')
}

export const getAllFAQ = async () => {
  return await request.get<MODEL.FeatureResponse>('/FAQ')
}

export const createFAQ = async (faqCategoryId: string, question: string, answer: string, displayOrder: string) => {
  try {
    const apiCallerId = 'createFAQ'
    await request.post<MODEL.IResponseBase>('/FAQ', {
      apiCallerId,
      createFAQEntity: {
        faqCategoryId,
        question,
        answer,
        displayOrder
      }
    })
  } catch (error) {
    throw error
  }
}

export const updateFAQ = async (
  faqId: string,
  faqCategoryId: string,
  question: string,
  answer: string,
  displayOrder: string
) => {
  try {
    const apiCallerId = 'updateFAQ'
    await request.put<MODEL.IResponseBase>(`/FAQ/${faqId}`, {
      apiCallerId,
      updateFAQEntity: {
        faqCategoryId,
        question,
        answer,
        displayOrder
      }
    })
  } catch (error) {
    throw error
  }
}

export const deleteFAQ = async (faqId: string) => {
  try {
    await request.delete<MODEL.IResponseBase>(`/FAQ/${faqId}`)
  } catch (error) {
    throw error
  }
}

export const createFAQCategory = async (name: string, description: string, displayOrder: number) => {
  try {
    const apiCallerId = 'createFAQCategory'
    await request.post<MODEL.IResponseBase>('/FAQCategory', {
      apiCallerId,
      createFAQCategoryEntity: {
        name,
        description,
        displayOrder
      }
    })
  } catch (error) {
    throw error
  }
}

export const updateFAQCategory = async (
  faqCategoryId: string,
  name: string,
  description: string,
  displayOrder: number
) => {
  try {
    const apiCallerId = 'updateFAQCategory'
    await request.put<MODEL.IResponseBase>(`/FAQCategory/${faqCategoryId}`, {
      apiCallerId,
      updateFAQCategoryEntity: {
        name,
        description,
        displayOrder
      }
    })
  } catch (error) {
    throw error
  }
}

export const deleteFAQCategory = async (faqCategoryId: string) => {
  try {
    await request.delete<MODEL.IResponseBase>(`/FAQCategory/${faqCategoryId}`)
  } catch (error) {
    throw error
  }
}
