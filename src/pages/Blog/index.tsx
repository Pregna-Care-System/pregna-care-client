import styled from 'styled-components'
import { Link } from 'react-router-dom'
import ROUTES from '@/utils/config/routes'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectBlogInfo, selectTagInfo } from '@/store/modules/global/selector'

const Banner = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  background: linear-gradient(135deg, #8b5cf6 0%, #d298e7 100%);
  margin-bottom: 40px;
  margin-top: 80px;
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 24px;

  &::before {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    top: -200px;
    right: -100px;
    filter: blur(60px);
  }
  &::after {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    bottom: -150px;
    left: -50px;
    filter: blur(60px);
  }
`

const BannerContent = styled.div`
  text-align: center;
  color: white;
  position: relative;
  z-index: 1;
  margin-bottom: 24px;

  h1 {
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 12px;
  }

  p {
    font-size: 16px;
    opacity: 0.9;
  }
`

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  z-index: 1;

  svg {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    color: #6b7280;
  }
`

const SearchInput = styled.input`
  width: 100%;
  padding: 16px 24px 16px 48px;
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

const Container = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px;
  background: #f4ecf6;
`

const TagsContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  overflow-x: auto;
  padding: 4px 0;

  &::-webkit-scrollbar {
    display: none;
  }
`

const Tag = styled.button<{ active?: boolean }>`
  padding: 6px 16px;
  border-radius: 16px;
  border: 1px solid ${(props) => (props.active ? '#8b5cf6' : '#eaeaea')};
  background: ${(props) => (props.active ? '#8b5cf6' : 'transparent')};
  color: ${(props) => (props.active ? 'white' : '#666')};
  font-size: 14px;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #8b5cf6;
    color: ${(props) => (props.active ? 'white' : '#8b5cf6')};
  }
`

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: 1.8fr 1fr;
  gap: 32px;
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
  margin-bottom: 40px;
  border: 1px solid #bda8a8;
  border-radius: 16px;
  padding: 60px;
  height: 80%;
  .title {
    font-size: 32px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 16px;
    line-height: 1.2;
  }

  .meta {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #6b7280;
    font-size: 14px;
    margin-bottom: 24px;
  }

  .read-more {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #8b5cf6;
    font-weight: 500;
    font-size: 14px;
    padding: 8px 0;

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
  .image-container {
    width: 60%;
    height: 380px;
    border-radius: 12px;
    overflow: hidden;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`

const RecentBlogs = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;

  .header {
    margin-bottom: 24px;
    color: #111827;
    font-weight: 600;
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

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .content {
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
    }
  }

  &:hover {
    .title {
      color: #8b5cf6;
    }
  }
`

export default function BlogPage() {
  const blogResponse = useSelector(selectBlogInfo)
  const tagResponse = useSelector(selectTagInfo)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTag, setActiveTag] = useState('all')
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({ type: 'GET_ALL_BLOGS' })
    dispatch({ type: 'GET_ALL_TAGS' })
  }, [dispatch])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const featuredBlog = blogResponse[0]
  const recentBlogs = blogResponse.slice(1)

  return (
    <Container>
      <Banner>
        <BannerContent>
          <h1>Discover Our Latest Blogs</h1>
          <p>Stay updated with the newest design and development stories, case studies, and insights.</p>
        </BannerContent>
        <SearchContainer>
          <svg
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <circle cx='11' cy='11' r='8' />
            <line x1='21' y1='21' x2='16.65' y2='16.65' />
          </svg>
          <SearchInput
            type='text'
            placeholder='What are you looking for?'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
      </Banner>

      <BlogGrid>
        <MainContent>
          <TagsContainer>
            <Tag active={activeTag === 'all'} onClick={() => setActiveTag('all')}>
              All
            </Tag>
            {tagResponse.map((tag) => (
              <Tag key={tag.id} active={activeTag === tag.id} onClick={() => setActiveTag(tag.id)}>
                {tag.name}
              </Tag>
            ))}
          </TagsContainer>
          <FeaturedBlog>
            <div className='best-of-week'>Best of the week</div>
            <div className='flex justify-between'>
              <Link to={`${ROUTES.BLOG_DETAILS}/${featuredBlog?.id}`}>
                <h1 className='title'>{featuredBlog?.pageTitle}</h1>
                <div className='meta'>
                  <span>{formatDate(featuredBlog?.createdAt || new Date().toISOString())}</span>
                </div>
                <div className='read-more'>
                  Read blog
                  <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                    <path d='M5 12h14M12 5l7 7-7 7' />
                  </svg>
                </div>
              </Link>
              <div className='image-container mr-0'>
                <img src={featuredBlog?.featuredImageUrl} alt={featuredBlog?.pageTitle} />
              </div>
            </div>
          </FeaturedBlog>
        </MainContent>

        <RecentBlogs>
          <div className='header'>Recommended</div>
          {recentBlogs.map((blog) => (
            <Link to={`${ROUTES.BLOG_DETAILS}/${blog.id}`} key={blog.id}>
              <RecentBlogCard>
                <div className='image-container'>
                  <img src={blog.featuredImageUrl} alt={blog.pageTitle} />
                </div>
                <div className='content'>
                  <h3 className='title'>{blog.pageTitle}</h3>
                  <div className='meta'>
                    <span>{formatDate(blog.createdAt || new Date().toISOString())}</span>
                  </div>
                </div>
              </RecentBlogCard>
            </Link>
          ))}
        </RecentBlogs>
      </BlogGrid>
    </Container>
  )
}
