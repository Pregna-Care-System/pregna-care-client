import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Input, Tag, Badge, Avatar, Empty } from 'antd'
import { SearchOutlined, EyeOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { selectBlogInfo, selectTagInfo } from '@/store/modules/global/selector'
import ROUTES from '@/utils/config/routes'

interface Tag {
  id: string
  name: string
}

interface Blog {
  id: string
  pageTitle: string
  fullName: string
  timeAgo: string
  viewCount: number
  status: string
  tags: Tag[]
  shortDescription: string
  featuredImageUrl: string
  avatarUrl: string
  content?: string
}

// Styled Components
const PageWrapper = styled.div`
  width: 100%;
  background: #fff5f6;
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
  background: linear-gradient(135deg, #ff6b81 0%, #ffa5b3 100%);
  padding: 60px 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('/pattern.svg') repeat;
    opacity: 0.1;
  }

  @media (min-width: 768px) {
    padding: 80px 20px;
  }
`

const BannerContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  color: white;
  position: relative;
  z-index: 1;

  h1 {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 16px;
    line-height: 1.2;

    @media (min-width: 768px) {
      font-size: 40px;
    }
  }

  p {
    font-size: 18px;
    opacity: 0.9;
    margin-bottom: 32px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
`

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`

const StyledInput = styled(Input)`
  width: 100%;
  padding: 16px 24px 16px 48px;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  outline: none;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`

const TagsContainer = styled.div`
  display: flex;
  gap: 12px;
  margin: -20px auto 24px;
  overflow-x: auto;
  padding: 4px 0;
  -webkit-overflow-scrolling: touch;
  position: relative;
  z-index: 2;

  &::-webkit-scrollbar {
    display: none;
  }
`

const StyledTag = styled(Tag)<{ $active?: boolean }>`
  padding: 8px 20px;
  border-radius: 20px;
  border: 1px solid ${(props) => (props.$active ? '#ff6b81' : '#ffe3e6')};
  background: ${(props) => (props.$active ? '#ff6b81' : 'white')};
  color: ${(props) => (props.$active ? 'white' : '#2f3542')};
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: 0;
  box-shadow: 0 2px 4px rgba(255, 107, 129, 0.1);

  &:hover {
    border-color: #ff6b81;
    color: ${(props) => (props.$active ? 'white' : '#ff6b81')};
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(255, 107, 129, 0.15);
  }
`

const MainContent = styled.div`
  display: grid;
  gap: 32px;
  grid-template-columns: 1fr;
`

const ActionSection = styled.div`
  margin-bottom: 32px;
`

const BlogActionSection = styled.div`
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 6px rgba(255, 107, 129, 0.1);
  text-align: center;
  border: 1px solid #ffe3e6;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(255, 107, 129, 0.15);
  }

  h2 {
    font-size: 24px;
    font-weight: 600;
    color: #2f3542;
    margin-bottom: 16px;
  }

  p {
    color: #57606f;
    margin-bottom: 24px;
    font-size: 16px;
    line-height: 1.6;
  }

  .blog-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #ff6b81;
    color: white;
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 500;
    font-size: 16px;
    transition: all 0.2s ease;

    &:hover {
      background: #ff4757;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 107, 129, 0.2);
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }
`

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 24px;
  margin-top: 32px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

const BlogCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(255, 107, 129, 0.1);
  border: 1px solid #ffe3e6;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(255, 107, 129, 0.15);
  }

  .image-container {
    width: 100%;
    aspect-ratio: 1;
    position: relative;
    overflow: hidden;
    background-color: #ffe3e6;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    &:hover img {
      transform: scale(1.05);
    }
  }

  .content {
    padding: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;

    .title {
      font-size: 18px;
      font-weight: 600;
      color: #2f3542;
      margin-bottom: 12px;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .author {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .short-description {
      color: #57606f;
      font-size: 14px;
      line-height: 1.5;
      margin-bottom: 16px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      flex: 1;
    }

    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;
    }

    .stats {
      display: flex;
      align-items: center;
      gap: 16px;
      color: #57606f;
      font-size: 14px;
      margin-top: auto;
    }

    .read-more {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: #ff6b81;
      font-weight: 600;
      font-size: 14px;
      padding: 8px 0;
      transition: all 0.2s ease;
      margin-top: 16px;

      &:hover {
        gap: 12px;
        color: #ff4757;
      }

      svg {
        transition: transform 0.2s ease;
      }

      &:hover svg {
        transform: translateX(4px);
      }
    }
  }
`

const NoImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f5f9;
  color: #94a3b8;
  font-size: 14px;
`

const BlogList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTag, setActiveTag] = useState('all')
  const dispatch = useDispatch()
  const blogResponse = useSelector(selectBlogInfo) as Blog[]
  const tagResponse = useSelector(selectTagInfo) as Tag[]

  useEffect(() => {
    dispatch({ type: 'GET_ALL_BLOGS', payload: { type: 'blog' } })
    dispatch({ type: 'GET_ALL_TAGS' })
  }, [dispatch])


  const getPageTitle = (blog: Blog) => {
    if (blog.pageTitle && blog.pageTitle.trim() !== '') {
      return blog.pageTitle
    }

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
                color: '#57606f',
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
          <ActionSection>
            <BlogActionSection>
              <h2>Your Blog Space</h2>
              <p>View and manage your blog posts, create new content, and connect with your readers.</p>
              <Link to={ROUTES.MEMBER.YOUR_BLOG} className='blog-button'>
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                  <path d='M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15' />
                </svg>
                Go to Your Blog
              </Link>
            </BlogActionSection>
          </ActionSection>

          {blogResponse.length > 0 ? (
            <BlogGrid>
              {blogResponse.map((blog) => (
                <BlogCard key={blog.id}>
                  <Link to={`${ROUTES.BLOG}/${blog.id}`}>
                    <div className='image-container'>
                      {blog.featuredImageUrl ? (
                        <img src={blog.featuredImageUrl} alt={getPageTitle(blog)} />
                      ) : (
                        <NoImagePlaceholder>No image available</NoImagePlaceholder>
                      )}
                    </div>
                    <div className='content'>
                      <h2 className='title'>{getPageTitle(blog)}</h2>
                      <div className='author'>
                        <Avatar size={32} style={{ border: 'solid 1px #ff6b81' }} src={blog.avatarUrl} alt={blog.fullName}/>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: '14px', color: '#2f3542' }}>{blog.fullName}</div>
                          <div style={{ fontSize: '12px', color: '#57606f' }}>{blog.timeAgo}</div>
                        </div>
                      </div>
                      {blog.shortDescription && (
                        <div className='short-description'>{blog.shortDescription}</div>
                      )}
                      <div className='meta'>
                        {blog.tags &&
                          blog.tags.map((tag) => (
                            <Tag key={tag.id} color='red' style={{ margin: 0 }}>
                              {tag.name}
                            </Tag>
                          ))}
                      </div>
                      <div className='stats'>
                        <div className='stat-item'>
                          <EyeOutlined />
                          <span>{blog.viewCount} views</span>
                        </div>
                      </div>
                      <div className='read-more'>
                        Read blog
                        <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                          <path d='M5 12h14M12 5l7 7-7 7' />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </BlogCard>
              ))}
            </BlogGrid>
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
