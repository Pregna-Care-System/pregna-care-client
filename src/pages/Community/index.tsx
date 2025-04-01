import { useEffect, useState } from 'react'
import { Tabs, message, Spin, Tooltip, Pagination, Modal, Button } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { selectBlogInfo, selectUserInfo, selectTagInfo } from '@/store/modules/global/selector'
import styled from 'styled-components'
import PostCreationModal from '@/components/PostCreationModal'
import PostCard from './components/PostCard'
import { PlusIcon } from 'lucide-react'
import { style } from '@/theme'
import { useNavigate } from 'react-router-dom'
import ROUTES from '@/utils/config/routes'

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
  tags?: { id: string; name: string }[]
  blogTags?: { tag: { id: string; name: string } }[]
  userReaction?: string
  reactions?: {
    type: string
    count: number
  }[]
  reactionsCount?: number
}

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, #f0f8ff, #f6e3e1);
  margin-top: 1.5rem;
`

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-top: 5rem;

  @media (max-width: 768px) {
    padding-top: 4rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #ef4444;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #dc2626;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`

const PostGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  margin-bottom: 2rem;
`

const StyledTabs = styled(Tabs)`
  .ant-tabs-nav::before {
    border-bottom-color: #f3f4f6;
  }

  .ant-tabs-tab {
    padding: 0.75rem 1rem;
    font-size: 1rem;

    &:hover {
      color: #ef4444;
    }
  }

  .ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #ef4444 !important;
    font-weight: 600;
  }

  .ant-tabs-ink-bar {
    background-color: #ef4444;
    height: 3px;
    border-radius: 3px 3px 0 0;
  }
`
const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 16px;
    overflow: hidden;
  }

  .ant-modal-header {
    text-align: center;
    padding: 24px 24px 0;
    border-bottom: none;
  }

  .ant-modal-title {
    font-size: 24px !important;
    font-weight: 600;
    color: ${style.COLORS.RED.RED_5};
  }

  .ant-modal-body {
    padding: 24px;
  }

  .membership-content {
    text-align: center;
  }

  .membership-image {
    width: 180px;
    height: 180px;
    margin: 0 auto 24px;
  }

  .membership-subtitle {
    font-size: 16px;
    color: #666;
    margin-bottom: 24px;
  }

  .benefits-list {
    text-align: left;
    margin: 20px 0;
    padding: 0;
    list-style: none;

    li {
      margin: 12px 0;
      display: flex;
      align-items: center;
      gap: 12px;
      color: #444;
      font-size: 15px;

      svg {
        color: ${style.COLORS.RED.RED_5};
        font-size: 16px;
      }
    }
  }

  .ant-modal-footer {
    border-top: none;
    padding: 0 24px 24px;
    text-align: center;

    .ant-btn {
      height: 40px;
      padding: 0 24px;
      font-size: 15px;
      border-radius: 8px;
    }

    .ant-btn-default {
      border-color: ${style.COLORS.RED.RED_5};
      color: ${style.COLORS.RED.RED_5};

      &:hover {
        color: ${style.COLORS.RED.RED_4};
        border-color: ${style.COLORS.RED.RED_4};
      }
    }

    .ant-btn-primary {
      background: ${style.COLORS.RED.RED_5};
      border-color: ${style.COLORS.RED.RED_5};

      &:hover {
        background: ${style.COLORS.RED.RED_4};
        border-color: ${style.COLORS.RED.RED_4};
      }
    }
  }
`
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20rem;

  .ant-spin-dot-item {
    background-color: #ef4444;
  }
`

const EmptyStateContainer = styled.div`
  background-color: white;
  border-radius: 0.75rem;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin: 2rem 0;
`

const EmptyStateTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
`

const EmptyStateText = styled.p`
  color: #6b7280;
  font-size: 1rem;
  max-width: 24rem;
  margin: 0 auto;
`

const EmptyStateIcon = styled.div`
  width: 4rem;
  height: 4rem;
  background-color: #fef2f2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  color: #ef4444;
`

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;

  .ant-pagination-item-active {
    border-color: #ef4444;

    a {
      color: #ef4444;
    }
  }

  .ant-pagination-item:hover {
    border-color: #ef4444;

    a {
      color: #ef4444;
    }
  }

  .ant-pagination-prev:hover .ant-pagination-item-link,
  .ant-pagination-next:hover .ant-pagination-item-link {
    color: #ef4444;
    border-color: #ef4444;
  }
`

const CommunityPage = () => {
  const dispatch = useDispatch()
  const blogPosts = useSelector(selectBlogInfo) || []
  const currentUser = useSelector(selectUserInfo)
  const tags = useSelector(selectTagInfo) || []

  const [loading, setLoading] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [currentEditPost, setCurrentEditPost] = useState<BlogPost | null>(null)
  const [isModalCheckRole, setIsModalCheckRole] = useState(false)
  const navigate = useNavigate() 
  // Pagination states
  const [currentDiscussionsPage, setCurrentDiscussionsPage] = useState(1)
  const [currentMyPostsPage, setCurrentMyPostsPage] = useState(1)
  const postsPerPage = 5

  useEffect(() => {
    dispatch({ type: 'GET_ALL_BLOGS', payload: { type: 'community' } })
    dispatch({ type: 'GET_ALL_TAGS' })

    // Simulate loading for demo purposes
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [dispatch])

  // Filter blog posts to get only community posts
  const discussionPosts = blogPosts.filter((post: BlogPost) => !post.type || post.type.toLowerCase() === 'community')

  // Filter to get only the current user's posts
  const myPosts = blogPosts.filter((post: BlogPost) => post.userId === currentUser?.id)

  // Get current posts for pagination
  const indexOfLastDiscussionPost = currentDiscussionsPage * postsPerPage
  const indexOfFirstDiscussionPost = indexOfLastDiscussionPost - postsPerPage
  const currentDiscussionPosts = discussionPosts.slice(indexOfFirstDiscussionPost, indexOfLastDiscussionPost)

  const indexOfLastMyPost = currentMyPostsPage * postsPerPage
  const indexOfFirstMyPost = indexOfLastMyPost - postsPerPage
  const currentMyPosts = myPosts.slice(indexOfFirstMyPost, indexOfLastMyPost)

  // Change page handlers
  const handleDiscussionsPageChange = (page: number) => {
    setCurrentDiscussionsPage(page)
    // Scroll to top of the posts section
    window.scrollTo({
      top: document.querySelector('.ant-tabs-content')?.getBoundingClientRect().top
        ? window.scrollY + (document.querySelector('.ant-tabs-content')?.getBoundingClientRect().top || 0) - 100
        : 0,
      behavior: 'smooth'
    })
  }

  const handleMyPostsPageChange = (page: number) => {
    setCurrentMyPostsPage(page)
    // Scroll to top of the posts section
    window.scrollTo({
      top: document.querySelector('.ant-tabs-content')?.getBoundingClientRect().top
        ? window.scrollY + (document.querySelector('.ant-tabs-content')?.getBoundingClientRect().top || 0) - 100
        : 0,
      behavior: 'smooth'
    })
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const handleCreatePost = async (postData: {
    content: string
    images: string | string[]
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
      return new Promise((resolve) => {
        dispatch({
          type: 'CREATE_BLOG',
          payload: {
            type: 'community',
            content: postData.content,
            userId: currentUser.id,
            hashtags: hashtags.map((tag) => tag.substring(1)),
            featuredImageUrl: featuredImageUrl,
            tagIds: postData.tagIds
          },
          callback: (success: boolean, msg?: string) => {
            if (success) {
              setIsModalVisible(false)
              // Refresh posts
              dispatch({ type: 'GET_ALL_BLOGS', payload: { type: 'community' } })
              message.success('Post created successfully')
              // Reset to first page after creating a new post
              setCurrentDiscussionsPage(1)
              setCurrentMyPostsPage(1)
              resolve(true)
            } else {
              message.error(msg || 'Failed to create post')
              resolve(false)
            }
            setSubmitting(false)
          }
        })
      })
    } catch (error) {
      console.error('Error creating post:', error)
      setSubmitting(false)
      return false
    }
  }

  const handleEditPost = async (postData: {
    content: string
    images: string[]
    tagIds: string[]
    type?: string
    chartData?: any
  }) => {
    if (!currentEditPost) return false

    try {
      setSubmitting(true)

      // Extract hashtags from content (from text without HTML)
      const textContent = postData.content.replace(/<[^>]*>/g, '').trim()
      const hashtagRegex = /#[a-zA-Z0-9_]+/g
      const hashtags = textContent.match(hashtagRegex) || []

      // Use Promise to handle the async operation
      return new Promise((resolve) => {
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
              dispatch({ type: 'GET_ALL_BLOGS', payload: { type: 'community' } })
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
      setSubmitting(false)
      return false
    }
  }

  const handleDeletePost = (postId: string) => {
    dispatch({
      type: 'DELETE_BLOG',
      payload: postId,
      callback: (success: boolean, msg?: string) => {
        if (success) {
          message.success('Post deleted successfully')
          dispatch({ type: 'GET_ALL_BLOGS', payload: { type: 'community' } })

          // If we're on a page with only one post and we delete it, go back to the previous page
          if (currentDiscussionPosts.length === 1 && currentDiscussionsPage > 1) {
            setCurrentDiscussionsPage(currentDiscussionsPage - 1)
          }

          if (currentMyPosts.length === 1 && currentMyPostsPage > 1) {
            setCurrentMyPostsPage(currentMyPostsPage - 1)
          }
        } else {
          message.error(msg || 'Failed to delete post')
        }
      }
    })
  }
  const handleNavClick = () => {
    if (currentUser?.role !== 'Member') {
      setIsModalCheckRole(true)
    } else {
      setIsModalVisible(true)
    }
  }
  const renderEmptyState = (type: 'discussions' | 'my-posts') => {
    return (
      <EmptyStateContainer>
        <EmptyStateIcon>
          {type === 'discussions' ? (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='32'
              height='32'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'></path>
            </svg>
          ) : (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='32'
              height='32'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7'></path>
              <path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'></path>
            </svg>
          )}
        </EmptyStateIcon>
        <EmptyStateTitle>
          {type === 'discussions' ? 'No discussions yet' : "You haven't created any posts yet"}
        </EmptyStateTitle>
        <EmptyStateText>
          {type === 'discussions'
            ? 'Be the first to start a conversation with the community!'
            : 'Share your thoughts, experiences or charts with the community!'}
        </EmptyStateText>
      </EmptyStateContainer>
    )
  }

  return (
    <PageContainer>
      <ContentContainer>
        <Header>
          <Title>Community Feed</Title>
          {currentUser && (
            <Tooltip title='Create a new post'>
              <CreateButton onClick={handleNavClick}>
                <PlusIcon size={18} />
                Create Post
              </CreateButton>
            </Tooltip>
          )}
        </Header>

        <StyledTabs defaultActiveKey='1'>
          <Tabs.TabPane tab='Discussions' key='1'>
            {loading ? (
              <LoadingContainer>
                <Spin size='large' />
              </LoadingContainer>
            ) : (
              <>
                <PostGrid>
                  {currentDiscussionPosts.length > 0
                    ? currentDiscussionPosts.map((post: BlogPost) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          currentUser={currentUser}
                          onEdit={(post) => {
                            setCurrentEditPost(post)
                            setIsEditModalVisible(true)
                          }}
                          onDelete={handleDeletePost}
                        />
                      ))
                    : renderEmptyState('discussions')}
                </PostGrid>

                {discussionPosts.length > postsPerPage && (
                  <PaginationContainer>
                    <Pagination
                      current={currentDiscussionsPage}
                      onChange={handleDiscussionsPageChange}
                      total={discussionPosts.length}
                      pageSize={postsPerPage}
                      showSizeChanger={false}
                    />
                  </PaginationContainer>
                )}
              </>
            )}
          </Tabs.TabPane>

          <Tabs.TabPane tab='My Posts' key='2'>
            {loading ? (
              <LoadingContainer>
                <Spin size='large' />
              </LoadingContainer>
            ) : (
              <>
                <PostGrid>
                  {currentMyPosts.length > 0
                    ? currentMyPosts.map((post: BlogPost) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          currentUser={currentUser}
                          onEdit={(post) => {
                            setCurrentEditPost(post)
                            setIsEditModalVisible(true)
                          }}
                          onDelete={handleDeletePost}
                        />
                      ))
                    : renderEmptyState('my-posts')}
                </PostGrid>

                {myPosts.length > postsPerPage && (
                  <PaginationContainer>
                    <Pagination
                      current={currentMyPostsPage}
                      onChange={handleMyPostsPageChange}
                      total={myPosts.length}
                      pageSize={postsPerPage}
                      showSizeChanger={false}
                    />
                  </PaginationContainer>
                )}
              </>
            )}
          </Tabs.TabPane>
        </StyledTabs>
      </ContentContainer>

      {/* Post Creation Modal */}
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
      <StyledModal
          title='Become a PregnaCare Member'
          open={isModalCheckRole}
          onCancel={() => setIsModalCheckRole(false)}
          footer={[
            <Button key='cancel' onClick={() => setIsModalCheckRole(false)}>
              Later
            </Button>,
            <Button
              key='submit'
              type='primary'
              onClick={() => {
                setIsModalCheckRole(false)
                navigate(ROUTES.MEMBESHIP_PLANS)
              }}
            >
              View Membership Plans
            </Button>
          ]}
        >
          <div className='membership-content'>
            <img
              src='https://res.cloudinary.com/drcj6f81i/image/upload/v1736744602/PregnaCare/mgxvbwz2fggrx7brtjgo.svg'
              alt='Membership'
              className='membership-image'
            />

            <div className='membership-subtitle'>Join our community to experience exclusive features</div>
          </div>
        </StyledModal>
    </PageContainer>
  )
}

export default CommunityPage
