'use client'

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Input, Tag, Avatar, Empty } from 'antd'
import { SearchOutlined, EyeOutlined, ClockCircleOutlined, HeartOutlined, CommentOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { selectBlogInfo, selectTagInfo } from '@/store/modules/global/selector'
import ROUTES from '@/utils/config/routes'

// Styled Components
const PageWrapper = styled.div`
  width: 100%;
  background: #f7f7f7;
  min-height: 100vh;
  margin-top: 70px;
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
  background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
  padding: 40px 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fillOpacity='0.1' fillRule='evenodd'/%3E%3C/svg%3E");
    opacity: 0.5;
  }

  @media (min-width: 768px) {
    padding: 60px 20px;
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
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

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
  transform: translateY(30px);
`

const StyledInput = styled(Input)`
  width: 100%;
  padding: 16px 20px 16px 50px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  outline: none;
  background: white;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }
`

const TagsContainer = styled.div`
  display: flex;
  gap: 12px;
  margin: 50px 0 30px;
  overflow-x: auto;
  padding: 4px 0;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
`

const StyledTag = styled(Tag)<{ $active?: boolean }>`
  padding: 8px 18px;
  border-radius: 20px;
  border: 1px solid ${(props) => (props.$active ? '#EF4444' : '#eaeaea')};
  background: ${(props) => (props.$active ? '#EF4444' : 'transparent')};
  color: ${(props) => (props.$active ? 'white' : '#666')};
  font-size: 14px;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: 0;

  &:hover {
    border-color: #ef4444;
    color: ${(props) => (props.$active ? 'white' : '#EF4444')};
  }
`

const MainContent = styled.div`
  .section-title {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 24px;
    color: #111827;
    position: relative;
    padding-left: 16px;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 4px;
      background: #ef4444;
      border-radius: 4px;
    }
  }
`

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-top: 30px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

const BlogCard = styled.article`
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }

  .image-container {
    width: 100%;
    height: 200px;
    overflow: hidden;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
  }

  &:hover .image-container img {
    transform: scale(1.05);
  }

  .content {
    padding: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .title {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 12px;
    line-height: 1.4;
    transition: color 0.2s ease;

    &:hover {
      color: #ef4444;
    }
  }

  .author {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }

  .short-description {
    color: #6b7280;
    margin-bottom: 16px;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex: 1;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 12px;
    margin-bottom: 16px;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
    padding-top: 16px;
    border-top: 1px solid #f3f4f6;
  }

  .stats {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #6b7280;
    font-size: 13px;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 4px;
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

  const getPageTitle = (blog) => {
    if (blog && blog.pageTitle && blog.pageTitle.trim() !== '') {
      return blog.pageTitle
    }

    // Extract first line from content if pageTitle is empty
    if (blog && blog.content) {
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
          <h1>Discover Pregnancy Insights & Tips</h1>
          <p>Expert advice, personal stories, and essential information for your pregnancy journey</p>
        </BannerContent>
        <SearchContainer>
          <SearchOutlined
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6b7280',
              fontSize: '20px',
              zIndex: 2
            }}
          />
          <StyledInput
            placeholder='Search for pregnancy tips, nutrition advice, and more...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
      </BannerWrapper>

      <Container>
        <TagsContainer>
          <StyledTag $active={activeTag === 'all'} onClick={() => setActiveTag('all')}>
            All Topics
          </StyledTag>
          {tagResponse.map((tag) => (
            <StyledTag key={tag.id} $active={activeTag === tag.id} onClick={() => setActiveTag(tag.id)}>
              {tag.name}
            </StyledTag>
          ))}
        </TagsContainer>

        <MainContent>
          {blogResponse.length > 0 ? (
            <BlogGrid>
              {blogResponse.map((blog) => (
                <Link key={blog.id} to={`${ROUTES.BLOG}/${blog.id}`}>
                  <BlogCard>
                    <div className='image-container'>
                      {blog.featuredImageUrl ? (
                        <img src={blog.featuredImageUrl || '/placeholder.svg'} alt={getPageTitle(blog)} />
                      ) : (
                        <NoImagePlaceholder>No image available</NoImagePlaceholder>
                      )}
                    </div>
                    <div className='content'>
                      <h3 className='title'>{getPageTitle(blog)}</h3>

                      <div className='author'>
                        <Avatar size={32} src={blog.avatarUrl} style={{ backgroundColor: '#EF4444' }}>
                          {getInitials(blog.fullName)}
                        </Avatar>
                        <div>
                          <div style={{ fontWeight: 500 }}>{blog.fullName}</div>
                          <div
                            style={{
                              fontSize: '12px',
                              color: '#6b7280',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <ClockCircleOutlined style={{ fontSize: '12px' }} />
                            {blog.timeAgo}
                          </div>
                        </div>
                      </div>

                      {blog.shortDescription && <div className='short-description'>{blog.shortDescription}</div>}

                      <div className='tags'>
                        {blog.tags &&
                          blog.tags.map((tag) => (
                            <Tag key={tag.id} color='error'>
                              {tag.name}
                            </Tag>
                          ))}
                      </div>

                      <div className='footer'>
                        <div className='stats'>
                          <div className='stat-item'>
                            <EyeOutlined />
                            <span>{blog.viewCount}</span>
                          </div>
                          <div className='stat-item'>
                            <HeartOutlined />
                            <span>12</span>
                          </div>
                          <div className='stat-item'>
                            <CommentOutlined />
                            <span>4</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </BlogCard>
                </Link>
              ))}
            </BlogGrid>
          ) : (
            <Empty
              description='No blogs found'
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{
                background: 'white',
                padding: '40px',
                borderRadius: '16px',
                marginTop: '30px',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)'
              }}
            />
          )}
        </MainContent>
      </Container>
    </PageWrapper>
  )
}

export default BlogList
