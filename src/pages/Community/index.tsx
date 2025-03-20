import ROUTES from '@/utils/config/routes'
import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectBlogInfo, selectUserInfo, selectTagInfo } from '@/store/modules/global/selector'
import { Tabs, message, Tooltip, Modal, Popconfirm } from 'antd'
import { FaRegComment, FaShare } from 'react-icons/fa'
import { MdMoreHoriz, MdEdit, MdDelete } from 'react-icons/md'
import { AiOutlineLike, AiFillLike } from 'react-icons/ai'
import { FaRegLaughBeam, FaRegSadTear, FaRegAngry, FaHeart, FaRegSurprise } from 'react-icons/fa'
import PostCreationModal from '@/components/PostCreationModal'
import { getAllReactionByBlogId, createPostReaction, postBlogView } from '@/services/blogService'

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
    images: string[]
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

      // Create blog post through Redux action
      dispatch({
        type: 'CREATE_BLOG',
        payload: {
          type: 'community',
          content: postData.content, // Contains inline images from Froala
          userId: currentUser.id,
          hashtags: hashtags.map((tag) => tag.substring(1)), // Remove # from hashtags
          featuredImageUrl: postData.images, // Separately uploaded images
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

    // Get user's reaction if exists
    useEffect(() => {
      if (currentUser && postReactions.length > 0) {
        // Check if userId format matches
        const userReaction = postReactions.find((r) => {
          return r.userId === currentUser.id
        })

        if (userReaction) {
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
      // If user is not logged in, show error message
      if (!currentUser || !currentUser.id) {
        message.error('Please login to react to posts')
        return
      }

      try {
        // Check if user is toggling the same reaction (removing it)
        const isRemovingReaction = reaction === selectedReaction

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

        // Set type value based on whether we're adding or removing a reaction
        let type = '0'
        if (!isRemovingReaction) {
          type = reactionMap[reaction] || '1'
        }

        // Call the API
        try {
          const result = await createPostReaction(currentUser.id, post.id, type)

          if (result && result.success) {
            // Success message based on operation
            if (isRemovingReaction) {
              message.success('Reaction removed')

              // Immediately update local reaction count
              const updatedReactions = postReactions.filter((r) => r.userId !== currentUser.id)
              setPostReactions(updatedReactions)
              setTotalReactions((prevCount) => Math.max(0, prevCount - 1))
            } else {
              message.success(`Reacted with ${reaction}`)

              // Check if the user had a previous reaction
              const existingReaction = postReactions.find((r) => r.userId === currentUser.id)

              if (existingReaction) {
                // Update the existing reaction
                const updatedReactions = postReactions.map((r) =>
                  r.userId === currentUser.id ? { ...r, type: reactionMap[reaction] } : r
                )
                setPostReactions(updatedReactions)
              } else {
                // Add a new reaction
                const newReaction = {
                  userId: currentUser.id,
                  type: reactionMap[reaction],
                  blogId: post.id
                }
                setPostReactions([...postReactions, newReaction])
                setTotalReactions((prevCount) => prevCount + 1)
              }
            }
          } else {
            throw new Error(result?.message || 'Failed to update reaction')
          }
        } catch (apiError) {
          console.error('API error:', apiError)
          message.error(`Failed to ${isRemovingReaction ? 'remove' : 'add'} reaction`)
          // Revert local state on error
          setSelectedReaction(isRemovingReaction ? reaction : '')
          return
        }

        // Refresh the reactions for this post
        const response = await getAllReactionByBlogId(post.id)
        if (response && response.success && response.response) {
          if (Array.isArray(response.response)) {
            setPostReactions(response.response)
            setTotalReactions(response.response.length)
          }
        }

        // Manually refresh the posts after successful update
        dispatch({ type: 'GET_ALL_BLOGS' })
      } catch (error) {
        console.error('Error updating reaction:', error)
        message.error('Failed to update reaction')
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

    // Handle post delete with the correct type signature
    const handleDeletePost = (e?: React.MouseEvent<HTMLElement>) => {
      if (e) {
        e.stopPropagation()
        e.preventDefault()
      }

      // Dispatch delete action
      dispatch({
        type: 'DELETE_BLOG',
        payload: post.id,
        callback: (success: boolean, msg?: string) => {
          if (success) {
            message.success('Post deleted successfully')
            // Refresh posts
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
              <button className='text-gray-500 hover:bg-gray-100 p-2 rounded-full' onClick={togglePostMenu}>
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
                        onConfirm={handleDeletePost}
                        okText='Yes'
                        cancelText='No'
                      >
                        <button className='flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100'>
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
            onClick={() => handleReaction(selectedReaction ? '' : 'Like')}
          >
            {getActiveReaction()}
          </button>

          <button
            className='flex-1 flex items-center justify-center py-2 text-gray-500 hover:bg-gray-100 rounded-md'
            onClick={() => navigateToPostDetail(post.id)}
          >
            <FaRegComment className='mr-2' />
            <span>Comment</span>
          </button>
        </div>
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
