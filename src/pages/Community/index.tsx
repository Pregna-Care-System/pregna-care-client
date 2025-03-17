import ROUTES from '@/utils/config/routes'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectBlogInfo, selectUserInfo, selectTagInfo } from '@/store/modules/global/selector'
import { Tabs, message } from 'antd'
import { FaRegComment, FaShare } from 'react-icons/fa'
import { MdMoreHoriz } from 'react-icons/md'
import { AiOutlineLike } from 'react-icons/ai'
import PostCreationModal from '@/components/PostCreationModal'

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
  const [submitting, setSubmitting] = useState(false)

  const dispatch = useDispatch()
  const blogPosts = useSelector(selectBlogInfo) || []
  const currentUser = useSelector(selectUserInfo)
  const tags = useSelector(selectTagInfo) || ([] as Tag[])

  useEffect(() => {
    dispatch({ type: 'GET_ALL_BLOGS' })
    dispatch({ type: 'GET_ALL_TAGS' })
    setLoading(false)
  }, [dispatch])

  // For debugging - log the blog posts to see their structure
  useEffect(() => {
    if (blogPosts && blogPosts.length > 0) {
      console.log('Blog posts with tags:', blogPosts)
    }
  }, [blogPosts])

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

  // Navigate to post detail page when clicking on comment
  const navigateToPostDetail = (postId: string) => {
    navigate(`${ROUTES.COMMUNITY}/${postId}`)
  }

  // Updated post card component to match Facebook style
  const PostCard = ({ post }: { post: BlogPost }) => {
    // Extract tags from either tags or blogTags property
    const displayTags = post.tags || post.blogTags?.map((bt) => bt.tag) || []

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
            <button className='text-gray-500 hover:bg-gray-100 p-2 rounded-full'>
              <MdMoreHoriz />
            </button>
          </div>

          {/* Post content */}
          <Link to={`${ROUTES.COMMUNITY}/${post.id}`} className='block hover:no-underline'>
            <div className='mt-3 text-gray-800'>{formatContent(post.content || post.shortDescription || '')}</div>
          </Link>

          {/* Post tags */}
          {displayTags.length > 0 && (
            <div className='mt-2 flex flex-wrap gap-1'>
              {displayTags.map((tag) => (
                <span key={tag.id} className='inline-block px-2 py-1 bg-pink-50 text-pink-600 text-xs rounded-full'>
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Post images */}
        {post.images && post.images.length > 0 && (
          <Link to={`${ROUTES.COMMUNITY}/${post.id}`} className='block hover:no-underline'>
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
        {post.likes && post.likes > 0 && (
          <div className='px-4 py-2 flex items-center border-t border-gray-100'>
            <div className='bg-blue-500 text-white rounded-full p-1 text-xs'>
              <AiOutlineLike size={12} />
            </div>
            <span className='text-gray-500 text-sm ml-2'>{post.likes}</span>
          </div>
        )}

        {/* Action buttons */}
        <div className='px-2 py-1 flex justify-between border-t border-gray-100'>
          <button className='flex-1 flex items-center justify-center py-2 text-gray-500 hover:bg-gray-100 rounded-md'>
            <AiOutlineLike className='mr-2' />
            <span>Thích</span>
          </button>
          <button
            className='flex-1 flex items-center justify-center py-2 text-gray-500 hover:bg-gray-100 rounded-md'
            onClick={() => navigateToPostDetail(post.id)}
          >
            <FaRegComment className='mr-2' />
            <span>Bình luận</span>
          </button>
          <button className='flex-1 flex items-center justify-center py-2 text-gray-500 hover:bg-gray-100 rounded-md'>
            <FaShare className='mr-2' />
            <span>Chia sẻ</span>
          </button>
        </div>
      </div>
    )
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
    </div>
  )
}

export default CommunityPage
