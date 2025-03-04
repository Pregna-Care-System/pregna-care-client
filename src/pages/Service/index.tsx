import ROUTES from '@/utils/config/routes'
import { useState } from 'react'
import { FaBabyCarriage, FaHeart, FaShoppingCart, FaChartLine, FaMoon, FaSun } from 'react-icons/fa'
import { MdLocalLibrary, MdShare } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

const MommyServicesPage = () => {
  const [activeTab, setActiveTab] = useState('babyNames')
  const navigate = useNavigate()
  const handleClick =(path)=> {
    navigate(path)
  }
  const services = [
    {
      id: 'babyname',
      title: 'Baby Name Generator',
      icon: <FaBabyCarriage className='text-3xl' />,
      description:
        'Discover meaningful names from different cultures, origins, and meanings. Get personalized suggestions based on your preferences.',
      image: 'https://res.cloudinary.com/dgzn2ix8w/image/upload/v1740464887/pregnaCare/vltpltxtbz4kg2bxiirc.jpg',
      gradient: 'from-pink-400/70 to-transparent',
      path: ROUTES.BABY_NAME
    },
    {
      id: 'entertainment',
      title: 'Mom Entertainment',
      icon: <MdLocalLibrary className='text-3xl' />,
      description:
        'Access a world of podcasts, articles, and videos created specifically for mothers. Stay informed and entertained during your journey.',
      image: 'https://res.cloudinary.com/dgzn2ix8w/image/upload/v1740465510/pregnaCare/fxxqzwxqdgk1ywi2wt0r.webp',
      gradient: 'from-purple-400/70 to-transparent'
    },
    {
      id: 'shopping',
      title: 'Baby Shopping',
      icon: <FaShoppingCart className='text-3xl' />,
      description:
        'Explore curated collections of baby essentials, compare prices, and read authentic reviews from other moms. Get the best value for your money.',
      image: 'https://res.cloudinary.com/dgzn2ix8w/image/upload/v1740464997/pregnaCare/rmh7lqtgura0cakywrtx.jpg',
      gradient: 'from-blue-400/70 to-transparent',
      path: ROUTES.BABY_SHOP
    },
    {
      id: 'tracking',
      title: 'Pregnancy Tracking',
      icon: <FaChartLine className='text-3xl' />,
      description:
        "Track your pregnancy milestones, baby's growth, and health metrics. Get weekly updates and personalized insights for a healthy pregnancy.",
      image: 'https://res.cloudinary.com/dgzn2ix8w/image/upload/v1740465340/pregnaCare/gpv5daup9ttchjp54kch.webp',
      gradient: 'from-green-400/70 to-transparent'
    }
  ]

  return (
    <div className={'min-h-screen transition-colors duration-300'}>
      <div className='container mx-auto px-4 py-8'>
        <header className='relative h-[400px] rounded-3xl overflow-hidden mb-12 bg-gradient-to-r from-purple-200 to-pink-200'>
          <div className='absolute inset-0 flex flex-col justify-center items-center text-white'>
            <h1 className='text-6xl font-bold animate-fade-in mb-4'>Mommy Services</h1>
            <p className='text-xl opacity-90'>Comprehensive care for every mom</p>
          </div>
        </header>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => {
                setActiveTab(service.id)
                handleClick(service.path)
              }}
              className={`relative p-6 rounded-2xl flex flex-col items-center text-center transition-all duration-300 overflow-hidden ${
                activeTab === service.id
                  ? 'bg-primary text-white transform scale-105'
                  : 'bg-white hover:bg-primary/5 dark:bg-dark-card'
              }`}
            >
              <div className='absolute inset-0 z-0'>
                <img src={service.image} alt={service.title} className='w-full h-full object-cover opacity-20' />
                <div className={`absolute inset-0 bg-gradient-to-t ${service.gradient}`} />
              </div>
              <div className='relative z-0'>
                <div className='text-4xl mb-4'>{service.icon}</div>
                <h3 className='text-xl font-bold mb-2'>{service.title}</h3>
                <p className='text-sm opacity-80 line-clamp-3'>{service.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MommyServicesPage
