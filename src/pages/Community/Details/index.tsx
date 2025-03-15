import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaHeart, FaReply, FaShare, FaFlag, FaLongArrowAltLeft } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { selectBlogInfo } from '@/store/modules/global/selector'
import EnhancedFetalChart from '@/pages/Member/FetalGrowthChartDetail/Components/Charts/EnhancedFetalChart'
import { Spin, message } from 'antd'
import { getBlogById } from '@/services/blogService'
import ROUTES from '@/utils/config/routes'

const CommunityCommentDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isLiked, setIsLiked] = useState(false)
  const [showReplyBox, setShowReplyBox] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [comments, setComments] = useState([])
  const [postDetail, setPostDetail] = useState([])

  const blogs = useSelector(selectBlogInfo) || []

  useEffect(() => {
    // First try to find the post in the Redux store
    const existingBlog = blogs.find((blog) => blog.id === id)

    if (existingBlog) {
      setPostDetail(existingBlog)
    } else {
      // If not in store, fetch it directly
      fetchPostDetails()
    }
  }, [id, blogs])

  const fetchPostDetails = async () => {
    try {
      setLoading(true)
      const response = await getBlogById(id)
      if (response.success && response.response) {
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

  useEffect(() => {
    if (postDetail && postDetail.type === 'community' && postDetail.sharedChartData) {
      try {
        // Parse the chart data from JSON string
        const parsedData = JSON.parse(postDetail.sharedChartData)
        setChartData(parsedData)
      } catch (error) {
        console.error('Failed to parse chart data:', error)
        message.error('Failed to load chart data')
      }
    }
  }, [postDetail])

  const addComment = () => {
    if (newComment.trim() === '') return

    setComments([
      ...comments,
      {
        id: comments.length + 1,
        user: {
          name: 'You',
          avatar: 'https://via.placeholder.com/150',
          expertise: 'Community Member'
        },
        content: newComment,
        timestamp: 'Just now'
      }
    ])
    setNewComment('')
  }

  if (loading) {
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
                <h2 className='font-semibold text-gray-800'>{postDetail.userName || 'Community Member'}</h2>
                <span className='text-sm text-pink-600 bg-pink-50 px-2 py-1 rounded-full'>
                  {postDetail.type === 'chart' ? 'Shared Chart' : 'Discussion'}
                </span>
              </div>
              <div className='text-sm text-gray-500'>
                <span>{new Date(postDetail.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Post title and content */}
          <h1 className='text-2xl font-bold mb-4'>{postDetail.pageTitle}</h1>
          <div className='prose max-w-none mb-6'>
            <p className='text-gray-700 leading-relaxed'>{postDetail.content || postDetail.shortDescription}</p>
          </div>

          {/* Chart visualization if it's a chart post */}
          {postDetail.type === 'community' && chartData && (
            <div className='my-6 border border-gray-200 rounded-lg p-4'>
              <h3 className='text-lg font-semibold mb-3'>Fetal Growth Chart</h3>
              <EnhancedFetalChart fetalData={chartData} />
            </div>
          )}

          {/* Featured image display */}
          {postDetail.featuredImageUrl && postDetail.type === 'chart' && (
            <div className='my-6'>
              <img
                src={postDetail.featuredImageUrl}
                alt={postDetail.pageTitle}
                className='max-w-full h-auto rounded-lg'
              />
            </div>
          )}

          {/* Action buttons */}
          <div className='border-t border-gray-100 pt-4'>
            <div className='flex items-center space-x-6'>
              <button
                onClick={() => setShowReplyBox(!showReplyBox)}
                className='flex items-center space-x-2 text-gray-500 hover:text-pink-600 transition-colors'
              >
                <FaReply />
                <span>Reply</span>
              </button>

              <button className='flex items-center space-x-2 text-gray-500 hover:text-pink-600 transition-colors'>
                <FaShare />
                <span>Share</span>
              </button>
            </div>

            {/* Reply box */}
            {showReplyBox && (
              <div className='mt-4'>
                <textarea
                  className='w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all'
                  placeholder='Write your supportive reply...'
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
                <div className='mt-2 flex justify-end space-x-2'>
                  <button
                    onClick={() => setShowReplyBox(false)}
                    className='px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors'
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addComment}
                    className='px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors'
                  >
                    Reply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Comments section */}
        <div className='mb-6 space-y-4'>
          {comments.map((c) => (
            <div
              key={c.id}
              className='flex items-start space-x-4 p-4 bg-white border border-gray-200 rounded-lg shadow-md'
            >
              <img src={c.user.avatar} alt={c.user.name} className='w-10 h-10 rounded-full object-cover' />
              <div>
                <div className='flex items-center space-x-2 mb-1'>
                  <h4 className='font-semibold text-gray-800'>{c.user.name}</h4>
                  <span className='text-sm text-pink-600 bg-pink-50 px-2 py-1 rounded-full'>{c.user.expertise}</span>
                </div>
                <p className='text-gray-700'>{c.content}</p>
                <span className='text-sm text-gray-500'>{c.timestamp}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Add comment section */}
        <div className='bg-white rounded-xl shadow-lg p-6'>
          <h3 className='text-gray-800 font-semibold mb-2'>Add Your Comment</h3>
          <textarea
            className='w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all'
            placeholder='Share your thoughts...'
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <div className='mt-2 flex justify-end space-x-2'>
            <button
              onClick={() => setNewComment('')}
              className='px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors'
            >
              Cancel
            </button>
            <button
              onClick={addComment}
              className='px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors'
            >
              Post Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommunityCommentDetails
