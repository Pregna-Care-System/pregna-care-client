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
  parentCommentId: string | null = ''
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

// Function to update or add a reaction to a post
export const createPostReaction = async (userId: string, blogId: string, reactionType: string, commentId?: string) => {
  try {
    // Match exactly the format used in createReaction function
    const apiCallerId = 'createPostReaction'

    // Ensure all parameters are in the format expected by the API
    if (!userId || !blogId) {
      throw new Error('Missing required parameters: userId or blogId')
    }

    // Ensure type is treated as a string since that's what the API seems to expect
    const type = reactionType.toString()

    // Use the same exact structure as createReaction to ensure consistency
    const response = await request.post<MODEL.IResponseBase>('/Reaction', {
      apiCallerId,
      userId,
      blogId,
      commentId: commentId || null, // Empty string for post reactions
      type
    })

    if (!response.data.success) {
      console.error('Reaction API returned failure:', response.data)
      throw new Error(response.data.message || 'Failed to create reaction')
    }

    return response.data
  } catch (error) {
    console.error('Error updating post reaction:', error)
    throw error
  }
}

export const getAllReactionByBlogId = async (blogId: string) => {
  try {
    console.log(`Calling API to get reactions for blog ID: ${blogId}`)
    const response = await request.get<MODEL.IResponseBase>(`/Blog/${blogId}/Reaction`)

    console.log('Raw reaction API response:', response)

    // Check if response has the expected structure
    if (response && response.data) {
      console.log('Reaction data structure:', {
        success: response.data.success,
        hasResponse: !!response.data.response,
        responseType: typeof response.data.response,
        isArray: Array.isArray(response.data.response)
      })

      // If response is successful but empty, return an appropriate response
      if (response.data.success && !response.data.response) {
        return {
          success: true,
          response: []
        }
      }
    }

    return response.data
  } catch (error) {
    console.error('Error fetching reactions by blog ID:', error)
    // Return a valid error response
    return {
      success: false,
      message: 'Failed to fetch reactions',
      response: []
    }
  }
}

export const deleteReaction = async (id: string) => {
  try {
    await request.delete<MODEL.IResponseBase>(`/Reaction/${id}`)
    return true
  } catch (error) {
    console.error('Delete reaction by id failed', error)
    return false
  }
}
