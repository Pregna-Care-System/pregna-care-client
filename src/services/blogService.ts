import request from '@/utils/axiosClient'

export const getAllTag = async () => {
  const res = await request.get<MODEL.IResponseBase>('/Tag')
  return res.data
}
export const getAllBlogByUserId = async (userId: string) => {
  const res = await request.get<MODEL.IResponseBase>(`/Blog/User/${userId}`)
  return res.data
}
export const getAllBlog = async (type: string) => {
  const res = await request.get<MODEL.IResponseBase>(`/Blog?type=${type}`)
  return res.data
}
export const getAllBlogAdmin = async (type: string) => {
  const res = await request.get<MODEL.IResponseBase>(`/Blog/Admin?type=${type}`)
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
    console.error('Error creating blog:', error)
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
  type: string,
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
      type,
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

export const postBlogView = async (blogId: string) => {
  try {
    const response = await request.post<MODEL.IResponseBase>(`/Blog/${blogId}/View`, {
      blogId
    })
    return response.data
  } catch (error) {
    console.error('Error posting blog view:', error)
    throw error
  }
}
//Update status blog
export const updateBlogStatus = async (id: string, status: string) => {
  try {
    await request.put<MODEL.IResponseBase>(`/Blog/${id}/Approve?status=${status}`)
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

export const updateComment = async (id: string, commentText: string) => {
  try {
    await request.put<MODEL.IResponseBase>(`/Comment/${id}`, {
      commentText
    })
    return true
  } catch (error) {
    console.error('Update comment failed', error)
    return false
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

export const deleteComment = async (id: string) => {
  try {
    await request.delete<MODEL.IResponseBase>(`/Comment/${id}`)
    return true
  } catch (error) {
    console.error('Delete comment by id failed', error)
    return false
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

export const updateReaction = async (id: string, type: string) => {
  try {
    await request.put<MODEL.IResponseBase>(`/Reaction/${id}`, {
      type
    })
    return true
  } catch (error) {
    console.error('Update reaction failed', error)
    return false
  }
}

export const getAllReactionByBlogId = async (blogId: string) => {
  try {
    const response = await request.get<MODEL.IResponseBase>(`/Blog/${blogId}/Reaction`)

    // Check if response has the expected structure
    if (response && response.data) {
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

// Add this function to delete a reaction
export const deleteReaction = async (blogId: string) => {
  try {
    const response = await request.delete<MODEL.IResponseBase>(`/Reaction/${blogId}`)
    return response.data
  } catch (error) {
    console.error('Delete reaction failed', error)
    return {
      success: false,
      message: 'Failed to delete reaction'
    }
  }
}
