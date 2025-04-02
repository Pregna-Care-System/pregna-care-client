import type React from 'react'
import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { getBlogById, postBlogView } from '@/services/blogService'
import TagDisplay from '../TagDisplay'
import ReactionSystem from '../ReactionSystem'
import CommentSystem from '../CommentSystem'
import ROUTES from '@/utils/config/routes'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import ContentFormatter from '../ContentFormatter'
import EnhancedFetalChart from '@/pages/Member/FetalGrowthChartDetail/Components/Charts/EnhancedFetalChart'
import UserAvatar from '@/components/common/UserAvatar'

interface Tag {
  id: string
  name: string
  color?: string
}

interface BlogPost {
  id: string
  pageTitle: string
  content?: string
  shortDescription?: string
  type: 'community' | 'chart'
  userId: string
  fullName: string
  userAvatarUrl: string
  timeAgo: string
  featuredImageUrl?: string
  sharedChartData?: string
  images?: string[]
  likes?: number
  location?: string
  tags?: Tag[]
  blogTags?: { tag: Tag }[]
  reactionsCount?: number
  userReaction?: string
}

interface PostDetailProps {
  postId: string
  currentUser: any
  onBack?: () => void
  className?: string
}

const Container = styled.div`
  min-height: 100vh;
  padding: 1rem;
`

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4b5563;
  background: none;
  border: none;
  padding: 0.5rem 0;
  margin-bottom: 1.5rem;
  cursor: pointer;
  transition: color 0.2s;
  font-weight: 500;

  &:hover {
    color: #ef4444;
  }
`

const Card = styled.div`
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  overflow: hidden;
`

const PostHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
`

const Avatar = styled.img`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const UserInfo = styled.div`
  flex: 1;
`

const UserMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const UserName = styled.h2`
  font-weight: 600;
  color: #111827;
  margin: 0;
  font-size: 1.125rem;
`

const PostType = styled.span`
  font-size: 0.75rem;
  color: #ef4444;
  background-color: #fef2f2;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-weight: 500;
`

const PostTime = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
`

const PostTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #111827;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

const TagsSection = styled.div`
  margin-bottom: 1.5rem;
`

const TagsLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
  font-weight: 500;
`

const PostContent = styled.div`
  color: #374151;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 1.0625rem;
`

const ChartContainer = styled.div`
  margin: 1.5rem 0;
  border: 1px solid #f3f4f6;
  border-radius: 0.5rem;
  padding: 1.25rem;
  background-color: #f9fafb;
`

const ChartTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #111827;
`

const ActionBar = styled.div`
  padding: 0.75rem 0;
  border-top: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
`

const ActionButtons = styled.div`
  padding: 0.75rem 0;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #f3f4f6;
  position: relative;
`

const ActionButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  color: #4b5563;
  background: none;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    background-color: #f9fafb;
    color: #111827;
  }

  svg {
    margin-right: 0.5rem;
  }
`

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;

  .spinner {
    border: 3px solid #f3f4f6;
    border-top: 3px solid #ef4444;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

const PostImage = styled.img`
  width: 100%;
  max-height: 500px;
  object-fit: cover;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
`

// Convert HTML content to plain text
const convertHtmlToPlainText = (htmlContent: string): string => {
  if (!htmlContent) return ''

  // Create a temporary DOM element
  const tempElement = document.createElement('div')
  tempElement.innerHTML = htmlContent

  // Get the text content (this preserves line breaks and spacing)
  const plainText = tempElement.textContent || tempElement.innerText || ''

  return plainText.trim()
}

const PostDetail: React.FC<PostDetailProps> = ({ postId, currentUser, onBack, className }) => {
  const [loading, setLoading] = useState(true)
  const [postDetail, setPostDetail] = useState<BlogPost | null>(null)
  const [chartData, setChartData] = useState(null)
  const [error, setError] = useState<string | null>(null)
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [commentCount, setCommentCount] = useState(0)

  // Fetch post details
  const fetchPostDetails = async () => {
    if (!postId) return

    try {
      setLoading(true)
      const response = await getBlogById(postId)
      if (response.success && response.response) {
        setPostDetail(response.response)

        // Record view
        try {
          await postBlogView(postId)
        } catch (viewError) {
          console.error('Failed to record view:', viewError)
        }

        // Parse chart data if available
        if (response.response.sharedChartData) {
          try {
            const parsedData = JSON.parse(response.response.sharedChartData)
            setChartData(parsedData)
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

  // Handle back button click
  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      window.history.back()
    }
  }

  // Fetch post details on mount
  useEffect(() => {
    fetchPostDetails()
  }, [postId])

  // Extract tags from either tags or blogTags property
  const displayTags = postDetail?.tags || postDetail?.blogTags?.map((bt) => bt.tag) || []

  // Add a handler for comment count changes
  const handleCommentCountChange = (count: number) => {
    setCommentCount(count)
  }

  if (loading) {
    return (
      <Container className={className}>
        <Content>
          <BackButton onClick={handleBack}>
            <ArrowLeft size={18} />
            Back to Community
          </BackButton>
          <LoadingSpinner>
            <div className='spinner'></div>
          </LoadingSpinner>
        </Content>
      </Container>
    )
  }

  if (error || !postDetail) {
    return (
      <Container className={className}>
        <Content>
          <BackButton onClick={handleBack}>
            <ArrowLeft size={18} />
            Back to Community
          </BackButton>
          <Card>
            <div className='text-center py-12'>
              <h2 className='text-2xl font-bold mb-4'>{error || 'Post not found'}</h2>
              <button
                onClick={() => (window.location.href = ROUTES.COMMUNITY)}
                className='px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors'
              >
                Back to Community
              </button>
            </div>
          </Card>
        </Content>
      </Container>
    )
  }

  return (
    <Container className={className}>
      <Content>
        <BackButton onClick={handleBack}>
          <ArrowLeft size={18} />
          Back to Community
        </BackButton>

        <Card>
          {/* Post header */}
          <PostHeader>
            <UserAvatar src={postDetail.avatarUrl} name={postDetail.fullName} size={48} />
            <UserInfo>
              <UserMeta>
                <UserName>{postDetail.fullName || 'Community Member'}</UserName>
                <PostType>{postDetail.type === 'chart' ? 'Shared Chart' : 'Discussion'}</PostType>
              </UserMeta>
              <PostTime>{postDetail.timeAgo}</PostTime>
            </UserInfo>
          </PostHeader>

          {/* Post title and content */}
          <PostTitle>{postDetail.pageTitle}</PostTitle>

          {/* Post tags */}
          {displayTags.length > 0 && (
            <TagsSection>
              <TagsLabel>Topics:</TagsLabel>
              <TagDisplay tags={displayTags} maxVisible={5} />
            </TagsSection>
          )}

          {/* Featured image if available */}
          {/* {postDetail.featuredImageUrl && <PostImage src={postDetail.featuredImageUrl} alt={postDetail.pageTitle} />} */}

          <PostContent>
            <ContentFormatter content={postDetail.content || postDetail.shortDescription || ''} />
          </PostContent>

          {/* Chart visualization if it's a chart post */}
          {chartData && (
            <ChartContainer>
              <ChartTitle>Fetal Growth Chart</ChartTitle>
              {/* Render chart component here */}
              <EnhancedFetalChart fetalData={chartData} sharing={false} />
            </ChartContainer>
          )}

          {/* Reaction count */}
          <ActionBar>
            <ReactionSystem
              postId={postDetail.id}
              currentUserId={currentUser?.id}
              initialCount={postDetail.reactionsCount || postDetail.likes || 0}
              initialUserReaction={postDetail.userReaction || ''}
              displayMode='counter'
              size='small'
            />
          </ActionBar>

          {/* Action buttons */}
          <ActionButtons>
            <ReactionSystem
              postId={postDetail.id}
              currentUserId={currentUser?.id}
              initialUserReaction={postDetail.userReaction || ''}
              displayMode='button'
            />

            <ActionButton onClick={() => setShowCommentModal(true)}>
              <MessageCircle size={18} />
              <span>Comment {commentCount > 0 ? `(${commentCount})` : ''}</span>
            </ActionButton>
          </ActionButtons>
          {/* Modal Comment System */}
          <CommentSystem
            postId={postDetail.id}
            currentUser={currentUser}
            modalMode={true}
            isVisible={showCommentModal}
            onClose={() => setShowCommentModal(false)}
            onCommentCountChange={handleCommentCountChange}
          />
        </Card>
      </Content>
    </Container>
  )
}

export default PostDetail
