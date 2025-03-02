//--Library
import styled from 'styled-components'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import ROUTES from '@/utils/config/routes'
import { useState, useEffect, useRef } from "react";

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
`;


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
`;


const CategoryDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownContent = ({ isOpen, children, closeDropdown }: { isOpen: boolean; children: React.ReactNode; closeDropdown: () => void }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown(); // Đóng dropdown nếu click bên ngoài
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeDropdown]);

  return (
    <div
      ref={dropdownRef}
      style={{
        display: isOpen ? "block" : "none",
        position: "absolute",
        background: "white",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        minWidth: "160px",
        zIndex: 1,
        borderRadius: "5px",
        overflow: "hidden",
        padding: "10px",
      }}
    >
      {children}
    </div>
  );
};


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
`;



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

//--Data
const blogData = [
  { id: 1, title: 'The Importance of Sleep for Moms and Babies', image: 'src/assets/tải xuống (5).jpg', category: 'Sleep' },
  { id: 2, title: '5 Simple Prenatal Yoga Poses', image: 'src/assets/images (1).jpg', category: 'Yoga' },
  { id: 3, title: 'Pregnancy Warning Signs', image: 'src/assets/images (2).jpg', category: 'Pregnancy' },
  { id: 4, title: 'Top 10 Foods for Pregnant Moms', image: 'src/assets/1-3-Month-pregnancy-diet-chart-preview-1200x675.jpg', category: 'Nutrition' },
  { id: 5, title: 'Guide to Babyproofing Your Home', image: 'src/assets/baby-girl-smiling-babyproofing-checklist.jpg', category: 'Baby Care' },
  { id: 6, title: 'Common Newborn Health Issues', image: 'src/assets/OYH_newborn-holding.jpg', category: 'Baby Care' }
];

//--Component
export default function BlogPage() {
  const [currentPage] = useState(0)
  const [animationDirection] = useState('')
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setDropdownOpen] = useState(false);



  const mainCategories = ['Sleep', 'Yoga', 'Pregnancy', 'Nutrition', 'Baby Care', 'Mental Health', 'Parenting Tips', 'Mental Health', 'Parenting Tips', 'Breastfeeding', 'Exercise', 'Newborn Care'];

  const getBlogDescription = (title: string) => {
    switch (title) {
      case 'The Importance of Sleep for Moms and Babies: Tips to Rest Better':
        return "Create a conducive environment for the baby to improve the baby's and the mother's sleep quality[..]"
      case '5 Simple Prenatal Yoga Poses to Reduce Stress and Boost Energy':
        return 'Discover easy yoga poses that help reduce stress and rejuvenate energy for moms-to-be[..]'
      case 'Pregnancy Warning Signs You Should Never Ignore':
        return 'Stay informed about critical health signs during pregnancy to ensure safety and well-being[..]'
      case 'Top 10 Foods Every Pregnant Mom Should Include in HerDiet':
        return 'While you’re pregnant, you’ll want to eat extra protein, calcium, iron, and essential vitamins[..]'
      case 'The Ultimate Guide to Babyproofing Your Home':
        return 'Learn how to create a safe and welcoming environment for your baby to explore and grow[..]'
      case 'Common Newborn Health Issues and How to Handle Them':
        return 'Understand common newborn health concerns and practical solutions for every parent[..]'
      default:
        return 'Explore helpful tips and resources to improve parenting and baby care experiences[..]'
    }
  }

  return (
    <Container className='overflow-hidden'>
      <div className="opacity-0 mt-10">
        Comment!!!
      </div>
      {/* Dropdown Categories */}
      <CategoryContainer>
        <CategoryDropdown>
          <DropdownButton onClick={() => setDropdownOpen(!isDropdownOpen)}>
            More Categories ▼
          </DropdownButton>
          <DropdownContent isOpen={isDropdownOpen} closeDropdown={() => setDropdownOpen(false)}>
        {mainCategories.map((category) => (
          <a key={category} href="#" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">
            {category}
          </a>
        ))}
      </DropdownContent>
        </CategoryDropdown>
        {mainCategories.slice(0, 6).map((category) => (
        <button key={category} onClick={() => console.log(category)}>
          {category}
        </button>
      ))}
        <SearchBar>
          <input
            type='text'
            placeholder='Search for a blog...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <button>🔍</button>
        </SearchBar>
      </CategoryContainer>

      <HeaderImage className=' mt-1 cursor-pointer'>
        {/* Hiển thị ảnh chính */}
        <div
          className={`image-container ${animationDirection === 'slide-left' ? 'slide-left' : ''} ${animationDirection === 'slide-right' ? 'slide-right' : ''
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
        {blogData.map((blog) => {
          const { ref, inView } = useInView({
            threshold: 0.1
          })

          return (
            <div ref={ref} className={`blog-card ${inView ? 'visible' : ''}`} key={blog.id}>
              <Link to={ROUTES.BLOG_DETAILS}>
                <img src={blog.image} alt={blog.title} />
                <div className='content'>
                  <h3 className='title'>{blog.title}</h3>
                  <h3 className='description'>{getBlogDescription(blog.title)}</h3>
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
