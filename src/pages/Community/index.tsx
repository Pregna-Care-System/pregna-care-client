import ROUTES from '@/utils/config/routes'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const CommunityPage = () => {
  const [posts, setPosts] = useState<
    {
      id: number
      author: string
      avatar: string
      content: string
      category: string
      likes: number
      comments: number
      timeAgo: string
    }[]
  >([])
  const [loading, setLoading] = useState(true)

  const dummyPosts = [
    {
      id: 1,
      author: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
      content: 'Just felt my baby kick for the first time! Such an amazing moment ❤️',
      category: 'Second Trimester',
      likes: 245,
      comments: 56,
      timeAgo: '2h ago'
    },
    {
      id: 2,
      author: 'Emily Davis',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      content: 'Looking for advice on morning sickness remedies. What worked for you?',
      category: 'First Trimester',
      likes: 182,
      comments: 89,
      timeAgo: '4h ago'
    },
    {
      id: 3,
      author: 'Dr. Lisa Martinez',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2',
      content: 'Weekly Expert Tip: Stay hydrated! Aim for 8-10 glasses of water daily.',
      category: 'Expert Advice',
      likes: 456,
      comments: 34,
      timeAgo: '6h ago'
    }
  ]

  useEffect(() => {
    setPosts(dummyPosts)
    setLoading(false)
  }, [])

  const PostCard: React.FC<{
    post: {
      id: number
      author: string
      avatar: string
      content: string
      category: string
      likes: number
      comments: number
      timeAgo: string
    }
  }> = ({ post }) => (
    <Link to={ROUTES.COMMUNITY_DETAILS} className='block hover:no-underline'>
      <div className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300'>
        <div className='flex items-center mb-4'>
          <img
            src={post.avatar}
            alt={`${post.author}'s avatar`}
            className='w-12 h-12 rounded-full object-cover'
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.onerror = null
              target.src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
            }}
          />
          <div className='ml-4'>
            <h3 className='font-semibold text-lg'>{post.author}</h3>
            <span className='text-gray-500 text-sm'>{post.timeAgo}</span>
          </div>
        </div>
        <p className='text-gray-700 mb-4'>{post.content}</p>
        <div className='flex items-center justify-between'>
          <span className='bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm'>{post.category}</span>
          <div className='flex space-x-4'>
            <span className='flex items-center text-gray-600'>❤️ {post.likes}</span>
            <span className='flex items-center text-gray-600'>💬 {post.comments}</span>
          </div>
        </div>
      </div>
    </Link>
  )

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Main Content */}
      <main className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mt-14'>
          {/* Community Feed */}
          <div className='lg:col-span-2'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-2xl font-semibold text-gray-800'>Community Feed</h2>
              <button className='bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors duration-300'>
                Create Post
              </button>
            </div>
            {loading ? (
              <div className='flex justify-center items-center h-64'>
                <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500'></div>
              </div>
            ) : (
              <div className='space-y-6'>
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
              <h3 className='text-xl font-semibold mb-4'>Trending Topics</h3>
              <div className='space-y-4'>
                <button className='block w-full text-left px-4 py-2 rounded-lg bg-gray-50 hover:bg-purple-50 transition-colors duration-300'>
                  #MorningWellness
                </button>
                <button className='block w-full text-left px-4 py-2 rounded-lg bg-gray-50 hover:bg-purple-50 transition-colors duration-300'>
                  #PregnancyDiet
                </button>
                <button className='block w-full text-left px-4 py-2 rounded-lg bg-gray-50 hover:bg-purple-50 transition-colors duration-300'>
                  #BabyKicks
                </button>
              </div>
            </div>

            <div className='bg-white rounded-lg shadow-md p-6'>
              <h3 className='text-xl font-semibold mb-4'>Weekly Resources</h3>
              <div className='space-y-4'>
                <a
                  href='#'
                  className='block p-4 rounded-lg bg-pink-50 hover:bg-pink-100 transition-colors duration-300'
                >
                  <h4 className='font-medium text-pink-800'>Pregnancy Exercise Guide</h4>
                  <p className='text-sm text-gray-600 mt-1'>Safe workouts for each trimester</p>
                </a>
                <a
                  href='#'
                  className='block p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors duration-300'
                >
                  <h4 className='font-medium text-purple-800'>Nutrition Tips</h4>
                  <p className='text-sm text-gray-600 mt-1'>Essential nutrients for you and baby</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CommunityPage
