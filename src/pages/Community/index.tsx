import ROUTES from '@/utils/config/routes'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectBlogInfo } from '@/store/modules/global/selector'
import { selectUserInfo } from '@/store/modules/global/selector'
import { Tabs } from 'antd'

const { TabPane } = Tabs

const CommunityPage = () => {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const blogPosts = useSelector(selectBlogInfo) || []
  const currentUser = useSelector(selectUserInfo)

  useEffect(() => {
    dispatch({ type: 'GET_ALL_BLOGS' })
    setLoading(false)
  }, [dispatch])

  // Filter blog posts to get only chart posts with empty status and regular posts
  const discussionPosts = blogPosts.filter((post) => !post.type || post.type !== 'chart')
  const myPosts = blogPosts.filter((post) => post.userId === currentUser?.id)

  // Your existing post card component
  const PostCard = ({ post }) => (
    <Link to={`${ROUTES.COMMUNITY}/${post.id}`} className='block hover:no-underline'>
      <div className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300'>
        <div className='flex items-center mb-4'>
          <img
            src={post.userAvatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'}
            alt={`${post.userName}'s avatar`}
            className='w-12 h-12 rounded-full object-cover'
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.onerror = null
              target.src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
            }}
          />
          <div className='ml-4'>
            <h3 className='font-semibold text-lg'>{post.userName || 'Community Member'}</h3>
            <span className='text-gray-500 text-sm'>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <p className='text-gray-700 mb-4'>{post.shortDescription}</p>
        <div className='flex items-center justify-between'>
          <span className='bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm'>
            {post.type === 'chart' ? 'Shared Chart' : 'Discussion'}
          </span>
        </div>
      </div>
    </Link>
  )

  return (
    <div className='min-h-screen bg-red-50 mt-12'>
      {/* Main Content */}
      <main className='px-4 py-8'>
        <div className='mt-14 container mx-auto'>
          {/* Community Feed */}
          <div className='lg:col-span-2'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-2xl font-semibold text-gray-800'>Community Feed</h2>
              <button className='bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors duration-300'>
                Create Post
              </button>
            </div>

            <Tabs defaultActiveKey='1'>
              <TabPane tab='Discussions' key='1'>
                {loading ? (
                  <div className='flex justify-center items-center h-64'>
                    <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500'></div>
                  </div>
                ) : (
                  <div className='space-y-6'>
                    {discussionPosts.map((post) => (
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
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {myPosts.map((post) => (
                      <div key={post.id} className='col-span-1 md:col-span-2'>
                        <PostCard post={post} />
                      </div>
                    ))}

                    {myPosts.length === 0 && !loading && (
                      <div className='col-span-2 text-center py-12 bg-white rounded-lg shadow'>
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
    </div>
  )
}

export default CommunityPage
