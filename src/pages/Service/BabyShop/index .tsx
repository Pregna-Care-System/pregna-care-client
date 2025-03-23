import { useEffect, useState } from 'react'

const BabyShopApp = () => {
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState('baby')

  useEffect(() => {
    let apiUrl = category === 'baby'
      ? 'https://localhost:7081/api/v1/Shopping/baby-products'
      : 'https://localhost:7081/api/v1/Shopping/milk-products'

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error fetching products:', err))
  }, [category]) 

  return (
    <div className='min-h-screen mt-32 bg-gray-50'>
      {/* Hero Section */}
      <div className='container mx-auto px-4 flex flex-col md:flex-row items-center mt-8'>
        <div className='md:w-1/2 mb-8 md:mb-0'>
          <h1 className='text-4xl md:text-6xl font-bold text-gray-800 mb-4 leading-tight'>
            Nurturing Care for Every Stage
          </h1>
          <p className='text-gray-600 mb-6 text-lg'>
            Discover our carefully curated collection of premium baby and maternal care products.
          </p>
          <button className='bg-gradient-to-r from-[#A0D8EF] to-[#FFB6C1] text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300'>
            Shop Now
          </button>
        </div>
        <div className='md:w-1/2'>
          <img
            src='https://images.unsplash.com/photo-1555252333-9f8e92e65df9'
            alt='Mother and Baby'
            className='rounded-lg shadow-lg hover:scale-105 transition-transform duration-300'
          />
        </div>
      </div>

      {/* Category Selector */}
      <div className='container mx-auto px-4 flex justify-center mt-10'>
        <button
          className={`px-6 py-2 mx-2 rounded-full ${
            category === 'baby' ? 'bg-gradient-to-r from-[#A0D8EF] to-[#FFB6C1] text-white' : 'bg-gray-200'
          }`}
          onClick={() => setCategory('baby')}
        >
          Baby Products
        </button>
        <button
          className={`px-6 py-2 mx-2 rounded-full ${
            category === 'milk' ? 'bg-gradient-to-r from-[#A0D8EF] to-[#FFB6C1] text-white' : 'bg-gray-200'
          }`}
          onClick={() => setCategory('milk')}
        >
          Milk Products
        </button>
      </div>

      {/* Products Section */}
      <div className='container mx-auto px-4'>
        <h1 className='text-3xl font-semibold mt-16 text-black my-8 text-center'>
          {category === 'baby' ? 'Baby Products' : 'Milk Products'}
        </h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
          {products.map((product, index) => (
            <div
              key={index}
              className='bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow duration-300'
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className='w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform duration-300'
              />
              <h3 className='text-lg font-semibold text-gray-800 mt-4'>{product.name}</h3>
              <p className='text-gray-600 mt-2 text-sm'>{product.price}</p>
              <a
                href={product.productUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='text-[#ff6b81] border rounded-2xl p-2 mt-4 hover:text-black'
              >
                View Details
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BabyShopApp
