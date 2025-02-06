import ROUTES from '@/utils/config/routes'
import React, { useState } from 'react'
import { FiBarChart2, FiBell, FiDollarSign, FiMenu, FiUsers, FiX } from 'react-icons/fi'
import { GoPerson } from 'react-icons/go'
import { useNavigate } from 'react-router-dom'

export default function MemberSidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [activeMenu, setActiveMenu] = useState('Mother Information')

  const menuItems = [
    {
      title: 'Mother Information',
      icon: <GoPerson size={20} />,
      path: ROUTES.MEMBER_DASHBOARD,
      action: () => console.log('Dashboard clicked')
    },
    {
      title: 'Tracking',
      icon: <FiDollarSign size={20} />,
      path: ROUTES.MEMBER_FETALGROWTHCHART,
      action: () => console.log('Transactions clicked')
    },
    {
      title: 'Fetal growth chart',
      icon: <FiUsers size={20} />,
      path: ROUTES.MEMBER_FETALGROWTHCHART,
      action: () => console.log('Members clicked')
    },
    {
      title: 'Mother status',
      icon: <FiBarChart2 size={20} />,
      path: ROUTES.MEMBER_FETALGROWTHCHART,
      action: () => console.log('Fetal Growth clicked')
    },
    {
      title: 'Notifications',
      icon: <FiBell size={20} />,
      path: ROUTES.MEMBER_FETALGROWTHCHART,
      action: () => console.log('Notifications clicked')
    }
  ]

  const navigate = useNavigate()

  const handleLogoClick = () => {
    navigate('/')
  }

  const handleMenuItemClick = (title: string, path: string) => {
    setActiveMenu(title)
    navigate(path)
  }

  return (
    <div className='relative'>
      <button
        className='lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-lg'
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed top-0 left-0 h-screen w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0`}
      >
        <div className='flex flex-col h-full'>
          <div className='p-6 border-b border-gray-200'>
            <div className='flex items-center justify-center space-x-3'>
              <img
                src='https://res.cloudinary.com/drcj6f81i/image/upload/v1736744602/PregnaCare/mgxvbwz2fggrx7brtjgo.svg'
                alt='logo'
                className='w-8 h-8 cursor-pointer'
                onClick={handleLogoClick}
              />
              <div>
                <span className='inline-block text-red-400 text-2xl font-bold'>PregnaCare</span>
                <span className='inline-block text-xs text-gray-400 mt-1 pl-0'>Modern Member Dashboard</span>
              </div>
            </div>
          </div>
          <nav className='flex-1 overflow-y-auto py-4'>
            <ul className='space-y-1 px-3'>
              {menuItems.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleMenuItemClick(item.title, item.path)}
                    className={`w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                      activeMenu === item.title ? 'bg-blue-100 text-blue-600' : ''
                    }`}
                    aria-label={item.title}
                  >
                    <span className='text-gray-500'>{item.icon}</span>
                    <span className='ml-3 font-medium'>{item.title}</span>
                  </button>
                </li>
              ))}
              !
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  )
}
