import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Spin, Button } from 'antd'
import { useSelector } from 'react-redux'
import { selectUserInfo } from '@/store/modules/global/selector'
import { getBlogById, postBlogView } from '@/services/blogService'
import ROUTES from '@/utils/config/routes'
import styled from 'styled-components'
import PostDetail from '../components/PostDetail'
import CommentSystem from '../components/CommentSystem'
import { ArrowLeft, MessageCircle } from 'lucide-react'

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, #f0f8ff, #f6e3e1);
`

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 5rem;

  @media (max-width: 768px) {
    padding-top: 4rem;
  }
`

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4b5563;
  background: none;
  border: none;
  padding: 0.5rem 0;
  margin-bottom: 2rem;
  cursor: pointer;
  transition: color 0.2s;
  font-weight: 500;

  &:hover {
    color: #ef4444;
  }
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;

  .ant-spin-dot-item {
    background-color: #ef4444;
  }
`

const ErrorContainer = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin: 2rem 0;
`

const ErrorTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1.5rem;
`

const ErrorButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #dc2626;
    transform: translateY(-1px);
  }
`

const CommunityDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const currentUser = useSelector(selectUserInfo)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false)
  const [commentCount, setCommentCount] = useState(0)

  useEffect(() => {
    const fetchPostDetails = async () => {
      if (!id) return

      try {
        setLoading(true)

        // Record view
        try {
          await postBlogView(id)
        } catch (viewError) {
          console.error('Failed to record view:', viewError)
        }

        // Fetch post details
        const response = await getBlogById(id)

        if (response.success && response.response) {
          // Parse chart data if available
          if (response.response.sharedChartData) {
            try {
              const parsedData = JSON.parse(response.response.sharedChartData)
            } catch (parseError) {
              console.error('Failed to parse chart data:', parseError)
            }
          }
        } else {
          setError('Post not found')
        }
      } catch (error) {
        console.error('Failed to fetch post details:', error)
        setError('Failed to load post details')
      } finally {
        setLoading(false)
      }
    }

    fetchPostDetails()
  }, [id])

  const handleCommentCountChange = (count: number) => {
    setCommentCount(count)
  }

  if (loading) {
    return (
      <PageContainer>
        <ContentContainer>
          <BackButton onClick={() => navigate(ROUTES.COMMUNITY)}>
            <ArrowLeft size={18} />
            Back to Community
          </BackButton>
          <LoadingContainer>
            <Spin size='large' tip='Loading post details...' />
          </LoadingContainer>
        </ContentContainer>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        <ContentContainer>
          <BackButton onClick={() => navigate(ROUTES.COMMUNITY)}>
            <ArrowLeft size={18} />
            Back to Community
          </BackButton>
          <ErrorContainer>
            <ErrorTitle>{error}</ErrorTitle>
            <ErrorButton onClick={() => navigate(ROUTES.COMMUNITY)}>Back to Community</ErrorButton>
          </ErrorContainer>
        </ContentContainer>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <ContentContainer>
        {/* Post Detail Component */}
        <PostDetail postId={id || ''} currentUser={currentUser} onBack={() => navigate(ROUTES.COMMUNITY)} />

        {/* Modal Comment System */}
        <CommentSystem
          postId={id || ''}
          currentUser={currentUser}
          modalMode={true}
          isVisible={isCommentModalVisible}
          onClose={() => setIsCommentModalVisible(false)}
          onCommentCountChange={handleCommentCountChange}
        />
      </ContentContainer>
    </PageContainer>
  )
}

export default CommunityDetail
