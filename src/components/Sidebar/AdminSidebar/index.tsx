import ROUTES from '@/utils/config/routes'
import { useEffect, useMemo, useState } from 'react'
import { FaMicroblog, FaTools } from 'react-icons/fa'
import { FiAlertCircle, FiDollarSign, FiHelpCircle, FiHome, FiPackage, FiType, FiUsers } from 'react-icons/fi'
import { MdEmail } from 'react-icons/md'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const SidebarWrapper = styled.div`
  height: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 107, 129, 0.1);
  box-shadow: 0 0 20px rgba(255, 107, 129, 0.05);

  .logo-section {
    padding: 1.5rem;
    border-bottom: 1px solid rgba(255, 107, 129, 0.1);
    background: white;

    .brand-name {
      background: linear-gradient(135deg, #ff6b81 0%, #ff8296 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .sub-text {
      color: #666;
      font-size: 0.75rem;
    }

    img {
      filter: none;
      transition: transform 0.2s ease;
    }

    &:hover img {
      transform: scale(1.05);
    }
  }

  .nav-item {
    position: relative;
    transition: all 0.3s ease;
    color: #666;
    margin: 0.25rem 0;

    &:hover {
      background: #fff1f3;
      color: #ff6b81;

      .nav-icon {
        color: #ff6b81;
      }
    }

    &.active {
      background: #fff1f3;
      color: #ff6b81;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        background: #ff6b81;
        border-radius: 0 4px 4px 0;
      }

      .nav-icon {
        color: #ff6b81;
      }

      .nav-text {
        color: #ff6b81;
        font-weight: 600;
      }
    }

    .nav-icon {
      color: #666;
      transition: color 0.3s ease;
    }

    .nav-text {
      color: #444;
      transition: color 0.3s ease;
      font-size: 0.9375rem;
    }
  }

  .footer {
    padding: 1rem;
    color: #666;
    font-size: 0.75rem;
    border-top: 1px solid rgba(255, 107, 129, 0.1);
    background: white;
  }

  nav {
    background: rgba(255, 255, 255, 0.95);
  }
`

const MenuToggle = styled.button`
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 50;
  padding: 0.5rem;
  background: white;
  border-radius: 0.375rem;
  border: 1px solid rgba(255, 107, 129, 0.2);
  color: #ff6b81;
  transition: all 0.3s ease;
  display: none;
  box-shadow: 0 2px 8px rgba(255, 107, 129, 0.1);

  &:hover {
    background: #fff1f3;
    transform: scale(1.05);
  }

  @media (max-width: 1024px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

interface AdminSidebarProps {
  isOpen: boolean
  onToggle: () => void
}

const AdminSidebar = ({ isOpen, onToggle }: AdminSidebarProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = useMemo(
    () => [
      {
        title: 'Dashboard',
        icon: <FiHome size={20} />,
        path: ROUTES.ADMIN.DASHBOARD
      },
      {
        title: 'Transaction',
        icon: <FiDollarSign size={20} />,
        path: ROUTES.ADMIN.TRANSACTION
      },
      {
        title: 'Member Management',
        icon: <FiUsers size={20} />,
        path: ROUTES.ADMIN.MEMBER
      },
      {
        title: 'Membership Plans',
        icon: <FiPackage size={20} />,
        path: ROUTES.ADMIN.MEMBERSHIP_PLAN
      },
      {
        title: 'Growth Metrics',
        icon: <FiPackage size={20} />,
        path: ROUTES.ADMIN.GROWTHMETRICS
      },
      { title: 'Feature', icon: <FaTools size={20} />, path: ROUTES.ADMIN.FEATURE },
      { title: 'Reminder Type', icon: <FiType size={20} />, path: ROUTES.ADMIN.REMINDER_TYPE },
      { title: 'Feedback', icon: <FiAlertCircle size={20} />, path: ROUTES.ADMIN.FEEDBACK },
      { title: 'Blog Management', icon: <FaMicroblog size={20} />, path: ROUTES.ADMIN.BLOG },
      {
        title: 'Contact Subscriber',
        icon: <MdEmail size={20} />,
        path: ROUTES.ADMIN.CONTACT
      },
      { title: 'FAQ', icon: <FiHelpCircle size={20} />, path: ROUTES.ADMIN.FAQ }
    ],
    []
  )

  const getCurrentMenuFromPath = useMemo(
    () => (path: string) => {
      const menuItem = menuItems.find((item) => item.path === path)
      return menuItem ? menuItem.title : 'Mother Information'
    },
    [menuItems]
  )

  const [activeMenu, setActiveMenu] = useState(getCurrentMenuFromPath(location.pathname))

  useEffect(() => {
    setActiveMenu(getCurrentMenuFromPath(location.pathname))
  }, [location.pathname, getCurrentMenuFromPath])

  const handleLogoClick = () => {
    navigate('/')
  }

  const handleMenuItemClick = (title: string, path: string) => {
    setActiveMenu(title)
    navigate(path)
    if (window.innerWidth < 1024) {
      onToggle()
    }
  }

  return (
    <SidebarWrapper>
      <MenuToggle onClick={onToggle} aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          {isOpen ? (
            <>
              <line x1='18' y1='6' x2='6' y2='18' />
              <line x1='6' y1='6' x2='18' y2='18' />
            </>
          ) : (
            <>
              <line x1='3' y1='12' x2='21' y2='12' />
              <line x1='3' y1='6' x2='21' y2='6' />
              <line x1='3' y1='18' x2='21' y2='18' />
            </>
          )}
        </svg>
      </MenuToggle>

      <div className='flex flex-col h-full'>
        <div className='logo-section'>
          <div className='flex items-center justify-center space-x-3 cursor-pointer' onClick={handleLogoClick}>
            <img
              src='https://res.cloudinary.com/drcj6f81i/image/upload/v1736744602/PregnaCare/mgxvbwz2fggrx7brtjgo.svg'
              alt='logo'
              className='w-8 h-8'
            />
            <div className='flex flex-col'>
              <span className='brand-name text-2xl'>PregnaCare</span>
              <span className='sub-text'>Modern Admin Dashboard</span>
            </div>
          </div>
        </div>

        <nav className='flex-1 overflow-y-auto py-4 overflow-y-auto scrollbar-custom'>
          <ul className='space-y-1 px-3'>
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => handleMenuItemClick(item.title, item.path)}
                  className={`nav-item w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ease-in-out ${
                    activeMenu === item.title ? 'active' : ''
                  }`}
                  aria-label={item.title}
                >
                  <span className='nav-icon'>{item.icon}</span>
                  <span className='nav-text ml-3'>{item.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className='footer text-center'>
          <p>PregnaCare © 2025</p>
        </div>
      </div>
    </SidebarWrapper>
  )
}

export default AdminSidebar
