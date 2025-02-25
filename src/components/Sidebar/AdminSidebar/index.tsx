import ROUTES from '@/utils/config/routes'
import { useState } from 'react'
import {
  // FiBarChart2,
  // FiBell,
  FiDollarSign,
  // FiHelpCircle,
  FiHome,
  FiMenu,
  FiPackage,
  FiUsers,
  // FiPackage,
  // FiUsers,
  FiX
} from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [activeMenu, setActiveMenu] = useState('Dashboard')

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <FiHome size={20} />,
      path: ROUTES.ADMIN.DASHBOARD,
      action: () => console.log('Dashboard clicked')
    },
    {
      title: 'Transaction',
      icon: <FiDollarSign size={20} />,
      path: ROUTES.ADMIN.TRANSACTION,
      action: () => console.log('Transactions clicked')
    },
    {
      title: 'Member Management',
      icon: <FiUsers size={20} />,
      path: ROUTES.ADMIN.MEMBER,
      action: () => console.log('Members clicked')
    },
    {
      title: 'Membership Plans',
      icon: <FiPackage size={20} />,
      path: ROUTES.ADMIN.MEMBERSHIP_PLAN,
      action: () => console.log('Plans clicked')
    },
    {
      title: 'Growth Metrics',
      icon: <FiPackage size={20} />,
      path: ROUTES.ADMIN.GROWTHMETRICS,
      action: () => console.log('Plans clicked')
    }
    // { title: 'Notifications', icon: <FiBell size={20} />, action: () => console.log('Notifications clicked') },
    // { title: 'FAQ', icon: <FiHelpCircle size={20} />, action: () => console.log('FAQ clicked') }
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
        className='fixed top-4 left-52 z-50 p-2 bg-red-100 rounded-md shadow-lg'
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 z-40`}
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
                <span className='inline-block text-xs text-gray-400 mt-1 pl-0'>Modern Admin Dashboard</span>
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
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  )
}

export default AdminSidebar
