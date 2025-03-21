import ROUTES from '@/utils/config/routes'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectBlogInfo, selectUserInfo, selectTagInfo } from '@/store/modules/global/selector'
import { Tabs, message, Tooltip, Modal, Popconfirm, Dropdown, Menu } from 'antd'
import { FaRegComment, FaShare, FaEdit, FaTrash } from 'react-icons/fa'
import { MdMoreHoriz, MdEdit, MdDelete, MdClose, MdMoreVert } from 'react-icons/md'
import { AiOutlineLike, AiFillLike } from 'react-icons/ai'
import { FaRegLaughBeam, FaRegSadTear, FaRegAngry, FaHeart, FaRegSurprise, FaRegHeart } from 'react-icons/fa'
import PostCreationModal from '@/components/PostCreationModal'
import {
  getAllReactionByBlogId,
  createPostReaction,
  postBlogView,
  deleteReaction,
  getAllCommentByBlogId,
  createComment,
  updateComment,
  deleteComment
} from '@/services/blogService'

const { TabPane } = Tabs

interface BlogPost {
  id: string
  pageTitle?: string
  content?: string
  shortDescription?: string
  type?: string
  userId: string
  fullName: string
  userAvatarUrl?: string
  timeAgo: string
  location?: string
  images?: string[]
  likes?: number
  comments?: number
  hashtags?: string[]
  sharedChartData?: string
  tags?: Tag[]
  blogTags?: { tag: Tag }[]
  userReaction?: string
  reactions?: {
    type: string
    count: number
  }[]
  reactionsCount?: number
}

interface Tag {
  id: string
  name: string
  color?: string
}

const CommunityPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [currentEditPost, setCurrentEditPost] = useState<BlogPost | null>(null)
  const [isReactionModalVisible, setIsReactionModalVisible] = useState(false)
  const [currentReactionPost, setCurrentReactionPost] = useState<BlogPost | null>(null)
  const [modalReactions, setModalReactions] = useState<any[]>([])
  const [loadingModalReactions, setLoadingModalReactions] = useState(false)

  const dispatch = useDispatch()
  const blogPosts = useSelector(selectBlogInfo) || []
  const currentUser = useSelector(selectUserInfo)
  const tags = useSelector(selectTagInfo) || ([] as Tag[])

  useEffect(() => {
    dispatch({ type: 'GET_ALL_BLOGS' })
    dispatch({ type: 'GET_ALL_TAGS' })
    setLoading(false)
  }, [dispatch])

  // Filter blog posts to get only chart posts with empty status and regular posts
  const discussionPosts = blogPosts.filter((post: BlogPost) => !post.type || post.type !== 'blog')
  const myPosts = blogPosts.filter((post: BlogPost) => post.userId === currentUser?.id)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const handleCreatePost = async (postData: {
    content: string
    images: string | string[] // Update type to handle both string and array
    tagIds: string[]
    type?: string
    chartData?: any
  }) => {
    try {
      setSubmitting(true)

      // Extract hashtags from content (from text without HTML)
      const textContent = postData.content.replace(/<[^>]*>/g, '').trim()
      const hashtagRegex = /#[a-zA-Z0-9_]+/g
      const hashtags = textContent.match(hashtagRegex) || []

      // Fix the featuredImageUrl format issue
      let featuredImageUrl = ''

      // If images is a string, use it directly
      if (typeof postData.images === 'string') {
        featuredImageUrl = postData.images.trim()
      }
      // If images is an array, use the first image
      else if (Array.isArray(postData.images) && postData.images.length > 0) {
        featuredImageUrl = postData.images[0]
      }

      // Create blog post through Redux action
      dispatch({
        type: 'CREATE_BLOG',
        payload: {
          type: 'community',
          content: postData.content, // Contains inline images from Froala
          userId: currentUser.id,
          hashtags: hashtags.map((tag) => tag.substring(1)), // Remove # from hashtags
          featuredImageUrl: featuredImageUrl, // Use properly formatted featuredImageUrl
          tagIds: postData.tagIds
        },
        callback: (success: boolean, msg?: string) => {
          if (success) {
            message.success('Đăng bài viết thành công')
            setIsModalVisible(false)
            // Refresh posts
            dispatch({ type: 'GET_ALL_BLOGS' })
          } else {
            message.error(msg || 'Đăng bài viết thất bại')
          }
          setSubmitting(false)
        }
      })
    } catch (error) {
      console.error('Error creating post:', error)
      message.error('Đã xảy ra lỗi khi đăng bài viết')
      setSubmitting(false)
    }
  }

  // Format content with hashtags highlighted
  const formatContent = (content: string) => {
    if (!content) return ''

    // If content contains HTML, render it safely
    if (content.includes('<')) {
      return <div dangerouslySetInnerHTML={{ __html: content }} />
    }

    // Otherwise, handle hashtags as before
    const parts = content.split(/(#[a-zA-Z0-9_]+)/g)

    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        return (
          <span key={index} className='text-blue-500 hover:underline cursor-pointer'>
            {part}
          </span>
        )
      }
      return part
    })
  }

  // Navigate to post detail page when clicking on comment or view more
  const navigateToPostDetail = async (postId: string) => {
    try {
      // Call the postBlogView API when navigating to post details
      await postBlogView(postId)
      // Navigate to the post detail page
      navigate(`${ROUTES.COMMUNITY}/${postId}`)
    } catch (error) {
      console.error('Error recording post view:', error)
      // Still navigate even if view recording fails
      navigate(`${ROUTES.COMMUNITY}/${postId}`)
    }
  }

  // Handle edit post submission
  const handleEditPost = async (postData: {
    content: string
    images: string[]
    tagIds: string[]
    type?: string
    chartData?: any
  }): Promise<boolean> => {
    if (!currentEditPost) return false

    try {
      setSubmitting(true)

      // Extract hashtags from content (from text without HTML)
      const textContent = postData.content.replace(/<[^>]*>/g, '').trim()
      const hashtagRegex = /#[a-zA-Z0-9_]+/g
      const hashtags = textContent.match(hashtagRegex) || []
      // Use Promise to handle the async operation
      return new Promise((resolve) => {
        // Create the payload using the original post data and updating only what changed
        dispatch({
          type: 'UPDATE_BLOG',
          payload: {
            id: currentEditPost.id,
            type: currentEditPost.type || 'community',
            content: postData.content,
            userId: currentUser.id,
            hashtags: hashtags.map((tag) => tag.substring(1)),
            featuredImageUrl: postData.images,
            tagIds: postData.tagIds,
            pageTitle: currentEditPost.pageTitle || '',
            heading: currentEditPost.pageTitle || '',
            shortDescription: currentEditPost.shortDescription || '',
            isVisible: true
          },
          callback: (success: boolean, msg?: string) => {
            setSubmitting(false)

            if (success) {
              message.success('Post updated successfully')
              setIsEditModalVisible(false)
              setCurrentEditPost(null)
              dispatch({ type: 'GET_ALL_BLOGS' })
              resolve(true)
            } else {
              message.error(msg || 'Failed to update post')
              resolve(false)
            }
          }
        })
      })
    } catch (error) {
      console.error('Error updating post:', error)
      message.error('An error occurred while updating the post')
      setSubmitting(false)
      return false
    }
  }

  // Map reaction type number to reaction name
  const getReactionTypeFromNumber = (type: string) => {
    const numberToReaction: Record<string, string> = {
      '1': 'Like',
      '2': 'Love',
      '3': 'Haha',
      '4': 'Wow',
      '5': 'Sad',
      '6': 'Angry'
    }
    return numberToReaction[type]
  }

  // Reaction configuration
  const reactions = [
    { name: 'Like', icon: <AiFillLike size={20} className='text-blue-500' />, color: 'text-blue-500' },
    { name: 'Love', icon: <FaHeart size={20} className='text-red-500' />, color: 'text-red-500' },
    { name: 'Haha', icon: <FaRegLaughBeam size={20} className='text-yellow-500' />, color: 'text-yellow-500' },
    { name: 'Wow', icon: <FaRegSurprise size={20} className='text-yellow-500' />, color: 'text-yellow-500' },
    { name: 'Sad', icon: <FaRegSadTear size={20} className='text-yellow-500' />, color: 'text-yellow-500' },
    { name: 'Angry', icon: <FaRegAngry size={20} className='text-orange-500' />, color: 'text-orange-500' }
  ]

  // Add these state variables
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [dropdownVisibleFor, setDropdownVisibleFor] = useState<string | null>(null)

  // Updated post card component with reaction feature
  const PostCard = ({ post }: { post: BlogPost }) => {
    // Extract tags from either tags or blogTags property
    const displayTags = post.tags || post.blogTags?.map((bt) => bt.tag) || []
    const [showAllTags, setShowAllTags] = useState(false)
    // State for post reactions
    const [postReactions, setPostReactions] = useState<any[]>([])
    const [totalReactions, setTotalReactions] = useState(post.reactionsCount || post.likes || 0)
    const [loadingReactions, setLoadingReactions] = useState(false)
    const [selectedReaction, setSelectedReaction] = useState<string>(post.userReaction || '')

    // Add state for post menu
    const [showPostMenu, setShowPostMenu] = useState(false)
    const postMenuRef = useRef<HTMLDivElement>(null)

    // Add these state variables to the PostCard component:
    const [isCommentModalVisible, setIsCommentModalVisible] = useState(false)
    const [postComments, setPostComments] = useState<any[]>([])
    const [loadingComments, setLoadingComments] = useState(false)
    const [commentText, setCommentText] = useState('')
    const [submittingComment, setSubmittingComment] = useState(false)
    const commentInputRef = useRef<HTMLInputElement>(null)

    // Thêm state này vào PostCard component
    const [popconfirmVisible, setPopconfirmVisible] = useState(false)

    // Get user's reaction if exists
    useEffect(() => {
      if (currentUser && postReactions.length > 0) {
        // Check if userId format matches
        const userReaction = postReactions.find((r) => {
          // Add null check before accessing type
          return r.userId === currentUser.id && r.type !== undefined
        })

        if (userReaction && userReaction.type !== undefined) {
          setSelectedReaction(getReactionTypeFromNumber(userReaction.type.toString()))
        } else {
          setSelectedReaction('')
        }
      }
    }, [postReactions, currentUser])

    // Fetch post reactions when component mounts
    useEffect(() => {
      const fetchReactions = async () => {
        try {
          setLoadingReactions(true)

          // Call API to get reactions
          const response = await getAllReactionByBlogId(post.id)

          if (response && response.success) {
            if (response.response) {
              let reactions = response.response

              // Ensure we have an array of reactions
              if (Array.isArray(reactions)) {
                setPostReactions(reactions)
                setTotalReactions(reactions.length)
              } else if (typeof reactions === 'object') {
                // Handle case where response might be an object with a nested reactions array
                if (reactions.items && Array.isArray(reactions.items)) {
                  setPostReactions(reactions.items)
                  setTotalReactions(reactions.items.length)
                } else {
                  console.warn('Reactions is an object but not in expected format:', reactions)
                  setPostReactions([])
                  setTotalReactions(0)
                }
              } else {
                console.warn('Unexpected reaction data format:', reactions)
                setPostReactions([])
                setTotalReactions(0)
              }
            } else {
              setPostReactions([])
              setTotalReactions(0)
            }
          } else {
            console.warn('API returned unsuccessful response:', response)
            setPostReactions([])
            setTotalReactions(0)
          }
        } catch (error) {
          console.error('Failed to fetch reactions:', error)
          setPostReactions([])
          setTotalReactions(0)
        } finally {
          setLoadingReactions(false)
        }
      }

      fetchReactions()
    }, [post.id])

    // Calculate reaction counts by type
    const getReactionCounts = () => {
      const counts: Record<string, number> = {}

      if (!postReactions || !Array.isArray(postReactions) || postReactions.length === 0) {
        return counts
      }

      try {
        postReactions.forEach((reaction) => {
          if (!reaction) return

          // Handle different possible formats of reaction type data
          let reactionType = '1' // Default to 'Like'

          if (reaction.type !== undefined) {
            reactionType = reaction.type.toString()
          } else if (reaction.reactionType !== undefined) {
            reactionType = reaction.reactionType.toString()
          }

          // Increment the count for this type
          counts[reactionType] = (counts[reactionType] || 0) + 1
        })
      } catch (error) {
        console.error('Error counting reactions:', error)
      }

      return counts
    }

    // State for reaction hover panel
    const [showReactions, setShowReactions] = useState(false)
    const reactionRef = useRef<HTMLDivElement>(null)

    // Handler for hovering on the like button
    const handleLikeHover = () => {
      setShowReactions(true)
    }

    // Keep reactions visible when hovering over them
    const handleReactionsHover = () => {
      setShowReactions(true)
    }

    // Handler for leaving the like button or reactions area
    const handleMouseLeave = () => {
      setTimeout(() => {
        setShowReactions(false)
      }, 1000)
    }

    // Handle reaction selection
    const handleReaction = async (reaction: string) => {
      if (!currentUser || !currentUser.id) {
        message.error('Please login to react')
        return
      }

      try {
        console.log('Current reaction:', selectedReaction, 'New reaction:', reaction)

        // Check if user is toggling the same reaction (removing it)
        // Khi reaction truyền vào rỗng (click vào nút reaction hiện tại) hoặc giống với reaction hiện tại
        // thì cần xóa reaction
        const isRemovingReaction = reaction === selectedReaction || reaction === ''

        console.log('Is removing reaction:', isRemovingReaction)

        // Find user's current reaction ID for deletion
        let userReactionId = null
        if (isRemovingReaction) {
          // Tìm reaction ID của user hiện tại
          const userReaction = postReactions.find((r) => r.userId === currentUser.id)

          console.log('Found user reaction:', userReaction)

          if (userReaction) {
            userReactionId = userReaction.id
          }
        }

        // Update local state immediately for UI responsiveness
        setSelectedReaction(isRemovingReaction ? '' : reaction)
        setShowReactions(false)

        // Convert reaction name to numeric type
        const reactionMap: Record<string, string> = {
          Like: '1',
          Love: '2',
          Haha: '3',
          Wow: '4',
          Sad: '5',
          Angry: '6'
        }

        try {
          let result
          if (isRemovingReaction) {
            if (!userReactionId) {
              console.error('Could not find user reaction ID for deletion')
              return
            }
            console.log('Deleting reaction ID:', userReactionId)
            // Use the reaction ID instead of post.id
            result = await deleteReaction(userReactionId)
          } else {
            // Add or update the reaction
            const type = reactionMap[reaction] || '1'
            result = await createPostReaction(currentUser.id, post.id, type)
          }

          if (result && result.success) {
            // Refresh post reactions after successful action
            const response = await getAllReactionByBlogId(post.id)

            if (response && response.success) {
              if (response.response) {
                let reactions = response.response

                // Update the state with fresh data
                if (Array.isArray(reactions)) {
                  setPostReactions(reactions)
                  setTotalReactions(reactions.length)
                } else if (typeof reactions === 'object' && reactions.items) {
                  setPostReactions(reactions.items)
                  setTotalReactions(reactions.items.length)
                }
              } else {
                setPostReactions([])
                setTotalReactions(0)
              }
            }
          } else {
            throw new Error(result?.message || 'Failed to update reaction')
          }
        } catch (apiError) {
          console.error('API error:', apiError)
          // Revert UI state since API call failed
          setSelectedReaction(isRemovingReaction ? reaction : '')
          message.error('Failed to update reaction')
        }
      } catch (error) {
        console.error('Error handling reaction:', error)
        message.error('An error occurred')
      }
    }

    // Get active reaction display
    const getActiveReaction = () => {
      if (!selectedReaction)
        return (
          <>
            <AiOutlineLike className='mr-2' />
            <span>Like</span>
          </>
        )

      const reaction = reactions.find((r) => r.name === selectedReaction)

      if (!reaction)
        return (
          <>
            <AiOutlineLike className='mr-2' />
            <span>Like</span>
          </>
        )

      return (
        <>
          {reaction.icon}
          <span className={`ml-2 ${reaction.color}`}>{reaction.name}</span>
        </>
      )
    }

    // Like count section (updated to use fetched reactions)
    const renderReactionCounts = () => {
      if (loadingReactions) {
        return <span className='text-gray-400 text-xs'>Loading reactions...</span>
      }

      const reactionCounts = getReactionCounts()

      const reactionTypes = Object.keys(reactionCounts)
        .sort((a, b) => reactionCounts[b] - reactionCounts[a])
        .slice(0, 3)

      if (reactionTypes.length === 0) {
        return <span className='text-gray-400 text-xs'>No reactions yet</span>
      }

      return (
        <button
          onClick={(e) => showReactionsModal(post, e)}
          className='flex items-center hover:bg-gray-100 px-2 py-1 rounded-full transition-colors duration-200'
        >
          <div className='flex -space-x-1'>
            {reactionTypes.map((type, index) => {
              const reactionName = getReactionTypeFromNumber(type)
              const reactionObj = reactions.find((r) => r.name === reactionName)
              const count = reactionCounts[type]

              return (
                <Tooltip key={index} title={`${reactionName}: ${count}`} placement='top'>
                  <span
                    className='relative inline-block rounded-full bg-white border border-gray-100 shadow-sm'
                    style={{ zIndex: 10 - index, marginLeft: index > 0 ? '-8px' : '0' }}
                  >
                    {reactionObj?.icon || (
                      <AiOutlineLike size={16} className='bg-blue-500 text-white rounded-full p-1' />
                    )}
                  </span>
                </Tooltip>
              )
            })}
          </div>
          <span className='text-gray-500 text-sm ml-2'>{totalReactions}</span>
        </button>
      )
    }

    // Determine if current user is the post creator
    const isPostCreator = currentUser?.id === post.userId

    // Handle post edit click
    const openEditModal = (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()

      // Set the current post to edit
      setCurrentEditPost(post)

      // Open the edit modal
      setIsEditModalVisible(true)

      // Close the menu
      setShowPostMenu(false)
    }

    // In the handleDeletePost function
    const handleDeletePost = (e?: React.MouseEvent<HTMLElement>) => {
      debugger
      // Remove debugger statement
      if (e) {
        e.stopPropagation()
        e.preventDefault()
      }

      // Dispatch delete action with a callback for success
      dispatch({
        type: 'DELETE_BLOG',
        payload: post.id,
        callback: (success: boolean, msg?: string) => {
          if (success) {
            message.success('Post deleted successfully')
            // Refresh the blog list after successful deletion
            dispatch({ type: 'GET_ALL_BLOGS' })
          } else {
            message.error(msg || 'Failed to delete post')
          }
        }
      })

      // Close the menu
      setShowPostMenu(false)
    }

    // Handle clicking the more options button
    const togglePostMenu = (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()
      setShowPostMenu(!showPostMenu)
    }

    // Close post menu when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (postMenuRef.current && !postMenuRef.current.contains(event.target as Node)) {
          setShowPostMenu(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [])

    // Add a function to fetch comments
    const fetchComments = async () => {
      if (!post.id) return

      try {
        setLoadingComments(true)
        const response = await getAllCommentByBlogId(post.id)
        if (response && response.success && response.response) {
          setPostComments(response.response)
        } else {
          setPostComments([])
        }
      } catch (error) {
        console.error('Failed to fetch comments:', error)
        message.error('Failed to load comments')
        setPostComments([])
      } finally {
        setLoadingComments(false)
      }
    }

    // Add a function to handle comment submission
    const handleCommentSubmit = async () => {
      if (commentText.trim() === '' || !post.id) return

      try {
        setSubmittingComment(true)

        const response = await createComment(
          'postComment', // apiCallerId
          post.id, // blogId
          currentUser.id, // userId
          commentText,
          null // parentCommentId empty for top-level comments
        )

        if (response.success) {
          setCommentText('')
          await fetchComments()
          message.success('Comment posted successfully')
        } else {
          message.error(response.message || 'Failed to post comment')
        }
      } catch (error) {
        console.error('Failed to post comment:', error)
        message.error('Failed to post comment')
      } finally {
        setSubmittingComment(false)
      }
    }

    // Add a function to show the comment modal
    const showCommentModal = async (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      setIsCommentModalVisible(true)
      await fetchComments()

      // Focus comment input after modal is shown
      setTimeout(() => {
        if (commentInputRef.current) {
          commentInputRef.current.focus()
        }
      }, 3000)
    }

    // Create a function that returns another function
    const createDeleteHandler = () => {
      debugger
      return () => {
        // Call dispatch directly
        dispatch({
          type: 'DELETE_BLOG',
          payload: post.id,
          callback: (success: boolean, msg?: string) => {
            if (success) {
              message.success('Post deleted successfully')
              dispatch({ type: 'GET_ALL_BLOGS' })
            } else {
              message.error(msg || 'Failed to delete post')
            }
          }
        })
        setShowPostMenu(false)
      }
    }

    // Add state for reply box visibility and reply text
    const [showReplyBox, setShowReplyBox] = useState<string | null>(null)
    const [replyText, setReplyText] = useState('')
    const [showAllReplies, setShowAllReplies] = useState<Record<string, boolean>>({})

    // Add a function to handle reply submission
    const handleReplySubmit = async (parentCommentId: string) => {
      if (replyText.trim() === '' || !post.id) return

      try {
        setSubmittingComment(true)

        const response = await createComment(
          'postReply', // apiCallerId
          post.id, // blogId
          currentUser.id, // userId
          replyText,
          parentCommentId // parentCommentId for replies
        )

        if (response.success) {
          setReplyText('')
          setShowReplyBox(null)
          await fetchComments()
          message.success('Reply posted successfully')
        } else {
          message.error(response.message || 'Failed to post reply')
        }
      } catch (error) {
        console.error('Failed to post reply:', error)
        message.error('Failed to post reply')
      } finally {
        setSubmittingComment(false)
      }
    }

    // Add a function to toggle showing all replies for a comment
    const toggleShowAllReplies = (commentId: string) => {
      setShowAllReplies((prevState) => ({
        ...prevState,
        [commentId]: !prevState[commentId]
      }))
    }

    // Add a function to hide replies for a comment
    const hideReplies = (commentId: string) => {
      setShowAllReplies((prevState) => ({
        ...prevState,
        [commentId]: false
      }))
    }

    // Add this function to handle edit initiation
    const startEditing = (commentId: string, currentText: string) => {
      setIsEditing(commentId)
      setEditText(currentText)
      // Close any open dropdowns
      setDropdownVisibleFor(null)
    }

    // Add this function to handle edit submission
    const handleEditSubmit = async (commentId: string) => {
      if (editText.trim() === '') return

      try {
        setSubmittingComment(true)
        const success = await updateComment(commentId, editText)

        if (success) {
          message.success('Comment updated successfully')
          setIsEditing(null)
          await fetchComments() // Refresh comments
        } else {
          message.error('Failed to update comment')
        }
      } catch (error) {
        console.error('Error updating comment:', error)
        message.error('An error occurred while updating the comment')
      } finally {
        setSubmittingComment(false)
      }
    }

    // Add this function to cancel editing
    const cancelEditing = () => {
      setIsEditing(null)
      setEditText('')
    }

    // Add this function to handle comment deletion
    const handleDeleteComment = async (commentId: string) => {
      try {
        setSubmittingComment(true)
        const success = await deleteComment(commentId)

        if (success) {
          message.success('Comment deleted successfully')
          await fetchComments() // Refresh comments
        } else {
          message.error('Failed to delete comment')
        }
      } catch (error) {
        console.error('Error deleting comment:', error)
        message.error('An error occurred while deleting the comment')
      } finally {
        setSubmittingComment(false)
        // Close any open dropdowns
        setDropdownVisibleFor(null)
      }
    }

    // Add function to toggle dropdown visibility
    const toggleDropdown = (commentId: string, e: React.MouseEvent) => {
      e.stopPropagation()
      setDropdownVisibleFor(dropdownVisibleFor === commentId ? null : commentId)
    }

    // Add this to your PostCard component:
    const handleDropdownClick = (e: React.MouseEvent) => {
      // Stop event propagation to prevent modal from closing
      e.stopPropagation()
    }

    return (
      <div className='bg-white rounded-lg shadow-md overflow-hidden'>
        {/* Post header */}
        <div className='p-4'>
          <div className='flex justify-between'>
            <div className='flex items-center'>
              <img
                src={post.userAvatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'}
                alt={`${post.fullName}'s avatar`}
                className='w-10 h-10 rounded-full object-cover'
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.onerror = null
                  target.src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
                }}
              />
              <div className='ml-3'>
                <div className='flex items-center'>
                  <h3 className='font-semibold text-sm'>{post.fullName || 'Community Member'}</h3>
                  {post.location && (
                    <>
                      <span className='mx-1 text-gray-500'>đang ở</span>
                      <span className='font-semibold text-sm'>{post.location}</span>
                    </>
                  )}
                </div>
                <div className='text-gray-500 text-xs flex items-center'>
                  <span>{post.timeAgo}</span>
                  <span className='mx-1'>·</span>
                  <span>🌐</span>
                </div>
              </div>
            </div>
            <div className='relative'>
              <button onClick={togglePostMenu}>
                <MdMoreHoriz />
              </button>

              {/* Post options menu */}
              {showPostMenu && (
                <div ref={postMenuRef} className='absolute right-0 mt-1 bg-white rounded-md shadow-lg z-20 w-48 py-1'>
                  {isPostCreator && (
                    <>
                      <button
                        onClick={openEditModal}
                        className='flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                      >
                        <MdEdit className='mr-2' /> Edit Post
                      </button>
                      <Popconfirm
                        title='Delete post'
                        description='Are you sure you want to delete this post?'
                        open={popconfirmVisible}
                        onConfirm={() => {
                          // Gọi dispatch để xóa bài viết
                          dispatch({
                            type: 'DELETE_BLOG',
                            payload: post.id,
                            callback: (success: boolean, msg?: string) => {
                              if (success) {
                                message.success('Post deleted successfully')
                                dispatch({ type: 'GET_ALL_BLOGS' })
                              } else {
                                message.error(msg || 'Failed to delete post')
                              }
                            }
                          })
                          // Đóng menu
                          setShowPostMenu(false)
                          // Đóng popconfirm
                          setPopconfirmVisible(false)
                        }}
                        okText='Yes'
                        cancelText='No'
                        onCancel={() => {
                          setPopconfirmVisible(false)
                        }}
                      >
                        <button
                          className='flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100'
                          onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                            // Khi bấm Delete Post, hiển thị Popconfirm
                            setPopconfirmVisible(true)
                          }}
                        >
                          <MdDelete className='mr-2' /> Delete Post
                        </button>
                      </Popconfirm>
                    </>
                  )}
                  {!isPostCreator && <div className='px-4 py-2 text-sm text-gray-500'>No actions available</div>}
                </div>
              )}
            </div>
          </div>

          {/* Post content */}
          <Link
            to={`${ROUTES.COMMUNITY}/${post.id}`}
            className='block hover:no-underline'
            onClick={() => postBlogView(post.id)}
          >
            <div className='mt-3 text-gray-800'>{formatContent(post.content || post.shortDescription || '')}</div>
          </Link>

          {post.type === 'chart' || post.sharedChartData ? (
            <div className='mt-3 mb-2'>
              <Link
                to={`${ROUTES.COMMUNITY}/${post.id}`}
                className='inline-flex items-center px-4 py-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors'
                onClick={(e) => {
                  e.stopPropagation()
                  postBlogView(post.id)
                }}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 mr-2'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M3 3a1 1 0 000 2h14a1 1 0 100-2H3zm0 6a1 1 0 000 2h9a1 1 0 100-2H3zm0 6a1 1 0 100 2h9a1 1 0 100-2H3z'
                    clipRule='evenodd'
                  />
                </svg>
                View Chart
              </Link>
            </div>
          ) : null}

          {/* Post tags */}
          {displayTags.length > 0 && (
            <div className='mt-2 flex flex-wrap gap-1'>
              {displayTags.length <= 3 || showAllTags ? (
                // Show all tags if there are 3 or fewer or if showAllTags is true
                <>
                  {displayTags.map((tag) => (
                    <span
                      key={tag.id}
                      className='inline-flex items-center px-2 py-1 bg-pink-50 text-pink-600 text-xs rounded-full truncate max-w-[120px]'
                      title={tag.name}
                    >
                      <span className='w-1.5 h-1.5 rounded-full bg-pink-400 mr-1'></span>
                      {tag.name}
                    </span>
                  ))}
                  {showAllTags && displayTags.length > 3 && (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setShowAllTags(false)
                      }}
                      className='inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200'
                    >
                      Show less
                    </button>
                  )}
                </>
              ) : (
                // Show first 2 tags and a count for the rest
                <>
                  {displayTags.slice(0, 2).map((tag) => (
                    <span
                      key={tag.id}
                      className='inline-flex items-center px-2 py-1 bg-pink-50 text-pink-600 text-xs rounded-full truncate max-w-[120px]'
                      title={tag.name}
                    >
                      <span className='w-1.5 h-1.5 rounded-full bg-pink-400 mr-1'></span>
                      {tag.name}
                    </span>
                  ))}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setShowAllTags(true)
                    }}
                    className='inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200'
                    title={displayTags
                      .slice(2)
                      .map((tag) => tag.name)
                      .join(', ')}
                  >
                    +{displayTags.length - 2} more
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Post images */}
        {post.images && post.images.length > 0 && (
          <Link
            to={`${ROUTES.COMMUNITY}/${post.id}`}
            className='block hover:no-underline'
            onClick={() => postBlogView(post.id)}
          >
            <div
              className={`grid ${post.images.length === 1 ? 'grid-cols-1' : post.images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-1`}
            >
              {post.images.map((image, index) => (
                <div
                  key={index}
                  className={`${post.images && post.images.length === 1 ? 'col-span-1' : ''} overflow-hidden`}
                >
                  <img
                    src={image}
                    alt={`Post image ${index + 1}`}
                    className='w-full h-full object-cover'
                    style={{ maxHeight: post.images && post.images.length === 1 ? '500px' : '250px' }}
                  />
                </div>
              ))}
            </div>
          </Link>
        )}

        {/* Like count */}
        <div className='px-4 py-2 flex items-center border-t border-gray-100'>
          <div className='flex'>
            {/* Show post.likes as a fallback if no API-fetched reactions are available */}
            {postReactions.length > 0 ? (
              renderReactionCounts()
            ) : post.likes && post.likes > 0 ? (
              <>
                <div className='bg-blue-500 text-white rounded-full p-1 text-xs'>
                  <AiOutlineLike size={12} />
                </div>
                <span className='text-gray-500 text-sm ml-2'>{post.likes}</span>
              </>
            ) : post.reactionsCount && post.reactionsCount > 0 ? (
              <>
                <div className='bg-blue-500 text-white rounded-full p-1 text-xs'>
                  <AiOutlineLike size={12} />
                </div>
                <span className='text-gray-500 text-sm ml-2'>{post.reactionsCount}</span>
              </>
            ) : (
              <span className='text-gray-400 text-xs'>No reactions yet</span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className='px-2 py-1 flex justify-between border-t border-gray-100 relative'>
          {/* Reaction panel */}
          {showReactions && (
            <div
              ref={reactionRef}
              onMouseEnter={handleReactionsHover}
              onMouseLeave={handleMouseLeave}
              className='absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg px-2 py-1 flex items-center space-x-2 z-10 transition-all duration-300 ease-in-out'
              style={{
                transform: 'translateY(-5px)',
                animation: 'fadeIn 0.2s ease-in-out'
              }}
            >
              {reactions.map((reaction) => (
                <Tooltip key={reaction.name} title={reaction.name} placement='top'>
                  <div
                    onClick={() => handleReaction(reaction.name)}
                    className={`hover:bg-gray-100 p-2 rounded-full cursor-pointer transform transition-transform hover:scale-125 ${selectedReaction === reaction.name ? 'bg-gray-100 scale-110' : ''}`}
                  >
                    {reaction.icon}
                  </div>
                </Tooltip>
              ))}
            </div>
          )}

          <button
            className={`flex-1 flex items-center justify-center py-2 hover:bg-gray-100 rounded-md ${selectedReaction ? reactions.find((r) => r.name === selectedReaction)?.color : 'text-gray-500'}`}
            onMouseEnter={handleLikeHover}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              // Khi đã có reaction thì gửi chuỗi rỗng để xóa, ngược lại thì gửi "Like"
              handleReaction(selectedReaction ? '' : 'Like')
            }}
          >
            {getActiveReaction()}
          </button>

          <button
            className='flex-1 flex items-center justify-center py-2 text-gray-500 hover:bg-gray-100 rounded-md'
            onClick={showCommentModal}
          >
            <FaRegComment className='mr-2' />
            <span>Comment</span>
          </button>
        </div>

        {/* Add the Comment Modal component */}
        {/* Add this at the end of the PostCard component's return, just before the closing </div>: */}
        <Modal
          visible={isCommentModalVisible}
          onCancel={() => setIsCommentModalVisible(false)}
          footer={null}
          width={800}
          centered
          closable={false}
          bodyStyle={{ padding: 0 }}
          className='instagram-modal'
          maskClosable={true}
          onClick={(e) => e.stopPropagation()}
        >
          <div className='flex flex-col h-[80vh]'>
            {/* Header */}
            <div className='p-3 border-b flex items-center justify-between'>
              <div className='flex items-center'>
                <img
                  src={post.userAvatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'}
                  alt='User'
                  className='w-8 h-8 rounded-full mr-2 object-cover'
                />
                <div>
                  <p className='font-semibold text-sm'>{post.fullName}</p>
                  {post.location && <p className='text-xs text-gray-500'>{post.location}</p>}
                </div>
              </div>
              <button onClick={() => setIsCommentModalVisible(false)} className='text-gray-500'>
                <MdClose size={24} />
              </button>
            </div>

            {/* Post content with image */}
            <div className='p-3 border-b'>
              <div className='flex items-start space-x-3'>
                <img
                  src={post.userAvatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'}
                  alt={post.fullName}
                  className='w-8 h-8 rounded-full object-cover'
                />
                <div className='flex-1'>
                  <div>
                    <span className='font-semibold text-sm mr-2'>{post.fullName}</span>
                    <span className='text-sm'>{formatContent(post.content || post.shortDescription || '')}</span>
                  </div>
                  <div className='text-xs text-gray-500 mt-1'>{post.timeAgo}</div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className='p-3 border-b'>
              <div className='flex flex-col'>
                {/* Reactions count */}
                {postReactions.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      showReactionsModal(post, e)
                    }}
                    className='flex items-center space-x-2 text-gray-500 hover:text-pink-600 transition-colors mb-2 self-start'
                  >
                    <div className='flex -space-x-1'>
                      {Object.entries(getReactionCounts())
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 3)
                        .map(([type, count], index) => {
                          const reactionName = getReactionTypeFromNumber(type)
                          const reactionObj = reactions.find((r) => r.name === reactionName)

                          return (
                            <span
                              key={index}
                              className='w-5 h-5 rounded-full flex items-center justify-center bg-white border border-gray-200 shadow-sm'
                            >
                              {reactionObj?.icon || <AiOutlineLike className='text-blue-500' />}
                            </span>
                          )
                        })}
                    </div>
                    <span className='text-sm'>
                      {totalReactions} {totalReactions === 1 ? 'reaction' : 'reactions'}
                    </span>
                  </button>
                )}

                <div className='flex justify-between mb-2'>
                  <div className='flex space-x-4 relative'>
                    {/* Reaction button with hover panel */}
                    <div className='relative' onMouseEnter={handleLikeHover} onMouseLeave={handleMouseLeave}>
                      <button className='text-2xl'>
                        {!selectedReaction ? (
                          <FaRegHeart className='text-gray-600' />
                        ) : (
                          reactions.find((r) => r.name === selectedReaction)?.icon || (
                            <FaRegHeart className='text-gray-600' />
                          )
                        )}
                      </button>

                      {/* Reaction options panel */}
                      {showReactions && (
                        <div
                          ref={reactionRef}
                          onMouseEnter={handleReactionsHover}
                          onMouseLeave={handleMouseLeave}
                          className='absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg px-2 py-1 flex items-center space-x-2 z-10 transition-all duration-300 ease-in-out'
                          style={{
                            transform: 'translateY(-5px)',
                            animation: 'fadeIn 0.2s ease-in-out'
                          }}
                        >
                          {reactions.map((reaction) => (
                            <div
                              key={reaction.name}
                              onClick={() => handleReaction(reaction.name)}
                              className={`hover:bg-gray-100 p-2 rounded-full cursor-pointer transform transition-transform hover:scale-125 ${
                                selectedReaction === reaction.name ? 'bg-gray-100 scale-110' : ''
                              }`}
                              title={reaction.name}
                            >
                              {reaction.icon}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <button className='text-2xl'>
                      <FaRegComment />
                    </button>
                    <button className='text-2xl'>
                      <FaShare />
                    </button>
                  </div>
                </div>

                {post.likes && post.likes > 0 && <p className='font-semibold text-sm'>{post.likes} likes</p>}
                <p className='text-xs text-gray-500'>{post.timeAgo}</p>
              </div>
            </div>

            {/* Comments section */}
            <div className='flex-1 overflow-y-auto p-3 border-b'>
              {/* Comments list */}
              {loadingComments ? (
                <div className='flex justify-center items-center h-32'>
                  <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500'></div>
                </div>
              ) : (
                <>
                  {postComments.length === 0 ? (
                    <div className='text-center py-8'>
                      <p className='text-gray-500'>No comments yet</p>
                      <p className='text-sm text-gray-400'>Be the first to comment</p>
                    </div>
                  ) : (
                    postComments.map((comment) => (
                      <div key={comment.id}>
                        <div className='flex items-start space-x-3 py-2'>
                          <img
                            src={
                              comment.user.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
                            }
                            alt={comment.user.fullName}
                            className='w-8 h-8 rounded-full object-cover'
                          />
                          <div className='flex-1'>
                            {isEditing === comment.id ? (
                              // Edit mode
                              <div className='flex flex-col'>
                                <input
                                  type='text'
                                  className='w-full p-2 border rounded-md bg-white focus:outline-none text-sm'
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  autoFocus
                                />
                                <div className='flex gap-2 mt-2'>
                                  <button
                                    onClick={() => handleEditSubmit(comment.id)}
                                    disabled={!editText.trim() || submittingComment}
                                    className={`text-xs px-3 py-1 rounded-md font-medium ${
                                      !editText.trim() || submittingComment
                                        ? 'bg-gray-200 text-gray-500'
                                        : 'bg-blue-500 text-white'
                                    }`}
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={cancelEditing}
                                    className='text-xs px-3 py-1 rounded-md border border-gray-300 text-gray-500'
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              // View mode
                              <div className='flex items-start justify-between'>
                                <div>
                                  <span className='font-semibold text-sm mr-2'>{comment.user.fullName}</span>
                                  <span className='text-sm'>{comment.commentText}</span>
                                </div>
                                {currentUser && currentUser.id === comment.user.id && (
                                  <div className='relative ml-2'>
                                    <Dropdown
                                      overlay={
                                        <Menu onClick={handleDropdownClick}>
                                          <Menu.Item
                                            key='edit'
                                            onClick={(e) => {
                                              e.domEvent.stopPropagation()
                                              startEditing(comment.id, comment.commentText)
                                            }}
                                            icon={<FaEdit size={12} />}
                                          >
                                            Edit
                                          </Menu.Item>
                                          <Menu.Item
                                            key='delete'
                                            danger
                                            onClick={(e) => {
                                              e.domEvent.stopPropagation()
                                              Modal.confirm({
                                                title: 'Delete Comment',
                                                content:
                                                  'Are you sure you want to delete this comment? This cannot be undone.',
                                                okText: 'Delete',
                                                okType: 'danger',
                                                cancelText: 'Cancel',
                                                onOk: () => handleDeleteComment(comment.id)
                                              })
                                            }}
                                            icon={<FaTrash size={12} />}
                                          >
                                            Delete
                                          </Menu.Item>
                                        </Menu>
                                      }
                                      trigger={['click']}
                                      visible={dropdownVisibleFor === comment.id}
                                      onVisibleChange={(visible) => {
                                        if (visible) {
                                          setDropdownVisibleFor(comment.id)
                                        } else {
                                          setDropdownVisibleFor(null)
                                        }
                                      }}
                                      placement='bottomRight'
                                    >
                                      <button
                                        className='text-gray-400 hover:text-gray-600'
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          toggleDropdown(comment.id, e)
                                        }}
                                      >
                                        <MdMoreVert size={16} />
                                      </button>
                                    </Dropdown>
                                  </div>
                                )}
                              </div>
                            )}

                            {!isEditing && (
                              <div className='flex items-center mt-1 text-xs text-gray-500 space-x-3'>
                                <span>{comment.timeAgo}</span>
                                <button className='font-medium hover:underline'>Like</button>
                                <button
                                  className='font-medium hover:underline'
                                  onClick={() => {
                                    // Toggle reply box for this comment
                                    setShowReplyBox((prevState) => (prevState === comment.id ? null : comment.id))
                                    setReplyText('')
                                  }}
                                >
                                  Reply
                                </button>
                              </div>
                            )}

                            {/* Reply input box */}
                            {showReplyBox === comment.id && !isEditing && (
                              <div className='mt-2 flex items-start'>
                                <div className='flex-1'>
                                  <div className='flex items-center'>
                                    <input
                                      type='text'
                                      className='w-full p-2 border-none bg-transparent focus:outline-none text-sm'
                                      placeholder='Write a reply...'
                                      value={replyText}
                                      onChange={(e) => setReplyText(e.target.value)}
                                    />
                                    <button
                                      onClick={() => handleReplySubmit(comment.id)}
                                      disabled={!replyText.trim() || submittingComment}
                                      className={`text-sm font-semibold ${
                                        !replyText.trim() || submittingComment ? 'text-blue-300' : 'text-blue-500'
                                      }`}
                                    >
                                      Reply
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Replies section remains the same */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className='ml-11'>
                            {/* Show all replies toggle */}
                            {!showAllReplies[comment.id] && (
                              <button
                                onClick={() => toggleShowAllReplies(comment.id)}
                                className='text-sm text-gray-500 hover:underline flex items-center gap-1 mb-1'
                              >
                                View {comment.replies.length > 2 ? `all ${comment.replies.length}` : ''} replies
                              </button>
                            )}

                            {/* Display replies only if showAllReplies is true for this comment */}
                            {showAllReplies[comment.id] && (
                              <>
                                {comment.replies.map((reply) => (
                                  <div key={reply.id} className='flex items-start space-x-3 py-2 pl-2'>
                                    <img
                                      src={
                                        reply.user.avatarUrl ||
                                        'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
                                      }
                                      alt={reply.user.fullName}
                                      className='w-8 h-8 rounded-full object-cover'
                                    />
                                    <div className='flex-1'>
                                      <div className='flex items-start justify-between'>
                                        <div>
                                          <span className='font-semibold text-sm mr-2'>{reply.user.fullName}</span>
                                          <span className='text-sm'>{reply.commentText}</span>
                                        </div>
                                        {currentUser && currentUser.id === reply.user.id && (
                                          <div className='relative ml-2'>
                                            <Dropdown
                                              overlay={
                                                <Menu onClick={handleDropdownClick}>
                                                  <Menu.Item
                                                    key='edit'
                                                    onClick={(e) => {
                                                      e.domEvent.stopPropagation()
                                                      startEditing(reply.id, reply.commentText)
                                                    }}
                                                    icon={<FaEdit size={12} />}
                                                  >
                                                    Edit
                                                  </Menu.Item>
                                                  <Menu.Item
                                                    key='delete'
                                                    danger
                                                    onClick={(e) => {
                                                      e.domEvent.stopPropagation()
                                                      Modal.confirm({
                                                        title: 'Delete Reply',
                                                        content:
                                                          'Are you sure you want to delete this reply? This cannot be undone.',
                                                        okText: 'Delete',
                                                        okType: 'danger',
                                                        cancelText: 'Cancel',
                                                        onOk: () => handleDeleteComment(reply.id)
                                                      })
                                                    }}
                                                    icon={<FaTrash size={12} />}
                                                  >
                                                    Delete
                                                  </Menu.Item>
                                                </Menu>
                                              }
                                              trigger={['click']}
                                              visible={dropdownVisibleFor === reply.id}
                                              onVisibleChange={(visible) => {
                                                if (visible) {
                                                  setDropdownVisibleFor(reply.id)
                                                } else {
                                                  setDropdownVisibleFor(null)
                                                }
                                              }}
                                              placement='bottomRight'
                                            >
                                              <button
                                                className='text-gray-400 hover:text-gray-600'
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  toggleDropdown(reply.id, e)
                                                }}
                                              >
                                                <MdMoreVert size={16} />
                                              </button>
                                            </Dropdown>
                                          </div>
                                        )}
                                      </div>
                                      <div className='flex items-center mt-1 text-xs text-gray-500 space-x-3'>
                                        <span>{reply.timeAgo}</span>
                                        <button className='font-medium hover:underline'>Like</button>
                                      </div>
                                    </div>
                                  </div>
                                ))}

                                {/* Hide replies button */}
                                <button
                                  onClick={() => hideReplies(comment.id)}
                                  className='text-sm text-gray-500 hover:underline flex items-center gap-1 mt-1'
                                >
                                  Hide replies
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </>
              )}
            </div>

            {/* Comment input */}
            <div className='p-3 flex items-center'>
              <input
                ref={commentInputRef}
                type='text'
                placeholder='Add a comment...'
                className='flex-1 border-none focus:outline-none'
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !submittingComment) {
                    handleCommentSubmit()
                  }
                }}
              />
              <button
                onClick={handleCommentSubmit}
                disabled={!commentText.trim() || submittingComment}
                className={`font-semibold ${!commentText.trim() || submittingComment ? 'text-blue-300' : 'text-blue-500'}`}
              >
                Post
              </button>
            </div>
          </div>
        </Modal>
      </div>
    )
  }

  // Add this function to show the reactions modal
  const showReactionsModal = async (post: BlogPost, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    // Set the current post
    setCurrentReactionPost(post)

    // Show loading state
    setIsReactionModalVisible(true)
    setLoadingModalReactions(true)

    try {
      // Fetch reactions for this post
      const response = await getAllReactionByBlogId(post.id)

      if (response && response.success && response.response) {
        let reactions = response.response

        // Ensure we have an array of reactions
        if (Array.isArray(reactions)) {
          setModalReactions(reactions)
        } else if (typeof reactions === 'object') {
          // Handle case where response might be an object with a nested reactions array
          if (reactions.items && Array.isArray(reactions.items)) {
            setModalReactions(reactions.items)
          } else {
            console.warn('Reactions is an object but not in expected format:', reactions)
            setModalReactions([])
          }
        } else {
          console.warn('Unexpected reaction data format:', reactions)
          setModalReactions([])
        }
      } else {
        setModalReactions([])
      }
    } catch (error) {
      console.error('Failed to fetch reactions for modal:', error)
      setModalReactions([])
    } finally {
      setLoadingModalReactions(false)
    }
  }

  // Add this function to group reactions by type
  const getModalReactionsByType = () => {
    const reactionsByType: Record<string, any[]> = {}

    modalReactions.forEach((reaction) => {
      const reactionType = reaction.type?.toString() || '1'
      const reactionName = getReactionTypeFromNumber(reactionType)

      if (!reactionsByType[reactionName]) {
        reactionsByType[reactionName] = []
      }
      reactionsByType[reactionName].push(reaction)
    })

    return reactionsByType
  }

  return (
    <div className='min-h-screen bg-red-50 mt-12'>
      {/* Main Content */}
      <main className='px-4 py-8'>
        <div className='mt-14 container mx-auto'>
          {/* Community Feed */}
          <div className='lg:col-span-2'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-2xl font-semibold text-gray-800'>Community Feed</h2>
              {currentUser && (
                <button
                  onClick={showModal}
                  className='bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors duration-300'
                >
                  Create Post
                </button>
              )}
            </div>

            <Tabs defaultActiveKey='1'>
              <TabPane tab='Discussions' key='1'>
                {loading ? (
                  <div className='flex justify-center items-center h-64'>
                    <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500'></div>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {discussionPosts.map((post: BlogPost) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                )}
              </TabPane>

              {/* Changed from Shared Charts to My Posts */}
              <TabPane tab='My Posts' key='2'>
                {loading ? (
                  <div className='flex justify-center items-center h-64'>
                    <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500'></div>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {myPosts.map((post: BlogPost) => (
                      <PostCard key={post.id} post={post} />
                    ))}

                    {myPosts.length === 0 && !loading && (
                      <div className='text-center py-12 bg-white rounded-lg shadow'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-16 w-16 text-gray-400 mx-auto mb-4'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={1}
                            d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                          />
                        </svg>
                        <h3 className='text-lg font-medium text-gray-700 mb-2'>You haven't created any posts yet</h3>
                        <p className='text-gray-500'>Share your experiences or charts with the community!</p>
                      </div>
                    )}
                  </div>
                )}
              </TabPane>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Use the new PostCreationModal component */}
      <PostCreationModal
        isVisible={isModalVisible}
        onCancel={handleCancel}
        onSubmit={handleCreatePost}
        currentUser={currentUser}
        tags={tags}
        submitting={submitting}
      />

      {/* Edit Post Modal */}
      <PostCreationModal
        isVisible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onSubmit={handleEditPost}
        currentUser={currentUser}
        tags={tags}
        submitting={submitting}
        title='Edit Post'
        initialData={
          currentEditPost
            ? {
                content: currentEditPost.content || '',
                images: currentEditPost.images || '',
                tagIds: currentEditPost.tags?.map((tag) => tag.id) || [],
                type: currentEditPost.type,
                chartData: currentEditPost.sharedChartData
              }
            : undefined
        }
      />

      {/* Add this to the end of your component's JSX, before the closing </div> */}
      {/* Reactions Modal */}
      <Modal
        visible={isReactionModalVisible}
        onCancel={() => setIsReactionModalVisible(false)}
        footer={null}
        title={
          <div className='flex items-center'>
            <span className='font-medium'>Reactions</span>
            {currentReactionPost && (
              <span className='text-gray-500 text-sm ml-2'>- {currentReactionPost.fullName}'s post</span>
            )}
          </div>
        }
        width={400}
        centered
        bodyStyle={{ maxHeight: '60vh', overflow: 'auto' }}
      >
        {loadingModalReactions ? (
          <div className='flex justify-center items-center h-32'>
            <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500'></div>
          </div>
        ) : (
          <>
            {modalReactions.length === 0 ? (
              <div className='text-center py-8'>
                <p className='text-gray-500'>No reactions yet</p>
              </div>
            ) : (
              <>
                <Tabs defaultActiveKey='All'>
                  <TabPane tab={<span>All ({modalReactions.length})</span>} key='All'>
                    {modalReactions.map((reaction) => {
                      const reactionType = reaction.type?.toString() || '1'
                      const reactionName = getReactionTypeFromNumber(reactionType)
                      const reactionObj = reactions.find((r) => r.name === reactionName)

                      return (
                        <div key={reaction.id} className='flex items-center py-2 border-b border-gray-100'>
                          <img
                            src={
                              reaction.userAvatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
                            }
                            alt={reaction.fullName || 'User'}
                            className='w-10 h-10 rounded-full mr-3 object-cover'
                          />
                          <div className='flex-1'>
                            <p className='font-medium'>{reaction.fullName || 'User'}</p>
                          </div>
                          <div className='flex items-center'>
                            {reactionObj?.icon || <AiOutlineLike size={16} className='text-blue-500' />}
                            <span className={`ml-1 ${reactionObj?.color || 'text-blue-500'}`}>{reactionName}</span>
                          </div>
                        </div>
                      )
                    })}
                  </TabPane>

                  {/* Reaction type tabs */}
                  {Object.entries(getModalReactionsByType()).map(([type, reactionGroup]) => (
                    <TabPane
                      tab={
                        <div className='flex items-center'>
                          {(() => {
                            // Find the reaction object that corresponds to this type
                            const reactionObj = reactions.find((r) => r.name === type)
                            // Return the icon if found, or a default icon
                            return reactionObj ? (
                              React.cloneElement(reactionObj.icon as React.ReactElement)
                            ) : (
                              <AiFillLike size={16} className='text-blue-500' />
                            )
                          })()}
                          <span className='ml-1'>
                            {type} ({reactionGroup.length})
                          </span>
                        </div>
                      }
                      key={type}
                    >
                      {reactionGroup.map((reaction) => (
                        <div key={reaction.id} className='flex items-center py-2 border-b border-gray-100'>
                          <img
                            src={
                              reaction.userAvatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
                            }
                            alt={reaction.fullName || 'User'}
                            className='w-10 h-10 rounded-full mr-3 object-cover'
                          />
                          <div className='flex-1'>
                            <p className='font-medium'>{reaction.fullName || 'User'}</p>
                          </div>
                        </div>
                      ))}
                    </TabPane>
                  ))}
                </Tabs>
              </>
            )}
          </>
        )}
      </Modal>
    </div>
  )
}

export default CommunityPage
