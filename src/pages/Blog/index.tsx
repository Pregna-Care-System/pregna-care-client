//--Library
import styled from 'styled-components'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import ROUTES from '@/utils/config/routes'
import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectBlogInfo, selectTagInfo } from '@/store/modules/global/selector'

//--Styled Components
const Container = styled.div`
  margin: auto;
`

const CategoryContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  gap: 55px;
`

const DropdownButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
  &:hover {
    background: #0056b3;
  }
`

const CategoryDropdown = styled.div`
  position: relative;
  display: inline-block;
`

const DropdownContent = ({
  isOpen,
  children,
  closeDropdown
}: {
  isOpen: boolean
  children: React.ReactNode
  closeDropdown: () => void
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown() // Đóng dropdown nếu click bên ngoài
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, closeDropdown])

  return (
    <div
      ref={dropdownRef}
      style={{
        display: isOpen ? 'block' : 'none',
        position: 'absolute',
        background: 'white',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        minWidth: '160px',
        zIndex: 1,
        borderRadius: '5px',
        overflow: 'hidden',
        padding: '10px'
      }}
    >
      {children}
    </div>
  )
}

const SearchBar = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;

  input {
    width: 200px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  button {
    margin-left: 8px;
    background: #007bff;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
    &:hover {
      background: #0056b3;
    }
  }
`

const HeaderImage = styled.div`
  position: relative;
  width: 90%; /* Giới hạn chiều rộng */
  max-width: 1200px; /* Chiều rộng tối đa */
  height: 400px;
  margin: 0 auto; /* Căn giữa */
  align-items: center;
  border-radius: 8px;

  .image-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition:
      transform 0.5s ease-in-out,
      opacity 0.5s ease-in-out;
    transform: translateX(0);
    opacity: 1;

    &.slide-left {
      transform: translateX(-100%);
      opacity: 0;
    }

    &.slide-right {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  .next-image {
    position: absolute;
    top: 0;
    left: 100%;
    width: 100%;
    height: 100%;
    transition: opacity 0.5s ease-in-out;
    opacity: 0;

    &.active {
      left: 0;
      opacity: 1;
    }
  }
`

const BlogContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 khung trên 1 hàng */
  gap: 20px; /* Khoảng cách giữa các khung */
  margin: 0 auto;
  padding: 40px 10px;
  max-width: 1200px; /* Giới hạn chiều rộng */

  .blog-card {
    opacity: 0;
    transform: translateY(50px);
    transition: all 0.5s ease-in-out;

    &.visible {
      opacity: 1;
      transform: translateY(0);
    }

    background: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    cursor: pointer;

    img {
      width: 100%;
      height: 180px;
      object-fit: cover;
    }

    .content {
      padding: 15px;

      .title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 8px;
      }

      .description {
        font-size: 14px;
        color: #555;
        line-height: 1.6;
      }
    }
  }
`

const images = ['src/assets/OYH_newborn-holding.jpg']

export default function BlogPage() {
  const blogResponse = useSelector(selectBlogInfo)
  const tagResponse = useSelector(selectTagInfo)
  const [currentPage] = useState(0)
  const [animationDirection] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({ type: 'GET_ALL_BLOGS'})
    dispatch({ type: 'GET_ALL_TAGS'})
  }, [dispatch])

  return (
    <Container className='overflow-hidden'>
      <div className='opacity-0 mt-10'>Comment!!!</div>
      <CategoryContainer>
        <CategoryDropdown>
          <DropdownButton onClick={() => setDropdownOpen(!isDropdownOpen)}>More Tags ▼</DropdownButton>
          <DropdownContent isOpen={isDropdownOpen} closeDropdown={() => setDropdownOpen(false)}>
            {tagResponse.map((tag) => (
              <a key={tag.id} href='#' className='block px-4 py-2 text-gray-600 hover:bg-gray-100'>
                {tag.name}
              </a>
            ))}
          </DropdownContent>
        </CategoryDropdown>
        {tagResponse.map((tag) => (
          <button key={tag.id} onClick={() => console.log(tag.id)}>
            {tag.name}
          </button>
        ))}
        <SearchBar>
          <input
            type='text'
            placeholder='Search for a blog...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>🔍</button>
        </SearchBar>
      </CategoryContainer>

      <HeaderImage className=' mt-1 cursor-pointer'>
        <div
          className={`image-container ${animationDirection === 'slide-left' ? 'slide-left' : ''} ${
            animationDirection === 'slide-right' ? 'slide-right' : ''
          }`}
        >
          <img
            src={images[currentPage]}
            alt={`Slide ${currentPage}`}
            className='w-full h-full object-cover
           '
          />
        </div>
      </HeaderImage>

      {/* Blog List */}
      <BlogContainer>
        {blogResponse.map((blog) => {
          const { ref, inView } = useInView({
            threshold: 0.1
          })

          return (
            <div ref={ref} className={`blog-card ${inView ? 'visible' : ''}`} key={blog.id}>
              <Link to={ROUTES.BLOG_DETAILS}>
                <img src={blog.featuredImageUrl} alt={blog.pageTitle} />
                <div className='content'>
                  <h3 className='title'>{blog.pageTitle}</h3>
                  <h3 className='description'>{blog.shortDescription}</h3>
                  <h3 className='text-blue-500 mt-2'>Read More →</h3>
                </div>
              </Link>
            </div>
          )
        })}
      </BlogContainer>

      {/* Pagination */}

      <div className='flex items-center justify-center mb-6 space-x-2'>
        <button
          className='page-item bg-gray-200 border border-gray-300 rounded-md px-3 py-2 text-sm leading flex items-center justify-center hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed'
          disabled
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke-width='1.5'
            stroke='currentColor'
            className='w-4 h-4'
          >
            <path stroke-linecap='round' stroke-linejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
          </svg>
        </button>

        <button className='page-item active bg-blue-500 text-white rounded-md px-3 py-2 text-sm leading hover:bg-blue-600'>
          1
        </button>
        <button className='page-item bg-gray-200 border border-gray-300 rounded-md px-3 py-2 text-sm leading hover:bg-gray-300'>
          2
        </button>
        <button className='page-item bg-gray-200 border border-gray-300 rounded-md px-3 py-2 text-sm leading hover:bg-gray-300'>
          3
        </button>
        <span className='text-gray-500 px-2'>...</span>
        <button className='page-item bg-gray-200 border border-gray-300 rounded-md px-3 py-2 text-sm leading hover:bg-gray-300'>
          40
        </button>

        <button className='page-item bg-gray-200 border border-gray-300 rounded-md px-3 py-2 text-sm leading flex items-center justify-center hover:bg-gray-300'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke-width='1.5'
            stroke='currentColor'
            className='w-4 h-4'
          >
            <path stroke-linecap='round' stroke-linejoin='round' d='M8.25 4.5L15.75 12l-7.5 7.5' />
          </svg>
        </button>
      </div>
    </Container>
  )
}
