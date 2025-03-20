import React, { useEffect, useState } from 'react'
import { FiHeart, FiSearch, FiShoppingCart } from 'react-icons/fi'
import { AiFillStar } from 'react-icons/ai'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const BabyShopApp = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60)

  const news = [
    {
      id: 1,
      title: 'Choosing the Right Baby Formula',
      date: '2024-01-15',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
      description: "Guide to selecting the best formula for your baby's needs"
    },
    {
      id: 2,
      title: 'Baby Sleep Tips',
      date: '2024-01-14',
      image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8',
      description: 'Expert advice for better baby sleep patterns'
    },
    {
      id: 3,
      title: 'First-Time Parent Guide',
      date: '2024-01-13',
      image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8',
      description: 'Essential tips for new parents'
    },
    {
      id: 4,
      title: 'Baby Development Milestones',
      date: '2024-01-12',
      image: 'https://images.unsplash.com/photo-1576043061888-8751653f46af',
      description: "Track your baby's growth and development"
    },
    {
      id: 5,
      title: 'Nutrition for Nursing Mothers',
      date: '2024-01-11',
      image: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de',
      description: 'Healthy eating tips for breastfeeding moms'
    },
    {
      id: 6,
      title: 'Baby-Proofing Your Home',
      date: '2024-01-10',
      image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8',
      description: 'Essential safety tips for your home'
    }
  ]

  const categories = [
    {
      id: 1,
      name: 'Newborn Essentials',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b'
    },
    {
      id: 2,
      name: 'Maternity Wear',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b'
    },
    {
      id: 3,
      name: 'Baby Clothing',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b'
    },
    {
      id: 4,
      name: 'Feeding Accessories',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b'
    },
    {
      id: 5,
      name: 'Nursery Products',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b'
    },
    {
      id: 6,
      name: 'Baby Care',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b'
    }
  ]

  const products = [
    {
      id: 1,
      name: 'Organic Baby Onesie',
      price: 29.99,
      discount: 15,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8'
    },
    {
      id: 2,
      name: 'Baby Carrier',
      price: 89.99,
      discount: 20,
      rating: 5,
      image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8'
    },
    {
      id: 3,
      name: 'Nursing Pillow',
      price: 49.99,
      discount: 10,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8'
    },
    {
      id: 4,
      name: 'Baby Stroller',
      price: 299.99,
      discount: 25,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8'
    },
    {
      id: 5,
      name: 'Diaper Pack',
      price: 45.99,
      discount: 30,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8'
    },
    {
      id: 6,
      name: 'Diaper Pack',
      price: 45.99,
      discount: 30,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8'
    }
  ]

  const [showCategories, setShowCategories] = useState(false)
  const [activeCategory, setActiveCategory] = useState(0)

  const popularSearches = [
    'toys',
    'red grow plus milk',
    'merries diapers',
    'susu milk',
    'green grow plus milk',
    'pediasure',
    'optimum gold milk',
    'bobby diaper size l',
    'ensure gold',
    'vinamilk yogurt'
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = time % 60
    return `${hours}h ${minutes}m ${seconds}s`
  }

  const nextCategory = () => {
    setActiveCategory((prev) => (prev + 1) % categories.length)
  }

  const prevCategory = () => {
    setActiveCategory((prev) => (prev === 0 ? categories.length - 1 : prev - 1))
  }

  const brands = ['Pampers', 'Huggies', 'Gerber', 'Fisher-Price', 'Chicco', 'Graco', 'Philips Avent', 'Tommee Tippee']

  const [brandIndex, setBrandIndex] = useState(0)

  const nextBrand = () => {
    setBrandIndex((prev) => (prev + 1) % brands.length)
  }

  const prevBrand = () => {
    setBrandIndex((prev) => (prev - 1 + brands.length) % brands.length)
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <section className='relative bg-[#FFF5E1] mt-20 pt-7'>
        {/* Header */}
        <div className='bg-[#FFF5E1] shadow-sm'>
          <div className='container mx-auto px-4 flex items-center justify-center gap-20'>
            <div className='relative'>
              <button
                onClick={() => setShowCategories(!showCategories)}
                className='flex items-center gap-3 bg-[#A08050] text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-[#8F6B40] transition-colors'
              >
                <span className='text-lg'>≡</span> Categories
              </button>
              {showCategories && (
                <div className='absolute top-full left-0 w-64 bg-white shadow-lg rounded-lg z-50 py-2'>
                  {categories.map((category) => (
                    <a key={category.id} href='#' className='block px-4 py-2 text-gray-600 hover:bg-gray-100'>
                      {category.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Danh mục hiển thị ngang */}
            <div className='flex gap-20'>
              {categories.slice(0, 5).map((category) => (
                <a
                  key={category.id}
                  href='#'
                  className='text-gray-700 font-medium hover:text-[#C9A375] transition-colors'
                >
                  {category.name}
                </a>
              ))}
            </div>

            <div className='flex items-center space-x-6'>
              <FiSearch className='text-gray-600 w-6 h-6' />
              <FiHeart className='text-gray-600 w-6 h-6' />
              <FiShoppingCart className='text-gray-600 w-6 h-6' />
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className='container mx-auto px-4 flex flex-col md:flex-row items-center mt-8'>
          <div className='md:w-1/2 mb-8 md:mb-0'>
            <h1 className='text-4xl md:text-6xl font-bold text-gray-800 mb-4'>Nurturing Care for Every Stage</h1>
            <p className='text-gray-600 mb-6'>
              Discover our carefully curated collection of premium baby and maternal care products.
            </p>
            <button className='bg-[#A0D8EF] text-white px-8 py-3 rounded-full hover:bg-[#FFB6C1] transition-colors'>
              Shop Now
            </button>
          </div>
          <div className='md:w-1/2'>
            <img
              src='https://images.unsplash.com/photo-1555252333-9f8e92e65df9'
              alt='Mother and Baby'
              className='rounded-lg shadow-lg'
            />
          </div>
        </div>
      </section>

      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-12'>Shop by Category</h2>
          <div className='relative'>
            <button
              onClick={prevCategory}
              className='absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg z-10'
            >
              <BiChevronLeft className='w-6 h-6' />
            </button>
            <div className='flex gap-6 overflow-hidden'>
              {[0, 1].map((offset) => {
                const index = (activeCategory + offset) % categories.length
                return (
                  <div key={categories[index].id} className='w-1/2 transition-transform duration-500 ease-in-out'>
                    <div className='relative rounded-lg overflow-hidden'>
                      <img
                        src={categories[index].image}
                        alt={categories[index].name}
                        className='w-full h-96 object-cover'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-6 flex flex-col justify-end'>
                        <h3 className='text-white text-2xl font-bold mb-2'>{categories[index].name}</h3>
                        <p className='text-white/80'>
                          Discover our collection of {categories[index].name.toLowerCase()}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <button
              onClick={nextCategory}
              className='absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg z-10'
            >
              <BiChevronRight className='w-6 h-6' />
            </button>
          </div>
        </div>
      </section>

      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <div className='border-4 border-[#FFB6C1] rounded-xl p-8 bg-white/50'>
            <div className='text-center mb-8'>
              <h2 className='text-3xl font-bold mb-4'>Special Offers</h2>
              <div className='inline-block bg-[#FFB6C1] text-white px-6 py-3 rounded-full text-xl font-semibold'>
                Time Left: {formatTime(timeLeft)}
              </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {products.map((product) => (
                <div key={product.id} className='bg-white rounded-lg shadow-md overflow-hidden'>
                  <img src={product.image} alt={product.name} className='w-full h-48 object-cover' />
                  <div className='p-4'>
                    <h3 className='font-semibold mb-2'>{product.name}</h3>
                    <div className='flex items-center justify-between'>
                      <div>
                        <span className='text-lg font-bold text-[#FFB6C1]'>
                          ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                        </span>
                        <span className='ml-2 text-sm line-through text-gray-400'>${product.price}</span>
                      </div>
                      <button className='bg-[#A0D8EF] text-white px-4 py-2 rounded-full hover:bg-[#FFB6C1] transition-colors'>
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className='py-12 bg-white'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-10'>Featured Products</h2>
          {categories.slice(0, 5).map((category, index) => (
            <div key={category.id} className={index > 0 ? 'mt-20' : ''}>
              {/* Category Header with Image */}
              <div
                className='relative w-full h-60 bg-cover bg-center'
                style={{ backgroundImage: `url(src/assets/6c582f2f5ca58e73391187e6f2c871ba.png)` }}
              />

              {/* Brand Navigation */}
              <div className='flex items-center justify-between mt-6 mb-6 px-4 md:px-16'>
                <button onClick={prevBrand} className='p-3 bg-gray-200 rounded-full hover:bg-gray-300'>
                  <FaChevronLeft className='text-2xl' />
                </button>
                <div className='flex space-x-6'>
                  {brands.slice(brandIndex, brandIndex + 5).map((brand, index) => (
                    <span key={index} className='text-lg font-medium bg-gray-100 px-6 py-3 rounded-lg'>
                      {brand}
                    </span>
                  ))}
                </div>
                <button onClick={nextBrand} className='p-3 bg-gray-200 rounded-full hover:bg-gray-300'>
                  <FaChevronRight className='text-2xl' />
                </button>
              </div>

              {/* Product Grid */}
              <div className='grid grid-cols-2 md:grid-cols-3 gap-6'>
                {products.slice(0, 6).map((product) => (
                  <div key={product.id} className='bg-white shadow-md overflow-hidden'>
                    <div className='relative'>
                      <img src={product.image} alt={product.name} className='w-full h-60 object-cover' />
                      {product.discount && (
                        <div className='absolute top-2 right-2 bg-[#FFB6C1] text-white px-2 py-1 rounded'>
                          -{product.discount}%
                        </div>
                      )}
                    </div>
                    <div className='p-4'>
                      <h3 className='font-semibold mb-2'>{product.name}</h3>
                      <div className='flex items-center mb-2'>
                        {[...Array(5)].map((_, i) => (
                          <AiFillStar
                            key={i}
                            className={`w-4 h-4 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-lg font-bold'>${product.price}</span>
                        <button className='bg-[#A0D8EF] text-white px-4 py-2 rounded-full hover:bg-[#FFB6C1] transition'>
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* See All Products Button */}
              <div className='flex justify-center mt-8'>
                <button className='px-8 py-3 border-2 border-[#FFB6C1] text-[#FFB6C1] rounded-full hover:bg-[#FFB6C1] hover:text-white transition-colors'>
                  See All Products →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className='py-16 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center pb-5'>Latest News</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {news.map((item) => (
              <div key={item.id} className='bg-white rounded-lg overflow-hidden shadow-md'>
                <img src={item.image} alt={item.title} className='w-full h-48 object-cover' />
                <div className='p-4'>
                  <h3 className='font-semibold mb-2'>{item.title}</h3>
                  <p className='text-gray-600 text-sm mb-2'>{item.description}</p>
                  <span className='text-gray-400 text-xs'>{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className='flex justify-center mt-8'>
          <button className='px-8 py-3 border-2 border-[#FFB6C1] text-[#FFB6C1] rounded-full hover:bg-[#FFB6C1] hover:text-white transition-colors'>
            See All News →
          </button>
        </div>
      </section>

      <section className='py-16 bg-white'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-4'>Popular Searches</h2>
          <div className='flex flex-wrap gap-4 justify-center'>
            {popularSearches.map((search, index) => (
              <a
                key={index}
                href='#'
                className='px-4 py-2 bg-gray-100 rounded-full text-gray-600 hover:bg-[#A0D8EF] hover:text-white transition-colors'
              >
                {search}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default BabyShopApp
