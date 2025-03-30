import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getBlogById } from '@/services/blogService'

interface Blog {
  id: string
  pageTitle: string
  fullName: string
  timeAgo: string
  viewCount: number
  status: string
  tags: Array<{ id: string; name: string }>
  shortDescription: string
  featuredImageUrl: string
  avatarUrl: string
  content: string
}

export default function BlogDetailsPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [blogData, setBlogData] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        if (id) {
          const response = await getBlogById(id)
          setBlogData(response.response)
        }
      } catch (error) {
        console.error('Error fetching blog:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [id])

  const goBack = () => {
    navigate(-1)
  }

  if (loading || !blogData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className='bg-gray-50 min-h-screen text-gray-800 mt-20'>
      <main className='container mx-auto py-8 px-4'>
        <div className='flex items-center gap-4 mb-4'>
          <img 
            src={blogData.avatarUrl} 
            alt={blogData.fullName}
            className='w-12 h-12 rounded-full object-cover border-2 border-[#ff6b81]'
          />
          <div>
            <h2 className='text-3xl font-bold text-[#ff6b81]'>{blogData.pageTitle}</h2>
            <p className='text-gray-600'>{blogData.timeAgo}</p>
          </div>
        </div>

        <div className='mt-6 flex flex-col lg:flex-row gap-8'>
          <div className='lg:w-2/3'>
            <img
              src={blogData.featuredImageUrl}
              alt={blogData.pageTitle}
              className='rounded-lg mb-2 w-full h-[300px] object-cover shadow-lg'
            />
          </div>

          {/* Introduction Section with Custom Styling */}
          <div className='lg:w-1/3'>
            <section>
              <div className='bg-[#ff6b81] text-white rounded-t-lg p-1 flex items-center justify-center'>
                <h5 className='text-1xl font-semibold'>Introduction</h5>
              </div>
              <p className='mt-4 text-base font-light border-l-4 border-[#ff6b81] pl-4'>
                {blogData.shortDescription}
              </p>
            </section>
          </div>
        </div>

        <div className='mt-3'>
          <div className='lg:w-2/3'>
            <section className='prose prose-lg max-w-none'>
              <div dangerouslySetInnerHTML={{ __html: blogData.content }} />
            </section>
          </div>
        </div>

        <div className='flex justify-start mt-8'>
          <button 
            onClick={goBack} 
            className='px-4 py-2 bg-[#ff6b81] text-white rounded-md hover:bg-[#ff6b81]/90 transition-colors duration-200'
          >
            Go Back
          </button>
        </div>
      </main>
    </div>
  )
}
