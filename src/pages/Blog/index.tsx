import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Input, Tag, Badge, Avatar, Empty } from 'antd'
import { SearchOutlined, EyeOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { selectBlogInfo, selectTagInfo } from '@/store/modules/global/selector'
import ROUTES from '@/utils/config/routes'

// Styled Components
const PageWrapper = styled.div`
  width: 100%;
  background: #f4ecf6;
  min-height: 100vh;
  margin-top: 90px;
`

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  @media (min-width: 1200px) {
    padding: 24px;
  }
`

const BannerWrapper = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #8b5cf6 0%, #d298e7 100%);
  padding: 40px 20px;

  @media (min-width: 768px) {
    padding: 60px 20px;
  }
`

const BannerContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  color: white;

  h1 {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 12px;

    @media (min-width: 768px) {
      font-size: 32px;
    }
  }

  p {
    font-size: 16px;
    opacity: 0.9;
    margin-bottom: 24px;
  }
`

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`

const StyledInput = styled(Input)`
  width: 100%;
  padding: 12px 20px 12px 40px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  outline: none;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`

const TagsContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  overflow-x: auto;
  padding: 4px 0;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
`

const StyledTag = styled(Tag)<{ $active?: boolean }>`
  padding: 6px 16px;
  border-radius: 16px;
  border: 1px solid ${(props) => (props.$active ? '#8b5cf6' : '#eaeaea')};
  background: ${(props) => (props.$active ? '#8b5cf6' : 'transparent')};
  color: ${(props) => (props.$active ? 'white' : '#666')};
  font-size: 14px;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: 0;

  &:hover {
    border-color: #8b5cf6;
    color: ${(props) => (props.$active ? 'white' : '#8b5cf6')};
  }
`

const MainContent = styled.div`
  .best-of-week {
    color: #8b5cf6;
    font-weight: 500;
    font-size: 14px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;

    &::before {
      content: '';
      width: 4px;
      height: 4px;
      background: #8b5cf6;
      border-radius: 50%;
    }
  }
`

const FeaturedBlog = styled.div`
  margin-bottom: 30px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

  @media (min-width: 768px) {
    padding: 30px;
  }

  .title {
    font-size: 24px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 16px;
    line-height: 1.3;

    @media (min-width: 768px) {
      font-size: 28px;
    }
  }

  .meta {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #6b7280;
    font-size: 14px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .author {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }

  .stats {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
    color: #6b7280;
    font-size: 14px;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .read-more {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #8b5cf6;
    font-weight: 500;
    font-size: 14px;
    padding: 8px 0;
    transition: all 0.2s ease;

    &:hover {
      gap: 12px;
    }

    svg {
      transition: transform 0.2s ease;
    }

    &:hover svg {
      transform: translateX(4px);
    }
  }

  .content-wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: flex-start;
      gap: 30px;
    }
  }

  .text-content {
    flex: 1;
  }

  .image-container {
    width: 100%;
    height: 200px;
    border-radius: 12px;
    overflow: hidden;
    background-color: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (min-width: 768px) {
      width: 40%;
      height: 240px;
      flex-shrink: 0;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .short-description {
    color: #6b7280;
    margin-bottom: 16px;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`

const RecentBlogs = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

  @media (min-width: 768px) {
    padding: 24px;
  }

  .header {
    margin-bottom: 20px;
    color: #111827;
    font-weight: 600;
    font-size: 18px;
  }
`

const RecentBlogCard = styled.article`
  display: flex;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #eaeaea;
  cursor: pointer;
  transition: all 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  .image-container {
    width: 80px;
    height: 80px;
    border-radius: 12px;
    overflow: hidden;
    flex-shrink: 0;
    background-color: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .content {
    flex: 1;

    .title {
      font-size: 15px;
      font-weight: 500;
      color: #111827;
      margin-bottom: 8px;
      line-height: 1.4;
    }

    .meta {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #6b7280;
      font-size: 13px;
      margin-bottom: 4px;
    }

    .stats {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #6b7280;
      font-size: 12px;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 4px;
    }
  }

  &:hover {
    .title {
      color: #8b5cf6;
    }
  }
`

const StatusBadge = styled(Badge)`
  .ant-badge-status-dot {
    width: 8px;
    height: 8px;
  }
`

const NoImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  color: #9ca3af;
  font-size: 14px;
`

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Approved':
      return 'success'
    case 'Pending':
      return 'warning'
    case 'Rejected':
      return 'error'
    default:
      return 'default'
  }
}

const getInitials = (name: string) => {
  if (!name) return 'U'
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const BlogList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTag, setActiveTag] = useState('all')
  const dispatch = useDispatch()
  const blogResponse = useSelector(selectBlogInfo)
  const tagResponse = useSelector(selectTagInfo)

  useEffect(() => {
    dispatch({ type: 'GET_ALL_BLOGS', payload: { type: 'blog' } })
    dispatch({ type: 'GET_ALL_TAGS' })
  }, [dispatch])

  const featuredBlog = blogResponse[0] || {
    id: '1',
    pageTitle: 'Loading...',
    fullName: 'Author',
    timeAgo: 'just now',
    viewCount: 0,
    status: 'Approved',
    tags: [],
    shortDescription: '',
    featuredImageUrl: ''
  }

  const recentBlogs = blogResponse.slice(1) || []

  const getPageTitle = (blog) => {
    if (blog.pageTitle && blog.pageTitle.trim() !== '') {
      return blog.pageTitle
    }

    // Extract first line from content if pageTitle is empty
    if (blog.content) {
      const contentText = blog.content.replace(/<[^>]*>/g, '')
      const firstLine = contentText.split('.')[0]
      return firstLine.length > 60 ? firstLine.substring(0, 60) + '...' : firstLine
    }

    return 'Untitled Blog'
  }

  return (
    <PageWrapper>
      <BannerWrapper>
        <BannerContent>
          <h1>Discover Our Latest Blogs</h1>
          <p>Stay updated with the newest pregnancy tips and insights.</p>
          <SearchContainer>
            <SearchOutlined
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6b7280',
                fontSize: '18px',
                zIndex: 2
              }}
            />
            <StyledInput
              placeholder='What are you looking for?'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
        </BannerContent>
      </BannerWrapper>

      <Container>
        <TagsContainer>
          <StyledTag $active={activeTag === 'all'} onClick={() => setActiveTag('all')}>
            All
          </StyledTag>
          {tagResponse.map((tag) => (
            <StyledTag key={tag.id} $active={activeTag === tag.id} onClick={() => setActiveTag(tag.id)}>
              {tag.name}
            </StyledTag>
          ))}
        </TagsContainer>

        <MainContent>
          {blogResponse.length > 0 ? (
            <FeaturedBlog>
              <div className='content-wrapper'>
                <div className='text-content'>
                  <Link to={`${ROUTES.BLOG}/${featuredBlog?.id}`}>
                    <h1 className='title'>{getPageTitle(featuredBlog)}</h1>

                    <div className='author'>
                      <Avatar size={32} style={{ backgroundColor: '#8b5cf6' }}>
                        {getInitials(featuredBlog.fullName)}
                      </Avatar>
                      <div>
                        <div style={{ fontWeight: 500 }}>{featuredBlog.fullName}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{featuredBlog.timeAgo}</div>
                      </div>
                    </div>

                    {featuredBlog.shortDescription && (
                      <div className='short-description'>{featuredBlog.shortDescription}</div>
                    )}

                    <div className='stats'>
                      <div className='stat-item'>
                        <EyeOutlined />
                        <span>{featuredBlog.viewCount} views</span>
                      </div>
                    </div>

                    <div className='meta'>
                      {featuredBlog.tags &&
                        featuredBlog.tags.map((tag) => (
                          <Tag key={tag.id} color='purple'>
                            {tag.name}
                          </Tag>
                        ))}
                    </div>

                    <div className='read-more'>
                      Read blog
                      <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                        <path d='M5 12h14M12 5l7 7-7 7' />
                      </svg>
                    </div>
                  </Link>
                </div>
                <div className='image-container'>
                  {featuredBlog.featuredImageUrl ? (
                    <img src={featuredBlog.featuredImageUrl || '/placeholder.svg'} alt={getPageTitle(featuredBlog)} />
                  ) : (
                    <NoImagePlaceholder>No image available</NoImagePlaceholder>
                  )}
                </div>
              </div>
            </FeaturedBlog>
          ) : (
            <Empty
              description='No blogs found'
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{
                background: 'white',
                padding: '30px',
                borderRadius: '16px',
                marginBottom: '30px'
              }}
            />
          )}
        </MainContent>
      </Container>
    </PageWrapper>
  )
}

export default BlogList
