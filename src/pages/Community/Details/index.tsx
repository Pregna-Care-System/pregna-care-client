import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  FaLongArrowAltLeft,
  FaRegCommentDots,
  FaThumbsUp,
  FaRegComment,
  FaShare,
  FaRegHeart,
  FaHeart
} from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { selectBlogInfo, selectUserInfo } from '@/store/modules/global/selector'
import EnhancedFetalChart from '@/pages/Member/FetalGrowthChartDetail/Components/Charts/EnhancedFetalChart'
import { Spin, message, Modal } from 'antd'
import { createComment, getAllCommentByBlogId, getBlogById } from '@/services/blogService'
import ROUTES from '@/utils/config/routes'
import { MdClose } from 'react-icons/md'

interface Comment {
  id: string
  commentText: string
  timeAgo: string
  user: {
    fullName: string
    avatarUrl: string
  }
  parentCommentId?: string
  replies?: Comment[]
}

interface BlogPost {
  id: string
  pageTitle: string
  content?: string
  shortDescription?: string
  type: 'community' | 'chart'
  fullName: string
  userAvatarUrl: string
  timeAgo: string
  featuredImageUrl?: string
  sharedChartData?: string
  images?: string[]
  likes?: number
  location?: string
  tags?: { id: string; name: string }[]
  blogTags?: { tag: { id: string; name: string } }[]
}

const CommunityCommentDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showReplyBox, setShowReplyBox] = useState<string | null>(null) // Store comment ID for reply
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [postDetail, setPostDetail] = useState<BlogPost | null>(null)
  const [commentText, setCommentText] = useState('')
  const [replyText, setReplyText] = useState('')
  const [listComment, setListComment] = useState<Comment[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [showAllReplies, setShowAllReplies] = useState<Record<string, boolean>>({})
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false)
  const [showAllTags, setShowAllTags] = useState(false)

  // Create a ref for the reply input
  const replyInputRef = useRef<HTMLInputElement>(null)

  // Get user information (you'll need to adapt this to your auth system)
  const currentUser = useSelector(selectUserInfo) // Replace with your actual user selector

  const handleCommentSubmit = async () => {
    if (commentText.trim() === '' || !id) return

    try {
      setSubmitting(true)

      const response = await createComment(
        'postComment', // apiCallerId - identifier for this operation
        id, // blogId from URL params
        currentUser.id, // userId - you'll need to get this from your auth context/Redux store
        commentText,
        undefined // parentCommentId empty for top-level comments
      )

      if (response.success) {
        // Success handling
        setCommentText('')
        // Optionally refresh comments
        await fetchComments()
        message.success('Comment posted successfully')
      } else {
        message.error(response.message || 'Failed to post comment')
      }
    } catch (error) {
      console.error('Failed to post comment:', error)
      message.error('Failed to post comment')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReplySubmit = async (parentCommentId: string) => {
    if (replyText.trim() === '' || !id) return

    try {
      setSubmitting(true)

      const response = await createComment(
        'postReply', // apiCallerId - identifier for this operation
        id, // blogId from URL params
        currentUser.id, // userId
        replyText,
        parentCommentId // parentCommentId for replies
      )

      if (response.success) {
        setReplyText('')
        setShowReplyBox(null) // Hide reply box
        await fetchComments() // Refresh comments
        message.success('Reply posted successfully')
      } else {
        message.error(response.message || 'Failed to post reply')
      }
    } catch (error) {
      console.error('Failed to post reply:', error)
      message.error('Failed to post reply')
    } finally {
      setSubmitting(false)
    }
  }

  const fetchPostDetails = async () => {
    if (!id) return

    try {
      setLoading(true)
      const response = await getBlogById(id)
      if (response.success && response.response) {
        console.log('Post details with tags:', response.response)
        setPostDetail(response.response)
      } else {
        message.error('Post not found')
        navigate(ROUTES.COMMUNITY)
      }
    } catch (error) {
      console.error('Failed to fetch post details:', error)
      message.error('Failed to load post details')
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    if (!id) return

    try {
      setLoading(true)
      const response = await getAllCommentByBlogId(id)
      if (response && response.success && response.response) {
        setListComment(response.response)
      } else {
        setListComment([])
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error)
      message.error('Failed to load comments')
      setListComment([])
    } finally {
      setLoading(false)
    }
  }

  const toggleShowAllReplies = (commentId: string) => {
    setShowAllReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId]
    }))
  }

  // Function to completely hide replies
  const hideReplies = (commentId: string) => {
    // First set showAllReplies to false for this comment
    setShowAllReplies((prev) => ({
      ...prev,
      [commentId]: false
    }))

    // Then hide the reply box if it's open for this comment
    if (showReplyBox === commentId) {
      setShowReplyBox(null)
    }
  }

  const showCommentModal = () => {
    setIsCommentModalVisible(true)
  }

  const handleCommentModalCancel = () => {
    setIsCommentModalVisible(false)
  }

  // Format content with hashtags highlighted
  const formatContent = (content: string) => {
    if (!content) return ''

    // Replace hashtags with styled spans
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

  // Modified function to show reply box and focus the input
  const handleShowReplyBox = (commentId: string) => {
    setShowReplyBox(commentId)
    setReplyText('') // Clear previous reply text

    // Focus the input after a short delay to ensure the component has rendered
    setTimeout(() => {
      if (replyInputRef.current) {
        replyInputRef.current.focus()
      }
    }, 50)
  }

  useEffect(() => {
    if (id) {
      fetchPostDetails()
      fetchComments()
    }
  }, [id])

  // Extract tags from either tags or blogTags property
  const displayTags = postDetail?.tags || postDetail?.blogTags?.map((bt) => bt.tag) || []

  useEffect(() => {
    if (
      postDetail &&
      (postDetail.type === 'chart' || (postDetail.type === 'community' && postDetail.sharedChartData))
    ) {
      try {
        // Parse the chart data from JSON string
        if (postDetail.sharedChartData) {
          const parsedData = JSON.parse(postDetail.sharedChartData)
          setChartData(parsedData)
        }
      } catch (error) {
        console.error('Failed to parse chart data:', error)
        message.error('Failed to load chart data')
      }
    }
  }, [postDetail])

  if (loading && !postDetail) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spin size='large' />
      </div>
    )
  }

  if (!postDetail) {
    return (
      <div className='p-4 bg-red-50 min-h-screen'>
        <div className='container mx-auto'>
          <div className='my-16 text-center'>
            <h2 className='text-2xl font-bold'>Post not found</h2>
            <button
              onClick={() => navigate(ROUTES.COMMUNITY)}
              className='mt-4 px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700'
            >
              Back to Community
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Modal comment component with Instagram style
  const ModalCommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    // Create a local state for this specific comment's reply text
    const [localReplyText, setLocalReplyText] = useState('')

    // Handle local reply submission
    const handleLocalReplySubmit = async () => {
      if (localReplyText.trim() === '' || !id) return

      try {
        setSubmitting(true)

        const response = await createComment('postReply', id, currentUser.id, localReplyText, comment.id)

        if (response.success) {
          setLocalReplyText('')
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
        setSubmitting(false)
      }
    }

    return (
      <div className={`flex items-start space-x-3 py-2 ${isReply ? 'pl-10' : ''}`}>
        <img
          src={comment.user.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'}
          alt={comment.user.fullName}
          className='w-8 h-8 rounded-full object-cover'
        />
        <div className='flex-1'>
          <div className='flex items-start'>
            <div>
              <span className='font-semibold text-sm mr-2'>{comment.user.fullName}</span>
              <span className='text-sm'>{comment.commentText}</span>
            </div>
            <button className='ml-2 text-gray-400 hover:text-gray-600'>
              <FaHeart size={12} />
            </button>
          </div>

          <div className='flex items-center mt-1 text-xs text-gray-500 space-x-3'>
            <span>{comment.timeAgo}</span>
            <button className='font-medium hover:underline'>Thích</button>

            {/* Reply button */}
            <button onClick={() => handleShowReplyBox(comment.id)} className='font-medium hover:underline'>
              Reply
            </button>
          </div>

          {/* Reply box */}
          {showReplyBox === comment.id && (
            <div className='mt-2 flex items-start'>
              <div className='flex-1'>
                <div className='flex items-center'>
                  <input
                    ref={replyInputRef}
                    type='text'
                    className='w-full p-2 border-none bg-transparent focus:outline-none text-sm'
                    placeholder='Viết phản hồi...'
                    value={localReplyText}
                    onChange={(e) => setLocalReplyText(e.target.value)}
                  />
                  <button
                    onClick={handleLocalReplySubmit}
                    disabled={!localReplyText.trim() || submitting}
                    className={`text-sm font-semibold ${
                      !localReplyText.trim() || submitting ? 'text-blue-300' : 'text-blue-500'
                    }`}
                  >
                    Đăng
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Tag component with hover effect
  const Tag = ({ tag }: { tag: any }) => {
    return (
      <span
        className='inline-flex items-center px-3 py-1 bg-pink-50 text-pink-600 text-sm rounded-full 
          hover:bg-pink-100 transition-colors duration-200 cursor-default'
        title={`Posts with "${tag.name}" tag`}
      >
        <span className='w-2 h-2 rounded-full bg-pink-400 mr-1.5'></span>
        {tag.name}
      </span>
    )
  }

  // Modal tag component with smaller size
  const ModalTag = ({ tag }: { tag: any }) => {
    return (
      <span
        className='inline-flex items-center px-2 py-0.5 bg-pink-50 text-pink-600 text-xs rounded-full
          hover:bg-pink-100 transition-colors duration-200 cursor-default'
        title={`Posts with "${tag.name}" tag`}
      >
        <span className='w-1.5 h-1.5 rounded-full bg-pink-400 mr-1'></span>
        {tag.name}
      </span>
    )
  }

  return (
    <div className='p-4 bg-red-50 min-h-screen'>
      <div className='container mx-auto'>
        <div className='mb-6 mt-16 pt-5'>
          <button
            className='flex items-center text-gray-600 hover:text-red-600 transition-colors'
            onClick={() => window.history.back()}
          >
            <FaLongArrowAltLeft className='mr-2' />
            Back to Community
          </button>
        </div>

        <div className='bg-white rounded-xl shadow-lg p-6 mb-6'>
          {/* Post header */}
          <div className='flex items-start space-x-4 mb-6'>
            <img
              src={postDetail.userAvatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'}
              alt='User avatar'
              className='w-12 h-12 rounded-full object-cover'
            />
            <div className='flex-1'>
              <div className='flex items-center space-x-2'>
                <h2 className='font-semibold text-gray-800'>{postDetail.fullName || 'Community Member'}</h2>
                <span className='text-sm text-pink-600 bg-pink-50 px-2 py-1 rounded-full'>
                  {postDetail.type === 'chart' ? 'Shared Chart' : 'Discussion'}
                </span>
              </div>
              <div className='text-sm text-gray-500'>
                <span>{postDetail.timeAgo}</span>
              </div>
            </div>
          </div>

          {/* Post title and content */}
          <h1 className='text-2xl font-bold mb-4'>{postDetail.pageTitle}</h1>

          {/* Post tags - improved visual layout with expand/collapse capability */}
          {displayTags.length > 0 && (
            <div className='mb-4'>
              <div className='text-sm text-gray-500 mb-2'>Topics:</div>
              <div className='flex flex-wrap gap-2'>
                {displayTags.length <= 5 || showAllTags ? (
                  // Show all tags if there are 5 or fewer or if showAllTags is true
                  <>
                    {displayTags.map((tag) => (
                      <Tag key={tag.id} tag={tag} />
                    ))}
                    {showAllTags && displayTags.length > 5 && (
                      <button
                        onClick={() => setShowAllTags(false)}
                        className='inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full
                          hover:bg-gray-200 transition-colors duration-200'
                      >
                        Show less
                      </button>
                    )}
                  </>
                ) : (
                  // Show first 4 tags and a count for the rest
                  <>
                    {displayTags.slice(0, 4).map((tag) => (
                      <Tag key={tag.id} tag={tag} />
                    ))}
                    <button
                      onClick={() => setShowAllTags(true)}
                      className='inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full
                        hover:bg-gray-200 transition-colors duration-200'
                      title={displayTags
                        .slice(4)
                        .map((tag) => tag.name)
                        .join(', ')}
                    >
                      +{displayTags.length - 4} more
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          <div className='prose max-w-none mb-6'>
            <p className='text-gray-700 leading-relaxed'>{postDetail.content || postDetail.shortDescription}</p>
          </div>

          {/* Chart visualization if it's a chart post */}
          {chartData && (
            <div className='my-6 border border-gray-200 rounded-lg p-4'>
              <h3 className='text-lg font-semibold mb-3'>Fetal Growth Chart</h3>
              <EnhancedFetalChart fetalData={chartData} sharing={false} />
            </div>
          )}

          {/* Featured image display
          {postDetail.featuredImageUrl && (
            <div className='my-6'>
              <img
                src={postDetail.featuredImageUrl}
                alt={postDetail.pageTitle}
                className='max-w-full h-auto rounded-lg'
              />
            </div>
          )} */}

          {/* Post images
          {postDetail.images && postDetail.images.length > 0 && (
            <div className='my-6'>
              <div
                className={`grid ${
                  postDetail.images.length === 1
                    ? 'grid-cols-1'
                    : postDetail.images.length === 2
                      ? 'grid-cols-2'
                      : 'grid-cols-3'
                } gap-1`}
              >
                {postDetail.images.map((image, index) => (
                  <div
                    key={index}
                    className={`${
                      postDetail.images && postDetail.images.length === 1 ? 'col-span-1' : ''
                    } overflow-hidden`}
                  >
                    <img
                      src={image}
                      alt={`Post image ${index + 1}`}
                      className='w-full h-full object-cover rounded-lg'
                      style={{ maxHeight: postDetail.images && postDetail.images.length === 1 ? '500px' : '250px' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )} */}

          {/* Action buttons */}
          <div className='border-t border-gray-100 pt-4'>
            <div className='flex items-center space-x-6'>
              <button
                onClick={showCommentModal}
                className='flex items-center space-x-2 text-gray-500 hover:text-pink-600 transition-colors'
              >
                <FaRegCommentDots />
                <span>View All Comments</span>
              </button>
            </div>
          </div>
        </div>

        {/* Comments section */}
      </div>

      {/* Comment Modal (Instagram style) */}
      <Modal
        visible={isCommentModalVisible}
        onCancel={handleCommentModalCancel}
        footer={null}
        width={800}
        centered
        closable={false}
        bodyStyle={{ padding: 0 }}
        className='instagram-modal'
      >
        <div className='flex flex-col h-[80vh]'>
          {/* Header */}
          <div className='p-3 border-b flex items-center justify-between'>
            <div className='flex items-center'>
              <img
                src={postDetail?.userAvatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'}
                alt='User'
                className='w-8 h-8 rounded-full mr-2 object-cover'
              />
              <div>
                <p className='font-semibold text-sm'>{postDetail?.fullName}</p>
                {postDetail?.location && <p className='text-xs text-gray-500'>{postDetail.location}</p>}
              </div>
            </div>
            <button onClick={handleCommentModalCancel} className='text-gray-500'>
              <MdClose size={24} />
            </button>
          </div>

          {/* Post tags in modal - improved visual layout with expand/collapse capability */}
          {displayTags.length > 0 && (
            <div className='p-3 border-b'>
              <div className='text-xs text-gray-500 mb-2'>Topics:</div>
              <div className='flex flex-wrap gap-2'>
                {displayTags.map((tag) => (
                  <ModalTag key={tag.id} tag={tag} />
                ))}
              </div>
            </div>
          )}

          {/* Post content */}
          <div className='p-3 border-b'>
            <div className='flex items-start space-x-3'>
              <img
                src={postDetail.userAvatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'}
                alt={postDetail.fullName}
                className='w-8 h-8 rounded-full object-cover'
              />
              <div className='flex-1'>
                <div>
                  <span className='font-semibold text-sm mr-2'>{postDetail.fullName}</span>
                  <span className='text-sm'>
                    {formatContent(postDetail.content || postDetail.shortDescription || '')}
                  </span>
                </div>
                <div className='text-xs text-gray-500 mt-1'>{postDetail.timeAgo}</div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className='p-3 border-b'>
            <div className='flex justify-between mb-2'>
              <div className='flex space-x-4'>
                <button className='text-2xl'>
                  <FaRegHeart />
                </button>
                <button className='text-2xl'>
                  <FaRegComment />
                </button>
                <button className='text-2xl'>
                  <FaShare />
                </button>
              </div>
            </div>
            {postDetail?.likes && postDetail.likes > 0 && (
              <p className='font-semibold text-sm'>{postDetail.likes} likes</p>
            )}
            <p className='text-xs text-gray-500'>{postDetail?.timeAgo}</p>
          </div>

          {/* Comments section */}
          <div className='flex-1 overflow-y-auto p-3 border-b'>
            {/* Comments list */}
            {loading ? (
              <div className='flex justify-center items-center h-32'>
                <Spin size='small' />
              </div>
            ) : (
              <>
                {listComment.length === 0 ? (
                  <div className='text-center py-8'>
                    <p className='text-gray-500'>No comments yet</p>
                    <p className='text-sm text-gray-400'>Be the first to comment</p>
                  </div>
                ) : (
                  listComment.map((comment) => (
                    <div key={comment.id}>
                      <ModalCommentItem comment={comment} />

                      {/* Replies */}
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
                                <ModalCommentItem key={reply.id} comment={reply} isReply={true} />
                              ))}

                              {/* Hide replies button */}
                              <button
                                onClick={() => hideReplies(comment.id)}
                                className='text-sm text-gray-500 hover:underline mt-1'
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
              type='text'
              placeholder='Add a comment...'
              className='flex-1 border-none focus:outline-none'
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button
              onClick={handleCommentSubmit}
              disabled={!commentText.trim() || submitting}
              className={`font-semibold ${!commentText.trim() || submitting ? 'text-blue-300' : 'text-blue-500'}`}
            >
              Post
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default CommunityCommentDetails
