import request from '@/utils/axiosClient'

export const getAllTag = async () => {
  const res = await request.get<MODEL.IResponseBase>('/Tag')
  return res.data
}
export const getAllBlogByUserId = async (userId: string) => {
  const res = await request.get<MODEL.IResponseBase>(`/Blog/User/${userId}`)
  return res.data
}
export const getAllBlog = async () => {
  const res = await request.get<MODEL.IResponseBase>(`/Blog`)
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
  isVisible: boolean,
  type?: string,
  status?: string,
  sharedChartData?: string
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
      isVisible,
      type,
      status,
      sharedChartData
    })
  } catch (error) {
    console.log('Create failed', error)
    throw error
  }
}
export const deleteBlog = async (id: string) => {
  try {
    await request.delete<MODEL.IResponseBase>(`/Blog/${id}`)
    return true
  } catch (error) {
    console.error('Delete blog by id failed', error)
    return false
  }
}
export const updateBlog = async (
  id: string,
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
    const apiCallerId = 'updateBlog'
    await request.put<MODEL.IResponseBase>(`/Blog/${id}`, {
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

export const getBlogById = async (id: string) => {
  try {
    const response = await request.get(`/Blog/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching blog by ID:', error)
    throw error
  }
}

// Function to create a comment
export const createComment = async (
  apiCallerId: string,
  blogId: string,
  userId: string,
  commentText: string,
  parentCommentId: string = ''
) => {
  try {
    const response = await request.post<MODEL.IResponseBase>('/Comment', {
      apiCallerId,
      blogId,
      userId,
      parentCommentId,
      commentText
    })
    return response.data
  } catch (error) {
    console.error('Error creating comment:', error)
    throw error
  }
}

export const getAllCommentByBlogId = async (blogId: string) => {
  try {
    const response = await request.get<MODEL.IResponseBase>(`/Comment/Blog/${blogId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching comment by blog ID:', error)
  }
}
